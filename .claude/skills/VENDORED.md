# Skille zewnętrzne w bibliotece (ewidencja pochodzenia)

Wszystkie poniższe są zvendorowane jako pliki w repo (nie runtime). Aktualizacja: `/vendor-refresh <nazwa>` albo `all` - pobiera u źródła i podmienia cały katalog, potem rozlewa przez sync Action.

| Skill | Źródło | Pobranie | Pobrano (data, commit `ccos`) |
|---|---|---|---|
| frontend-design | Anthropic (publiczny) | skopiowany z publicznych skilli Anthropic | 2026-08-02, `2eb760a` |
| claude-api | anthropics/skills (oficjalny) | `git clone --depth 1 https://github.com/anthropics/skills`, katalog `skills/claude-api` | 2026-08-08, `a82f30f` |
| web-design-guidelines | vercel-labs/agent-skills | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` | 2026-08-02, `2eb760a` |
| verification-before-completion | obra/superpowers | `git clone obra/superpowers`, katalog `skills/verification-before-completion` | 2026-08-02, `2eb760a` |
| systematic-debugging | obra/superpowers | jw. | 2026-08-02, `2eb760a` |
| test-driven-development | obra/superpowers | jw. | 2026-08-02, `2eb760a` |
| subagent-driven-development | obra/superpowers | jw. | 2026-08-02, `2eb760a` |
| use-railway | railwayapp/railway-skills (oficjalny) | `npx skills add https://github.com/railwayapp/railway-skills --skill use-railway` lub plugin `/plugin install railway@railway-skills` | 2026-08-02, `2eb760a` |

Kolumna „Pobrano" to data i skrót commita **w tym repo**, w którym treść skilla weszła (albo była ostatnio całościowo podmieniona przez `/vendor-refresh`) - nie commit w repo źródłowym, którego nie śledzimy. Odczytana z `git log --diff-filter=A --follow` na `SKILL.md` danego skilla, nie z pamięci.

Uwagi:
- claude-api to duży skill: `SKILL.md` plus katalogi per język (`python`, `typescript`, `curl`) i wspólne `shared/` (modele, pricing, prompt caching, token counting, tool use, managed agents, migracja modeli). Do kontekstu wchodzi tylko `SKILL.md`; reszta ładuje się na żądanie.
- **Wykluczenie (2026-09-22, sprzątanie CCOS):** katalogi `csharp/`, `go/`, `java/`, `php/`, `ruby/` (25 plików, ~4100 linii przykładów kodu) usunięte jako balast - Artur pracuje w TypeScript/Python, nie w tych językach. `/vendor-refresh claude-api` MA POMIJAĆ te pięć katalogów przy podmianie z upstreamu - nie przywracać ich automatycznie. Jeśli w przyszłości pojawi się realna potrzeba jednego z tych języków, przywróć go pojedynczo z `anthropics/skills`, nie całą piątkę.
- claude-api niesie własny `LICENSE.txt` (Apache 2.0) - nie usuwaj go przy odświeżaniu.
- use-railway niesie też `references/` i `scripts/` (helper GraphQL API, analizy baz). To ładuje się na żądanie, nie do kontekstu.
- **Wykluczenie (2026-09-22, sprzątanie CCOS):** skrypty i referencje analizy MySQL/Redis/MongoDB (`analyze-db-mysql.md`, `analyze-db-redis.md`, `analyze-db-mongo.md`, `scripts/analyze-mysql.py`, `scripts/analyze-redis.py`, `scripts/analyze-mongo.py`, 6 plików, ~4400 linii) usunięte - sprawdzono pliki zależności we wszystkich repo Artura (GitHub Bridge, 19 repo), żadne nie używa tych trzech baz (PostgreSQL owszem, w 3 repo - ten skrypt i referencja zostają). `/vendor-refresh use-railway` MA POMIJAĆ te sześć plików przy podmianie z upstreamu. Jeśli w przyszłości pojawi się projekt na jednej z tych baz, przywróć odpowiedni skrypt i referencję pojedynczo z `railwayapp/railway-skills`.
- Railway w wariancie pluginu daje dodatkowo hook auto-akceptujący komendy Railway CLI oraz konfigurację Railway MCP - warte włączenia osobno.
- obra publikuje cały zestaw „Superpowers"; bierzemy tylko 4 pojedyncze skille, żeby nie zaciągać całości i nie zjadać kontekstu.
- Treści merytorycznej zvendorowanych skilli nie poprawiamy u siebie - to artefakty zewnętrzne. Jeśli coś przeszkadza, to osobna decyzja, nie łatka w kopii. Wyjątki są wyłącznie decyzjami Artura i każdy jest spisany niżej w „Lokalnych modyfikacjach".
- `/vendor-refresh` aktualizuje kolumnę „Pobrano" przy każdej faktycznej podmianie katalogu (wiersz „różne" w kroku 3 tej komendy) - commit, który podmienia treść skilla, podmienia też jego datę i SHA w tej tabeli w tym samym PR-ze.

## Lokalne modyfikacje (do zachowania przy `/vendor-refresh`)

Przy odświeżaniu z upstreamu te zmiany trzeba nanieść ponownie na nową wersję, nie nadpisać. `/vendor-refresh` pokazuje różnicę i zatrzymuje się na tych plikach, zamiast podmieniać je w ciemno.

- **subagent-driven-development**
  - sekcja „Model Selection" - routing modeli haiku/sonnet/najmocniejszy (PR #190)
  - sekcja „Implementer Boundaries (CCOS rule)", zaostrzone „Red Flags" i sekcja „Your Boundaries" w `implementer-prompt.md` - wykonawca pisze tylko w wyznaczonym zakresie, bez merge, push, rozszerzania zakresu i samozatwierdzania; jeden piszący na katalog, równolegle tylko w osobnych worktree (2026-09-23)
  - sekcja „Before Dispatch: Context Check (CCOS rule)" - przed wysłaniem subagenta sesja główna sprawdza cel, pliki, ograniczenia i weryfikację, braki uzupełnia wyszukiwaniem (maks. trzy przebiegi) (2026-09-23)
  - krok weryfikacji wyniku po każdym zadaniu wykonawcy (agent `task-result-verifier`, szablon `result-verifier-prompt.md`) przed recenzją zgodności ze specyfikacją (2026-09-23)
  - odwołania `superpowers:*` zamienione na lokalne skille albo usunięte (PR #193)
  - szablony `implementer-prompt.md`, `spec-reviewer-prompt.md`, `code-quality-reviewer-prompt.md` przestawione: stała część na górze, zmienne zadanie na dole (cache promptu); w `code-quality-reviewer-prompt.md` martwe odwołanie do `requesting-code-review/code-reviewer.md` zastąpione instrukcją wprost (2026-09-23)
- **systematic-debugging** - odwołania `superpowers:*` zamienione na lokalne skille (PR #193)
