# Technical SEO - Reference

## Contents
- [Meta tagi - HTML](#meta-tagi-html)
- [Open Graph i Twitter Cards](#open-graph)
- [Robots.txt](#robotstxt)
- [XML Sitemap](#xml-sitemap)
- [Core Web Vitals - implementacja](#core-web-vitals)
- [WordPress / Rank Math](#wordpress)
- [React / Next.js](#react-nextjs)

---

## Meta tagi - HTML

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Title: 50-60 znaków, fraza na początku -->
  <title>Fraza kluczowa - Dodatkowe słowo | Brand</title>

  <!-- Meta description: 150-160 znaków, fraza na początku, CTA na końcu -->
  <meta name="description" content="Fraza kluczowa – opis wartości strony. CTA.">

  <!-- Canonical: zawsze, zapobiega duplicate content -->
  <link rel="canonical" href="https://example.com/strona">

  <!-- Język -->
  <html lang="pl">

  <!-- hreflang dla wielojęzycznych stron -->
  <link rel="alternate" hreflang="pl" href="https://example.com/pl/strona">
  <link rel="alternate" hreflang="en" href="https://example.com/en/page">
  <link rel="alternate" hreflang="x-default" href="https://example.com/strona">

  <!-- Robots: tylko gdy ograniczasz; domyślnie nie dodawaj -->
  <!-- <meta name="robots" content="noindex, nofollow"> -->
</head>
```

---

## Open Graph

```html
<!-- Open Graph (Facebook, LinkedIn, itp.) -->
<meta property="og:type" content="article">
<meta property="og:url" content="https://example.com/strona">
<meta property="og:title" content="Tytuł strony (60-90 znaków)">
<meta property="og:description" content="Opis (max 200 znaków)">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Nazwa serwisu">
<meta property="og:locale" content="pl_PL">

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@username">
<meta name="twitter:title" content="Tytuł strony">
<meta name="twitter:description" content="Opis">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">
```

Obraz OG: 1200×630px, max 1MB, JPG lub PNG.

---

## Robots.txt

```txt
# Zezwól wszystkim crawlerom
User-agent: *
Allow: /

# Zablokuj obszary prywatne/admin
Disallow: /wp-admin/
Disallow: /api/
Disallow: /prywatne/

# Lokalizacja sitemapy
Sitemap: https://example.com/sitemap.xml
```

Zasady:
- Plik musi być dostępny pod `https://example.com/robots.txt`
- Nie blokuj CSS i JS – Google potrzebuje ich do renderowania
- `Disallow: /` blokuje całą stronę – używaj tylko na staging

---

## XML Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/artykul</loc>
    <lastmod>2025-01-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

`priority` i `changefreq` są wskazówką dla Google, nie obowiązkiem. Ważniejszy jest `lastmod`.

WordPress + Rank Math/Yoast: sitemap generowany automatycznie pod `/sitemap.xml` lub `/sitemap_index.xml`.

---

## Core Web Vitals

### Obrazy (LCP i CLS)

```html
<!-- Główny obraz (LCP): eager + priority -->
<img
  src="/hero.jpg"
  alt="Opisowy alt text z frazą kluczową"
  width="1200"
  height="630"
  loading="eager"
  fetchpriority="high"
>

<!-- Obrazy poniżej foldu: lazy loading -->
<img
  src="/produkt.jpg"
  alt="Opis produktu"
  width="400"
  height="300"
  loading="lazy"
>
```

Zawsze podawaj `width` i `height` – zapobiega CLS (layout shift podczas ładowania).

### Fonty (CLS i LCP)

```html
<!-- Preload krytycznych fontów -->
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin>

<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter.woff2') format('woff2');
    font-display: swap; /* Zapobiega FOIT - niewidoczny tekst podczas ładowania */
  }
</style>
```

---

## WordPress

WordPress + Rank Math lub Yoast SEO:
- Title i meta description: ustawiaj w polu SEO przy każdym wpisie/stronie
- Canonical: generowany automatycznie – sprawdź czy nie ma duplikatów
- Sitemap: `/sitemap.xml` lub `/sitemap_index.xml` – zgłoś w Search Console
- Open Graph: Rank Math/Yoast generuje automatycznie z pól SEO
- Structured data: Rank Math obsługuje Article, FAQ, HowTo natywnie

Rank Math FAQ block generuje automatycznie FAQPage schema – używaj go zamiast ręcznego JSON-LD.

---

## React / Next.js

### Next.js App Router (next/metadata)

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Nazwa serwisu',
    template: '%s | Nazwa serwisu',
  },
  description: 'Domyślny opis serwisu',
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Nazwa serwisu',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@username',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// app/blog/[slug]/page.tsx - dynamiczne meta tagi
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
  };
}
```

### JSON-LD w React

```typescript
// components/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Użycie w page.tsx
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  // ...
}} />
```
