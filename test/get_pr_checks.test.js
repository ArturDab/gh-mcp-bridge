import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeOverallStatus,
  buildChecksList,
  statusStateToConclusion,
} from "../operations.js";

function checkRuns(runs) {
  return { total_count: runs.length, check_runs: runs };
}
function commitStatus(statuses) {
  return { state: "pending", total_count: statuses.length, statuses };
}

test("get_pr_checks: PR z trwajacym sprawdzeniem daje pending", () => {
  const runs = checkRuns([
    { name: "build", status: "completed", conclusion: "success", html_url: "u1" },
    { name: "test", status: "in_progress", conclusion: null, html_url: "u2" },
  ]);
  const overall = computeOverallStatus(runs, commitStatus([]));
  assert.equal(overall, "pending");
});

test("get_pr_checks: pending ma pierwszenstwo przed failure (zachowawczo)", () => {
  const runs = checkRuns([
    { name: "build", status: "completed", conclusion: "failure", html_url: "u1" },
    { name: "test", status: "queued", conclusion: null, html_url: "u2" },
  ]);
  const overall = computeOverallStatus(runs, commitStatus([]));
  assert.equal(overall, "pending");
});

test("get_pr_checks: PR z jednym niepowodzeniem wsrod sukcesow daje failure", () => {
  const runs = checkRuns([
    { name: "build", status: "completed", conclusion: "success", html_url: "u1" },
    { name: "test", status: "completed", conclusion: "failure", html_url: "u2" },
    { name: "lint", status: "completed", conclusion: "success", html_url: "u3" },
  ]);
  const overall = computeOverallStatus(runs, commitStatus([]));
  assert.equal(overall, "failure");
});

test("get_pr_checks: timed_out i cancelled tez licza sie jako failure", () => {
  assert.equal(
    computeOverallStatus(
      checkRuns([{ name: "a", status: "completed", conclusion: "timed_out", html_url: "u" }]),
      commitStatus([])
    ),
    "failure"
  );
  assert.equal(
    computeOverallStatus(
      checkRuns([{ name: "a", status: "completed", conclusion: "cancelled", html_url: "u" }]),
      commitStatus([])
    ),
    "failure"
  );
});

test("get_pr_checks: PR bez sprawdzen daje neutral, nigdy success", () => {
  const overall = computeOverallStatus(checkRuns([]), commitStatus([]));
  assert.equal(overall, "neutral");
  assert.notEqual(overall, "success");
});

test("get_pr_checks: wszystko zielone i przynajmniej jedno sprawdzenie daje success", () => {
  const runs = checkRuns([
    { name: "build", status: "completed", conclusion: "success", html_url: "u1" },
    { name: "test", status: "completed", conclusion: "success", html_url: "u2" },
  ]);
  assert.equal(computeOverallStatus(runs, commitStatus([])), "success");
});

test("get_pr_checks: legacy commit status (bez check-runs) tez liczy sie do neutral/pending/failure/success", () => {
  assert.equal(
    computeOverallStatus(checkRuns([]), commitStatus([{ state: "pending", context: "ci/legacy" }])),
    "pending"
  );
  assert.equal(
    computeOverallStatus(checkRuns([]), commitStatus([{ state: "failure", context: "ci/legacy" }])),
    "failure"
  );
  assert.equal(
    computeOverallStatus(checkRuns([]), commitStatus([{ state: "error", context: "ci/legacy" }])),
    "failure"
  );
  assert.equal(
    computeOverallStatus(checkRuns([]), commitStatus([{ state: "success", context: "ci/legacy" }])),
    "success"
  );
});

test("get_pr_checks: statusStateToConclusion mapuje stany legacy Status API", () => {
  assert.equal(statusStateToConclusion("success"), "success");
  assert.equal(statusStateToConclusion("failure"), "failure");
  assert.equal(statusStateToConclusion("error"), "failure");
  assert.equal(statusStateToConclusion("pending"), null);
});

test("get_pr_checks: buildChecksList laczy check-runs i legacy statusy w jedna liste", () => {
  const runs = checkRuns([
    { name: "build", status: "completed", conclusion: "success", html_url: "u1" },
  ]);
  const statuses = commitStatus([
    { state: "failure", context: "ci/legacy", target_url: "u2" },
  ]);
  const list = buildChecksList(runs, statuses);
  assert.equal(list.length, 2);
  assert.deepEqual(list[0], { name: "build", status: "completed", conclusion: "success", url: "u1" });
  assert.deepEqual(list[1], { name: "ci/legacy", status: "completed", conclusion: "failure", url: "u2" });
});

test("get_pr_checks: buildChecksList zwraca pusta tablice, gdy brak sprawdzen", () => {
  const list = buildChecksList(checkRuns([]), commitStatus([]));
  assert.deepEqual(list, []);
});
