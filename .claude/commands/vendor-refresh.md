---
description: "Odswiez zvendorowane skille zewnetrzne od zrodla (VENDORED.md)"
---

# vendor-refresh

Argument: nazwa skilla z tabeli `plugins/artur/skills/VENDORED.md` (np. `use-railway`) albo `all`
dla wszystkich pozycji tabeli. Bez argumentu - zapytaj, ktory skill albo `all`.

Dla kazdego wskazanego skilla:
1. Wczytaj `plugins/artur/skills/VENDORED.md`, znajdz wiersz (kolumny Zrodlo/Pobranie).
2. Pobierz aktualna wersje ze zrodla do katalogu tymczasowego wg kolumny "Pobranie" (`npx skills add
   ...` albo `git clone` + wskazany podkatalog, w zaleznosci od wiersza).
3. Porownaj z biezaca zawartoscia `plugins/artur/skills/<nazwa>/`.
   - Identyczne -> zgloś "bez zmian", nic nie ruszaj, przejdz do kolejnego.
   - Rozne -> PODMIEN caly katalog (buduj od zera, nie lataj punktowo - to artefakt zewnetrzny,
     nie tresc autorska tego repo). Pokaz zwiezle podsumowanie: ktore pliki zmienione/dodane/
     usuniete, w przyblizeniu ile linii +/-.
4. Nigdy nie modyfikuj tresci merytorycznej skilla wzgledem zrodla (to nie miejsce na wlasne
   poprawki - jesli cos w zvendorowanym skillu przeszkadza, to osobna decyzja, nie czesc tej
   komendy).

Zapis: galaz robocza + PR, jak reszta zapisu OS-u (nigdy commitem wprost na main w tym repo).
Nie rozlewaj recznie do repo konsumujacych - po zmergowaniu PR-a robi to juz `sync-to-repos.yml`.

Na koniec: lista sprawdzonych skilli, ktore zmienione a ktore bez zmian, link do PR-a. Jesli
zrodlo jednego z skilli jest niedostepne (np. repo usuniete/przeniesione) - zgloś to jako brak,
nie przerywaj sprawdzania pozostalych.
