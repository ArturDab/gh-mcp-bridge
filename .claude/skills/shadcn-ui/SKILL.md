---
name: shadcn-ui
description: >
  Stosuj przy KAŻDEJ pracy nad UI w projektach Reactowych (React, Next.js, Vite):
  budowa ekranów, komponenty, layout, wybór stylu, drag & drop, adopcja bloków.
  Triggeruj gdy: shadcn, komponent, ekran, layout, blok, sekcja, przycisk, formularz,
  dashboard, landing, drag and drop, przeciąganie, edytor bloków, responsywność UI.
  NIE stosuj w WordPress/FSE (tam theme.json + wzorce bloków) ani w czystym HTML.
---

# shadcn-ui - system UI dla projektów Reactowych Artura

Cel: wszystkie serwisy Reactowe mają ten sam porządek (odstępy, geometria, typografia,
zaokrąglenia), a różnią się tylko opakowaniem (kolor, treść, obrazy, kompozycja).
Standard siedzi w tym, co wspólne. Indywidualność w tym, co per projekt.

## 1. Trzy style jako kanon (drabina gęstości)

Dozwolone są dokładnie trzy style shadcn, różniące się tylko gęstością. Wszystko inne
(kolor, font, radius) jest wspólne. Kody presetów mają zamrożone opakowanie tylko jako
demo - realny kolor projektu ustawiasz osobno.

| Styl | Preset (demo) | Gęstość | Do czego |
|------|---------------|---------|----------|
| luma | b5xKTYbJR | przewiewna | marketing, landing, strony wizerunkowe, blog, content |
| rhea | b5xvysYrx | pośrednia | hybrydy, ogólne serwisy, mieszane |
| mira | b5x1itcXB | gęsta | dashboardy, panele, admin, dużo danych |

Wybór stylu następuje RAZ, na starcie projektu, pod archetyp. Domyślny to luma.

### Granica, o której trzeba pamiętać
Styl steruje odstępami WEWNĄTRZ komponentów (padding karty, wysokość przycisku, gęstość
listy) i ich rozmiarem. NIE zmienia tego, ile znaczy `py-24` czy `gap-8` w Twoim layoucie
(shadcn celowo nie rusza mnożnika `--spacing`). Wniosek: rytm sekcji na stronie
marketingowej i interlinia długiego tekstu to Twoja warstwa layoutu, nie styl. Patrz sekcja 4.

### Podmiana stylu w trakcie prac
Bezpieczna TYLKO gdy trzymasz dyscyplinę z sekcji 3 (nie edytujesz `components/ui`).
Podmiana regeneruje pliki `components/ui` inline'owymi klasami nowego stylu; `init --overwrite`
kasuje nadpisania w `ui/`. Po podmianie zawsze przejrzyj wrappery w `components/app`,
bo zmienia się kontrakt wizualny (inny padding karty, inna wysokość przycisku).

## 2. Font i opakowanie
- Font kanoniczny: Geist (sans + mono). Stały we wszystkich projektach.
- Zmienne per projekt (opakowanie): kolor bazowy, kolor akcentu, kolor wykresów, ikony
  (domyślnie lucide; dozwolone tabler/phosphor/hugeicons/remix), treść, obrazy, kompozycja.
- 80/20: bloki i komponenty to rusztowanie na ~80% serwisu. 20% wyróżnika robią głównie
  OBRAZY i TEKSTY, nie kolory. Dwa serwisy na tych samych blokach z innymi zdjęciami i copy
  już wyglądają jak osobne produkty.

## 3. Dyscyplina komponentów (kolejność sięgania)
Kolejność zmian: TOKEN → wrapper w `components/app` → dopiero na końcu `components/ui`.

- Wariacje wizualne (kolor, radius, odstęp) → tokeny (zmienne CSS), nie pliki komponentów.
- Własne warianty, logika, kompozycja → `components/app` (wrappery, które posiadasz).
- `components/ui` traktuj jako regenerowalne. Nie wkładaj tam niezastępowalnej roboty,
  bo podmiana stylu to nadpisze.

### Wyjątki (kiedy WOLNO dotknąć components/ui)
1. Poprawka zachowania lub dostępności w prymitywie (bug fokusu, klawiatura), której
   owinięcie nie naprawi. Wtedy edytuj `ui/` albo skopiuj prymityw do `app/` pod nową nazwą.
2. Zmiana naprawdę globalna (np. fokus wszystkich przycisków wszędzie) - raz w `ui/`
   jest czystsze niż owijanie każdego użycia.
3. Świadoma, drobna edycja, którą jesteś gotów odtworzyć po regeneracji.
Reguła nie brzmi "nigdy nie dotykaj ui/". Brzmi: "nie trać w ui/ pracy, której nie odtworzysz".

## 4. Warstwa layoutu i typografii (czego styl NIE obejmuje) - konkretny standard
Styl (luma/rhea/mira) ustawia wnętrze komponentów. Rytm layoutu i typografia treści to
OSOBNA, wspólna warstwa. Nie przychodzi z shadcn, definiujesz ją raz i stosujesz wszędzie.

### Typografia tekstu długiego (edytory, artykuły, panele z treścią)
- Renderowana treść (podgląd, artykuł, opis): używaj @tailwindcss/typography, klasa `prose`
  (wersja zgodna z Tailwind v4). Daje ustandaryzowane rozmiary, interlinię, ODSTĘPY AKAPITÓW,
  listy, nagłówki. Dostrajaj modyfikatorami (`prose-sm` itd.), nie ręcznie.
- Pole edytowalne (textarea): lustrzaj DOKŁADNIE ten sam rozmiar i interlinię co podgląd,
  żeby edycja i wynik wyglądały identycznie.
- ZAKAZ arbitralnych wartości typu `text-[15px]` dla treści. Używaj skali:
  - body treści: 15-16px, interlinia 1.65-1.75
  - odstęp akapitu: ~0.75em między akapitami (sama interlinia nie wystarczy)
  - listy: space-y-1.5, spójne wcięcie
- Reguła: jeśli textarea i podgląd mają inny rozmiar lub interlinię, to błąd.

### Rytm layoutu (odstępy między i wokół blokami)
- Kontener: jedna szerokość maksymalna i jeden padding strony jako tokeny, nie dobierane per ekran.
- Odstęp pionowy między blokami: token `section-y` (compact 2-3rem / normal 4-5rem /
  spacious 6-7rem). Gęsty panel = compact, landing = spacious.
- Odstęp między kartami w gridzie: jedna wartość z tokenów, nie losowa per widok.
- Reguła: nie dobieraj `py-N`/`gap-N` na oko. Bierz z tokenów rytmu.

### Dlaczego to tu jest
shadcn celowo nie rusza globalnego mnożnika odstępów, więc rytm i typografia treści ZAWSZE
zostają po stronie apki. Bez tego standardu każdy ekran dobiera wartości na oko (np.
`text-[15px]`, `py-5`, `gap-5`) i wychodzą nierówne odstępy mimo dobrego stylu komponentów.
To NIE jest wina biblioteki - biblioteka tej warstwy nie dotyka.

## 5. Drag & drop
- Silnik uniwersalny: dnd-kit. Dostępny, z obsługą dotyku (działa na telefonie/tablecie).
  Pierwsze użycie u Artura: sortowanie/porządkowanie list → `@dnd-kit/sortable`.
- Edytor bloków (przeciąganie sekcji a'la Gutenberg, później): Puck (`@measured/puck`),
  rejestrujesz własne komponenty. Craft.js niżej poziomem, GrapesJS mniej reactowy.
- Uczciwa granica: wyrenderowany wynik ma być w 100% responsywny; sama edycja przez
  przeciąganie palcem na małym ekranie bywa okrojona (jak u Gutenberga/Webflow). Nie obiecuj
  perfekcyjnej edycji d&d na telefonie; obiecuj perfekcyjny wynik.

## 6. Biblioteki bloków i MCP
- Darmowe, na start: oficjalne bloki shadcn (zawsze zgodne ze stylem), Tailark (marketing),
  Origin UI / COSS (prymitywy spoza rdzenia).
- Płatne dokładasz dopiero przy realnym braku: shadcnblocks, shadcn.io. Zweryfikuj cennik
  i utrzymanie przed decyzją, nie z pamięci.
- Bloki zewnętrzne przychodzą z własnym wyglądem wbitym w kod. Traktuj jak rusztowanie,
  przerabiaj pod styl i tokeny. Bez tego wszystkie serwisy zaczną wyglądać jak ta biblioteka.
- MCP: jeden oficjalny MCP shadcn obsługuje KAŻDY rejestr dopisany do `components.json`.
  Osobny MCP biblioteki potrzebny tylko przy dużym płatnym katalogu (logowanie + wyszukiwanie).
  Nie mnóż MCP na zapas.

## 7. Responsywność (twardy wymóg)
Każdy komponent i ekran wychodzi responsywny i sprawdzony na mobile. Cokolwiek wdrażasz na
desktop, ma działać i wyglądać poprawnie na telefonie i tablecie. Weryfikacja: skill
screenshot-driven-ui-review + komenda /audit-mobile. Brak sprawdzenia mobile = zadanie
niedokończone.

## 8. Own library (docelowo, nie na start)
Własne komponenty i własną bibliotekę wyłuskuj z realnych ekranów (gdy wzorzec wraca w 3+
projektach), nie buduj w próżni. Do tego czasu opieraj się na cudzych blokach + tokenach.

## 9. Playground / katalog
- Przeglądanie CUDZYCH bloków: nie buduj nic, korzystaj z galerii online (shadcn, Tailark,
  Origin UI). Claude instaluje wybrane przez MCP.
- Przeglądanie WŁASNEGO systemu (komponenty pod luma/rhea/mira, tokeny, sprawdzenie mobile):
  Storybook albo Ladle, albo prosta podstrona `/playground` w projekcie. Nabiera sensu, gdy
  masz własne komponenty. Wcześniej pokazywałby to samo, co galerie bibliotek.
- Na pilotaż wystarczy lekka podstrona `/playground` renderująca kilka bloków pod wybranym
  stylem, do wglądu na desktop + mobile. Nie stawiaj Storybooka na start.

## 10. Model instalacji (nie wgrywaj na zapas)
"Mieć wszystko" = mieć DOSTĘP (components.json + MCP + reguły), nie fizycznie zainstalowane
setki komponentów. Bloki i komponenty ściągaj na żądanie. Repo zostaje lekkie.

## 11. Projekty istniejące - NIE migruj z automatu (twarda reguła)
Ten skill to standard dla NOWEJ pracy Reactowej. NIE jest poleceniem migracji istniejących serwisów.
- Serwis zbudowany wg starych wytycznych działa dalej bez zmian. Skill go nie dotyka, dopóki
  ktoś świadomie nie ruszy jego UI.
- NIE adoptuj nowego stylu (luma) na istniejącym projekcie samoczynnie. Migracja starego setupu
  (HSL/Tailwind v3 albo styl `default`) to OSOBNE, świadome zadanie, które Artur sygnalizuje
  per projekt. Bez tego sygnału zostaw istniejący kod w spokoju.
- Domyślnie: nowe ekrany idą wg standardu; istniejący kod zostaje. Nie "przy okazji"
  standaryzuj tego, o co nikt nie prosił.
- Istniejący shadcn na starym stylu: migracja dotknie wygenerowanych komponentów (destrukcyjny
  re-write). Traktuj jako zaplanowaną operację na sygnał, nigdy mimochodem.
