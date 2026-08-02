---
description: "Usztywnij gotowy design jako kanon repo"
---

# design-adopt

Zero emoji (ikony Lucide), light mode domyślnie, bez em-dash. Nie ruszaj backendu/API/auth/bazy.

Zamień gotowy kierunek w obowiązujący kanon repo. Źródło dowolne: paczka Handoff z Claude Design albo kierunek z trybu `direction` (VISUAL_DIRECTION.md).

1. **Wczytaj źródło i stack.** Rozpoznaj stack (WordPress FSE / React / inne). Z paczki Claude Design wyciągnij tokeny, strukturę komponentów, screenshoty. Z trybu `direction` weź VISUAL_DIRECTION.md.
2. **Zmapuj na kanon (propozycja, jeszcze nie zapis):**
   - **WordPress FSE:** theme.json (`settings` + `styles`) jako jedyne źródło prawdy + docs/DESIGN_SYSTEM.md. Wczytaj wordpress-dev.
   - **React/inne:** plik tokenów (CSS variables / theme) + docs/VISUAL_DIRECTION.md jako kanon.
   Pokaż diff koncepcyjny i które komponenty/ekrany odbiegają.
3. **STOP, czekaj na akcept Artura.** Nie zapisuj kanonu bez wyraźnej zgody - to decyzja na całe repo.
4. **Usztywnij (po akcepcie):** zapisz kanon. Reguła odtąd: cały UI TYLKO na tokenach, zero hardkodów (wpięte w screenshot-driven-ui-review). Wypisz listę rozjazdów do migracji, ale nie przebudowuj tu - od tego tryby `rebuild` i `evolve`.

Output: co weszło do kanonu; gdzie zapisane; lista rozjazdów; następny krok.
