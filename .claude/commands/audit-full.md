---
description: "Pełny audyt projektu: subagenci równolegle, dowody zamiast opinii, jedna posortowana lista"
argument-hint: "[opcjonalnie: zawęź obszar]"
---

# audit-full

**Tryb: `test`.** W innym odmów i odeślij. Nic nie zmienia.

Ma być **kompleksowy, konkretny i użyteczny**. Nie zbiór ogólników.

## Zasada nadrzędna: dowód, nie opinia

Każde znalezisko musi mieć: **plik, linię albo pomiar**. Zdanie „obsługa błędów mogłaby być lepsza" jest bezwartościowe. Zdanie „`api/send.ts:41` łyka wyjątek i zwraca 200, więc frontend pokazuje sukces przy nieudanej wysyłce" - jest.

Jeśli nie masz dowodu, nie zgłaszaj.

## Krok 1 - subagenci równolegle

Powołaj naraz, każdy z własnym obszarem, każdy tylko do czytania. Model wg reguły ze skilla:

| Agent | Model | Obszar |
|---|---|---|
| inwentarz | haiku | struktura, zależności, skrypty, martwe pliki, TODO/FIXME |
| bezpieczeństwo | sonnet | sekrety w kodzie i historii, uprawnienia, walidacja wejścia, auth |
| poprawność | sonnet | łykane błędy, nieobsłużone przypadki brzegowe, wyścigi, stan po odświeżeniu |
| interfejs | sonnet | wartości z palca, zgodność z shadcn, brakujące stany, dostępność |
| teksty | sonnet | polszczyzna w interfejsie, kalki, niejasne komunikaty błędów |
| spójność docs | haiku | czy CLAUDE.md i docs opisują to, co jest w kodzie |
| wydajność | sonnet | pomiary, ciężkie zapytania, nadmiarowe renderowanie, rozmiar paczek |

Nie pozwól im się nakładać. Zbierz wyniki, zintegruj sam.

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
- **Gotowe zadanie** - lista krytycznych i ważnych, sformatowana tak, żeby Artur mógł ją wkleić jako zadanie do sesji Fast albo Deep, z sugerowanym trybem przy każdej

Nie naprawiaj. Nie commituj.
