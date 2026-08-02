> UWAGA: 6 dokumentow stanu scalono do `docs/STATE.md` (sekcje: Stan teraz, Plan / Roadmap,
> Decyzje, Dlug techniczny, Diagnozy / Debugging, Handoff / otwarte watki). Czytaj/pisz do wlasciwej sekcji STATE.md.

---
description: "Zamknij sesję: zapis do dokumentacji i roadmapy, handoff do następnej sesji"
---

# end

Sesje przeskakują między trybami. Sesja w Deep nie widzi, co przed chwilą zrobiła sesja w Fast - **jedynym łącznikiem jest dokumentacja**. Dlatego zapis do dokumentacji obowiązuje we wszystkich trybach, także w fast. Ma być krótki, nie ma być pominięty.

## Krok 1 - sprawdź realny stan

`git status`, `git diff`, ostatnie zmiany. Nie pisz z pamięci.

## Krok 2 - zapisz zmiany

Commit i PR na `preview`, jeśli jest co commitować.

## Krok 3 - dokumentacja (zawsze, krótko)

**`docs/STATE.md`** - dopisz, co się zmieniło. Kilka zdań, nie esej. Usuń zapisy, które przestały być prawdziwe.

**`docs/STATE.md`** - dopisz nowe pozycje ustalone w tej sesji (może być kilka), odhacz zrobione, usuń te, które przestały mieć sens.

**Przy każdej pozycji i podpozycji w roadmapie dopisz w nawiasie kwadratowym sugerowany tryb:**
- `[fast]` - zwykła zmiana, wiadomo co zrobić, wynik widać od razu
- `[deep]` - wymaga długiego biegu, refaktoru, wielu plików, albo weryfikacji, bo nikt nie będzie patrzył na ręce
- `[test]` - to audyt, pomiar albo przegląd wizualny, nie zmiana kodu

Przykład:
```
- [ ] Eksport listy do CSV [fast]
- [ ] Przebudowa modelu danych pod wielojęzyczność [deep]
  - [ ] Audyt obecnych miejsc z tekstami [test]
  - [ ] Migracja tabel [deep]
- [ ] Poprawić odstępy w nagłówku [fast]
```

Tryb jest **sugestią, nie wyrokiem**. Jeśli nie jesteś pewien, daj `[fast]` - Artur i tak zdecyduje przy starcie sesji.

**`CLAUDE.md`** - tylko gdy zmienił się stos, komendy, architektura albo pojawiła się nowa pułapka. Nie rozbudowuj w dziennik. Nigdy nie zapisuj zdań typu „tego się nie da" - to rozbraja kolejne sesje.

## Krok 4 - handoff

Gotowy do skopiowania prompt startowy do następnej sesji, w bloku kodu:
- w jakim trybie ją otworzyć i dlaczego
- krótki kontekst
- konkretne następne zadanie
- pułapki, o których następna sesja musi wiedzieć

## Czego NIE robisz

Nie sprzątasz repozytorium. Nie usuwasz martwego kodu. Nie uruchamiasz pełnego audytu. Od tego jest `/clean` w trybie Deep.
