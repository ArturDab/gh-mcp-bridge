import { test } from "node:test";
import assert from "node:assert/strict";
import { applyEdits, countOccurrences, decodeContentsFile, MAX_EDITS } from "../edit_file.js";

const b64 = (s) => Buffer.from(s, "utf-8").toString("base64");

test("edit_file: pojedyncza zamiana dokladnego tekstu", () => {
  const out = applyEdits("Ala ma kota.\nKot ma Ale.\n", [{ old_str: "Ala ma kota.", new_str: "Ala ma psa." }]);
  assert.equal(out, "Ala ma psa.\nKot ma Ale.\n");
});

test("edit_file: 0 dopasowan - odmowa", () => {
  assert.throws(() => applyEdits("abc", [{ old_str: "xyz", new_str: "q" }], "a.md"), /nie znaleziono old_str w a\.md.*Nic nie zapisano/);
});

test("edit_file: >1 dopasowanie - odmowa z liczba wystapien", () => {
  assert.throws(() => applyEdits("to i to", [{ old_str: "to", new_str: "tamto" }]), /wystepuje w plik 2 razy/);
});

test("edit_file: kilka zamian po kolei, kazda na aktualnej tresci", () => {
  const out = applyEdits("a b c", [
    { old_str: "a", new_str: "x" },
    { old_str: "x b", new_str: "y" },
  ]);
  assert.equal(out, "y c");
});

test("edit_file: blad w drugiej zamianie - nic nie zwraca (wszystko albo nic)", () => {
  assert.throws(
    () => applyEdits("a b", [{ old_str: "a", new_str: "c" }, { old_str: "zzz", new_str: "q" }]),
    /Zamiana 2: nie znaleziono.*po zastosowaniu wczesniejszych zamian/
  );
});

test("edit_file: znaki specjalne traktowane doslownie (bez regexow i $&)", () => {
  const out = applyEdits("cena: $5 [x]*", [{ old_str: "$5 [x]*", new_str: "$& $1" }]);
  assert.equal(out, "cena: $& $1");
  assert.equal(countOccurrences("a.a.a", "."), 2);
});

test("edit_file: pusty new_str usuwa fragment", () => {
  assert.equal(applyEdits("abc", [{ old_str: "b", new_str: "" }]), "ac");
});

test("edit_file: puste old_str, identyczne old/new i brak zamian sa odrzucane", () => {
  assert.throws(() => applyEdits("abc", [{ old_str: "", new_str: "x" }]), /old_str nie moze byc puste/);
  assert.throws(() => applyEdits("abc", [{ old_str: "a", new_str: "a" }]), /identyczne/);
  assert.throws(() => applyEdits("abc", []), /co najmniej jedna/);
  const many = Array.from({ length: MAX_EDITS + 1 }, () => ({ old_str: "a", new_str: "b" }));
  assert.throws(() => applyEdits("abc", many), /Za duzo zamian/);
});

test("edit_file: zamiany, ktore sie znosza, sa odrzucane", () => {
  assert.throws(
    () => applyEdits("abc", [{ old_str: "a", new_str: "x" }, { old_str: "x", new_str: "a" }]),
    /nie zmienily tresci/
  );
});

test("edit_file: dekodowanie tresci z Contents API (UTF-8, polskie znaki, zawijanie base64)", () => {
  const text = "Zażółć gęślą jaźń\n".repeat(20);
  const wrapped = b64(text).replace(/(.{60})/g, "$1\n");
  const r = decodeContentsFile("p.md", { type: "file", sha: "s1", encoding: "base64", content: wrapped });
  assert.deepEqual(r, { sha: "s1", text });
});

test("edit_file: plik > 1 MB czytany z blobu", () => {
  const r = decodeContentsFile(
    "duzy.md",
    { type: "file", sha: "s2", encoding: "none", content: "" },
    { encoding: "base64", content: b64("duza tresc") }
  );
  assert.equal(r.text, "duza tresc");
});

test("edit_file: brak pliku, katalog, plik binarny - odmowa", () => {
  assert.throws(() => decodeContentsFile("x.md", null), /Plik nie istnieje: x\.md.*put_file/);
  assert.throws(() => decodeContentsFile("dir", [{}]), /to katalog/);
  const bin = Buffer.from([0xff, 0xfe, 0x00, 0x80]).toString("base64");
  assert.throws(
    () => decodeContentsFile("a.png", { type: "file", sha: "s", encoding: "base64", content: bin }),
    /nie jest plikiem tekstowym UTF-8/
  );
});
