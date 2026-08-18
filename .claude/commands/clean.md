---
description: "Wyzeruj stan repo: rozjazdy od standardu, śmieci, martwy kod, mylne zapisy w docs, roadmapa"
---

# clean

Jedna komenda do „wyzerowania stanu" przed pójściem dalej. Łączy sprzątanie z przeglądem i aktualizacją planu, żeby nie trzeba było pamiętać czterech osobnych komend.

**Tryb: tylko `build`.** Jeśli `CCOS_MODE` to `quick` lub `audit`, odpowiedz jednym zdaniem, że ta komenda działa w środowisku Build, i nie wykonuj jej.

Argument (opcjonalny): `[zawęź, np. "tylko sprzątanie", "tylko roadmapa", "pomiń martwy kod"]`

## Krok 1 - rozpoznanie (subagenci, równolegle)

Powołaj subagentów read-only. Model dobierz wg reguły w skillu artur-claude-code-os:

- **haiku**: inwentarz repo - struktura, skrypty w package.json, stan gałęzi, otwarte PR-y, pliki tymczasowe, debug logi, runtime data w repo, TODO/FIXME, nieużywane importy
- **haiku**: martwy kod - uruchom `knip` jeśli jest, zbierz listę nieużywanych plików, eksportów, zależności
- **sonnet**: rozjazd docs vs kod - czy CLAUDE.md, STATE.md, STATE.md, DEPLOYMENT.md opisują to, co faktycznie jest w kodzie
- **sonnet**: dług techniczny - realne problemy w kodzie z oceną wagi, nie lista życzeń

Nie pozwól agentom edytować. Zbierz wyniki, zintegruj sam.

## Krok 2 - rozjazdy od standardu CCOS

Repozytoria dryfują. Sprowadź je z powrotem:
- czy `.claude/settings.json` zgadza się z szablonem (uprawnienia, hooki)
- czy `.github/workflows/` ma komplet `ccos-*.yml`
- czy skrypty `verify`, `verify:quick` istnieją i działają
- czy blokada wartości spoza skali jest włączona (repo z frontem)
- czy istnieją gałęzie `preview` i `main`, i czy roboczych nie zostało po merge'ach

Rozbieżności napraw. Nie nadpisuj lokalnych rozwiązań, które są lepsze - zgłoś je zamiast kasować.

## Krok 3 - mylne zapisy w dokumentacji

**To jest najczęściej pomijane i najbardziej szkodliwe.** W CLAUDE.md i docs gromadzą się zdania, które kiedyś były prawdą, a teraz rozbrajają kolejne sesje: „renderu się nie da", „ten endpoint nie działa", „używamy X" (już nie używamy).

Przejdź CLAUDE.md, STATE.md, STATE.md, DEPLOYMENT.md i sprawdź **każde twierdzenie względem kodu**. Usuń wszystko, co przestało być prawdą. Zgłoś, co usunąłeś i dlaczego.

## Krok 4 - sprzątanie i martwy kod (bezpieczne, autonomicznie)

Usuń: pliki tymczasowe, debug logi, pozostałości po eksperymentach, nieużywane importy, martwe eksporty potwierdzone przez knip, nieaktualne TODO po wykonanej pracy, osierocone gałęzie po zmergowanych PR-ach.

Do tego martwy kod i nieużywane zależności: użyj narzędzi jeśli są (knip, depcheck, ts-prune, unimport) plus analiza. Wychwyć: nieużywane pliki i eksporty, martwe gałęzie kodu, nieużywane zależności w `package.json`, zduplikowane implementacje tego samego, zakomentowany kod bez wartości, nieużywane assety. Na pozycję: co, dowód nieużycia, ryzyko usunięcia. Usuwaj tylko przy pewności (narzędzie plus sprawdzenie referencji). Po usunięciu uruchom weryfikację (build, test), żeby potwierdzić brak regresji.

Nie kasuj niczego bez pewności. Nie ruszaj: kodu produkcyjnego, migracji, danych, auth, sekretów, publicznego API, konfiguracji CI ani plików systemu (`.claude/`, hooki) - patrz guardrail megasystemu.

Rzeczy niepewne wypisz jako propozycję, nie usuwaj.

## Krok 5 - aktualizacja stanu

Zaktualizuj do stanu faktycznego, wyłącznie na podstawie kodu, nie pamięci:

- `docs/STATE.md` - gdzie projekt naprawdę jest
- `docs/STATE.md` - co zrobione, co następne, co wypadło; usuń pozycje już zrealizowane i te, które przestały mieć sens
- `docs/STATE.md` - dług z kroku 1, z priorytetami
- `CLAUDE.md` - tylko gdy zmienił się stack, komendy, architektura albo ryzyka. Nie rozbudowuj w dziennik.

Usuń zapisy nieaktualne i sprzeczne. Nigdy nie zapisuj zdań typu „renderu się nie da" - to rozbraja kolejne sesje.

## Krok 6 - weryfikacja i domknięcie

Lint, typecheck, test, build. Błędy z własnych porządków napraw. Niezwiązane dopisz do sekcji długu technicznego w `docs/STATE.md`.

Zmiany oddaj jako jeden PR na `preview` (`chore/clean`). Nie merguj na produkcję.

## Wynik

- **Stan** - gdzie projekt jest naprawdę, w 3 bulletach
- **Posprzątane** - co usunięte, zwięźle
- **Dług** - 3 najważniejsze rzeczy do naprawy, z oceną wagi
- **Do decyzji** - rzeczy niepewne, których nie ruszyłem, z rekomendacją
- **Następny krok** - jedna konkretna rzecz, od której warto zacząć
