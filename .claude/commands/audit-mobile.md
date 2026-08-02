---
description: "Doprowadź wersję mobilną do porządku: audyt + pełna lista tego, co trzeba zrobić"
argument-hint: "[opcjonalnie: które ekrany]"
---

# audit-mobile

**Tryb: `test`.** W innym odmów i odeślij.

Wersja mobilna rozjeżdża się częściej niż desktopowa, bo powstaje jako refleksja po fakcie. Ta komenda ma przejść **wszystko**, co trzeba przejść, żeby mobilna wersja była skończona - nie wybrać kilka rzeczy na wyrywki.

## Szerokości do sprawdzenia

Zawsze wszystkie trzy: **390** (typowy telefon), **360** (mały telefon, wciąż popularny), **768** (tablet, granica breakpointów - tam najczęściej się psuje).

## Pełna lista kontrolna

Przejdź **każdy punkt** dla każdego ekranu. Nie pomijaj, bo „na oko wygląda dobrze".

**Układ**
- [ ] czy cokolwiek wychodzi poza ekran (poziomy pasek przewijania to zawsze błąd)
- [ ] czy tekst się nie łamie w brzydkich miejscach i nie przelewa poza kontener
- [ ] czy siatka przechodzi na jedną kolumnę, gdzie powinna
- [ ] czy odstępy nie są desktopowe (zbyt duże marginesy zjadają szerokość)
- [ ] czy obrazy się skalują, a nie przycinają w losowym miejscu

**Dotyk**
- [ ] czy każdy klikalny element ma co najmniej 44×44 px pola dotyku
- [ ] czy elementy klikalne nie są zbyt blisko siebie
- [ ] czy nie ma funkcji dostępnej **tylko** przez najechanie kursorem (na telefonie nie ma kursora)
- [ ] czy przewijanie działa tam, gdzie treść nie mieści się w kontenerze

**Nawigacja**
- [ ] czy menu ma wersję mobilną i czy da się je zamknąć
- [ ] czy da się wrócić z każdego ekranu
- [ ] czy modale i panele boczne mieszczą się na ekranie i dają się zamknąć

**Formularze**
- [ ] czy klawiatura nie zasłania pola, które się wypełnia
- [ ] czy pola mają właściwy typ klawiatury (`type="email"`, `type="tel"`, `inputmode`)
- [ ] czy komunikaty błędów są widoczne bez przewijania
- [ ] czy przycisk zatwierdzenia jest w zasięgu kciuka

**Wydajność**
- [ ] czy obrazy nie są ładowane w rozdzielczości desktopowej
- [ ] czy pierwsze wyświetlenie nie trwa dłużej niż kilka sekund na wolnym łączu

**Tekst**
- [ ] czy podstawowy tekst ma co najmniej 16 px (mniejszy powoduje przybliżanie w Safari)
- [ ] czy nagłówki mają mobilną skalę, a nie desktopową

## Wynik

Dla każdego niezaznaczonego punktu: ekran, szerokość, co konkretnie źle, co ma być zamiast. Plus zrzut ekranu jako dowód.

Na końcu: **pełna lista rzeczy do zrobienia**, posortowana, gotowa do wklejenia jako zadanie do sesji Fast. Nie ogólniki - konkretne pozycje.

## Czego nie robisz

Nie naprawiasz (to tryb Test). Nie commitujesz.
