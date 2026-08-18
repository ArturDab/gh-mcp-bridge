// Atrapa aplikacji z celowo zaszytymi usterkami - wylacznie do samotestu
// scripts/bug-scan-selftest.js. Dowodzi, ze scanner (scripts/bug-scan.js) realnie
// wykrywa kazda kategorie z jego specyfikacji, zanim ruszy na prawdziwy projekt.
// Jedna strona, hash-routing (#widok), bez frameworkow.
'use strict';
const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/save-ok', (_q, r) => r.json({ ok: true }));
app.post('/api/save-fail', (_q, r) => r.status(500).json({ error: 'boom' }));
app.get('/api/nope', (_q, r) => r.status(404).json({ error: 'not found' }));

const PAGE = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>Fixture</title>
<style>
  body{font-family:sans-serif;padding:20px}
  .view{display:none}
  .view.active{display:block}
  .toast{position:fixed;bottom:10px;right:10px;background:#222;color:#fff;padding:8px 12px;display:none}
  .toast.show{display:block}
  #focusBad{outline:none;box-shadow:none}
  #focusGood:focus-visible{outline:3px solid blue}
</style>
</head>
<body>
<nav>
  <a href="#one" id="navOne">Widok jeden</a>
  <a href="#two" id="navTwo">Widok dwa</a>
  <a href="#nowhere" id="navBroken">Link donikad</a>
  <a href="/missing-page" id="navPathBroken">Link donikad (sciezka)</a>
  <!-- Cel ("/section") jest ZNANYM widokiem (patrz routesFromCli w samotescie), ale
       klikniecie tego linku nic nie robi (preventDefault) - powinien wyladowac w
       "brak reakcji", NIE zniknac po cichu tylko dlatego, ze jego cel jest rozpoznany. -->
  <a href="/section" id="deadPathLink" onclick="event.preventDefault()">Martwy link do znanego widoku</a>
  <!-- Hash-router "#/zagniezdzony" (wiodacy ukosnik PO hashu) - typowa forma w
       React Router/Vue Router/Angular w trybie hash. Dowod na regresje: naiwne
       stripowanie samego "#" dawaloby "/zagniezdzony", co WYGLADA jak sciezka URL -
       skaner ladowalby zupelnie inna strone niz ta pod tym hashem. -->
  <a href="#/nested" id="navNested">Widok zagnieżdżony (hash ze slashem)</a>
  <!-- Zwykly link "Strona glowna" - "/" musi byc rownowazne z '' (sentinel widoku-
       korzenia bez routingu hash, patrz discoverRoutes), inaczej kazda aplikacja
       jednostronicowa z takim linkiem dostaje falszywy alarm "cel nieznany". -->
  <a href="/" id="navHome">Strona głowna</a>
</nav>

<div id="view-one" class="view">
  <h1>Widok jeden</h1>
  <button id="deadBtn">Martwy przycisk (bez reakcji)</button>
  <button id="liveBtn" onclick="document.getElementById('liveOut').textContent='klikniety '+(++window._liveCount)">Zywy przycisk</button>
  <span id="liveOut"></span>
  <button id="errBtn" onclick="console.error('seeded console error')">Wywolaj blad konsoli</button>
  <button id="notFoundBtn" onclick="fetch('/api/nope')">Zapytanie 404</button>
  <button id="saveFailBtn" onclick="fetch('/api/save-fail',{method:'POST'})">Zapisz (zawiedzie 500)</button>
  <button id="saveOkBtn" onclick="fetch('/api/save-ok',{method:'POST'}).then(function(){var t=document.getElementById('toast');t.className='toast show';setTimeout(function(){t.className='toast'},4000)})">Zapisz (dziala)</button>
  <button id="focusBad">Bez widocznego focusu</button>
  <button id="focusGood">Z widocznym focusem</button>
  <!-- Wlasna kontrolka (nie <button>), wylaczona przez ARIA - el.disabled (natywna
       wlasciwosc) tego nie widzi. Onclick celowo obecny: gdyby filtr nie zadzialal,
       dowod bylby widoczny jako fałszywy klik, nie tylko brak zgloszenia. -->
  <div id="ariaDisabledBtn" role="button" tabindex="0" aria-disabled="true" onclick="document.getElementById('liveOut').textContent='NIE POWINNO SIE ZDARZYC'">Wyłączony (ARIA)</div>
  <!-- Zwykly link do fragmentu dokumentu (przewija do #anchorTarget nizej) - NIE
       jest trasa SPA, wiec nie powinien wyladowac jako "link donikad" tylko dlatego,
       ze "#anchorTarget" nie jest na liscie skanowanych widokow. -->
  <a href="#anchorTarget" id="navAnchor">Skocz do sekcji</a>
  <div id="anchorTarget">Cel kotwicy dokumentu</div>
  <!-- Martwy przycisk jako SVG (nie <button>) - el.className na elemencie SVG jest
       obiektem SVGAnimatedString, nie stringiem; martwy przycisk zapisany jako zwykly
       <button> (deadBtn wyzej) nigdy by tego nie zlapal. -->
  <svg id="deadSvgBtn" role="button" tabindex="0" width="24" height="24" class="icon"><circle cx="12" cy="12" r="10"/></svg>
  <div id="stuck" class="empty">Ładowanie danych...</div>
</div>

<div id="view-two" class="view">
  <h1>Widok dwa</h1>
  <p>Tu zaczyna sie pulapka klawiatury: Tab z pierwszego pola nie przechodzi dalej.</p>
  <button id="trapA">Pulapka A</button>
  <button id="trapB">Pulapka B (nieosiagalna Tabem)</button>
</div>

<div id="toast" class="toast"></div>

<script>
window._liveCount = 0;
function route(){
  var h = (location.hash||'#one').replace('#','');
  var el = document.getElementById('view-'+h);
  if(!el) return; // #nowhere: hash zmienia sie, ekran zostaje jak byl - seedowany
                   // "link do nieistniejacego widoku" (typowy ksztalt tego buga).
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active')});
  el.classList.add('active');
}
window.addEventListener('hashchange', route);
route();

// Pulapka klawiatury: na widoku "two", Tab z #trapA zawsze wraca focus na #trapA
// zamiast puscic dalej - klasyczny bug, nie zamierzony modal.
document.getElementById('trapA').addEventListener('keydown', function(e){
  if(e.key === 'Tab'){ e.preventDefault(); document.getElementById('trapA').focus(); }
});
</script>
</body>
</html>`;

app.get('/', (_q, r) => r.type('html').send(PAGE));
// Symuluje fallback typowy dla SPA z routingiem po sciezce: kazda nieznana sciezka
// dostaje 200, zeby dzialalo recznie wpisane odswiezenie adresu. Zwykly check sieci
// 4xx/5xx tego NIE zlapie (odpowiedz jest poprawna) - stad osobna galaz w classifyClick
// dla linkow tej samej domeny spoza listy skanowanych widokow. Tresc CELOWO inna niz
// PAGE (nie ma tu zadnego z przyciskow ponizej) - gdyby odzyskiwanie po dryfie sciezki
// (patrz "expectedPathname" w scanRoute) nie zadzialalo, kolejne elementy z listy
// probowalyby sie odnalezc na TEJ stronie i skonczylyby jako "zniknely" (staleSkipped)
// zamiast zostac realnie przetestowane po powrocie na widok startowy.
app.get('/missing-page', (_q, r) => r.type('html').send('<!doctype html><html><body><p id="fallback">Nieznana sciezka - fallback</p></body></html>'));
// Widok "po sciezce" (nie po hashu) BEZ zadnego linku zmieniajacego adres - klikniecie
// tu nigdy nie powinno wymusic pelnego przeladowania. Dowod na regresje: "route" tego
// widoku to "/section", ktory NIGDY nie rowna sie hashowi (ten zostaje pusty) - stara
// wersja porownania dryfu ("hash !== route" wprost) uznawalaby to za dryf po KAZDYM
// kliknieciu i przeladowywala strone, tracac cala reszte pomiarow.
app.get('/section', (_q, r) => r.type('html').send('<!doctype html><html><body>' +
  '<button id="quietBtn" onclick="document.getElementById(\'quietOut\').textContent=\'klikniety\'">Cichy przycisk</button>' +
  '<span id="quietOut"></span></body></html>'));
// Widok, ktory odpowiada dokumentem bledu (500), nie odrzuca polaczenia. Playwright nie
// rzuca wyjatku na takiej odpowiedzi - trzeba sprawdzic status ODPOWIEDZI, nie tylko
// czy nawigacja "sie udala" (page.goto() rozwiazuje sie normalnie nawet dla stron bledu).
app.get('/error-route', (_q, r) => r.status(500).type('html').send('<!doctype html><html><body>Blad serwera</body></html>'));
// Symuluje widok chroniony, do ktorego root NIE prowadzi (root jest publiczny, wiec
// ensureLoggedIn() nigdy nie zobaczy tego formularza) - odpowiada normalnym 200, ale
// tresc to ekran logowania, nie realny widok. Zwykly check statusu HTTP tego nie
// zlapie (200 to poprawna odpowiedz) - trzeba sprawdzic TRESC, nie tylko kod.
app.get('/protected', (_q, r) => r.type('html').send('<!doctype html><html><body>' +
  '<input type="password" id="loginPw"><button id="loginSubmit">Zaloguj</button></body></html>'));
app.get('/api/boot-fail', (_q, r) => r.status(500).json({ error: 'boom przy starcie' }));
// Widok, ktory psuje sie ZANIM cokolwiek zostanie kliknietě - blad konsoli i nieudane
// zapytanie leca z inline <script> od razu przy zaladowaniu. Dowod, ze nasluchy
// zalapaly sie PRZED nawigacja (patrz scanRoute) - gdyby zakladaly sie po niej, to
// wszystko znikaloby bez sladu, mimo ze "blad-konsoli" i "siec-5xx" to reklamowane
// kategorie tego skanera.
app.get('/boot-error', (_q, r) => r.type('html').send(`<!doctype html><html><body>
<p>Widok z bledem przy starcie</p>
<script>
console.error('seeded boot-time console error');
fetch('/api/boot-fail');
</script>
</body></html>`));

const PORT = process.env.FIXTURE_PORT || 4601;
const server = app.listen(PORT, () => console.log('[fixture] http://localhost:' + PORT));
module.exports = server;
