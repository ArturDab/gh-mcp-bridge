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

function asToolResult(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

// --- Definicja serwera MCP i narzedzi -----------------------------------

function buildServer() {
  const server = new McpServer({ name: "gh-mcp-bridge", version: "1.0.0" });

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
        "Tworzy albo nadpisuje plik w repo (Contents API). Jesli plik juz istnieje, sam pobiera jego sha przed nadpisaniem.",
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
      await gh("/repos/" + repo + "/git/refs/heads/" + encodeURIComponent(branch), {
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
