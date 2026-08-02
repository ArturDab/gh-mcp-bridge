---
description: Odpala obowiązkową pętlę wizualną na bieżącym UI: render, ocena, poprawki, screenshoty
argument-hint: "[opcjonalnie: który ekran/flow]"
---

# Visual Check

**Tryb: tylko `test`.** Jeśli `CCOS_MODE` jest inny, odpowiedz jednym zdaniem, że ta komenda działa w środowisku Test, i nie wykonuj jej.


Uruchom pętlę screenshot-driven-ui-review (skill o tej nazwie) na bieżącym interfejsie. Zakres: $ARGUMENTS (domyślnie zmienione ekrany).

Wykonaj pętlę do końca, sam: render → screenshot na 1440/1024/768/390 → sprawdź stany (empty/loading/error/success, hover/focus, modale) → oceń krytycznie wg checklisty → popraw → powtórz, aż przejdzie. Tokeny zamiast hardkodów, zero emoji, light mode.

Oddaj dopiero wersję po pętli, ze screenshotami finalnymi i krótką notą, co poprawiłeś i dlaczego. Jeśli render niedostępny, powiedz wprost i nie udawaj, że pętla przeszła.
