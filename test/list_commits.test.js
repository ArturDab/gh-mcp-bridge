import { test } from "node:test";
import assert from "node:assert/strict";
import { mapCommit, buildCommitsQueryParams } from "../operations.js";

// Ksztalt pojedynczego wpisu z GET /repos/{owner}/{repo}/commits
function rawCommit({ sha, message, authorLogin, authorName, parents }) {
  return {
    sha,
    commit: {
      author: { name: authorName, email: "a@example.com", date: "2026-08-08T10:00:00Z" },
      message,
    },
    author: authorLogin ? { login: authorLogin } : null,
    parents: parents.map((p) => ({ sha: p, url: "...", html_url: "..." })),
  };
}

test("list_commits: mapCommit zwraca sha/date/author/message/parents", () => {
  const raw = rawCommit({
    sha: "abc123",
    message: "Napraw walidacje\n\nDluzszy opis w kolejnych liniach.",
    authorLogin: "arturdab",
    authorName: "Artur Dabrowski",
    parents: ["parent1"],
  });

  const result = mapCommit(raw);

  assert.deepEqual(result, {
    sha: "abc123",
    date: "2026-08-08T10:00:00Z",
    author: "arturdab",
    message: "Napraw walidacje",
    parents: ["parent1"],
  });
});

test("list_commits: message to tylko pierwsza linia opisu", () => {
  const raw = rawCommit({
    sha: "s1",
    message: "Jedna linia tylko",
    authorLogin: "x",
    authorName: "X",
    parents: [],
  });
  assert.equal(mapCommit(raw).message, "Jedna linia tylko");
});

test("list_commits: brak konta GitHub przy autorze - fallback na nazwe z commita", () => {
  const raw = rawCommit({
    sha: "s2",
    message: "Zmiana bez powiazanego konta",
    authorLogin: null,
    authorName: "Ktos Bez Konta",
    parents: ["p1"],
  });
  assert.equal(mapCommit(raw).author, "Ktos Bez Konta");
});

test("list_commits: parents jest obecne (pusta tablica) nawet dla commita poczatkowego", () => {
  const raw = rawCommit({
    sha: "root",
    message: "Pierwszy commit",
    authorLogin: "x",
    authorName: "X",
    parents: [],
  });
  const result = mapCommit(raw);
  assert.ok(Array.isArray(result.parents), "parents musi byc tablica, nie undefined");
  assert.deepEqual(result.parents, []);
});

test("list_commits: parents ma dwa sha dla commita mergujacego", () => {
  const raw = rawCommit({
    sha: "merge1",
    message: "Merge PR #12",
    authorLogin: "x",
    authorName: "X",
    parents: ["left-parent", "right-parent"],
  });
  assert.deepEqual(mapCommit(raw).parents, ["left-parent", "right-parent"]);
});

test("list_commits: parents to zwykle stringi sha, kompatybilne z ref w get_file", () => {
  const raw = rawCommit({
    sha: "s3",
    message: "Kasuje plik",
    authorLogin: "x",
    authorName: "X",
    parents: ["0123456789abcdef0123456789abcdef01234567"],
  });
  const [firstParent] = mapCommit(raw).parents;
  assert.equal(typeof firstParent, "string");
  assert.equal(firstParent, "0123456789abcdef0123456789abcdef01234567");
});

test("list_commits: buildCommitsQueryParams mapuje ref na sha (parametr GitHuba)", () => {
  const params = buildCommitsQueryParams({ ref: "main" });
  assert.equal(params.get("sha"), "main");
  assert.equal(params.get("ref"), null);
});

test("list_commits: buildCommitsQueryParams przekazuje path/since/until", () => {
  const params = buildCommitsQueryParams({
    path: "docs/spec.md",
    since: "2026-08-01T00:00:00Z",
    until: "2026-08-08T00:00:00Z",
  });
  assert.equal(params.get("path"), "docs/spec.md");
  assert.equal(params.get("since"), "2026-08-01T00:00:00Z");
  assert.equal(params.get("until"), "2026-08-08T00:00:00Z");
});

test("list_commits: buildCommitsQueryParams domyslnie per_page=30", () => {
  const params = buildCommitsQueryParams({});
  assert.equal(params.get("per_page"), "30");
});

test("list_commits: buildCommitsQueryParams przekazuje podane per_page", () => {
  const params = buildCommitsQueryParams({ per_page: 100 });
  assert.equal(params.get("per_page"), "100");
});
