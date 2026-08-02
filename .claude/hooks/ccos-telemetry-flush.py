#!/usr/bin/env python3
"""
SessionEnd hook: wypycha zebrane bledy do centralnego zbiornika w claude-code-os.

Zbiornik: galaz `telemetry` w ArturDab/claude-code-os, plik telemetry/YYYY-MM.jsonl.
Galaz osierocona, NIGDY nie mergowana do main - nie zasmieca repo ani PR-ow.

Dziala tylko, gdy w srodowisku jest token GitHuba. Bez tokenu konczy sie po cichu -
telemetria nie moze blokowac ani opozniac konca sesji.
"""
import base64
import json
import os
import subprocess
import sys
import time

BUF = "/tmp/ccos-errors.jsonl"
REPO = "ArturDab/claude-code-os"
BRANCH = "telemetry"


def token():
    for var in ("GH_TOKEN", "GITHUB_TOKEN"):
        if os.environ.get(var):
            return os.environ[var]
    for path in ("~/.ght/token", "~/.ght"):
        p = os.path.expanduser(path)
        if os.path.isfile(p):
            try:
                t = open(p, encoding="utf-8").read().strip()
                if t:
                    return t
            except Exception:
                pass
    return None


def api(method, path, tok, body=None):
    cmd = ["curl", "-s", "-m", "15", "-X", method,
           "-H", f"Authorization: token {tok}",
           f"https://api.github.com{path}"]
    if body is not None:
        cmd += ["-d", json.dumps(body)]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=20).stdout
        return json.loads(out) if out.strip() else {}
    except Exception:
        return {}


def main():
    if not os.path.exists(BUF) or os.path.getsize(BUF) == 0:
        sys.exit(0)

    tok = token()
    if not tok:
        sys.exit(0)   # brak tokenu = cisza, nie blad

    try:
        records = [json.loads(l) for l in open(BUF, encoding="utf-8") if l.strip()]
    except Exception:
        sys.exit(0)
    if not records:
        sys.exit(0)

    fname = f"telemetry/{time.strftime('%Y-%m')}.jsonl"
    path = f"/repos/{REPO}/contents/{fname}?ref={BRANCH}"
    cur = api("GET", path, tok)

    existing = ""
    sha = None
    if isinstance(cur, dict) and cur.get("content"):
        try:
            existing = base64.b64decode(cur["content"]).decode("utf-8", "replace")
            sha = cur["sha"]
        except Exception:
            pass

    new = existing + "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in records)

    body = {
        "message": f"chore(telemetry): +{len(records)} bledow",
        "content": base64.b64encode(new.encode()).decode(),
        "branch": BRANCH,
    }
    if sha:
        body["sha"] = sha

    api("PUT", f"/repos/{REPO}/contents/{fname}", tok, body)

    try:
        os.remove(BUF)
    except Exception:
        pass

    sys.exit(0)


if __name__ == "__main__":
    main()
