---
name: typography-library
description: "Biblioteka gotowych par typograficznych (naglowek + tekst + mono) per gatunek, wylacznie z fontami majacymi ZWERYFIKOWANE polskie znaki. Celowo spoza oczywistego zestawu, zeby projekt nie wygladal jak generowany przez AI. Stosuj gdy dobierasz fonty do UI/strony, budujesz tokeny typografii, zakladasz projekt albo redesign. Trigger: typografia, fonty, dobor fontow, para fontow, naglowek, kroj, webfont, Google Fonts, Fontshare, skala tekstu."
metadata:
  author: artur
  version: "1.0.0"
---

# Biblioteka par typograficznych (32 pary, PL zweryfikowane)

## Twarde reguly (kaganiec)
- **Polskie znaki OBOWIAZKOWE i ZWERYFIKOWANE** (a c e l n o s z z). Kazdy font ponizej ma
  potwierdzona obsluge PL (metoda weryfikacji w nawiasie przy foncie). Dodajac nowy font -
  sprawdz, nie zakladaj.
- **Fraunces / Roboto / Arial / Space Grotesk: ZAKAZ** (generyczne / decyzja Artura).
- **Inter: DOZWOLONY swiadomie**, tylko jako tekst (nie naglowek), gdy reszta pary jest wyrazista.
  Oznaczony w parach jako "swiadomy wybor".
- Licencje: OFL 1.1 (Google Fonts) i ITF Free Font License (Fontshare - darmowe komercyjnie,
  bez odsprzedazy/redystrybucji plikow). Sprawdz przed uzyciem komercyjnym.
- Wybierz pare po gatunku, wklej import, zmapuj na tokeny (--font-display / --font-body / --font-mono).

> **Legenda licencji:** OFL = SIL Open Font License 1.1 (darmowe, komercyjne, modyfikacja i redystrybucja dozwolone). ITF Free Font License = licencja Fontshare / Indian Type Foundry (serwis uruchomiony w 2020 r.); darmowa do użytku osobistego i komercyjnego, zakazuje odsprzedaży i redystrybucji plików fontów.

# Deliverable A — Pary typograficzne

> **Legenda licencji:** OFL = SIL Open Font License 1.1 (darmowe, komercyjne, modyfikacja i redystrybucja dozwolone). ITF Free Font License = licencja Fontshare / Indian Type Foundry (serwis uruchomiony w 2020 r.); darmowa do użytku osobistego i komercyjnego, zakazuje odsprzedaży i redystrybucji plików fontów.

## Fintech / dashboard

### Ledger Clarity — fintech/dashboard (w duchu Stripe, inspirowane nie kopiowane)
Kiedy: panele z liczbami i tabelami, gdzie liczy się czytelność cyfr.
- Nagłówek: Plus Jakarta Sans (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; charmap zawiera Latin Extended-A)
- Tekst: Manrope (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: IBM Plex Mono (Google Fonts, OFL) — PL: zweryfikowane (IBM Design Language → Typography → lista języków → Polish)
- Dlaczego działa: geometryczny, pewny nagłówek nad neutralnym tekstem; mono do tabel liczbowych.
- Import: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700&family=Manrope:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap`

### Numerica — fintech/dashboard (w duchu Mercury, inspirowane nie kopiowane)
Kiedy: nowoczesny bankowy interfejs z mocnym nagłówkiem.
- Nagłówek: Schibsted Grotesk (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; GitHub schibsted/schibsted-grotesk — Underware Latin Plus)
- Tekst: Inter (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish) — **świadomy wybór** (tylko tekst, nie nagłówek)
- Mono: JetBrains Mono (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Dlaczego działa: wyrazisty grotesk kontroluje hierarchię, Inter zostaje neutralnym tłem danych.
- Import: `https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@600;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap`

### Quant Grotesk — fintech/dashboard (w duchu Ramp, inspirowane nie kopiowane)
Kiedy: dashboard z charakterem, nie generyczny.
- Nagłówek: Cabinet Grotesk (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Tekst: Switzer (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish; charmap Latin Extended-A)
- Mono: JetBrains Mono (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Dlaczego działa: kontrast kresek w Cabinet daje osobowość, [SYTRA Fonts](https://sytra.site/v1/cabinet-grotesk) Switzer to spokojny neo-grotesk do treści.
- Import: Fontshare: `https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&f[]=switzer@400,500&display=swap` ; Mono: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap`

### Vault — fintech/dashboard (w duchu Brex, inspirowane nie kopiowane)
Kiedy: premium fintech, ciemny motyw i mocne KPI.
- Nagłówek: Satoshi (Fontshare, ITF Free Font License; Copyright 2017–2021 Indian Type Foundry) — PL: zweryfikowane (Fontshare → lista języków → Polish; wariant zmienny 300–900 z italikami)
- Tekst: Manrope (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: Geist Mono (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Dlaczego działa: Satoshi jest nowoczesny i „drogi", Geist Mono spina liczby technicznym rytmem.
- Import: Fontshare: `https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap` ; Google: `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500&family=Geist+Mono:wght@400&display=swap`

## SaaS / produktywność

### Onboard — SaaS/produktywność (w duchu Linear, inspirowane nie kopiowane)
Kiedy: produkt SaaS z czystym onboardingiem.
- Nagłówek: Sora (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; charmap Latin Extended-A)
- Tekst: Hanken Grotesk (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: JetBrains Mono (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Dlaczego działa: Sora ma technologiczny rys, Hanken jest ciepłym, czytelnym workhorse'em.
- Import: `https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Hanken+Grotesk:wght@400;500&family=JetBrains+Mono:wght@400&display=swap`

### Flow State — SaaS/produktywność (w duchu Notion, inspirowane nie kopiowane)
Kiedy: aplikacja do pracy, dużo tekstu i list.
- Nagłówek: Bricolage Grotesque (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Tekst: Hanken Grotesk (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: Bricolage ma „ręczny" charakter z ink-trapami, Hanken utrzymuje spokój treści.
- Import: `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Hanken+Grotesk:wght@400;500&display=swap`

### Kanban — SaaS/produktywność (w duchu Height, inspirowane nie kopiowane)
Kiedy: tablice zadań i widoki listowe.
- Nagłówek: General Sans (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare / CDNFonts → lista języków → Polish; ⚠ zalecany podgląd glifów, patrz Caveats)
- Tekst: Switzer (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Mono: IBM Plex Mono (Google Fonts, OFL) — PL: zweryfikowane (IBM Design Language → lista języków → Polish)
- Dlaczego działa: General Sans jest szwajcarsko-czysty, Switzer neutralny, mono do etykiet.
- Import: Fontshare: `https://api.fontshare.com/v2/css?f[]=general-sans@500,600&f[]=switzer@400,500&display=swap` ; Mono: `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap`

### Sprint — SaaS/produktywność (w duchu Vercel, inspirowane nie kopiowane)
Kiedy: minimalistyczny, techniczny landing produktu.
- Nagłówek: Geist (Google Fonts, OFL 1.1; Copyright (c) 2023 Vercel, we współpracy z Basement Studio) — PL: zweryfikowane (Google Fonts → Languages → Polish; glify Ł/Ą/Ś/Ź/Ń obecne)
- Tekst: DM Sans (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; charmap Latin Extended-A)
- Mono: Geist Mono (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Dlaczego działa: Geist to precyzyjny, „vercelowy" ton, DM Sans miękko domyka treść.
- Import: `https://fonts.googleapis.com/css2?family=Geist:wght@600;700&family=DM+Sans:wght@400;500&family=Geist+Mono:wght@400&display=swap`

## Editorial / treść

### Redakcja — editorial/treść (w duchu The Verge, inspirowane nie kopiowane)
Kiedy: portal newsowy z długimi artykułami.
- Nagłówek: Newsreader (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; GF Latin Plus, charmap Latin Extended-A)
- Tekst: DM Sans (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: Newsreader to serif stworzony do czytania na ekranie, DM Sans daje nowoczesny kontrapunkt.
- Import: `https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,600&family=DM+Sans:wght@400;500&display=swap`

### Feuilleton — editorial/treść (w duchu Medium, inspirowane nie kopiowane)
Kiedy: blog autorski, eleganckie nagłówki.
- Nagłówek: Instrument Serif (Google Fonts, OFL) — PL: zweryfikowane (repo GitHub Instrument/instrument-serif: „The 374 latin glyphs … support 86 languages: … Polish")
- Tekst: Manrope (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: wysoki kontrast Instrument Serif buduje „literacki" nagłówek nad neutralnym Manrope.
- Import: `https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500&display=swap`

### Longform — editorial/treść (w duchu The Atlantic, inspirowane nie kopiowane)
Kiedy: eseje i publikacje długie.
- Nagłówek: Spectral (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; GitHub googlefonts/spectral — GF Latin Pro, 130+ języków)
- Tekst: Manrope (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: Spectral jest zaprojektowany do czytania na ekranie, Manrope odciąża UI wokół tekstu.
- Import: `https://fonts.googleapis.com/css2?family=Spectral:wght@400;600&family=Manrope:wght@400;500&display=swap`

### Esej — editorial/treść (w duchu Are.na, inspirowane nie kopiowane)
Kiedy: treść z charakterem, kuratorska.
- Nagłówek: Zodiak (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Tekst: Synonym (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: wysokokontrastowy serif Zodiak plus czysty Synonym dają redakcyjny, niebanalny duet.
- Import: Fontshare: `https://api.fontshare.com/v2/css?f[]=zodiak@400,700&f[]=synonym@400,500&display=swap`

### Magazyn — editorial/treść (w duchu Pitchfork, inspirowane nie kopiowane)
Kiedy: magazyn kulturalny, mocne okładki.
- Nagłówek: Bricolage Grotesque (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Tekst: Newsreader (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: ekspresyjny grotesk w tytułach, serif do korpusu tekstu — kontrast redakcyjny.
- Import: `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Newsreader:opsz,wght@6..72,400&display=swap`

## Ecommerce premium

### Atelier — ecommerce premium (w duchu Aesop, inspirowane nie kopiowane)
Kiedy: sklep premium z minimalistycznym luksusem.
- Nagłówek: DM Serif Display (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; charmap Latin Extended-A)
- Tekst: DM Sans (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: wysoki kontrast serifu w nagłówku plus spokojny geometryczny sans z tej samej rodziny DM. [FontCast](https://fontcast.app/fonts/dm-serif-display)
- Import: `https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500&display=swap`

### Boutique — ecommerce premium (w duchu SSENSE, inspirowane nie kopiowane)
Kiedy: moda, karty produktów z klasą.
- Nagłówek: Zodiak (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Tekst: General Sans (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare / CDNFonts → lista języków → Polish; ⚠ patrz Caveats)
- Mono: brak — PL: n/d
- Dlaczego działa: dramatyczny serif nad neutralnym sans — modowy, edytorialny ton.
- Import: Fontshare: `https://api.fontshare.com/v2/css?f[]=zodiak@400,600&f[]=general-sans@400,500&display=swap`

### Maison — ecommerce premium (w duchu Net-a-Porter, inspirowane nie kopiowane)
Kiedy: luksusowe produkty, dużo białej przestrzeni.
- Nagłówek: Gambetta (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Tekst: Satoshi (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: Gambetta łączy display i tekst z osobowością, Satoshi trzyma nowoczesny, czysty korpus.
- Import: Fontshare: `https://api.fontshare.com/v2/css?f[]=gambetta@400,500&f[]=satoshi@400,500&display=swap`

### Couture — ecommerce premium (w duchu Farfetch, inspirowane nie kopiowane)
Kiedy: high-fashion, mocna typografia okładkowa.
- Nagłówek: Sentient (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Tekst: Switzer (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: ciepły, kaligraficzny serif Sentient plus neutralny Switzer — elegancko i czytelnie.
- Import: Fontshare: `https://api.fontshare.com/v2/css?f[]=sentient@400,500&f[]=switzer@400,500&display=swap`

## Health / wellness

### Uważność — health/wellness (w duchu Calm, inspirowane nie kopiowane)
Kiedy: aplikacje medytacji i dobrostanu.
- Nagłówek: Sentient (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Tekst: Hanken Grotesk (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: miękki serif uspokaja, Hanken jest przyjazny i czytelny w małych rozmiarach.
- Import: Fontshare: `https://api.fontshare.com/v2/css?f[]=sentient@400,500&display=swap` ; Google: `https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&display=swap`

### Oddech — health/wellness (w duchu Headspace, inspirowane nie kopiowane)
Kiedy: przyjazny, okrągły ton dla zdrowia.
- Nagłówek: Quicksand (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Tekst: Manrope (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: zaokrąglone terminacje Quicksand [Google Fonts](https://fonts.google.com/specimen/Quicksand) dają ciepło, [Graphic Design Resource](https://graphicdesignresource.com/quicksand-font-history/) Manrope utrzymuje profesjonalizm treści.
- Import: `https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&family=Manrope:wght@400;500&display=swap`

### Klinika — health/wellness (w duchu Oscar Health, inspirowane nie kopiowane)
Kiedy: platformy medyczne, zaufanie i klarowność.
- Nagłówek: Albert Sans (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Tekst: Hanken Grotesk (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: geometryczny, spokojny Albert Sans buduje zaufanie, Hanken jest czytelny w formularzach.
- Import: `https://fonts.googleapis.com/css2?family=Albert+Sans:wght@500;700&family=Hanken+Grotesk:wght@400;500&display=swap`

### Kojący — health/wellness (w duchu Aetna, inspirowane nie kopiowane)
Kiedy: treści zdrowotne z ludzkim tonem.
- Nagłówek: Lora (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; Latin + Cyrylica)
- Tekst: DM Sans (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: kaligraficzny Lora ociepla nagłówki, DM Sans daje nowoczesny, klarowny korpus.
- Import: `https://fonts.googleapis.com/css2?family=Lora:wght@500;600&family=DM+Sans:wght@400;500&display=swap`

## Playful / consumer

### Zabawa — playful/consumer (w duchu Duolingo, inspirowane nie kopiowane)
Kiedy: aplikacje konsumenckie dla szerokiej publiki.
- Nagłówek: Baloo 2 (Google Fonts, OFL; Ek Type) — PL: zweryfikowane (Google Fonts → Languages → Polish; charmap Latin Extended-A)
- Tekst: Hanken Grotesk (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: pulchny, wesoły Baloo 2 przyciąga, Hanken utrzymuje czytelność dłuższych tekstów.
- Import: `https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Hanken+Grotesk:wght@400;500&display=swap`

### Fiesta — playful/consumer (w duchu Gumroad, inspirowane nie kopiowane)
Kiedy: energetyczne, kolorowe marki konsumenckie.
- Nagłówek: Fredoka (Google Fonts, OFL) — PL: zweryfikowane (lista języków Fredoka wymienia Polish; ⚠ historycznie Fredoka One miała braki w Latin Extended — patrz Caveats)
- Tekst: Manrope (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: okrągły, radosny Fredoka [Google Fonts](https://fonts.google.com/specimen/Fredoka) w tytułach kontra neutralny Manrope w treści.
- Import: `https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Manrope:wght@400;500&display=swap`

### Pop — playful/consumer (w duchu Cash App, inspirowane nie kopiowane)
Kiedy: młodzieżowe apki, mocne CTA.
- Nagłówek: Gabarito (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; ⚠ zalecany podgląd glifów ą/ł/ś, patrz Caveats)
- Tekst: DM Sans (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: Gabarito ma przyjazne, „soft" kształty do nagłówków, DM Sans porządkuje treść.
- Import: `https://fonts.googleapis.com/css2?family=Gabarito:wght@600;800&family=DM+Sans:wght@400;500&display=swap`

### Sok — playful/consumer (w duchu Oatly, inspirowane nie kopiowane)
Kiedy: FMCG i marki z pazurem.
- Nagłówek: Bricolage Grotesque (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Tekst: DM Sans (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: ink-trapy i „wonky" charakter Bricolage dają zabawę, DM Sans normalizuje treść.
- Import: `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500&display=swap`

## Developer / technical

### Terminal — developer/technical (w duchu Railway, inspirowane nie kopiowane)
Kiedy: narzędzia deweloperskie, ciemny motyw.
- Nagłówek: Schibsted Grotesk (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Tekst: Geist (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: JetBrains Mono (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Dlaczego działa: wyrazisty grotesk w tytułach, Geist w treści, JetBrains Mono do kodu.
- Import: `https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@600;800&family=Geist:wght@400;500&family=JetBrains+Mono:wght@400&display=swap`

### Compile — developer/technical (w duchu Fly.io, inspirowane nie kopiowane)
Kiedy: docs i strony techniczne z blokami kodu.
- Nagłówek: Geist (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Tekst: Manrope (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: IBM Plex Mono (Google Fonts, OFL) — PL: zweryfikowane (IBM Design Language → lista języków → Polish)
- Dlaczego działa: Geist trzyma nowoczesny ton, IBM Plex Mono dodaje inżynierski, „korporacyjny" rys kodu.
- Import: `https://fonts.googleapis.com/css2?family=Geist:wght@600;700&family=Manrope:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap`

### Changelog — developer/technical (w duchu Sentry, inspirowane nie kopiowane)
Kiedy: changelogi, statusy, dashboardy inżynierskie.
- Nagłówek: Bricolage Grotesque (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Tekst: Manrope (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: JetBrains Mono (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Dlaczego działa: Bricolage dodaje charakter nad neutralnym Manrope, mono spina dane techniczne.
- Import: `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700&family=Manrope:wght@400;500&family=JetBrains+Mono:wght@400&display=swap`

## Korporacyjne B2B

### Zarząd — korporacyjne B2B (w duchu McKinsey, inspirowane nie kopiowane)
Kiedy: strony korporacyjne, raporty, zaufanie.
- Nagłówek: Albert Sans (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Tekst: Inter (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish) — **świadomy wybór** (tylko tekst)
- Mono: brak — PL: n/d
- Dlaczego działa: geometryczny, powściągliwy Albert Sans buduje autorytet, Inter jest neutralnym tłem.
- Import: `https://fonts.googleapis.com/css2?family=Albert+Sans:wght@600;700&family=Inter:wght@400;500&display=swap`

### Kontrakt — korporacyjne B2B (w duchu Deloitte, inspirowane nie kopiowane)
Kiedy: usługi profesjonalne z klasą i powagą.
- Nagłówek: Crimson Pro (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; charmap Latin Extended-A)
- Tekst: Manrope (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: klasyczny serif Crimson Pro dodaje powagi, Manrope utrzymuje nowoczesny UI.
- Import: `https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@500;600&family=Manrope:wght@400;500&display=swap`

### Rada Nadzorcza — korporacyjne B2B (w duchu SAP, inspirowane nie kopiowane)
Kiedy: enterprise, dużo interfejsu i tabel.
- Nagłówek: General Sans (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare / CDNFonts → lista języków → Polish; ⚠ patrz Caveats)
- Tekst: Switzer (Fontshare, ITF Free Font License) — PL: zweryfikowane (Fontshare → lista języków → Polish)
- Mono: IBM Plex Mono (Google Fonts, OFL) — PL: zweryfikowane (IBM Design Language → lista języków → Polish)
- Dlaczego działa: dwa neutralne, dopracowane sansy ITF dają spójny, poważny system.
- Import: Fontshare: `https://api.fontshare.com/v2/css?f[]=general-sans@500,600&f[]=switzer@400,500&display=swap` ; Mono: `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap`

### Ekspansja — korporacyjne B2B (w duchu HubSpot, inspirowane nie kopiowane)
Kiedy: B2B marketing z przyjaznym, ale profesjonalnym tonem.
- Nagłówek: Urbanist (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish; GitHub coreyhu/Urbanist)
- Tekst: Be Vietnam Pro (Google Fonts, OFL) — PL: zweryfikowane (Google Fonts → Languages → Polish)
- Mono: brak — PL: n/d
- Dlaczego działa: geometryczny Urbanist jest energiczny, ale porządny, Be Vietnam Pro czytelny w treści.
- Import: `https://fonts.googleapis.com/css2?family=Urbanist:wght@600;700&family=Be+Vietnam+Pro:wght@400;500&display=swap`

---

---

# Caveats

- **General Sans i Gabarito:** obsługa PL potwierdzona listą języków wydawcy (Fontshare/CDNFonts oraz Google Fonts), ale niektóre mapy znaków (cufonfonts) pokazują w nagłówku tylko „Basic Latin / Latin-1 Supplement". Zalecany 10-sekundowy wizualny podgląd glifów ą/ć/ę/ł/ń/ś/ź/ż na stronie wydawcy przed wdrożeniem produkcyjnym.
- **Fredoka:** aktualna lista języków wymienia Polish, ale historycznie wariant Fredoka One miał zgłaszane braki w Latin Extended (issue GitHub google/fonts #2411). Zweryfikuj konkretny wariant zmienny (Fredoka, nie „One") na docelowej wadze przed użyciem.
- **Wartości kontrastu** policzone analitycznie wg wzoru WCAG dla par `--text`/`--bg` i `--text-muted`/`--bg`. Są to wartości obliczone, nie zmierzone w przeglądarce — potwierdź finalnie w narzędziu audytu po złożeniu UI. Kolory pomocnicze (`--success`, `--warning`, `--danger`) dobrane pod czytelność, ale ich kontrast zależy od tła, na którym je umieścisz — sprawdź w kontekście.
- **„W duchu marki" ≠ kolory marki:** wszystkie palety to interpretacje nastroju, celowo NIE firmowe hexy. Nie używaj nazw marek jako sugestii oficjalnego brandingu.
- **Licencje Fontshare (ITF Free Font License):** darmowe komercyjnie, ale zabraniają odsprzedaży i redystrybucji plików fontów jako takich — hostuj je we własnym projekcie, nie udostępniaj jako osobny zasób do pobrania.
- **Zakres weryfikacji:** obsługę PL potwierdzano na listach „Languages" specimenów Google Fonts, listach języków Fontshare oraz repozytoriach GitHub wydawców (Instrument Serif, Geist, Spectral, Newsreader, Manrope, Bricolage). Fonty, których nie udało się jednoznacznie potwierdzić, zostały pominięte zgodnie z instrukcją — biblioteka zawiera 32 pary zamiast „na siłę" dobitych do 30+ wątpliwych wpisów.