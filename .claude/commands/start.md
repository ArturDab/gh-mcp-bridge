---
description: Odtwarza kontekst projektu na starcie sesji i proponuje pierwszy krok
---

# start

**Najpierw ustal tryb** (albo użyj `/tryb`). Odczytaj `CCOS_MODE` (`echo $CCOS_MODE`). Brak zmiennej = `quick`. Powiedz Arturowi w pierwszej linii, w jakim trybie pracujesz, żeby wiedział, czego się spodziewać. W trybie `quick` nie rób pełnego przeglądu stanu - wystarczy `git status`, otwarte PR-y i jedno zdanie o tym, gdzie skończyliście.


Odtwórz kontekst, zanim cokolwiek zmienisz.

Przeczytaj CLAUDE.md, potem docs/STATE.md, STATE.md, STATE.md, STATE.md, STATE.md, STATE.md (jeśli istnieją). Sprawdź `git status`, dostępne skrypty, ostatnie commity, pliki z najnowszego handoffu.

Zanim wprowadzisz jakąkolwiek zmianę w kodzie, daj krótkie podsumowanie:
1. Czym jest projekt
2. Aktualny stan i aktywna faza
3. Najważniejsze ograniczenia
4. Następne rekomendowane zadanie
5. Znane blokery / ryzyka
6. Komendy weryfikacyjne
7. Czy widać stare, brakujące lub sprzeczne informacje

Potem zaproponuj pierwsze konkretne działanie. Nie zaczynaj szerokiego refaktoru. Jeśli dokumentacja kłóci się z kodem, zaufaj kodowi i wskaż konflikt.
