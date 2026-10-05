# gh-mcp-bridge

Zdalny serwer MCP: most miedzy Claude (czat) a GitHub API. Token instalacji
GitHub App jest generowany i odswiezany wylacznie po stronie serwera (zmienne
srodowiskowe `GH_APP_ID`, `GH_APP_PRIVATE_KEY`, `GH_APP_INSTALLATION_ID`), a
dostep do `/mcp` chroni naglowek `Authorization: Bearer <MCP_AUTH_TOKEN>`.

## Uruchomienie i testy

```
npm ci
npm test
npm start
```

## Narzedzia

| Narzedzie | Co robi |
|---|---|
| `list_repos`, `get_repo`, `update_repo` | repozytoria instalacji i ich podstawowe ustawienia |
| `list_branches`, `create_branch`, `delete_branch` | galezie |
| `list_files`, `get_file`, `put_file`, `delete_file`, `list_commits` | pliki i historia |
| `list_prs`, `get_pr`, `create_pr`, `close_pr`, `merge_pr` | pull requesty |
| `get_pr_checks` | stan kontroli CI pull requesta |
| `get_pr_files` | pliki i roznice (diff) pull requesta, stronicowane |
| `list_pr_comments`, `add_pr_comment` | komentarze w rozmowie pod pull requestem |
| `mark_pr_ready` | zdjecie statusu roboczego (draft) z pull requesta |
| `enable_auto_merge` | wlaczenie samoczynnego scalania pull requesta |

## Uprawnienia GitHub App

Narzedzia dzialaja w granicach uprawnien nadanych aplikacji; brak uprawnienia
konczy sie bledem 403 z GitHuba.

- Contents: read/write - pliki, galezie, commity
- Pull requests: read/write - pull requesty, komentarze, `mark_pr_ready`, `enable_auto_merge`
- Checks: read oraz Commit statuses: read - `get_pr_checks`
- Administration: write - `update_repo`

`enable_auto_merge` wymaga ponadto wlaczonej w repozytorium opcji auto-merge.

Nie sa zaimplementowane operacje wymagajace dodatkowych uprawnien:
odczyt logow uruchomien workflow (Actions: read), uruchamianie workflow
(Actions: write) i odczyt ustawien ochrony galezi (Administration: read).
