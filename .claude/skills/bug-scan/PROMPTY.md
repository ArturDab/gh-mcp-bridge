# Prompty do skanera usterek (bug-scan)

Pięć promptów, do wklejania po kolei. Każdy ma jasny warunek przejścia do
następnego - nie przeskakuj. Wymaga skillu `bug-scan` (`SKILL.md` w tym samym
katalogu) oraz dostępu do repo, które chcesz przeskanować.

---

## P1 - Instalacja

```
Wgraj skaner usterek (skill bug-scan) do tego repo:

1. Skopiuj scripts/bug-scan.js, scripts/bug-scan-fixture.js,
   scripts/bug-scan-selftest.js, scripts/chrome-resolver.js ze skilla bug-scan
   do scripts/ tego projektu.
2. Zainstaluj zależności: npm install --save-dev playwright-core express
   (jeśli Chromium nie jest dostępny lokalnie ani systemowo, doinstaluj go).
3. Zbuduj bug-scan.config.json na bazie bug-scan.config.example.json - dopasuj
   appName, baseUrl (lokalny adres, na którym ta apka realnie chodzi), routes
   (jawna lista widoków albo źródło nawigacji do auto-wykrycia), costlyTextPattern
   (dopasuj do słownictwa TEGO projektu - akcje generujące koszt, wysyłkę,
   webhook, wylogowanie), login/credentialsEnv jeśli apka jest za bramką hasłową.
4. Wypisz: ile widoków wykryłeś do skanu i skąd (jawna lista w configu, auto-wykrycie
   z nawigacji, czy pojedynczy root bez routingu).

Nie uruchamiaj jeszcze pełnego skanu na realnym celu - to następny prompt.
```

**Warunek przejścia dalej:** config istnieje, zależności zainstalowane, wypisana
lista widoków ma sens (nie jest pusta, nie zawiera oczywistych pomyłek).

---

## P2 - Samotest

```
Uruchom samotest skanera na atrapie z celowo zaszytymi usterkami:

node scripts/bug-scan-selftest.js

Warunek przejścia dalej: WSZYSTKIE wiersze w wypisce PASS, ani jednego FAIL
(liczba wierszy rośnie z czasem, nie sprawdzaj konkretnej liczby - sprawdzaj brak FAIL).
Jeśli któraś nie przeszła - napraw SKANER (scripts/bug-scan.js), NIE aplikację.
Atrapa jest celowo zepsuta, to część testu, nie bug do naprawienia w projekcie.
```

**Warunek przejścia dalej:** samotest zielony w całości. Czerwony wynik = stop,
napraw mechanizm skanera, uruchom ponownie - nie idź dalej z zepsutym narzędziem.

---

## P3 - Pierwszy przebieg

```
Uruchom skaner na prawdziwym, żywym środowisku (lokalnym albo preview - NIGDY
produkcja z realnymi danymi):

node scripts/bug-scan.js --base=<adres> --config=bug-scan.config.json

W nagłówku raportu podaj POKRYCIE: ile elementów objęto skanem z ilu wykrytych,
w procentach (raport liczy to sam - przepisz, nie przelicz ręcznie).

Pokrycie poniżej 60% unieważnia ten raport - jeśli tak wyszło, powiedz to wprost
zamiast przechodzić dalej, i sprawdź dlaczego (limit na widok za niski, za dużo
elementów dryfujących, za dużo pominiętych akcji kosztownych blokujących realny
przepływ).
```

**Warunek przejścia dalej:** pokrycie 60% lub więcej. Poniżej - popraw config
(limity, routing, wzorzec kosztowny) i uruchom ponownie, nie interpretuj wyniku.

---

## P4 - Weryfikacja raportu, NIE naprawa

**NIE POMIJAJ TEGO KROKU.** Pierwszy raport tego skanera (na projekcie źródłowym,
Pulsarze) miał 100% fałszywych trafień - wszystkie 26 zgłoszonych "pewnych usterek"
było fałszywych, z powodu błędu w mechanizmie namierzania elementu (opisane w
`SKILL.md`, sekcja Historia). Zielony samotest tego nie złapał. Bez tego kroku nie
masz żadnego dowodu, że raport mówi prawdę o TYM projekcie.

```
Dla każdej usterki zgłoszonej w raporcie (sekcja "Usterki", nie "Niepewne")
sprawdź RĘCZNIE w przeglądarce, czy istnieje naprawdę - użyj instrukcji "jak
odtworzyć" z raportu.

Podziel na trzy kubełki:
- POTWIERDZONE - odtworzyłeś, usterka jest realna
- FAŁSZYWE - nie odtworzyłeś, element działa poprawnie
- NIEPEWNE - nie da się jednoznacznie ocenić bez dodatkowego kontekstu

Podaj, ile procent zgłoszeń było fałszywych - to jest miara wiarygodności
SKANERA na tym projekcie, nie miara jakości aplikacji.
```

**Warunek przejścia dalej:** masz podział na trzy kubełki i policzony procent
fałszywych trafień. Nie przechodzisz do P5, dopóki tego nie masz - nawet jeśli
raport "wygląda wiarygodnie".

---

## P5 - Naprawa

```
Napraw WYŁĄCZNIE usterki z kubełka POTWIERDZONE z kroku P4. Nie ruszaj
FAŁSZYWYCH ani NIEPEWNYCH.

Pogrupuj potwierdzone usterki według wspólnej przyczyny (np. jeden zepsuty
handler odpowiadający za kilka martwych przycisków) - napraw przyczynę raz, nie
łataj punktowo każde zgłoszenie osobno tam, gdzie źródło jest wspólne.
```

**Warunek zakończenia:** każda potwierdzona usterka ma przypisaną naprawę albo
wspólną przyczynę z inną naprawioną usterką; fałszywe i niepewne zostają
udokumentowane jako takie, nie znikają po cichu z rozmowy.
