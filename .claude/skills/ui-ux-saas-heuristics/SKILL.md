---
name: ui-ux-saas-heuristics
description: Sprawdzone wzorce UI/UX dojrzałych produktów SaaS. Wczytuj przy projektowaniu lub audycie interfejsu - layout, komponenty, stany, hierarchia, dostępność. Punkt odniesienia jakości, nie biblioteka do kopiowania.
---

# UI/UX SaaS Heuristics

Domyślaj się sprawdzonych wzorców zamiast eksperymentów. Punkty odniesienia jakości: Linear, Vercel, Stripe, Notion, Raycast, Framer. Odniesienie, nie kopiowanie brandu.

## UX

- szybka ścieżka do pierwszej wartości; pokaż wartość zanim poprosisz o wysiłek
- brak zbędnych decyzji; właściwa informacja we właściwym momencie; progressive disclosure
- jasny następny krok po każdej akcji; feedback po akcji
- empty states uczą i prowadzą, nie są puste
- mikrocopy mówi językiem korzyści i działania, nie systemu

## UI

- jedna oczywista akcja główna na ekran; reszta podporządkowana
- standardowe layouty SaaS (sidebar + content, topbar + kolumny); nie wymyślaj nawigacji bez powodu
- spójny system spacingu i jeden rytm; spójne radiusy
- spokojna paleta z jednym akcentem działania; kolor niesie znaczenie, nie dekorację
- typografia buduje hierarchię skalą i wagą; oddech zamiast ciasnoty
- obsłuż wszystkie stany: empty, loading, error, success
- komponenty przewidywalne: te same elementy wyglądają i działają tak samo

## Dostępność (minimum)

- każdy interaktywny element ma dostępną nazwę; przyciski to przyciski, linki to linki
- focus widoczny; nawigacja klawiaturą działa; formularze mają etykiety i komunikaty błędów
- kontrast wystarczający; kolor nie jest jedynym nośnikiem informacji
- logiczna kolejność nagłówków; komfortowe touch targety na mobile

## Czego nie robić

przypadkowe gradienty, zbyt wiele kolorów, niespójne radiusy, płaska hierarchia, dekoracje bez funkcji, efektowne animacje bez uzasadnienia, custom interakcje tam, gdzie wystarczy wzorzec, niski kontrast dla estetyki, emoji zamiast ikon
