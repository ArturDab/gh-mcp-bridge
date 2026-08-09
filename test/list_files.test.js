import { test } from "node:test";
import assert from "node:assert/strict";
import { buildListFilesResult } from "../operations.js";

// Ksztalt surowej odpowiedzi GitHub: GET /repos/{owner}/{repo}/git/trees/{ref}?recursive=1
function treeData({ truncated = false, entries = [] } = {}) {
  return {
    sha: "abc123",
    truncated,
    tree: entries,
  };
}

test("list_files: zagniezdzony katalog zwraca sciezki z obu poziomow", () => {
  const data = treeData({
    entries: [
      { path: "README.md", mode: "100644", type: "blob", sha: "sha1", size: 42 },
      { path: "src", mode: "040000", type: "tree", sha: "sha2" },
      { path: "src/index.js", mode: "100644", type: "blob", sha: "sha3", size: 100 },
      { path: "src/components", mode: "040000", type: "tree", sha: "sha4" },
      { path: "src/components/Foo.tsx", mode: "100644", type: "blob", sha: "sha5", size: 200 },
    ],
  });

  const result = buildListFilesResult(data);

  assert.equal(result.count, 5);
  const paths = result.entries.map((e) => e.path);
  assert.ok(paths.includes("README.md"), "brak sciezki z poziomu glownego");
  assert.ok(paths.includes("src/components/Foo.tsx"), "brak sciezki zagniezdzonej");
  const readme = result.entries.find((e) => e.path === "README.md");
  assert.deepEqual(readme, { path: "README.md", type: "blob", size: 42, sha: "sha1" });
});

test("list_files: filtr path zawezaa wynik do prefiksu katalogu", () => {
  const data = treeData({
    entries: [
      { path: "README.md", type: "blob", sha: "sha1", size: 42 },
      { path: "src/components", type: "tree", sha: "sha2" },
      { path: "src/components/Foo.tsx", type: "blob", sha: "sha3", size: 200 },
      { path: "src/other.js", type: "blob", sha: "sha4", size: 10 },
    ],
  });

  const result = buildListFilesResult(data, "src/components");

  const paths = result.entries.map((e) => e.path).sort();
  assert.deepEqual(paths, ["src/components", "src/components/Foo.tsx"]);
  assert.equal(result.count, 2);
});

test("list_files: filtr path nie lapie falszywych prefiksow (src vs src2)", () => {
  const data = treeData({
    entries: [
      { path: "src/index.js", type: "blob", sha: "sha1", size: 1 },
      { path: "src2/other.js", type: "blob", sha: "sha2", size: 1 },
    ],
  });

  const result = buildListFilesResult(data, "src");

  assert.deepEqual(
    result.entries.map((e) => e.path),
    ["src/index.js"]
  );
});

test("list_files: truncated=true przechodzi do wyniku, nie jest pomijane", () => {
  const data = treeData({
    truncated: true,
    entries: [{ path: "README.md", type: "blob", sha: "sha1", size: 1 }],
  });

  const result = buildListFilesResult(data);

  assert.equal(result.truncated, true);
  assert.ok(result.note, "brak podpowiedzi w wyniku przy truncated=true");
  assert.match(result.note, /path/);
});

test("list_files: truncated=false nie dodaje zbednej podpowiedzi", () => {
  const data = treeData({ truncated: false, entries: [] });

  const result = buildListFilesResult(data);

  assert.equal(result.truncated, false);
  assert.equal(result.note, undefined);
});
