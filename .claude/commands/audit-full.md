---
description: "Pełny audyt projektu: subagenci równolegle, dowody zamiast opinii, jedna posortowana lista"
argument-hint: "[opcjonalnie: zawęź obszar]"
---

# audit-full

**Tryb: `audit`.** W innym odmów i odeślij. Nic nie zmienia.

Ma być **kompleksowy, konkretny i użyteczny**. Nie zbiór ogólników.

## Zasada nadrzędna: dowód, nie opinia

Każde znalezisko musi mieć: **plik, linię albo pomiar**. Zdanie „obsługa błędów mogłaby być lepsza" jest bezwartościowe. Zdanie „`api/send.ts:41` łyka wyjątek i zwraca 200, więc frontend pokazuje sukces przy nieudanej wysyłce" - jest.

Jeśli nie masz dowodu, nie zgłaszaj.

## Krok 1 - subagenci równolegle

Powołaj naraz, po nazwie, każdy tylko do czytania:

| Agent | Obszar |
|---|---|
| `tooling-auditor` | struktura, zależności, skrypty, build/lint/typecheck, martwe pliki |
| `security-reliability-auditor` | sekrety w kodzie i historii, uprawnienia, walidacja wejścia, auth |
| `testing-auditor` | łykane błędy, nieobsłużone przypadki brzegowe, luki testowe, wyścigi |
| `ui-design-auditor` | wartości z palca, zgodność z shadcn, brakujące stany, dostępność |
| `ux-content-auditor` | polszczyzna w interfejsie, kalki, niejasne komunikaty błędów |
| `docs-memory-auditor` | czy CLAUDE.md i docs opisują to, co jest w kodzie |
| `architecture-auditor` | struktura, coupling, przepływ danych - w tym miejsca ciężkie wydajnościowo |

Nie pozwól im się nakładać. Zbierz wyniki, zintegruj sam.

Uwaga: żaden z ośmiu agentów nie jest dedykowanym audytorem wydajności - `architecture-auditor` przejmuje to tymczasowo jako najbliższy zakresem. Jeśli projekt regularnie potrzebuje głębokich pomiarów wydajności, to jest kandydat na dziewiątego agenta, nie coś do cichego dorobienia tutaj.

## Krok 2 - odsiej szum

Recenzent poproszony o znalezienie luk **zawsze coś znajdzie**. Zanim coś wpiszesz do raportu, zadaj pytanie: **czy to wpływa na poprawność, bezpieczeństwo albo na to, jak Artur używa aplikacji?**

Jeśli nie - wytnij. Nie zgłaszaj preferencji stylistycznych, brakujących abstrakcji, testów na przypadki, które nie mogą wystąpić, ani rzeczy typu „warto rozważyć".

To jest najważniejszy krok. Raport na 200 pozycji jest bezużyteczny.

## Krok 3 - jedna lista

**Nie sekcje per obszar. Jedna lista, posortowana po ważności.**

| Waga | Co | Gdzie | Skutek | Poprawka |
|---|---|---|---|---|

Trzy poziomy:
- **Krytyczne** - psuje działanie, traci dane, wystawia sekret, wprowadza użytkownika w błąd
- **Ważne** - działa, ale źle; użytkownik to odczuwa
- **Kosmetyczne** - nie odczuwa, ale warto

## Krok 4 - domknięcie

Na końcu:
- **Ile jest naprawdę** - liczba pozycji w każdej kategorii
- **Trzy rzeczy najpierw** - z uzasadnieniem, dlaczego akurat te
- **Gotowe zadanie** - lista krytycznych i ważnych, sformatowana tak, żeby Artur mógł ją wkleić jako zadanie do sesji Quick albo Build, z sugerowanym trybem przy każdej

Nie naprawiaj. Nie commituj.
