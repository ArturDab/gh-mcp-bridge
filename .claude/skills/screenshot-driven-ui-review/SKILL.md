---
name: screenshot-driven-ui-review
description: Obowiązkowa pętla weryfikacji wizualnej dla KAŻDEJ zmiany UI. Wczytuj zawsze, gdy zmieniasz interfejs. Claude nie oddaje UI, którego sam nie wyrenderował, nie obejrzał i nie poprawił. To nie jest opcja ani krok końcowy do pominięcia.
---

# Screenshot-Driven UI Review

Zasada nadrzędna: **nie oddawaj Arturowi UI, którego sam wcześniej nie zobaczyłeś i nie poprawiłeś.** Claude projektuje brzydko głównie dlatego, że pracuje na ślepo - zmienia kod i oddaje, nie patrząc na render. Ta pętla to zamyka. Jest obowiązkowa dla każdej zmiany interfejsu, zanim cokolwiek trafi do Artura albo do PR.

## Przeglądarka: preflight (zanim powiesz "nie mam przeglądarki")

Nie zgaduj i nie dyskutuj - wykonaj preflight. Jest deterministyczny i kończy się albo "gotowe", albo dokładną instrukcją odblokowania.

Najpewniej (gotowy skrypt, leży obok tego skilla w `references/`):
`bash .claude/skills/screenshot-driven-ui-review/references/preflight.sh`
(w repo źródłowym ścieżka to `plugins/artur/skills/...`).

Równoważnie, inline, jeśli nie chcesz szukać pliku:
```bash
npx --yes playwright install chromium
node -e '(async()=>{const{chromium}=require("playwright");try{const b=await chromium.launch();const p=await b.newPage();await p.setContent("<h1>ok</h1>");await b.close();console.log("BROWSER OK")}catch(e){console.log("BROWSER FAIL: "+e.message);process.exit(1)}})()'
```

- Wynik OK / kod 0 → przeglądarka działa, renderuj.
- Wynik FAIL / kod !=0 → to jest problem **środowiska** (instalacja albo sieć), nie Twojej niewiedzy ani decyzji. Nie kończ na "nie mam Chromium". Przekaż Arturowi dokładnie to:
  > Odblokowanie w Claude Code on the web: claude.ai/code → selektor środowiska → Edit.
  > 1) Network access: **Full** (albo **Custom** + host pobierania Playwrighta i audytowana domena).
  > 2) Setup script:
  >    `export PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright`
  >    `npx --yes playwright install --with-deps chromium || true`
  > 3) Environment variables: `PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright`
  > Zmiana setup scriptu/sieci przebudowuje snapshot, więc instalacja wejdzie do każdej kolejnej sesji.

  Dopiero potem oceniaj z kodu/markupu i **wyraźnie oznacz, że nie było weryfikacji wizualnej**. Albo render działa, albo masz dla Artura gotową instrukcję, co kliknąć - nigdy samo "nie da się".

## Co renderować

Render musi być wierny. Gdy strona jest serwerowa (treść wstrzykiwana, zależności od API, ścieżki absolutne), renderuj **uruchomioną aplikację** (`npm run dev`), nie surowy plik - inaczej oglądasz pustą skorupę. Statyczny plik renderuj tylko, gdy strona jest samodzielna (inline CSS, względne ścieżki do assetów). Preferuj render lokalny (dev server / build / plik) nad żywą stroną zewnętrzną - lokalny nie wymaga szerokiej sieci. Po stronę zewnętrzną sięgaj tylko, gdy to jest cel audytu (wtedy potrzebny Network Full/Custom). W razie wątpliwości uruchom aplikację.

## Higiena zrzutu (inaczej screenshoty kłamią)

- Stały viewport i skala: helper robi desktop 1440 i mobile 390 z `deviceScaleFactor: 2`; pozostałe szerokości z checklisty dorzuć sam.
- Wyłącz animacje i tranzycje, ukryj caret - inaczej co zrzut to inny kadr (helper robi to sam).
- Czekaj na **stan**, nie na czas: `networkidle` albo konkretny selektor. Nigdy `sleep`.
- Przy błędzie lub regresji rób zrzut **najpierw**, zanim cokolwiek retryujesz.
- Dla modala/karty/sekcji rób zrzut elementu, nie całego viewportu.
- Niestabilne fragmenty (daty, losowe dane, reklamy) maskuj, żeby porównania miały sens.
- Gotowy helper: `node .claude/skills/screenshot-driven-ui-review/references/shot.mjs <url|plik.html> [outdir]` - desktop+mobile, animacje off, czekanie na sieć, zwraca ścieżki. Rozszerzaj o stany i pozostałe szerokości.

## Pętla (wykonujesz ją SAM, zanim oddasz)

1. Zbuduj zmianę.
2. Preflight przeglądarki (wyżej), potem właściwy render.
3. Zrób screenshot na 1440, 1024, 768, 390 px. Dla zmienionego ekranu sprawdź osobno stany: domyślny, hover, focus, loading, empty, error, success; otwórz modale i menu.
4. **Obejrzyj screenshoty własnymi oczami** i oceń krytycznie wg checklisty niżej. Bądź swoim najostrzejszym recenzentem, nie życzliwym.
5. Jeśli cokolwiek wygląda jak MVP, jest niespójne, ciasne, połamane albo generyczne - popraw i wróć do kroku 1.
6. Pętlę powtarzasz, aż render przejdzie checklistę. Dopiero wtedy oddajesz - i w odpowiedzi dołączasz screenshoty wersji finalnej, nie wersji roboczej.

Nie kończ na pierwszej wersji. Jedna iteracja to za mało; realny standard to zwykle 2-4 przejścia.

## Checklista (każdy punkt musi przejść)

- hierarchia jasna w 5 sekund; jedna oczywista akcja główna
- spacing spójny, czytelny rytm sekcji, brak ciasnoty i chaosu
- typografia: skala i waga budują hierarchię, nie przypadek
- kontrast i czytelność; focus widoczny
- responsywność: brak overflow, przyciętego tekstu, połamanych gridów, ciasnych pól na mobile
- mobile - cele dotykowe: główne akcje min ~44x44px z odstępami; nic klikalnego nie jest za małe ani sklejone
- mobile - brak afordancji tylko-hover: na dotyku nie ma najechania, więc menu/tooltipy/akcje muszą działać na tap
- mobile - zasięg kciuka: główne CTA w dolnej/środkowej strefie ekranu, nie wciśnięte w górne rogi
- mobile - viewport i klawiatury: meta viewport width=device-width; pola mają właściwy typ/inputmode (liczby, email, tel) wyzwalający odpowiednią klawiaturę
- stany obsłużone: empty/loading/error/success nie wyglądają jak zapomniane
- spójność: te same elementy wyglądają tak samo na różnych ekranach
- animacje i przejścia spokojne, celowe, nie rozpraszają
- test wiarygodności: czy ten ekran wyglądałby dobrze w poście o premierze produktu

## Zasady

- tokeny jako jedyne źródło prawdy; nigdy hardkodowane hex
- zero emoji, ikony Lucide; light mode domyślnie
- jeśli render jest naprawdę niedostępny po preflighcie, powiedz to wprost wraz z instrukcją odblokowania środowiska, oprzyj ocenę na kodzie i ZAZNACZ, że nie zweryfikowałeś wizualnie - nie udawaj, że pętla przeszła
- po ustaleniu nowych reguł wizualnych zaktualizuj docs/VISUAL_DIRECTION.md
- wizualna regresja (porównanie ze wzorcem) i Lighthouse dodatkowo lecą w CI; rdzeń pętli robisz w sesji, zanim oddasz

## Definicja ukończenia zadania UI

Zadanie nad interfejsem NIE jest skończone, dopóki: render obejrzany na 4 szerokościach, wszystkie stany sprawdzone, checklista przeszła, ewentualne poprawki wprowadzone, screenshoty finalne dołączone do odpowiedzi. Bez tego nie raportuj UI jako gotowego.
