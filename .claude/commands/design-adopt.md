---
description: "Usztywnij gotowy design jako kanon repo"
---

# design-adopt

**Tryb: tylko `build`.** Jeśli `CCOS_MODE` jest inny, odpowiedz jednym zdaniem, że ta komenda działa w środowisku Build, i nie wykonuj jej.

Zero emoji (ikony Lucide), light mode domyślnie, bez em-dash. Nie ruszaj backendu/API/auth/bazy.

Zamień gotowy kierunek w obowiązujący kanon repo. Źródło dowolne: paczka Handoff z Claude Design, kierunek z `/design-direction` (VISUAL_DIRECTION.md), albo gotowy projekt w Figmie (link `figma.com/design/<fileKey>/...?node-id=<nodeId>`).

1. **Wczytaj źródło i stack.** Rozpoznaj stack (WordPress FSE / React / inne).
   - Z paczki Claude Design wyciągnij tokeny, strukturę komponentów, screenshoty.
   - Z `/design-direction` weź VISUAL_DIRECTION.md.
   - **Z Figmy:** użyj `get_design_context` (opis pełnej procedury odczytu i przekładu wartości na skalę projektu - skill `artur-claude-code-os`, sekcja „Odczyt projektu z Figmy"). Figma zwraca wartości wprost (`px-[32px]`, `#2D2E87`) - nigdy nie wklejaj ich do kodu, zawsze przekładaj na najbliższy krok skali projektu i zgłoś rozjazdy jednym bulletem.
2. **Zmapuj na kanon (propozycja, jeszcze nie zapis):**
   - **WordPress FSE:** theme.json (`settings` + `styles`) jako jedyne źródło prawdy + docs/DESIGN_SYSTEM.md. Wczytaj wordpress-dev.
   - **React/inne:** plik tokenów (CSS variables / theme) + docs/VISUAL_DIRECTION.md jako kanon.
   Pokaż diff koncepcyjny i które komponenty/ekrany odbiegają.
3. **STOP, czekaj na akcept Artura.** Nie zapisuj kanonu bez wyraźnej zgody - to decyzja na całe repo.
4. **Usztywnij (po akcepcie):** zapisz kanon. Reguła odtąd: cały UI TYLKO na tokenach, zero hardkodów (wpięte w screenshot-driven-ui-review). Wypisz listę rozjazdów do migracji, ale nie przebudowuj tu - od tego `/design-rebuild` i `/design-evolve`.

Output: co weszło do kanonu; gdzie zapisane; lista rozjazdów; następny krok.
