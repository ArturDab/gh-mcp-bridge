---
description: "Audyt bezpieczeństwa i niezawodności: auth, sekrety, walidacja, konfiguracja"
---

# audit-security

**Tryb: `audit`.** W innym odmów i odeślij. Nic nie zmienia.

Powołaj agenta `security-reliability-auditor` (read-only, sonnet) na całym repo. Obszar: auth i autoryzacja, walidacja wejścia, obsługa błędów, zarządzanie sekretami, runtime data w repo, legacy pliki z tokenami, zbyt szerokie permissions, konfiguracja, miejsca podatne na utratę danych.

## Odsiej szum

Zanim coś trafi do raportu: **czy to ma dowód** (plik, linia, cytat)? Zdanie „walidacja mogłaby być lepsza" jest bezwartościowe. Zdanie „`api/upload.ts:22` przyjmuje dowolne rozszerzenie pliku bez sprawdzenia typu" - jest. Bez dowodu nie zgłaszaj.

## Wynik

Tabela, posortowana po wadze: severity (krytyczne/ważne/kosmetyczne) | obszar | dowód (bez wartości sekretu) | wpływ | rekomendowana poprawka.

Sekrety w kodzie: zgłoś LOKALIZACJĘ i ryzyko, nigdy wartość. Sekrety w historii gita: oznacz jako bloker do rotacji.

Na końcu: ile znalezisk w każdej kategorii, trzy najpilniejsze z uzasadnieniem, gotowa lista do wklejenia jako zadanie do sesji Quick albo Build.

Nie naprawiasz. Nie commitujesz.
