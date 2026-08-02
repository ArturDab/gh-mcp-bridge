#!/usr/bin/env bash
# Deterministyczny preflight przeglądarki dla sesji Claude Code (lokalnie i w chmurze).
# Cel: albo Chromium działa, albo dostajesz DOKŁADNĄ instrukcję odblokowania - zero zgadywania.
set -uo pipefail
log(){ printf '%s\n' "$*" >&2; }

BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/ms-playwright}"
INSTALL_LOG=/tmp/pw_install.log

_diagnose_install() {
  local f="$1"
  if grep -qiE 'host_not_allowed|ENOTFOUND|ETIMEDOUT|name not resolved|ERR_NAME_NOT_RESOLVED|refused to connect|cannot connect' "$f" 2>/dev/null; then
    log "DIAGNOZA: Blokada sieci - CDN Playwrighta (storage.googleapis.com) niedostępny."
    log "  -> To robi Artur w ustawieniach środowiska (claude.ai/code → Edit environment):"
    log "     Network access: Full  LUB  Custom + host: storage.googleapis.com"
  elif grep -qiE 'error while loading shared libraries|\.so\.' "$f" 2>/dev/null; then
    log "DIAGNOZA: Brakuje bibliotek .so - setup script nie używał --with-deps."
    log "  -> To robi Artur: zaktualizuj setup script środowiska:"
    log "     npx --yes playwright install --with-deps chromium"
  else
    local blocked
    blocked=$(grep -hoiE '[a-z0-9.-]+\.(dev|net|com|org|io)' "$f" 2>/dev/null \
              | grep -viE 'github|ubuntu|npmjs|nodejs' | sort -u | head -3 | tr '\n' ' ')
    log "DIAGNOZA: Nieznany błąd instalacji. Pełny log: $INSTALL_LOG"
    [ -n "$blocked" ] && log "  Potencjalnie zablokowane hosty: $blocked (dopisz do allowlisty środowiska)"
  fi
}

_diagnose_smoke() {
  local smoke="$1"
  if printf '%s' "$smoke" | grep -qiE 'Executable.*does not exist|browserType\.launch.*executable'; then
    log "DIAGNOZA: Chromium binarny brakuje (instalacja nie dotarła na dysk)."
    log "  -> Sprawdź sieć (CDN) albo przebuduj snapshot środowiska z poprawionym setup scriptem."
  elif printf '%s' "$smoke" | grep -qiE 'error while loading shared libraries|\.so\.'; then
    log "DIAGNOZA: Brakuje biblioteki .so systemowej."
    log "  -> To robi Artur: setup script środowiska musi zawierać --with-deps:"
    log "     npx --yes playwright install --with-deps chromium"
  elif printf '%s' "$smoke" | grep -qiE 'Target closed|Protocol error.*Target|killed|signal 9|OOM|out of memory|Cannot allocate'; then
    log "DIAGNOZA: OOM - Chromium zabity przez system (za mało RAM w środowisku)."
    log "  -> Zgłoś Arturowi: środowisko potrzebuje więcej pamięci (ustawienia CC web)."
  elif printf '%s' "$smoke" | grep -qiE "Cannot find module '?playwright|MODULE_NOT_FOUND"; then
    log "DIAGNOZA: Binarka jest, ale brak biblioteki sterujacej (pakiet npm playwright/playwright-core)."
    log "  -> Doinstalowano ja --no-save w tej sesji; trwale: dodaj \"playwright-core\" do devDependencies (profil web-ui)."
  else
    log "DIAGNOZA: Nieznany błąd uruchomienia Chromium."
  fi
}

# 1) Idempotency: skip download if Chromium binary already present in PLAYWRIGHT_BROWSERS_PATH.
#    playwright install sprawdza wersję przez sieć nawet gdy binarka jest - to pomijamy całkowicie.
if ls "$BROWSERS_PATH"/chromium-*/chrome-linux/chrome 2>/dev/null | grep -q .; then
  log "PREFLIGHT: Chromium znaleziony w $BROWSERS_PATH - pomijam instalację."
else
  log "PREFLIGHT: Chromium nie znaleziony w $BROWSERS_PATH - instaluję z zależnościami systemowymi..."
  if ! npx --yes playwright install --with-deps chromium >"$INSTALL_LOG" 2>&1; then
    log "PREFLIGHT: instalacja nieudana."
    _diagnose_install "$INSTALL_LOG"
    exit 1
  fi
  log "PREFLIGHT: instalacja zakończona."
fi

# 2) Biblioteka sterujaca (pakiet npm) != binarka. Gdy ani playwright, ani
#    playwright-core nie sa rozwiazywalne z repo, dociagamy sterownik bez zapisu
#    do package.json - inaczej require("playwright") rzuca MODULE_NOT_FOUND mimo
#    obecnej binarki. Trwale: "playwright-core" w devDependencies (profil web-ui).
if ! node -e 'try{require.resolve("playwright")}catch(e){require.resolve("playwright-core")}' 2>/dev/null; then
  log "PREFLIGHT: brak pakietu playwright/playwright-core - dociagam sterownik (--no-save)..."
  if ! npm i --no-save playwright-core >>"$INSTALL_LOG" 2>&1; then
    log "PREFLIGHT: nie udalo sie doinstalowac playwright-core. Log: $INSTALL_LOG"
    log "  -> Trwale: dodaj \"playwright-core\" do devDependencies repo (profil web-ui)."
    exit 1
  fi
fi

# 3) Smoke test: realnie odpal przeglądarkę i wyrenderuj stronę.
#    Sterownik: playwright albo playwright-core. Binarka: CHROME_PATH gdy ustawiony.
SMOKE=$(node -e 'const path=require("path");function load(){for(const m of ["playwright","playwright-core"]){try{return require(m)}catch(e){}}return null}(async()=>{const pw=load();if(!pw){console.log("FAIL:Cannot find module playwright");process.exit(1)}const{chromium}=pw;const opts=process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{};try{const b=await chromium.launch(opts);const p=await b.newPage();await p.setContent("<h1>ok</h1>");await p.screenshot({path:"/tmp/pw_smoke.png"});await b.close();console.log("OK")}catch(e){console.log("FAIL:"+e.message);process.exit(1)}})()' 2>&1)

if printf '%s' "$SMOKE" | grep -q '^OK'; then
  log "PREFLIGHT: przeglądarka gotowa."
  exit 0
fi

# 4) Smoke nieudany -> klasyfikuj tryb awarii, wypisz kroki odblokowania.
log "PREFLIGHT: smoke test nieudany."
log "Smoke output: $SMOKE"
log ""
_diagnose_smoke "$SMOKE"
log ""
log "Ogólne odblokowanie (claude.ai/code → selektor środowiska → Edit):"
log "  1) Network: Full (albo Custom + storage.googleapis.com)"
log "  2) Setup script:"
log "       export PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright"
log "       npx --yes playwright install --with-deps chromium"
log "  3) Env var: PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright"
log "  Zmiana setup scriptu/sieci przebudowuje snapshot - kolejne sesje dziedziczą."
exit 1
