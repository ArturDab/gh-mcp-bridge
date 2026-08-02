---
description: "Rozwiń istniejący kanon bez rozjeżdżania"
---

# design-evolve

Zero emoji (ikony Lucide), light mode domyślnie, bez em-dash. Nie ruszaj backendu/API/auth/bazy.

Dodaj, zmień lub rozszerz element obowiązującego systemu, pilnując spójności.

1. **Wczytaj kanon:** theme.json + DESIGN_SYSTEM.md (WP) albo tokeny + VISUAL_DIRECTION.md (React). Jeśli kanonu nie ma, przerwij i zaproponuj najpierw `/design-adopt`.
2. **Zaprojektuj zmianę w ramach kanonu** - ma wynikać z istniejącej skali, palety, rytmu. Bez nowych hardkodów; nowe wartości tylko jako nazwane rozszerzenie tokenów. Złamanie reguły nazwij wprost jako decyzję.
3. **STOP przy zmianach łamiących spójność.** Drobne dodatki (nowy wariant w skali) proponuj od razu. Zmiany fundamentu (paleta, skala typografii, główny akcent) wymagają akceptu przed zapisem.
4. **Zaktualizuj kanon i wskaż skutki.** Po akcepcie zapisz. Wypisz komponenty do dociągnięcia (implementacja: `/design-rebuild` albo wordpress-dev). Zweryfikuj wizualnie (screenshot-driven-ui-review).

Output: co się zmieniło w kanonie; pliki; lista do dociągnięcia; screenshot; następny krok.
