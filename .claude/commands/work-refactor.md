---
description: "Generalna refaktoryzacja jako program"
---

# work-refactor

**Tryb: tylko `deep`.** Jeśli `CCOS_MODE` jest inny, odpowiedz jednym zdaniem, że ta komenda działa w środowisku Deep, i nie wykonuj jej.


PISZE KOD. Deploy tylko na PREVIEW, nigdy produkcja bez wyraźnego sygnału Artura. Twarde stopy (zgłoś, nie wykonuj): sekrety, migracje produkcyjne, infra, auth/payments.

Operacja wysokiego ryzyka, metodycznie. Najpierw NIE zmieniaj kodu.

Etap 1, audyt realnego stanu (git status/diff, struktura, build/lint/test, frontend/backend/API, baza i migracje, auth, integracje, testy, docs, martwy kod, duplikacja, miejsca ryzykowne). Deleguj do subagentów audytowych. Nie kasuj plików, nie zmieniaj schematu bazy, nie ruszaj auth/payments.

Etap 2, plan fazami: Faza 0 safety net (testy charakteryzujące przed zmianą); Faza 1 dokumentacja i pamięć; Faza 2 bezpieczne porządki; Faza 3 refaktor strukturalny niskiego ryzyka; Faza 4 moduły średniego ryzyka; Faza 5 obszary wysokiego ryzyka; Faza 6 finalizacja. Dla każdej fazy: cel, zakres, pliki, ryzyko, efekt, komendy weryfikacyjne, kryteria ukończenia, czy wymaga akceptacji.

Etap 3, pokaż plan, rekomendowaną pierwszą fazę i ryzyka. NIE zaczynaj refaktoru sam. Po akceptacji wykonuj fazy w tym samym trybie, jedna po drugiej, z weryfikacją i deployem na preview między nimi.
