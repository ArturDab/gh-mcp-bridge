---
description: "Odpala obowiązkową pętlę wizualną na bieżącym UI: render, ocena, poprawki, screenshoty"
argument-hint: "[opcjonalnie: który ekran/flow]"
---

# Visual Check

**Tryb: tylko `audit`.** Jeśli `CCOS_MODE` jest inny, odpowiedz jednym zdaniem, że ta komenda działa w środowisku Audit, i nie wykonuj jej.


Uruchom pętlę screenshot-driven-ui-review (skill o tej nazwie) na bieżącym interfejsie. Zakres: $ARGUMENTS (domyślnie zmienione ekrany).

Wykonaj pętlę do końca, sam: render → screenshot na 1440/1024/768/390 → sprawdź stany (empty/loading/error/success, hover/focus, modale) → oceń krytycznie wg checklisty → popraw → powtórz, aż przejdzie. Tokeny zamiast hardkodów, zero emoji, light mode.

Oddaj dopiero wersję po pętli, ze screenshotami finalnymi i krótką notą, co poprawiłeś i dlaczego. Jeśli render niedostępny, powiedz wprost i nie udawaj, że pętla przeszła.

## Tryb mobilny (argument "mobile" albo "telefon")

Wersja mobilna rozjeżdża się częściej niż desktopowa, bo powstaje jako refleksja po fakcie. Gdy $ARGUMENTS wskazuje na telefon/mobile, rozszerz pętlę: dodaj szerokość **360** (mały telefon) do standardowego zestawu, i przejdź **każdy** punkt poniżej dla każdego ekranu, nie wybiórczo:

**Układ:** czy cokolwiek wychodzi poza ekran (poziomy pasek przewijania to zawsze błąd), czy tekst się nie łamie w brzydkich miejscach, czy siatka przechodzi na jedną kolumnę, czy odstępy nie są desktopowe, czy obrazy się skalują bez przycinania w losowym miejscu.

**Dotyk:** czy każdy klikalny element ma co najmniej 44×44 px pola dotyku, czy elementy klikalne nie są zbyt blisko siebie, czy nie ma funkcji dostępnej tylko przez najechanie kursorem, czy przewijanie działa tam, gdzie treść nie mieści się w kontenerze.

**Nawigacja:** czy menu ma wersję mobilną i da się je zamknąć, czy da się wrócić z każdego ekranu, czy modale i panele boczne mieszczą się i dają się zamknąć.

**Formularze:** czy klawiatura nie zasłania pola, które się wypełnia, czy pola mają właściwy typ klawiatury (`type="email"`, `type="tel"`, `inputmode`), czy komunikaty błędów są widoczne bez przewijania, czy przycisk zatwierdzenia jest w zasięgu kciuka.

**Wydajność:** czy obrazy nie są ładowane w rozdzielczości desktopowej, czy pierwsze wyświetlenie nie trwa dłużej niż kilka sekund na wolnym łączu.

**Tekst:** czy podstawowy tekst ma co najmniej 16 px (mniejszy powoduje przybliżanie w Safari), czy nagłówki mają mobilną skalę, nie desktopową.

Dla każdego niezaznaczonego punktu w tym trybie: ekran, szerokość, co konkretnie źle, co ma być zamiast, plus zrzut jako dowód.
