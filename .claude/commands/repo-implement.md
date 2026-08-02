---
description: "Postaw system CCOS w repo: plugin, konfiguracja, bramki, CI, blokada rozjazdów"
---

# repo-implement

Instaluje standard CCOS w repozytorium, które go jeszcze nie ma (albo ma niekompletny). Jednorazowo per repo.

Argument (opcjonalny): `[notatka o projekcie, np. "WordPress + Elementor", "special-deploy, Lyreco"]`

## Krok 1 - rozpoznaj profil

Sprawdź, czym repo jest naprawdę: stos (React/Next/WordPress/Python/inny), menedżer pakietów, skrypty w `package.json`, obecny CI, sposób deployu (`railway.json`, `Dockerfile`, `Procfile`, cron, FTP), obecność frontu, obecność testów.

Nie zakładaj. Sprawdź pliki.

## Krok 2 - zainstaluj rdzeń

- `.claude/settings.json` z szablonu (uprawnienia, hooki)
- `CLAUDE.md` - krótki: co to za projekt, stos, jak się deployuje, czego nie ruszać. **Nie kopiuj reguł z pluginu** - one przychodzą syncem.
- `docs/DEPLOYMENT.md` - adresy preview i produkcji, sposób wejścia na żywo
- `.github/workflows/` - `ccos-release.yml`, `ccos-commitlint.yml`, `ccos-mark-pr-ready.yml`
- `release-please-config.json` + `.release-please-manifest.json`
- gałąź `preview`, jeśli nie ma

## Krok 3 - bramki jakości

Skrypty w `package.json`: `lint`, `typecheck`, `test`, `build`, `verify` (wszystkie cztery po kolei), `verify:quick` (lint + build).

Jeśli któregoś nie da się zrobić (brak testów, brak TS), zapisz w `CLAUDE.md`, że nie istnieje, żeby kolejne sesje go nie szukały.

## Krok 4 - blokada rozjazdów wizualnych (repo z frontem)

**To najważniejszy krok w repo z interfejsem.** Rozjazdy w odstępach nie biorą się z braku audytu, tylko z wpisywania wartości z palca. Zablokuj to na poziomie narzędzia:

- **ESLint**: reguła odrzucająca wartości spoza skali w Tailwindzie (`p-[13px]`, `mt-[7px]`, `text-[15px]`, `#3B82F6` w klasie). Dozwolone tylko kroki ze skali i nazwane tokeny.
- **Tokeny**: jedna skala odstępów, typografii i promieni. Bez lokalnych wyjątków.
- **shadcn/ui jako baza**: komponenty pochodzą z shadcn, nie są pisane od zera. Jeśli komponentu brakuje, dodaj przez `npx shadcn@latest add`, nie pisz własnego.
- **Zakaz kolorów z palca**: żadnych `#hex` ani `rgb()` w kodzie komponentów. Tylko zmienne z motywu.

Reguła ma **wywalać build**, nie ostrzegać. Ostrzeżenia się ignoruje.

Jeśli w repo są już rozjazdy, nie naprawiaj ich tutaj - włącz regułę, policz naruszenia, zgłoś liczbę i zaproponuj `/clean` jako osobny krok.

## Krok 5 - weryfikacja

Uruchom `verify`. Pokaż wynik jako dowód, nie napisz „gotowe".

## Wynik

Lista tego, co zainstalowane, lista tego, czego nie dało się zainstalować i dlaczego, liczba naruszeń blokady rozjazdów (jeśli front), następny krok.
