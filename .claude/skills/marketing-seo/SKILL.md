---
name: marketing-seo
description: "Do KAŻDEGO zadania SEO/GEO/AEO: audyty, on-page, meta, structured data/schema, sitemap, robots.txt, canonical, Core Web Vitals, internal linking, keyword research, widoczność w wyszukiwarkach i AI (ChatGPT, Perplexity, Google AI Overviews). Trigger: SEO, GEO, AEO, meta, schema, sitemap, ranking, keywords, SEO audit, featured snippet, link building. WordPress/React/Next.js/HTML."

---

# marketing-seo

Universal SEO, GEO and AEO skill. Covers technical SEO, on-page, structured data,
and optimization for AI engines. Framework-agnostic. GEO (Generative Engine
Optimization) i AEO to w praktyce to samo - widoczność w generatywnych
wyszukiwarkach; ten skill je pokrywa.

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

## When to Trigger

- SEO audit of an existing page or site (komenda `/audit-seo`)
- Implementing meta tags, Open Graph, structured data
- Configuring sitemap or robots.txt
- Optimizing content for a target keyword
- Improving Core Web Vitals (głęboki audyt szybkości: `/audit-perf`)
- Optimizing for AI Overviews / AEO / GEO
- Any question about visibility in Google or AI engines

## Workflow

### SEO audit (new or existing site)

1. **Technical check** - crawlability, HTTPS, mobile, Core Web Vitals
2. **On-page check** - title, meta description, H1, keyword in content
3. **Structured data check** - does schema match the page type?
4. **Internal linking check** - anchor text, orphan pages (no inbound links)
5. **AEO check** - does content answer questions directly? FAQ? Definitions?

### Optimizing a new page

1. Establish keyword and search intent (informational / transactional / navigational)
2. Check SERP for the keyword - what ranks and why?
3. Plan structure: H1, H2s, FAQ, structured data
4. Write or optimize content
5. Add structured data, meta tags, Open Graph
6. Validate: Google Rich Results Test, PageSpeed Insights

## Rules

### Meta tags - absolute rules

- **Title:** 50-60 characters, keyword at the start, brand at the end
- **Meta description:** 150-160 characters, keyword at the start, CTA at the end
- **Canonical:** on every page, prevents duplicate content
- **H1:** exactly one per page, contains the target keyword
- **Robots:** only add when restricting indexing - don't add by default

### Keyword placement

| Element | Requirement |
|---|---|
| Title / H1 | keyword, preferably at the start |
| URL slug | keyword, no stop words, no special characters |
| Meta description | keyword at the start |
| First 100 words of content | at least once |
| Main image alt text | keyword or LSI variant |
| At least one H2 | keyword or variant |

### Structured data

- Schema type must match content (Article for articles, Product for products)
- FAQ schema for every page with a Q&A section
- JSON-LD inside `<script type="application/ld+json">` in `<head>`
- Always validate via Google Rich Results Test before deploying
- Never deploy a schema with errors

### Core Web Vitals - targets

| Metric | Target | What affects it |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | hero image, server, render-blocking CSS |
| INP (Interaction to Next Paint) | < 200ms | JavaScript, event handlers |
| CLS (Cumulative Layout Shift) | < 0.1 | missing image dimensions, web fonts |
| FCP (First Contentful Paint) | < 1.8s | server, render-blocking resources |

CWV to wspólny grunt z `/audit-perf`. Tu patrz na nie jako sygnał rankingowy;
pełny, inżynierski audyt szybkości (bundle, zasoby blokujące) robi `/audit-perf`.

### URL structure

- Hyphens, not underscores: `/my-article` not `/my_article`
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

## AEO / GEO - Answer / Generative Engine Optimization

AI engines (Google AI Overviews, Perplexity, ChatGPT) cite content that:
- Answers the question **directly** in the first sentence or paragraph
- Uses structure: question -> answer -> expansion
- Has FAQ schema
- Is authoritative: specific, data-backed, no padding

Full AEO guidelines: `references/aeo.md`

## Tools

| Tool | Purpose |
|---|---|
| Google Search Console | indexing, crawl errors, CTR, positions |
| Google Rich Results Test | structured data validation |
| Google PageSpeed Insights | Core Web Vitals |
| Lighthouse | local CWV / perf (patrz `/audit-perf`) |
| Ahrefs / Semrush / Senuto | keywords, backlinks, competition |
| Schema.org Validator | JSON-LD syntax validation |

## References

- `references/technical-seo.md` - meta tags, Open Graph, robots.txt, sitemap, Core Web Vitals with code examples (WordPress, React/Next.js, plain HTML); read when implementing technical SEO
- `references/structured-data.md` - ready-to-use JSON-LD templates: Article, FAQ, Product, Organization, HowTo, BreadcrumbList; read when adding structured data
- `references/aeo.md` - AEO/GEO, featured snippets, AI Overviews, People Also Ask, how to write content for AI engines; read when optimizing for AI
