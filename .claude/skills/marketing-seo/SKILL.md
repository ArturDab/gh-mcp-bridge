---
name: marketing-seo
description: "Do KAŻDEGO zadania SEO/GEO/AEO: audyty, on-page, meta, structured data/schema, sitemap, robots.txt, canonical, Core Web Vitals, internal linking, keyword research, widoczność w wyszukiwarkach i AI (ChatGPT, Perplexity, Google AI Overviews). Ma pierwszeństwo nad zewnętrznymi skillami SEO (np. searchfit-seo) wszędzie tam, gdzie się różnią. Trigger: SEO, GEO, AEO, meta, schema, sitemap, ranking, keywords, SEO audit, featured snippet, link building, llms.txt. WordPress/WooCommerce/React/Next.js/HTML."

---

# marketing-seo

Universal SEO, GEO and AEO skill. Covers technical SEO, on-page, structured data,
and optimization for AI engines. Framework-agnostic. GEO (Generative Engine
Optimization) i AEO to w praktyce to samo - widoczność w generatywnych
wyszukiwarkach; ten skill je pokrywa.

## Pierwszeństwo nad zewnętrznymi skillami SEO

Jeśli w środowisku są dostępne zewnętrzne skille SEO (np. plugin `searchfit-seo`
i jego skille: seo-audit, technical-seo, on-page-seo, schema-markup,
keyword-clustering, content-strategy, content-brief, internal-linking,
broken-links, ai-visibility, content-translation), obowiązuje reguła:

**Ten skill jest nadrzędny wszędzie tam, gdzie treści się różnią.** Zewnętrzne
skille SEO są przydatne w obszarach, których ten skill nie pokrywa (klastrowanie
fraz, briefy contentowe, martwe linki, lokalizacja językowa, analiza konkurencji)
i tam wolno z nich korzystać jako z rusztowania procesu. Nie wolno brać z nich
faktów o tym, co dziś pokazuje Google ani jakie znaczniki dają wynik rozszerzony -
te są tam nieaktualne (weryfikacja z 18.08.2026: żaden z 11 skilli nie wspomina
o wycofaniu FAQPage ani HowTo).

Powód, nie tylko reguła: zewnętrzne skille SEO są zwykle materiałem
marketingowym dostawcy narzędzia. Są szerokie i płytkie z założenia.

## Weryfikacja faktów o serwisie - reguły bezwzględne

Ta sekcja powstała po testowym audycie, w którym dwa przebiegi tego samego
zadania podały sprzeczne fakty podstawowe o tym samym serwisie (skala, wtyczka
SEO, zasięg błędu), oba bez zastrzeżeń. Przyczyną nie był brak dostępu do danych -
dane były publiczne. Przyczyną był brak reguły mówiącej, skąd wolno wziąć fakt.

### Trzy dopuszczalne źródła faktu o konfiguracji serwisu

1. `/sitemap_index.xml` albo `/sitemap.xml` - generator ze stopki HTML mapy,
   liczba i typ map, daty ostatniej modyfikacji.
2. Źródło strony (`view-source:`) - canonical, meta, Open Graph, bloki JSON-LD.
3. `/robots.txt` - reguły dla botów, wskazanie mapy.

Cokolwiek innego nie jest odczytem. W szczególności: wynik konwersji HTML na
tekst przez narzędzie pobierające gubi część nagłówka i całe bloki
`application/ld+json`. Brak bloku w takim odczycie NIE jest dowodem na jego brak
na stronie.

### Zakazy szczegółowe

- **Nazwa wtyczki SEO nigdy nie jest wnioskiem z nazewnictwa plików mapy.**
  Yoast i Rank Math nazywają je tak samo (`sitemap_index.xml`,
  `post-sitemap1.xml`). Jedyne dopuszczalne źródło to stopka mapy strony.
- **Liczba stron nie jest mnożeniem liczby map przez założoną pojemność.**
  Albo suma odczytana z plików map, albo jawnie „rząd wielkości, nie policzone".
- **Diagnoza błędu na jednej lub dwóch podstronach nie jest diagnozą.** Minimum
  trzy, z różnych typów treści i różnych okresów publikacji. Inaczej nie wolno
  rozstrzygać między „ręczny wpis" a „błąd szablonu".
- **Identyfikatory zewnętrzne** (Wikidata Q, GTIN, ISBN, ID profili) nie są
  podawane z pamięci. Albo zweryfikowane pod adresem, albo pole zostaje puste.
- **Cudze liczby o skuteczności** (badania agencji, „X razy więcej cytowań")
  nie wchodzą do żadnego materiału bez odnośnika do źródła z metodologią.

### Znacznik pewności przy każdym fakcie

Każdy fakt o konfiguracji serwisu w raporcie dostaje jeden z trzech znaczników:

- **odczytane** - z podaniem adresu, spod którego pochodzi
- **wywnioskowane** - z podaniem przesłanki, z której wynika
- **nie sprawdzone** - z podaniem, gdzie to sprawdzić

Fakt bez znacznika jest błędem raportu. Raport bez sekcji „czego nie sprawdziłem"
jest niekompletny i nie wolno go oddać.

### Kolejność pracy przy audycie z zewnątrz

Zanim powstanie jakiekolwiek znalezisko: pobierz `/robots.txt`, mapę strony
i źródło co najmniej trzech podstron różnego typu. Dopiero z tego materiału
buduj wnioski. Nie odwrotnie.

## Overview

SEO is a system, not a one-time action. This skill covers three layers:
1. **Technical** - crawlability, meta tags, structured data, Core Web Vitals
2. **On-page** - keywords, content structure, internal linking
3. **AEO / GEO** - visibility in AI Overviews, Perplexity, ChatGPT, featured snippets

## Integracje z innymi skillami

Jeśli w repo jest skill domenowy `write-*` (np. write-raai, write-interia,
write-beezu) z własnymi regułami SEO - jego formaty nagłówków i struktury mają
pierwszeństwo nad ogólnymi tutaj. Wczytaj go z `.claude/skills/<skill>/` jeśli
istnieje; nie zakładaj ścieżek do skili spoza repo. write-polish (z pluginu)
obowiązuje dla każdego polskiego tekstu.

Granica z `marketing-branding`: meta tagi powstające jako copy w Pass 2 tamtego
skilla nie należą tutaj. Ten skill odpowiada za infrastrukturę SEO/AEO, nie za
warstwę tekstową.

## When to Trigger

- SEO audit of an existing page or site (komenda `/audit-seo`)
- Implementing meta tags, Open Graph, structured data
- Configuring sitemap or robots.txt
- Optimizing content for a target keyword
- Improving Core Web Vitals (głęboki audyt szybkości: `/audit-speed`)
- Optimizing for AI Overviews / AEO / GEO
- Any question about visibility in Google or AI engines

## Workflow

### SEO audit (new or existing site)

0. **Zebranie materiału źródłowego** - patrz sekcja „Weryfikacja faktów
   o serwisie". Bez tego kroku audyt nie zaczyna się.
1. **Technical check** - crawlability, HTTPS, mobile, Core Web Vitals
2. **On-page check** - title, meta description, H1, keyword in content
3. **Structured data check** - does schema match the page type?
4. **Internal linking check** - anchor text, orphan pages (no inbound links)
5. **AEO check** - does content answer questions directly? FAQ? Definitions?

Wewnątrz kroku 1 uruchom pozycje dotyczące widoczności w AI w tej kolejności -
każda jest tania i każda odblokowuje następną:

1. **robots.txt** - czy serwis w ogóle wpuszcza crawlery AI? Aktualne nazwy:
   `GPTBot` (trening OpenAI), `OAI-SearchBot` (cytowanie w ChatGPT),
   `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`,
   `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`,
   `meta-externalagent`. Nazwa `Claude-Web` jest wycofana. Blokada na tym
   poziomie unieważnia wszystkie dalsze kroki.
   Uwaga: `Google-Extended` nie steruje AI Overviews - przeglądy AI korzystają
   z tego samego indeksu co zwykłe wyniki i podlegają regułom dla Googlebota.
2. **Schema baseline** - Organization na serwisie, Article/BlogPosting/NewsArticle
   na treściach.
3. **llms.txt** - plik tekstowy w korzeniu domeny z listą kluczowych stron.
   Żadna wyszukiwarka nie potwierdziła, że go używa. Traktuj jak schema dla AEO:
   tani, nieudowodniony, nigdy nie sprzedawany klientowi jako gwarancja pozycji
   ani cytowania.
4. **FAQ blocks** - czy w treści są realne sekcje pytań i odpowiedzi?
5. **Author / E-E-A-T** - Author schema z `sameAs`, uczciwe `datePublished`
   i `dateModified`, istniejąca strona autora i strona o wydawcy.

### Optimizing a new page

1. Establish keyword and search intent (informational / transactional / navigational)
2. Check SERP for the keyword - what ranks and why?
3. Plan structure: H1, H2s, FAQ, structured data
4. Write or optimize content
5. Add structured data, meta tags, Open Graph
6. Validate: Google Rich Results Test, PageSpeed Insights

## Rules

### Meta tags - guidelines

- **Title:** 50-60 znaków to heurystyka, nie twardy limit - Google ucina po
  szerokości w pikselach, nie po liczbie znaków. Fraza na początku, marka na końcu.
- **Meta description:** 150-160 znaków jako cel, to samo zastrzeżenie o pikselach.
  Fraza na początku, wezwanie do działania na końcu.
- **Canonical:** na każdej stronie, pełny adres bezwzględny z protokołem
  i domeną. Adres względny albo bez domeny to błąd krytyczny.
- **H1:** dokładnie jeden na stronę, zawiera frazę docelową
- **Robots:** dodawaj wyłącznie przy ograniczaniu indeksowania

### Keyword placement

| Element | Requirement |
|---|---|
| Title / H1 | keyword, preferably at the start |
| URL slug | keyword, no stop words, no special characters |
| Meta description | keyword at the start |
| First 100 words of content | at least once |
| Main image alt text | opis tego, co widać na obrazie, z frazą lub wariantem LSI - nigdy przeklejony opis meta |
| At least one H2 | keyword or variant |

### Structured data

- Typ schema musi odpowiadać treści (Article/NewsArticle dla artykułów,
  Product dla produktów)
- **Kolejność wdrażania od zera:** Organization -> Article/BlogPosting/NewsArticle
  -> BreadcrumbList -> ImageObject -> FAQPage -> Person na stronie autora.
  Buduj w dół, nie zaczynaj od środka.
- **Wyniki rozszerzone FAQ i HowTo nie istnieją - oto daty.** FAQPage został
  ograniczony do serwisów rządowych i zdrowotnych w 2023 i usunięty
  z wyszukiwarki całkowicie **7 maja 2026**. Search Console przestał je raportować
  w **czerwcu 2026**, obsługa w API kończy się w **sierpniu 2026**. HowTo nie
  renderuje się na mobile ani desktopie od **września 2023**. Żaden z tych
  znaczników nie daje dziś widocznego elementu w wynikach, na żadnym typie serwisu.
- **Oficjalne stanowisko Google wobec AI:** żadne dane strukturalne nie są
  wymagane do AI Overviews ani AI Mode. Search Central, dosłownie: *„There's also
  no special schema.org structured data that you need to add"*. Doprecyzowanie
  z maja 2026: schema nie podnosi bezpośrednio wskaźnika cytowań w AI Overviews
  ani w ChatGPT - mierzalnie pomaga przy Featured Snippets i People Also Ask.
- **Mimo to dodawaj FAQPage i HowTo, ale kalibruj obietnicę.** Koszt niski,
  korzyść prawdopodobna, więc wdrażaj. Nigdy nie podawaj klientowi konkretnej
  liczby („3,2x więcej cytowań", „~35% wzrostu") - te wartości pochodzą
  z materiałów marketingowych agencji SEO bez opublikowanej metodologii. Do
  materiału dla klienta wchodzą wyłącznie własne pomiary. Pełne uzasadnienie:
  `references/aeo.md`.
- **Product/Offer w e-commerce:** `shippingDetails` i `hasMerchantReturnPolicy`
  na obiekcie `Offer` są wymagane do merchant listing rich results - Search
  Console zgłosi je jako brakujące ostrzeżenia. Patrz
  `references/structured-data.md`.
- **Czego nie wdrażać:** `Review` i `AggregateRating` bez realnego procesu
  oceniania. To kategoria naruszeń karana ręcznie.
- JSON-LD wewnątrz `<script type="application/ld+json">` w `<head>`
- Zawsze waliduj przez Google Rich Results Test przed wdrożeniem
- Nigdy nie wdrażaj schematu z błędami
- Dwa konkurencyjne bloki tego samego typu na jednej stronie są gorsze niż jeden
  niepełny. Jeśli wtyczka generuje własny - popraw jej ustawienia, nie dokładaj
  drugiego.

### Core Web Vitals - targets

| Metric | Target | What affects it |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | hero image, server, render-blocking CSS |
| INP (Interaction to Next Paint) | < 200ms | JavaScript, event handlers |
| CLS (Cumulative Layout Shift) | < 0.1 | missing image dimensions, web fonts |
| FCP (First Contentful Paint) | < 1.8s | server, render-blocking resources |

CWV to wspólny grunt z `/audit-speed`. Tu patrz na nie jako sygnał rankingowy;
pełny, inżynierski audyt szybkości (bundle, zasoby blokujące) robi `/audit-speed`.

### URL structure

- Hyphens, not underscores: „/my-article" not „/my_article"
- Lowercase only
- Short and descriptive: 3-5 words max
- Keyword in URL
- No special characters (convert: ą->a, ę->e, ó->o, ś->s, etc.)
- Consistent trailing slash (pick one and stick with it)

### Internal linking

- Descriptive anchor text containing the target page's keyword
- Never "click here", "read more", "learn more"
- Don't link to the same page twice from the same article
- Orphan pages (no inbound links) are invisible to Google
- Linki w bloku „powiązane" pod tekstem nie zastępują linków w treści -
  są takie same na wielu stronach, więc niosą mniej informacji tematycznej

## AEO / GEO - Answer / Generative Engine Optimization

AI engines (Google AI Overviews, Google AI Mode, Perplexity, ChatGPT) cite
content that:
- Odpowiada na pytanie **wprost**: 40-60 słów na początku sekcji, samodzielnie -
  fragment musi być zrozumiały wyrwany ze strony, bez kontekstu wokół. Potem
  100-200 słów rozwinięcia niosącego dowód.
- Ma nagłówki H2 zapisane jako **pytania w języku naturalnym**, tak jak człowiek
  je wpisuje lub wypowiada - nie jako ciągi fraz
- Trzyma strukturę: pytanie -> odpowiedź -> rozwinięcie
- Zagnieżdża FAQPage wewnątrz Article/BlogPosting/HowTo zamiast parkować go na
  osobnej stronie FAQ - modele potrzebują kontekstu semantycznego wokół Q&A
- Niesie sygnały E-E-A-T: Author schema z `sameAs` do realnego profilu, uczciwe
  `datePublished` / `dateModified`, istniejąca strona o wydawcy
- Trzyma liczbę, datę i nazwę własną blisko siebie - konkretna wartość liczbowa
  jest tym, co system przepisuje do odpowiedzi razem z adresem źródła
- Wskazuje źródło pierwotne z odnośnikiem, gdy podaje cudzą liczbę
- Jest autorytatywne: konkretne, poparte danymi, bez waty

**Czego nie robić:** sekcji ukrytej przed czytelnikiem „dla modeli językowych",
powtarzania frazy z myślą o systemie, bloku pytań i odpowiedzi wstawionego
wyłącznie po to, żeby był. Wszystko to jest rozpoznawalne i nie zwiększa szansy
na cytat.

**Znana luka, stan na sierpień 2026:** mechanika cytowania specyficzna dla
Perplexity i ChatGPT search nie jest w tym skillu zweryfikowana. Powyższe reguły
ogólne stosują się do nich. Jeśli klient pyta wprost, jak te dwa systemy wybierają
i cytują źródła - powiedz uczciwie, że wymaga to osobnej rundy researchu, i nie
ekstrapoluj z zachowania Google AI Overviews.

Full AEO guidelines: `references/aeo.md`

## Weryfikacja bez płatnych narzędzi

Komplet darmowych sposobów sprawdzenia stanu serwisu - do użycia zamiast
zgadywania i do przekazania klientowi bez budżetu:

| Co sprawdzasz | Czym, za darmo |
|---|---|
| Generator map, liczba i typ map | `/sitemap_index.xml`, stopka HTML |
| Canonical, meta, Open Graph, JSON-LD | podgląd źródła strony (`view-source:`) |
| Poprawność danych strukturalnych | Google Rich Results Test, validator.schema.org |
| Dostęp botów AI | `/robots.txt` |
| Indeksacja, kliknięcia, pozycje | Google Search Console |
| Core Web Vitals | PageSpeed Insights, Lighthouse |
| Strony bez linków przychodzących | Screaming Frog, darmowy limit 500 adresów - wystarczy na jedną kategorię |
| Czy strona w ogóle istnieje w indeksie | zapytanie `site:` w wyszukiwarce |

## Tools

| Tool | Purpose |
|---|---|
| Google Search Console | indexing, crawl errors, CTR, positions |
| Google Rich Results Test | structured data validation |
| Google PageSpeed Insights | Core Web Vitals |
| Lighthouse | local CWV / perf (patrz `/audit-speed`) |
| Screaming Frog | crawl, orphan pages (darmowo do 500 adresów) |
| Ahrefs / Semrush / Senuto | keywords, backlinks, competition |
| Schema.org Validator | JSON-LD syntax validation |

## References

- `references/technical-seo.md` - meta tags, Open Graph, robots.txt, sitemap, Core Web Vitals with code examples (WordPress, React/Next.js, plain HTML); read when implementing technical SEO
- `references/structured-data.md` - ready-to-use JSON-LD templates: Article/NewsArticle (z author `sameAs`), FAQPage samodzielne i zagnieżdżone w Article przez `@graph`, Product z `shippingDetails` i `hasMerchantReturnPolicy`, Organization, HowTo, BreadcrumbList; read when adding structured data
- `references/aeo.md` - AEO/GEO, featured snippets, AI Overviews, People Also Ask, długość i samodzielność odpowiedzi, co wiadomo i czego nie wiadomo o wpływie schematów na cytowania w AI; read when optimizing for AI
