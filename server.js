// gh-mcp-bridge
//
// Zdalny serwer MCP, ktory Claude (w rozmowie na claude.ai) laczy przez
// Settings -> Connectors -> Add custom connector. Token GitHuba jest generowany
// z GitHub App (GH_APP_ID/GH_APP_PRIVATE_KEY/GH_APP_INSTALLATION_ID, swiezy,
// auto-odswiezany) i zyje WYLACZNIE tutaj, jako zmienne srodowiskowe Railway -
// nigdy nie trafia do kontekstu rozmowy. Claude dostaje tylko wyniki wywolan.
//
// Ochrona: kazde zadanie do /mcp musi miec naglowek
//   Authorization: Bearer <MCP_AUTH_TOKEN>
// Ten sekret ustawiasz raz w konfiguracji custom connectora w claude.ai
// (sekcja "Request headers"), zeby nikt obcy nie mogl wywolywac tego serwera.

import express from "express";
import { webcrypto } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { createAppAuth } from "@octokit/auth-app";
import {
  buildListFilesResult,
  checkDeletableFile,
  mapCommit,
  buildCommitsQueryParams,
  buildChecksList,
  computeOverallStatus,
  buildPrFilesResult,
  validateCommentBody,
  mapComment,
  MARK_READY_MUTATION,
  ENABLE_AUTO_MERGE_MUTATION,
  graphqlMergeMethod,
  unwrapGraphqlResponse,
  requireOpenPr,
} from "./operations.js";

// Polyfill: @modelcontextprotocol/sdk oczekuje globalThis.crypto (Web Crypto),
// ktore na starszych wersjach Node nie jest globalne bez flagi.
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const GH_APP_ID = process.env.GH_APP_ID;
const GH_APP_PRIVATE_KEY = process.env.GH_APP_PRIVATE_KEY;
const GH_APP_INSTALLATION_ID = process.env.GH_APP_INSTALLATION_ID;
const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
const PORT = process.env.PORT || 3000;

if (!GH_APP_ID || !GH_APP_PRIVATE_KEY || !GH_APP_INSTALLATION_ID) {
  console.error(
    "BRAK GH_APP_ID/GH_APP_PRIVATE_KEY/GH_APP_INSTALLATION_ID w zmiennych srodowiskowych - serwer nie wystartuje."
  );
  process.exit(1);
}
if (!MCP_AUTH_TOKEN) {
  console.error("BRAK MCP_AUTH_TOKEN w zmiennych srodowiskowych - serwer nie wystartuje.");
  process.exit(1);
}

// --- Token GitHub App (instalacja) - cache w pamieci do wygasniecia -----

const appAuth = createAppAuth({
  appId: GH_APP_ID,
  privateKey: GH_APP_PRIVATE_KEY,
  installationId: GH_APP_INSTALLATION_ID,
});

let tokenCache = null; // { token, expiresAt }

async function getGithubToken() {
  const now = Date.now();
  if (tokenCache && new Date(tokenCache.expiresAt).getTime() - now > 5 * 60 * 1000) {
    return tokenCache.token;
  }
  const { token, expiresAt } = await appAuth({ type: "installation" });
  tokenCache = { token, expiresAt };
  return token;
}

// --- Pomocnik do wywolan GitHub API -----------------------------------

async function gh(path, options = {}) {
  const token = await getGithubToken();
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "gh-mcp-bridge",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const msg = body && body.message ? body.message : `HTTP ${res.status}`;
    throw new Error(`GitHub API ${res.status}: ${msg}`);
  }
  return body;
}

// Wywolanie GraphQL API GitHuba (te same dane uwierzytelniajace co REST).
// HTTP 200 z errors[] to porazka - unwrapGraphqlResponse rzuca w takim wypadku.
async function ghGraphql(query, variables) {
  const data = await gh("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  return unwrapGraphqlResponse(data);
}

// Walidacja formatu 'owner/nazwa' dla nowych narzedzi (zanim trafi do sciezki URL).
const repoSchema = z
  .string()
  .regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, "Format 'owner/nazwa'")
  .describe("Format 'owner/nazwa'");

function asToolResult(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

// Nazwy branchy zawieraja ukosniki (chore/ccos-sync). W sciezkach GitHub API
// ukosnik ma zostac ukosnikiem, wiec kodujemy segment po segmencie zamiast
// przepuszczac calosc przez encodeURIComponent (to zamienia "/" na "%2F").
function encodeBranchPath(branch) {
  return branch.split("/").map(encodeURIComponent).join("/");
}

async function defaultBranchOf(repo) {
  const info = await gh("/repos/" + repo);
  return info.default_branch;
}

// --- Definicja serwera MCP i narzedzi -----------------------------------

function buildServer() {
  const server = new McpServer({ name: "gh-mcp-bridge", version: "1.2.0" });

  server.registerTool(
    "list_prs",
    {
      title: "Lista pull requestow",
      description:
        "Listuje pull requesty w repo. Opcjonalnie filtruj po stanie i po branchu zrodlowym (head).",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa', np. ArturDab/claude-code-os"),
        state: z.enum(["open", "closed", "all"]).default("open"),
        head: z
          .string()
          .optional()
          .describe("Filtr po branchu zrodlowym, np. 'ArturDab:chore/ccos-sync'"),
      },
    },
    async ({ repo, state, head }) => {
      const params = new URLSearchParams({ state, per_page: "50" });
      if (head) params.set("head", head);
      const prs = await gh(`/repos/${repo}/pulls?${params.toString()}`);
      const slim = prs.map((p) => ({
        number: p.number,
        title: p.title,
        state: p.state,
        head: p.head?.ref,
        base: p.base?.ref,
        mergeable_state: p.mergeable_state,
        html_url: p.html_url,
        updated_at: p.updated_at,
      }));
      return asToolResult(slim);
    }
  );

  server.registerTool(
    "get_pr",
    {
      title: "Szczegoly pull requesta",
      description: "Zwraca pelny status pojedynczego PR, w tym czy jest mergeable.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        pr_number: z.number().int(),
      },
    },
    async ({ repo, pr_number }) => {
      const pr = await gh(`/repos/${repo}/pulls/${pr_number}`);
      return asToolResult({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        mergeable: pr.mergeable,
        mergeable_state: pr.mergeable_state,
        merged: pr.merged,
        head: pr.head?.ref,
        base: pr.base?.ref,
        html_url: pr.html_url,
      });
    }
  );

  server.registerTool(
    "get_pr_checks",
    {
      title: "Stan sprawdzen CI pull requesta",
      description:
        "Zwraca stan check-runs i statusow commita z glowy PR-a (overall: success/failure/pending/neutral) plus liste pojedynczych sprawdzen. Przy zerowej liczbie sprawdzen overall to neutral, nigdy success - brak skonfigurowanego CI nie moze udawac zielonego swiatla. Wymaga uprawnien Checks: read i Commit statuses: read w GitHub App, inaczej zwroci 403.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        pr_number: z.number().int().positive(),
      },
    },
    async ({ repo, pr_number }) => {
      const pr = await gh(`/repos/${repo}/pulls/${pr_number}`);
      const sha = pr.head?.sha;
      if (!sha) {
        throw new Error(`Nie udalo sie odczytac sha glowy PR-a #${pr_number}.`);
      }
      const [checkRuns, commitStatus] = await Promise.all([
        gh(`/repos/${repo}/commits/${sha}/check-runs`),
        gh(`/repos/${repo}/commits/${sha}/status`),
      ]);
      return asToolResult({
        overall: computeOverallStatus(checkRuns, commitStatus),
        checks: buildChecksList(checkRuns, commitStatus),
      });
    }
  );

  server.registerTool(
    "get_pr_files",
    {
      title: "Pliki i roznice pull requesta",
      description:
        "Zwraca liste plikow zmienionych w PR (nazwa, status, liczba dodanych/usunietych linii) razem z diffem (pole patch) kazdego pliku - do przegladu zmiany przed scaleniem. Wynik jest stronicowany: has_more=true oznacza, ze sa kolejne strony (podaj page+1) - nie zakladaj, ze brakujacy plik nie jest w PR. Pole patch jest ucinane przy 4000 znakow (patch_truncated=true); patch_unavailable=true to plik binarny albo diff zbyt duzy dla GitHuba. Ustaw include_patch=false, zeby dostac sama liste. Tylko odczyt.",
      inputSchema: {
        repo: repoSchema,
        pr_number: z.number().int().positive(),
        page: z.number().int().min(1).default(1),
        per_page: z.number().int().min(1).max(100).default(30),
        include_patch: z.boolean().default(true).describe("Czy dolaczyc tresc diffa"),
      },
    },
    async ({ repo, pr_number, page, per_page, include_patch }) => {
      const params = new URLSearchParams({ per_page: String(per_page), page: String(page) });
      const files = await gh(`/repos/${repo}/pulls/${pr_number}/files?${params.toString()}`);
      return asToolResult(
        buildPrFilesResult(files, { page, perPage: per_page, includePatch: include_patch })
      );
    }
  );

  server.registerTool(
    "list_pr_comments",
    {
      title: "Komentarze pull requesta",
      description:
        "Listuje zwykle komentarze w rozmowie pod pull requestem (nie komentarze do konkretnych linii kodu), od najstarszych. Stronicowane: has_more=true oznacza kolejne strony. Tylko odczyt.",
      inputSchema: {
        repo: repoSchema,
        pr_number: z.number().int().positive(),
        page: z.number().int().min(1).default(1),
        per_page: z.number().int().min(1).max(100).default(30),
      },
    },
    async ({ repo, pr_number, page, per_page }) => {
      // Najpierw pewnosc, ze to PR (a nie zwykle zgloszenie) - te same
      // uprawnienia (Pull requests) co reszta narzedzi PR.
      await gh(`/repos/${repo}/pulls/${pr_number}`);
      const params = new URLSearchParams({ per_page: String(per_page), page: String(page) });
      const comments = await gh(`/repos/${repo}/issues/${pr_number}/comments?${params.toString()}`);
      return asToolResult({
        page,
        per_page,
        count: comments.length,
        has_more: comments.length >= per_page,
        comments: comments.map(mapComment),
      });
    }
  );

  server.registerTool(
    "add_pr_comment",
    {
      title: "Dodanie komentarza do pull requesta",
      description:
        "Dodaje zwykly komentarz w rozmowie pod pull requestem (markdown). Dziala tylko na PR-ach, nie na zwyklych zgloszeniach. Komentarz jest publiczny, jesli repo jest publiczne - nie wpisuj tu sekretow ani wewnetrznych danych. Zwraca id i adres komentarza.",
      inputSchema: {
        repo: repoSchema,
        pr_number: z.number().int().positive(),
        body: z.string().min(1).max(65536).describe("Tresc komentarza (markdown)"),
      },
    },
    async ({ repo, pr_number, body }) => {
      const text = validateCommentBody(body);
      await gh(`/repos/${repo}/pulls/${pr_number}`); // upewnij sie, ze to PR
      const created = await gh(`/repos/${repo}/issues/${pr_number}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      return asToolResult({ id: created.id, html_url: created.html_url });
    }
  );

  server.registerTool(
    "mark_pr_ready",
    {
      title: "Zdjecie statusu roboczego (draft) z pull requesta",
      description:
        "Zamienia PR ze szkicu (draft) w zwykly, gotowy do przegladu i scalenia (mutacja GraphQL markPullRequestReadyForReview). Zwraca blad, jesli PR jest zamkniety albo nie jest szkicem. Nie scala PR-a.",
      inputSchema: {
        repo: repoSchema,
        pr_number: z.number().int().positive(),
      },
    },
    async ({ repo, pr_number }) => {
      const pr = await gh(`/repos/${repo}/pulls/${pr_number}`);
      const id = requireOpenPr(pr, { mustBeDraft: true });
      const data = await ghGraphql(MARK_READY_MUTATION, { id });
      const result = data.markPullRequestReadyForReview?.pullRequest;
      return asToolResult({
        number: result?.number ?? pr.number,
        draft: result?.isDraft ?? false,
        html_url: result?.url ?? pr.html_url,
      });
    }
  );

  server.registerTool(
    "enable_auto_merge",
    {
      title: "Wlaczenie samoczynnego scalania PR-a",
      description:
        "Wlacza auto-merge (mutacja GraphQL enablePullRequestAutoMerge): GitHub sam scali PR, gdy spelnione beda wymagane warunki galezi (ochrona galezi, wymagane kontrole). Wymaga otwartego PR-a, ktory nie jest szkicem, i wlaczonej w repo opcji auto-merge - w przeciwnym razie zwraca blad GitHuba. Uwaga: gdy galaz docelowa nie ma zadnych wymaganych kontroli, GitHub moze scalic PR od razu. Domyslnie metoda squash.",
      inputSchema: {
        repo: repoSchema,
        pr_number: z.number().int().positive(),
        merge_method: z.enum(["merge", "squash", "rebase"]).default("squash"),
      },
    },
    async ({ repo, pr_number, merge_method }) => {
      const pr = await gh(`/repos/${repo}/pulls/${pr_number}`);
      const id = requireOpenPr(pr, { mustBeDraft: false });
      const data = await ghGraphql(ENABLE_AUTO_MERGE_MUTATION, {
        id,
        method: graphqlMergeMethod(merge_method),
      });
      const result = data.enablePullRequestAutoMerge?.pullRequest;
      return asToolResult({
        number: result?.number ?? pr.number,
        auto_merge_enabled: !!result?.autoMergeRequest,
        merge_method: result?.autoMergeRequest?.mergeMethod ?? null,
        enabled_at: result?.autoMergeRequest?.enabledAt ?? null,
        html_url: result?.url ?? pr.html_url,
      });
    }
  );

  server.registerTool(
    "create_pr",
    {
      title: "Utworzenie pull requesta",
      description:
        "Otwiera pull request z brancha zrodlowego (head) do docelowego (base, domyslnie default branch repo). Zwraca numer i adres PR-a.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        title: z.string().min(1).describe("Tytul pull requesta"),
        head: z.string().min(1).describe("Branch zrodlowy ze zmianami, np. claude/poprawka-x"),
        base: z
          .string()
          .optional()
          .describe("Branch docelowy, domyslnie default branch repo"),
        body: z.string().optional().describe("Opis PR-a (markdown)"),
        draft: z.boolean().default(false).describe("Czy otworzyc jako draft"),
      },
    },
    async ({ repo, title, head, base, body, draft }) => {
      const target = base || (await defaultBranchOf(repo));
      const pr = await gh("/repos/" + repo + "/pulls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          head,
          base: target,
          draft,
          ...(body ? { body } : {}),
        }),
      });
      return asToolResult({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        draft: pr.draft,
        head: pr.head?.ref,
        base: pr.base?.ref,
        html_url: pr.html_url,
      });
    }
  );

  server.registerTool(
    "merge_pr",
    {
      title: "Merge pull requesta",
      description: "Merguje pull request. Domyslnie metoda squash.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        pr_number: z.number().int(),
        merge_method: z.enum(["merge", "squash", "rebase"]).default("squash"),
      },
    },
    async ({ repo, pr_number, merge_method }) => {
      const result = await gh(`/repos/${repo}/pulls/${pr_number}/merge`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merge_method }),
      });
      return asToolResult(result);
    }
  );

  server.registerTool(
    "get_file",
    {
      title: "Odczyt pliku z repo",
      description: "Zwraca surowa tresc pliku z danego brancha/commita.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        path: z.string().describe("Sciezka do pliku w repo"),
        ref: z.string().optional().describe("Branch/tag/sha, domyslnie default branch"),
      },
    },
    async ({ repo, path, ref }) => {
      const params = ref ? `?ref=${encodeURIComponent(ref)}` : "";
      const content = await gh(`/repos/${repo}/contents/${path}${params}`, {
        headers: { Accept: "application/vnd.github.raw+json" },
      });
      const text = typeof content === "string" ? content : JSON.stringify(content);
      return { content: [{ type: "text", text }] };
    }
  );

  server.registerTool(
    "put_file",
    {
      title: "Zapis/edycja pliku w repo",
      description:
        "Tworzy albo nadpisuje plik w repo (Contents API). Jesli plik juz istnieje, sam pobiera jego sha przed nadpisaniem. Branch musi istniec - do zalozenia nowego uzyj create_branch.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        path: z.string().describe("Sciezka do pliku w repo"),
        content: z.string().describe("Pelna nowa tresc pliku, jako zwykly tekst (nie base64)"),
        message: z.string().describe("Tresc commita"),
        branch: z.string().optional().describe("Branch docelowy, domyslnie default branch"),
      },
    },
    async ({ repo, path, content, message, branch }) => {
      let sha;
      try {
        const params = branch ? `?ref=${encodeURIComponent(branch)}` : "";
        const existing = await gh(`/repos/${repo}/contents/${path}${params}`);
        sha = existing.sha;
      } catch {
        // plik nie istnieje - tworzymy nowy, sha zostaje undefined
      }
      const body = {
        message,
        content: Buffer.from(content, "utf-8").toString("base64"),
        ...(branch ? { branch } : {}),
        ...(sha ? { sha } : {}),
      };
      const result = await gh(`/repos/${repo}/contents/${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return asToolResult({ commit: result.commit?.sha, path: result.content?.path });
    }
  );

  server.registerTool(
    "delete_file",
    {
      title: "Kasowanie pliku w repo",
      description:
        "Kasuje pojedynczy plik w repo (Contents API). Sam pobiera jego sha przed kasowaniem, nie trzeba go podawac. Nie kasuje katalogow - Contents API tego nie obsluguje, wiec podaj sciezke konkretnego pliku.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        path: z.string().describe("Sciezka do pliku w repo"),
        message: z.string().describe("Tresc commita kasujacego"),
        branch: z.string().optional().describe("Branch docelowy, domyslnie default branch"),
      },
    },
    async ({ repo, path, message, branch }) => {
      const params = branch ? `?ref=${encodeURIComponent(branch)}` : "";
      let existing;
      try {
        existing = await gh(`/repos/${repo}/contents/${path}${params}`);
      } catch (err) {
        if (String(err.message).includes("404")) {
          existing = null;
        } else {
          throw err;
        }
      }
      const sha = checkDeletableFile(path, existing);
      const result = await gh(`/repos/${repo}/contents/${path}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sha,
          ...(branch ? { branch } : {}),
        }),
      });
      return asToolResult({ deleted: true, path, commit: result.commit?.sha });
    }
  );

  server.registerTool(
    "list_files",
    {
      title: "Lista plikow w repo",
      description:
        "Listuje pliki i katalogi w repo (drzewo Gita), domyslnie rekurencyjnie od korzenia. Zawez parametrem path, jesli szukasz konkretnego katalogu. Jesli wynik ma truncated=true, GitHub obcial liste (repo za duze na jedno zapytanie) - zawez zapytanie parametrem path zamiast zakladac, ze brakujacy plik nie istnieje.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        ref: z.string().optional().describe("Branch, tag albo sha, domyslnie default branch repo"),
        path: z
          .string()
          .optional()
          .describe("Prefiks sciezki do zawezenia wyniku po stronie serwera, np. 'src/components'"),
        recursive: z.boolean().default(true).describe("Czy schodzic w podkatalogi"),
      },
    },
    async ({ repo, ref, path, recursive }) => {
      const branch = ref || (await defaultBranchOf(repo));
      const query = recursive ? "?recursive=1" : "";
      const treeData = await gh(`/repos/${repo}/git/trees/${encodeBranchPath(branch)}${query}`);
      return asToolResult(buildListFilesResult(treeData, path));
    }
  );

  server.registerTool(
    "list_commits",
    {
      title: "Lista commitow",
      description:
        "Listuje commity repo, najnowsze pierwsze. Podaj path, zeby znalezc commity dotykajace konkretnego pliku (glowny tryb uzycia). Kazdy wynik ma parents (sha rodzicow) - przy odzyskiwaniu skasowanego pliku commit z list_commits(path) jest commitem kasujacym (pliku juz w nim nie ma), a tresc lezy w jego rodzicu: get_file(ref = parents[0]).",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        path: z.string().optional().describe("Tylko commity dotykajace tej sciezki"),
        ref: z.string().optional().describe("Branch albo sha startowy, domyslnie default branch"),
        since: z.string().optional().describe("Data ISO 8601 - tylko commity po tej dacie"),
        until: z.string().optional().describe("Data ISO 8601 - tylko commity przed ta data"),
        per_page: z.number().int().min(1).max(100).default(30),
      },
    },
    async ({ repo, path, ref, since, until, per_page }) => {
      const params = buildCommitsQueryParams({ path, ref, since, until, per_page });
      const commits = await gh(`/repos/${repo}/commits?${params.toString()}`);
      return asToolResult(commits.map(mapCommit));
    }
  );

  server.registerTool(
    "list_branches",
    {
      title: "Lista branchy",
      description: "Listuje wszystkie branche w repo.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
      },
    },
    async ({ repo }) => {
      const branches = [];
      for (let page = 1; ; page += 1) {
        const batch = await gh("/repos/" + repo + "/branches?per_page=100&page=" + page);
        branches.push(...batch);
        if (batch.length < 100) break;
      }
      return asToolResult(
        branches.map((branch) => ({
          name: branch.name,
          sha: branch.commit?.sha,
          protected: branch.protected,
        }))
      );
    }
  );

  server.registerTool(
    "create_branch",
    {
      title: "Utworzenie brancha",
      description:
        "Tworzy nowy branch z wierzcholka brancha zrodlowego (domyslnie default branch repo). Potrzebne przed put_file na nowa galaz i przed create_pr.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        branch: z.string().min(1).describe("Nazwa nowego brancha, np. claude/poprawka-x"),
        from: z
          .string()
          .optional()
          .describe("Branch zrodlowy, domyslnie default branch repo"),
      },
    },
    async ({ repo, branch, from }) => {
      const source = from || (await defaultBranchOf(repo));
      const ref = await gh("/repos/" + repo + "/git/ref/heads/" + encodeBranchPath(source));
      const sha = ref.object?.sha;
      if (!sha) {
        throw new Error("Nie udalo sie odczytac sha brancha zrodlowego: " + source);
      }
      const created = await gh("/repos/" + repo + "/git/refs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: "refs/heads/" + branch, sha }),
      });
      return asToolResult({
        created: true,
        branch,
        from: source,
        sha: created.object?.sha || sha,
      });
    }
  );

  server.registerTool(
    "delete_branch",
    {
      title: "Usuniecie brancha",
      description: "Usuwa wskazany branch z repo.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        branch: z.string().min(1).describe("Nazwa brancha do usuniecia"),
      },
    },
    async ({ repo, branch }) => {
      await gh("/repos/" + repo + "/git/refs/heads/" + encodeBranchPath(branch), {
        method: "DELETE",
      });
      return asToolResult({ deleted: true, branch });
    }
  );

  server.registerTool(
    "close_pr",
    {
      title: "Zamkniecie pull requesta",
      description: "Zamyka pull request bez mergowania.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        pr_number: z.number().int().positive(),
      },
    },
    async ({ repo, pr_number }) => {
      const pr = await gh("/repos/" + repo + "/pulls/" + pr_number, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: "closed" }),
      });
      return asToolResult({
        number: pr.number,
        state: pr.state,
        html_url: pr.html_url,
      });
    }
  );

  server.registerTool(
    "get_repo",
    {
      title: "Ustawienia repo",
      description: "Zwraca podstawowe informacje i ustawienia repo.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
      },
    },
    async ({ repo }) => {
      const data = await gh("/repos/" + repo);
      return asToolResult({
        full_name: data.full_name,
        name: data.name,
        description: data.description,
        private: data.private,
        archived: data.archived,
        default_branch: data.default_branch,
        delete_branch_on_merge: data.delete_branch_on_merge,
        html_url: data.html_url,
      });
    }
  );

  server.registerTool(
    "update_repo",
    {
      title: "Aktualizacja ustawien repo",
      description:
        "Zmienia nazwe lub opis repo i moze wlaczyc albo wylaczyc automatyczne kasowanie brancha po mergu.",
      inputSchema: {
        repo: z.string().describe("Format 'owner/nazwa'"),
        name: z.string().min(1).optional().describe("Nowa nazwa repo"),
        description: z.string().optional().describe("Nowy opis repo"),
        delete_branch_on_merge: z.boolean().optional(),
      },
    },
    async ({ repo, name, description, delete_branch_on_merge }) => {
      const body = {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(delete_branch_on_merge !== undefined ? { delete_branch_on_merge } : {}),
      };
      if (Object.keys(body).length === 0) {
        throw new Error("Podaj co najmniej jedno ustawienie do zmiany.");
      }
      const data = await gh("/repos/" + repo, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return asToolResult({
        full_name: data.full_name,
        name: data.name,
        description: data.description,
        delete_branch_on_merge: data.delete_branch_on_merge,
        html_url: data.html_url,
      });
    }
  );

  server.registerTool(
    "list_repos",
    {
      title: "Lista repozytoriow instalacji",
      description: "Listuje wszystkie repo dostepne dla tej instalacji GitHub App.",
      inputSchema: {},
    },
    async () => {
      const repos = [];
      for (let page = 1; ; page += 1) {
        const batch = await gh("/installation/repositories?per_page=100&page=" + page);
        repos.push(...(batch.repositories || []));
        if ((batch.repositories || []).length < 100) break;
      }
      return asToolResult(
        repos.map((repo) => ({
          full_name: repo.full_name,
          private: repo.private,
          archived: repo.archived,
          default_branch: repo.default_branch,
          html_url: repo.html_url,
        }))
      );
    }
  );

  return server;
}

// --- HTTP -----------------------------------------------------------------

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "gh-mcp-bridge" });
});

app.post("/mcp", async (req, res) => {
  const auth = req.headers["authorization"] || "";
  const queryKey = req.query.key || "";
  const authorized =
    auth === `Bearer ${MCP_AUTH_TOKEN}` || queryKey === MCP_AUTH_TOKEN;
  if (!authorized) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Blad obslugi zadania MCP:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`gh-mcp-bridge nasluchuje na porcie ${PORT}`);
});
