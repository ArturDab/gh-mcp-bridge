---
name: write-polish
description: "Stosuj przy KAŻDYM pisaniu lub redakcji po polsku: tworzenie od zera, korekta, redakcja, konspekt, temat/kąt. Artykuły, blogi, treści marketingowe, newslettery, opisy produktów, social, raporty, case studies. Trigger: napisz tekst/artykuł, stwórz post, napisz newsletter, landing page, popraw tekst, zredaguj, korekta, po polsku. NIE dla Interii (write-interia) ani RAAI (write-raai) - one biorą write-polish jako bazę."

---

# write-polish

Bazowy skill pisarski dla wszystkich tekstów po polsku. Zasady języka, naturalność
polszczyzny, szukanie kąta i struktura tekstu.

> Skille write-interia i write-raai rozszerzają ten skill. Jeśli kontekst dotyczy
> Interii lub ReadAbout.AI - użyj tamtych skillów, nie tego.
>
> Przy pisaniu całej książki (narracyjny non-fiction, reportaż, książka
> popularnonaukowa) prowadzi write-book. Warstwa językowa tego skilla (poziom
> writing: czarna lista, naturalność, anti-slop, technikalia) obowiązuje wtedy
> dalej, ale poziomy pre-writing (kąt) i structure (otwarcie/zamknięcie) są
> skalibrowane pod tekst krótki - dla książki zastępuje je struktura z write-book.

## Overview

Skill działa na trzech poziomach - nie wszystkie są potrzebne za każdym razem:

1. **Pre-writing** - szukanie tematu, kąta, budowanie konspektu
2. **Writing** - zasady języka i naturalność polszczyzny; obowiązują ZAWSZE
3. **Structure** - otwarcie, zamknięcie, przejścia między sekcjami

## When to Trigger

- Każde zadanie tworzenia lub poprawiania tekstu po polsku
- Korekta stylistyczna, redakcja, przepisywanie
- Szukanie kąta, tematu, konspektu
- Sprawdzanie naturalności polszczyzny

Nie triggeruj gdy kontekst to Interia (write-interia) lub ReadAbout.AI (write-raai).

## Workflow

1. Ustal poziom zadania: pre-writing / writing / structure (lub kombinacja)
2. Jeśli pre-writing: pomóż znaleźć kąt (patrz niżej)
3. Przy pisaniu: wczytaj `references/czarna-lista.md` przed generowaniem tekstu
4. Przy strukturze: wczytaj `references/struktura.md`
5. Po napisaniu: weryfikuj zasady języka z sekcji Rules
6. Przy redakcji lub audycie: wczytaj `references/anti-slop.md` - wzorce
   strukturalne W1-W8, formalne łączniki, łańcuchy "który", zbędne zaimki,
   scoring. To jest korekta drugiego poziomu - po czarnej liście.
7. **Tylko na wyraźne życzenie** ("Pisz jak Dragan" / "rejestr Dragana" /
   "podkręć polot"): wczytaj `references/rejestr-dragan.md`. Nigdy domyślnie -
   to opcjonalny wariant głosu, nie domyślny rejestr.

## Pre-writing: Szukanie kąta

Temat to nie kąt. "Automatyzacja marketingu" to temat. "Dlaczego 80% automatyzacji
marketingu w MŚP kończy się na jednym scenariuszu w Make.com" to kąt.

**Kąt = temat + perspektywa + napięcie.**

Test: czy potrafisz opisać tekst jednym zdaniem zawierającym temat, punkt widzenia
i jakieś tarcie (problem, zaskoczenie, sprzeczność)? Jeśli tak - masz kąt.
Jeśli potrafisz go opisać tylko jednym słowem - masz dopiero temat.

## Rules

### Zasady języka (kluczowe)

- **Strona czynna.** Podmiot = konkretny sprawca. Nie: "zostało wdrożone". Tak: "zespół wdrożył".
- **Imiesłowy na -ąc.** Max 2 w całym tekście. Rozważ zamianę na osobne zdanie.
- **", co..." w środku zdania.** Max 2 w tekście. Zamień na dwa zdania lub "dzięki czemu".
- **"Gdzie" tylko miejscowo.** "System, w którym..." - nie "system, gdzie...".
- **Rytm zdań.** Mieszaj krótkie, średnie i długie. Monotonia = problem.
- **Ostatnie zdanie akapitu.** Fakt, konkret lub wartość. Bez sentymentu.
- **Konkret zamiast superlatywu.** "Ogromny wzrost" → "wzrost o 340%".
- **Personifikacja produktów.** "Gra ujawnia", "seria próbowała" - nie. Ludzie ujawniają, twórcy próbują.
- **Wyrażenia-widma.** Test: czy polski dziennikarz napisałby to? Jeśli wątpisz - przeformułuj prościej.
- **Konstrukcje przeciwstawne.** Rodzina tików budujących tezę przez zaprzeczenie: ogon "X, nie Y", "Nie chodzi o X. Chodzi o Y.", "Mniej X, więcej Y.", "Tam, gdzie X, Y.", antyteza "Nie A. To B.", wyliczanie "Nie X. Nie Y. Z." Test: usuń zaprzeczoną połowę - jeśli twierdzenie stoi samo, tnij. Pełna lista i reżim → `czarna-lista.md`, przepisy → `zasady-jezykowe.md`.
- **Narrator z dystansu.** "Obserwuje się...", "Ludzie mają tendencję..." - bezosobowy ton wykładowcy. Forma "ty"/"my" lub konkretny podmiot.
- **Test cytatu.** Jeśli zdanie brzmi jak post na LinkedIn (za gładkie, uniwersalna prawda do zacytowania out of context) - wytnij lub uziemić w konkrecie.

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
- Ortografia 2026: "nie" z imiesłowami łącznie (nieukończony, niewydany)
- Twitter/X: "na X-ie", "użytkownik X-a"
- Nazwy platform odmieniane naturalnie: "na Reddicie", "na YouTubie", "na LinkedInie"
- Myślnik przed "i"/"ale" - nie. W tytułach - zakaz.
- Pytajnik w śródtytule i tytule - dozwolony i często wskazany, gdy nagłówek stawia pytanie, na które tekst odpowiada. Nie zamieniaj naturalnego pytania na sztuczne twierdzenie tylko po to, by uniknąć pytajnika ("Skąd się wzięło to słowo?" bije "Skąd się wzięło słowo na to, co robisz").

### Otwarcie i zamknięcie

- **Otwarcie:** fakt/liczba, problem czytelnika lub ostra teza. Nigdy "W dzisiejszych czasach..."
- **Zamknięcie:** nie podsumowuj ("Podsumowując..."). Zostaw mocną ostatnią myśl.
- **Przejścia:** ostatnie zdanie sekcji prowadzi do pierwszego następnej. Bez "Przechodząc do kolejnego tematu..."

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
- `references/rejestr-dragan.md` - opcjonalny wariant głosu inspirowany narracyjnym non-fiction Andrzeja Dragana: wyższe natężenie polotu, otwarcia ukośne, kaskady pytań, mieszanie rejestrów. Ładuje się WYŁĄCZNIE na życzenie ("Pisz jak Dragan" / "rejestr Dragana"), nigdy domyślnie. Warstwa językowa write-polish (czarna lista, anti-slop) obowiązuje dalej.
