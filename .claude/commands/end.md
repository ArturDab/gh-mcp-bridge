---
description: "Zamknij sesję: zapis do dokumentacji i roadmapy, handoff do następnej sesji"
---

# end

**Brak bramy trybu, celowo.** Zapisuje wyłącznie do `docs/STATE.md`, co reguły dopuszczają nawet w trybie quick - bramowanie tej komendy do `build` uniemożliwiłoby domknięcie sesji, która sama pracowała w quick.

Sesje przeskakują między trybami. Sesja w Build nie widzi, co przed chwilą zrobiła sesja w Quick - **jedynym łącznikiem jest dokumentacja**. Dlatego zapis do dokumentacji obowiązuje we wszystkich trybach, także w quick. Ma być krótki, nie ma być pominięty.

## Krok 1 - sprawdź realny stan

`git status`, `git diff`, ostatnie zmiany. Nie pisz z pamięci.

## Krok 2 - zapisz zmiany

Commit i PR na `preview`, jeśli jest co commitować.

## Krok 3 - dokumentacja (zawsze, krótko)

**`docs/STATE.md`** - dopisz, co się zmieniło. Kilka zdań, nie esej. Usuń zapisy, które przestały być prawdziwe.

**`docs/STATE.md`** - dopisz nowe pozycje ustalone w tej sesji (może być kilka), odhacz zrobione, usuń te, które przestały mieć sens.

**Przy każdej pozycji i podpozycji w roadmapie dopisz w nawiasie kwadratowym sugerowany tryb:**
- `[quick]` - zwykła zmiana, wiadomo co zrobić, wynik widać od razu
- `[build]` - wymaga długiego biegu, refaktoru, wielu plików, albo weryfikacji, bo nikt nie będzie patrzył na ręce
- `[audit]` - to audyt, pomiar albo przegląd wizualny, nie zmiana kodu

Przykład:
```
- [ ] Eksport listy do CSV [quick]
- [ ] Przebudowa modelu danych pod wielojęzyczność [build]
  - [ ] Audyt obecnych miejsc z tekstami [audit]
  - [ ] Migracja tabel [build]
- [ ] Poprawić odstępy w nagłówku [quick]
```

Tryb jest **sugestią, nie wyrokiem**. Jeśli nie jesteś pewien, daj `[quick]` - Artur i tak zdecyduje przy starcie sesji.

**`CLAUDE.md`** - tylko gdy zmienił się stos, komendy, architektura albo pojawiła się nowa pułapka. Nie rozbudowuj w dziennik. Nigdy nie zapisuj zdań typu „tego się nie da" - to rozbraja kolejne sesje.

## Krok 4 - handoff

Gotowy do skopiowania prompt startowy do następnej sesji, w bloku kodu. **Zaczyna się od trzech ustawień, w tej kolejności** (ustalenia.md §15a, repo `sztab`):

```
Tryb: <quick|build|audit>
Model: <Sonnet domyślnie | Haiku do wsadu | Opus do architektury>
Wysiłek: <niski|średni|wysoki>
```

Jeśli któraś wartość nie jest oczywista, dopisz pod blokiem jedno zdanie uzasadnienia - to rekomendacja, wybór ostateczny należy do Artura. Po tych trzech liniach, w tym samym bloku:
- krótki kontekst
- konkretne następne zadanie
- pułapki, o których następna sesja musi wiedzieć

## Czego NIE robisz

Nie sprzątasz repozytorium. Nie usuwasz martwego kodu. Nie uruchamiasz pełnego audytu. Od tego jest `/clean` w trybie Build.
