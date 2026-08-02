---
description: "Audyt zgodności interfejsu z kanonem: tokeny, shadcn, skala, stany. Bez oglądania - mierzenie"
argument-hint: "[opcjonalnie: ekran lub obszar]"
---

# audit-ui

**Tryb: `test` albo `deep`.** W `fast` odmów i odeślij.

To **nie jest** oglądanie zrzutów ekranu i mówienie „wygląda dobrze". Claude nie mierzy pikseli i nie wyłapie 4 px różnicy w odstępie. Ten audyt sprawdza rzeczy **mechanicznie sprawdzalne**, i dlatego faktycznie znajduje rozjazdy.

## Co sprawdzasz

### 1. Wartości z palca (główna przyczyna rozjazdów)
Przeszukaj kod komponentów. Zgłoś każde wystąpienie:
- wartości spoza skali Tailwinda: `p-[13px]`, `mt-[7px]`, `w-[347px]`, `text-[15px]`, `gap-[9px]`
- kolory zapisane wprost: `#hex`, `rgb()`, `hsl()` w klasach albo stylach
- odstępy i rozmiary w `style={{ }}`
- własne wartości `line-height`, `letter-spacing` poza skalą

Każde wystąpienie: plik, linia, wartość, co powinno tam być zamiast.

### 2. Zgodność z shadcn/ui
- czy komponenty pochodzą z shadcn, czy ktoś napisał własne odpowiedniki (przycisk, pole, modal, karta, tabela)
- czy warianty (`variant`, `size`) są używane, czy nadpisywane klasami
- czy `cn()` jest używane do łączenia klas
- brakujące komponenty, które powinny pochodzić z shadcn, a są pisane ręcznie

### 3. Kompletność stanów
Dla każdego interaktywnego elementu: czy istnieje `hover`, `focus-visible`, `disabled`, `active`? Dla każdej listy i formularza: czy istnieje stan pusty, ładowania, błędu?

Brak stanu to nie kosmetyka - to niedokończony komponent.

### 4. Spójność między ekranami
Czy ten sam element wygląda tak samo w różnych miejscach? Czy nagłówki mają tę samą hierarchię? Czy odstępy między sekcjami są ze skali, czy każdy ekran ma własną?

### 5. Dostępność - minimum
Kontrast, etykiety pól, `alt` na obrazach, kolejność `tab`, `aria-label` tam, gdzie tekst jest tylko wizualny.

## Wynik

**Nie sekcje ogólne. Konkretne pozycje z dowodem.**

| Waga | Co | Gdzie | Powinno być |
|---|---|---|---|
| krytyczna | `p-[13px]` | `Card.tsx:24` | `p-3` |

Trzy poziomy: **krytyczne** (rozjazdy od kanonu, brak stanów), **ważne** (niespójności między ekranami), **kosmetyczne**.

Na końcu: liczba naruszeń w sumie, i czy warto włączyć blokadę w linterze (jeśli nie ma).

## Czego nie robisz

Nie naprawiasz. Nie robisz zrzutów ekranu jako dowodu (dowodem jest linia kodu). Nie oceniasz „czy ładnie" - od tego jest Artur.
