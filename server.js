// gh-mcp-bridge
//
// Zdalny serwer MCP, ktory Claude (w rozmowie na claude.ai) laczy przez
// Settings -> Connectors -> Add custom connector. Token GitHuba (GH_TOKEN)
// zyje WYLACZNIE tutaj, jako zmienna srodowiskowa Railway - nigdy nie trafia
// do kontekstu rozmowy. Claude dostaje tylko wyniki wywolan.
//
// Ochrona: kazde zadanie do /mcp musi miec naglowek
//   Authorization: Bearer <MCP_AUTH_TOKEN>
// Ten sekret ustawiasz raz w konfiguracji custom connectora w claude.ai
// (sekcja "Request headers"), zeby nikt obcy nie mogl wywolywac tego serwera.

import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const GH_TOKEN = process.env.GH_TOKEN;
const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
const PORT = process.env.PORT || 3000;

if (!GH_TOKEN) {
  console.error("BRAK GH_TOKEN w zmiennych srodowiskowych - serwer nie wystartuje.");
  process.exit(1);
}
if (!MCP_AUTH_TOKEN) {
  console.error("BRAK MCP_AUTH_TOKEN w zmiennych srodowiskowych - serwer nie wystartuje.");
  process.exit(1);
}

// --- Pomocnik do wywolan GitHub API -----------------------------------

async function gh(path, options = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
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
