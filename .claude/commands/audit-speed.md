---
description: "Szybkość i dostępność: pomiar, przyczyny, lista poprawek. React albo WordPress"
argument-hint: "[opcjonalnie: który ekran/URL]"
---

# audit-speed

**Tryb: `test`.** W innym odmów i odeślij.

Mierzy, nie zgaduje. Nic nie zmienia.

## Krok 1 - wykryj stos

Sprawdź, z czym masz do czynienia, i użyj właściwej ścieżki:
- **React / Next.js** - ścieżka A
- **WordPress** - ścieżka B

Nie zakładaj. Sprawdź pliki.

## Ścieżka A: React / Next.js

Lighthouse plus axe na zbudowanej wersji (nie deweloperskiej - ona jest zawsze wolna i wynik będzie bezwartościowy).

Zmierz Core Web Vitals (LCP, INP, CLS). Dla każdego wyniku poniżej progu **znajdź przyczynę w kodzie**, nie w ogólnikach:
- co dokładnie blokuje pierwsze wyświetlenie
- które obrazy nie mają rozmiaru, formatu albo leniwego ładowania
- które biblioteki wchodzą do głównej paczki, a nie powinny
- gdzie jest przeskok układu i co go powoduje

## Ścieżka B: WordPress

Stały zestaw w projektach Artura: **Elementor + szablon pod Elementor + WP Rocket**. Sprawdzaj to konkretnie, nie generycznie.

- **Elementor**: ile widżetów na stronie, czy ładuje się cały zestaw stylów czy tylko używane, czy włączone są ulepszone ładowanie assetów i optymalizacja CSS
- **WP Rocket**: czy cache działa (sprawdź nagłówki odpowiedzi), czy włączone jest łączenie i odraczanie plików, leniwe ładowanie, usuwanie nieużywanego CSS, wstępne ładowanie
- **Wtyczki**: które ładują swoje pliki na **każdej** stronie, choć są potrzebne na jednej. To zwykle największy pojedynczy zysk.
- **Obrazy**: czy są w WebP, czy mają rozmiary, czy nie są ładowane w rozdzielczości większej niż wyświetlane
- **Baza**: rozmiar tabel, śmieci po wtyczkach, autoloadowane opcje
- **Motyw**: czy szablon ładuje fonty z zewnątrz (to blokuje wyświetlenie)

Zmierz to samo co w ścieżce A: Core Web Vitals plus dostępność.

## Wynik

Tabela: co, ile teraz, ile powinno być, przyczyna, poprawka, szacowany zysk.

Posortowana po zysku, nie po łatwości. Na górze rzeczy, które dają najwięcej.

Na końcu: **trzy rzeczy do zrobienia najpierw**, gotowe do wklejenia jako zadanie do sesji Fast.
