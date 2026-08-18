---
description: "Postaw system CCOS w repo: plugin, konfiguracja, bramki, CI, blokada rozjazdów"
---

# repo-implement

**Tryb: tylko `build`.** Jeśli `CCOS_MODE` jest inny, odpowiedz jednym zdaniem, że ta komenda działa w środowisku Build, i nie wykonuj jej.

Instaluje standard CCOS w repozytorium, które go jeszcze nie ma (albo ma niekompletny). Jednorazowo per repo.

Argument (opcjonalny): `[notatka o projekcie, np. "WordPress + Elementor", "special-deploy, Lyreco"]`

## Krok 1 - rozpoznaj profil

Sprawdź, czym repo jest naprawdę: stos (React/Next/WordPress/Python/inny), menedżer pakietów, skrypty w `package.json`, obecny CI, sposób deployu (`railway.json`, `Dockerfile`, `Procfile`, cron, FTP), obecność frontu, obecność testów.

Nie zakładaj. Sprawdź pliki. Wynik (**web-ui** / **backend** / **static**) zapisz w kroku 2 jako linię `Profil:` w `CLAUDE.md` - to jedyne miejsce, które go trwale deklaruje.

## Krok 2 - zainstaluj rdzeń

- `.claude/settings.json` z szablonu (uprawnienia, hooki)
- `CLAUDE.md` - krótki: co to za projekt, stos, jak się deployuje, czego nie ruszać, linia `Profil: [web-ui / backend / static]` wypełniona wg rozpoznania z kroku 1. **Nie kopiuj reguł z pluginu** - one przychodzą syncem.
- `docs/STATE.md` z `template/docs/STATE.md` - stan, plan, decyzje, dług w jednym pliku
- `docs/DEPLOYMENT.md` - adresy preview i produkcji, sposób wejścia na żywo
- `.github/workflows/` - `ccos-commitlint.yml`, `ccos-mark-pr-ready.yml`
- gałąź `preview`, jeśli nie ma

## Krok 3 - bramki jakości

Skrypty w `package.json`: `lint`, `typecheck`, `test`, `build`, `verify` (wszystkie cztery po kolei), `verify:quick` (lint + build).

Jeśli któregoś nie da się zrobić (brak testów, brak TS), zapisz w `CLAUDE.md`, że nie istnieje, żeby kolejne sesje go nie szukały.

**Skopiuj `template/scripts/check-profile-drift.mjs` do `scripts/` projektu, w każdym profilu, nie tylko web-ui.** To sprawdzenia 12 i 13 bramki jakości, wywołane w CI tego repo (`template/.github/workflows/ci.yml`). Wychwytują dokładnie to, o czym ta komenda inaczej nie wie sama: front w repo bez deklaracji `Profil: web-ui` (sprawdzenie 12) i zdanie w `CLAUDE.md` twierdzące, że repo nie ma CI, mimo że `.github/workflows/` już coś ma (sprawdzenie 13). Oba czerwone, nie ostrzegawcze.

## Krok 4 - blokada rozjazdów wizualnych (repo z frontem)

**To najważniejszy krok w repo z interfejsem.** Rozjazdy w odstępach nie biorą się z braku audytu, tylko z wpisywania wartości z palca. Zablokuj to na poziomie narzędzia:

- **ESLint**: reguła odrzucająca wartości spoza skali w Tailwindzie (`p-[13px]`, `mt-[7px]`, `text-[15px]`, `#3B82F6` w klasie). Dozwolone tylko kroki ze skali i nazwane tokeny.
- **Tokeny**: jedna skala odstępów, typografii i promieni. Bez lokalnych wyjątków.
- **shadcn/ui jako baza**: komponenty pochodzą z shadcn, nie są pisane od zera. Jeśli komponentu brakuje, dodaj przez `npx shadcn@latest add`, nie pisz własnego.
- **Zakaz kolorów z palca**: żadnych `#hex` ani `rgb()` w kodzie komponentów. Tylko zmienne z motywu.

Reguła ma **wywalać build**, nie ostrzegać. Ostrzeżenia się ignoruje.

Jeśli w repo są już rozjazdy, nie naprawiaj ich tutaj - włącz regułę, policz naruszenia, zgłoś liczbę i zaproponuj `/clean` jako osobny krok.

## Krok 4a - nakładka recenzji wizualnej (tylko `Profil: web-ui`)

Repo bez frontu (`backend`, `static`) pomija ten krok całkowicie - nie kopiuje pliku, nie dodaje bramy, nie instaluje sprawdzenia.

Wzorzec i pełna instrukcja: `template/docs/REVIEW_OVERLAY.md` (skopiuj też ten plik do `docs/REVIEW_OVERLAY.md` projektu). Żywy przykład wpięcia: `ArturDab/animails-hub`, gałąź `preview`. Źródło pliku jest jedno - `template/public/review-overlay.js` w `ccos` - kopia w projekcie **nie jest edytowana nigdy**, poprawki wracają tam i schodzą do projektów ręcznym odświeżeniem kopii (opisane w `REVIEW_OVERLAY.md`), tak samo jak reszta `template/`.

Trzy punkty, wszystkie obowiązkowe:
1. Skopiuj `template/public/review-overlay.js` do katalogu statycznego projektu (`public/`, `static/`, `wwwroot/` - ten, który rozpoznałeś w kroku 1). Kopii się nie edytuje.
2. Wstaw `<script src="/review-overlay.js" defer>` przed `</body>` w głównym szablonie/layoucie (opcjonalnie `window.__REVIEW_OVERLAY__` z `zones` bezpośrednio przed tym skryptem).
3. Dodaj bramę serwerową, która NIE wydaje pliku na produkcji - wzorzec Express w `REVIEW_OVERLAY.md`, token `REVIEW_OVERLAY` w warunku środowiska. Trasa musi stać PRZED plikami statycznymi, inaczej brama nie działa.

Jeśli projekt nie ma własnego serwera (hosting statyczny bez backendu), pomiń punkt 3 świadomie - `REVIEW_OVERLAY.md` nazywa to wprost akceptowanym wyjątkiem, nie błędem.

**Czwarty punkt, dla środowisk podglądowych: ustaw `REVIEW_OVERLAY=1` w zmiennych środowiska podglądu (Railway albo odpowiednik).** Domyślna heurystyka bramy (`!isProduction`) zawodzi, gdy podgląd dostał przy zakładaniu skopiowany komplet zmiennych z produkcji, `NODE_ENV=production` włącznie - wtedy podgląd wygląda dla bramy jak produkcja i nakładka się nie włącza, mimo że pliki są na miejscu (incydent 2026-08-11, `animails-hub`, opisany w `REVIEW_OVERLAY.md` §3b). Obecność trzech punktów w repo **nie jest dowodem**, że nakładka działa na żywo - sprawdź osobno: `curl <adres-podglądu>/review-overlay.js | head` ma zwrócić kod nakładki, nie placeholder o wyłączeniu.

Skopiuj też `template/scripts/check-review-overlay.mjs` do `scripts/` projektu - to sprawdzenie 11 bramki jakości (patrz krok 3), uruchamiane w CI tego repo. Wychwytuje sytuację, w której ktoś zapomni wpiąć nakładkę: `Profil: web-ui` bez kompletnych trzech punktów wyżej to czerwony wynik w CI, nie ostrzeżenie. Sprawdzenie 11 patrzy na pliki w repo, nie na zmienne środowiskowe żywego serwisu - nie zastępuje sprawdzenia z akapitu wyżej, tylko go uzupełnia.

## Krok 5 - weryfikacja

Uruchom `verify`. Pokaż wynik jako dowód, nie napisz „gotowe".

## Wynik

Lista tego, co zainstalowane, lista tego, czego nie dało się zainstalować i dlaczego, liczba naruszeń blokady rozjazdów (jeśli front), następny krok.
