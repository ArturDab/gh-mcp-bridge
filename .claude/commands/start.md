> UWAGA: 6 dokumentow stanu scalono do `docs/STATE.md` (sekcje: Stan teraz, Plan / Roadmap,
> Decyzje, Dlug techniczny, Diagnozy / Debugging, Handoff / otwarte watki). Czytaj/pisz do wlasciwej sekcji STATE.md.

---
description: Odtwarza kontekst projektu na starcie sesji i proponuje pierwszy krok
---

# start

**Najpierw ustal tryb.** Odczytaj `CCOS_MODE` (`echo $CCOS_MODE`). Brak zmiennej = `fast`. Powiedz Arturowi w pierwszej linii, w jakim trybie pracujesz, żeby wiedział, czego się spodziewać. W trybie `fast` nie rób pełnego przeglądu stanu - wystarczy `git status`, otwarte PR-y i jedno zdanie o tym, gdzie skończyliście.


Odtwórz kontekst, zanim cokolwiek zmienisz.

Przeczytaj CLAUDE.md, potem docs/STATE.md, STATE.md, STATE.md, STATE.md, STATE.md, STATE.md (jeśli istnieją). Sprawdź `git status`, dostępne skrypty, ostatnie commity, pliki z najnowszego handoffu.

Sprawdź też **otwarte PR-y pod kątem nieobsłużonych komentarzy Codexa** (`chatgpt-codex-connector[bot]`). Jeśli któraś runda recenzji przepadła w poprzedniej sesji, podejmij ją teraz wg wzorca ze skilla artur-claude-code-os.

Zanim wprowadzisz jakąkolwiek zmianę w kodzie, daj krótkie podsumowanie:
1. Czym jest projekt
2. Aktualny stan i aktywna faza
3. Najważniejsze ograniczenia
4. Następne rekomendowane zadanie
5. Znane blokery / ryzyka
6. Komendy weryfikacyjne
7. Czy widać stare, brakujące lub sprzeczne informacje

Potem zaproponuj pierwsze konkretne działanie. Nie zaczynaj szerokiego refaktoru. Jeśli dokumentacja kłóci się z kodem, zaufaj kodowi i wskaż konflikt.
