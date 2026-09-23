#!/usr/bin/env python3
"""
SessionEnd hook: wypycha zebrane bledy i podsumowanie sesji do centralnego
zbiornika w claude-code-os.

Zbiornik: galaz `telemetry` w ArturDab/ccos, dwa strumienie:
  - telemetry/YYYY-MM.jsonl          bledy narzedzi (z ccos-telemetry-collect.py)
  - telemetry/sessions/YYYY-MM.jsonl jeden rekord podsumowania na sesje (ten hook)

Galaz osierocona, NIGDY nie mergowana do main - nie zasmieca repo ani PR-ow.

Zapis idzie przez `git push` na galaz telemetry, NIE przez Contents API GitHuba:
proxy agenta w sesjach chmurowych odrzuca zapis tym kanalem ("Write access to this
GitHub API path is not permitted through this proxy"), a odczyt tym samym kanalem
dziala - dlatego awaria byla niewidoczna i zbiornik stal pusty. git push przez to
samo proxy przechodzi.

Dziala tylko, gdy w srodowisku jest token GitHuba, a sesja ma ArturDab/ccos w swoim
zakresie. Telemetria nie moze blokowac ani opozniac konca sesji, wiec kazde
niepowodzenie konczy sie cicho DLA SESJI, ale zostawia slad w pliku LOG - bez tego
nie da sie odroznic "nie bylo czego zapisac" od "zapis sie nie udal".

Podsumowanie sesji czyta transkrypt (transcript_path z payloadu hooka), nie zawiera
tresci wiadomosci - tylko: nazwe modelu, liczniki tokenow z pola "usage" (osobno
wejscie/wyjscie/cache), katalog roboczy (do grupowania per projekt), nazwy komend
(`/cos` na poczatku wiadomosci uzytkownika - jedna, krotka linia, nigdy pelna
tresc), nazwy uzytych skilli i agentow, liczbe commitow w oknie sesji oraz flage
pustego przebiegu. Format transkryptu nie jest oficjalnie udokumentowany - kazde
pole czytane defensywnie, brakujace pole = pominiete, nigdy wyjatek.

Typ sesji (routine/cowork vs interaktywna) NIE JEST udokumentowanym polem hooka -
Claude Code go nie ujawnia wprost. Uzywamy zmiennej srodowiskowej
CLAUDE_CODE_SESSION_ATTENDED jako sygnalu posredniego (1 = ktos ogladal sesje na
zywo, 0 = nikt - typowe dla routine/cowork). To HEURYSTYKA, nie kontrakt - jesli
zmienna kiedys zniknie albo zmieni znaczenie, pole session_type ma po prostu
wracac do "nieznany", nigdy nie zgadywac.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time

BUF = "/tmp/ccos-errors.jsonl"
LOG = "/tmp/ccos-telemetry.log"
REPO = "ArturDab/ccos"
BRANCH = "telemetry"
MAX_COMMAND_LEN = 40

# Twardy budzet na CALY zapis, razem z ponowieniami. Poprzednia wersja (curl, dwa
# wywolania po 20 s) nie mogla przekroczyc ~40 s; klon i push z ponowieniami moglyby
# ciagnac sie minutami i opozniac koniec sesji. Telemetria nie jest tego warta -
# po przekroczeniu budzetu odpuszczamy i zostawiamy slad w logu.
BUDGET_SECONDS = 60

# Etap 2 (wczesne zakonczenie pustego przebiegu) konczy swoja ostatnia wiadomosc
# dokladnie tym wierszem, zeby ten hook mogl oznaczyc rekord bez zadnej wlasnej
# logiki "co to jest pusty przebieg" - o tym decyduje wylacznie work-autonomous.
EMPTY_RUN_MARKER = "CCOS_EMPTY_RUN=true"

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


def log(msg):
    """Slad po niepowodzeniu, w pliku lokalnym. Nigdy nie rzuca i nigdy nie pisze na
    stdout ani stderr - hook nie moze zaklocic konca sesji."""
    try:
        stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(f"{stamp} {msg}\n")
    except Exception:
        pass


def hide_token(text, tok):
    """Git potrafi wypisac URL razem z poswiadczeniem - do logu nie trafia nigdy."""
    out = str(text or "")
    if tok:
        out = out.replace(tok, "<TOKEN>")
    return re.sub(r"https://[^@\s]*@", "https://<CREDS>@", out)[:500]


def run(cmd, cwd=None, timeout=90):
    """Zwraca (ok, stdout, stderr). Nigdy nie rzuca."""
    try:
        p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)
        return p.returncode == 0, p.stdout, p.stderr
    except Exception as exc:
        return False, "", str(exc)


def push_jsonl(fname, records, tok, message, attempts=3):
    """Doklej rekordy (jedna linia na rekord) do pliku JSONL na galezi telemetry.

    Kazda proba to swiezy plytki klon: doklejamy na koniec pliku, wiec kolizja z inna
    sesja objawia sie odrzuconym pushem, nie polaczeniem dwoch wersji pliku. Wtedy
    klonujemy jeszcze raz, juz z jej rekordami, i doklejamy swoje ponownie.

    Calosc miesci sie w BUDGET_SECONDS - kazde wywolanie gita dostaje tylko tyle
    czasu, ile z budzetu zostalo.
    """
    if not records:
        return True

    url = f"https://x-access-token:{tok}@github.com/{REPO}"
    body = "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in records)
    author = ["-c", "user.name=ccos-telemetry", "-c", "user.email=noreply@anthropic.com"]
    deadline = time.monotonic() + BUDGET_SECONDS

    def left():
        return deadline - time.monotonic()

    for attempt in range(1, attempts + 1):
        if left() < 5:
            log(f"{fname}: budzet {BUDGET_SECONDS} s wyczerpany przed proba {attempt}")
            break
        tmp = tempfile.mkdtemp(prefix="ccos-telemetry-")
        try:
            ok, _, err = run(["git", "clone", "--depth", "1", "--single-branch",
                              "--branch", BRANCH, url, tmp], timeout=left())
            if not ok:
                log(f"{fname}: klon galezi {BRANCH} nieudany "
                    f"(proba {attempt}/{attempts}): {hide_token(err, tok)}")
                continue

            path = os.path.join(tmp, fname)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "a", encoding="utf-8") as f:
                f.write(body)

            ok, _, err = run(["git", "add", "--", fname], cwd=tmp)
            if ok:
                ok, _, err = run(["git"] + author + ["commit", "-q", "-m", message],
                                 cwd=tmp)
            if not ok:
                log(f"{fname}: commit nieudany (proba {attempt}/{attempts}): "
                    f"{hide_token(err, tok)}")
                continue

            ok, _, err = run(["git", "push", "-q", "origin", f"HEAD:{BRANCH}"],
                             cwd=tmp, timeout=max(left(), 5))
            if ok:
                return True
            log(f"{fname}: push nieudany (proba {attempt}/{attempts}): "
                f"{hide_token(err, tok)}")
        finally:
            shutil.rmtree(tmp, ignore_errors=True)

    log(f"{fname}: porzucam {len(records)} rekordow po {attempts} probach")
    return False


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
    # Bufor kasujemy dopiero po udanym zapisie. Przy nieudanym rekordy zostaja
    # w /tmp i pojedzie je nastepna sesja w tym samym kontenerze.
    if not push_jsonl(fname, records, tok, f"chore(telemetry): +{len(records)} bledow"):
        return

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


def detect_session_type():
    """Heurystyka z CLAUDE_CODE_SESSION_ATTENDED - niepotwierdzone oficjalnie,
    patrz komentarz na gorze pliku. Brak zmiennej albo nieznana wartosc = "nieznany".
    """
    attended = os.environ.get("CLAUDE_CODE_SESSION_ATTENDED")
    if attended == "1":
        return "interaktywna"
    if attended == "0":
        return "nienadzorowana"
    return "nieznany"


def count_commits_since(cwd, start_ts_iso):
    """Liczba commitow w cwd od poczatku sesji. Best-effort: brak repo, brak
    gita albo zly format daty -> 0, nigdy wyjatek."""
    if not start_ts_iso or not cwd:
        return 0
    try:
        out = subprocess.run(
            ["git", "-C", cwd, "rev-list", "--count", f"--since={start_ts_iso}", "HEAD"],
            capture_output=True, text=True, timeout=10,
        )
        return int(out.stdout.strip()) if out.returncode == 0 and out.stdout.strip().isdigit() else 0
    except Exception:
        return 0


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
        "session_type": detect_session_type(),
        "models": {},          # {model: {input,output,cache_read,cache_creation}_tokens}
        "commands": {},        # {nazwa: liczba wystapien}
        "skills": {},          # {nazwa: liczba wywolan}
        "agents": {},          # {subagent_type: liczba wywolan}
        "commits_count": 0,
        "empty_run": False,
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
                    model,
                    {"input_tokens": 0, "output_tokens": 0,
                     "cache_read_tokens": 0, "cache_creation_tokens": 0},
                )
                try:
                    bucket["input_tokens"] += int(usage.get("input_tokens") or 0)
                    bucket["output_tokens"] += int(usage.get("output_tokens") or 0)
                    bucket["cache_read_tokens"] += int(usage.get("cache_read_input_tokens") or 0)
                    bucket["cache_creation_tokens"] += int(usage.get("cache_creation_input_tokens") or 0)
                except Exception:
                    pass

            content = msg.get("content")
            if isinstance(content, list):
                for block in content:
                    if not isinstance(block, dict) or block.get("type") != "tool_use":
                        continue
                    name = block.get("name")
                    tool_input = block.get("input") or {}
                    if not isinstance(tool_input, dict):
                        continue
                    if name == "Skill":
                        skill_name = tool_input.get("skill") or tool_input.get("name")
                        if skill_name:
                            summary["skills"][skill_name] = summary["skills"].get(skill_name, 0) + 1
                    elif name in ("Task", "Agent"):
                        agent_name = tool_input.get("subagent_type") or tool_input.get("subagent") or "?"
                        summary["agents"][agent_name] = summary["agents"].get(agent_name, 0) + 1
                # Marker pustego przebiegu (etap 2) - szukamy w tekscie tej wiadomosci.
                for block in content:
                    if isinstance(block, dict) and block.get("type") == "text":
                        text_val = block.get("text") or ""
                        if EMPTY_RUN_MARKER in text_val:
                            summary["empty_run"] = True
            elif isinstance(content, str) and EMPTY_RUN_MARKER in content:
                summary["empty_run"] = True

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

    summary["commits_count"] = count_commits_since(cwd, summary["start_ts"])

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
        log("brak tokenu GitHuba (GH_TOKEN/GITHUB_TOKEN) - nic nie zapisano")
        sys.exit(0)   # brak tokenu nie moze wywrocic konca sesji

    try:
        payload = json.load(sys.stdin)
    except Exception:
        payload = {}

    flush_errors(tok)
    flush_session_summary(tok, payload)

    sys.exit(0)


if __name__ == "__main__":
    main()
