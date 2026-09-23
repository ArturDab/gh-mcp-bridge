# Skille wycofane - ewidencja

Skill zmieniający nazwę albo usuwany zostawia sierotę w repozytoriach docelowych. Workflow
`sync-to-repos.yml` kopiuje katalog `skills` **bez `--delete`**, więc stary katalog nie znika sam
i wciąż wczytuje się w sesjach - z treścią, która przestała obowiązywać.

Każde wycofanie wpisujesz tutaj i kasujesz stary katalog ręcznie w każdym repozytorium docelowym
(patrz `MANIFEST.md`, sekcja „Biblioteka skilli"). Wpis bez skasowanych sierot nie jest wycofaniem,
tylko jego zapowiedzią.

| Nazwa wycofana | Data | Następca albo miejsce treści |
| --- | --- | --- |
| `playbook` | 2026-08-10 | `playbook-stack` - przebudowa treści na warstwę „praca z kodem". Cztery obszary starego pliku (promptowanie Fable 5, zakaz cyklicznych samo-sprawdzeń na PR-ach, checklisty z flagami przy checkpoincie i handoffie, klikalny adres podglądu jako warunek oddania pracy UI) należą do poziomu wyżej i wróciły do `artur-claude-code-os` 2026-08-18. Reguła jasnego motywu żyje w `MANIFEST.md` → „Reguły niepodważalne". Sieroty w repozytoriach docelowych skasowane 2026-08-18. |
