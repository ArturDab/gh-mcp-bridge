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
