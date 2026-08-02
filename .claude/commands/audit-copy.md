---
description: "Audyt tekstu po polsku (bez przepisywania)"
---

# audit-copy

Analiza, read-only. NIE zmieniaj kodu; poprawki wykonaj osobno (np. /work-autonomous).

Tekstowy odpowiednik obszaru `ui` - diagnoza i plan, nie redakcja. Wczytaj skill `write-polish`, a w nim `references/czarna-lista.md` i `references/anti-slop.md`. Jeśli kontekst to Interia → `write-interia`, ReadAbout.AI → `write-raai` (rozszerzają write-polish).

Przejdź tekst i wychwyć:
- zwroty, kalki i żargon z czarnej listy; zakazane otwarcia ("W dzisiejszych czasach") i zamknięcia ("Podsumowując");
- wzorce strukturalne W1-W8 z anti-slop: rampy, akapity ramowe, formalne łączniki, łańcuchy "który", zbędne zaimki;
- konstrukcje przeciwstawne budujące tezę przez zaprzeczenie (ogon "X, nie Y", "Nie A. To B." itd.) - test: usuń zaprzeczoną połowę, jeśli twierdzenie stoi samo, do cięcia;
- mikro-hedging, personifikację produktów, narratora z dystansu ("obserwuje się");
- zdania przechodzące test cytatu (za gładkie, uniwersalna mądrość pod LinkedIn);
- rytm (monotonia długości zdań), superlatywy zamiast konkretu.

Na każdy problem: severity (critical/high/medium/low), miejsce (cytat fragmentu), dlaczego to problem, konkretna poprawka. Pokaż wzorzec i przykład naprawy - nie przepisuj całości. Na końcu: scoring 1-10 w pięciu wymiarach (bezpośredniość, rytm, zaufanie do czytelnika, naturalność, gęstość), suma /50, próg 35; plan w 3 etapach: szybkie cięcia → przebudowa zdań i rytmu → głębszy poziom (kąt, struktura, otwarcie/zamknięcie). Nie modyfikuj tekstu; redakcja to już zadanie write-polish.
