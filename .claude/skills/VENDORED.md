# Skille zewnętrzne w bibliotece (ewidencja pochodzenia)

Wszystkie poniższe są zvendorowane jako pliki w repo (nie runtime). Aktualizacja: `/vendor-refresh <nazwa>` albo `all` - pobiera u źródła i podmienia cały katalog, potem rozlewa przez sync Action.

| Skill | Źródło | Pobranie |
|---|---|---|
| frontend-design | Anthropic (publiczny) | skopiowany z publicznych skilli Anthropic |
| claude-api | anthropics/skills (oficjalny) | `git clone --depth 1 https://github.com/anthropics/skills`, katalog `skills/claude-api` |
| web-design-guidelines | vercel-labs/agent-skills | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` |
| verification-before-completion | obra/superpowers | `git clone obra/superpowers`, katalog `skills/verification-before-completion` |
| systematic-debugging | obra/superpowers | jw. |
| test-driven-development | obra/superpowers | jw. |
| subagent-driven-development | obra/superpowers | jw. |
| use-railway | railwayapp/railway-skills (oficjalny) | `npx skills add https://github.com/railwayapp/railway-skills --skill use-railway` lub plugin `/plugin install railway@railway-skills` |

Uwagi:
- claude-api to duży skill (~1,1 MB, 66 plików): `SKILL.md` plus katalogi per język (`python`, `typescript`, `go`, `java`, `csharp`, `php`, `ruby`, `curl`) i wspólne `shared/` (modele, pricing, prompt caching, token counting, tool use, managed agents, migracja modeli). Do kontekstu wchodzi tylko `SKILL.md`; reszta ładuje się na żądanie.
- claude-api niesie własny `LICENSE.txt` (Apache 2.0) - nie usuwaj go przy odświeżaniu.
- use-railway niesie też `references/` i `scripts/` (helper GraphQL API, analizy baz). To ładuje się na żądanie, nie do kontekstu.
- Railway w wariancie pluginu daje dodatkowo hook auto-akceptujący komendy Railway CLI oraz konfigurację Railway MCP - warte włączenia osobno.
- obra publikuje cały zestaw „Superpowers"; bierzemy tylko 4 pojedyncze skille, żeby nie zaciągać całości i nie zjadać kontekstu.
- Treści merytorycznej zvendorowanych skilli nie poprawiamy u siebie - to artefakty zewnętrzne. Jeśli coś przeszkadza, to osobna decyzja, nie łatka w kopii.
