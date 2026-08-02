---
description: "Przebuduj istniejące UI ekran po ekranie"
---

# design-rebuild

Zero emoji (ikony Lucide), light mode domyślnie, bez em-dash. Nie ruszaj backendu/API/auth/bazy.

Przebudowa, nie polish. Kierunek bierz z docs/VISUAL_DIRECTION.md (jeśli pusty, najpierw `/design-direction`).

Najpierw zobacz realny stan: uruchom aplikację, screenshoty na 1440/1024/768/390. Audyt: co wygląda jak MVP, co niespójne, zbyt generyczne, nieczytelne, co przebudować a nie poprawić.

Implementacja w kolejności: layout i hierarchia → komponenty → stany UI → polish wizualny. Nie zaczynaj od kolorów i fontów. Ujednolić spacing, typografię, warianty. Dodaj brakujące empty/loading/error/success. Zachowaj funkcjonalność. Po każdej większej zmianie screenshot i krytyczna ocena; jeśli nadal wygląda jak MVP, popraw przed końcem. Zaktualizuj VISUAL_DIRECTION.md przy nowych regułach. Uruchom weryfikację.

Definition of done: realnie nowy layout głównych ekranów, spójny profesjonalny interfejs, ujednolicone komponenty, lepsza hierarchia, dopracowane stany, działa desktop/mobile, screenshoty potwierdzają poprawę.
