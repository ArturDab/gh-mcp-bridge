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

Uwaga: żaden z agentów nie jest dedykowanym audytorem wydajności - `architecture-auditor` przejmuje to tymczasowo jako najbliższy zakresem. Jeśli projekt regularnie potrzebuje głębokich pomiarów wydajności, to jest kandydat na dziewiątego agenta, nie coś do cichego dorobienia tutaj.

## Krok 2 - weryfikacja znalezisk (próba obalenia)

Recenzent poproszony o znalezienie luk **zawsze coś znajdzie**, a audytor jest stronniczy wobec własnych znalezisk. Dlatego znalezisko nie wchodzi do raportu na słowo audytora - musi przetrwać próbę obalenia przez kogoś, kto nie widział jego uzasadnienia.

**2a. Wstępna waga.** Przypisz każdemu znalezisku wagę z kroku 3 (Krytyczne / Ważne / Kosmetyczne). Krytyczne i Ważne idą do weryfikacji w 2b. Kosmetyczne nie przechodzą weryfikacji, tylko odsiewu: zostaje wyłącznie takie, które ma konkretne miejsce (plik:linia albo pomiar) i konkretny, nazwany zysk z poprawki. Wytnij preferencje stylistyczne, brakujące abstrakcje, testy na przypadki, które nie mogą wystąpić, i rzeczy typu „warto rozważyć".

**2b. Weryfikacja każdego znaleziska Krytycznego i Ważnego.** Dla każdego osobno powołaj świeżego subagenta (`general-purpose`, model `sonnet`). Ten typ agenta ma narzędzia edycji, więc zakaz zmian jest w poleceniu, a po każdej weryfikacji sprawdzasz `git status` - jakakolwiek zmiana w plikach unieważnia werdykt i trafia do „Niepotwierdzonych". Dostaje **okrojony kontekst**: bez historii rozmowy, bez raportu audytora, bez jego uzasadnienia i bez pozostałych znalezisk. Subagent nie wywoła komendy ukośnikowej, więc instrukcję dajesz wprost. Stała część polecenia na górze, zmienna na dole (cache promptu):

```
Twoje zadanie: OBALIĆ poniższą tezę o kodzie. Załóż, że jest fałszywa, i szukaj dowodu:
przeczytaj wskazane miejsce i jego otoczenie, sprawdź wywołania, obsługę błędów, testy,
konfigurację. Niczego nie edytujesz. Tezy nie łagodzisz ani nie przeformułowujesz.
Odpowiedz jednym werdyktem:
- OBALONE - teza jest fałszywa albo skutek nie może wystąpić; podaj dowód (plik:linia)
- OBRONIONE - nie udało się obalić; podaj, co sprawdziłeś i co potwierdza tezę (plik:linia)
- NIEROZSTRZYGNIĘTE - brak danych, żeby rozstrzygnąć; podaj, czego zabrakło

Katalog repo: [ścieżka]
Teza: [jedno zdanie - co jest nie tak]
Miejsce: [plik:linia albo pomiar]
Zgłoszony skutek: [jedno zdanie]
```

**2c. Rozliczenie.**
- **OBRONIONE** - wchodzi do raportu z wagą z 2a.
- **OBALONE** - wypada z raportu (w domknięciu tylko liczba obalonych).
- **NIEROZSTRZYGNIĘTE** albo weryfikacja się nie wykonała (agent padł, przekroczył limit, nie odpowiedział) - trafia do osobnej sekcji raportu **„Niepotwierdzone"**, nie do głównej listy.

**Zasada twarda: jeśli przegląd nie domknął się w całości** - choć jedno znalezisko Krytyczne albo Ważne nie przeszło weryfikacji do werdyktu OBRONIONE/OBALONE, któryś audytor z kroku 1 nie oddał wyniku albo obszar został pominięty - **raport nie może kończyć się czystym zatwierdzeniem** („wszystko w porządku", „brak krytycznych"). Domknięcie mówi wprost, czego nie sprawdzono i ile pozycji czeka w „Niepotwierdzonych".

Raport na 200 pozycji jest bezużyteczny; raport z niesprawdzonymi pozycjami podanymi jak pewne - szkodliwy.

## Krok 3 - jedna lista

**Nie sekcje per obszar. Jedna lista, posortowana po ważności.** Tylko znaleziska OBRONIONE (Krytyczne i Ważne) oraz odsiane Kosmetyczne. Pod listą osobna sekcja „Niepotwierdzone" z pozycjami z kroku 2c, każda z informacją, czego zabrakło do rozstrzygnięcia.

| Waga | Co | Gdzie | Skutek | Poprawka |
|---|---|---|---|---|

Trzy poziomy:
- **Krytyczne** - psuje działanie, traci dane, wystawia sekret, wprowadza użytkownika w błąd
- **Ważne** - działa, ale źle; użytkownik to odczuwa
- **Kosmetyczne** - nie odczuwa, ale warto

## Krok 4 - domknięcie

Na końcu:
- **Ile jest naprawdę** - liczba pozycji w każdej kategorii, plus ile znalezisk weryfikacja obaliła i ile trafiło do „Niepotwierdzonych"
- **Czy przegląd się domknął** - tak albo nie; przy „nie" lista, czego nie sprawdzono (zasada twarda z kroku 2)
- **Trzy rzeczy najpierw** - z uzasadnieniem, dlaczego akurat te
- **Gotowe zadanie** - lista krytycznych i ważnych, sformatowana tak, żeby Artur mógł ją wkleić jako zadanie do sesji Quick albo Build, z sugerowanym trybem przy każdej

Nie naprawiaj. Nie commituj.
