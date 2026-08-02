> UWAGA: 6 dokumentow stanu scalono do `docs/STATE.md` (sekcje: Stan teraz, Plan / Roadmap,
> Decyzje, Dlug techniczny, Diagnozy / Debugging, Handoff / otwarte watki). Czytaj/pisz do wlasciwej sekcji STATE.md.

---
description: "Claude Code sam opracowuje kierunek wizualny"
---

# design-direction

Zero emoji (ikony Lucide), light mode domyślnie, bez em-dash. Nie ruszaj backendu/API/auth/bazy.

Zbuduj nowy kierunek wizualny dla tego produktu, sam, w Claude Code. Używaj na starcie projektu (brak designu) albo gdy obecny wygląd totalnie nie działa i potrzeba resetu, nie polishu. Jeśli wolisz, żeby kierunek wypracował Claude Design (osobne narzędzie z canvasem), użyj trybu `brief`, potem `adopt`. To NIE jest redesign ekran po ekranie (od tego jest `/design-rebuild`). To ustalenie fundamentu.

1. **Zrozum produkt, nie zgaduj estetyki.** Ustal cel, odbiorcę, ton. Źródła: docs/PRODUCT_COMPASS.md, docs/STATE.md; inaczej wywnioskuj z kodu i nazwij założenia wprost. Jeśli to reset, uruchom aplikację i zrób screenshoty (preflight ze screenshot-driven-ui-review); wypisz, co konkretnie nie działa.
2. **Załaduj wiedzę.** Wczytaj frontend-design i web-design-guidelines. Punkty odniesienia jakości (nie do kopiowania brandu): Linear, Vercel, Stripe, Notion, Raycast, Framer.
3. **Zaproponuj trzy kierunki** dobrane do TEGO produktu (np. bezpieczny/profesjonalny, premium/dopracowany, odważny z charakterem). Dla każdego: wrażenie, layout, typografia, paleta, styl komponentów, prezentacja danych, dla jakiego produktu pasuje, ryzyka.
4. **Wybierz jeden i uzasadnij.** Zatrzymaj się i zapytaj tylko, jeśli wybór jest naprawdę niejednoznaczny.
5. **Zapisz docs/VISUAL_DIRECTION.md:** docelowe wrażenie; zasady (7-12 pkt); typografia (role, skala, waga, rytm); kolory (tło, surface, tekst, border, akcent, stany); layout (gęstość, szerokości, grid, spacing); komponenty (karty, przyciski, formularze, listy, tabele, modale, nawigacja, empty/loading/error/success); inspiracje jakościowe (czego NIE kopiować); czego nie robić; review checklist. To propozycja kierunku, nie kanon - usztywnia go `/design-adopt` po Twoim akcepcie.
6. **Implementacja tylko po akceptacji:** tokeny jako jedyne źródło prawdy, zbuduj jeden referencyjny ekran, screenshot i krytyczna ocena (pętla screenshot-driven-ui-review) przed uznaniem za gotowe.

Output: kierunek + uzasadnienie; VISUAL_DIRECTION.md; jeśli wdrażano - pliki, screenshoty, wynik weryfikacji; następny krok (zwykle `/design-adopt`).
