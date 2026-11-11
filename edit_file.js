// edit_file.js
//
// Czysta logika narzedzia edit_file (zamiana dokladnego tekstu w pliku) -
// bez sieci i bez tokenu, jak operations.js. server.js pobiera plik z GitHub
// API, wola applyEdits i zapisuje wynik jednym commitem.

// --- edit_file ---------------------------------------------------------------

// Limit liczby zamian w jednym wywolaniu (jeden commit).
export const MAX_EDITS = 50;

// Liczy wystapienia needle w haystack (bez nakladania sie), bez regexow -
// tekst ze znakami specjalnymi ($, *, [) jest traktowany doslownie.
export function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let from = 0;
  for (;;) {
    const idx = haystack.indexOf(needle, from);
    if (idx === -1) return count;
    count += 1;
    from = idx + needle.length;
  }
}

// Stosuje zamiany po kolei. Kazde old_str musi wystapic w aktualnej (juz
// zmienionej poprzednimi zamianami) tresci DOKLADNIE raz - przy 0 albo >1
// rzuca czytelny blad i nic nie jest zapisywane (wszystko albo nic).
// Zwraca nowa tresc. Zamiana wstawia new_str doslownie (bez wzorcow $1, $&).
export function applyEdits(content, edits, path = "plik") {
  if (typeof content !== "string") {
    throw new Error(`Nie udalo sie odczytac tresci pliku ${path} jako tekstu.`);
  }
  if (!Array.isArray(edits) || edits.length === 0) {
    throw new Error("Podaj co najmniej jedna zamiane (edits).");
  }
  if (edits.length > MAX_EDITS) {
    throw new Error(`Za duzo zamian w jednym wywolaniu (${edits.length}, maksimum ${MAX_EDITS}).`);
  }
  let current = content;
  edits.forEach((edit, i) => {
    const n = i + 1;
    const oldStr = edit?.old_str;
    const newStr = edit?.new_str;
    if (typeof oldStr !== "string" || oldStr.length === 0) {
      throw new Error(`Zamiana ${n}: old_str nie moze byc puste.`);
    }
    if (typeof newStr !== "string") {
      throw new Error(`Zamiana ${n}: brak new_str (pusty tekst usuwa fragment).`);
    }
    if (oldStr === newStr) {
      throw new Error(`Zamiana ${n}: old_str i new_str sa identyczne - nic do zmiany.`);
    }
    const found = countOccurrences(current, oldStr);
    if (found === 0) {
      throw new Error(
        `Zamiana ${n}: nie znaleziono old_str w ${path}` +
          (i > 0 ? " (po zastosowaniu wczesniejszych zamian)" : "") +
          ". Sprawdz dokladny tekst, w tym spacje i znaki konca linii. Nic nie zapisano."
      );
    }
    if (found > 1) {
      throw new Error(
        `Zamiana ${n}: old_str wystepuje w ${path} ${found} razy - musi byc dokladnie raz. Rozszerz old_str o sasiedni tekst. Nic nie zapisano.`
      );
    }
    const idx = current.indexOf(oldStr);
    current = current.slice(0, idx) + newStr + current.slice(idx + oldStr.length);
  });
  if (current === content) {
    throw new Error("Zamiany nie zmienily tresci pliku. Nic nie zapisano.");
  }
  return current;
}

// Wyciaga tekst pliku z odpowiedzi GET /contents (JSON). Dla plikow > 1 MB
// Contents API zwraca encoding "none" i pusta tresc - wtedy server.js czyta
// blob przez /git/blobs/{sha} i podaje go tutaj jako drugi argument.
export function decodeContentsFile(path, contentsResponse, blobResponse = null) {
  if (contentsResponse === null) {
    throw new Error(`Plik nie istnieje: ${path}. Do tworzenia nowych plikow uzyj put_file.`);
  }
  if (Array.isArray(contentsResponse)) {
    throw new Error(`${path} to katalog, podaj sciezke pliku.`);
  }
  if (contentsResponse.type && contentsResponse.type !== "file") {
    throw new Error(`${path} nie jest zwyklym plikiem (typ: ${contentsResponse.type}).`);
  }
  if (!contentsResponse.sha) {
    throw new Error(`Nie udalo sie odczytac sha pliku: ${path}`);
  }
  const src =
    contentsResponse.encoding === "base64" && typeof contentsResponse.content === "string"
      ? contentsResponse
      : blobResponse;
  if (!src || src.encoding !== "base64" || typeof src.content !== "string") {
    throw new Error(`Nie udalo sie pobrac tresci pliku ${path}.`);
  }
  const buf = Buffer.from(src.content.replace(/\n/g, ""), "base64");
  const text = buf.toString("utf-8");
  if (!Buffer.from(text, "utf-8").equals(buf)) {
    throw new Error(`${path} nie jest plikiem tekstowym UTF-8 - edit_file go nie zmieni.`);
  }
  return { sha: contentsResponse.sha, text };
}
