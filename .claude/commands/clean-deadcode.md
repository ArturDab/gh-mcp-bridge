---
description: "Martwy kod i nieużywane zależności"
---

# clean-deadcode

**Tryb: tylko `deep`.** Jeśli `CCOS_MODE` jest inny, odpowiedz jednym zdaniem, że ta komenda działa w środowisku Deep, i nie wykonuj jej. Zwykle nie wołasz jej wprost - jest częścią składową `/clean`.


Autonomicznie przez bezpieczne kroki. Zatrzymaj się przy operacjach destrukcyjnych, sekretach, migracjach produkcyjnych, auth/payments, kasowaniu plików o niepewnym statusie. Nie commituj bez sygnału.

Znajdź to, co można bezpiecznie usunąć. Użyj narzędzi jeśli są (knip, depcheck, ts-prune, unimport) plus analiza. Wychwyć: nieużywane pliki i eksporty, martwe gałęzie kodu, nieużywane zależności w package.json, zduplikowane implementacje tego samego, zakomentowany kod bez wartości, nieużywane assety. Na pozycję: co, dowód nieużycia, ryzyko usunięcia. Usuwaj tylko przy pewności (narzędzie plus sprawdzenie referencji); niepewne oznacz do przeglądu, nie kasuj. Nie ruszaj kodu produkcyjnego o niejasnym statusie, migracji, publicznego API. Po usunięciu uruchom weryfikację (build, test), żeby potwierdzić brak regresji.
