---
name: playbook-stack
description: "Reguły techniczno-operacyjne dla pracy z kodem: narzucone biblioteki, kalibracja estetyki, archetypy projektów, integracje MCP, granice sandboxa, mikrointerakcje, deep-research. Trigger: jak budować, jakiej biblioteki użyć, styl wizualny, sandbox, MCP."
metadata:
  author: artur
  version: "4.0.0"
---

# PLAYBOOK-STACK - reguły techniczno-operacyjne (CCOS)

> Zwięzłe, egzekwowalne reguły techniczne DLA CLAUDE. Kontekst ekosystemu: docs/ECOSYSTEM.md.
> Ten plik jest dystrybuowany do wszystkich repo. Trzeci poziom hierarchii źródeł prawdy
> (patrz `artur-claude-code-os`) - wygrywa przy pracy z kodem, przegrywa z regułami tamtego pliku.

## 1. Biblioteki: znana luka -> narzucona biblioteka

Meta-reguła: nie klep interaktywnych prymitywów ręcznie - użyj gotowego (Radix/shadcn).
- Drag&drop -> @dnd-kit + @dnd-kit/sortable + @formkit/auto-animate.
  NIGDY react-beautiful-dnd (martwy) ani surowe HTML5 DnD.
- Dropdown/select -> shadcn Select/Combobox (Radix). NIGDY natywny <select> (lista nieostylowana).
- Date picker -> react-day-picker / shadcn Calendar+Popover. NIGDY natywny <input type=date>.
- Kwoty/liczby -> Intl.NumberFormat + tabular-nums. NIGDY ręczne sklejanie stringów.
- Toast -> sonner. Modal -> shadcn Dialog. Tooltip/popover -> Radix. Ikony -> lucide-react.
- Tabele sortowalne/filtrowalne -> TanStack Table. Formularze -> React Hook Form + Zod.
- Loading -> shadcn Skeleton.

## 2. Estetyka (anti-slop) - KALIBRUJ per gatunek

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

## 3. Archetypy i warstwy

- React+shadcn = DOMYŚLNY dla większości (pulsar, emailo, lyra, detektor-ai; money-hub jako React).
  Warstwy: shadcn/ui = szkielet (Radix+Tailwind, zachowanie) | tokeny+design.md+anti-slop = skóra
  (per projekt) | React = montaż + logika.
- WordPress (raai, animails, beezu) = tłumaczenie tokenów na theme.json nieuniknione.
- Design-first ZAPARKOWANY: Code + referencje + budowa-od-zera pobiło Design na premium.
  Design wraca tylko jeśli udowodni unikalną wartość. Bannery/assety = Figma / image-gen, nie Design.

## 4. MCP / integracje

- Railway: MCP musi być ZDALNY (https://mcp.railway.com) w .mcp.json lub konektor sesji.
  Lokalne `claude mcp add` NIE przenosi się do Code web. (Skill use-railway = guidance przez CLI;
  bez MCP servera brak narzędzia do wołania z czatu/agenta.)
- WordPress web-kompatybilny: zdalny MCP na stronie (WPVibe / oficjalny MCP Adapter WP 6.9+).
  @wp-playground/mcp (stdio) NIE działa w Code web.
- React: shadcn MCP deklarowany w repo .mcp.json (nie lokalnie).

## 5. Granice sandboxa Claude Code web (zweryfikowane)

- Sieć SERWEROWA (curl/git/npm/API) działa wszędzie, w tym zewnętrzne CDN i URL-e deployu.
- Headless Chromium NIE tuneluje do zewnętrznych CDN ani URL-i deployu -> ERR_CONNECTION_RESET.
  Żywej strony ani strony z CDN NIE zaudytujesz wizualnie headless.
- Nawet file:// pada domyślnie, bo HTTPS_PROXY/https_proxy przeciekają do przeglądarki.
  FIX: uruchamiaj przeglądarkę z odciętym proxy DLA JEJ PROCESU:
    env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy node skrypt.mjs
  (NIE zdejmuj proxy globalnie - curl/git/npm go potrzebują).
- Żeby headless zobaczyć stronę z CDN: zvendoruj biblioteki lokalnie + odetnij proxy.
- Wizualne QA żywych stron = oko Artura na realnym preview, nie test headless.

## 6. Jednostka pracy: buduj od zera, nie łataj

- Łatka OK tylko dla zmiany LOKALNEJ (jeden token/ikona/label).
- Zmiana strukturalna / wieloelementowa / rozlewna -> zbuduj sekcję OD NOWA ze specyfikacji.
- Produkcja daje CO (funkcje, dane, haki JS), nie JAK (wygląd). Przy redesignie NIE podsuwaj
  starego layoutu - kotwiczy model.
- Przed świeżym buildem: zarchiwizuj stare pliki (_archive/) - inaczej model kotwiczy na nich.

## 7. Start nowego, wizualnie-definiującego ekranu - pytaj, nie zakładaj three-up

- Na starcie nowego ekranu definiującego estetykę (zwykle główny) NIE uruchamiaj three-up
  automatycznie. Zapytaj wprost: "chcesz three-up czy od razu jeden kierunek?".
- Jeśli Artur wybiera three-up: Krok 1 - zbuduj TRZY warianty jako STATYCZNE, WYSOKIEJ WIERNOŚCI
  makiety - pełny wygląd, realistyczne dane, ale BEZ podpinania logiki i animacji. Różne kierunki
  estetyczne. Tanie i szybkie. Każda na WŁASNYM klikalnym preview URL.
- Artur wybiera JEDEN kierunek. Krok 2: dopiero zwycięzca dostaje pełną budowę - funkcjonalny,
  animowany, podpięty do danych. Reszta apki idzie już w tym kierunku.
- Makiety MUSZĄ być wysokiej wierności, nie wireframe - inaczej test smaku jest bezwartościowy.
- Jeśli Artur wybiera "od razu jeden kierunek": pomiń Krok 1, buduj wprost pełną wersję z referencjami.
- **Referencje wizualne to największy lewar.** Do każdej budowy/makiety dawaj KONKRETNE referencje
  (screeny, linki do stron/produktów w duchu których ma być) - referencje biją opisywanie
  przymiotnikami zawsze. W three-up: każdy z trzech wariantów zakotwicz w innej referencji.

## 8. Mikrointerakcje = część każdego buildu

- Warstwę ruchu zamawiaj W PROMPCIE BUDUJĄCYM, nie jako osobny przebieg. Pierwsza działająca wersja
  MUSI już mieć animacje.
- Zakres domyślny: press/hover, hover-lift wierszy, wjazd/wyjazd list (@formkit/auto-animate),
  count-up liczb, animacja pasków, przejścia zakładek, wysuw bottom-sheet, skeletony ładowania,
  stagger wejścia, mikro-feedback zapisu.
- Kanon (fintech = subtelnie): 120-280ms, tokeny --dur/--ease, tylko transform/opacity (GPU),
  poszanowanie prefers-reduced-motion. W razie wątpliwości MNIEJ.
- 120 Hz (większość telefonów): animacje JS oparte na czasie (elapsed/duration z delty rAF
  timestamp), NIE na liczbie klatek. requestAnimationFrame, nie setInterval. Pauzuj gdy karta
  niewidoczna i przy reduced-motion.
- Weryfikacja przez CZYTANIE KODU/DIFFU, nie przez renderowanie i ocenę wizualną: timing, tylko
  transform/opacity, obecność prefers-reduced-motion, użycie rAF. Ocenę estetyki ruchu zawsze
  robi Artur na żywym preview.

## 9. Deep-research jako metoda zdobywania wiedzy

Przy nowym obszarze: najpierw deep-research (ChatGPT / Perplexity / Gemini, także YouTube - web_search
po temacie + "youtube" żeby namierzyć kanały/filmy) po praktyczną, aktualną wiedzę, potem analiza,
eksperyment i wcielenie do repo/skilli. Claude nie ma bezpośredniego dostępu do treści wideo/audio -
Artur wkleja link albo transkrypcję.

## 10. Testy wszystkich funkcji, nie wyrywkowo

Przed produkcją: automatyczny test KAŻDEJ wdrożonej funkcji. W dużych narzędziach luki w testach
były regułą - domykaj je. Pod granice sandboxa (sekcja 5): Playwright lokalnie/zvendorowane + proxy
odcięte + oko Artura na preview, nie headless żywej strony.

## 11. Stabilność dostępu do narzędzi - sprawdź, zanim powiesz „nie mogę"

Zanim stwierdzisz brak dostępu do narzędzia/konektora/MCP, sprawdź (`ToolSearch` / rzeczywista
próba), nie zakładaj z pamięci poprzedniej sesji. „Nie mam dostępu" bez wcześniejszej próby jest
zakazane.

## 12. railway-agent tylko do zadań złożonych

Domyślnie używaj BEZPOŚREDNICH narzędzi Railway MCP (list-projects, list-services, get-status,
get-service-config, get-service-metrics, get-logs, list-variables, set-variables, list-domains,
list-deployments) do rutynowych odczytów i pojedynczych zmian - są tańsze i szybsze.

Sięgaj po `railway-agent` TYLKO gdy zadanie jest genuinie złożone/otwarte: diagnostyka
wieloserwisowa bez jasnej przyczyny, incydent produkcyjny wymagający rozumowania po stronie
Railway, operacja rozciągnięta na wiele niepewnych kroków.
