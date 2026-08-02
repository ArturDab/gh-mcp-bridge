---
description: "Przegląd wizualny szablonów"
---

# wp-render

**Tryb: tylko `test`.** Jeśli `CCOS_MODE` jest inny, odpowiedz jednym zdaniem, że ta komenda działa w środowisku Test, i nie wykonuj jej.


WordPress na lokalnym Playground. Read-only, nie zmieniaj kodu.

Uruchom motyw w lokalnym WordPress Playground i przejrzyj go wizualnie (domyślnie front page, pojedynczy wpis, archiwum, strona, 404).

Wczytaj skille `wordpress-dev` i `screenshot-driven-ui-review`. Najpierw preflight runtime: w CC web uruchom WordPressa **lokalnie** (wp-now albo wp-env) i zrzucaj **headless Chromium (Playwright)** z lokalnego URL. **NIE** używaj `@wp-playground/mcp` w chmurze - mostkuje do Playgrounda w Twojej przeglądarce, której sandbox nie dosięga (wieczne `connectedTabs:0`). Po starcie sprawdź treść: jeśli instalacja jest pusta (świeży WP, brak realnych wpisów/kategorii), **najpierw zasiej** treść testową (`tests/fixtures/seed.sh`, a gdy go brak - stwórz minimalny seed), dopiero potem rób zrzut - pusty szkielet to nie gotowy render i nie prosisz o to użytkownika. Jeśli lokalny runtime nie wstaje, podaj dokładnie czego brakuje (zwykle Network Full/Custom + Playwright Chromium) i dopiero wtedy oceń z markupu, oznaczając brak weryfikacji wizualnej.

Render każdego szablonu na 1440 i 390 px, z higieną zrzutu (animacje off, czekanie na stan). Oceń wg checklisty `screenshot-driven-ui-review` + specyfika WP: spójność theme.json, poprawność wzorców i parts, stany pustych pętli, nawigacja. Na problem: gdzie, dlaczego, konkretna poprawka, plik.
