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
- claude-api to duży skill (~1,1 MB, 66 plików): `SKILL.md` plus katalogi per język (`python`, `typescript`, `go`, `java`, `csharp`, `php`, `ruby`, `curl`) i wspólne `shared/` (modele, pricing, prompt caching, token counting, tool use, managed agents, migracja modeli). Do kontekstu wchodzi tylko `SKILL.md`; reszta ładuje się na żądanie.
- claude-api niesie własny `LICENSE.txt` (Apache 2.0) - nie usuwaj go przy odświeżaniu.
- use-railway niesie też `references/` i `scripts/` (helper GraphQL API, analizy baz). To ładuje się na żądanie, nie do kontekstu.
- Railway w wariancie pluginu daje dodatkowo hook auto-akceptujący komendy Railway CLI oraz konfigurację Railway MCP - warte włączenia osobno.
- obra publikuje cały zestaw „Superpowers"; bierzemy tylko 4 pojedyncze skille, żeby nie zaciągać całości i nie zjadać kontekstu.
- Treści merytorycznej zvendorowanych skilli nie poprawiamy u siebie - to artefakty zewnętrzne. Jeśli coś przeszkadza, to osobna decyzja, nie łatka w kopii.
- `/vendor-refresh` aktualizuje kolumnę „Pobrano" przy każdej faktycznej podmianie katalogu (wiersz „różne" w kroku 3 tej komendy) - commit, który podmienia treść skilla, podmienia też jego datę i SHA w tej tabeli w tym samym PR-ze.
