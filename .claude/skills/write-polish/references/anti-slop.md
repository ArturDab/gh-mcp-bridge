# Anti-slop - wzorce strukturalne wyższego poziomu

Czarna lista łapie pojedyncze słowa i frazy. Ten plik łapie wzorce, które są
poprawne słowo po słowie, ale jako całość zdradzają tekst generowany przez AI.
To trudniejsza warstwa - wzorce strukturalne i składniowe, nie leksykalne.

> To kanoniczny dom wzorców W1-W8 - pełne wersje ze źródłami, przykładami
> i polskimi odpowiednikami. Inne pliki tylko tu odsyłają. Przy audycie tekstu
> korzystaj z tego pliku.

## Spis treści

- [Jak używać](#jak-uzywac)
- [Warstwa podstawowa](#warstwa-podstawowa)
  - [W1 - Reguła trzech (trikolony)](#w1---regula-trzech-trikolony)
  - [W2 - Cyklowanie synonimów](#w2---cyklowanie-synonimow)
  - [W3 - Nadmierne hedgowanie](#w3---nadmierne-hedgowanie)
  - [W4 - Pompowanie ważności](#w4---pompowanie-waznosci)
  - [W5 - Fałszywa równowaga](#w5---falszywa-rownowaga)
  - [W6 - Generyczne metafory](#w6---generyczne-metafory)
  - [W7 - Narrator z dystansu](#w7---narrator-z-dystansu)
  - [W8 - Test cytatu (LinkedIn test)](#w8---test-cytatu-linkedin-test)
  - [Formalne łączniki → naturalne](#formalne-laczniki-naturalne)
  - [Łańcuchy "który"](#lancuchy-ktory)
  - [Zbędne zaimki osobowe](#zbedne-zaimki-osobowe)
  - [Konstrukcje przeciwstawne - wariant zaawansowany](#konstrukcje-przeciwstawne---wariant-zaawansowany)
  - [Scoring (opcjonalny)](#scoring-opcjonalny)
- [Co NIE wchodzi do tego pliku](#co-nie-wchodzi-do-tego-pliku)

## Jak używać

Przy korekcie: wypisz znaleziska z numerami akapitów - nic nie poprawiaj.
Korekta w osobnej fazie. Uwaga: część wzorców poniżej to reguły racjonowania,
nie zakazu - jedno użycie może być celowe. Problem to nawyk, nie pojedyncze
wystąpienie.

---

## Warstwa podstawowa

Wzorce bazowe mają własne domy - tu ich nie powtarzamy:
- mechanika składni (imiesłowy -ąc, ", co...", "choć/chociaż", symetria/rytm,
  ton akademicki) → `zasady-jezykowe.md`, sekcja "Warstwa podstawowa"
- zakazane łączniki na początku akapitu ("Ponadto", "Co więcej", "Dodatkowo"...)
  → `czarna-lista.md`, sekcja "Zakazane łączniki"

Od tego miejsca w dół - wyższy poziom: nazwane wzorce W1-W8 i wzorce składniowe,
których nie ma nigdzie indziej.

---

## W1 - Reguła trzech (trikolony)

**Skąd:** Wikipedia Signs of AI Writing, Field Guide (Charlie Guo), Cherryleaf,
Pangram Labs.

AI nadużywa struktury trójkowej: trzy przymiotniki, trzy przykłady, trzy zdania
w kadencji. Na Wikipedii opisane jako jeden z najczęstszych wzorców - AI używa
trójek, żeby powierzchowna analiza wyglądała na kompletną.

**Polskie odpowiedniki:**
- "Nowoczesny, intuicyjny i wydajny."
- "Oferuje wygodę, bezpieczeństwo i oszczędność."
- "To gra o atmosferze, fabule i emocjach."
- "Myśl szerzej. Działaj odważniej. Ruszaj szybciej."

**Reguła:** Dwa elementy brzmią naturalniej niż trzy. Test: czy trzeci element
dodaje informację, której nie ma w dwóch pierwszych? Jeśli nie - skróć do
dwóch. Trójka OK jako celowy efekt retoryczny, np. w punchline - problem to
nawyk, nie jeden użycie.

---

## W2 - Cyklowanie synonimów

**Skąd:** Wikipedia Signs of AI Writing, Antislop paper (arXiv).

AI unika powtórzeń przez rotowanie synonimów tego samego pojęcia. W efekcie
jeden obiekt ma w tekście 4-5 nazw. Modele mają penalizację za powtórzenia
w treningu, więc wymuszają wariację nawet tam, gdzie powtórzenie byłoby
naturalne.

**Polskie odpowiedniki (gaming):**
- "gra... tytuł... produkcja... pozycja... dzieło..." (o jednej grze)
- "studio... deweloper... twórcy... zespół..." (o jednej firmie)

**Polskie odpowiedniki (ogólne):**
- "firma... przedsiębiorstwo... podmiot... marka..." (o jednej firmie)
- "artykuł... tekst... materiał... treść..." (o jednym tekście)

**Reguła:** Powtórzenie > sztuczny synonim. Jeśli piszesz o grze, pisz "gra" -
nie rotuj przez "tytuł", "produkcja", "pozycja" bez powodu. Synonim OK gdy
wnosi nową informację ("studio, czyli 40-osobowy zespół z Krakowa").

---

## W3 - Nadmierne hedgowanie

**Skąd:** Cherryleaf, Pangram Labs, Ten Telltale Signs.

AI hedguje obsesyjnie - każde twierdzenie jest złagodzone kwalifikatorem.
Nie jest to ostrożność - to unikanie ryzyka wbudowane w trening. Ludzie-eksperci
stawiają tezy. AI unika tez.

**Polskie odpowiedniki:**
- "Warto zauważyć, że..."
- "W pewnym sensie..."
- "Do pewnego stopnia..."
- "Można powiedzieć, że..."
- "Wydaje się, że..."
- "Nie bez powodu..."
- "Z jednej strony... z drugiej strony..." (gdy nieuzasadnione rzeczywistą
  dwustronnością)

**Reguła:** Postaw tezę. Jeśli nie jesteś pewien - napisz dlaczego konkretnie,
nie hedguj mgliście.

- Źle: "Wydaje się, że rynek rośnie."
- Dobrze: "Rynek urósł o 12% w Q3, ale dane za Q4 jeszcze nie weszły."

---

## W4 - Pompowanie ważności

**Skąd:** Wikipedia Signs of AI Writing, Measuring AI Slop paper (arXiv).

Wikipedia opisuje to jako jeden z najłatwiej identyfikowalnych wzorców: AI
podnosi wagę każdego aspektu tematu, łącząc go z "szerszym kontekstem".
Wszystko jest "przełomowe", "stanowi ważny krok", "wyznacza nowy kierunek".
Konkretne fakty zamieniają się w ogólne deklaracje ważności.

**Polskie odpowiedniki:**
- "...co stanowi ważny krok w kierunku..."
- "...wyznaczając nowy standard w branży..."
- "...wpisuje się w szerszy trend..."
- "...ma kluczowe znaczenie dla przyszłości..."
- "...stanowi przełom w dziedzinie..."
- "...co może mieć daleko idące konsekwencje..."
- "...otwiera nowe możliwości dla..."
- "...toruje drogę do..."

**Reguła:** Znaczenie musi wynikać z faktów, nie z deklaracji. Nie pisz, że
coś "wyznacza nowy standard" - opisz, co konkretnie zmieniło i dla kogo. Jeśli
nie masz dowodu - wytnij całą konstrukcję.

---

## W5 - Fałszywa równowaga

**Skąd:** Cherryleaf, badania nad sycophancy, Pangram Labs.

AI przedstawia każdy temat jako dwustronny, nawet gdy fakty wskazują
jednoznacznie w jednym kierunku. Mechaniczne "z jednej strony... z drugiej
strony..." bez rozstrzygnięcia. Efekt RLHF - model unika zajmowania stanowiska,
bo kontrowersja generowała niższe oceny w treningu.

**Polskie odpowiedniki:**
- "Mimo pewnych kontrowersji, wielu ekspertów uważa..."
- "Choć opinie są podzielone, jedno jest pewne..." (podwójny slop)
- "Z jednej strony... z drugiej jednak..."
- "Zarówno zwolennicy, jak i krytycy zgadzają się, że..."

**Reguła:** Jeśli fakty mówią jasno - zajmij stanowisko. Nie buduj sztucznej
dwustronności. "Z jednej strony" OK gdy obie strony mają realne argumenty.
Nie OK jako asekuracja przed zajęciem stanowiska.

---

## W6 - Generyczne metafory

**Skąd:** Field Guide (Charlie Guo), Cherryleaf.

AI generuje metafory, które brzmią sensownie, ale są generyczne - nie wynikają
z konkretnego doświadczenia ani z wiedzy o temacie. Ludzkie metafory są albo
bardzo konkretne (z osobistego doświadczenia), albo kulturowo rezonujące.
AI-owe są "w okolicach" sensu, ale nigdy nie trafiają precyzyjnie.

**Polskie odpowiedniki:**
- "Marketing to maraton, nie sprint." (wyświechtane + pasuje do wszystkiego)
- "Automatyzacja to klucz do sukcesu." (martwa metafora)
- "Prompt engineering to jak nauka nowego języka." (generyczne porównanie)
- "To podróż, nie cel." (pasuje do dowolnego tematu)

**Reguła:** Metafora musi być konkretna albo nie być jej wcale. Test:
czy to porównanie pasowałoby do dowolnego innego tematu po zamianie jednego
słowa? Jeśli tak - jest generyczne. Drugie pytanie: czy metafora mówi coś,
czego nie da się powiedzieć wprost? Jeśli nie - wytnij.

---

## W7 - Narrator z dystansu

**Skąd:** Raport anti-slop (Perplexity), badania nad sycophancy.

AI przyjmuje perspektywę bezosobowego wykładowcy komentującego zjawiska
"z lotu ptaka". Zamiast pisać o konkretnych ludziach lub sytuacjach, mówi
o "ludziach w ogóle" i "tendencjach".

**Polskie odpowiedniki:**
- "Obserwuje się..."
- "Ludzie mają tendencję do..."
- "Można dostrzec..."
- "Niektórzy twierdzą..."
- "Mówi się, że..."
- "W społeczeństwie coraz częściej..."
- "Użytkownicy oczekują..."

**Reguła:** Forma "ty", "my" albo konkretny podmiot z nazwą. "Obserwuje się
wzrost zainteresowania" → "Trzy miliony użytkowników zarejestrowało się w ciągu
tygodnia." Jeśli nie masz konkretu - postaw czytelnika w scenie.

---

## W8 - Test cytatu (LinkedIn test)

**Skąd:** pisanie-pl (własna reguła, marzec 2026).

Zdanie brzmi jak post na LinkedIn: za gładkie, podaje uniwersalną prawdę,
nadaje się do zacytowania out of context bez utraty sensu. Sygnał, że zdanie
jest decorative, nie niesie realnej informacji.

**Przykłady:**
- "Autentyczność to fundament każdej relacji." (LinkedIn-maxim)
- "Prawdziwa innowacja zaczyna się od odwagi." (motivational slop)
- "W końcu chodzi o ludzi, nie o technologię." (puste zamknięcie)

**Test:** Wyobraź sobie, że ktoś cytuje to zdanie na LinkedInie. Czy brzmi
jak coś mądrego, co pasuje do dowolnego kontekstu? Jeśli tak - wytnij albo
uziemić w konkrecie: konkretna liczba, konkretna sytuacja, konkretna osoba.

---

## Formalne łączniki → naturalne

AI używa nadmiernie formalnych łączników, które brzmią jak przekład z
angielskiego lub jak styl urzędowy. Reguła: jeden łącznik formalny na tekst
to ornament. Trzy pod rząd to AI-tell.

| Formalny (AI) | Naturalny polski |
|---|---|
| "Ponadto" | "Poza tym", "A do tego" |
| "Jednakże" | "Tyle że", "Ale" |
| "Niemniej jednak" | "Mimo to", "I tak" |
| "W związku z powyższym" | "Dlatego", "Przez to" |
| "Biorąc pod uwagę" | "Skoro", "Przy takim X" |
| "W celu" | "Żeby", "By", "Aby" |
| "W odniesieniu do" | "Jeśli chodzi o", "Co do" |
| "Na podstawie" | "Z", "Wynika z" |

Reguła: przy korekcie zamień każdy formalny łącznik na naturalny odpowiednik.
Jeśli po zamianie zdanie brzmi dziwnie - zdanie ma inny problem.

---

## Łańcuchy "który"

AI buduje zdania wielokrotnie złożone za pomocą łańcuchów zaimków względnych
zamiast rozbijać na prostsze struktury. Każde "który" dokłada poziom zagnieżdżenia
- czytelnik musi trzymać strukturę w pamięci do końca zdania.

**Reguła:** Max 1 "który/która/które" w zdaniu. Przy drugim - rozbij na dwa
zdania lub użyj imiesłowu przydawkowego.

- Źle: "Firma, która wdrożyła system, który zautomatyzował procesy, które
  wcześniej zajmowały połowę czasu zespołu."
- Dobrze: "Firma wdrożyła system automatyzacji. Procesy, które wcześniej
  zajmowały połowę dnia, teraz działają bez nadzoru."
- Też dobrze: "Wdrożony system zautomatyzował procesy zajmujące wcześniej
  połowę dnia." (imiesłów zamiast "który")

Wyjątek: "który" OK w zdaniu podrzędnym, gdy jest jedynym - "Firma, która
nie miała pomysłu, sprzedała się" jest czytelne.

---

## Zbędne zaimki osobowe

AI pisze zaimki osobowe jak w angielskim, gdzie są gramatycznie obowiązkowe.
W polszczyźnie podmiot zaimkowy jest zbędny - forma czasownika już koduje
osobę i liczbę.

**Polskie odpowiedniki do usunięcia:**
- "On pracował w firmie od pięciu lat. On znał wszystkie procedury."
  → "Pracował w firmie od pięciu lat. Znał wszystkie procedury."
- "Ona zdecydowała się na zmianę. Ona nie wróciła."
  → "Zdecydowała się na zmianę. Nie wróciła."
- "Oni nie wiedzieli, co robić."
  → "Nie wiedzieli, co robić."

**Reguła:** W polskim podmiot zaimkowy zostawiasz tylko dla kontrastu lub
emfazy.

- Emfaza: "To ON zdecydował, nie zarząd." (zaimek wzmocniony tonem)
- Kontrast: "Ona weszła. On wyszedł."

Wszędzie indziej - usuń.

---

## Konstrukcje przeciwstawne - wariant zaawansowany

Pełna lista kształtów → `czarna-lista.md`, przepisy → `zasady-jezykowe.md`,
sekcja "Konstrukcje przeciwstawne". Tu: reguła uzupełniająca do korekty.

Wzorzec "Nie X. Nie Y. Nie Z." - gdy zostawiasz negacje, zróżnicuj formy.
Trzykrotne "Nie..." to stakkato, które brzmi mechanicznie nawet gdy negacja
jest uzasadniona.

- Źle: "Nie X. Nie Y. Nie Z."
- Dobrze: "Nie X. Ani Y. Żadna też Z."
- Też dobrze: "Żadnego X, żadnego Y. Ani Z."
- Też dobrze: "Nie X. Po prostu Z."

Formy do rotowania: "nie", "ani", "żaden/żadna/żadne", "po prostu", "bez".

---

## Scoring (opcjonalny)

Przy audycie gotowego tekstu - oceń 1-10 w każdym wymiarze. Próg 35/50.
Poniżej progu: tekst wymaga rewizji przed publikacją.

| Wymiar | Pytanie kontrolne |
|---|---|
| Bezpośredniość | Czy tekst mówi wprost, czy zapowiada, że zaraz powie? |
| Rytm | Zdania zróżnicowane, czy monotonne jak metronom? |
| Zaufanie do czytelnika | Szanuje inteligencję, czy tłumaczy oczywiste? |
| Naturalność | Brzmi jak polski dziennikarz, czy jak tłumaczenie z angielskiego? |
| Gęstość | Da się coś wyciąć bez utraty informacji? |

Scoring nie zastępuje reguł - to szybki benchmark do oceny całości.
Tekst może mieć wysokie wyniki i nadal zawierać pojedyncze wzorce slop.

---

## Co NIE wchodzi do tego pliku

Wzorce angielskie nieprzenoszalne na polski: listy nadużywanych słów
angielskich (delve, tapestry, multifaceted), brak kontrakcji (it's/it is),
emoji w tekście, formatowanie Unicode. Sycophancy jako zjawisko konwersacyjne -
dotyczy zachowania modelu w dialogu, nie pisania tekstu.
