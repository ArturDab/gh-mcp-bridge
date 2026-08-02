---
name: playbook
description: "Reguly techniczno-operacyjne dla Claude. Sandbox, biblioteki, archetypy, three-up, referencje-lewar, light default, mikrointerakcje+120Hz, preview/prod linki, checklisty RAG, deep-research(+YT), Fable 5 (high nie xhigh, oszczedzanie tokenow). Trigger: reguly, playbook, jak budowac, workflow, Fable, sandbox."
metadata:
  author: artur
  version: "3.3.0"
---

# PLAYBOOK - reguly operacyjne dla Claude (CCOS)

> Zwiezle, egzekwowalne reguly techniczne DLA CLAUDE. Kontekst ekosystemu: docs/ECOSYSTEM.md.
> Ten plik jest dystrybuowany do wszystkich repo. Narracja i "dlaczego" (dla Artura, pod ksiazke):
> docs/CONTENT.md (NIE dystrybuowany).

## 1. Granice sandboxa Claude Code web (ZWERYFIKOWANE)
- Siec SERWEROWA (curl/git/npm/API) dziala wszedzie, w tym zewnetrzne CDN i URL-e deployu.
- Headless Chromium NIE tuneluje do zewnetrznych CDN ani URL-i deployu -> ERR_CONNECTION_RESET.
  Zywej strony ani strony z CDN NIE zaudytujesz wizualnie headless.
- Nawet file:// pada domyslnie, bo HTTPS_PROXY/https_proxy przeciekaja do przegladarki.
  FIX: uruchamiaj przegladarke z odcietym proxy DLA JEJ PROCESU:
    env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy node skrypt.mjs
  (NIE zdejmuj proxy globalnie - curl/git/npm go potrzebuja).
- Zeby headless zobaczyc strone z CDN: zvendoruj biblioteki lokalnie + odetnij proxy.
- Wizualne QA zywych stron = oko Artura na realnym preview, NIE Test headless.

## 2. Jednostka pracy: BUDUJ OD ZERA, nie lataj
- Latka OK tylko dla zmiany LOKALNEJ (jeden token/ikona/label).
- Zmiana strukturalna / wieloelementowa / rozlewna -> zbuduj sekcje OD NOWA ze specyfikacji.
- Dotyczy KAZDEJ powierzchni (Design i Code). Latasz PROMPT (bezpieczne), regenerujesz ARTEFAKT.
- Dwie osie: techniczna (buduj/lataj) + tworcza (zachowaj/przeprojektuj). Pinuj obie w specyfikacji.
- Produkcja daje CO (funkcje, dane, haki JS), nie JAK (wyglad). Przy redesignie NIE podsuwaj
  starego layoutu - kotwiczy model.
- Przed swiezym buildem: zarchiwizuj stare pliki (_archive/) - inaczej model kotwiczy na nich.

## 3. Biblioteki: znana luka -> narzucona biblioteka
Meta-regula: nie klep interaktywnych prymitywow recznie - uzyj gotowego (Radix/shadcn).
- Drag&drop -> @dnd-kit + @dnd-kit/sortable + @formkit/auto-animate.
  NIGDY react-beautiful-dnd (martwy) ani surowe HTML5 DnD.
- Dropdown/select -> shadcn Select/Combobox (Radix). NIGDY natywny <select> (lista nieostylowana).
- Date picker -> react-day-picker / shadcn Calendar+Popover. NIGDY natywny <input type=date>.
- Kwoty/liczby -> Intl.NumberFormat + tabular-nums. NIGDY reczne sklejanie stringow.
- Toast -> sonner. Modal -> shadcn Dialog. Tooltip/popover -> Radix. Ikony -> lucide-react.
- Tabele sortowalne/filtrowalne -> TanStack Table. Formularze -> React Hook Form + Zod.
- Loading -> shadcn Skeleton.

## 4. Estetyka (anti-slop) - KALIBRUJ per gatunek
- shadcn jest CELOWO neutralny. Premium bierze sie z NAKLADKI (tokeny + anti-slop + referencje),
  nie z samego shadcn.
- Baza: blok frontend_aesthetics (Cookbook Anthropic) w CLAUDE.md + skill ui-ux-pro-max.
- Kalibracja per gatunek (surowy blok jest pod KREATYWNE - na fintech szkodzi):
  - fintech/dashboard = POWSCIAGLIWY: bez atmosferycznych gradientow/wzorow w tle, tabular figures,
    jeden pewny akcent, realny kontrast, subtelna glebia.
  - marketing/kreatywny (Animails) = surowy distilled_aesthetics: surprise&delight, atmosferyczne
    tla, editorialne fonty.
  - editorial/tresc = czytelnia: dobra typografia, generous type, spokoj.
- Referencje wizualne (screeny) bija opisywanie przymiotnikami. Feedback punktowy, nie "zrob lepiej".
- Fonty: NIGDY Fraunces/Roboto/Arial/Space Grotesk. Inter DOZWOLONY swiadomie (nie slepy
  zakaz - duze serwisy go uzywaja), ale domyslnie siegaj po mniej oczywiste kroje z ZWERYFIKOWANYMI
  polskimi znakami. Gotowe pary: skill typography-library. Palety rol: skill palette-library.

## 5. Archetypy i warstwy
- React+shadcn = DOMYSLNY dla wiekszosci (pulsar, emailo, lyra, detektor-ai; money-hub jako React).
  Warstwy: shadcn/ui = szkielet (Radix+Tailwind, zachowanie) | tokeny+design.md+anti-slop = skora
  (per projekt) | React = montaz + logika.
- WordPress (raai, animails, beezu) = tlumaczenie tokenow na theme.json nieuniknione.
- Design-first ZAPARKOWANY: Code + referencje + budowa-od-zera pobilo Design na premium.
  Design wraca tylko jesli udowodni unikalna wartosc. Bannery/assety = Figma / image-gen, nie Design.

## 6. MCP / integracje
- Railway: MCP musi byc ZDALNY (https://mcp.railway.com) w .mcp.json lub konektor sesji.
  Lokalne `claude mcp add` NIE przenosi sie do Code web. (Skill use-railway = guidance przez CLI;
  bez MCP servera brak narzedzia do wolania z czatu/agenta.)
- WordPress web-kompatybilny: zdalny MCP na stronie (WPVibe / oficjalny MCP Adapter WP 6.9+).
  @wp-playground/mcp (stdio) NIE dziala w Code web.
- React: shadcn MCP deklarowany w repo .mcp.json (nie lokalnie).


## 7. Handoff pracy UI: ZAWSZE klikalny preview URL
- Praca UI NIE jest skonczona do oceny, dopoki nie jest ONLINE z klikalnym URL preview.
  Zanim poprosisz Artura o ocene wygladu, ZDEPLOYUJ efekt na preview (Railway; siec serwerowa
  z sandboxa dziala) i podaj klikalny URL do AKTUALNEJ wersji. Bez URL = praca nieskonczona.
- Screenshot NIE wystarcza - ma byc klikalny link, zeby Artur sam ocenil na zywo.
- Preview != produkcja: NIE ruszaj main/produkcji bez sygnalu Artura. Preview to osobny deploy.
- To egzekutor formatu CCOS ("Linki: Preview i Produkcja, klikalne, na koncu").

## 8. Typy commitow na galeziach eksperymentalnych
- Uzywaj TYLKO dozwolonych typow: feat/fix/chore/docs/style/refactor/perf/test/build/ci/revert.
  NIGDY wlasnych jak "experiment" - commitlint odrzuca je na KAZDYM commicie (falszywy czerwony).
  Na galezi eksperymentalnej rownie dobrze dziala feat:/chore:.


## 9. Domyslnie LIGHT, nie dark
- Prawie wszystkie projekty Artura sa light-mode. Domyslnie buduj i proponuj WERSJE LIGHT.
- Dark stosuj tylko gdy projekt wyraznie tego chce (dev tooling, gaming, monitoring) albo gdy Artur poprosi.
- Biblioteka palet (palette-library) ma dla kazdej palety pelny wariant light I dark - siegaj po light.

## 10. Start nowego, wizualnie-definiujacego ekranu = PYTAJ, nie zakladaj domyslnie THREE-UP
- Na starcie nowego ekranu definiujacego estetyke (zwykle glowny) NIE uruchamiaj three-up
  automatycznie. Zapytaj wprost: "chcesz three-up czy od razu jeden kierunek?".
- Jesli Artur wybiera three-up: Krok 1 - zbuduj TRZY warianty jako STATYCZNE, WYSOKIEJ WIERNOSCI
  makiety - pelny wyglad, realistyczne dane, ale BEZ podpinania logiki i animacji (jak komplet
  komp od grafika). Rozne kierunki estetyczne. Tanie i szybkie.
- Kazda makieta na WLASNYM klikalnym preview URL (sekcja 7). Statyczne = moze byc pojedynczy
  plik HTML zdeployowany na preview. Bez URL = nie do oceny.
- Artur wybiera JEDEN kierunek.
- Krok 2: dopiero zwyciezca dostaje pelna budowe - funkcjonalny, animowany, podpiety do danych.
  Reszta apki idzie juz w tym kierunku (nie 3x cala apka).
- Makiety MUSZA byc wysokiej wiernosci (prawdziwy wyglad), nie wireframe - inaczej test smaku
  jest bezwartosciowy. Warianty rozniaj modelem (Sonnet vs Opus daja rozna estetyke), kalibracja
  anti-slop, paleta, referencjami.
- Zwyciezce mozna zbudowac modelem dokladniejszym technicznie (Opus), nawet jesli estetyke
  wybrales z wariantu innego modelu.
- Jesli Artur wybiera "od razu jeden kierunek": pomin Krok 1, buduj wprost pelna wersje z
  referencjami (sekcja 11).


## 11. Referencje wizualne = NAJWIEKSZY lewar (podstawa)
- REFERENCJE SA PODSTAWA. Empirycznie na money-hub: trzy warianty three-up byly OK; dopiero po
  DODANIU REFERENCJI wizualnych wyszla petarda. Roznica miedzy "kompetentne" a "petarda" to
  referencje, nie sam prompt.
- Do kazdej budowy/makiety dawaj KONKRETNE referencje (screeny, linki do stron/produktow w duchu
  ktorych ma byc). Referencje bija opisywanie przymiotnikami - zawsze.
- W three-up: kazdy z trzech wariantow zakotwicz w innej referencji - to daje realny rozrzut smaku,
  nie trzy przymiotniki.


## 12. Mikrointerakcje = czesc KAZDEGO buildu (pierwsza ruchoma wersja juz je ma)
- Warstwe ruchu zamawiaj W PROMPCIE BUDUJACYM, nie jako osobny przebieg. Pierwsza dzialajaca wersja
  MUSI juz miec animacje. Osobny przebieg tylko do dostrojenia intensywnosci.
- Zakres domyslny: press/hover, hover-lift wierszy, wjazd/wyjazd list (@formkit/auto-animate),
  count-up liczb, rysowanie wykresu, animacja paskow (kredyty/kategorie), przejscia zakladek,
  wysuw bottom-sheet, skeletony ladowania, stagger wejscia, mikro-feedback zapisu ("Zapisano").
- Kanon (fintech = subtelnie): 120-280ms, tokeny --dur/--ease uzyte wszedzie, tylko transform/opacity
  (GPU), poszanowanie prefers-reduced-motion. W razie watpliwosci MNIEJ.
- 120 Hz (wiekszosc telefonow): animacje JS OPARTE NA CZASIE (progress = elapsed/duration z delty
  rAF timestamp), NIE na liczbie klatek - inaczej 2x za szybko na 120Hz. requestAnimationFrame,
  nie setInterval; nie ograniczaj do 60fps. Perpetualny ruch tani + pauzuj gdy karta niewidoczna
  (visibilitychange/IntersectionObserver) i przy reduced-motion (bateria). will-change tylko na czas
  animacji.
- Weryfikacja mikrointerakcji odbywa sie przez CZYTANIE KODU/DIFFU, NIE przez renderowanie i ocene
  wizualna: sprawdz w kodzie timing (120-280ms), ze animowane sa tylko transform/opacity, obecnosc
  prefers-reduced-motion i uzycie rAF (nie setInterval). Ocene estetyki ruchu zawsze robi Artur na
  zywym preview - to nie jest krok Claude.


## 13. Zakaz samo-check-inow na PR-ach (send_later / scheduled) [WZMOCNIONA]
- Claude Code NIE planuje cyklicznych self-check-inow ani scheduled triggerow (send_later /
  create_trigger) do pilnowania PR-ow czy zadan - NIGDY, bez wyjatkow typu "tylko raz, zeby
  sprawdzic czy sie zmergowalo".
- Incydent-precedens (dlaczego ta regula jest twarda): jedna sesja uzbroila sobie **39 kolejnych
  self-check-inow** pilnujacych jednego PR-a - kazdy zjadal tokeny, zaden nie byl proszony przez
  Artura. Tak wyglada awaria tej reguly w praktyce. Nie powtarzaj tego wzorca w zadnej formie,
  takze jako "sprawdze recznie za X minut" powtarzane w petli w tej samej sesji.
- Po skonczeniu zadania: podaj wynik (URL preview, co zrobione) i ZAKONCZ. Nic wiecej.
- Jedynym trwalym stanem miedzy sesjami jest REPO (i dokumentacja: STATE.md/ECOSYSTEM.md), NIE
  zaplanowane triggery. Cykliczne check-iny zjadaja tokeny i sa halasem dla Artura - nie uzbrajaj ich.
- Jesli cos wymaga powrotu, zostaw to jako pozycje w handoffie/dokumentacji, NIGDY jako budzik.
- Jedyny wyjatek: Artur WPROST prosi o konkretny, jednorazowy scheduled task (np. "przypomnij mi
  za godzine o X") - to jego decyzja per zdarzenie, nie samowolka Claude.

---

## R14. Linki Preview i Produkcja — ZAWSZE na koncu
Kazda odpowiedz konczaca prace nad UI konczy sie KLIKALNYMI linkami: **Preview** (obowiazkowo) i
**Produkcja** (jesli istnieje). Bez klikalnego preview praca nie jest do oceny.

## R15. Checklisty z flagami (RAG) przy checkpoint / handoff / testach / review
Przy kazdym checkpoincie, handoffie, tescie funkcji i review promptu przejdz checkliste i oflaguj
KAZDA pozycje: 🟢 / 🟡 / 🔴. Zolty i czerwony ZAWSZE z jednym zdaniem "czego brakuje". Nic domyslnie,
nic nie przechodzi przez sito.

## R16. Deep-research jako metoda zdobywania wiedzy
Przy nowym obszarze: najpierw deep-research w zewnetrznym narzedziu (ChatGPT / Perplexity / Gemini)
po praktyczna, aktualna wiedze, potem analiza, eksperyment i wcielenie do repo/skilli. Sprawdzony
sposob - stosuj domyslnie, nie zgaduj tam, gdzie research da fakty.

## R17. Testy WSZYSTKICH funkcji (szczegolnie duze narzedzia)
Przed produkcja: automatyczny test KAZDEJ wdrozonej funkcji, nie wyrywkowo. W duzych narzedziach
(np. Pulsar) luki w testach byly regula - domykaj je. Pod granice sandboxa: Playwright lokalnie/
zvendorowane + proxy odciete + oko Artura na preview, nie headless zywej strony.

---


## R18. Metoda checklist — wszedzie gdzie proces ma wiele rzeczy do przegapienia
Kazdy powtarzalny proces z wieloma elementami (koniec sesji CC, przed produkcja, review promptu,
start nowego projektu, handoff) dostaje CHECKLISTE w formie realnych checkboxow, nie prozy.
Kazda pozycja oflagowana 🟢/🟡/🔴 (patrz R15). Zolty/czerwony zawsze z jednym zdaniem "czego
brakuje". Checklisty zyja w tym skillu (wzorce ogolne, Zalacznik R18) i per-repo w STATE.md (checklisty
specyficzne dla projektu). Nowy powtarzalny proces bez checklisty = brak, do uzupelnienia.

## R19. Stabilnosc dostepu do narzedzi — sprawdz, zanim powiesz "nie moge"
Zanim Claude (czat lub CC) stwierdzi brak dostepu do narzedzia/konektora/MCP, MUSI najpierw
sprawdzic (tool_search / rzeczywista proba), a nie zakladac z pamieci poprzedniej sesji.
Dostepne w tym ekosystemie (stan 2026-07-20, weryfikuj przy watpliwosci): Railway MCP (list-
projects/list-services/get-status/railway-agent/redeploy/get-logs/accept-deploy), Figma MCP,
Vercel MCP, GitHub przez wklejony PAT (do czasu podlaczenia connectora), image_search, web_search/
web_fetch, Magnific (image gen). "Nie mam dostepu" bez wczesniejszej proby jest zakazane (patrz
tez ogolna zasada Artura: proba przed werdyktem).

## R20. Deep-research — rozszerzone o zrodla wideo (YouTube)
Uzupelnienie R16: przy nowym obszarze researchuj rowniez YouTube (praktyczne know-how, nie tylko
tekstowe zrodla). Procedura: (1) web_search po temacie + "youtube" zeby namierzyc wlasciwe kanaly/
filmy, (2) jesli material warty ekstrakcji - Artur wkleja link lub transkrypcje (kopiuje z panelu
transkrypcji YouTube), Claude analizuje i wciela, (3) Claude NIE ma bezposredniego, niezawodnego
dostepu do tresci wideo/audio ani automatycznej transkrypcji - to rola Artura w tej procedurze,
nie do udawania inaczej.

## Zalacznik R18 - szablony checklist

## Koniec sesji Claude Code (end-session)
```
[ ] Kod działa - realnie sprawdzony (dowód, nie deklaracja "gotowe")
[ ] Build/lint przeszedł - wynik wklejony, nie "powinno działać"
[ ] Deploy na preview - klikalny URL podany
[ ] Zmiany opisane w STATE.md repo
[ ] Nic nie skasowane niechcący (diff sprawdzony, jeśli przeróbka istniejącego pliku)
[ ] Link Preview + Produkcja na końcu (Produkcja tylko jeśli dotyczy)
[ ] Nowy dług/otwarty wątek wypisany, nie zgubiony
```

## Przed produkcją (przed mergem na main/deploy żywy)
```
[ ] Wszystkie funkcje z listy przetestowane (nie wyrywkowo - R17)
[ ] Oko Artura na preview (nie tylko headless/automatyczny test)
[ ] Dane nie zostały nadpisane/zresetowane bez potrzeby
[ ] Sygnał Artura wyraźnie dany (nie domniemany)
[ ] Rollback/backup dostępny, gdyby coś poszło źle
```

## Review promptu / makiety / referencji
```
[ ] Referencje konkretne (screeny/linki), nie same przymiotniki
[ ] Terminy dwuznaczne zdefiniowane z kontrą "to X, NIE Y"
[ ] Model dopasowany do zadania (budowa=Sonnet, sweep/diagnoza=Opus)
[ ] Zakres jasny: jeden ekran czy cała apka
[ ] Kryterium sukcesu jawnie podane, nie domyślne
```

## Start nowego projektu/tematu
```
[ ] Cel i zakres spisane (nie tylko w głowie)
[ ] Referencje wizualne/merytoryczne zebrane PRZED promptowaniem
[ ] Archetyp/linia wizualna ustalona (współna dla wewnętrznych narzędzi czy osobna)
[ ] Środowisko CC właściwe (repo, branch stagingu, ew. dedykowane środowisko)
[ ] STATE.md repo założony/zaktualizowany
```

## Checkpoint centralny / projektowy
Patrz osobne pliki: `checkpoint.md` (centralna CCOS) i `checkpoint-projekt.md` (Pulsar/RAAI/inne).

## R21. Promptowanie Fable 5 - INNE niz Opus (oficjalne docs + konsensus power-userow 2026-07)
Fable 5 (rodzina Claude 5, ponad Opusem) wymaga ODWROTNEGO stylu niz Opus. Zrodla: docs Anthropic
+ transkrypcje power-userow (Theo/t3, designcourse, Duncan Rogoff, Jack).

STYL PROMPTU (framework GOAL):
- G - Ugruntuj w prawdzie: kaz PRZECZYTAC istniejacy kod/system ZANIM zacznie budowac ("read all
  of it first"). Redukuje rework.
- O - Cel (outcome), nie rozkazy (orders): opisz stan koncowy ("done"), nie kroki. Fable sam wymysla
  "jak". Rozpisane fazy (styl Opusa) DUSZA go i pogarszaja wynik.
- A - Autonomia nad sciezka: oddaj decyzje "jak/w jakiej kolejnosci". Mikrozarzadzanie = gorszy wynik.
- L - Petla dowodu (loop-in-proof): kaz weryfikowac (build/render/browser), zatrzymac sie na
  decyzjach nieodwracalnych, pokazac before/after.

EFFORT - KOREKTA (wczesniej blednie zalecalem xhigh):
- **HIGH to sweet spot, takze dla trudnych zadan.** Konsensus power-userow (najmocniej Theo): xhigh/
  max/ultracode PRZEMYSLIWUJA (overthink) kazdy krok, second-guessuja sie, daja czesto GORSZY,
  przekombinowany kod przy absurdalnie wyzszym koszcie. "Ultracode uzywa high pod spodem, tylko
  mnozy subagentow" - wiec high to domyslny wybor Anthropic nie przypadkiem.
- Kluczowy mechanizm: effort steruje mysleniem NA KROK/tool-call, NIE dlugoscia biegu. Zadanie na
  500 krokow (jak redesign) i tak przejdzie 500 krokow na high; xhigh tylko przemiele kazdy krok
  za mocno. Dlugosc biegu zalezy od liczby krokow, nie od effortu.
- Oficjalne docs dopuszczaja xhigh "dla najbardziej capability-sensitive workloadow" - ale realna
  praktyka + cel oszczedzania tokenow => HIGH. xhigh tylko jesli high udowodni, ze nie wystarcza.

OSZCZEDZANIE TOKENOW (bez ograniczania mozliwosci):
- HIGH zamiast xhigh - najwiekszy pojedynczy lewar (koszt i jakosc naraz).
- Instrukcja zwiezlosci: "nie omawiaj szczegolowo kazdego kroku; lead with outcome; podsumowanie na
  koniec, nie narracja w trakcie". Fable nieustereowany elaboruje ponad potrzebe.
- NIE kazac echo'wac/opisywac rozumowania (pulapka reasoning_extraction -> odmowa -> po cichu
  fallback na Opusa 4.8; czyli przestaje byc Fable A koszt inny).
- Delegacja mechanicznej roboty do TANSZYCH modeli przez subagentow (inwentaryzacja, grep, zrzuty):
  "Opus prowadzi sale, tansze modele robia powtorki". Fable orkiestruje, tansze wykonuja.
- Ugruntowanie w prawdzie na starcie = mniej reworku = mniej tokenow.
- Uziemiaj deklaracje postepu wynikiem narzedzia (Fable przy dlugich biegach zawyza status).
- Fable ~2x koszt Opusa za bieg - dlatego pierwszy prompt ma byc trafny; koszt siedzi w bledach
  i przemysleniu, nie w samym modelu.

INNE:
- Dawaj zadanie z GORNEJ polki trudnosci (single-pass systemy, ktore wczesniej braly dni).
- Dawaj POWOD ("po co"): "pracuje nad X dla Y, potrzebuja Z, wiec: [request]".
- "Gdy masz dosc informacji, dzialaj" - zeby nie przeplanowywal przy niejednoznacznosci.
- Skille pisane pod starsze modele bywaja zbyt preskryptywne dla Fable - odchudzic przy migracji.

## R22. railway-agent tylko do zadan zlozonych - narzedzia bezposrednie domyslnie
Domyslnie uzywaj BEZPOSREDNICH narzedzi Railway MCP (list-projects, list-services, get-status,
get-service-config, get-service-metrics, get-logs, list-variables, set-variables, list-domains,
list-deployments) do rutynowych odczytow i pojedynczych zmian - sa tansze i szybsze, bez narzutu
dodatkowego modelu-agenta.

Siegaj po `railway-agent` TYLKO gdy zadanie jest genuinie zlozone/otwarte: diagnostyka
wieloserwisowa bez jasnej przyczyny, incydent produkcyjny wymagajacy rozumowania po stronie
Railway, operacja rozciagnieta na wiele niepewnych krokow, gdzie bezposrednie narzedzia same nie
wystarcza do zbudowania planu.

Powod: `railway-agent` byl nadmiernie uzywany do prostych, jednorazowych odczytow (np. "czy serwis
dziala", "jakie sa zmienne"), co niepotrzebnie podnosilo koszt bez realnej korzysci - bezposrednie
narzedzie daje ta sama odpowiedz taniej i szybciej. Nie powielaj tego wzorca.
