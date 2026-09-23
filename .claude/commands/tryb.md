---
description: "Pokaż bieżący tryb pracy (CCOS_MODE) i granice zapisu, które z niego wynikają"
---

# tryb

Komenda diagnostyczna. Zero zapisu, nie uruchamia niczego innego. Brak bramy trybu - ta komenda działa zawsze, we wszystkich trybach, bo bez niej nie da się bramy w ogóle sprawdzić.

1. Odczytaj `CCOS_MODE` (`echo $CCOS_MODE`). Nie zgaduj trybu z kontekstu rozmowy ani z tego, jakiej komendy Artur właśnie użył - to jedyna komenda w tym pluginie, która tylko odczytuje zmienną, bez interpretacji tego, co Artur mógł mieć na myśli.
2. Ustal tryb: wartość zmiennej, jeśli to `quick`, `build` albo `audit`; w przeciwnym razie (brak zmiennej albo stara wartość `fast`/`deep`/`test`) - `quick`, i powiedz wprost, że to wartość domyślna albo zaległość do zgłoszenia.
3. Odpowiedz krótko, bez formatu raportu (to nie jest zadanie - format opisuje skill artur-claude-code-os → „Format odpowiedzi", tu go pomijasz):

```
Tryb: <quick|build|audit>
Źródło: <CCOS_MODE=... ustawione | brak zmiennej, wartość domyślna>
Wolno zapisać: <jednym zdaniem, wg definicji trybu w skillu artur-claude-code-os>
Niedostępne w tym trybie: <lista komend, które w tym trybie odmówią>
```
