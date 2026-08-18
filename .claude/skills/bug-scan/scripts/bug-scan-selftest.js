// Samotest scripts/bug-scan.js: dowod, ze scanner realnie wykrywa kazda kategorie
// usterki z jego specyfikacji, zanim uzyjemy go na prawdziwym projekcie. Uruchamia
// scanner na atrapie z celowo zaszytymi usterkami (scripts/bug-scan-fixture.js) i
// sprawdza, ze kazda z nich wyladowala w raporcie pod wlasciwa kategoria - a kontrolne
// "dobre" elementy (dzialajacy przycisk, udany zapis, widoczny focus) NIE zostaly
// oznaczone jako usterka.
//
// To jest bramka regresji dla samego MECHANIZMU wykrywania - nie tylko dla kategorii
// usterek. Sprawdzaj po kazdej zmianie w bug-scan.js, nie tylko po dodaniu nowej
// kategorii: pierwszy samotest w historii tego narzedzia sprawdzal siedem kategorii i
// przechodzil zielono, mimo ze mechanizm namierzania klikanego elementu byl zepsuty
// (pozycyjny indeks zamiast strukturalnej sciezki) i caly pierwszy raport na prawdziwym
// projekcie byl w stu procentach falszywy. Jesli zmieniasz sposob namierzania elementu
// (d.sel, tag+text re-check w scanRoute), dodaj tu przypadek, ktory realnie odroznia
// stary mechanizm od nowego - sama liczba wykrytych kategorii tego nie zlapie.
//
// Uzycie: node scripts/bug-scan-selftest.js
'use strict';
const { runScan } = require('./bug-scan');

function has(findings, category, pred) {
  return findings.some((f) => f.category === category && (!pred || pred(f)));
}

(async () => {
  process.env.FIXTURE_PORT = process.env.FIXTURE_PORT || '4601';
  const fixtureServer = require('./bug-scan-fixture');
  const base = 'http://localhost:' + (process.env.FIXTURE_PORT || 4601);
  await new Promise((res) => setTimeout(res, 300));

  // Serwer atrapy zamykamy dopiero na samym koncu (finally na dole) - wszystkie
  // przebiegi ponizej, wlacznie z tymi dodanymi pozniej, dzwonia do TEGO SAMEGO
  // serwera pod "base". Zamkniecie go w polowie zamienia kazdy kolejny przebieg w
  // "widok sie nie zaladowal" i falszywie oskarza SKANER o regresje, ktorej nie ma -
  // dokladnie to sie stalo przy pierwszym dodaniu przebiegu "/section" ponizej.
  let result, badRouteResult, quietPathRouteResult, nestedHashRouteResult, protectedRouteResult, bootErrorRouteResult, emptyRoutesResult;
  try {
    result = await runScan({
      appName: 'fixture-selftest',
      base,
      // '' = widok-korzen bez routingu hash (patrz discoverRoutes) - dorzucony obok
      // 'one'/'two' zeby przetestowac tez sciezke odzyskiwania po dryfie sciezkowym
      // (patrz "expectedPathname" w scanRoute), ktora dla samego hasha jest slepa.
      // '/section' dorzucony do TEJ SAMEJ listy (nie osobnym przebiegiem), zeby byl
      // "znanym widokiem" podczas skanowania #deadPathLink (patrz PAGE w atrapie).
      routesFromCli: ['', 'one', 'two', '/section'],
      widths: [1024],
      stuckLoadingMs: 1200,
      outFile: null,
    });

    // Widok, ktory sie NIE laduje (adres bazowy nieosiagalny), nie moze wyjsc jako
    // "0 usterek" - to falszywie czysty wynik dla celu, ktorego skaner nigdy nie
    // zobaczyl. Port 1 nie ma nasluchujacego serwera, wiec nawigacja odrzuca sie od
    // razu (ECONNREFUSED), bez czekania na 30s timeout.
    badRouteResult = await runScan({
      appName: 'fixture-selftest-badroute',
      base: 'http://127.0.0.1:1',
      routesFromCli: ['x'],
      widths: [1024],
      outFile: null,
    }).catch((e) => ({ error: e }));

    // Regresja: widok po sciezce ("/section", nigdy rowny hashowi) bez zadnego linku
    // zmieniajacego adres - klikniecie #quietBtn NIE powinno wymusic przeladowania.
    // "/error-route" dorzucony do tego samego przebiegu: odpowiada dokumentem 500
    // (nie odrzuca polaczenia) - Playwright nie rzuca na takiej odpowiedzi, wiec trzeba
    // sprawdzic status odpowiedzi osobno od samego faktu "nawigacja sie nie wywalila".
    quietPathRouteResult = await runScan({
      appName: 'fixture-selftest-quietpath',
      base,
      routesFromCli: ['/section', '/error-route'],
      widths: [1024],
      outFile: null,
    }).catch((e) => ({ error: e }));

    // Regresja: link hashowy ze slashem ("#/nested") wykryty PRZEZ NAWIGACJE (nie
    // podany jawnie w configu) musi zostac skanowany jako hash, nie jako sciezka URL -
    // navLinkSelector zawezony do TEGO JEDNEGO linku, zeby nie skanowac calej reszty
    // nawigacji (osobno przetestowanej wyzej).
    nestedHashRouteResult = await runScan({
      appName: 'fixture-selftest-nestedhash',
      base,
      routesConfig: { static: [], discoverFromNav: true, navLinkSelector: '#navNested' },
      widths: [1024],
      outFile: null,
    }).catch((e) => ({ error: e }));

    // Regresja: widok chroniony, do ktorego root (publiczny) nie prowadzi - navigacja
    // dostaje 200, ale tresc to formularz logowania, nie realny widok. ensureLoggedIn()
    // nie wykryje tego (sprawdza tylko root), wiec musi to zlapac sam scanRoute().
    protectedRouteResult = await runScan({
      appName: 'fixture-selftest-protected',
      base,
      routesFromCli: ['/protected'],
      widths: [1024],
      login: { passwordSelector: '#loginPw' },
      outFile: null,
    }).catch((e) => ({ error: e }));

    // Regresja: blad konsoli i zapytanie 500 wywolane PRZY LADOWANIU widoku (przed
    // jakimkolwiek kliknieciem) - dowod, ze nasluchy sieci/konsoli sa juz aktywne w
    // momencie nawigacji, nie zakladaja sie dopiero po niej.
    bootErrorRouteResult = await runScan({
      appName: 'fixture-selftest-booterror',
      base,
      routesFromCli: ['/boot-error'],
      widths: [1024],
      outFile: null,
    }).catch((e) => ({ error: e }));

    // Regresja: tablica PUSTA jest prawdziwa w JS ([] || x === []) - routesFromCli=[]
    // (np. z "--routes=" zlozonego z samych przecinkow) musi spasc do auto-wykrycia,
    // nie zeskanowac zero widokow i wyjsc jako czyste "100% pokrycia, 0 usterek".
    // navLinkSelector zawezony do jednego linku, zeby nie skanowac calej nawigacji
    // ponownie - to test samej sciezki "pusta tablica -> auto-wykrycie", nie zasiegu.
    emptyRoutesResult = await runScan({
      appName: 'fixture-selftest-emptyroutes',
      base,
      routesFromCli: [],
      routesConfig: { navLinkSelector: '#navOne' },
      widths: [1024],
      outFile: null,
    }).catch((e) => ({ error: e }));
  } finally {
    fixtureServer.close();
  }

  const { findings, stats } = result;
  const checks = [
    ['martwy przycisk -> brak-reakcji', has(findings, 'brak-reakcji', (f) => f.element === '#deadBtn')],
    ['blad konsoli po kliknieciu -> blad-konsoli', has(findings, 'blad-konsoli', (f) => f.element === '#errBtn')],
    ['zapytanie 404 -> siec-4xx', has(findings, 'siec-4xx', (f) => f.element === '#notFoundBtn')],
    ['zapytanie 500 -> siec-5xx', has(findings, 'siec-5xx', (f) => f.element === '#saveFailBtn')],
    ['widok zawieszony w ladowaniu -> ladowanie-zawieszone', has(findings, 'ladowanie-zawieszone', (f) => f.route === '#one')],
    ['link do nierozpoznanego widoku -> link-donikad', has(findings, 'link-donikad', (f) => f.element === '#navBroken' && !f.uncertain)],
    ['link do nierozpoznanej sciezki (fallback 200) -> link-donikad, niepewne', has(findings, 'link-donikad', (f) => f.element === '#navPathBroken' && f.uncertain === true)],
    ['pulapka klawiatury -> pulapka-klawiatury', has(findings, 'pulapka-klawiatury', (f) => f.route === '#two')],
    ['przycisk bez widocznego focusu -> brak-focus', has(findings, 'brak-focus', (f) => /focusBad/.test(f.element))],
    ['dzialajacy przycisk NIE oznaczony jako brak-reakcji', !has(findings, 'brak-reakcji', (f) => f.element === '#liveBtn')],
    ['udany zapis (200) NIE oznaczony jako usterka', !findings.some((f) => f.element === '#saveOkBtn')],
    ['przycisk z widocznym focusem NIE oznaczony jako brak-focus', !has(findings, 'brak-focus', (f) => /focusGood/.test(f.element))],
    ['nawigacja do innego widoku NIE oznaczona jako link-donikad', !has(findings, 'link-donikad', (f) => f.element === '#navTwo')],
    ['po dryfie sciezkowym na widoku-korzeniu, elementy PO linku dalej testowane (odzyskiwanie po nawigacji sciezkowej)',
      has(findings, 'brak-reakcji', (f) => f.element === '#deadBtn' && f.route === '') &&
      has(findings, 'blad-konsoli', (f) => f.element === '#errBtn' && f.route === '')],
    ['martwy przycisk SVG (className jako obiekt) -> brak-reakcji, nie falszywie "zareagowal"', has(findings, 'brak-reakcji', (f) => f.element === '#deadSvgBtn')],
    ['martwy link do ZNANEGO widoku -> brak-reakcji (nie znika po cichu jako "cel rozpoznany")', has(findings, 'brak-reakcji', (f) => f.element === '#deadPathLink')],
    ['kontrolka wylaczona przez ARIA (nie natywne disabled) wcale nie klikana', !findings.some((f) => f.element === '#ariaDisabledBtn')],
    ['zwykly link "Strona glowna" (cel "/") NIE oznaczony jako link-donikad (rownowaznosc "/" i sentinela widoku-korzenia)', !has(findings, 'link-donikad', (f) => f.element === '#navHome')],
  ];

  checks.push([
    'widok, ktory sie nie zaladowal -> widoczny w raporcie, nie ciche "0 usterek"',
    !badRouteResult.error &&
      badRouteResult.stats.failedRoutes.length === 1 &&
      /NIE ZALADOWALY SIE/.test(badRouteResult.report),
  ]);

  checks.push([
    'klikniecie bez nawigacji na widoku PO SCIEZCE nie wymusza przeladowania (regresja z dryfu)',
    !quietPathRouteResult.error &&
      quietPathRouteResult.stats.elementsClicked >= 1 &&
      quietPathRouteResult.stats.driftReloads === 0,
  ]);

  checks.push([
    'widok odpowiadajacy dokumentem bledu (500, nie odrzucone polaczenie) -> tez widoczny jako nie-zaladowany',
    !quietPathRouteResult.error &&
      quietPathRouteResult.stats.failedRoutes.some((f) => f.route === '/error-route' && /HTTP 500/.test(f.error)),
  ]);

  checks.push([
    'link "#/nested" (hash ze slashem) wykryty i skanowany jako HASH, nie jako sciezka URL (regresja)',
    !nestedHashRouteResult.error &&
      nestedHashRouteResult.stats.routeList.includes('#/nested') &&
      nestedHashRouteResult.stats.failedRoutes.length === 0,
  ]);

  checks.push([
    'widok chroniony (root publiczny, konkretna sciezka za logowaniem) -> widoczny jako nie-zaladowany, nie skanowany jako formularz logowania',
    !protectedRouteResult.error &&
      protectedRouteResult.stats.failedRoutes.length === 1 &&
      /logowanie/.test(protectedRouteResult.stats.failedRoutes[0].error),
  ]);

  checks.push([
    'blad konsoli i siec-5xx przy samym LADOWANIU widoku (przed kliknieciem) -> wykryte, nie zniknely',
    !bootErrorRouteResult.error &&
      has(bootErrorRouteResult.findings, 'blad-konsoli', (f) => f.route === '/boot-error' && f.element === null) &&
      has(bootErrorRouteResult.findings, 'siec-5xx', (f) => f.route === '/boot-error' && f.element === null),
  ]);

  checks.push([
    'zwykly link do fragmentu dokumentu (cel istnieje na stronie) NIE oznaczony jako link-donikad',
    !has(findings, 'link-donikad', (f) => f.element === '#navAnchor'),
  ]);

  checks.push([
    'routesFromCli=[] (pusta tablica) spada do auto-wykrycia, nie skanuje zera widokow',
    !emptyRoutesResult.error &&
      emptyRoutesResult.stats.uniqueRoutes > 0 &&
      emptyRoutesResult.stats.elementsClicked > 0,
  ]);

  let ok = true;
  checks.forEach(([label, pass]) => {
    console.log((pass ? '  PASS  ' : '  FAIL  ') + label);
    if (!pass) ok = false;
  });

  console.log('');
  console.log('Zasieg: ' + stats.routeWidthCombos + ' kombinacji widok x szerokosc, ' + stats.elementsClicked + ' kliknięć.');
  console.log(ok ? 'SELFTEST OK - scanner wykrywa zaszyte usterki i nie fałszuje dobrych elementów.' : 'SELFTEST FAIL');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error('FAIL:', e && e.stack || e); process.exit(1); });
