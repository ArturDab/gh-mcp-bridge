import { test } from "node:test";
import assert from "node:assert/strict";
import { checkDeletableFile } from "../operations.js";

test("delete_file: istniejacy plik zwraca jego sha", () => {
  const existing = { path: "docs/stary.md", sha: "deadbeef", type: "file" };
  const sha = checkDeletableFile("docs/stary.md", existing);
  assert.equal(sha, "deadbeef");
});

test("delete_file: sciezka katalogu jest odrzucana przed wywolaniem API kasujacego", () => {
  // Contents API dla katalogu zwraca tablice wpisow, nie pojedynczy obiekt z sha.
  const existingDir = [
    { path: "docs/stary", sha: "a", type: "file" },
    { path: "docs/stary/plik.md", sha: "b", type: "file" },
  ];
  assert.throws(
    () => checkDeletableFile("docs/stary", existingDir),
    /Contents API nie kasuje katalogow, podaj sciezke pliku/
  );
});

test("delete_file: nieistniejacy plik zwraca czytelny komunikat, nie ogolne 404", () => {
  // Warstwa server.js przekazuje null, gdy GET /contents zwrocilo 404.
  assert.throws(
    () => checkDeletableFile("docs/nieistnieje.md", null),
    /Plik nie istnieje: docs\/nieistnieje\.md/
  );
});

test("delete_file: odpowiedz bez pola sha jest odrzucana (nieoczekiwany ksztalt)", () => {
  assert.throws(
    () => checkDeletableFile("docs/dziwny.md", { path: "docs/dziwny.md" }),
    /Nie udalo sie odczytac sha/
  );
});
