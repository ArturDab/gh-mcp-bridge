---
name: playbook
description: "Reguły techniczno-operacyjne dla Claude. Sandbox, biblioteki, archetypy, three-up, referencje-lewar, light default, mikrointerakcje+120Hz, preview/prod linki, checklisty RAG, deep-research(+YT), Fable 5 (high nie xhigh, oszczędzanie tokenów). Trigger: reguły, playbook, jak budować, workflow, Fable, sandbox."
metadata:
  author: artur
  version: "3.3.0"
---

# PLAYBOOK - reguły operacyjne dla Claude (CCOS)

> Zwięzłe, egzekwowalne reguły techniczne DLA CLAUDE. Kontekst ekosystemu: docs/ECOSYSTEM.md.
> Ten plik jest dystrybuowany do wszystkich repo. Narracja i "dlaczego" (dla Artura, pod książkę):
> docs/CONTENT.md (NIE dystrybuowany).

## 1. Granice sandboxa Claude Code web (ZWERYFIKOWANE)
- Sieć SERWEROWA (curl/git/npm/API) działa wszędzie, w tym zewnętrzne CDN i URL-e deployu.
- Headless Chromium NIE tuneluje do zewnętrznych CDN ani URL-i deployu -> ERR_CONNECTION_RESET.
  Żywej strony ani strony z CDN NIE zaudytujesz wizualnie headless.
- Nawet file:// pada domyślnie, bo HTTPS_PROXY/https_proxy przeciekają do przeglądarki.
  FIX: uruchamiaj przeglądarkę z odciętym proxy DLA JEJ PROCESU:
    env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy node skrypt.mjs
  (NIE zdejmuj proxy globalnie - curl/git/npm go potrzebują).
- Żeby headless zobaczyć stronę z CDN: zvendoruj biblioteki lokalnie + odetnij proxy.
- Wizualne QA żywych stron = oko Artura na realnym preview, NIE Test headless.

## 2. Jednostka pracy: BUDUJ OD ZERA, nie łataj
- Łatka OK tylko dla zmiany LOKALNEJ (jeden token/ikona/label).
- Zmiana strukturalna / wieloelementowa / rozlewna -> zbuduj sekcję OD NOWA ze specyfikacji.
- Dotyczy KAŻDEJ powierzchni (Design i Code). Łatasz PROMPT (bezpieczne), regenerujesz ARTEFAKT.
- Dwie osie: techniczna (buduj/łataj) + twórcza (zachowaj/przeprojektuj). Pinuj obie w specyfikacji.
- Produkcja daje CO (funkcje, dane, haki JS), nie JAK (wygląd). Przy redesignie NIE podsuwaj
  starego layoutu - kotwiczy model.
- Przed świeżym buildem: zarchiwizuj stare pliki (_archive/) - inaczej model kotwiczy na nich.

## 3. Biblioteki: znana luka -> narzucona biblioteka
Meta-reguła: nie klep interaktywnych prymitywów ręcznie - użyj gotowego (Radix/shadcn).
- Drag&drop -> @dnd-kit + @dnd-kit/sortable + @formkit/auto-animate.
  NIGDY react-beautiful-dnd (martwy) ani surowe HTML5 DnD.
- Dropdown/select -> shadcn Select/Combobox (Radix). NIGDY natywny <select> (lista nieostylowana).
- Date picker -> react-day-picker / shadcn Calendar+Popover. NIGDY natywny <input type=date>.
- Kwoty/liczby -> Intl.NumberFormat + tabular-nums. NIGDY ręczne sklejanie stringów.
- Toast -> sonner. Modal -> shadcn Dialog. Tooltip/popover -> Radix. Ikony -> lucide-react.
- Tabele sortowalne/filtrowalne -> TanStack Table. Formularze -> React Hook Form + Zod.
- Loading -> shadcn Skeleton.

## 4. Estetyka (anti-slop) - KALIBRUJ per gatunek
- shadcn jest CELOWO neutralny. Premium bierze się z NAKŁADKI (tokeny + anti-slop + referencje),
  nie z samego shadcn.
- Baza: blok frontend_aesthetics (Cookbook Anthropic) w CLAUDE.md + skill ui-ux-pro-max.
- Kalibracja per gatunek (surowy blok jest pod KREATYWNE - na fintech szkodzi):
  - fintech/dashboard = POWŚCIĄGLIWY: bez atmosferycznych gradientów/wzorów w tle, tabular figures,
    jeden pewny akcent, realny kontrast, subtelna głębia.
  - marketing/kreatywny (Animails) = surowy distilled_aesthetics: surprise&delight, atmosferyczne
    tła, editorialne fonty.
  - editorial/treść = czytelnia: dobra typografia, generous type, spokój.
- Referencje wizualne (screeny) biją opisywanie przymiotnikami. Feedback punktowy, nie "zrób lepiej".
- Fonty: NIGDY Fraunces/Roboto/Arial/Space Grotesk. Inter DOZWOLONY świadomie (nie ślepy
  zakaz - duże serwisy go używają), ale domyślnie sięgaj po mniej oczywiste kroje z ZWERYFIKOWANYMI
  polskimi znakami. Gotowe pary: skill typography-library. Palety ról: skill palette-library.

## 5. Archetypy i warstwy
- React+shadcn = DOMYŚLNY dla większości (pulsar, emailo, lyra, detektor-ai; money-hub jako React).
  Warstwy: shadcn/ui = szkielet (Radix+Tailwind, zachowanie) | tokeny+design.md+anti-slop = skóra
  (per projekt) | React = montaż + logika.
- WordPress (raai, animails, beezu) = tłumaczenie tokenów na theme.json nieuniknione.
- Design-first ZAPARKOWANY: Code + referencje + budowa-od-zera pobiło Design na premium.
  Design wraca tylko jeśli udowodni unikalną wartość. Bannery/assety = Figma / image-gen, nie Design.

## 6. MCP / integracje
- Railway: MCP musi być ZDALNY (https://mcp.railway.com) w .mcp.json lub konektor sesji.
  Lokalne `claude mcp add` NIE przenosi się do Code web. (Skill use-railway = guidance przez CLI;
  bez MCP servera brak narzędzia do wołania z czatu/agenta.)
- WordPress web-kompatybilny: zdalny MCP na stronie (WPVibe / oficjalny MCP Adapter WP 6.9+).
  @wp-playground/mcp (stdio) NIE działa w Code web.
- React: shadcn MCP deklarowany w repo .mcp.json (nie lokalnie).


## 7. Handoff pracy UI: ZAWSZE klikalny preview URL
- Praca UI NIE jest skończona do oceny, dopóki nie jest ONLINE z klikalnym URL preview.
  Zanim poprosisz Artura o ocenę wyglądu, ZDEPLOYUJ efekt na preview (Railway; sieć serwerowa
  z sandboxa działa) i podaj klikalny URL do AKTUALNEJ wersji. Bez URL = praca nieskończona.
- Screenshot NIE wystarcza - ma być klikalny link, żeby Artur sam ocenił na żywo.
- Preview != produkcja: NIE ruszaj main/produkcji bez sygnału Artura. Preview to osobny deploy.
- To egzekutor formatu CCOS ("Linki: Preview i Produkcja, klikalne, na końcu").

## 8. Typy commitów na gałęziach eksperymentalnych
- Używaj TYLKO dozwolonych typów: feat/fix/chore/docs/style/refactor/perf/test/build/ci/revert.
  NIGDY własnych jak "experiment" - commitlint odrzuca je na KAŻDYM commicie (fałszywy czerwony).
  Na gałęzi eksperymentalnej równie dobrze działa feat:/chore:.


## 9. Domyślnie LIGHT, nie dark
- Prawie wszystkie projekty Artura są light-mode. Domyślnie buduj i proponuj WERSJE LIGHT.
- Dark stosuj tylko gdy projekt wyraźnie tego chce (dev tooling, gaming, monitoring) albo gdy Artur poprosi.
- Biblioteka palet (palette-library) ma dla każdej palety pełny wariant light I dark - sięgaj po light.

## 10. Start nowego, wizualnie-definiującego ekranu = PYTAJ, nie zakładaj domyślnie THREE-UP
- Na starcie nowego ekranu definiującego estetykę (zwykle główny) NIE uruchamiaj three-up
  automatycznie. Zapytaj wprost: "chcesz three-up czy od razu jeden kierunek?".
- Jeśli Artur wybiera three-up: Krok 1 - zbuduj TRZY warianty jako STATYCZNE, WYSOKIEJ WIERNOŚCI
  makiety - pełny wygląd, realistyczne dane, ale BEZ podpinania logiki i animacji (jak komplet
  komp od grafika). Różne kierunki estetyczne. Tanie i szybkie.
- Każda makieta na WŁASNYM klikalnym preview URL (sekcja 7). Statyczne = może być pojedynczy
  plik HTML zdeployowany na preview. Bez URL = nie do oceny.
- Artur wybiera JEDEN kierunek.
- Krok 2: dopiero zwycięzca dostaje pełną budowę - funkcjonalny, animowany, podpięty do danych.
  Reszta apki idzie już w tym kierunku (nie 3x cała apka).
- Makiety MUSZĄ być wysokiej wierności (prawdziwy wygląd), nie wireframe - inaczej test smaku
  jest bezwartościowy. Warianty różniaj modelem (Sonnet vs Opus dają różną estetykę), kalibracja
  anti-slop, paleta, referencjami.
- Zwycięzcę można zbudować modelem dokładniejszym technicznie (Opus), nawet jeśli estetykę
  wybrałeś z wariantu innego modelu.
- Jeśli Artur wybiera "od razu jeden kierunek": pomiń Krok 1, buduj wprost pełną wersję z
  referencjami (sekcja 11).


## 11. Referencje wizualne = NAJWIĘKSZY lewar (podstawa)
- REFERENCJE SĄ PODSTAWĄ. Empirycznie na money-hub: trzy warianty three-up były OK; dopiero po
  DODANIU REFERENCJI wizualnych wyszła petarda. Różnica między "kompetentne" a "petarda" to
  referencje, nie sam prompt.
- Do każdej budowy/makiety dawaj KONKRETNE referencje (screeny, linki do stron/produktów w duchu
  których ma być). Referencje biją opisywanie przymiotnikami - zawsze.
- W three-up: każdy z trzech wariantów zakotwicz w innej referencji - to daje realny rozrzut smaku,
  nie trzy przymiotniki.


## 12. Mikrointerakcje = część KAŻDEGO buildu (pierwsza ruchoma wersja już je ma)
- Warstwę ruchu zamawiaj W PROMPCIE BUDUJĄCYM, nie jako osobny przebieg. Pierwsza działająca wersja
  MUSI już mieć animacje. Osobny przebieg tylko do dostrojenia intensywności.
- Zakres domyślny: press/hover, hover-lift wierszy, wjazd/wyjazd list (@formkit/auto-animate),
  count-up liczb, rysowanie wykresu, animacja pasków (kredyty/kategorie), przejścia zakładek,
  wysuw bottom-sheet, skeletony ładowania, stagger wejścia, mikro-feedback zapisu ("Zapisano").
- Kanon (fintech = subtelnie): 120-280ms, tokeny --dur/--ease użyte wszędzie, tylko transform/opacity
  (GPU), poszanowanie prefers-reduced-motion. W razie wątpliwości MNIEJ.
- 120 Hz (większość telefonów): animacje JS OPARTE NA CZASIE (progress = elapsed/duration z delty
  rAF timestamp), NIE na liczbie klatek - inaczej 2x za szybko na 120Hz. requestAnimationFrame,
  nie setInterval; nie ograniczaj do 60fps. Perpetualny ruch tani + pauzuj gdy karta niewidoczna
  (visibilitychange/IntersectionObserver) i przy reduced-motion (bateria). will-change tylko na czas
  animacji.
- Weryfikacja mikrointerakcji odbywa się przez CZYTANIE KODU/DIFFU, NIE przez renderowanie i ocenę
  wizualną: sprawdź w kodzie timing (120-280ms), że animowane są tylko transform/opacity, obecność
  prefers-reduced-motion i użycie rAF (nie setInterval). Ocenę estetyki ruchu zawsze robi Artur na
  żywym preview - to nie jest krok Claude.


## 13. Zakaz samo-check-inów na PR-ach (send_later / scheduled) [WZMOCNIONA]
- Claude Code NIE planuje cyklicznych self-check-inów ani scheduled triggerów (send_later /
  create_trigger) do pilnowania PR-ów czy zadań - NIGDY, bez wyjątków typu "tylko raz, żeby
  sprawdzić czy się zmergowało".
- Incydent-precedens (dlaczego ta reguła jest twarda): jedna sesja uzbroiła sobie **39 kolejnych
  self-check-inów** pilnujących jednego PR-a - każdy zjadał tokeny, żaden nie był proszony przez
  Artura. Tak wygląda awaria tej reguły w praktyce. Nie powtarzaj tego wzorca w żadnej formie,
  także jako "sprawdzę ręcznie za X minut" powtarzane w pętli w tej samej sesji.
- Po skończeniu zadania: podaj wynik (URL preview, co zrobione) i ZAKOŃCZ. Nic więcej.
- Jedynym trwałym stanem między sesjami jest REPO (i dokumentacja: STATE.md/ECOSYSTEM.md), NIE
  zaplanowane triggery. Cykliczne check-iny zjadają tokeny i są hałasem dla Artura - nie uzbrajaj ich.
- Jeśli coś wymaga powrotu, zostaw to jako pozycję w handoffie/dokumentacji, NIGDY jako budzik.
- Jedyny wyjątek: Artur WPROST prosi o konkretny, jednorazowy scheduled task (np. "przypomnij mi
  za godzinę o X") - to jego decyzja per zdarzenie, nie samowolka Claude.

---

## R14. Linki Preview i Produkcja — ZAWSZE na końcu
Każda odpowiedź kończąca pracę nad UI kończy się KLIKALNYMI linkami: **Preview** (obowiązkowo) i
**Produkcja** (jeśli istnieje). Bez klikalnego preview praca nie jest do oceny.

## R15. Checklisty z flagami (RAG) przy checkpoint / handoff / testach / review
Przy każdym checkpoincie, handoffie, teście funkcji i review promptu przejdź checklistę i oflaguj
KAŻDĄ pozycję: 🟢 / 🟡 / 🔴. Żółty i czerwony ZAWSZE z jednym zdaniem "czego brakuje". Nic domyślnie,
nic nie przechodzi przez sito.

## R16. Deep-research jako metoda zdobywania wiedzy
Przy nowym obszarze: najpierw deep-research w zewnętrznym narzędziu (ChatGPT / Perplexity / Gemini)
po praktyczną, aktualną wiedzę, potem analiza, eksperyment i wcielenie do repo/skilli. Sprawdzony
sposób - stosuj domyślnie, nie zgaduj tam, gdzie research da fakty.

## R17. Testy WSZYSTKICH funkcji (szczególnie duże narzędzia)
Przed produkcją: automatyczny test KAŻDEJ wdrożonej funkcji, nie wyrywkowo. W dużych narzędziach
(np. Pulsar) luki w testach były regułą - domykaj je. Pod granice sandboxa: Playwright lokalnie/
zvendorowane + proxy odcięte + oko Artura na preview, nie headless żywej strony.

---


## R18. Metoda checklist — wszędzie gdzie proces ma wiele rzeczy do przegapienia
Każdy powtarzalny proces z wieloma elementami (koniec sesji CC, przed produkcją, review promptu,
start nowego projektu, handoff) dostaje CHECKLISTĘ w formie realnych checkboxów, nie prozy.
Każda pozycja oflagowana 🟢/🟡/🔴 (patrz R15). Żółty/czerwony zawsze z jednym zdaniem "czego
brakuje". Checklisty żyją w tym skillu (wzorce ogólne, Załącznik R18) i per-repo w STATE.md (checklisty
specyficzne dla projektu). Nowy powtarzalny proces bez checklisty = brak, do uzupełnienia.

## R19. Stabilność dostępu do narzędzi — sprawdź, zanim powiesz "nie mogę"
Zanim Claude (czat lub CC) stwierdzi brak dostępu do narzędzia/konektora/MCP, MUSI najpierw
sprawdzić (tool_search / rzeczywista próba), a nie zakładać z pamięci poprzedniej sesji.
Dostępne w tym ekosystemie (stan 2026-07-20, weryfikuj przy wątpliwości): Railway MCP (list-
projects/list-services/get-status/railway-agent/redeploy/get-logs/accept-deploy), Figma MCP,
Vercel MCP, GitHub przez wklejony PAT (do czasu podłączenia connectora), image_search, web_search/
web_fetch, Magnific (image gen). "Nie mam dostępu" bez wcześniejszej próby jest zakazane (patrz
też ogólna zasada Artura: próba przed werdyktem).

## R20. Deep-research — rozszerzone o źródła wideo (YouTube)
Uzupełnienie R16: przy nowym obszarze researchuj również YouTube (praktyczne know-how, nie tylko
tekstowe źródła). Procedura: (1) web_search po temacie + "youtube" żeby namierzyć właściwe kanały/
filmy, (2) jeśli materiał warty ekstrakcji - Artur wkleja link lub transkrypcję (kopiuje z panelu
transkrypcji YouTube), Claude analizuje i wciela, (3) Claude NIE ma bezpośredniego, niezawodnego
dostępu do treści wideo/audio ani automatycznej transkrypcji - to rola Artura w tej procedurze,
nie do udawania inaczej.

## Załącznik R18 - szablony checklist

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

## R21. Promptowanie Fable 5 - INNE niż Opus (oficjalne docs + konsensus power-userów 2026-07)
Fable 5 (rodzina Claude 5, ponad Opusem) wymaga ODWROTNEGO stylu niż Opus. Źródła: docs Anthropic
+ transkrypcje power-userów (Theo/t3, designcourse, Duncan Rogoff, Jack).

STYL PROMPTU (framework GOAL):
- G - Ugruntuj w prawdzie: każ PRZECZYTAĆ istniejący kod/system ZANIM zacznie budować ("read all
  of it first"). Redukuje rework.
- O - Cel (outcome), nie rozkazy (orders): opisz stan końcowy ("done"), nie kroki. Fable sam wymyśla
  "jak". Rozpisane fazy (styl Opusa) DUSZĄ go i pogarszają wynik.
- A - Autonomia nad ścieżką: oddaj decyzję "jak/w jakiej kolejności". Mikrozarządzanie = gorszy wynik.
- L - Pętla dowodu (loop-in-proof): każ weryfikować (build/render/browser), zatrzymać się na
  decyzjach nieodwracalnych, pokazać before/after.

EFFORT - KOREKTA (wcześniej błędnie zalecałem xhigh):
- **HIGH to sweet spot, także dla trudnych zadań.** Konsensus power-userów (najmocniej Theo): xhigh/
  max/ultracode PRZEMYŚLIWUJĄ (overthink) każdy krok, second-guessują się, dają często GORSZY,
  przekombinowany kod przy absurdalnie wyższym koszcie. "Ultracode używa high pod spodem, tylko
  mnoży subagentów" - więc high to domyślny wybór Anthropic nie przypadkiem.
- Kluczowy mechanizm: effort steruje myśleniem NA KROK/tool-call, NIE długością biegu. Zadanie na
  500 kroków (jak redesign) i tak przejdzie 500 kroków na high; xhigh tylko przemiele każdy krok
  za mocno. Długość biegu zależy od liczby kroków, nie od effortu.
- Oficjalne docs dopuszczają xhigh "dla najbardziej capability-sensitive workloadów" - ale realna
  praktyka + cel oszczędzania tokenów => HIGH. xhigh tylko jeśli high udowodni, że nie wystarcza.

OSZCZĘDZANIE TOKENÓW (bez ograniczania możliwości):
- HIGH zamiast xhigh - największy pojedynczy lewar (koszt i jakość naraz).
- Instrukcja zwięzłości: "nie omawiaj szczegółowo każdego kroku; lead with outcome; podsumowanie na
  koniec, nie narracja w trakcie". Fable nieustereowany elaboruje ponad potrzebę.
- NIE kazać echo'wać/opisywać rozumowania (pułapka reasoning_extraction -> odmowa -> po cichu
  fallback na Opusa 4.8; czyli przestaje być Fable A koszt inny).
- Delegacja mechanicznej roboty do TAŃSZYCH modeli przez subagentów (inwentaryzacja, grep, zrzuty):
  "Opus prowadzi salę, tańsze modele robią powtórki". Fable orkiestruje, tańsze wykonują.
- Ugruntowanie w prawdzie na starcie = mniej reworku = mniej tokenów.
- Uziemiaj deklaracje postępu wynikiem narzędzia (Fable przy długich biegach zawyża status).
- Fable ~2x koszt Opusa za bieg - dlatego pierwszy prompt ma być trafny; koszt siedzi w błędach
  i przemyśleniu, nie w samym modelu.

INNE:
- Dawaj zadanie z GÓRNEJ polki trudności (single-pass systemy, które wcześniej brały dni).
- Dawaj POWÓD ("po co"): "pracuję nad X dla Y, potrzebują Z, więc: [request]".
- "Gdy masz dość informacji, działaj" - żeby nie przeplanowywał przy niejednoznaczności.
- Skille pisane pod starsze modele bywają zbyt preskryptywne dla Fable - odchudzić przy migracji.

## R22. railway-agent tylko do zadań złożonych - narzędzia bezpośrednie domyślnie
Domyślnie używaj BEZPOŚREDNICH narzędzi Railway MCP (list-projects, list-services, get-status,
get-service-config, get-service-metrics, get-logs, list-variables, set-variables, list-domains,
list-deployments) do rutynowych odczytów i pojedynczych zmian - są tańsze i szybsze, bez narzutu
dodatkowego modelu-agenta.

Sięgaj po `railway-agent` TYLKO gdy zadanie jest genuinie złożone/otwarte: diagnostyka
wieloserwisowa bez jasnej przyczyny, incydent produkcyjny wymagający rozumowania po stronie
Railway, operacja rozciągnięta na wiele niepewnych kroków, gdzie bezpośrednie narzędzia same nie
wystarcza do zbudowania planu.

Powód: `railway-agent` był nadmiernie używany do prostych, jednorazowych odczytów (np. "czy serwis
działa", "jakie są zmienne"), co niepotrzebnie podnosiło koszt bez realnej korzyści - bezpośrednie
narzędzie daje ta samą odpowiedź taniej i szybciej. Nie powielaj tego wzorca.
