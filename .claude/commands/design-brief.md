---
description: "Przygotuj brief do zewnętrznego Claude Design"
---

# design-brief

Zero emoji (ikony Lucide), light mode domyślnie, bez em-dash. Nie ruszaj backendu/API/auth/bazy.

Przygotuj materiał, żeby kierunek wypracował **Claude Design** (claude.ai/design, osobna powierzchnia, Claude Code jej nie odpala). Ten tryb NIE projektuje sam - produkuje brief i instrukcję. Sam design robisz w Claude Design, wracasz z paczką Handoff i odpalasz `/design-adopt`.

1. **Zrozum produkt** jak w trybie `direction` krok 1 (cel, odbiorca, ton).
2. **Wyprodukuj brief do wklejenia:** jeden samowystarczalny blok po polsku, oznaczony "PROMPT DO WKLEJENIA W CLAUDE DESIGN", w potrójnych backtickach. Zawiera: czym jest produkt i dla kogo; kierunek i wrażenie; filozofia layoutu i hierarchii; typografia, paleta (role kolorów), spacing, radiusy; lista komponentów; wymagane stany (empty/loading/error/success); ekrany do pokazania najpierw; twarde zasady (zero emoji, Lucide, light mode, bez kopiowania brandów); czego unikać. Brief gęsty - to największa dźwignia jakości.
3. **Instrukcja prowadzenia (krótko):** 1) w Claude Design podłącz kodbazę (Import z GitHuba albo lokalny katalog); 2) ustaw najpierw system projektowy (kolory, typografia, komponenty); 3) iteruj: czat do struktury, komentarze inline do lokalnych poprawek; 4) każ pokazać stany; 5) gdy gotowe: Share → Handoff to Claude Code; 6) wróć z paczką i odpal `/design-adopt`.

Output: blok briefu + krótka instrukcja + następny krok (`/design-adopt` po Handoffie).
