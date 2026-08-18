---
name: bug-scan
description: "Skaner usterek oparty na Playwright - chodzi po aplikacji, klika każdy element interaktywny i zgłasza wyłącznie usterki sprawdzalne kodem (brak reakcji, błędy konsoli, sieć 4xx/5xx, zawieszone ładowanie, martwe linki, pułapki klawiatury, brak focusu). Stosuj przed wydaniem, po większej przebudowie interakcji albo przy przejęciu cudzego projektu. Triggeruj na: skan usterek, bug scan, sprawdź czy coś jest zepsute, przetestuj klikalność, znajdź martwe przyciski, audyt interaktywności, czy wszystko działa po zmianach."
allowed-tools: Bash(node:*), Bash(npm:*), Bash(npx:*), Bash(curl:*)
---

# Skaner usterek (bug-scan)

Agent eksploracyjny: Playwright chodzi po aplikacji, klika każdy widoczny element
interaktywny na kilku szerokościach i zgłasza wyłącznie to, co da się potwierdzić
kodem. To warstwa 2 (rozszerzenie `checklista-gotowe.md`), **nie** zamiennik
przeglądu na żywym preview - warstwa 3 (estetyka, kompozycja, sens treści) zawsze
zostaje po stronie człowieka.

## Ograniczenia - przeczytaj przed użyciem

- **Wersja 1.** Jedna runda testów za sobą (na Pulsarze, projekcie źródłowym tego
  narzędzia), nie dziesięć. Traktuj wynik jako obiecujący, nie jako sprawdzony w boju.
- **Mechanizm namierzania klikanego elementu został właśnie naprawiony** po poważnym
  błędzie (patrz sekcja Historia niżej). Napraw jest świeża - miej to z tyłu głowy,
  gdy raport wygląda podejrzanie gładko albo podejrzanie źle.
- **Nigdy nie uruchamiaj na prawdziwym backendzie produkcyjnym z realnymi danymi.**
  Skaner klika wszystko, co widzi - filtr akcji kosztownych jest wzorcem tekstowym
  (regex), nie gwarancją. Cel to zawsze środowisko lokalne, preview albo staging.
- **Na atrapie API (mock-serwer, dane testowe) wyniki są niepewne z definicji.**
  Przyciski oczekujące konkretnego kształtu odpowiedzi mogą wyjść jako fałszywy
  "brak reakcji" tylko dlatego, że atrapa nie oddaje realnych danych.
- **Pierwszy raport na nowym wdrożeniu sprawdzaj ręcznie przeciw rzeczywistości,
  zanim cokolwiek naprawisz.** Nie ufaj liczbie usterek w nagłówku - patrz prompt P4
  niżej. To nie jest sugestia, to warunek korzystania z tego narzędzia.

## Kiedy się odpala

- przed wydaniem / mergem na produkcję
- po większej przebudowie interakcji (routing, formularze, nawigacja)
- przy przejęciu cudzego albo dawno nietkniętego projektu - szybki obraz tego, co
  realnie działa, zanim zaczniesz cokolwiek zmieniać

## Czego skaner NIE robi

Nie ocenia estetyki, kompozycji, sensu treści ani jakości wyniku. Nie ma opinii o
tym, czy coś ładnie wygląda, czy tekst brzmi dobrze, czy układ ma sens. To wszystko
zostaje warstwie 3 z `checklista-gotowe.md` - człowiekowi na żywym podglądzie.
Skaner sprawdza wyłącznie rzeczy, które kod potrafi jednoznacznie potwierdzić albo
zaprzeczyć.

## Siedem kategorii, które wykrywa

1. **Brak reakcji** - kliknięcie elementu, który wygląda na klikalny, nic nie
   zmienia (treść, adres, stan elementu, żadnego zapytania sieciowego).
2. **Błąd konsoli** - kliknięcie wywołuje błąd JavaScript w przeglądarce.
3. **Sieć 4xx/5xx** - kliknięcie wywołuje zapytanie sieciowe zakończone błędem.
4. **Zawieszone ładowanie** - widok zostaje w stanie "ładowanie..." dłużej niż
   próg (domyślnie 10 sekund).
5. **Martwy link** - link zmienia adres na widok, którego routing nie rozpoznaje. Dla
   linków po hashu - pewna usterka, jeśli cel jest spoza listy widoków. Dla linków po
   ścieżce URL - zawsze ląduje w "Niepewne" (aplikacje SPA często zwracają 200 dla
   dowolnej nieznanej ścieżki, więc sama odpowiedź sieciowa nic nie mówi o tym, czy
   cel istnieje naprawdę - patrz Znane ograniczenia niżej).
6. **Pułapka klawiatury** - Tab utyka na jednym elemencie i nie przechodzi dalej.
7. **Brak widocznego focusu** - element interaktywny nie pokazuje obrysu/cienia
   przy nawigacji klawiaturą. Zawsze ląduje w "Niepewne" - sygnał widzi wyłącznie
   obrys i cień, więc aplikacja pokazująca focus inaczej (zmiana obramowania, tła,
   podkreślenia) wyjdzie tu jako fałszywy alarm.

Część zgłoszeń trafia do osobnej sekcji "Niepewne" (np. element już wyglądał na
aktywny przed kliknięciem) - to nie są usterki, to sygnały do ręcznego sprawdzenia.

## Historia, którą trzeba znać

Pierwszy raport tego skanera (na Pulsarze, projekcie źródłowym) zgłosił 26 "pewnych
usterek". **Wszystkie były fałszywe.** Przyczyna: skaner lokalizował klikany element
po jego pozycji w płaskiej liście przycisków, a każdy klik, który cokolwiek
filtrował na stronie, przesuwał tę pozycję - kolejne kliknięcia trafiały w losowo
inny element niż ten opisany w raporcie.

Samotest tego nie wykrył, mimo że sprawdzał wszystkie siedem kategorii z listy
wyżej - bo sprawdzał kategorie usterek, nie sam mechanizm namierzania elementu.
Zielony samotest i w pełni fałszywy raport wystąpiły jednocześnie.

Naprawa: element jest teraz lokalizowany przez strukturalną ścieżkę CSS (`d.sel`),
z dodatkowym sprawdzeniem tag+tekst tuż przed kliknięciem - jeśli element uciekł
(inny tag albo inny tekst pod tą samą ścieżką), kliknięcie jest pomijane zamiast
przypisane nie temu elementowi. Kod tego mechanizmu jest w `scripts/bug-scan.js`
(funkcja `scanRoute`) - nie cofaj go do prostszego indeksu pozycyjnego, nawet jeśli
wygląda na zbędną komplikację.

Wniosek praktyczny: **zielony samotest potwierdza kategorie usterek, nie
wiarygodność raportu.** Prompt P4 (ręczna weryfikacja każdego zgłoszenia) jest
obowiązkowy z tego właśnie powodu, nie jest formalnością do przeklikania.

## Instalacja i użycie

1. Skopiuj `scripts/bug-scan.js`, `scripts/bug-scan-fixture.js`,
   `scripts/bug-scan-selftest.js`, `scripts/chrome-resolver.js` do `scripts/`
   projektu docelowego.
2. Zainstaluj zależności w projekcie docelowym: `npm install --save-dev
   playwright-core express` (Chromium bierze z `PLAYWRIGHT_CHROMIUM_PATH`, z
   `.browsers/` w repo, z `$PLAYWRIGHT_BROWSERS_PATH/chromium-*/chrome-linux/chrome`
   - domyślnie `/opt/ms-playwright`, standard z `docs/ECOSYSTEM.md` w `claude-code-os`
   - albo z `/opt/pw-browsers/chromium` jako dodatkowy fallback - patrz
   `scripts/chrome-resolver.js`).
3. Skopiuj `bug-scan.config.example.json` jako `bug-scan.config.json` obok
   `package.json` i dostosuj pod projekt (patrz niżej).
4. Uruchom w kolejności z `PROMPTY.md`: instalacja → samotest → pierwszy przebieg →
   weryfikacja raportu → naprawa. Nie przeskakuj kroków.

### Konfiguracja (`bug-scan.config.json`)

Wszystko, co zależy od konkretnego projektu, wchodzi tu, nie do kodu skanera:

- `appName` - nazwa do nagłówka raportu
- `baseUrl` - adres celu (lokalny, preview, staging - nigdy produkcja z realnymi danymi)
- `widths` - szerokości ekranu do przetestowania
- `stuckLoadingMs` - próg "zawieszonego ładowania"
- `maxElementsPerRoute` - limit elementów klikanych na jeden widok
- `clickWaitMs` - minimalny czas obserwacji reakcji po kliknięciu (domyślnie 450ms)
- `networkIdleTimeoutMs` - dodatkowy czas na dojechanie wolnych zapytań sieciowych po
  kliknięciu (LLM, zewnętrzne API) zanim okno obserwacji się zamknie (domyślnie 2000ms;
  rozwiązuje się szybciej, jeśli sieć jest już cicha - nie spowalnia szybkich kliknięć)
- `routes.static` - jawna lista widoków (ścieżki w stylu „/przyklad" albo fragmenty
  hash w stylu „przyklad" bez `#`); jeśli pusta i `discoverFromNav` włączone, skaner sam wyciągnie linki
  nawigacji ze strony startowej (`navLinkSelector`, domyślnie `a[href^='#']`);
  jeśli i to nic nie da, skanuje sam root jako jedyny widok
- `routes.extra` - dodatkowe widoki dopisywane zawsze
- `costlyTextPattern` - wzorzec tekstu przycisków/linków z realnymi efektami
  ubocznymi poza aplikacją (generowanie AI, wysyłka, webhook, wylogowanie, płatność)
  - **nigdy nie klikane domyślnie**, zawsze widoczne w raporcie w sekcji "Pominięte
  celowo"; `--include-costly` włącza je świadomie
- `login` - selektory pól logowania (`usernameSelector`, `passwordSelector`), jeśli
  aplikacja jest za bramką hasłową; puste = brak logowania
- `credentialsEnv` - nazwy zmiennych środowiskowych z danymi logowania (dopasuj do
  konwencji własnego projektu, np. `APP_LOGIN`/`APP_PASSWORD` jak w skillu
  `secure-gate`) - **nigdy nie wpisuj hasła w komendzie widocznej w historii**

### Bezpieczeństwo

Domyślnie skaner nie klika akcji dopasowanych do `costlyTextPattern`. Zawsze
widoczne w raporcie, nigdy ciche pominięcie. `--include-costly` włącza je
świadomie - używaj tylko, gdy naprawdę chcesz, żeby skan wygenerował
treść/wysłał webhook/wylogował sesję na danym środowisku.

### Znane ograniczenia mechanizmu (nie traktuj ciszy jako "zero usterek")

- Heurystyka "brak reakcji" porównuje odcisk stanu strony (hash/tytuł/długość
  tekstu/liczba otwartych elementów/toast/klasa `body`) i atrybuty klikanego
  elementu przed/po kliknięciu, plus zapytania sieciowe. Element, który zmienia
  coś poza tym zestawem (np. rysuje na `<canvas>`), może wyjść jako fałszywy alarm
  - stąd sekcja "Niepewne" i wymóg przejrzenia raportu, nie tylko liczenia
  czerwonych pozycji.
- **Zapytanie sieciowe jako sygnał "coś się stało" nie jest przypisane do
  klikniętego elementu** - to zapytanie DOWOLNEGO pochodzenia w oknie obserwacji po
  kliknięciu (odpytywanie na żywo, analityka, inne tło). Na aplikacji z częstym
  ruchem w tle martwy przycisk może wyjść jako "zareagował" tylko dlatego, że akurat
  w tym oknie czasowym wylądowała niepowiązana odpowiedź. Świadome ograniczenie
  odziedziczone z pierwszej wersji - naprawa wymaga wiązania zapytań z konkretnym
  kliknięciem, nie punktowej łatki; zostaje w rundzie 2, nie łatane pod presją teraz.
- **Okno obserwacji reakcji po kliknięciu ma stały, ograniczony czas** (`clickWaitMs`
  + krótka, najlepszy-wysiłek pauza na ucichnięcie sieci). Reakcja odłożona w czasie
  dłużej niż to okno (typowy "debounce" - np. wyszukiwarka czekająca, aż użytkownik
  przestanie pisać, zanim wyśle zapytanie) może zostać przegapiona albo przypisana do
  NASTĘPNEGO klikniętego elementu, nie tego, które ją wywołało. Ten sam rodzaj
  ograniczenia co punkt wyżej - naprawa porządna, nie punktowa, zostaje w rundzie 2.
- Jeśli widok się w ogóle nie załaduje (zły adres bazowy, środowisko padło,
  timeout), skaner go NIE skanuje jako pustą stronę - raport dostaje osobną,
  widoczną na górze sekcję z listą widoków, których nie zobaczył. Brak usterek
  dla takiego widoku nie znaczy "działa", tylko "skaner tam nie dotarł".
- Procent pokrycia w nagłówku raportu liczy się od WSZYSTKICH wykrytych elementów,
  łącznie z nawigacją zewnętrzną (celowo nieklikaną) i akcjami kosztownymi (celowo
  pominiętymi) - na stronach z dużo linków zewnętrznych (stopka, social media)
  liczba wygląda gorzej niż realne pokrycie interakcji wewnątrz aplikacji. Czytaj
  sekcję "Zasięg skanu" w raporcie, nie tylko procent w nagłówku.
- Aplikacja bez routingu hash i bez `routes.static` w configu skanuje się jako
  jeden widok (sam root) - jeśli masz osobne adresy URL (nie fragmenty `#`), podaj
  je jawnie w `routes.static` z wiodącym `/`.
- Lista widoków w `routes.static` bywa celowo niepełna (skanujesz podzbiór, nie
  każdą realną stronę aplikacji) - dlatego link do ścieżki spoza tej listy zawsze
  ląduje w "Niepewne", nigdy w pewnych usterkach. "Nierozpoznany" znaczy tu "nie na
  liście do skanu", niekoniecznie "nie istnieje naprawdę".

## Nie uruchamiaj w CI

Wymaga Chromium - drogie na start. Uruchamiaj ręcznie przed wydaniem albo po
większej zmianie interakcji, jak lokalną pętlę wizualną.
