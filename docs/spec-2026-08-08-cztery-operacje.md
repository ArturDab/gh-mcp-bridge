# Spec: cztery brakujące operacje mostka

Ustalone 2026-08-08. Powód i priorytety: `sztab/portfolio.md`, sekcja
„gh-mcp-bridge - stan operacji".

Stan wyjściowy: `server.js`, MCP SDK, `@octokit/auth-app`, walidacja zodem.
Nowe narzędzia dokładamy w tej samej konwencji co istniejące (`get_file`,
`put_file`, `create_pr`), z opisami po polsku bez znaków diakrytycznych.

Kolejność wdrożenia jest kolejnością sekcji. Każda operacja to osobny commit.

---

## 1. `list_files` - najpilniejsza

**Problem:** nie da się sprawdzić, co leży w repozytorium. Sesja zgaduje ścieżki.
2026-08-08 cztery odczyty z rzędu zakończyły się `404` przy szukaniu README
i plików typów.

**Endpoint:** `GET /repos/{owner}/{repo}/git/trees/{ref}?recursive=1`

**Parametry:**

| Nazwa | Typ | Wymagany | Uwagi |
|---|---|---|---|
| `repo` | string | tak | Format `owner/nazwa`, jak w pozostałych narzędziach |
| `ref` | string | nie | Branch, tag albo sha. Domyślnie gałąź domyślna repo |
| `path` | string | nie | Prefiks do filtrowania wyniku po stronie serwera, np. `src/components` |
| `recursive` | bool | nie | Domyślnie `true` |

**Zwraca:** tablicę obiektów `{ path, type, size, sha }`, gdzie `type` to `blob`
albo `tree`.

**Warunek krytyczny - brak cichego ucinania.** GitHub obcina drzewo przy dużych
repozytoriach i zwraca flagę `truncated`. Jeśli jest `true`, narzędzie **musi**
zwrócić to pole w odpowiedzi razem z liczbą zwróconych pozycji. Wynik urwany
podany jako pełny jest gorszy niż błąd, bo model uzna nieobecność pliku za dowód,
że pliku nie ma. Przy `truncated: true` opis odpowiedzi ma wprost mówić, żeby
zawęzić zapytanie parametrem `path`.

**Test przed kodem:** repozytorium z zagnieżdżonym katalogiem zwraca ścieżki
z obu poziomów; filtr `path` zawęża wynik; odpowiedź z `truncated: true`
przechodzi do wyniku, a nie jest pomijana.

---

## 2. `delete_file`

**Problem:** brak kasowania. Zmiana nazwy pliku zostawia stary plik jako śmieć -
tak stało się 2026-08-08 z `portfel.md` w repo `sztab`.

**Endpoint:** `DELETE /repos/{owner}/{repo}/contents/{path}`

**Parametry:** `repo`, `path`, `message`, `branch` (opcjonalny, domyślnie gałąź
domyślna).

**Zachowanie:** narzędzie samo pobiera `sha` pliku przed kasowaniem, dokładnie
tak jak robi to `put_file` przy nadpisywaniu. Artur nie podaje `sha`.

**Zabezpieczenia:**

- Ścieżka wskazująca katalog: jasny błąd „Contents API nie kasuje katalogow,
  podaj sciezke pliku". API nie obsługuje kasowania rekurencyjnego i nie
  symulujemy tego pętlą.
- Plik nie istnieje: błąd mówiący, że nie istnieje, a nie ogólne `404`.

**Test przed kodem:** kasowanie istniejącego pliku zwraca sha commita; kasowanie
nieistniejącego zwraca komunikat o nieistnieniu; ścieżka katalogu jest odrzucana
przed wywołaniem API.

---

## 3. `list_commits`

**Problem:** odczyt starej wersji pliku już działa, bo `get_file` przyjmuje `ref`.
Brakuje sposobu na znalezienie właściwego momentu w historii. Bez tego odzyskanie
skasowanego pliku wymaga terminala - przypadek z 2026-08-08, testy reguł Firestore
w repo `kursy`.

**Endpoint:** `GET /repos/{owner}/{repo}/commits`

**Parametry:**

| Nazwa | Typ | Wymagany | Uwagi |
|---|---|---|---|
| `repo` | string | tak | |
| `path` | string | nie | Tylko commity dotykające tej ścieżki. To jest główny tryb użycia |
| `ref` | string | nie | Gałąź lub sha startowy |
| `since`, `until` | string | nie | Daty ISO 8601 |
| `per_page` | number | nie | Domyślnie 30, maksimum 100 |

**Zwraca:** `{ sha, date, author, message, parents }`, gdzie `message` to pierwsza
linia opisu commita, a `parents` to tablica sha rodziców.

**Dlaczego `parents` jest obowiązkowe.** Przy odzyskiwaniu skasowanego pliku commit,
który zwraca `list_commits` z filtrem `path`, jest commitem **kasującym** - w nim
pliku już nie ma. Treść leży w jego rodzicu. Bez `parents` trzeba zgadywać
i workflow odzyskiwania nie działa.

**Test przed kodem:** filtr `path` zwraca wyłącznie commity dotykające tej ścieżki;
`parents` jest obecne w każdym wyniku; sekwencja `list_commits(path)` →
`get_file(ref = parents[0])` odzyskuje treść skasowanego pliku.

---

## 4. `get_pr_checks`

**Problem:** obowiązuje reguła auto-scalania PR-ów Claude'a, a mostek nie widzi,
czy CI przeszło. Scala w ciemno.

**Endpointy:** `GET /repos/{owner}/{repo}/commits/{sha}/check-runs`
oraz `GET /repos/{owner}/{repo}/commits/{sha}/status`. Sha bierzemy z głowy
gałęzi PR-a.

**Parametry:** `repo`, `pr_number`.

**Zwraca:**

```
{
  "overall": "success" | "failure" | "pending" | "neutral",
  "checks": [ { "name": ..., "status": ..., "conclusion": ..., "url": ... } ]
}
```

**Wyliczanie `overall` - zachowawczo, w tej kolejności:**

1. Cokolwiek jest `queued` albo `in_progress` → `pending`
2. Cokolwiek ma `conclusion` równe `failure`, `timed_out` albo `cancelled` → `failure`
3. Zero zdefiniowanych sprawdzeń → `neutral`, nigdy `success`

Punkt trzeci jest istotny: repozytorium bez skonfigurowanego CI nie może udawać
zielonego, bo wtedy auto-scalanie dostaje fałszywą zgodę.

**Test przed kodem:** PR z trwającym sprawdzeniem daje `pending`; PR z jednym
niepowodzeniem wśród sukcesów daje `failure`; PR bez sprawdzeń daje `neutral`.

---

## Uprawnienia aplikacji GitHub

`list_files`, `list_commits` mieszczą się w **Contents: read**, które jest już nadane.
`delete_file` mieści się w **Contents: write**, też nadane.

`get_pr_checks` wymaga **dwóch nowych uprawnień**: `Checks: read` oraz
`Commit statuses: read`. Bez nich zwróci `403`. Nadanie wymaga zatwierdzenia
przez Artura w ustawieniach aplikacji na GitHubie - instrukcja w raporcie oddania.

## Po wdrożeniu

Zaktualizować listę operacji w `sztab/portfolio.md`, sekcja „gh-mcp-bridge -
stan operacji": wdrożone pozycje usunąć z tabeli braków, dopisać wpis do „Zrobione".
