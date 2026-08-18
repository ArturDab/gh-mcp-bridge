// Agent eksploracyjny do wykrywania usterek - warstwa 2 (rozszerzenie
// checklista-gotowe.md), NIE zamiennik przegladu na zywym preview (warstwa 3:
// estetyka/kompozycja/sens tresci - to zostaje po stronie czlowieka).
//
// Zglasza WYLACZNIE usterki sprawdzalne kodem:
//   - elementy klikalne bez zadnej reakcji
//   - bledy konsoli przegladarki
//   - zapytania sieciowe 4xx/5xx
//   - widoki zawieszone w stanie ladowania >10s (domyslnie)
//   - linki do widokow, ktorych routing nie rozpoznaje
//   - pulapki klawiatury (Tab utykajacy na jednym elemencie)
//   - elementy interaktywne bez widocznego stanu focus
//
// Wszystko, co zalezy od konkretnego projektu (adres bazowy, lista widokow, wzorce
// akcji kosztownych, selektory logowania, nazwy zmiennych srodowiskowych) wchodzi z
// pliku konfiguracyjnego (bug-scan.config.json), NIE z kodu. Zobacz
// bug-scan.config.example.json i SKILL.md.
//
// Uzycie: node scripts/bug-scan.js --base=https://... [--config=bug-scan.config.json]
//         [--login=... --password=...] [--widths=1440,390] [--routes=a,b/c] [--out=plik.md]
//         [--include-costly]
'use strict';
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const { resolveChrome } = require('./chrome-resolver');

const DEFAULT_WIDTHS = [1440, 390];
const DEFAULT_STUCK_LOADING_MS = 10000;
const STUCK_POLL_MS = 400;
const CLICK_WAIT_MS = 450;
const DEFAULT_NETWORK_IDLE_TIMEOUT_MS = 2000;
const MAX_TAB_STEPS = 70;
const TRAP_REPEAT_THRESHOLD = 4;
const DEFAULT_MAX_ELEMENTS_PER_ROUTE = 500;

// Domyslny wzorzec akcji kosztownych (generowanie/wysylka/webhook/wylogowanie) -
// bezpieczny punkt startowy zanim ktos dostroi go do wlasnego projektu w configu.
// Nigdy nie klikany bez jawnego --include-costly, zawsze wypisywany w raporcie.
const DEFAULT_COSTLY_TEXT_PATTERN =
  '\\b(generate|generuj|send to production|wy[sś]lij na produkcj|deploy|publish|publikuj|' +
  'webhook|log ?out|wyloguj|delete permanently|usu[nń] na sta[lł]e|pay|zap[lł]a[cć]|charge|' +
  'purchase|subscribe|subskrybuj)\\b';

const INTERACTIVE_SELECTOR = [
  'a[href]', 'button', 'input:not([type=hidden])', 'select', 'textarea',
  '[role="button"]', '[role="link"]', '[role="menuitem"]', '[role="tab"]',
  '[role="checkbox"]', '[role="switch"]', '[onclick]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// ---------- konfiguracja ----------

function loadConfig(configPath) {
  const candidate = configPath || (fs.existsSync('bug-scan.config.json') ? 'bug-scan.config.json' : null);
  if (!candidate) return { source: null, data: {} };
  const raw = fs.readFileSync(candidate, 'utf8');
  return { source: candidate, data: JSON.parse(raw) };
}

function buildOptions(cliArgs, config) {
  const cfg = config.data || {};
  const widths = cliArgs.widths
    ? cliArgs.widths.split(',').map((n) => parseInt(n, 10))
    : (cfg.widths || DEFAULT_WIDTHS);
  const routesFromCli = cliArgs.routes
    ? cliArgs.routes.split(',').map((s) => s.trim()).filter(Boolean)
    : null;

  const credentialsEnv = Object.assign({ login: 'BUGSCAN_LOGIN', password: 'BUGSCAN_PASSWORD' }, cfg.credentialsEnv || {});
  const costlyPattern = cliArgs['include-costly'] ? null : new RegExp(cfg.costlyTextPattern || DEFAULT_COSTLY_TEXT_PATTERN, 'i');

  return {
    appName: cfg.appName || 'aplikacja',
    base: cliArgs.base || cfg.baseUrl || null,
    widths,
    routesFromCli,
    routesConfig: cfg.routes || {},
    stuckLoadingMs: cfg.stuckLoadingMs || DEFAULT_STUCK_LOADING_MS,
    maxElementsPerRoute: cfg.maxElementsPerRoute || DEFAULT_MAX_ELEMENTS_PER_ROUTE,
    clickWaitMs: cfg.clickWaitMs || CLICK_WAIT_MS,
    networkIdleTimeoutMs: cfg.networkIdleTimeoutMs || DEFAULT_NETWORK_IDLE_TIMEOUT_MS,
    includeCostly: !!cliArgs['include-costly'],
    costlyPattern,
    login: cfg.login || null,
    selfNavPattern: cfg.selfNavPattern ? new RegExp(cfg.selfNavPattern) : null,
    credentials: {
      login: cliArgs.login || process.env[credentialsEnv.login] || null,
      password: cliArgs.password || process.env[credentialsEnv.password] || null,
    },
    credentialsEnvNames: credentialsEnv,
    outFile: cliArgs.out || path.join(process.cwd(), '.bugscan', 'report.md'),
    quiet: !!cliArgs.quiet,
    configSource: config.source,
  };
}

// ---------- stan strony: konsola / siec / bledy JS ----------

function attachListeners(page, sink) {
  const onConsole = (msg) => { if (msg.type() === 'error') sink.console.push({ text: msg.text() }); };
  const onPageError = (err) => { sink.pageErrors.push({ text: String((err && err.message) || err) }); };
  const onResponse = (res) => {
    let status;
    try { status = res.status(); } catch (e) { return; }
    let method = '';
    try { method = res.request().method(); } catch (e) {}
    // sink.requests: KAZDA odpowiedz (do wykrycia "cos sie stalo" - klik wywolal
    // zapytanie, nawet udane). sink.network: WYLACZNIE bledy 4xx/5xx (do klasyfikacji).
    sink.requests.push({ url: res.url(), status, method });
    if (status >= 400) sink.network.push({ url: res.url(), status, method });
  };
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('response', onResponse);
  return () => {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
    page.off('response', onResponse);
  };
}

// "route" moze byc pusty (skanuj sam root), sciezka URL zaczynajaca sie od "/"
// (aplikacje bez hash-routingu, np. wiele oddzielnych stron/adresow), albo goly
// fragment bez prefiksu - wtedy zakladamy konwencje hash-routingu (#fragment),
// najczestsza w prostych SPA jednoplikowych.
function routeToPath(route) {
  if (!route) return '/';
  if (route.charAt(0) === '/' || route.charAt(0) === '#') return route;
  return '#' + route;
}

// Zwraca komunikat bledu, jesli nawigacja sie nie powiodla (adres bazowy nieosiagalny,
// timeout, DNS) - albo null, jesli widok realnie sie zaladowal. Polykanie tych bledow
// (jak wczesniej) pozwalaloby skanowi kontynuowac na pustej/poprzedniej stronie i
// zaraportowac "0 usterek, 100% pokrycia" dla widoku, ktorego NIGDY nie zobaczyl -
// dokladnie ten rodzaj falszywie czystego wyniku, przed ktorym ma chronic cala reszta
// tego mechanizmu.
async function gotoRoute(page, base, route) {
  const url = base + routeToPath(route);
  let error = null;
  // Reachability = domcontentloaded, NIE networkidle. Aplikacje z ciaglym ruchem w tle
  // (odpytywanie na zywo, dlugie polaczenia, websocket-fallback) NIGDY nie osiagaja
  // "cichej sieci" - gdyby to byl warunek powodzenia nawigacji, kazdy taki (dzialajacy!)
  // projekt wygladalby na "widok sie nie zaladowal" i caly skan by sie nie odbyl.
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Odpowiedz HTTP 4xx/5xx NIE rzuca wyjatku - Playwright uznaje ja za "udana"
    // nawigacje (strona bledu tez jest strona). Bez tego sprawdzenia skaner klikalby
    // po tresci strony bledu i mogl zaraportowac ja jako czysty widok bez usterek.
    if (res && res.status() >= 400) error = 'HTTP ' + res.status() + ' przy ladowaniu widoku';
  } catch (e) {
    error = String(e && e.message || e);
  }
  if (!error) {
    try {
      const res = await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
      if (res && res.status() >= 400) error = 'HTTP ' + res.status() + ' przy przeladowaniu widoku';
    } catch (e) {
      error = String(e && e.message || e);
    }
  }
  // Cichniecie sieci to juz tylko najlepszy wysilek (krotszy, ograniczony czas) - jego
  // brak NIE unicestwia skanu, w odroznieniu od powyzszego (DOM naprawde sie nie zaladowal).
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.evaluate(() => (window.document.fonts ? document.fonts.ready : null)).catch(() => {});
  await page.waitForTimeout(350);
  return error;
}

// ---------- widoki zawieszone w ladowaniu ----------

async function checkStuckLoading(page, thresholdMs) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const stillLoading = await page.evaluate(() => {
      var re = /^(Ładowanie|Wczytywanie|Loading)/i;
      var all = document.querySelectorAll('body *');
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.children.length) continue; // tylko liscie - unikamy dopasowania kontenerow-rodzicow
        var t = (el.textContent || '').trim();
        if (t && re.test(t)) {
          var r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) return t.slice(0, 80);
        }
      }
      return null;
    }).catch(() => null);
    if (!stillLoading) return null;
    if (Date.now() - start >= thresholdMs) return stillLoading;
    await page.waitForTimeout(STUCK_POLL_MS);
  }
}

// ---------- wyliczenie elementow interaktywnych ----------

async function collectInteractiveDescriptors(page, selector, max) {
  return page.evaluate(({ selector, max }) => {
    function cssPath(el) {
      if (el.id) return '#' + CSS.escape(el.id);
      var parts = [];
      var node = el;
      var depth = 0;
      // Bez sztywnego limitu glebokosci - w repotowanych kartach/wierszach (typowe w
      // realnych aplikacjach, > 6 poziomow zagniezdzenia nie jest rzadkoscia) obciecie
      // po 6 poziomach potrafi wyprodukowac IDENTYCZNA sciezke dla dwoch roznych
      // elementow (np. przycisku "Edytuj" w dwoch roznych wierszach listy) - dokladnie
      // ta sama klasa bledu, przed ktora ta funkcja ma chronic (patrz "Historia" w
      // SKILL.md). Zamiast limitu glebokosci: idziemy w gore, dopoki nie trafimy na
      // przodka z id (unikalnym z definicji) albo na korzen dokumentu - to gwarantuje
      // unikalnosc sciezki, kosztem dluzszego zapisu w rzadkich przypadkach.
      while (node && node.nodeType === 1) {
        if (node !== el && node.id) { parts.unshift('#' + CSS.escape(node.id)); break; }
        var part = node.tagName.toLowerCase();
        var parent = node.parentElement;
        if (parent) {
          var same = Array.prototype.filter.call(parent.children, function (c) { return c.tagName === node.tagName; });
          if (same.length > 1) part += ':nth-of-type(' + (same.indexOf(node) + 1) + ')';
        }
        parts.unshift(part);
        node = parent;
        depth++;
        if (depth > 200) break; // zabezpieczenie przed patologicznie glebokim/cyklicznym drzewem
      }
      return parts.join(' > ');
    }
    // Petla NIE przerywa sie na kapslu (out.length<max) - inaczej "visibleFound" liczy
    // tylko to, co zdazylismy sprawdzic przed napotkaniem kapsla, i falszywie zanizalby
    // pokrycie o elementy niewidoczne/wylaczone lezace DALEJ w DOM (ktore i tak nigdy
    // nie mialy byc klikniete - to nie jest "obciecie", tylko normalne odfiltrowanie).
    var els = Array.prototype.slice.call(document.querySelectorAll(selector));
    var out = [];
    var visibleFound = 0;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var rect = el.getBoundingClientRect();
      var style = getComputedStyle(el);
      var visible = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      if (!visible) continue;
      if (el.disabled) continue;
      // el.disabled to wlasciwosc natywna (button/input/...) - kontrolki wlasnej
      // roboty (np. <div role="button" aria-disabled="true">) jej nie maja, mimo ze
      // sa jawnie wylaczone; bez tego skaner klikalby je i zglaszal "brak reakcji"
      // dla czegos, co ma nie reagowac z definicji.
      if (el.getAttribute('aria-disabled') === 'true') continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      visibleFound++;
      if (out.length >= max) continue;
      var href = el.getAttribute('href');
      // Rozwiazanie hrefa przez URL() (nie porownanie tekstu) obsluguje kazda
      // zapisana forme linku tej samej domeny jednakowo: wzgledny bez ukosnika
      // ("dalej"), wzgledny z "./", z parametrami zapytania, albo pelny adres
      // (https://ta-sama-domena/...) - wszystkie daja ta sama sciezke po rozwiazaniu.
      var sameOrigin = null;
      var linkPath = null;
      if (el.tagName.toLowerCase() === 'a' && href) {
        try {
          var u = new URL(href, location.href);
          sameOrigin = u.origin === location.origin;
          // sciezka + zapytanie razem - aplikacje wybierajace widok przez ?parametr
          // (np. "?view=users") maja identyczna sciezke dla kazdego widoku, wiec samo
          // pathname nie odroznia ich miedzy soba (patrz routes.static w configu, ktore
          // rowniez moga zapisywac widok jako pelny "/?parametr").
          linkPath = u.pathname + u.search;
        } catch (e) { sameOrigin = null; }
      }
      // Zwykly link do fragmentu dokumentu ("#opis" przewijajacy do <div id="opis">")
      // to NIE trasa SPA - istniejacy element o tym id na stronie odroznia go od
      // hasha, ktory faktycznie mial otworzyc widok, ktorego routing nie rozpoznaje.
      var fragmentTargetExists = false;
      if (href && href.charAt(0) === '#' && href.length > 1) {
        fragmentTargetExists = !!document.getElementById(href.slice(1));
      }
      out.push({
        index: i,
        sel: cssPath(el),
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || el.value || '').trim().slice(0, 70),
        href: href,
        sameOrigin: sameOrigin,
        linkPath: linkPath,
        fragmentTargetExists: fragmentTargetExists,
        type: el.getAttribute('type'),
        role: el.getAttribute('role'),
        id: el.id || null,
        onclick: el.getAttribute('onclick'),
      });
    }
    return { descriptors: out, totalFound: visibleFound };
  }, { selector, max });
}

function isExternalNav(d) {
  if (d.tag !== 'a') return false;
  var href = d.href;
  if (href == null) return false;
  if (href === '' || href === '#') return false;
  if (href.charAt(0) === '#') return false;
  if (/^javascript:/i.test(href)) return false;
  // Link tej samej domeny (aplikacje z routingiem po sciezce URL, nie tylko po hashu -
  // patrz routeToPath) to nawigacja WEWNATRZ aplikacji, nie "poza nia" - klikamy go,
  // zeby zlapac martwe/404 linki miedzy widokami. sameOrigin===null (nie dalo sie
  // rozstrzygnac) zachowuje sie konserwatywnie jak wczesniej: traktuj jako zewnetrzny.
  if (d.sameOrigin === true) return false;
  return true; // cross-origin (http(s)/mailto/tel) -> nawigacja poza aplikacje, nie klikamy
}

function isCostly(d, costlyPattern) {
  if (!costlyPattern) return false;
  return costlyPattern.test(d.text || '');
}

// ---------- klikniecie i obserwacja reakcji ----------

function fingerprintInPage() {
  var openEls = document.querySelectorAll('.open,.show,[aria-expanded="true"],[open]').length;
  var toastEl = document.getElementById('errEl') || document.getElementById('toast');
  return {
    hash: location.hash,
    // Kontrolka moze nawigowac przez history.pushState/replaceState (typowy wzorzec
    // przyciskow w SPA, nie tylko linkow <a>) zmieniajac WYLACZNIE sciezke/zapytanie -
    // bez tych dwoch pol taka nawigacja jest niewidoczna dla porownania przed/po i
    // klik wychodzi jako falszywy "brak reakcji", mimo ze realnie przeniosl na inny widok.
    pathname: location.pathname,
    search: location.search,
    title: document.title,
    textLen: (document.body.innerText || '').length,
    openEls: openEls,
    toast: !!(toastEl && toastEl.className && toastEl.className.indexOf('show') >= 0),
    bodyCls: document.body.className || '',
    // Pozycja na ekranie odroznia dwa elementy tego samego typu bez id (np. nowy
    // wiersz linku dopisany obok istniejacego) - samo tag+id myli je w jeden napis.
    activeSig: (function () {
      var el = document.activeElement;
      if (!el || el === document.body) return null;
      var r = el.getBoundingClientRect();
      // toUpperCase() - el.tagName na elemencie SVG zachowuje oryginalna (mala) wielkosc
      // liter ("svg"), w odroznieniu od HTML gdzie tagName jest zawsze duzymi literami.
      // Bez normalizacji prefiks "SVG#..." budowany z d.tag (patrz classifyClick) nigdy
      // nie pasuje do "svg#..." tutaj, wiec klikniety element SVG, ktory przejmuje
      // WLASNY fokus (normalne zachowanie kazdego fokusowalnego elementu po kliknieciu),
      // wygladalby na "fokus przeniosl sie GDZIE INDZIEJ" - falszywa reakcja maskujaca
      // martwy element.
      return el.tagName.toUpperCase() + '#' + (el.id || '') + '@' + Math.round(r.top) + ',' + Math.round(r.left);
    })(),
  };
}

async function elAttrs(loc) {
  try {
    return await loc.evaluate((el) => ({
      // getAttribute, NIE el.className - na elemencie SVG (np. interaktywna ikona z
      // [role="button"]) el.className jest obiektem SVGAnimatedString, nie stringiem;
      // porownanie dwoch takich obiektow w attrsChanged() zawsze wychodzi jako "rozne",
      // nawet gdy nic sie nie zmienilo, co maskuje realny brak reakcji.
      cls: el.getAttribute('class') || '',
      text: (el.textContent || el.value || '').trim().slice(0, 60),
      expanded: el.getAttribute('aria-expanded'),
      checked: el.getAttribute('aria-checked') !== null ? el.getAttribute('aria-checked') : (el.checked !== undefined ? String(el.checked) : null),
      selected: el.getAttribute('aria-selected'),
      current: el.getAttribute('aria-current'),
      value: el.value !== undefined ? el.value : null,
    }));
  } catch (e) {
    return null;
  }
}

async function clickAndObserve(page, loc, sink, clickWaitMs, networkIdleTimeoutMs) {
  const netBefore = sink.network.length;
  const reqBefore = sink.requests.length;
  const consoleBefore = sink.console.length;
  const pageErrBefore = sink.pageErrors.length;
  const before = await page.evaluate(fingerprintInPage).catch(() => null);
  const attrsBefore = await elAttrs(loc);

  let dialogInfo = null;
  const onDialog = async (d) => { dialogInfo = { type: d.type(), message: d.message() }; try { await d.dismiss(); } catch (e) {} };
  let popupUrl = null;
  const onPopup = async (p) => { try { popupUrl = p.url(); await p.close(); } catch (e) {} };
  page.once('dialog', onDialog);
  page.once('popup', onPopup);

  let clickError = null;
  try {
    await loc.scrollIntoViewIfNeeded({ timeout: 2000 });
    await loc.click({ timeout: 3000 });
  } catch (e) {
    clickError = String(e && e.message || e);
  }
  await page.waitForTimeout(clickWaitMs || CLICK_WAIT_MS);
  // Okno obserwacji nie zamyka sie po samym stalym czasie - jesli klik wywolal
  // zapytanie sieciowe, ktore jeszcze trwa (wolny backend, LLM, zewnetrzne API),
  // dajemy mu dodatkowy czas na dojechanie, zanim uznamy klik za "bez reakcji" albo
  // przypiszemy jego odpowiedz do NASTEPNEGO klikniecia w petli. Rozwiazuje sie
  // szybciej niz timeout, jesli siec juz jest cicha - nie spowalnia szybkich klikow.
  await page.waitForLoadState('networkidle', { timeout: networkIdleTimeoutMs || DEFAULT_NETWORK_IDLE_TIMEOUT_MS }).catch(() => {});
  page.removeListener('dialog', onDialog);
  page.removeListener('popup', onPopup);

  const after = await page.evaluate(fingerprintInPage).catch(() => before);
  const attrsAfter = clickError ? attrsBefore : await elAttrs(loc);

  return {
    clickError,
    before, after,
    attrsBefore, attrsAfter,
    netDuring: sink.network.slice(netBefore),
    requestsDuring: sink.requests.slice(reqBefore),
    consoleDuring: sink.console.slice(consoleBefore),
    pageErrDuring: sink.pageErrors.slice(pageErrBefore),
    dialogInfo, popupUrl,
  };
}

function fpChanged(before, after) {
  if (!before || !after) return true;
  return before.hash !== after.hash || before.pathname !== after.pathname || before.search !== after.search ||
    before.title !== after.title ||
    before.textLen !== after.textLen || before.openEls !== after.openEls || before.toast !== after.toast ||
    before.bodyCls !== after.bodyCls;
}
function attrsChanged(a, b) {
  if (!a || !b) return a !== b;
  return a.cls !== b.cls || a.text !== b.text || a.expanded !== b.expanded || a.checked !== b.checked ||
    a.selected !== b.selected || a.current !== b.current || a.value !== b.value;
}

const ACTIVE_STATE_PATTERN = /\b(active|is-active|selected|is-selected|current|on)\b/i;
function looksAlreadyActive(attrs) {
  if (!attrs) return false;
  return ACTIVE_STATE_PATTERN.test(attrs.cls || '') || attrs.selected === 'true' || !!attrs.current;
}

// Niektore aplikacje rutuja przez wywolanie JS w inline onclick (np. showView('modul'))
// i element, ktorego wlasny cel routingu to widok biezacy, jest linkiem "na siebie"
// (logo marki na stronie, na ktorej juz jestesmy). Brak reakcji tam bywa oczekiwany,
// nie usterka. Wylaczone domyslnie - wlacza sie przez config.selfNavPattern (regex z
// jedna grupa przechwytujaca nazwe celu, np. "show(?:Mod|Pub)\\('([^']+)'\\)").
function navigatesToCurrentModule(d, route, selfNavPattern) {
  if (!selfNavPattern || !d.onclick) return false;
  const m = selfNavPattern.exec(d.onclick);
  if (!m) return false;
  const currentModule = route.indexOf('/') >= 0 ? route.split('/')[1] : route;
  return m[1] === currentModule;
}

function classifyClick(d, route, width, result, knownRoutes, selfNavPattern) {
  const out = [];
  if (result.clickError) return out; // element nieklikalny (przykryty itp.) - nie oceniamy, nie liczymy jako "brak reakcji"

  const serverErrors = result.netDuring.filter((n) => n.status >= 500);
  const clientErrors = result.netDuring.filter((n) => n.status >= 400 && n.status < 500);
  // Obliczone WCZESNIEJ (nie w ciele galezi nizej), zeby galaz linku po sciezce mogla
  // sama zdecydowac, czy w ogole ma cos zglosic - link do ZNANEGO widoku, ktory nie
  // wywolal ZADNEJ reakcji (przerwane/zepsute klikniecie, zero zapytan sieciowych),
  // ma spasc do ogolnego sprawdzenia "brak reakcji" nizej, a nie zniknac po cichu
  // tylko dlatego, ze ta galaz go "zajela" i nic nie zglosila.
  const pathLinkTarget = (d.tag === 'a' && d.href && d.href.charAt(0) !== '#' && d.sameOrigin === true && d.linkPath)
    ? d.linkPath : null;
  // '' (sentinel widoku-korzenia bez routingu, patrz discoverRoutes) i '/' (normalny
  // link "Strona glowna") to TEN SAM widok - bez tego zwykly link Home na aplikacji
  // jednostronicowej zawsze wychodzilby jako "cel spoza listy skanowanych widokow".
  const pathLinkKnown = !!(knownRoutes && (
    knownRoutes.indexOf(pathLinkTarget) >= 0 ||
    (pathLinkTarget === '/' && knownRoutes.indexOf('') >= 0)
  ));
  const pathLinkUnknown = pathLinkTarget !== null && !pathLinkKnown;
  // Pole tekstowe/select, ktore po kliknieciu realnie przejelo fokus, dostalo swoja
  // jedyna oczekiwana reakcje - w odroznieniu od przycisku (kazdy klikniety przycisk
  // i tak przejmuje fokus, wiec to samo kryterium dla <button> maskowaloby martwe guziki).
  // activeSig niesie tag+id+pozycje (patrz fingerprintInPage) - do porownania "czy to
  // klikniety element" wystarczy prefiks tag+id, pozycja jest tam wylacznie po to, zeby
  // odroznic DWA rozne elementy bez id (ponizej, focusMovedElsewhere).
  const clickedElPrefix = d.tag.toUpperCase() + '#' + (d.id || '') + '@';
  const focusIsReaction = (d.tag === 'input' || d.tag === 'textarea' || d.tag === 'select') &&
    result.after && result.after.activeSig && result.after.activeSig.indexOf(clickedElPrefix) === 0;
  // Klik moze dopisac NOWY element (np. kolejny wiersz linku) i przeniesc na niego
  // fokus - to realna reakcja, ale inna niz "przycisk przejal fokus sam na siebie"
  // (co dzieje sie przy KAZDYM kliku i nie liczy sie jako sygnal). Roznica: fokus
  // wyladowal na czyms INNYM niz klikniety element.
  const focusMovedElsewhere = result.before && result.after && result.after.activeSig &&
    result.after.activeSig !== result.before.activeSig && result.after.activeSig.indexOf(clickedElPrefix) !== 0;
  const hadReaction = !!result.dialogInfo || !!result.popupUrl || focusIsReaction || focusMovedElsewhere ||
    fpChanged(result.before, result.after) || attrsChanged(result.attrsBefore, result.attrsAfter) ||
    result.requestsDuring.length > 0;

  const where = { route, width, element: d.sel, tag: d.tag, text: d.text };

  if (serverErrors.length) {
    out.push({ severity: 1, category: 'siec-5xx', ...where,
      summary: 'Zapytanie sieciowe zakonczone bledem serwera (5xx)',
      how: 'Na widoku "' + route + '" (' + width + 'px) kliknij "' + (d.text || d.sel) + '" (' + d.sel + ') - ' +
        serverErrors.map((n) => n.method + ' ' + n.url + ' -> ' + n.status).join('; ') });
  }
  if (clientErrors.length) {
    out.push({ severity: 3, category: 'siec-4xx', ...where,
      summary: 'Zapytanie sieciowe zakonczone bledem klienta (4xx)',
      how: 'Na widoku "' + route + '" (' + width + 'px) kliknij "' + (d.text || d.sel) + '" (' + d.sel + ') - ' +
        clientErrors.map((n) => n.method + ' ' + n.url + ' -> ' + n.status).join('; ') });
  }
  if (result.consoleDuring.length || result.pageErrDuring.length) {
    const msgs = result.consoleDuring.concat(result.pageErrDuring).map((m) => m.text).slice(0, 3).join(' | ');
    out.push({ severity: 1, category: 'blad-konsoli', ...where,
      summary: 'Blad w konsoli przegladarki po kliknieciu',
      how: 'Na widoku "' + route + '" (' + width + 'px) kliknij "' + (d.text || d.sel) + '" (' + d.sel + ') - konsola: ' + msgs });
  }

  // Link hashowy do widoku, ktorego routing nie rozpoznaje: hash sie zmienil,
  // ale nic w tresci strony sie nie poruszylo, a cel nie jest znanym widokiem.
  // Wyklucza zwykle linki do fragmentu dokumentu (istnieje pasujacy element o tym id
  // gdzies na stronie) - to nie jest trasa SPA, tylko normalne przewijanie do miejsca.
  if (d.tag === 'a' && d.href && d.href.charAt(0) === '#' && !d.fragmentTargetExists &&
      result.before && result.after &&
      result.before.hash !== result.after.hash && result.before.textLen === result.after.textLen &&
      result.before.openEls === result.after.openEls) {
    // d.href PORONYWANY WPROST (nie stripowany) - knownRoutes teraz konsekwentnie
    // niesie wiodacy "#" dla widokow hashowych (patrz canonicalizeRoute), wiec "#one"
    // z markupu ma pasowac do "#one" na liscie, nie do "one" bez prefiksu.
    const known = knownRoutes && knownRoutes.indexOf(d.href) >= 0;
    out.push({ severity: known ? 4 : 2, category: 'link-donikad', ...where,
      uncertain: !!known,
      summary: known
        ? 'Link zmienia adres, ale zawartosc widoku wyglada identycznie (mogl nie doladowac danych)'
        : 'Link prowadzi do widoku spoza rozpoznanego routingu (hash zmieniony, ekran sie nie zmienil)',
      how: 'Na widoku "' + route + '" (' + width + 'px) kliknij "' + (d.text || d.sel) + '" (' + d.sel + '), cel: ' + d.href });
  } else if (pathLinkUnknown && !serverErrors.length && !clientErrors.length) {
    // Link tej samej domeny do sciezki spoza listy skanowanych widokow. Aplikacje SPA
    // z routingiem po sciezce czesto maja na serwerze fallback "kazda nieznana sciezka
    // -> 200 + ta sama powloka" (zeby dzialalo odswiezenie strony w dowolnym miejscu) -
    // wtedy zwykly check sieci 4xx/5xx NIC nie zlapie, bo odpowiedz jest poprawna, mimo
    // ze cel jest nierozpoznany. Zawsze niepewne (nie pewna usterka): lista skanowanych
    // widokow bywa celowo niepelna (patrz routes.static w configu), wiec "nieznany" tu
    // znaczy "nie na liscie do skanu", niekoniecznie "nie istnieje naprawde".
    //
    // Warunek tej galezi to WYLACZNIE "cel nieznany" (pathLinkUnknown, liczony wyzej,
    // przed if/else-if) - link do ZNANEGO widoku, ktory mimo to nie wywolal zadnej
    // reakcji (przerwane/zepsute klikniecie), NIE wchodzi tutaj i spada do ogolnego
    // sprawdzenia "brak reakcji" nizej, zamiast zniknac po cichu jako "nic do zgloszenia".
    out.push({ severity: 3, category: 'link-donikad', ...where,
      uncertain: true,
      summary: 'Link tej samej domeny prowadzi do sciezki spoza listy skanowanych widokow - odpowiedz sieciowa byla poprawna (nie 4xx/5xx), ale to nie wyklucza fallbacku SPA maskujacego nierozpoznany cel',
      how: 'Na widoku "' + route + '" (' + width + 'px) kliknij "' + (d.text || d.sel) + '" (' + d.sel + '), cel: ' + d.href + ' - sprawdz recznie, czy ta sciezka pokazuje realna tresc' });
  } else if (!hadReaction && !serverErrors.length && !clientErrors.length && !result.consoleDuring.length && !result.pageErrDuring.length) {
    // Element juz wygladal na aktywny/wybrany PRZED klikiem (np. zakladka nawigacji,
    // ktora jest biezacym widokiem) albo jego wlasny cel routingu to widok, na ktorym
    // juz jestesmy (patrz navigatesToCurrentModule) - brak zmiany po takim kliknieciu
    // bywa zamierzone, wiec laduje do "niepewne", nie na liste pewnych usterek.
    const alreadyActive = looksAlreadyActive(result.attrsBefore) || navigatesToCurrentModule(d, route, selfNavPattern);
    out.push({ severity: 3, category: 'brak-reakcji', ...where,
      uncertain: !!alreadyActive,
      summary: alreadyActive
        ? 'Element klikalny bez wykrywalnej reakcji - ale wygladal na juz aktywny/wybrany (albo prowadzil na biezacy widok) przed kliknieciem'
        : 'Element klikalny nie wywolal zadnej wykrywalnej reakcji',
      how: 'Na widoku "' + route + '" (' + width + 'px) kliknij "' + (d.text || d.sel) + '" (' + d.sel + ') - brak zmiany w tresci, adresie, stanie elementu ani zapytaniu sieciowym' });
  }
  return out;
}

// ---------- klawiatura: pulapki Tab + widoczny focus ----------

async function checkKeyboardAndFocus(page, route, width) {
  await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }).catch(() => {});
  const findings = [];
  const seenSig = [];
  let lastSig = null;
  let repeat = 0;
  for (let i = 0; i < MAX_TAB_STEPS; i++) {
    await page.keyboard.press('Tab').catch(() => {});
    const info = await page.evaluate(() => {
      var el = document.activeElement;
      if (!el || el === document.body) return null;
      var cs = getComputedStyle(el);
      var r = el.getBoundingClientRect();
      // Pozycja na ekranie odróżnia elementy-bliźniaki (te same tag/klasa/tekst, np.
      // rząd samych ikon) - bez niej dwa różne przystanki fokusu wygladaja identycznie
      // i licznik powtórzeń fałszywie rozpoznaje pułapkę tam, gdzie fokus realnie idzie dalej.
      return {
        sig: el.tagName + '#' + (el.id || '') + '.' + String(el.className || '').slice(0, 40) +
          ':' + (el.textContent || '').trim().slice(0, 30) + '@' + Math.round(r.top) + ',' + Math.round(r.left),
        outlineStyle: cs.outlineStyle,
        outlineWidth: cs.outlineWidth,
        boxShadow: cs.boxShadow,
        text: (el.textContent || '').trim().slice(0, 50),
      };
    }).catch(() => null);
    if (!info) break;

    if (info.sig === lastSig) {
      repeat++;
      if (repeat >= TRAP_REPEAT_THRESHOLD) {
        findings.push({ severity: 2, category: 'pulapka-klawiatury', route, width, element: info.sig, text: info.text,
          summary: 'Tab nie przenosi fokusu dalej - utyka na jednym elemencie',
          how: 'Na widoku "' + route + '" (' + width + 'px) wejdz Tabem na "' + (info.text || info.sig) + '" i nacisnij Tab ponownie - fokus zostaje na miejscu' });
        break;
      }
    } else {
      repeat = 0;
    }
    lastSig = info.sig;

    if (seenSig.indexOf(info.sig) < 0) {
      seenSig.push(info.sig);
      const hasOutline = info.outlineStyle !== 'none' && parseFloat(info.outlineWidth) > 0;
      const hasShadow = !!info.boxShadow && info.boxShadow !== 'none';
      if (!hasOutline && !hasShadow) {
        // Zawsze niepewne, nie pewna usterka: ten sygnal widzi WYLACZNIE obrys i cien.
        // Aplikacja pokazujaca focus inaczej (zmiana obramowania, tla, podkreslenia,
        // przezroczystosci) wyjdzie tu jako falszywy alarm - bez punktu odniesienia
        // "jak wyglada TEN element bez fokusu" nie da sie tego odroznic bezpiecznie
        // od realnego braku focusu, patrz Znane ograniczenia w SKILL.md.
        findings.push({ severity: 4, category: 'brak-focus', route, width, element: info.sig, text: info.text,
          uncertain: true,
          summary: 'Element interaktywny bez widocznego obrysu/cienia focusu - ale mogl pokazywac focus inaczej (obramowanie, tlo, podkreslenie), tego ten sygnal nie widzi',
          how: 'Na widoku "' + route + '" (' + width + 'px) przejdz Tabem na "' + (info.text || info.sig) + '" - sprawdz recznie, czy naprawde nie widac zadnej zmiany' });
      }
    }
  }
  return findings;
}

// ---------- discover routes ----------

// Kanonizuje token widoku do tej samej formy, ktorej oczekuje routeToPath: sciezka
// (wiodacy "/") i hash (wiodacy "#") zostaja jak sa, goly fragment bez prefiksu
// dostaje "#". Bez tego np. "#/uzytkownicy" wykryty z nawigacji hashowej traci "#"
// przy naiwnym stripowaniu i zostaje "/uzytkownicy" - a to WYGLADA jak sciezka URL,
// wiec skaner laduje kompletnie inna strone niz ta, ktora aplikacja naprawde pokazuje
// pod tym hashem. Stosowana jednakowo do widokow z configu (static/extra) i
// wykrytych automatycznie, zeby oba zrodla dawaly ten sam, jednoznaczny format.
function canonicalizeRoute(route) {
  if (!route) return route; // '' = sentinel widoku-korzenia, nie dotykamy
  if (route.charAt(0) === '/' || route.charAt(0) === '#') return route;
  return '#' + route;
}

async function discoverRoutes(page, routesConfig) {
  const staticRoutes = Array.isArray(routesConfig.static) ? routesConfig.static.slice() : [];
  let routes = staticRoutes;

  if (!routes.length && routesConfig.discoverFromNav !== false) {
    const navSelector = routesConfig.navLinkSelector || "a[href^='#']";
    // Href BEZ obcinania "#" - patrz canonicalizeRoute. Bare "#" (placeholder bez
    // realnego celu) odfiltrowany jawnie, nie przez ".filter(Boolean)" po stripowaniu
    // (ktore i tak juz nie zachodzi).
    const navHrefs = await page.evaluate((sel) =>
      Array.prototype.map.call(document.querySelectorAll(sel), (a) => a.getAttribute('href'))
        .filter((h) => h && h !== '#')
    , navSelector).catch(() => []);
    routes = navHrefs;
  }

  if (Array.isArray(routesConfig.extra)) routes = routes.concat(routesConfig.extra);
  // Brak jakiegokolwiek routingu wykrytego (aplikacja jednostronicowa bez hashy,
  // np. jedna strona z zakladkami przelaczanymi JS-em) - skanuj sam root jako
  // jedyny "widok", zamiast zwracac pusta liste tras.
  if (!routes.length) routes = [''];

  return Array.from(new Set(routes.map(canonicalizeRoute)));
}

// ---------- logowanie (bramka dostepu) ----------

async function ensureLoggedIn(page, base, loginConfig, credentials) {
  if (!loginConfig || !loginConfig.usernameSelector || !loginConfig.passwordSelector) {
    return { attempted: false, ok: true };
  }
  await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  const needsLogin = await page.locator(loginConfig.passwordSelector).isVisible().catch(() => false);
  if (!needsLogin) return { attempted: false, ok: true };
  if (!credentials || !credentials.login || !credentials.password) {
    return { attempted: false, ok: false, reason: 'missing-credentials' };
  }
  await page.fill(loginConfig.usernameSelector, credentials.login).catch(() => {});
  await page.fill(loginConfig.passwordSelector, credentials.password).catch(() => {});
  await page.locator(loginConfig.passwordSelector).press(loginConfig.submitKey || 'Enter').catch(() => {});
  await page.waitForTimeout(900);
  const stillLogin = await page.locator(loginConfig.passwordSelector).isVisible().catch(() => false);
  return { attempted: true, ok: !stillLogin };
}

// ---------- skan pojedynczego widoku ----------

// Sprawdza, czy jestesmy z powrotem na formularzu logowania - patrz komentarz przy
// pierwszym wywolaniu w scanRoute(). Wspolna dla nawigacji poczatkowej I powrotu po
// dryfie (sesja moze wygasnac w kazdym z tych momentow, nie tylko na starcie widoku).
async function checkLoginWall(page, loginConfig) {
  if (!loginConfig || !loginConfig.passwordSelector) return false;
  return page.locator(loginConfig.passwordSelector).isVisible().catch(() => false);
}

async function scanRoute(page, ctx) {
  const { base, route, width, knownRoutes, findings, stats, options } = ctx;
  // Nasluchy PRZED nawigacja, nie po niej - inaczej blad w buncie JS aplikacji albo
  // nieudane pierwsze zapytanie o dane (dokladnie to, co "blad-konsoli"/"siec-4xx/5xx"
  // maja wykrywac) dzieje sie, zanim cokolwiek zaczyna sluchac, i znika bez sladu.
  const sink = { console: [], pageErrors: [], network: [], requests: [] };
  const detach = attachListeners(page, sink);

  const navError = await gotoRoute(page, base, route);
  if (navError) {
    // Widok sie nie zaladowal - NIE skanuj go jako pusta/poprzednia strone (wygladaloby
    // to na "0 usterek", czyli falszywie czysty wynik dla celu, ktorego skaner nigdy
    // realnie nie zobaczyl). Zawsze widoczne w raporcie, nigdy ciche pominiecie.
    stats.failedRoutes.push({ route, width, error: navError });
    detach();
    return;
  }
  // Przekierowanie na bramke logowania NIE rzuca bledu HTTP (strona logowania to
  // zwykle poprawne 200) - ensureLoggedIn() sprawdza to raz na starcie skanu, na
  // stronie glownej, wiec widok chroniony, do ktorego root nie prowadzi (albo sesja
  // wygasla w trakcie dlugiego skanu), przeszedlby jako "zaladowany" mimo ze skaner
  // patrzy na formularz logowania, nie na realny widok. Sprawdzamy TYLKO gdy w
  // configu jest bramka - bez niej nie ma jak odroznic prawdziwej strony logowania
  // od zwyklego widoku, ktory akurat tak sie nazywa.
  if (await checkLoginWall(page, options.login)) {
    stats.failedRoutes.push({ route, width, error: 'przekierowano na logowanie (sesja wygasla albo widok chroniony, a root nie wymaga logowania)' });
    detach();
    return;
  }
  // Punkt odniesienia do wykrycia dryfu z widoku (patrz nizej) - zawsze empirycznie
  // odczytany PO nawigacji, nigdy wyliczony z samego "route". "route" to opaque
  // identyfikator widoku z configu/discoverRoutes - dla widokow hashowych rowna sie
  // hashowi, ale dla widokow po sciezce (np. "/admin") NIGDY nie rowna sie hashowi
  // (ten zostaje pusty), wiec porownywanie "route" wprost z hashem zawsze wychodziloby
  // jako dryf i wymuszaloby pelne przeladowanie po KAZDYM kliknieciu na takim widoku -
  // dokladnie to zdarzalo sie tutaj, zanim to dorzucono.
  const expected = await page.evaluate(() => ({
    hash: (location.hash || '').replace('#', ''),
    pathQuery: location.pathname + location.search,
  })).catch(() => null);

  const stuck = await checkStuckLoading(page, options.stuckLoadingMs);
  if (stuck) {
    findings.push({ severity: 1, category: 'ladowanie-zawieszone', route, width, element: null, text: stuck,
      summary: 'Widok zostaje w stanie ladowania dluzej niz ' + Math.round(options.stuckLoadingMs / 1000) + 's',
      how: 'Wejdz na widok "' + route + '" (' + width + 'px) i odczekaj ' + Math.round(options.stuckLoadingMs / 1000) + 's - komunikat "' + stuck + '" nie znika' });
  }

  // Bledy z SAMEGO ladowania widoku, zanim cokolwiek zostalo klikniete - nasluchy sa
  // juz aktywne od poczatku (patrz wyzej), wiec crash przy starcie aplikacji albo
  // nieudane pierwsze zapytanie o dane trafiaja tutaj, nie znikaja po cichu.
  if (sink.console.length || sink.pageErrors.length) {
    const msgs = sink.console.concat(sink.pageErrors).map((m) => m.text).slice(0, 3).join(' | ');
    findings.push({ severity: 1, category: 'blad-konsoli', route, width, element: null, text: null,
      summary: 'Blad w konsoli przegladarki juz przy samym ladowaniu widoku (przed kliknieciem czegokolwiek)',
      how: 'Wejdz na widok "' + route + '" (' + width + 'px) - konsola: ' + msgs });
  }
  const bootServerErrors = sink.network.filter((n) => n.status >= 500);
  const bootClientErrors = sink.network.filter((n) => n.status >= 400 && n.status < 500);
  if (bootServerErrors.length) {
    findings.push({ severity: 1, category: 'siec-5xx', route, width, element: null, text: null,
      summary: 'Zapytanie sieciowe zakonczone bledem serwera (5xx) juz przy samym ladowaniu widoku',
      how: 'Wejdz na widok "' + route + '" (' + width + 'px) - ' + bootServerErrors.map((n) => n.method + ' ' + n.url + ' -> ' + n.status).join('; ') });
  }
  if (bootClientErrors.length) {
    findings.push({ severity: 3, category: 'siec-4xx', route, width, element: null, text: null,
      summary: 'Zapytanie sieciowe zakonczone bledem klienta (4xx) juz przy samym ladowaniu widoku',
      how: 'Wejdz na widok "' + route + '" (' + width + 'px) - ' + bootClientErrors.map((n) => n.method + ' ' + n.url + ' -> ' + n.status).join('; ') });
  }

  // Klawiatura NAJPIERW, na swiezo zaladowanym widoku: po blur() Chromium potrafi
  // kontynuowac kolejnosc Tab od OSTATNIO namierzonego elementu (nie od poczatku
  // strony) - klikanie myszka w petli nizej przesuwa fokus po ekranie, wiec zrobiony
  // po klikaniu test Tab startowalby z przypadkowego miejsca i gubil kroki.
  const kbFindings = await checkKeyboardAndFocus(page, route, width);
  findings.push(...kbFindings);

  const { descriptors, totalFound } = await collectInteractiveDescriptors(page, INTERACTIVE_SELECTOR, options.maxElementsPerRoute);
  stats.totalElementsFound += totalFound;
  if (totalFound > descriptors.length) {
    stats.truncatedNotes.push(route + ' (' + width + 'px): pominieto ' + (totalFound - descriptors.length) + ' elementow ponad limit ' + options.maxElementsPerRoute);
  }

  for (const d of descriptors) {
    if (isExternalNav(d)) { stats.externalSkipped++; continue; }
    if (!options.includeCostly && isCostly(d, options.costlyPattern)) {
      stats.costlySkipped.push(route + ' (' + width + 'px): "' + d.text + '" (' + d.sel + ')');
      continue;
    }
    // Lokalizacja przez strukturalna sciezke (d.sel), NIE przez pozycyjny indeks w
    // plaskiej liscie wszystkich elementow interaktywnych - wczesniejsze klikniecia w
    // tej petli mogly dolozyc/usunac elementy WCZESNIEJ w DOM (np. przefiltrowana
    // lista kart), co przesuwa pozycyjny indeks i podstawia pod niego INNY element niz
    // ten opisany w descriptorze. Nawet sciezka strukturalna moze dryfowac (przybyl
    // rodzony element tego samego tagu na tej samej glebokosci), wiec dodatkowo
    // sprawdzamy tag+tekst przed klikiem - rozjazd = element uciekl, pomijamy zamiast
    // przypisac usterke nie temu, co faktycznie zostalo kliknietě.
    //
    // Historia: pierwszy raport tego skanera na Pulsarze zglosil 26 "pewnych usterek",
    // wszystkie falszywe - poprzednia wersja lokalizowala element po jego POZYCJI w
    // plaskiej liscie, a kazdy klik, ktory cokolwiek filtrowal, przesuwal ta pozycje.
    // Samotest tego nie wykryl, bo sprawdzal siedem kategorii usterek, a nie sam
    // mechanizm namierzania elementu. Nie cofaj tej logiki do indeksu pozycyjnego.
    const loc = page.locator(d.sel).first();
    let exists = true;
    try { await loc.waitFor({ state: 'attached', timeout: 800 }); } catch (e) { exists = false; }
    if (!exists) { stats.staleSkipped++; continue; }
    const stillMatches = await loc.evaluate((el, expected) => {
      var text = (el.textContent || el.value || '').trim().slice(0, 70);
      return el.tagName.toLowerCase() === expected.tag && text === expected.text;
    }, { tag: d.tag, text: d.text }).catch(() => false);
    if (!stillMatches) { stats.driftSkipped++; continue; }

    const result = await clickAndObserve(page, loc, sink, options.clickWaitMs, options.networkIdleTimeoutMs);
    if (result.clickError) { stats.staleSkipped++; continue; }
    stats.elementsClicked++;
    const clickFindings = classifyClick(d, route, width, result, knownRoutes, options.selfNavPattern);
    findings.push(...clickFindings);

    // Klikniecie moglo odeslac na inny widok (link nawigacyjny) - reszta listy
    // dotyczy widoku, ktorego juz nie ma na ekranie. Bez powrotu kazde kolejne
    // klikniecie z tej listy konczyloby sie cichym "element zniknal" i tracilibysmy
    // cala reszte widoku, zamiast realnie ja sprawdzic.
    //
    // Porownanie ZAWSZE wzgledem "expected" (odczytany empirycznie po nawigacji na
    // poczatku tej funkcji), NIGDY wzgledem "route" wprost - "route" jest opaque
    // identyfikatorem widoku, nie hashem, wiec porownywanie go z hashem myli sie dla
    // widokow po sciezce (patrz komentarz przy "expected" wyzej).
    const currentLoc = await page.evaluate(() => ({
      hash: (location.hash || '').replace('#', ''),
      pathQuery: location.pathname + location.search,
    })).catch(() => null);
    const drifted = currentLoc !== null && expected !== null &&
      (currentLoc.hash !== expected.hash || currentLoc.pathQuery !== expected.pathQuery);
    if (drifted) {
      stats.driftReloads++;
      const recoveryError = await gotoRoute(page, base, route);
      if (recoveryError) {
        // Powrot na widok po dryfie sie nie udal (np. serwer akurat padl, kolejny
        // widok odpowiada 500) - reszta listy elementow i tak nie da sie wiarygodnie
        // przetestowac (strona, na ktorej jestesmy, nie jest tym, co mielismy skanowac).
        // Przerywamy TEN widok i zglaszamy to jak kazdy inny widok, ktory sie nie
        // zaladowal - zamiast kontynuowac w cichym, zepsutym stanie.
        stats.failedRoutes.push({ route, width, error: 'powrot po dryfie: ' + recoveryError });
        break;
      }
      // Sesja mogla wygasnac WLASNIE w trakcie tej interakcji (nie tylko na starcie
      // widoku, patrz checkLoginWall wyzej) - bez tego powtorzenia reszta listy
      // elementow bylaby dalej "testowana" na formularzu logowania.
      if (await checkLoginWall(page, options.login)) {
        stats.failedRoutes.push({ route, width, error: 'sesja wygasla w trakcie skanu (przekierowano na logowanie po powrocie z dryfu)' });
        break;
      }
      continue;
    }
    // Klikniecie mogloby otworzyc nakladke/menu, ktore przykrywa reszte widoku -
    // Escape zamyka wiekszosc modali/drawerow, wiec kolejne elementy znow sa
    // klikalne zamiast utykac na "element zniknal".
    if (result.after && result.before && result.after.openEls > result.before.openEls) {
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(150);
    }
  }

  detach();
}

// ---------- raport ----------

const SEVERITY_LABEL = { 1: 'Krytyczna', 2: 'Wysoka', 3: 'Srednia', 4: 'Niska' };

function renderReport(findings, stats, options) {
  const certain = findings.filter((f) => !f.uncertain).sort((a, b) => a.severity - b.severity);
  const uncertain = findings.filter((f) => f.uncertain);

  const coveragePct = stats.totalElementsFound > 0
    ? Math.round((stats.elementsClicked / stats.totalElementsFound) * 100)
    : 100;

  const lines = [];
  lines.push('# Raport skanu usterek - ' + options.appName);
  lines.push('');
  lines.push('**POKRYCIE: ' + stats.elementsClicked + ' / ' + stats.totalElementsFound + ' elementow (' + coveragePct + '%)**' +
    (coveragePct < 100 ? ' - reszta pominieta (limit na widok, zniknela z DOM, dryf pozycji albo celowo pominieta akcja kosztowa, patrz nizej).' : ''));
  if (coveragePct < 60) {
    lines.push('');
    lines.push('**POKRYCIE PONIZEJ 60% - TEN RAPORT JEST UNIEWAZNIONY.** Nie traktuj listy usterek');
    lines.push('nizej jako wiarygodnej, dopoki pokrycie nie wzrosnie (wieksze limity, mniej dryfu,');
    lines.push('mniej pominiec). Patrz SKILL.md, sekcja Ograniczenia.');
  }
  if (stats.failedRoutes && stats.failedRoutes.length) {
    lines.push('');
    lines.push('**' + stats.failedRoutes.length + ' WIDOK(I) NIE ZALADOWALY SIE - NIE ZOSTALY PRZESKANOWANE.**');
    lines.push('Nie traktuj ich nieobecnosci na liscie usterek jako "dziala bez zarzutu" - skaner');
    lines.push('ich w ogole nie zobaczyl. Sprawdz adres bazowy i dostepnosc srodowiska, potem');
    lines.push('uruchom ponownie:');
    stats.failedRoutes.forEach((f) => lines.push('- `' + f.route + '` (' + f.width + 'px): ' + f.error));
  }
  lines.push('');
  lines.push('Cel: ' + options.base);
  lines.push('');
  lines.push('## Zasieg skanu');
  lines.push('');
  lines.push('- widokow odwiedzonych: ' + stats.uniqueRoutes + ' (' + stats.routeList.join(', ') + ')');
  lines.push('- szerokosci: ' + stats.widthsUsed.join('px, ') + 'px');
  lines.push('- kombinacji widok x szerokosc: ' + stats.routeWidthCombos);
  lines.push('- elementow wykrytych: ' + stats.totalElementsFound);
  lines.push('- elementow klikalnych klikniętych: ' + stats.elementsClicked);
  lines.push('- pominietych (nawigacja poza aplikacje): ' + stats.externalSkipped);
  lines.push('- pominietych (element zniknal miedzy wykryciem a kliknięciem): ' + stats.staleSkipped);
  lines.push('- pominietych (element dryfowal na inny pod tym samym miejscem - patrz "Historia" w SKILL.md): ' + stats.driftSkipped);
  if (stats.costlySkipped.length) {
    lines.push('- pominietych celowo (akcja kosztowa/webhook/wylogowanie, patrz nizej): ' + stats.costlySkipped.length);
  }
  if (stats.truncatedNotes.length) {
    lines.push('- widoki z liczba elementow ponad limit (' + options.maxElementsPerRoute + '/widok): ' + stats.truncatedNotes.length);
  }
  lines.push('');

  lines.push('## Usterki (' + certain.length + ')');
  lines.push('');
  if (!certain.length) {
    lines.push('Brak usterek spelniajacych kryteria z tej listy w odwiedzonych widokach.');
  } else {
    certain.forEach((f, i) => {
      lines.push('### ' + (i + 1) + '. [' + SEVERITY_LABEL[f.severity] + '] ' + f.summary);
      lines.push('');
      lines.push('- widok: `' + f.route + '` (' + f.width + 'px)');
      if (f.element) lines.push('- element: `' + f.element + '`' + (f.text ? ' - "' + f.text + '"' : ''));
      lines.push('- kategoria: ' + f.category);
      lines.push('- jak odtworzyc: ' + f.how);
      lines.push('');
    });
  }

  lines.push('## Niepewne (' + uncertain.length + ')');
  lines.push('');
  lines.push('Wyglada na usterke, ale moze byc zamierzone - nie mieszac z lista powyzej.');
  lines.push('');
  if (!uncertain.length) {
    lines.push('Brak.');
  } else {
    uncertain.forEach((f, i) => {
      lines.push('### ' + (i + 1) + '. ' + f.summary);
      lines.push('');
      lines.push('- widok: `' + f.route + '` (' + f.width + 'px)');
      if (f.element) lines.push('- element: `' + f.element + '`' + (f.text ? ' - "' + f.text + '"' : ''));
      lines.push('- jak odtworzyc: ' + f.how);
      lines.push('');
    });
  }

  if (stats.costlySkipped.length) {
    lines.push('## Pominiete celowo (koszt/efekty uboczne)');
    lines.push('');
    lines.push('Domyslnie skaner nie klika akcji dopasowanych do wzorca kosztownego z configu');
    lines.push('(generowanie/wysylka/webhook/wylogowanie itp). Uruchom z `--include-costly`, zeby');
    lines.push('objac je skanem swiadomie.');
    lines.push('');
    stats.costlySkipped.forEach((s) => lines.push('- ' + s));
    lines.push('');
  }

  if (stats.truncatedNotes.length) {
    lines.push('## Widoki obciete do limitu elementow');
    lines.push('');
    stats.truncatedNotes.forEach((s) => lines.push('- ' + s));
    lines.push('');
  }

  return lines.join('\n') + '\n';
}

// ---------- orkiestrator ----------

async function runScan(userOptions) {
  const options = Object.assign({
    appName: 'aplikacja',
    base: null,
    widths: DEFAULT_WIDTHS,
    routesFromCli: null,
    routesConfig: {},
    stuckLoadingMs: DEFAULT_STUCK_LOADING_MS,
    maxElementsPerRoute: DEFAULT_MAX_ELEMENTS_PER_ROUTE,
    clickWaitMs: CLICK_WAIT_MS,
    networkIdleTimeoutMs: DEFAULT_NETWORK_IDLE_TIMEOUT_MS,
    credentials: null,
    outFile: null,
    includeCostly: false,
    costlyPattern: null,
    login: null,
    selfNavPattern: null,
  }, userOptions || {});

  if (!options.base) {
    throw new Error('Brak adresu celu. Podaj --base=https://... albo baseUrl w configu (samotest nie wymaga celu, patrz scripts/bug-scan-selftest.js).');
  }

  const CHROME = resolveChrome();
  if (!CHROME) {
    throw new Error('Brak Chrome dla Playwright. Uruchom `npx playwright install chromium`, albo ustaw PLAYWRIGHT_CHROMIUM_PATH.');
  }

  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: options.widths[0], height: 900 } });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const login = await ensureLoggedIn(page, options.base, options.login, options.credentials);
    if (login.attempted && !login.ok) {
      throw new Error('Logowanie nie powiodlo sie (login/haslo odrzucone).');
    }
    if (!login.attempted && login.ok === false) {
      const envNames = options.credentialsEnvNames || { login: 'BUGSCAN_LOGIN', password: 'BUGSCAN_PASSWORD' };
      throw new Error('Cel wymaga logowania - podaj ' + envNames.login + '/' + envNames.password + ' (env) albo --login/--password.');
    }

    await page.goto(options.base + '/', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    // canonicalizeRoute tez tutaj - --routes na CLI (albo routesFromCli podany
    // programowo) moze rowniez zawierac gole nazwy fragmentow bez "#", ktore musza
    // przejsc przez ta sama kanonizacje co widoki z configu/auto-wykrycia.
    // Tablica PUSTA jest prawdziwa w JS ([] || x === []) - "--routes=" z samych
    // przecinkow/spacji (albo routesFromCli=[] podany programowo) dawaloby wiec zero
    // widokow do skanu zamiast spasc do auto-wykrycia, a raport z 0 elementow wyszedlby
    // jako czyste "100% pokrycia, 0 usterek" dla skanu, ktory nic nie zrobil.
    const routes = (
      options.routesFromCli && options.routesFromCli.length ? options.routesFromCli : await discoverRoutes(page, options.routesConfig)
    ).map(canonicalizeRoute);

    const findings = [];
    const stats = {
      uniqueRoutes: routes.length,
      routeList: routes,
      widthsUsed: options.widths,
      routeWidthCombos: 0,
      elementsClicked: 0,
      totalElementsFound: 0,
      externalSkipped: 0,
      staleSkipped: 0,
      driftSkipped: 0,
      costlySkipped: [],
      truncatedNotes: [],
      failedRoutes: [],
      driftReloads: 0,
    };

    for (const width of options.widths) {
      await page.setViewportSize({ width, height: width <= 480 ? 844 : 900 });
      for (const route of routes) {
        if (!options.quiet) console.log('  skan: ' + (route || '(root)') + ' (' + width + 'px)');
        const startedAt = Date.now();
        await scanRoute(page, { base: options.base, route, width, knownRoutes: routes, findings, stats, options });
        stats.routeWidthCombos++;
        if (!options.quiet) console.log('    ...' + Math.round((Date.now() - startedAt) / 1000) + 's, ' + stats.elementsClicked + ' klikniec dotad');
        // Zapis czesciowy po kazdym widoku - pelny skan trwa minuty, a proces przerwany
        // (timeout, restart maszyny) bez tego zostawialby zero sladu mimo realnej pracy.
        if (options.outFile) {
          const partial = renderReport(findings, stats, options);
          fs.mkdirSync(path.dirname(options.outFile), { recursive: true });
          fs.writeFileSync(options.outFile, partial, 'utf8');
        }
      }
    }

    const report = renderReport(findings, stats, options);
    if (options.outFile) {
      fs.mkdirSync(path.dirname(options.outFile), { recursive: true });
      fs.writeFileSync(options.outFile, report, 'utf8');
    }
    return { findings, stats, report };
  } finally {
    await browser.close().catch(() => {});
  }
}

module.exports = {
  runScan, discoverRoutes, scanRoute, renderReport,
  classifyClick, checkKeyboardAndFocus, checkStuckLoading,
  loadConfig, buildOptions,
  DEFAULT_WIDTHS, DEFAULT_STUCK_LOADING_MS, DEFAULT_MAX_ELEMENTS_PER_ROUTE, DEFAULT_COSTLY_TEXT_PATTERN,
};

// ---------- CLI ----------

function parseArgs(argv) {
  const out = {};
  argv.forEach((a) => {
    const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
    if (m) out[m[1]] = m[2] === undefined ? true : m[2];
  });
  return out;
}

if (require.main === module) {
  (async () => {
    const cliArgs = parseArgs(process.argv.slice(2));
    const config = loadConfig(cliArgs.config);
    const options = buildOptions(cliArgs, config);

    console.log('Config: ' + (options.configSource || '(brak - domyslne wartosci, patrz bug-scan.config.example.json)'));
    console.log('Start skanu: ' + (options.base || '(brak celu)'));
    try {
      const { findings, stats, report } = await runScan(options);
      console.log(report);
      console.log('Raport zapisany: ' + path.relative(process.cwd(), options.outFile));
      const certain = findings.filter((f) => !f.uncertain);
      console.log('Usterki: ' + certain.length + ' (+ ' + (findings.length - certain.length) + ' niepewnych)');
      if (stats.failedRoutes.length) console.log('Widoki, ktore sie nie zaladowaly: ' + stats.failedRoutes.length);
      // Widok, ktory sie nie zaladowal, to NIE sukces automatyzacji - inaczej CI/skrypt
      // wolajacy ten proces widzialby "exit 0" dla skanu, ktory w calosci nie dotarl
      // do celu (a 0/0 znalezionych elementow liczy sie akurat jako "100% pokrycia").
      process.exit((certain.length || stats.failedRoutes.length) ? 1 : 0);
    } catch (e) {
      console.error('FAIL:', e && e.message || e);
      process.exit(1);
    }
  })();
}
