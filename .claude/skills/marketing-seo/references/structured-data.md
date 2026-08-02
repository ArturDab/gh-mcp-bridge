# Structured Data - Szablony JSON-LD

Wszystkie schematy wstawiaj w `<script type="application/ld+json">` w `<head>`.
Waliduj zawsze przed deployem: https://search.google.com/test/rich-results

## Contents
- [Article](#article)
- [FAQPage](#faqpage)
- [HowTo](#howto)
- [Product](#product)
- [Organization](#organization)
- [BreadcrumbList](#breadcrumblist)
- [WebSite + SearchAction](#website)

---

## Article

Dla artykułów blogowych, newsów, poradników.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Tytuł artykułu (max 110 znaków)",
  "description": "Krótki opis artykułu",
  "image": ["https://example.com/og-image.jpg"],
  "author": {
    "@type": "Person",
    "name": "Imię Nazwisko",
    "url": "https://example.com/autor"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nazwa wydawcy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/artykul"
  }
}
```

---

## FAQPage

Dla każdej strony z sekcją pytań i odpowiedzi. Daje rich results w Google.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Pytanie 1?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pełna odpowiedź na pytanie 1. Im bardziej konkretna, tym lepiej."
      }
    },
    {
      "@type": "Question",
      "name": "Pytanie 2?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pełna odpowiedź na pytanie 2."
      }
    }
  ]
}
```

WordPress + Rank Math: używaj natywnego FAQ bloku – schema generowana automatycznie.

---

## HowTo

Dla instrukcji krok po kroku. Daje rich results z krokami w Google.

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Jak [zrobić X]",
  "description": "Krótki opis instrukcji",
  "totalTime": "PT30M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Tytuł kroku 1",
      "text": "Szczegółowy opis kroku 1.",
      "image": "https://example.com/krok1.jpg"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Tytuł kroku 2",
      "text": "Szczegółowy opis kroku 2."
    }
  ]
}
```

WordPress + Rank Math: używaj natywnego HowTo bloku.

---

## Product

Dla stron produktowych (e-commerce). Daje rich results z ceną i ocenami.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nazwa produktu",
  "image": "https://example.com/produkt.jpg",
  "description": "Opis produktu",
  "brand": {
    "@type": "Brand",
    "name": "Nazwa marki"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/produkt",
    "priceCurrency": "PLN",
    "price": "299.00",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2025-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47"
  }
}
```

---

## Organization

Dla strony głównej lub strony "O nas". Pomaga Google powiązać markę z domeną.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nazwa firmy",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "Krótki opis firmy",
  "sameAs": [
    "https://twitter.com/firma",
    "https://linkedin.com/company/firma",
    "https://facebook.com/firma"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "kontakt@example.com",
    "contactType": "customer service",
    "availableLanguage": "Polish"
  }
}
```

---

## BreadcrumbList

Dla stron w głębszej hierarchii. Wyświetla ścieżkę nawigacji w wynikach Google.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Strona główna",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Kategoria",
      "item": "https://example.com/kategoria"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Tytuł strony",
      "item": "https://example.com/kategoria/strona"
    }
  ]
}
```

---

## WebSite

Dla strony głównej. Dodaje SearchAction – pole wyszukiwania w wynikach Google.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nazwa serwisu",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/szukaj?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```
