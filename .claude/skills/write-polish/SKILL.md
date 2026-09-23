---
name: write-polish
description: >
  Stosuj przy KAŻDYM zadaniu pisania lub redakcji dłuższego, autorskiego lub
  redakcyjnego tekstu po polsku: tworzenie od zera, korekta, redakcja, konspekt,
  szukanie tematu/ujęcia. Obejmuje artykuły, blog posty, treści marketingowe,
  newslettery, opisy produktów, posty social media, raporty, case studies i inne.
  Triggeruj nawet gdy użytkownik nie wymienia skilla wprost - wystarczy że pisze
  po polsku i tworzy lub poprawia dłuższy tekst.
  Trigger na frazy: napisz tekst, napisz artykuł, przygotuj treść, stwórz post,
  wymyśl temat, opracuj konspekt, napisz newsletter, landing page, opis produktu,
  blog post, case study, napisz po polsku, popraw tekst, zredaguj, korekta,
  sprawdź styl, popraw język.
  NIE stosuj dla tekstów gamingowych dla Interii - tam używaj write-interia,
  który wczytuje write-polish automatycznie jako bazę.
  NIE stosuj do krótkich odpowiedzi konwersacyjnych, maili ani SMS-ów,
  do kodu ani do commit message'y.
---

# write-polish

Bazowy skill pisarski dla wszystkich tekstów po polsku. Zasady języka, naturalność
polszczyzny, szukanie ujęcia i struktura tekstu.

> Skill write-interia rozszerza ten skill. Jeśli kontekst dotyczy Interii - użyj
> tamtego skilla, nie tego. Dla ReadAbout.AI i Beezu nie ma na razie dedykowanego
> skilla (reguły w przebudowie) - stosuj write-polish bezpośrednio.
>
> Przy pisaniu całej książki (narracyjny non-fiction, reportaż, książka
> popularnonaukowa) prowadzi write-book. Warstwa językowa tego skilla (poziom
> writing: czarna lista, naturalność, anti-slop, technikalia) obowiązuje wtedy
> dalej, ale poziomy pre-writing (ujęcie) i structure (otwarcie/zamknięcie) są
> skalibrowane pod tekst krótki - dla książki zastępuje je struktura z write-book.

## Overview

Skill działa na trzech poziomach - nie wszystkie są potrzebne za każdym razem:

1. **Pre-writing** - szukanie tematu, ujęcia, budowanie konspektu
2. **Writing** - zasady języka i naturalność polszczyzny; obowiązują ZAWSZE
3. **Structure** - otwarcie, zamknięcie, przejścia między sekcjami

## When to Trigger

- Każde zadanie tworzenia lub poprawiania tekstu po polsku
- Korekta stylistyczna, redakcja, przepisywanie
- Szukanie ujęcia, tematu, konspektu
- Sprawdzanie naturalności polszczyzny

Nie triggeruj gdy kontekst to Interia (write-interia).

## Workflow

1. Ustal poziom zadania: pre-writing / writing / structure (lub kombinacja)
2. Jeśli pre-writing: pomóż znaleźć ujęcie (patrz niżej)
3. Przy pisaniu: wczytaj `references/czarna-lista.md` przed generowaniem tekstu
4. Przy strukturze: wczytaj `references/struktura.md`
5. Po napisaniu: weryfikuj zasady języka z sekcji Rules
6. Przy redakcji lub audycie: wczytaj `references/anti-slop.md` - wzorce
   strukturalne W1-W8, formalne łączniki, łańcuchy "który", zbędne zaimki,
   scoring. To jest korekta drugiego poziomu - po czarnej liście.
7. **Tylko na wyraźne życzenie** ("Pisz jak Dragan" / "rejestr Dragana" /
   "podkręć polot"): wczytaj `references/rejestr-dragan.md`. Nigdy domyślnie -
   to opcjonalny wariant głosu, nie domyślny rejestr.

## Pre-writing: Szukanie ujęcia

Temat to nie ujęcie. "Automatyzacja marketingu" to temat. "Dlaczego 80% automatyzacji
marketingu w MŚP kończy się na jednym scenariuszu w Make.com" to ujęcie.

**Ujęcie = temat + perspektywa + sprzeczność.**

Test: czy potrafisz opisać tekst jednym zdaniem zawierającym temat, punkt widzenia
i jakąś sprzeczność (problem, zaskoczenie, konflikt)? Jeśli tak - masz ujęcie.
Jeśli potrafisz go opisać tylko jednym słowem - masz dopiero temat.

## Rules

### Zasady języka (kluczowe)

Trzy reguły potrzebne zawsze, niezależnie od typu tekstu:

- **Strona czynna.** Podmiot = konkretny sprawca. Nie: "zostało wdrożone". Tak: "zespół wdrożył".
- **Konkret zamiast superlatywu.** "Ogromny wzrost" → "wzrost o 340%".
- **Rytm zdań.** Mieszaj krótkie, średnie i długie. Monotonia = problem.

Pełna lista (imiesłowy, ", co", "gdzie", personifikacja, wyrażenia-widma,
konstrukcje przeciwstawne, narrator z dystansu, test cytatu) →
`references/zasady-jezykowe.md` i `references/anti-slop.md`. Nie duplikujemy
jej tutaj - trzymaj się jednego źródła.

### Naturalność polszczyzny

- **Szyk zdania:** zacznij od okolicznika lub dopełnienia, nie zawsze podmiot-orzeczenie. "W marcu firma uruchomiła..." zamiast "Firma uruchomiła w marcu...".
- **Grupy nominalne:** nie buduj wielopoziomowych konstrukcji. "System CRM oparty na AI" zamiast "zaawansowany system zarządzania relacjami z klientami oparty na sztucznej inteligencji".
- **"Jest" i "są":** zastępuj czasownikami dynamicznymi. "Firma przewodzi" zamiast "firma jest liderem".
- **Partykuły i modulanty:** używaj "przecież", "właśnie", "akurat", "jednak", "zresztą", "otóż", "tymczasem". AI ich unika, przez co tekst brzmi płasko.
- **Tłumaczeniowe "to":** "To jest ważne, aby..." → "Ważne, żeby...". "To narzędzie, które pozwala..." → "Narzędzie pozwala...".

### Technikalia

- Półpauzy (–) wyłącznie jako wtrącenie w środku zdania (para: –...–). "Ta metoda – stosowana od lat – rzadko działa." Nigdy w tytułach.
- Pauzy (—) nigdy.
- Dywiz (-) zamiast półpauzy w: zakresach (2020-2024, s. 12-15, 9.00-17.00, Warszawa-Kraków) oraz parach nazw własnych (Ribbentrop-Mołotow, Bayern-Real Madryt).
- Kontrast i pointa: NIE używaj półpauzy - przeformułuj zdanie lub użyj przecinka.
- Cudzysłowy polskie („") lub angielskie ("") - wybierz jedno, stosuj konsekwentnie
- Ortografia: "nie" z imiesłowami łącznie (nieukończony, niewydany) - reguła RJP obowiązująca od 1997, nie nowość
- Twitter/X: "na X-ie", "użytkownik X-a"
- Nazwy platform odmieniane naturalnie: "na Reddicie", "na YouTubie", "na LinkedInie"
- Myślnik przed "i"/"ale" - nie. W tytułach - zakaz.
- Pytajnik w śródtytule i tytule - **reguła sprawdzalna, nie uznaniowa**: nagłówek zaczynający się od zaimka pytajnego (co, czego, czym, gdzie, jak, czy, dlaczego, kiedy, kto, ile, po co, skąd) JEST pytaniem i kończy się pytajnikiem. Bez wyjątków, także gdy traktujesz nagłówek jak etykietę sekcji - to najczęstsze źródło błędu. "Gdzie wstawić instrukcję?" nie "Gdzie wstawić instrukcję".
- Nie zamieniaj naturalnego pytania na sztuczne twierdzenie tylko po to, by uniknąć pytajnika ("Skąd się wzięło to słowo?" bije "Skąd się wzięło słowo na to, co robisz").

### Otwarcie i zamknięcie

Otwarcie: fakt/liczba, problem czytelnika lub ostra teza - nigdy "W dzisiejszych
czasach...". Zamknięcie: mocna ostatnia myśl, nie podsumowanie ("Podsumowując...").
Pełne zasady (przejścia między sekcjami, rytm całości, konspekt) →
`references/struktura.md`.

## Scoring (opcjonalny)

Przy redakcji lub audycie oceń tekst 1-10 w pięciu wymiarach: bezpośredniość,
rytm, zaufanie do czytelnika, naturalność, gęstość. Próg 35/50 - niżej tekst
wymaga rewizji. Pełna tabela z pytaniami kontrolnymi → `references/anti-slop.md`,
sekcja "Scoring".

## References

- `references/czarna-lista.md` - leksykalne zakazy: zwroty, kalki, żargon, hedgingi, pompowanie ważności, akapity ramowe, zakazane łączniki, konstrukcje przeciwstawne (lista), meta-komentarze; czytaj przed każdym pisaniem
- `references/zasady-jezykowe.md` - fundamenty polszczyzny: strona czynna, imiesłowy, ", co", "gdzie", rytm, konkret, personifikacja, mikro-hedging, przepisy na konstrukcje przeciwstawne, zasady korekty; czytaj podczas pisania gdy coś budzi wątpliwość
- `references/anti-slop.md` - kanoniczny katalog wzorców strukturalnych: pełne W1-W8 ze źródłami, formalne łączniki, łańcuchy "który", zbędne zaimki, scoring; czytaj przy redakcji i audycie
- `references/struktura.md` - otwarcie, zamknięcie, przejścia, rytm całości; czytaj przy konspekcie i pisaniu
- `references/rejestr-dragan.md` - opcjonalny wariant głosu inspirowany narracyjnym non-fiction Andrzeja Dragana: wyższe natężenie polotu, otwarcia ukośne, kaskady pytań, mieszanie rejestrów. Ładuje się WYŁĄCZNIE na życzenie ("Pisz jak Dragan" / "rejestr Dragana"), nigdy domyślnie. Warstwa językowa write-polish (czarna lista, anti-slop) obowiązuje dalej
