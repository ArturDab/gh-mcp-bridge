---
name: wordpress-dev
description: Praca z WordPressem zgodnie ze sztuką - motywy blokowe (FSE), theme.json, wydajność, dostępność, treści. Wczytuj zawsze, gdy projekt to WordPress: tworzenie i edycja motywu, render i przegląd wizualny, speed/Core Web Vitals, audyt a11y, dodawanie wpisów. Dotyczy stron self-hosted (RAAI, Beezu, Animails na LH.pl), nie WordPress.com.
---

# WordPress Dev

Reguły pracy z WordPressem tak, żeby było dobrze, nie byle jak. Bazą wizualną jest skill screenshot-driven-ui-review (preflight przeglądarki, higiena zrzutu) - ten skill dokłada warstwę WordPressową.

## Runtime: na czym renderować (preflight)

Nie zgaduj, czy „się da". Renderujesz, uruchamiając WordPressa **lokalnie w sandboxie** (WASM, bez Dockera i MySQL) i robiąc zrzut **headless Chromium (Playwright)** z lokalnego URL. W sesji CC web to jedyna ścieżka, która działa - cała wewnątrz sandboxa, bez Twojej przeglądarki.

Kolejność wyboru (CC web):
1. **wp-now** - `npx @wp-now/wp-now` z katalogu motywu: serwer PHP + SQLite na `http://localhost:<port>`, bez przeglądarki. Potem zrzut Playwrightem (skill screenshot-driven-ui-review) z tego lokalnego URL.
2. **wp-env w trybie Playground** - `npx @wordpress/env start` (bez Dockera). Montuje i aktywuje motyw, serwuje lokalnie; zrzut jak wyżej.

**NIE używaj `@wp-playground/mcp` w CC web.** Ten serwer MCP mostkuje AI z Playgroundem działającym **w Twojej przeglądarce** przez lokalny WebSocket (AI → MCP → WebSocket → karta przeglądarki). W chmurze MCP siedzi w sandboxie Claude, a Twoja przeglądarka nie dosięga jego portu przez internet - efekt to wieczne `connectedTabs:0` mimo otwartej karty. Wpis w `.mcp.json` zostaw dla lokalnego CC/desktopa (tam przeglądarka i MCP są na tej samej maszynie), w chmurze renderuj przez wp-now/wp-env + headless Chromium.

Wymóg środowiska (CC web): Network Full/Custom + Playwright Chromium w setup scripcie (`PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright`, patrz ECOSYSTEM §12). Bez tego nic nie wstanie.

Preflight: sprawdź, czy node jest i czy lokalny serwer wstaje. Jeśli nie wstaje, podaj DOKŁADNIE czego brakuje (zwykle sieć/Chromium) i dopiero wtedy oceniaj z markupu/kodu, OZNACZAJĄC brak weryfikacji wizualnej. Nigdy samo „nie da się odpalić WordPressa", i nigdy nie przeskakuj do audytu z kodu, gdy lokalna ścieżka renderu jest dostępna.

**Pusta instalacja ≠ zepsuty render - zasiej, zanim ocenisz.** Lokalny runtime nigdy nie ma treści produkcyjnej (dane produkcji są tylko na stagingu/`/test`, patrz polityka deployu projektu). Świeży Playground pokaże sam szkielet - to normalne, nie błąd. Zanim zrobisz zrzut: jeśli instalacja jest pusta (tylko „Hello world!", brak realnych wpisów/kategorii), **najpierw zasiej treść testową, potem renderuj**. Konwencja: uruchom `tests/fixtures/seed.sh` projektu, jeśli istnieje; jeśli go nie ma - **stwórz** minimalny seed i zapisz do `tests/fixtures/seed.sh` (wielokrotnego użytku). Dobry seed = kilka kategorii dopasowanych slugiem do tego, czego szuka front page motywu (żeby sekcje się wypełniły różną treścią, nie wpadły w fallback) + po kilka wpisów na kategorię + jedna strona statyczna. Nigdy nie renderuj pustego szkieletu i nigdy nie proś użytkownika o treść do lokalnego renderu - od oceny treści jest staging.

## Motyw blokowy (FSE) zgodnie ze sztuką

- **theme.json to jedyne źródło prawdy** dla kolorów, typografii, spacingu, layoutu. Definiuj jako `settings` + `styles`; zero hardkodowanych hex w CSS, zero inline stylów obchodzących theme.json. To ta sama zasada co tokeny w reszcie ekosystemu.
- Struktura: `templates/` (szablony), `parts/` (header, footer), `patterns/` (wzorce blokowe), `styles/` (warianty globalnych stylów). Treść układasz z bloków i wzorców, nie z surowego HTML w PHP.
- **Create Block Theme** (wtyczka) do scaffoldu nowego motywu i do zapisu zmian z edytora z powrotem do theme.json/plików - nie przepisuj theme.json ręcznie, gdy można wyeksportować.
- **@wordpress/scripts** do buildu (bloki, assety): `wp-scripts build` / `start`. Nie commituj nieprzebudowanych assetów.
- functions.php minimalnie: poprawny `wp_enqueue_*`, `add_theme_support`, rejestracja wzorców. PHP: escaping (`esc_html`, `esc_attr`, `esc_url`), sanitizacja inputu, nonce przy formularzach, i18n (jeden text domain = slug motywu). Nigdy nie edytuj core ani nie hakuj wtyczek w core.
- child theme tylko, gdy nadbudowujesz cudzy motyw; własny od zera to pełny motyw blokowy.

## Pętla jakości (render → speed → a11y)

1. Render w Playground na 1440 i 390 px (higiena ze screenshot-driven-ui-review: animacje off, czekanie na stan). Sprawdź kluczowe szablony: front page, pojedynczy wpis, archiwum/kategoria, strona, wyniki wyszukiwania, 404.
2. **Speed**: `lighthouse <local-url> --preset=desktop` i mobile. Cele Core Web Vitals: LCP < 2.5 s, INP < 200 ms, CLS < 0.1. Typowe winy w WP: nieoptymalne obrazy (brak rozmiarów/lazy/WebP), za dużo wtyczek ładujących skrypty globalnie, brak cache, web fonty bez `font-display`.
3. **A11y**: `axe <local-url>` + zasady accessibility-ready (kontrast, focus widoczny, nawigacja klawiaturą, alt teksty, landmarki, etykiety formularzy).
4. Popraw i powtórz, aż przejdzie. Oddajesz dopiero po pętli, ze screenshotami i liczbami z Lighthouse.

## Treści i WP-CLI

Do dev/seed na lokalnym Playground: WP-CLI (`wp post create`, `wp term`, `wp option`). Import treści, generowanie przykładowych wpisów, konfiguracja opcji - lokalnie, nie na żywej stronie. Publikacja na żywy LH.pl to osobna, poświadczona ścieżka (patrz granica wyżej).

## Pułapki

- Mobile-first: WordPress domyślnie nie jest responsywny „za darmo" - sprawdzaj realny render na 390, nie zakładaj.
- theme.json bywa cache'owany; w trybie deweloperskim zmiany w nim widać od razu (WP_DEVELOPMENT_MODE=theme), poza nim trzeba czyścić cache.
- Nie myl motywu blokowego (FSE, edytor witryny) z klasycznym (PHP templates) - konwencje są różne; tu domyślnie robimy blokowe.
- **Skąd brać ścieżkę i mechanizm deployu: z repo, nie z głowy i nie przez SSH.** Jak projekt się wdraża jest zapisane w repo - w skrypcie deployu (`scripts/deploy-*.sh`) i/lub w `docs/DEPLOYMENT.md` / `docs/deployment.md`. Stamtąd odczytaj docelową ścieżkę motywu na serwerze i sposób wdrożenia. NIGDY nie wysyłaj użytkownika, żeby logował się przez SSH i `pwd`-ował ścieżkę, która jest już zahardkodowana w skrypcie deployu - Artur nie jest devem i nie loguje się przez SSH. Jeśli repo nie ma skryptu/doca deployu, powiedz to wprost i zapytaj, nie improwizuj kroków SSH. Przykład (RAAI): `scripts/deploy-staging.sh` ma `DEST=.../public_html/readabout.ai/test/wp-content/themes/readabout`, a cron LH.pl robi `git pull` gałęzi `staging` + rsync motywu co 5 min - czyli deploy na staging = push na `staging`, zero SSH.
