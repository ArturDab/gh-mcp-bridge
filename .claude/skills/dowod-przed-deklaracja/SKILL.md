---
name: dowod-przed-deklaracja
description: Wczytuj ZAWSZE, zanim napiszesz, że coś jest zrobione, naprawione, przechodzi testy albo działa. Zakazuje twierdzeń bez świeżego dowodu z uruchomionej komendy. Obowiązuje we wszystkich trybach, także fast.
---

# Dowód przed deklaracją

Twierdzenie, że praca jest skończona, bez sprawdzenia, nie jest oszczędnością czasu. Jest nieprawdą.

## Żelazna zasada

**Jeśli nie uruchomiłeś sprawdzianu w tej turze, nie możesz napisać, że przechodzi.**

## Bramka

Zanim napiszesz cokolwiek o stanie pracy:

1. **Ustal:** jaka komenda udowadnia to, co chcesz napisać?
2. **Uruchom** ją. W całości, świeżo. Nie przypominaj sobie poprzedniego wyniku.
3. **Przeczytaj** wynik. Kod wyjścia, liczbę błędów, pełny tekst.
4. **Sprawdź:** czy wynik potwierdza to, co chcesz napisać?
   - Nie: napisz, jak jest naprawdę, z dowodem.
   - Tak: napisz to, **razem z dowodem**.

Pominięcie kroku to nie skrót. To zmyślanie.

## Co czego dowodzi

| Chcesz napisać | Potrzebujesz | Nie wystarcza |
|---|---|---|
| testy przechodzą | wynik komendy testowej, zero błędów | poprzedni przebieg, „powinno przejść" |
| lint czysty | wynik lintera, zero błędów | częściowe sprawdzenie |
| build się buduje | build, kod wyjścia 0 | przechodzący lint (to co innego) |
| błąd naprawiony | test pierwotnego objawu przechodzi | kod zmieniony, więc pewnie działa |
| subagent zrobił robotę | różnica w plikach pokazuje zmiany | subagent napisał „gotowe" |
| wymagania spełnione | odhaczona lista punkt po punkcie | testy przechodzą |

## Czerwone flagi - zatrzymaj się

- piszesz „powinno", „prawdopodobnie", „wygląda na to, że"
- piszesz „gotowe", „działa", „naprawione" **przed** uruchomieniem sprawdzianu
- ufasz raportowi subagenta bez sprawdzenia różnicy w plikach
- myślisz „ten jeden raz mogę pominąć"
- sprawdziłeś część i wyciągasz wniosek o całości

## Wymówki i rzeczywistość

| Wymówka | Rzeczywistość |
|---|---|
| „teraz powinno działać" | uruchom sprawdzian |
| „jestem pewien" | pewność to nie dowód |
| „tylko ten raz" | nie ma wyjątków |
| „lint przeszedł" | lint nie kompiluje |
| „subagent napisał, że gotowe" | sprawdź sam |
| „to trywialna zmiana" | trywialne zmiany też się psują |

## W trybie fast

Ta zasada **nie znika** w trybie fast. Zmienia się tylko **ile** sprawdzasz, nie **czy** mówisz prawdę o tym, co sprawdziłeś.

W fast uruchamiasz lint i build raz, na końcu. I piszesz dokładnie to, co z nich wyszło. Jeśli czegoś nie sprawdziłeś, napisz wprost: „nie sprawdzałem testów, zadanie ich nie dotyczyło". To jest uczciwa odpowiedź. „Wszystko działa" bez uruchomienia czegokolwiek - nie jest.

## Jak wygląda dobra deklaracja

Źle: „Naprawione, wszystko działa."

Dobrze: „Naprawione. `npm run build` przechodzi (kod 0), `npm run lint` zero błędów. Testów nie uruchamiałem - zmiana dotyczyła tylko wyglądu."
