---
description: "Audyt SEO/GEO/AEO"
---

# audit-seo


Analiza, read-only. NIE zmieniaj kodu; poprawki wykonaj osobno (np. /work-autonomous).

Audyt wg skilla `marketing-seo`. Wczytaj `marketing-seo` (i jego `references/` gdy schodzisz w szczegóły meta/schema/AEO). Jeśli w repo jest skill domenowy `write-*` z regułami SEO, jego formaty nagłówków mają pierwszeństwo.

Sprawdź w trzech warstwach:
- **Technical:** indeksowalność (robots.txt, sitemap, canonical, HTTPS), meta (title 50-60 znaków z frazą na początku, description 150-160, dokładnie jeden H1 z frazą), Open Graph, mobile-friendliness, Core Web Vitals (LCP<2.5s, INP<200ms, CLS<0.1, FCP<1.8s) jako sygnał rankingowy.
- **On-page:** fraza w title/H1/URL/pierwszych 100 słowach/alt głównego obrazu/co najmniej jednym H2, intencja wyszukiwania, struktura nagłówków, linkowanie wewnętrzne (anchory opisowe z frazą, brak "kliknij tutaj", strony-sieroty).
- **AEO / GEO:** czy treść odpowiada wprost na pytanie w pierwszym zdaniu/akapicie, struktura pytanie → odpowiedź → rozwinięcie, FAQ schema, autorytatywność (konkret, dane, brak waty) - czyli czy nadaje się do cytowania przez AI Overviews / Perplexity / ChatGPT.

Walidacja gdy dostępna: Google Rich Results Test (schema), PageSpeed Insights (CWV). CWV traktuj tu jako sygnał SEO; pełny audyt szybkości to `/audit-perf`.

Na problem: waga, gdzie, dlaczego szkodzi widoczności, konkretna poprawka, pliki. Plan w 3 etapach: quick wins (meta, alt, canonical) → struktura i schema → głębsze (treść, linkowanie, AEO). Nie modyfikuj kodu - poprawki przez `/one-task` lub `/execute-phase`.
