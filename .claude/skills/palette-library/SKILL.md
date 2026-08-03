---
name: palette-library
description: "Biblioteka ~77 palet ról pogrupowanych po KATEGORIACH projektów. KAŻDA paleta ma pełną wersję LIGHT (domyślna) i DARK. Light jest domyślny prawie wszędzie - dark stosuj tylko gdy projekt wyraźnie tego chce. Role: tło, powierzchnia, tekst, akcent, stany. Inspirowane, NIE kopiowane. Trigger: paleta, kolory, motyw, tokeny, akcent, dark mode, light mode, dobór kolorów."
metadata:
  author: artur
  version: "4.0.0"
---

# Biblioteka palet — ~77, light+dark, po kategoriach

DOMYŚLNIE używaj wersji LIGHT. Dark tylko gdy projekt wyraźnie tego wymaga (np. panel dev,
gaming, monitoring). Akcent to JEDEN kolor. **Inspirowane, NIE kopiowane.**
Role: `--bg --surface --elevated --text --text-muted --border --accent --accent-fg --success --warning --danger`


---

# 1. Fintech / personal / dashboard
*money-hub, pulsar, panele, finanse*  ·  (9 palet)

### Porcelain Indigo — w duchu Mercury
Kiedy: dashboardy finansowe, produkty premium, cisza i zaufanie.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#4F46E5; --accent-fg:#FFFFFF; --success:#2E7D5B; --warning:#B7791F; --danger:#C0392B;`
Dark: `--bg:#0F1013; --surface:#171A1F; --elevated:#FFFFFF; --text:#ECECE9; --text-muted:#6E6A62; --border:#262A31; --accent:#4F46E5; --accent-fg:#FFFFFF; --success:#2E7D5B; --warning:#B7791F; --danger:#C0392B;`

### Midnight Amber
Kiedy: panele danych, monitoring; dark z ciepłym akcentem.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#F5A524; --accent-fg:#0E1116; --success:#37C489; --warning:#F5A524; --danger:#F26D6D;`
Dark: `--bg:#0E1116; --surface:#171B22; --elevated:#1F242D; --text:#E6E9EF; --text-muted:#8B93A1; --border:#262C36; --accent:#F5A524; --accent-fg:#0E1116; --success:#37C489; --warning:#F5A524; --danger:#F26D6D;`

### Deep Sea
Kiedy: fintech/dashboard dark z morskim akcentem.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#23B5A6; --accent-fg:#06131B; --success:#23B5A6; --warning:#E0A63C; --danger:#E8695E;`
Dark: `--bg:#0A1620; --surface:#10202C; --elevated:#172A38; --text:#E4EDF2; --text-muted:#8AA0AE; --border:#1E3240; --accent:#23B5A6; --accent-fg:#06131B; --success:#23B5A6; --warning:#E0A63C; --danger:#E8695E;`

### Carbon Amber
Kiedy: monitoring, dane; ciemny węgiel + bursztyn.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#F59E0B; --accent-fg:#0D0F12; --success:#34D399; --warning:#F59E0B; --danger:#F26D6D;`
Dark: `--bg:#0D0F12; --surface:#16191E; --elevated:#1E232A; --text:#E7EAEF; --text-muted:#8C93A0; --border:#242A32; --accent:#F59E0B; --accent-fg:#0D0F12; --success:#34D399; --warning:#F59E0B; --danger:#F26D6D;`

### Onyx Teal — w duchu Stripe
Kiedy: ciemny dashboard finansowy z jednym zielono-morskim akcentem.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#2DD4BF; --accent-fg:#04211C; --success:#34D399; --warning:#FBBF24; --danger:#F87171;`
Dark: `--bg:#0B0F14; --surface:#121821; --elevated:#1A2230; --text:#E6EDF5; --text-muted:#9AA7B8; --border:#243040; --accent:#2DD4BF; --accent-fg:#04211C; --success:#34D399; --warning:#FBBF24; --danger:#F87171;`

### Steel Mint — w duchu Wise
Kiedy: jasny panel z liczbami, spokojny i klarowny.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#0E9F6E; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`
Dark: `--bg:#0C1117; --surface:#151C25; --elevated:#EDF1F6; --text:#E7EDF4; --text-muted:#566374; --border:#26303C; --accent:#0E9F6E; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`

### Deep Indigo Ledger — w duchu Mercury
Kiedy: ciemny fintech premium, akcent indygo.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#8B93FF; --accent-fg:#0A0C16; --success:#4ADE80; --warning:#FCD34D; --danger:#FB7185;`
Dark: `--bg:#0A0C16; --surface:#12162A; --elevated:#1B2140; --text:#E8EAF6; --text-muted:#9EA4C6; --border:#262C4C; --accent:#8B93FF; --accent-fg:#0A0C16; --success:#4ADE80; --warning:#FCD34D; --danger:#FB7185;`

### Frost Sapphire — w duchu Plaid
Kiedy: jasny interfejs bankowy, chłodny błękit.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#2557D6; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`
Dark: `--bg:#0A101B; --surface:#131B29; --elevated:#E7EEF7; --text:#E7EEF9; --text-muted:#4E5C72; --border:#233246; --accent:#2557D6; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`

### Carbon Emerald — w duchu Ramp
Kiedy: ciemny KPI dashboard, akcent szmaragdowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#3DDC84; --accent-fg:#04160C; --success:#3DDC84; --warning:#F5B301; --danger:#EF5350;`
Dark: `--bg:#0C0F0D; --surface:#141917; --elevated:#1D2521; --text:#E9F1EC; --text-muted:#95A69C; --border:#28322C; --accent:#3DDC84; --accent-fg:#04160C; --success:#3DDC84; --warning:#F5B301; --danger:#EF5350;`


---

# 2. Agency / marketing
*Animails, Lyreco, landingi, kampanie*  ·  (9 palet)

### Plum Cream
Kiedy: aplikacje konsumenckie, społecznościowe, "z charakterem".
Light (domyślny): `--bg:#FDF9FB; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#2A1E28; --text-muted:#7C6E77; --border:#EFE2EB; --accent:#C0298A; --accent-fg:#FFFFFF; --success:#16A34A; --warning:#EA9A16; --danger:#E23B4E;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#C0298A; --accent-fg:#FFFFFF; --success:#16A34A; --warning:#EA9A16; --danger:#E23B4E;`

### Rose Quartz
Kiedy: beauty, lifestyle, delikatne produkty konsumenckie.
Light (domyślny): `--bg:#FCF7F8; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#2A2226; --text-muted:#7E6E75; --border:#F0E4E8; --accent:#D06A8C; --accent-fg:#FFFFFF; --success:#3F9E7C; --warning:#D69A2E; --danger:#D6485F;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#D06A8C; --accent-fg:#FFFFFF; --success:#3F9E7C; --warning:#D69A2E; --danger:#D6485F;`

### Blush Cocoa
Kiedy: kawiarnie, jedzenie, lifestyle; blush + kakao.
Light (domyślny): `--bg:#FBF6F3; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#291F1B; --text-muted:#7E6E66; --border:#EEE0D9; --accent:#9C5A44; --accent-fg:#FFFFFF; --success:#4F8A5B; --warning:#C08A2C; --danger:#BC5140;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#9C5A44; --accent-fg:#FFFFFF; --success:#4F8A5B; --warning:#C08A2C; --danger:#BC5140;`

### Signal Red
Kiedy: landing marketingowy, kampanie, pewny czerwony.
Light (domyślny): `--bg:#FCFCFC; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#171717; --text-muted:#6B6B6B; --border:#E7E7E7; --accent:#E23A2E; --accent-fg:#FFFFFF; --success:#1F9D57; --warning:#E0902A; --danger:#C42B22;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#E23A2E; --accent-fg:#FFFFFF; --success:#1F9D57; --warning:#E0902A; --danger:#C42B22;`

### Bubblegum Pop — w duchu Duolingo
Kiedy: jasna, wesoła aplikacja konsumencka, akcent malinowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#E63980; --accent-fg:#FFFFFF; --success:#3FA34D; --warning:#B45309; --danger:#D32F2F;`
Dark: `--bg:#140E12; --surface:#1E161B; --elevated:#F6E6EE; --text:#F3E8EE; --text-muted:#5F4E58; --border:#2D2028; --accent:#E63980; --accent-fg:#FFFFFF; --success:#3FA34D; --warning:#B45309; --danger:#D32F2F;`

### Citrus Punch — w duchu Gumroad
Kiedy: energetyczna marka, akcent pomarańczowo-cytrynowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#E8590C; --accent-fg:#FFFFFF; --success:#3FA34D; --warning:#B45309; --danger:#D32F2F;`
Dark: `--bg:#14120A; --surface:#1E1B10; --elevated:#F5ECD3; --text:#F2EDDD; --text-muted:#5D5638; --border:#2E2917; --accent:#E8590C; --accent-fg:#FFFFFF; --success:#3FA34D; --warning:#B45309; --danger:#D32F2F;`

### Grape Soda — w duchu Twitch
Kiedy: ciemna, młodzieżowa apka, akcent fioletowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#A970FF; --accent-fg:#12061F; --success:#4ADE80; --warning:#FCD34D; --danger:#FB7185;`
Dark: `--bg:#0E0A16; --surface:#181022; --elevated:#221830; --text:#EEE8F6; --text-muted:#A398B4; --border:#2C2140; --accent:#A970FF; --accent-fg:#12061F; --success:#4ADE80; --warning:#FCD34D; --danger:#FB7185;`

### Sky Candy — w duchu Cash App
Kiedy: jasna, przyjazna apka finansowo-konsumencka, akcent zielony.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#00A862; --accent-fg:#FFFFFF; --success:#00A862; --warning:#B45309; --danger:#D32F2F;`
Dark: `--bg:#09130D; --surface:#111D15; --elevated:#E2F0E6; --text:#E5F1E9; --text-muted:#4E6056; --border:#203127; --accent:#00A862; --accent-fg:#FFFFFF; --success:#00A862; --warning:#B45309; --danger:#D32F2F;`

### Coral Fizz — w duchu Airbnb
Kiedy: jasna marka lifestyle, akcent koralowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#E14B4B; --accent-fg:#FFFFFF; --success:#3FA34D; --warning:#B45309; --danger:#C0392B;`
Dark: `--bg:#150F0E; --surface:#1F1817; --elevated:#F6E4E1; --text:#F3E9E6; --text-muted:#5F504C; --border:#2E2422; --accent:#E14B4B; --accent-fg:#FFFFFF; --success:#3FA34D; --warning:#B45309; --danger:#C0392B;`


---

# 3. Blog / portal / editorial
*RAAI, Interia, blog Beezu, treść*  ·  (8 palet)

### Ink & Coral — w duchu Substack
Kiedy: blogi, czytelnie, landing z dużą ilością tekstu.
Light (domyślny): `--bg:#FBF8F4; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#211D1A; --text-muted:#7A716A; --border:#EAE3DA; --accent:#E85D45; --accent-fg:#FFFFFF; --success:#2F8F5B; --warning:#C08417; --danger:#C43D2E;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#E85D45; --accent-fg:#FFFFFF; --success:#2F8F5B; --warning:#C08417; --danger:#C43D2E;`

### Mustard Ink
Kiedy: wyrazisty editorial, magazyny, silne nagłówki.
Light (domyślny): `--bg:#FBFAF6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1917; --text-muted:#6F6B63; --border:#E8E5DC; --accent:#C99A2E; --accent-fg:#1A1917; --success:#3E7C5A; --warning:#C99A2E; --danger:#BE4632;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#C99A2E; --accent-fg:#1A1917; --success:#3E7C5A; --warning:#C99A2E; --danger:#BE4632;`

### Copper Dusk
Kiedy: ciemny editorial, magazyny; węgiel + miedź.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#C77E4A; --accent-fg:#14110F; --success:#5FA97E; --warning:#C77E4A; --danger:#D06B60;`
Dark: `--bg:#14110F; --surface:#1D1916; --elevated:#262019; --text:#ECE6DF; --text-muted:#A0968B; --border:#2B241E; --accent:#C77E4A; --accent-fg:#14110F; --success:#5FA97E; --warning:#C77E4A; --danger:#D06B60;`

### Newsprint Rust — w duchu The Verge
Kiedy: jasny portal treściowy, akcent rdzawy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#C0492B; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#B45309; --danger:#B02A1E;`
Dark: `--bg:#14110E; --surface:#1E1A15; --elevated:#EEE8DF; --text:#F1EBE2; --text-muted:#5C5348; --border:#2E2820; --accent:#C0492B; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#B45309; --danger:#B02A1E;`

### Ink Sepia — w duchu Medium
Kiedy: blog do czytania, ciepła sepia.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#3C6E71; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`
Dark: `--bg:#131210; --surface:#1D1B18; --elevated:#EAE4DB; --text:#EFEAE2; --text-muted:#5B564D; --border:#2C2823; --accent:#3C6E71; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`

### Charcoal Gold — w duchu Bloomberg
Kiedy: ciemny magazyn premium, akcent złoty.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#D4A537; --accent-fg:#1A1503; --success:#4ADE80; --warning:#FBBF24; --danger:#F87171;`
Dark: `--bg:#0E0D0B; --surface:#181613; --elevated:#22201B; --text:#F1EDE4; --text-muted:#A69E8D; --border:#2E2B24; --accent:#D4A537; --accent-fg:#1A1503; --success:#4ADE80; --warning:#FBBF24; --danger:#F87171;`

### Linen Burgundy — w duchu The Paris Review
Kiedy: literacki serwis, akcent burgund.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#7B2233; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#8E2434;`
Dark: `--bg:#141010; --surface:#1E1818; --elevated:#ECE4DC; --text:#F1E9E6; --text-muted:#5D5150; --border:#2D2422; --accent:#7B2233; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#8E2434;`

### Slate Editorial — w duchu The Atlantic
Kiedy: ciemny serwis eseistyczny, akcent stalowo-niebieski.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#5B9CD6; --accent-fg:#04141F; --success:#4ADE80; --warning:#FBBF24; --danger:#F87171;`
Dark: `--bg:#0D0F12; --surface:#171A1F; --elevated:#20242B; --text:#E8EBEF; --text-muted:#98A1AD; --border:#282D35; --accent:#5B9CD6; --accent-fg:#04141F; --success:#4ADE80; --warning:#FBBF24; --danger:#F87171;`


---

# 4. SaaS / produkt / narzędzie
*Emailo, Lyra, detektor-ai*  ·  (10 palet)

### Slate Violet — w duchu Linear
Kiedy: task/project management, czyste SaaS.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#7C5CFF; --accent-fg:#FFFFFF; --success:#10B981; --warning:#F59E0B; --danger:#EF4444;`
Dark: `--bg:#0E0F14; --surface:#181A22; --elevated:#FFFFFF; --text:#E7E8EE; --text-muted:#6C7180; --border:#262A35; --accent:#7C5CFF; --accent-fg:#FFFFFF; --success:#10B981; --warning:#F59E0B; --danger:#EF4444;`

### Nordic Frost
Kiedy: czyste SaaS, chłodny i przewiewny klimat.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#2563EB; --accent-fg:#FFFFFF; --success:#15803D; --warning:#B45309; --danger:#B91C1C;`
Dark: `--bg:#0D1116; --surface:#161B22; --elevated:#FFFFFF; --text:#E6EBF1; --text-muted:#5E6B78; --border:#232A33; --accent:#2563EB; --accent-fg:#FFFFFF; --success:#15803D; --warning:#B45309; --danger:#B91C1C;`

### Clay & Denim
Kiedy: ciepły, ludzki SaaS; glina + denim.
Light (domyślny): `--bg:#FAF7F4; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#22201D; --text-muted:#736D66; --border:#E9E3DC; --accent:#3E6B99; --accent-fg:#FFFFFF; --success:#3E8C63; --warning:#C08A2C; --danger:#BB5140;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#3E6B99; --accent-fg:#FFFFFF; --success:#3E8C63; --warning:#C08A2C; --danger:#BB5140;`

### Iris Mist
Kiedy: delikatny, spokojny SaaS; lawendowa szarość + iris.
Light (domyślny): `--bg:#F9F9FC; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1E1F2A; --text-muted:#6A6C7E; --border:#E7E7F0; --accent:#5B5BD6; --accent-fg:#FFFFFF; --success:#10B981; --warning:#F59E0B; --danger:#EF4444;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#5B5BD6; --accent-fg:#FFFFFF; --success:#10B981; --warning:#F59E0B; --danger:#EF4444;`

### Arctic Lime
Kiedy: świeży, energetyczny produkt tech; chłodne tło + zielony pop.
Light (domyślny): `--bg:#F6FAF8; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#14201B; --text-muted:#5E6E67; --border:#E0EAE5; --accent:#57A83A; --accent-fg:#FFFFFF; --success:#57A83A; --warning:#C08A2C; --danger:#C24B3C;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#57A83A; --accent-fg:#FFFFFF; --success:#57A83A; --warning:#C08A2C; --danger:#C24B3C;`

### Violet Mist — w duchu Linear
Kiedy: jasny SaaS z fioletowym akcentem.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#6D4AFF; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`
Dark: `--bg:#0D0B17; --surface:#161327; --elevated:#EFEFF6; --text:#ECE9F6; --text-muted:#5C5670; --border:#282341; --accent:#6D4AFF; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`

### Nightshade Cyan — w duchu Linear dark
Kiedy: ciemny produkt SaaS, akcent cyjan.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#22D3EE; --accent-fg:#04222A; --success:#34D399; --warning:#FBBF24; --danger:#F87171;`
Dark: `--bg:#0B0E14; --surface:#141922; --elevated:#1D2431; --text:#E5ECF4; --text-muted:#93A0B2; --border:#242E3C; --accent:#22D3EE; --accent-fg:#04222A; --success:#34D399; --warning:#FBBF24; --danger:#F87171;`

### Cloud Iris — w duchu Notion
Kiedy: jasny, spokojny workspace z dużą ilością tekstu.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#4C63D2; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`
Dark: `--bg:#0E0F12; --surface:#17191D; --elevated:#EEF0F3; --text:#E9EBEF; --text-muted:#5A5F68; --border:#282B31; --accent:#4C63D2; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`

### Aubergine Glow — w duchu Superhuman
Kiedy: ciemny, elegancki produkt z akcentem magenta.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#E15FCB; --accent-fg:#160312; --success:#4ADE80; --warning:#FCD34D; --danger:#FB7185;`
Dark: `--bg:#100A14; --surface:#1A1220; --elevated:#241830; --text:#F0E9F4; --text-muted:#A79BB0; --border:#2E2338; --accent:#E15FCB; --accent-fg:#160312; --success:#4ADE80; --warning:#FCD34D; --danger:#FB7185;`

### Paper Cobalt — w duchu Height
Kiedy: jasny, techniczny SaaS, akcent kobaltowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#1E5EFF; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`
Dark: `--bg:#0A0D13; --surface:#131822; --elevated:#EAEEF3; --text:#E7ECF4; --text-muted:#515C6B; --border:#232C39; --accent:#1E5EFF; --accent-fg:#FFFFFF; --success:#0E9F6E; --warning:#B45309; --danger:#C81E1E;`


---

# 5. Ecommerce
*Beezu - premium, sklep*  ·  (8 palet)

### Bone & Oxblood
Kiedy: moda, produkty luksusowe, "drogo i pewnie".
Light (domyślny): `--bg:#F6F4F1; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1C1917; --text-muted:#78716C; --border:#E7E2DC; --accent:#7B2D26; --accent-fg:#FFFFFF; --success:#3E7C5A; --warning:#B07D2A; --danger:#A33A30;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#A97671; --accent-fg:#FFFFFF; --success:#3E7C5A; --warning:#B07D2A; --danger:#A33A30;`

### Aubergine
Kiedy: luksus, premium dark, biluteria, produkty ekskluzywne.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#C9A24B; --accent-fg:#14101A; --success:#5FA97E; --warning:#C9A24B; --danger:#D06B66;`
Dark: `--bg:#14101A; --surface:#1E1826; --elevated:#271F30; --text:#ECE6F0; --text-muted:#9D93A6; --border:#2C2436; --accent:#C9A24B; --accent-fg:#14101A; --success:#5FA97E; --warning:#C9A24B; --danger:#D06B66;`

### Pine Cream
Kiedy: naturalne premium; krem + głęboka sosna.
Light (domyślny): `--bg:#F6F5EE; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1B241E; --text-muted:#66705E; --border:#E5E6D8; --accent:#285E43; --accent-fg:#FFFFFF; --success:#285E43; --warning:#B58324; --danger:#B0473A;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#739684; --accent-fg:#FFFFFF; --success:#285E43; --warning:#B58324; --danger:#B0473A;`

### Champagne Noir — w duchu Aesop
Kiedy: ciemny sklep premium, akcent szampański.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#C9A96A; --accent-fg:#181206; --success:#4ADE80; --warning:#FBBF24; --danger:#F0857A;`
Dark: `--bg:#0F0E0C; --surface:#1A1815; --elevated:#24211C; --text:#F2EEE6; --text-muted:#A89F90; --border:#2F2B24; --accent:#C9A96A; --accent-fg:#181206; --success:#4ADE80; --warning:#FBBF24; --danger:#F0857A;`

### Blush Bronze — w duchu Glossier
Kiedy: jasny sklep beauty, akcent brąz/róż.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#B06B52; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`
Dark: `--bg:#15100F; --surface:#1F1917; --elevated:#F1E6E3; --text:#F3EAE6; --text-muted:#5F524E; --border:#2E2521; --accent:#B06B52; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`

### Ivory Sage — w duchu The Row
Kiedy: minimalistyczny luksus, akcent szałwiowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#5C7356; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`
Dark: `--bg:#101210; --surface:#191C18; --elevated:#EAECE4; --text:#EAEDE6; --text-muted:#565A50; --border:#282C25; --accent:#5C7356; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`

### Obsidian Rose — w duchu SSENSE
Kiedy: ciemny modowy sklep, akcent różany.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#E0708C; --accent-fg:#1B040C; --success:#4ADE80; --warning:#FBBF24; --danger:#FB7185;`
Dark: `--bg:#0C0A0B; --surface:#161314; --elevated:#201B1D; --text:#F0EAEC; --text-muted:#A5989C; --border:#2C2528; --accent:#E0708C; --accent-fg:#1B040C; --success:#4ADE80; --warning:#FBBF24; --danger:#FB7185;`

### Pearl Merlot — w duchu Net-a-Porter
Kiedy: jasny luksus, akcent merlot.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#6E2438; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#8E2434;`
Dark: `--bg:#130F10; --surface:#1D1719; --elevated:#EDE4E5; --text:#F1E9EA; --text-muted:#5D5153; --border:#2C2325; --accent:#6E2438; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#8E2434;`


---

# 6. Personal brand / portfolio
*arturdabrowski.pl - ekspert*  ·  (5 palet)

### Terracotta Studio
Kiedy: portfolio, studia kreatywne, ciepło i charakter.
Light (domyślny): `--bg:#FBF6F1; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#2B211B; --text-muted:#7C6C60; --border:#ECE0D5; --accent:#C25A34; --accent-fg:#FFFFFF; --success:#4F8A5B; --warning:#B98526; --danger:#B24A32;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#C25A34; --accent-fg:#FFFFFF; --success:#4F8A5B; --warning:#B98526; --danger:#B24A32;`

### Autor — w duchu redakcyjnej powagi
Kiedy: strona-wizytowka autora/eksperta, ciepła powaga, jeden mocny akcent.
Light (domyślny): `--bg:#F8F5F0; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1B1815; --text-muted:#6E665C; --border:#E7E0D6; --accent:#B5462B; --accent-fg:#FFFFFF; --success:#3E7C5A; --warning:#B07D2A; --danger:#B23A2C;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#B5462B; --accent-fg:#FFFFFF; --success:#3E7C5A; --warning:#B07D2A; --danger:#B23A2C;`

### Ekspert Noir — dark premium, tech-credible
Kiedy: ciemna strona eksperta AI/tech, premium, złoty akcent zamiast neonu.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#E8B04B; --accent-fg:#0D0E11; --success:#4ADE80; --warning:#E8B04B; --danger:#F26D6D;`
Dark: `--bg:#0D0E11; --surface:#16181D; --elevated:#1E2128; --text:#ECEDF1; --text-muted:#969CA8; --border:#262A32; --accent:#E8B04B; --accent-fg:#0D0E11; --success:#4ADE80; --warning:#E8B04B; --danger:#F26D6D;`

### Sygnatura — minimal mono + mocny akcent
Kiedy: pewny minimalizm, jeden zdecydowany akcent indygo, dużo bieli.
Light (domyślny): `--bg:#FBFBFA; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#18181A; --text-muted:#6B6B70; --border:#E7E7E4; --accent:#5A45E0; --accent-fg:#FFFFFF; --success:#16A34A; --warning:#C58A1E; --danger:#DC3B3B;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#5A45E0; --accent-fg:#FFFFFF; --success:#16A34A; --warning:#C58A1E; --danger:#DC3B3B;`

### Studio Ink — ciepły neutralny + głęboki teal
Kiedy: przystępny ekspert, spokojny i rzeczowy, głęboki teal jako podpis.
Light (domyślny): `--bg:#F6F6F3; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#17201F; --text-muted:#626C6A; --border:#E4E5DF; --accent:#147D6F; --accent-fg:#FFFFFF; --success:#147D6F; --warning:#B5842A; --danger:#B44A3E;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#147D6F; --accent-fg:#FFFFFF; --success:#147D6F; --warning:#B5842A; --danger:#B44A3E;`


---

# 7. Rezerwa (nowe / nietypowe)
*wellness, developer, B2B, natura, travel, gaming*  ·  (28 palet)


## Gaming / esport (czyste)

### Arena Slate — czysty esport dark
Kiedy: gaming/esport bez neonowego cyrku - ciemny, ostry, jeden pewny akcent (Pulsar).
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#4F8CFF; --accent-fg:#04101F; --success:#37C489; --warning:#F5A524; --danger:#F26D6D;`
Dark: `--bg:#0C0E13; --surface:#141822; --elevated:#1C212E; --text:#E7EBF2; --text-muted:#8B93A3; --border:#232936; --accent:#4F8CFF; --accent-fg:#04101F; --success:#37C489; --warning:#F5A524; --danger:#F26D6D;`

### Neon Restraint — stonowany fiolet
Kiedy: gamingowy charakter, ale stonowany - jeden fiolet, nie tęcza.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#8B5CF6; --accent-fg:#FFFFFF; --success:#34D399; --warning:#FBBF24; --danger:#FB7185;`
Dark: `--bg:#0B0B12; --surface:#14141F; --elevated:#1C1C2B; --text:#E9E7F2; --text-muted:#928FA6; --border:#242436; --accent:#8B5CF6; --accent-fg:#FFFFFF; --success:#34D399; --warning:#FBBF24; --danger:#FB7185;`

### Pixel Mono — jasny, czysty gaming/tech
Kiedy: gaming/tech, ale jasny i uporządkowany - gdy gaming ma byc ogarnięty, nie mroczny.
Light (domyślny): `--bg:#F7F8FA; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#14161C; --text-muted:#5D6472; --border:#E4E7EC; --accent:#3B5BDB; --accent-fg:#FFFFFF; --success:#2F9E44; --warning:#C58A1E; --danger:#E03131;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#3B5BDB; --accent-fg:#FFFFFF; --success:#2F9E44; --warning:#C58A1E; --danger:#E03131;`


## Wellness / zdrowie

### Sage Calm
Kiedy: zdrowie, medytacja, wellness.
Light (domyślny): `--bg:#F5F7F4; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1F2A24; --text-muted:#67766D; --border:#E1E8E2; --accent:#3F9E7C; --accent-fg:#FFFFFF; --success:#3F9E7C; --warning:#C79A3C; --danger:#C85A54;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#3F9E7C; --accent-fg:#FFFFFF; --success:#3F9E7C; --warning:#C79A3C; --danger:#C85A54;`

### Butter Sage
Kiedy: jedzenie, wellness, ciepły i miękki klimat.
Light (domyślny): `--bg:#FAF8EF; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#262619; --text-muted:#71715C; --border:#E9E7D3; --accent:#6B8E4E; --accent-fg:#FFFFFF; --success:#6B8E4E; --warning:#C29A2E; --danger:#C05B44;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#6B8E4E; --accent-fg:#FFFFFF; --success:#6B8E4E; --warning:#C29A2E; --danger:#C05B44;`

### Glacier
Kiedy: medyczne, kliniczne, czystość i spokój.
Light (domyślny): `--bg:#F5F9FB; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#16232B; --text-muted:#5C6E78; --border:#DFE9EE; --accent:#0E86C4; --accent-fg:#FFFFFF; --success:#128A6E; --warning:#B77A18; --danger:#C24438;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#0E86C4; --accent-fg:#FFFFFF; --success:#128A6E; --warning:#B77A18; --danger:#C24438;`

### Eucalyptus Calm — w duchu Calm
Kiedy: jasna aplikacja dobrostanu, akcent eukaliptusowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#2E8B7D; --accent-fg:#FFFFFF; --success:#2E8B7D; --warning:#B45309; --danger:#C0392B;`
Dark: `--bg:#0A1310; --surface:#121D18; --elevated:#E4EEE9; --text:#E4F0EB; --text-muted:#4E5F58; --border:#213029; --accent:#2E8B7D; --accent-fg:#FFFFFF; --success:#2E8B7D; --warning:#B45309; --danger:#C0392B;`

### Aqua Serene — w duchu Headspace
Kiedy: przyjazny, spokojny UI zdrowotny, akcent akwamaryn.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#1C88A8; --accent-fg:#FFFFFF; --success:#2E8B7D; --warning:#B45309; --danger:#C0392B;`
Dark: `--bg:#08131A; --surface:#101D25; --elevated:#E2EEF3; --text:#E1EEF4; --text-muted:#4C5E68; --border:#1F3039; --accent:#1C88A8; --accent-fg:#FFFFFF; --success:#2E8B7D; --warning:#B45309; --danger:#C0392B;`

### Warm Oat — w duchu Headspace warm
Kiedy: ciepłe, przyjazne treści zdrowotne, akcent terakota.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#C46A46; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`
Dark: `--bg:#14110C; --surface:#1E1A13; --elevated:#ECE3D6; --text:#F1EADD; --text-muted:#5E5445; --border:#2D2619; --accent:#C46A46; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`

### Deep Forest Wellness — w duchu Whoop
Kiedy: ciemna aplikacja zdrowotna/fitness, akcent limonkowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#8BD450; --accent-fg:#08160B; --success:#8BD450; --warning:#FBBF24; --danger:#F87171;`
Dark: `--bg:#0A0F0C; --surface:#121A15; --elevated:#1B261F; --text:#E7F1EA; --text-muted:#93A599; --border:#26332B; --accent:#8BD450; --accent-fg:#08160B; --success:#8BD450; --warning:#FBBF24; --danger:#F87171;`

### Lavender Rest — w duchu aplikacji snu
Kiedy: aplikacje snu, delikatny akcent lawendowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#6A5AB8; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`
Dark: `--bg:#0D0B14; --surface:#16131F; --elevated:#E9E6F4; --text:#EBE7F5; --text-muted:#575170; --border:#272238; --accent:#6A5AB8; --accent-fg:#FFFFFF; --success:#3F7D4E; --warning:#9A6700; --danger:#B02A1E;`


## Developer / techniczne

### Graphite Lime — w duchu Vercel
Kiedy: narzędzia dla programistów, panele techniczne.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#A3E635; --accent-fg:#0C0D0F; --success:#34D399; --warning:#FBBF24; --danger:#F87171;`
Dark: `--bg:#0C0D0F; --surface:#15171A; --elevated:#1D2024; --text:#E8EAED; --text-muted:#9AA0A6; --border:#262A2F; --accent:#A3E635; --accent-fg:#0C0D0F; --success:#34D399; --warning:#FBBF24; --danger:#F87171;`

### Electric Noir
Kiedy: narzędzia dev z mocnym, elektrycznym akcentem.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#22D3EE; --accent-fg:#06272C; --success:#34D399; --warning:#FBBF24; --danger:#FB7185;`
Dark: `--bg:#0A0B0D; --surface:#131519; --elevated:#1B1E24; --text:#E9ECF1; --text-muted:#969DA8; --border:#23272E; --accent:#22D3EE; --accent-fg:#06272C; --success:#34D399; --warning:#FBBF24; --danger:#FB7185;`

### Terminal Green — w duchu Railway
Kiedy: ciemna konsola/CLI, akcent neonowo-zielony.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#4ADE6A; --accent-fg:#04160A; --success:#4ADE6A; --warning:#FBBF24; --danger:#F87171;`
Dark: `--bg:#0A0C0A; --surface:#111511; --elevated:#191F19; --text:#E6F0E6; --text-muted:#93A393; --border:#232B23; --accent:#4ADE6A; --accent-fg:#04160A; --success:#4ADE6A; --warning:#FBBF24; --danger:#F87171;`

### Monokai Slate — w duchu VS Code
Kiedy: ciemne IDE/dashboard, akcent różowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#FF6188; --accent-fg:#1A0510; --success:#A9DC76; --warning:#FFD866; --danger:#FF6188;`
Dark: `--bg:#101014; --surface:#191920; --elevated:#22222B; --text:#ECECEF; --text-muted:#9A9AA6; --border:#2A2A34; --accent:#FF6188; --accent-fg:#1A0510; --success:#A9DC76; --warning:#FFD866; --danger:#FF6188;`

### Blueprint Light — w duchu GitHub light
Kiedy: jasne docs techniczne, akcent niebieski.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#1F6FEB; --accent-fg:#FFFFFF; --success:#1A7F37; --warning:#9A6700; --danger:#CF222E;`
Dark: `--bg:#0A0D12; --surface:#131820; --elevated:#EBEFF4; --text:#E7ECF3; --text-muted:#515C6B; --border:#232C38; --accent:#1F6FEB; --accent-fg:#FFFFFF; --success:#1A7F37; --warning:#9A6700; --danger:#CF222E;`

### Amber CRT — w duchu retro terminal
Kiedy: ciemny, retro-tech motyw, akcent bursztynowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#F5A623; --accent-fg:#1A1203; --success:#8BD450; --warning:#F5A623; --danger:#F0857A;`
Dark: `--bg:#0C0A07; --surface:#16130D; --elevated:#201B12; --text:#F0E9D9; --text-muted:#A69C85; --border:#2C2619; --accent:#F5A623; --accent-fg:#1A1203; --success:#8BD450; --warning:#F5A623; --danger:#F0857A;`

### Cobalt Console — w duchu Fly.io
Kiedy: ciemny dashboard infra, akcent kobaltowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#5A8DFF; --accent-fg:#04122B; --success:#34D399; --warning:#FBBF24; --danger:#F87171;`
Dark: `--bg:#0A0D14; --surface:#131824; --elevated:#1C2333; --text:#E6ECF6; --text-muted:#95A2B6; --border:#252E40; --accent:#5A8DFF; --accent-fg:#04122B; --success:#34D399; --warning:#FBBF24; --danger:#F87171;`


## Korporacyjne / B2B

### Cobalt Snow
Kiedy: B2B, korporacja, porządek i czytelność.
Light (domyślny): `--bg:#F8FAFC; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#0F172A; --text-muted:#64748B; --border:#E2E8F0; --accent:#1D4ED8; --accent-fg:#FFFFFF; --success:#15803D; --warning:#B45309; --danger:#B91C1C;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#6C8BE5; --accent-fg:#FFFFFF; --success:#15803D; --warning:#B45309; --danger:#B91C1C;`

### Teal Slate
Kiedy: nowoczesne B2B; slate + głęboki teal.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#0F766E; --accent-fg:#FFFFFF; --success:#15803D; --warning:#B45309; --danger:#B4342A;`
Dark: `--bg:#0C1413; --surface:#14201E; --elevated:#FFFFFF; --text:#E4EDEB; --text-muted:#5F6E6B; --border:#213330; --accent:#0F766E; --accent-fg:#FFFFFF; --success:#15803D; --warning:#B45309; --danger:#B4342A;`

### Navy Trust — w duchu IBM
Kiedy: jasna strona korporacyjna, akcent granatowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#1B3A8B; --accent-fg:#FFFFFF; --success:#1A7F37; --warning:#9A6700; --danger:#B02A1E;`
Dark: `--bg:#0A0D13; --surface:#131822; --elevated:#EAEEF3; --text:#E7EBF2; --text-muted:#4F5866; --border:#232B38; --accent:#1B3A8B; --accent-fg:#FFFFFF; --success:#1A7F37; --warning:#9A6700; --danger:#B02A1E;`

### Graphite Corporate — w duchu McKinsey
Kiedy: ciemna, powściągliwa strona doradcza, akcent stalowy.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#4E9AE0; --accent-fg:#041420; --success:#4ADE80; --warning:#FBBF24; --danger:#F87171;`
Dark: `--bg:#0E0F11; --surface:#171A1D; --elevated:#20242A; --text:#E9EBEE; --text-muted:#98A0AA; --border:#282D34; --accent:#4E9AE0; --accent-fg:#041420; --success:#4ADE80; --warning:#FBBF24; --danger:#F87171;`

### Slate Sky B2B — w duchu SAP
Kiedy: jasny enterprise UI, akcent niebieski.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#0A6ED1; --accent-fg:#FFFFFF; --success:#1A7F37; --warning:#9A6700; --danger:#B02A1E;`
Dark: `--bg:#0A0E14; --surface:#131923; --elevated:#E8EDF2; --text:#E6ECF3; --text-muted:#505B69; --border:#232D3A; --accent:#0A6ED1; --accent-fg:#FFFFFF; --success:#1A7F37; --warning:#9A6700; --danger:#B02A1E;`

### Bordeaux Executive — w duchu Deloitte
Kiedy: ciemna, prestiżowa strona usług profesjonalnych, akcent bordo.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#B23A48; --accent-fg:#FFFFFF; --success:#4ADE80; --warning:#FBBF24; --danger:#F0857A;`
Dark: `--bg:#0F0C0D; --surface:#191315; --elevated:#221A1D; --text:#F0EAEB; --text-muted:#A5989B; --border:#2D2427; --accent:#B23A48; --accent-fg:#FFFFFF; --success:#4ADE80; --warning:#FBBF24; --danger:#F0857A;`

### Teal Enterprise — w duchu HubSpot
Kiedy: jasny B2B marketing, akcent morski.
Light (domyślny): `--bg:#F8F8F6; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1A1A18; --text-muted:#6B6B64; --border:#E6E6E1; --accent:#0F7C86; --accent-fg:#FFFFFF; --success:#1A7F37; --warning:#9A6700; --danger:#B02A1E;`
Dark: `--bg:#081314; --surface:#111E1F; --elevated:#E5F0F0; --text:#E4F0F0; --text-muted:#4C5E60; --border:#203233; --accent:#0F7C86; --accent-fg:#FFFFFF; --success:#1A7F37; --warning:#9A6700; --danger:#B02A1E;`


## Natura / eco

### Forest Paper
Kiedy: eko, outdoor, jedzenie; papier + zieleń lasu.
Light (domyślny): `--bg:#F5F5EE; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1E241C; --text-muted:#6B7264; --border:#E4E6DA; --accent:#2F6E3B; --accent-fg:#FFFFFF; --success:#2F6E3B; --warning:#B58324; --danger:#B54536;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#77A07F; --accent-fg:#FFFFFF; --success:#2F6E3B; --warning:#B58324; --danger:#B54536;`

### Meadow
Kiedy: eko, outdoor, natura; świeża trawiasta zieleń.
Light (domyślny): `--bg:#F6F8F1; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#1F2818; --text-muted:#667059; --border:#E4EAD7; --accent:#4E9A3E; --accent-fg:#FFFFFF; --success:#4E9A3E; --warning:#BE9226; --danger:#BE4E3C;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#4E9A3E; --accent-fg:#FFFFFF; --success:#4E9A3E; --warning:#BE9226; --danger:#BE4E3C;`


## Travel / hospitality

### Sand Dune
Kiedy: podróże, hotele, ciepły piasek + spokojny błękit.
Light (domyślny): `--bg:#FAF6EF; --surface:#FFFFFF; --elevated:#FFFFFF; --text:#26211A; --text-muted:#7A7062; --border:#EBE3D4; --accent:#2E7DA6; --accent-fg:#FFFFFF; --success:#3F8A5F; --warning:#C68A26; --danger:#C0563E;`
Dark: `--bg:#0E0F12; --surface:#171A1F; --elevated:#1F232A; --text:#ECECE9; --text-muted:#969A9F; --border:#262A31; --accent:#2E7DA6; --accent-fg:#FFFFFF; --success:#3F8A5F; --warning:#C68A26; --danger:#C0563E;`
