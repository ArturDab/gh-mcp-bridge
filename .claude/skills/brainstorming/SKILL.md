---
name: brainstorming
description: Przepytaj Artura, zanim cokolwiek zbudujesz. Uruchamiaj SAM przy nowym projekcie, nowej funkcji, nowym module albo istotnej zmianie zachowania - nie czekaj, aż Artur poprosi. Nie uruchamiaj przy poprawkach, drobiazgach i zmianach, które da się opisać jednym zdaniem.
---

# Przepytanie przed budowaniem

Artur ma ogólny pomysł, rzadko finalne szczegóły. Twoim zadaniem jest wyciągnąć z niego szczegóły **zanim** napiszesz linijkę kodu - bo inaczej zbudujesz coś, co wygląda dobrze i nie jest tym, o co chodziło.

## Kiedy to uruchamiasz (sam, bez proszenia)

- nowy projekt
- nowa funkcja albo nowy moduł w istniejącym projekcie
- istotna zmiana zachowania czegoś, co już działa
- Artur opisuje pomysł ogólnikami („chciałbym, żeby dało się…", „przydałoby się coś do…")

## Kiedy tego NIE uruchamiasz

- poprawki, literówki, drobiazgi
- zadanie, które Artur opisał precyzyjnie i którego wynik da się opisać jednym zdaniem
- naprawa błędu (od tego jest systematic-debugging)
- praca w trybie `fast` nad czymś, co Artur już wcześniej zaakceptował

Nie stosuj tego do wszystkiego. Superpowers, skąd ten wzorzec pochodzi, każe przepytywać nawet przy zmianie konfiguracji - to za dużo i Artur to wyciął.

## Twarda brama

**Nie pisz kodu, nie twórz plików, nie instaluj niczego, dopóki Artur nie zaakceptuje projektu rozwiązania.**

Wyjątek: czytanie kodu i dokumentów, żeby zrozumieć kontekst. To wolno, i od tego zaczynasz.

## Jak przepytujesz

1. **Najpierw sam się rozejrzyj.** Przeczytaj CLAUDE.md, docs, ostatnie zmiany, kod. Nie pytaj o rzeczy, które możesz sprawdzić.

2. **Sprawdź rozmiar.** Jeśli Artur opisuje kilka niezależnych podsystemów naraz („platforma z czatem, płatnościami i analityką"), powiedz to od razu i rozbij na osobne kawałki. Nie doprecyzowuj szczegółów czegoś, co najpierw trzeba podzielić. Każdy kawałek dostaje własne przepytanie.

3. **Pytaj po jednym pytaniu.** Jedno pytanie w jednej wiadomości. Nigdy pięć naraz.

4. **Używaj wariantów odpowiedzi do wyboru** wszędzie, gdzie się da - Arturowi łatwiej wybrać niż formułować. Pytanie otwarte tylko wtedy, gdy warianty by ograniczały.

5. **Pytaj o rzeczy, o których nie pomyślał.** Nie o oczywistości. Kop w trudne miejsca: co się dzieje w przypadku brzegowym, co jest poza zakresem, jak wygląda porażka, kto tego używa i kiedy, co ma się stać przy błędzie.

6. **Pytaj tak długo, aż będziesz pewien.** Nie kończ po trzech pytaniach, bo „chyba wystarczy". Jeśli zostaje niejasność, którą później i tak trzeba by rozstrzygnąć - pytaj teraz. Później kosztuje przeróbkę.

## Po pytaniach

7. **Zaproponuj 2-3 sposoby realizacji** z kompromisami i **swoją rekomendacją**. Zacznij od rekomendowanego i wyjaśnij dlaczego. Nigdy goła lista wariantów bez typu.

8. **Przedstaw projekt rozwiązania w sekcjach.** Każda sekcja proporcjonalna do złożoności: kilka zdań, gdy prosto, do akapitu, gdy niuans. Po każdej sekcji spytaj, czy się zgadza.

9. **Bezwzględne YAGNI.** Wyrzuć z projektu wszystko, czego Artur nie potrzebuje teraz. Zwłaszcza: konta, uprawnienia, panele administracyjne, wielojęzyczność, integracje „na przyszłość".

10. **Zapisz specyfikację** do `docs/specs/RRRR-MM-DD-<temat>.md` i zatwierdź w repozytorium.

11. **Sprawdź specyfikację świeżym okiem** przed pokazaniem:
    - **Zaślepki:** zostało gdzieś „TBD", „do ustalenia", puste sekcje? Uzupełnij.
    - **Sprzeczności:** czy sekcje sobie nie przeczą?
    - **Zakres:** czy to jeszcze jedno wykonalne zadanie, czy już trzeba dzielić?
    - **Wieloznaczność:** czy któryś wymóg da się przeczytać na dwa sposoby? Wybierz jeden i napisz wprost.

    Popraw od razu, bez drugiej rundy.

12. **Poproś Artura o przejrzenie specyfikacji.** Dopiero po jego akceptacji przechodzisz do budowania.

## Skuteczna specyfikacja

Najlepsze specyfikacje są samodzielne: nazywają pliki i miejsca, których dotyczą, mówią wprost **co jest poza zakresem**, i kończą się sprawdzianem, który udowadnia, że rzecz działa od początku do końca.

Czas włożony w precyzję specyfikacji zwraca się lepiej niż czas włożony w pilnowanie wykonania.

## Po akceptacji

Zaproponuj Arturowi start **świeżej sesji** do wykonania, z gotowym promptem odsyłającym do specyfikacji. Świeży kontekst skupiony wyłącznie na budowaniu daje lepszy wynik niż sesja obciążona całą rozmową projektową.
