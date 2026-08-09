// operations.js
//
// Czysta logika narzedzi MCP - bez sieci, bez Express, bez tokenu GitHub App.
// server.js woła te funkcje po tym jak sam pobierze dane z GitHub API (funkcja
// gh() w server.js). Rozdzielenie istnieje po to, zeby dalo sie testowac
// ksztalt danych i regoly bez zywego polaczenia i bez uruchamiania serwera.

// --- list_files ------------------------------------------------------------

function normalizePrefix(pathPrefix) {
  if (!pathPrefix) return null;
  return pathPrefix.endsWith("/") ? pathPrefix.slice(0, -1) : pathPrefix;
}

function matchesPrefix(entryPath, prefix) {
  if (!prefix) return true;
  return entryPath === prefix || entryPath.startsWith(prefix + "/");
}

// treeData: surowa odpowiedz GET /repos/{owner}/{repo}/git/trees/{ref}?recursive=1
// Zwraca { truncated, count, entries, note? }. Pole truncated jest zawsze
// obecne i zawsze pochodzi wprost z odpowiedzi GitHuba - nigdy nie jest
// zgadywane ani ukrywane. Przy truncated=true dokladamy note z podpowiedzia,
// zeby zawezic zapytanie parametrem path.
export function buildListFilesResult(treeData, pathPrefix) {
  const prefix = normalizePrefix(pathPrefix);
  const allEntries = Array.isArray(treeData.tree) ? treeData.tree : [];
  const entries = allEntries
    .filter((e) => matchesPrefix(e.path, prefix))
    .map((e) => ({
      path: e.path,
      type: e.type,
      size: e.size ?? null,
      sha: e.sha,
    }));

  const truncated = !!treeData.truncated;
  const result = { truncated, count: entries.length, entries };
  if (truncated) {
    result.note =
      "GitHub obcial to drzewo (repo zbyt duze dla jednego zapytania) - zawez zapytanie parametrem path, zeby zobaczyc pelna liste w danym katalogu.";
  }
  return result;
}

// --- delete_file -------------------------------------------------------------

// existingContentsResponse to wynik GET /repos/{owner}/{repo}/contents/{path}:
// - null, jesli server.js zlapal 404 (plik nie istnieje na tym branchu/ref)
// - tablica, jesli sciezka wskazuje katalog (Contents API zwraca liste wpisow)
// - obiekt z polem sha, jesli sciezka wskazuje pojedynczy plik
// Zwraca sha pliku do uzycia w DELETE albo rzuca czytelny blad PRZED
// jakimkolwiek wywolaniem kasujacym.
export function checkDeletableFile(path, existingContentsResponse) {
  if (existingContentsResponse === null) {
    throw new Error(`Plik nie istnieje: ${path}`);
  }
  if (Array.isArray(existingContentsResponse)) {
    throw new Error("Contents API nie kasuje katalogow, podaj sciezke pliku.");
  }
  if (!existingContentsResponse.sha) {
    throw new Error(`Nie udalo sie odczytac sha pliku: ${path}`);
  }
  return existingContentsResponse.sha;
}

// --- list_commits ------------------------------------------------------------

// rawCommit: pojedynczy wpis z GET /repos/{owner}/{repo}/commits.
// parents jest zawsze tablica (moze byc pusta dla pierwszego commita w repo) -
// bez tego pola odzyskiwanie skasowanego pliku (list_commits -> get_file z
// ref=parents[0]) nie ma z czego skorzystac.
export function mapCommit(rawCommit) {
  const author =
    rawCommit.author && rawCommit.author.login
      ? rawCommit.author.login
      : rawCommit.commit?.author?.name || "unknown";
  const fullMessage = rawCommit.commit?.message || "";
  return {
    sha: rawCommit.sha,
    date: rawCommit.commit?.author?.date,
    author,
    message: fullMessage.split("\n")[0],
    parents: (rawCommit.parents || []).map((p) => p.sha),
  };
}

// Buduje querystring dla GET /repos/{owner}/{repo}/commits. GitHub nazywa
// filtr po branchu/sha "sha", nie "ref" - narzedzie MCP uzywa nazwy "ref" dla
// spojnosci z get_file/list_files, wiec mapujemy tu, a nie w server.js.
export function buildCommitsQueryParams({ path, ref, since, until, per_page } = {}) {
  const params = new URLSearchParams();
  if (path) params.set("path", path);
  if (ref) params.set("sha", ref);
  if (since) params.set("since", since);
  if (until) params.set("until", until);
  params.set("per_page", String(per_page || 30));
  return params;
}
