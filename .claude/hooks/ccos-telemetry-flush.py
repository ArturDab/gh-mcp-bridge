#!/usr/bin/env python3
"""
SessionEnd hook: wypycha zebrane bledy i podsumowanie sesji do centralnego
zbiornika w claude-code-os.

Zbiornik: galaz `telemetry` w ArturDab/ccos, dwa strumienie:
  - telemetry/YYYY-MM.jsonl          bledy narzedzi (z ccos-telemetry-collect.py)
  - telemetry/sessions/YYYY-MM.jsonl jeden rekord podsumowania na sesje (ten hook)

Galaz osierocona, NIGDY nie mergowana do main - nie zasmieca repo ani PR-ow.

Dziala tylko, gdy w srodowisku jest token GitHuba. Bez tokenu konczy sie po cichu -
telemetria nie moze blokowac ani opozniac konca sesji.

Podsumowanie sesji czyta transkrypt (transcript_path z payloadu hooka), nie zawiera
tresci wiadomosci - tylko: nazwe modelu, liczniki tokenow z pola "usage", katalog
roboczy (do grupowania per projekt) i nazwy komend (`/cos` na poczatku wiadomosci
uzytkownika - jedna, krotka linia, nigdy pelna tresc). Format transkryptu nie jest
oficjalnie udokumentowany - kazde pole czytane defensywnie, brakujace pole = pominiete,
nigdy wyjatek.
"""
import base64
import json
import os
import re
import subprocess
import sys
import time

BUF = "/tmp/ccos-errors.jsonl"
REPO = "ArturDab/ccos"
BRANCH = "telemetry"
MAX_COMMAND_LEN = 40

COMMAND_PATTERN = re.compile(r"^/([a-z][a-z0-9-]{0,40})\b")


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


def push_jsonl(fname, records, tok, message):
    """Doklej rekordy (jedna linia na rekord) do pliku JSONL na galezi telemetry."""
    if not records:
        return
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
        "message": message,
        "content": base64.b64encode(new.encode()).decode(),
        "branch": BRANCH,
    }
    if sha:
        body["sha"] = sha

    api("PUT", f"/repos/{REPO}/contents/{fname}", tok, body)


def flush_errors(tok):
    if not os.path.exists(BUF) or os.path.getsize(BUF) == 0:
        return
    try:
        records = [json.loads(l) for l in open(BUF, encoding="utf-8") if l.strip()]
    except Exception:
        return
    if not records:
        return

    fname = f"telemetry/{time.strftime('%Y-%m')}.jsonl"
    push_jsonl(fname, records, tok, f"chore(telemetry): +{len(records)} bledow")

    try:
        os.remove(BUF)
    except Exception:
        pass


def extract_command(text):
    """Pierwsza linia tekstu uzytkownika jesli zaczyna sie od /nazwa - nic wiecej."""
    if not isinstance(text, str):
        return None
    first_line = text.strip().splitlines()[0] if text.strip() else ""
    m = COMMAND_PATTERN.match(first_line)
    return m.group(1)[:MAX_COMMAND_LEN] if m else None


def build_session_summary(payload):
    """Czyta transcript_path (jesli jest) i buduje jeden rekord podsumowania.

    Kazdy krok osobno w try/except - brakujace albo nieznane pole nigdy nie
    wywraca hooka, po prostu zawezajac to, co uda sie policzyc.
    """
    transcript_path = payload.get("transcript_path")
    cwd = payload.get("cwd") or os.getcwd()
    repo = os.path.basename(cwd)

    summary = {
        "ts": int(time.time()),
        "repo": repo,
        "session_id": payload.get("session_id"),
        "models": {},          # {model: {"input_tokens": n, "output_tokens": n}}
        "commands": {},        # {nazwa: liczba wystapien}
        "start_ts": None,
        "end_ts": None,
    }

    if not transcript_path or not os.path.isfile(transcript_path):
        return summary if summary["session_id"] else None

    try:
        with open(transcript_path, encoding="utf-8") as f:
            lines = f.readlines()
    except Exception:
        return summary

    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            rec = json.loads(line)
        except Exception:
            continue

        ts_raw = rec.get("timestamp")
        if ts_raw:
            if summary["start_ts"] is None:
                summary["start_ts"] = ts_raw
            summary["end_ts"] = ts_raw

        rtype = rec.get("type")
        msg = rec.get("message") if isinstance(rec.get("message"), dict) else None
        if not msg:
            continue

        if rtype == "assistant":
            model = msg.get("model")
            usage = msg.get("usage") or {}
            if model and isinstance(usage, dict):
                bucket = summary["models"].setdefault(
                    model, {"input_tokens": 0, "output_tokens": 0}
                )
                try:
                    bucket["input_tokens"] += int(usage.get("input_tokens") or 0)
                    bucket["input_tokens"] += int(usage.get("cache_creation_input_tokens") or 0)
                    bucket["input_tokens"] += int(usage.get("cache_read_input_tokens") or 0)
                    bucket["output_tokens"] += int(usage.get("output_tokens") or 0)
                except Exception:
                    pass

        elif rtype == "user":
            content = msg.get("content")
            text = content if isinstance(content, str) else None
            if text is None and isinstance(content, list):
                for block in content:
                    if isinstance(block, dict) and block.get("type") == "text":
                        text = block.get("text")
                        break
            cmd = extract_command(text)
            if cmd:
                summary["commands"][cmd] = summary["commands"].get(cmd, 0) + 1

    if not summary["models"] and not summary["commands"] and not summary["start_ts"]:
        return None
    return summary


def flush_session_summary(tok, payload):
    try:
        summary = build_session_summary(payload)
    except Exception:
        summary = None
    if not summary:
        return
    fname = f"telemetry/sessions/{time.strftime('%Y-%m')}.jsonl"
    push_jsonl(fname, [summary], tok, "chore(telemetry): +1 podsumowanie sesji")


def main():
    tok = token()
    if not tok:
        sys.exit(0)   # brak tokenu = cisza, nie blad

    try:
        payload = json.load(sys.stdin)
    except Exception:
        payload = {}

    flush_errors(tok)
    flush_session_summary(tok, payload)

    sys.exit(0)


if __name__ == "__main__":
    main()
