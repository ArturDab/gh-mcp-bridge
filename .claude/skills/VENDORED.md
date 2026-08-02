# Skille zewnętrzne w bibliotece (ewidencja pochodzenia)

Wszystkie poniższe są zvendorowane jako pliki w repo (nie runtime). Aktualizacja: pobierz u źródła i podmień katalog, potem rozlej przez `/clean-repo`.

| Skill | Źródło | Pobranie |
|---|---|---|
| frontend-design | Anthropic (publiczny) | skopiowany z publicznych skilli Anthropic |
| web-design-guidelines | vercel-labs/agent-skills | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` |
| verification-before-completion | obra/superpowers | `git clone obra/superpowers`, katalog `skills/verification-before-completion` |
| systematic-debugging | obra/superpowers | jw. |
| test-driven-development | obra/superpowers | jw. |
| subagent-driven-development | obra/superpowers | jw. |
| use-railway | railwayapp/railway-skills (oficjalny) | `npx skills add https://github.com/railwayapp/railway-skills --skill use-railway` lub plugin `/plugin install railway@railway-skills` |

Uwagi:
- use-railway niesie też `references/` i `scripts/` (helper GraphQL API, analizy baz). To ładuje się na żądanie, nie do kontekstu.
- Railway w wariancie pluginu daje dodatkowo hook auto-akceptujący komendy Railway CLI oraz konfigurację Railway MCP - warte włączenia osobno.
- obra publikuje cały zestaw „Superpowers"; bierzemy tylko 4 pojedyncze skille, żeby nie zaciągać całości i nie zjadać kontekstu.
