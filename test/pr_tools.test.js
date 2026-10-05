import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPrFilesResult,
  mapPrFile,
  MAX_PATCH_CHARS,
  validateCommentBody,
  MAX_COMMENT_CHARS,
  mapComment,
  graphqlMergeMethod,
  unwrapGraphqlResponse,
  requireOpenPr,
} from "../operations.js";

// --- get_pr_files ---

test("get_pr_files: zwraca pliki z diffem i licznikami", () => {
  const raw = [
    { filename: "a.js", status: "modified", additions: 3, deletions: 1, changes: 4, patch: "@@ -1 +1 @@" },
    { filename: "b.js", status: "added", additions: 10, deletions: 0, changes: 10, patch: "+x" },
  ];
  const r = buildPrFilesResult(raw, { page: 1, perPage: 30 });
  assert.equal(r.count, 2);
  assert.equal(r.has_more, false);
  assert.equal(r.files[0].patch, "@@ -1 +1 @@");
  assert.equal(r.files[0].patch_truncated, false);
});

test("get_pr_files: pelna strona ustawia has_more", () => {
  const raw = Array.from({ length: 2 }, (_, i) => ({ filename: `f${i}`, status: "added", patch: "x" }));
  assert.equal(buildPrFilesResult(raw, { perPage: 2 }).has_more, true);
});

test("get_pr_files: za dlugi patch jest ucinany i oznaczony", () => {
  const f = mapPrFile({ filename: "big", status: "modified", patch: "x".repeat(MAX_PATCH_CHARS + 50) });
  assert.equal(f.patch.length, MAX_PATCH_CHARS);
  assert.equal(f.patch_truncated, true);
});

test("get_pr_files: brak patch oznaczony jako patch_unavailable (plik binarny)", () => {
  const f = mapPrFile({ filename: "img.png", status: "added" });
  assert.equal(f.patch, null);
  assert.equal(f.patch_unavailable, true);
});

test("get_pr_files: include_patch=false pomija pola diffa, zachowuje previous_filename", () => {
  const f = mapPrFile(
    { filename: "new.js", previous_filename: "old.js", status: "renamed", patch: "x" },
    { includePatch: false }
  );
  assert.equal("patch" in f, false);
  assert.equal(f.previous_filename, "old.js");
});

// --- komentarze ---

test("komentarze: pusta tresc jest odrzucona przed wywolaniem API", () => {
  assert.throws(() => validateCommentBody("   "), /pusta/);
  assert.throws(() => validateCommentBody(undefined), /pusta/);
});

test("komentarze: za dluga tresc jest odrzucona", () => {
  assert.throws(() => validateCommentBody("x".repeat(MAX_COMMENT_CHARS + 1)), /za dlugi/);
});

test("komentarze: poprawna tresc przechodzi bez zmian", () => {
  assert.equal(validateCommentBody("Dziala."), "Dziala.");
});

test("komentarze: mapComment wybiera pola i toleruje brak autora", () => {
  const c = mapComment({ id: 1, user: null, created_at: "t", updated_at: "t", body: "b", html_url: "u", extra: 1 });
  assert.deepEqual(Object.keys(c).sort(), ["author", "body", "created_at", "html_url", "id", "updated_at"]);
  assert.equal(c.author, "unknown");
});

// --- mark_pr_ready / enable_auto_merge ---

test("requireOpenPr: szkic przechodzi dla mustBeDraft=true i zwraca node_id", () => {
  assert.equal(requireOpenPr({ number: 1, state: "open", draft: true, node_id: "N" }, { mustBeDraft: true }), "N");
});

test("requireOpenPr: PR niebedacy szkicem jest odrzucony przy mark_pr_ready", () => {
  assert.throws(
    () => requireOpenPr({ number: 1, state: "open", draft: false, node_id: "N" }, { mustBeDraft: true }),
    /nie jest szkicem/
  );
});

test("requireOpenPr: szkic jest odrzucony przy auto-merge", () => {
  assert.throws(
    () => requireOpenPr({ number: 1, state: "open", draft: true, node_id: "N" }, { mustBeDraft: false }),
    /mark_pr_ready/
  );
});

test("requireOpenPr: zamkniety PR i brak node_id sa odrzucone", () => {
  assert.throws(() => requireOpenPr({ number: 1, state: "closed", node_id: "N" }), /nie jest otwarty/);
  assert.throws(() => requireOpenPr({ number: 1, state: "open" }), /node_id/);
});

test("graphqlMergeMethod: mapuje metody i odrzuca nieznane", () => {
  assert.equal(graphqlMergeMethod("squash"), "SQUASH");
  assert.equal(graphqlMergeMethod("rebase"), "REBASE");
  assert.throws(() => graphqlMergeMethod("fast-forward"), /Nieznana/);
});

test("unwrapGraphqlResponse: errors[] przy HTTP 200 to porazka", () => {
  assert.throws(
    () => unwrapGraphqlResponse({ data: null, errors: [{ message: "Auto merge is not allowed" }] }),
    /Auto merge is not allowed/
  );
  assert.throws(() => unwrapGraphqlResponse(null), /pusta/);
  assert.deepEqual(unwrapGraphqlResponse({ data: { a: 1 } }), { a: 1 });
});
