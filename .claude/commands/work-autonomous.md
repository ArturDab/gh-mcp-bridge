> UWAGA: 6 dokumentow stanu scalono do `docs/STATE.md` (sekcje: Stan teraz, Plan / Roadmap,
> Decyzje, Dlug techniczny, Diagnozy / Debugging, Handoff / otwarte watki). Czytaj/pisz do wlasciwej sekcji STATE.md.

---
description: "Autonomiczny silnik dużych partii"
---

# work-autonomous

**Tryb: tylko `deep`.** Jeśli `CCOS_MODE` to `fast` lub `test`, odpowiedz jednym zdaniem, że ta komenda działa w środowisku Deep, i nie wykonuj jej. Długi autonomiczny bieg bez weryfikacji to generator regresji, których nikt nie zauważy.


PISZE KOD. Deploy tylko na PREVIEW, nigdy produkcja bez wyraźnego sygnału Artura. Twarde stopy (zgłoś, nie wykonuj): sekrety, migracje produkcyjne, infra, auth/payments.

Pracuj jak długa, samodzielna sesja: maksymalna autonomia między dotknięciami, dotknięcia Artura zbite w paczki. Nie rób jednej rzeczy i nie wracaj po jednej fazie - mielisz duży zakres w pętli, parkujesz decyzje, deployujesz na preview, zostawiasz stan tak, żeby następny bieg podjął plan dalej.

Na starcie odtwórz stan i podejmij plan: przeczytaj CLAUDE.md, docs/STATE.md, STATE.md, STATE.md, STATE.md, DEPLOYMENT.md, VISUAL_DIRECTION.md, git status, skrypty, CI, ostatni diff, TODO/FIXME. Kontynuuj plan tam, gdzie skończył poprzedni bieg. Brak roadmapy = zbuduj bezpieczny zakres z realnego stanu i zaznacz, że brak planu ograniczył partię (paliwo silnika: `/plan-roadmap`).

Pętla faz: wybierz fazę → wykonaj → zweryfikuj → deploy preview → zaktualizuj stan → następna bezpieczna faza. Powtarzaj aż wyczerpiesz bezpieczny zakres albo trafisz na twardy bloker. NIE kończ po jednej fazie. Kolejność: bezpieczne quick winy → ważne średnie → low-risk tech debt → higiena. Źródła zakresu: dokumentacja i pamięć, weryfikacja, luki testowe, UX/UI quick winy, web design polish, low-risk tech debt, CI/tooling, higiena.

Park decyzji: gdy faza wymaga decyzji kierunkowej lub produktowej, NIE zatrzymuj biegu - zaparkuj pozycję i przejdź do następnej niezależnej pracy. Zaparkowane pokazujesz RAZ, zbiorczo, w raporcie końcowym, jako jedną ponumerowaną tabelę.

Granica autonomii (zmiana KIERUNKU vs naprawa WADY):
- Wykonaj sam (usuwanie wad): martwy CSS/kod, dostępność (focus-visible, klawiatura, prefers-reduced-motion, kontrast bez zmiany palety marki), literówki i język w istniejącym copy (write-polish), DX, config, CI, luki testowe, low-risk tech debt, higiena.
- Zaparkuj jako decyzję (brama): zmiana kierunku marki (kolory, typografia, ton), zakres i kolejność sekcji/funkcji, pozycjonowanie i value proposition, treść merytoryczna copy, wszystko co dotyka db/auth/payments/migracji/public API.
- Kontrast graniczny: w palecie marki wykonaj; wymaga zmiany firmowego odcienia zaparkuj.

Jak pracować w partii: funkcje i bugfixy w TDD (test-driven-development); bug w systematic-debugging (root cause przed fixem); niezależne zadania deleguj świeżym subagentom (subagent-driven-development) z dwustopniową recenzją; audyty read-only subagentami; web-ui przez pętlę wizualną.

Weryfikacja po każdej fazie (verification-before-completion): uruchom realne komendy (verify:full, testy, lint, build, web-ui pętla wizualna), oceniaj po ich wyjściu. Faza bez zielonej weryfikacji nie jest zrobiona.

Deploy: po weryfikacji auto-merge na branch preview i deploy na PREVIEW (nigdy produkcja). Produkcję merguj wyłącznie na sygnał Artura.

Aktualizacja stanu na końcu: docs/STATE.md, STATE.md, STATE.md, STATE.md tak, by kolejny bieg wznowił bez dopytywania (fazy wykonane, w toku, zaparkowane decyzje, blokery, następne 3-7 zadań).

Raport końcowy (do akceptu z telefonu): jak wybrałem i mieliłem zakres; fazy wykonane/pominięte/w toku; zmienione pliki; weryfikacja z DOWODEM; tabela zaparkowanych decyzji (# | propozycja | dlaczego brama | rekomendacja | koszt); blokery osobno; co zaktualizowane w docs. Zaakceptowane decyzje wpadają w następny bieg.
