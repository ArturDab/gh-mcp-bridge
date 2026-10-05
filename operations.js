// operations.js
//
// Czysta logika narzedzi MCP - bez sieci, bez Express, bez tokenu GitHub App.
// server.js wola te funkcje po tym jak sam pobierze dane z GitHub API (funkcja
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

// --- get_pr_checks -----------------------------------------------------------

// Legacy Status API (GET .../status) uzywa "state": pending/success/failure/error.
// Mapujemy je na slownik "conclusion" z Checks API, zeby oba zrodla dalo sie
// polaczyc w jedna liste. "pending" nie ma odpowiednika w conclusion (Checks
// API tez ma conclusion=null dopoki sprawdzenie trwa) - stad null.
export function statusStateToConclusion(state) {
  if (state === "success") return "success";
  if (state === "failure" || state === "error") return "failure";
  return null;
}

// checkRunsResponse: GET /repos/{owner}/{repo}/commits/{sha}/check-runs
// commitStatusResponse: GET /repos/{owner}/{repo}/commits/{sha}/status
export function buildChecksList(checkRunsResponse, commitStatusResponse) {
  const runs = (checkRunsResponse?.check_runs || []).map((r) => ({
    name: r.name,
    status: r.status,
    conclusion: r.conclusion,
    url: r.html_url,
  }));
  const statuses = (commitStatusResponse?.statuses || []).map((s) => ({
    name: s.context,
    status: "completed",
    conclusion: statusStateToConclusion(s.state),
    url: s.target_url,
  }));
  return [...runs, ...statuses];
}

// Wyliczanie overall - zachowawczo, w tej kolejnosci:
//   1. cokolwiek queued/in_progress (check-runs) albo pending (legacy status) -> pending
//   2. cokolwiek ma conclusion failure/timed_out/cancelled (check-runs) albo
//      state failure/error (legacy status) -> failure
//   3. zero zdefiniowanych sprawdzen w obu zrodlach -> neutral, nigdy success
// Repo bez skonfigurowanego CI nie moze udawac zielonego, bo wtedy
// auto-scalanie dostaje falszywa zgode.
export function computeOverallStatus(checkRunsResponse, commitStatusResponse) {
  const runs = checkRunsResponse?.check_runs || [];
  const statuses = commitStatusResponse?.statuses || [];

  const anyPending =
    runs.some((r) => r.status === "queued" || r.status === "in_progress") ||
    statuses.some((s) => s.state === "pending");
  if (anyPending) return "pending";

  const anyFailure =
    runs.some((r) => ["failure", "timed_out", "cancelled"].includes(r.conclusion)) ||
    statuses.some((s) => s.state === "failure" || s.state === "error");
  if (anyFailure) return "failure";

  if (runs.length === 0 && statuses.length === 0) return "neutral";

  return "success";
}

// --- get_pr_files ------------------------------------------------------------

// Limit tresci diffa (pole patch) na jeden plik. GitHub sam pomija patch dla
// bardzo duzych albo binarnych plikow; ten limit chroni dodatkowo kontekst
// rozmowy. Ucieta tresc jest oznaczona flaga patch_truncated - nigdy po cichu.
export const MAX_PATCH_CHARS = 4000;

// rawFile: pojedynczy wpis z GET /repos/{owner}/{repo}/pulls/{n}/files
export function mapPrFile(rawFile, { includePatch = true, maxPatchChars = MAX_PATCH_CHARS } = {}) {
  const out = {
    filename: rawFile.filename,
    status: rawFile.status,
    additions: rawFile.additions,
    deletions: rawFile.deletions,
    changes: rawFile.changes,
  };
  if (rawFile.previous_filename) out.previous_filename = rawFile.previous_filename;
  if (includePatch) {
    if (typeof rawFile.patch === "string") {
      if (rawFile.patch.length > maxPatchChars) {
        out.patch = rawFile.patch.slice(0, maxPatchChars);
        out.patch_truncated = true;
      } else {
        out.patch = rawFile.patch;
        out.patch_truncated = false;
      }
    } else {
      // Brak pola patch = plik binarny albo diff za duzy dla GitHuba.
      out.patch = null;
      out.patch_truncated = false;
      out.patch_unavailable = true;
    }
  }
  return out;
}

// Zwraca { page, per_page, count, has_more, files }. has_more=true znaczy, ze
// strona byla pelna i moga istniec kolejne - wtedy trzeba poprosic o page+1,
// a brak pliku na liscie nie jest dowodem, ze go nie ma w PR.
export function buildPrFilesResult(rawFiles, { page = 1, perPage = 30, includePatch = true } = {}) {
  const list = Array.isArray(rawFiles) ? rawFiles : [];
  return {
    page,
    per_page: perPage,
    count: list.length,
    has_more: list.length >= perPage,
    files: list.map((f) => mapPrFile(f, { includePatch })),
  };
}

// --- komentarze --------------------------------------------------------------

export const MAX_COMMENT_CHARS = 65536; // limit GitHuba dla tresci komentarza

// Zwraca tresc gotowa do wyslania albo rzuca czytelny blad PRZED wywolaniem API.
export function validateCommentBody(body) {
  if (typeof body !== "string" || body.trim().length === 0) {
    throw new Error("Tresc komentarza nie moze byc pusta.");
  }
  if (body.length > MAX_COMMENT_CHARS) {
    throw new Error(`Komentarz za dlugi (${body.length} znakow, maksimum ${MAX_COMMENT_CHARS}).`);
  }
  return body;
}

export function mapComment(rawComment) {
  return {
    id: rawComment.id,
    author: rawComment.user?.login || "unknown",
    created_at: rawComment.created_at,
    updated_at: rawComment.updated_at,
    body: rawComment.body,
    html_url: rawComment.html_url,
  };
}

// --- GraphQL: gotowosc PR-a i auto-merge ------------------------------------

export const MARK_READY_MUTATION = `mutation($id: ID!) {
  markPullRequestReadyForReview(input: { pullRequestId: $id }) {
    pullRequest { number isDraft url }
  }
}`;

export const ENABLE_AUTO_MERGE_MUTATION = `mutation($id: ID!, $method: PullRequestMergeMethod!) {
  enablePullRequestAutoMerge(input: { pullRequestId: $id, mergeMethod: $method }) {
    pullRequest { number url autoMergeRequest { enabledAt mergeMethod } }
  }
}`;

// Mapowanie nazw metod REST (merge/squash/rebase) na enum GraphQL.
export function graphqlMergeMethod(method) {
  const map = { merge: "MERGE", squash: "SQUASH", rebase: "REBASE" };
  const value = map[method];
  if (!value) {
    throw new Error(`Nieznana metoda scalania: ${method}. Dozwolone: merge, squash, rebase.`);
  }
  return value;
}

// Odpowiedz GraphQL moze miec HTTP 200 i jednoczesnie errors[] - to jest porazka.
// Zwraca data albo rzuca blad z laczonymi komunikatami.
export function unwrapGraphqlResponse(response) {
  if (response?.errors && response.errors.length > 0) {
    const msg = response.errors.map((e) => e.message).join("; ");
    throw new Error(`GitHub GraphQL: ${msg}`);
  }
  if (!response?.data) {
    throw new Error("GitHub GraphQL: pusta odpowiedz.");
  }
  return response.data;
}

// Wspolna kontrola PR-a przed mutacja: PR musi byc otwarty. Zwraca node_id.
export function requireOpenPr(pr, { mustBeDraft = null } = {}) {
  if (!pr || !pr.node_id) {
    throw new Error("Nie udalo sie odczytac node_id pull requesta.");
  }
  if (pr.state !== "open") {
    throw new Error(`PR #${pr.number} nie jest otwarty (stan: ${pr.state}).`);
  }
  if (mustBeDraft === true && !pr.draft) {
    throw new Error(`PR #${pr.number} nie jest szkicem (draft) - nic do zrobienia.`);
  }
  if (mustBeDraft === false && pr.draft) {
    throw new Error(
      `PR #${pr.number} jest szkicem (draft). Najpierw zdejmij status roboczy (mark_pr_ready).`
    );
  }
  return pr.node_id;
}
