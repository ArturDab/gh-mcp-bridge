#!/usr/bin/env python3
"""
PostToolUse hook: zbiera bledy narzedzi w trakcie sesji.

Sesje Claude Code w chmurze sa efemeryczne - kontener znika, wiec log lokalny jest
bezuzyteczny. Ten hook buforuje bledy w /tmp, a hook SessionEnd (ccos-telemetry-flush.py)
wypycha paczke do centralnego zbiornika w claude-code-os.

REDAKCJA JEST KRYTYCZNA: komendy potrafia zawierac tokeny i hasla. Wszystko przechodzi
przez scrub() PRZED zapisem, nigdy przy analizie. Lepiej wyciac za duzo niz za malo.
"""
import json
import os
import re
import sys
import time

BUF = "/tmp/ccos-errors.jsonl"
MAX_RECORDS = 200          # bezpiecznik na petle w sesji
MAX_LEN = 400              # obcinamy dlugie komendy i stack trace

# Wzorce sekretow. Kolejnosc ma znaczenie: najpierw dlugie/specyficzne.
SECRET_PATTERNS = [
    (re.compile(r"github_pat_[A-Za-z0-9_]+"), "<GITHUB_PAT>"),
    (re.compile(r"gh[pousr]_[A-Za-z0-9]{20,}"), "<GITHUB_TOKEN>"),
    (re.compile(r"AIza[A-Za-z0-9_\-]{20,}"), "<GOOGLE_KEY>"),
    (re.compile(r"AQ\.[A-Za-z0-9_\-]{20,}"), "<GOOGLE_KEY>"),
    (re.compile(r"sk-[A-Za-z0-9_\-]{20,}"), "<API_KEY>"),
    (re.compile(r"xox[abposr]-[A-Za-z0-9\-]+"), "<SLACK_TOKEN>"),
    (re.compile(r"eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+"), "<JWT>"),
    (re.compile(r"(?i)\b(bearer)\s+\S+"), r"\1 <REDACTED>"),
    (re.compile(r"(?i)(pass(word)?|passwd|secret|token|api[_-]?key)\s*[=:]\s*\S+"), r"\1=<REDACTED>"),
    (re.compile(r"(?i)(-u|--user)\s+\S+:\S+"), r"\1 <USER:PASS>"),
    (re.compile(r"\b[a-zA-Z][a-zA-Z0-9+.-]*://[^:/\s]+:[^@/\s]+@"), "<PROTO>://<CREDS>@"),
    # Ostatnia linia obrony: dlugie ciagi base64-podobne, ktore moga byc sekretem.
    (re.compile(r"\b[A-Za-z0-9+/]{40,}={0,2}\b"), "<LONG_OPAQUE_STRING>"),
]


def scrub(text):
    if not text:
        return ""
    out = str(text)
    for pat, repl in SECRET_PATTERNS:
        out = pat.sub(repl, out)
    return out[:MAX_LEN]


def command_shape(cmd):
    """Zwraca ksztalt komendy (pierwsze 2 tokeny), nie jej tresc.

    'gh pr merge 123 --squash' -> 'gh pr'. Wystarczy do klastrowania, a nie niesie danych.
    """
    if not cmd:
        return "?"
    parts = str(cmd).strip().split()
    return " ".join(parts[:2]) if parts else "?"


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        sys.exit(0)   # hook nigdy nie moze wywrocic sesji

    resp = payload.get("tool_response") or {}
    tool = payload.get("tool_name", "?")
    tool_input = payload.get("tool_input") or {}

    # Interesuja nas TYLKO bledy.
    is_error = False
    if isinstance(resp, dict):
        if resp.get("is_error") or resp.get("error"):
            is_error = True
        rc = resp.get("returncode", resp.get("exit_code"))
        if isinstance(rc, int) and rc != 0:
            is_error = True
    if not is_error:
        sys.exit(0)

    # Bezpiecznik: nie rosnij w nieskonczonosc.
    if os.path.exists(BUF):
        try:
            with open(BUF, encoding="utf-8") as f:
                if sum(1 for _ in f) >= MAX_RECORDS:
                    sys.exit(0)
        except Exception:
            pass

    stderr = ""
    if isinstance(resp, dict):
        stderr = resp.get("stderr") or resp.get("error") or ""
        if isinstance(stderr, (dict, list)):
            stderr = json.dumps(stderr)

    record = {
        "ts": int(time.time()),
        "repo": os.path.basename(payload.get("cwd") or os.getcwd()),
        "tool": tool,
        "shape": command_shape(tool_input.get("command")) if tool == "Bash" else tool,
        "err": scrub(stderr).strip().splitlines()[0] if scrub(stderr).strip() else "(brak stderr)",
    }

    try:
        with open(BUF, "a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except Exception:
        pass

    sys.exit(0)


if __name__ == "__main__":
    main()
