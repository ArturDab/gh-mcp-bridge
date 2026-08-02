# AEO - Answer Engine Optimization

Optymalizacja pod silniki AI: Google AI Overviews, Perplexity, ChatGPT Search,
Bing Copilot. Uzupełnienie klasycznego SEO, nie zamiennik.

## Contents
- [Jak działają silniki AI](#jak-działają)
- [Zasady pisania treści pod AEO](#zasady-treści)
- [Struktura strony pod AEO](#struktura)
- [Featured snippets](#featured-snippets)
- [People Also Ask](#people-also-ask)
- [Checklista AEO](#checklista)

---

## Jak działają silniki AI

Google AI Overviews, Perplexity i ChatGPT Search cytują strony, które:

1. **Odpowiadają wprost** – pierwsza odpowiedź na pytanie pojawia się w pierwszym akapicie lub zdaniu sekcji, nie po 3 akapitach wstępu
2. **Są autorytatywne** – konkretne dane, daty, liczby, źródła
3. **Mają strukturę zgodną z pytaniem** – pytanie jako nagłówek H2, odpowiedź jako pierwszy akapit pod nim
4. **Używają FAQ schema** – ułatwia silnikom AI wyciągnięcie pary pytanie-odpowiedź
5. **Są aktualne** – `dateModified` w schema sygnalizuje świeżość

Perplexity i ChatGPT Search preferują strony z: czytelnymi URL, szybkim ładowaniem, brakiem popupów blokujących treść.

---

## Zasady pisania treści pod AEO

### Odpowiedź na początku, nie na końcu

❌ Źle:
```
Sztuczna inteligencja to fascynująca dziedzina. Przez ostatnie dekady...
[3 akapity historii]
...dlatego AI można zdefiniować jako...
```

✅ Dobrze:
```
Sztuczna inteligencja (AI) to technologia umożliwiająca maszynom uczenie się
i podejmowanie decyzji na podstawie danych. [Rozwinięcie w kolejnych akapitach]
```

### Struktura: pytanie → odpowiedź → rozwinięcie

Dla każdej sekcji tematycznej:
- H2 = pytanie lub twierdzenie zawierające frazę kluczową
- Pierwszy akapit = bezpośrednia, kompletna odpowiedź (50-100 słów)
- Kolejne akapity = szczegóły, przykłady, kontekst

### Definicje i pojęcia

Jeśli artykuł wprowadza pojęcie, zdefiniuj je wprost w pierwszym akapicie gdzie się pojawia:

✅ "Prompt engineering to technika projektowania instrukcji dla modeli AI w celu uzyskania precyzyjnych i powtarzalnych wyników."

### Liczby i dane

Silniki AI chętnie cytują twierdzenia poparte liczbami:
- ✅ "ChatGPT osiągnął 100 milionów użytkowników w 2 miesiące od premiery"
- ❌ "ChatGPT zyskał popularność bardzo szybko"

Zawsze podawaj źródło lub datę danych.

---

## Struktura strony pod AEO

### Nagłówki jako pytania

Przekształcaj nagłówki H2 w pytania, które użytkownicy wpisują w Google/Perplexity:

| Klasyczny nagłówek | Nagłówek pod AEO |
|---|---|
| "Zalety ChatGPT" | "Jakie są główne zalety ChatGPT?" |
| "Jak zacząć" | "Jak zacząć korzystać z ChatGPT za darmo?" |
| "Ograniczenia" | "Jakie są ograniczenia ChatGPT?" |

### Akapit podsumowujący na początku artykułu

Silniki AI często cytują pierwsze 2-3 zdania artykułu. Napisz je tak, żeby same w sobie były wartościową odpowiedzią na główne pytanie artykułu.

### FAQ jako oddzielna sekcja

Minimum 5-7 pytań pokrywających:
- Pytania podstawowe (co to jest, jak działa)
- Pytania praktyczne (jak używać, ile kosztuje)
- Pytania o ograniczenia i wady
- Pytania z długiego ogona (bardziej szczegółowe, mniej konkurencyjne)

---

## Featured Snippets

Featured snippet = blok z odpowiedzią wyświetlany na pozycji "0" w Google.

### Typy featured snippets

**Paragraph snippet** (najczęstszy):
- Pytanie jako H2
- Odpowiedź: 40-60 słów w pierwszym akapicie
- Jasna, kompletna definicja lub wyjaśnienie

**List snippet**:
- Nagłówek z pytaniem "jak", "co", "które"
- Lista punktowana lub numerowana pod spodem
- 4-8 punktów, każdy 1-2 zdania

**Table snippet**:
- Dane w tabeli HTML
- Nagłówek kolumny jako pytanie lub kategoria
- Max 3-4 kolumny

### Jak zdobyć featured snippet

1. Znajdź pytanie, które już rankujesz na pozycji 2-10
2. Sprawdź czy na pozycji 1 jest featured snippet
3. Jeśli nie ma – napisz odpowiedź w odpowiednim formacie (paragraph/list/table)
4. Jeśli jest – napisz lepszą, bardziej kompletną odpowiedź

---

## People Also Ask

PAA (People Also Ask) to rozwijana sekcja pytań w Google SERP.

Jak targetować PAA:
1. Wyszukaj główną frazę w Google
2. Rozwiń sekcję PAA – to są pytania, które użytkownicy faktycznie zadają
3. Dodaj te pytania jako H2 lub H3 w artykule
4. Odpowiedz na każde w 40-60 słowach bezpośrednio pod nagłówkiem
5. Dodaj do FAQ schema

---

## Checklista AEO

Przed publikacją artykułu:

- [ ] Główne pytanie artykułu ma bezpośrednią odpowiedź w pierwszym akapicie
- [ ] Każdy H2 to pytanie lub twierdzenie zawierające frazę lub LSI
- [ ] Definicja kluczowego pojęcia pojawia się w pierwszym akapicie artykułu
- [ ] FAQ ma minimum 5 pytań pokrywających podstawowe, praktyczne i długoogonowe zapytania
- [ ] FAQ schema (JSON-LD lub Rank Math) dodana i zwalidowana
- [ ] Twierdzenia poparte liczbami lub datami
- [ ] Pytania z PAA dla głównej frazy uwzględnione w treści lub FAQ
- [ ] `datePublished` i `dateModified` w Article schema
- [ ] Treść nie ma długich wstępów przed główną odpowiedzią
