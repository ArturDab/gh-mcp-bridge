// Wybor binarki Chromium dla Playwrighta uzywanego przez bug-scan.js. Kolejnosc:
//   1. PLAYWRIGHT_CHROMIUM_PATH (env, override reczny - literalna sciezka do binarki)
//   2. .browsers/chrome-linux64/chrome (pobrany lokalnie w projekcie docelowym)
//   3. $PLAYWRIGHT_BROWSERS_PATH/chromium-*/chrome-linux/chrome - standard Playwrighta
//      (glob po numerze rewizji; to jest kanoniczna sciezka wg docs/ECOSYSTEM.md #12
//      w repo claude-code-os, domyslnie /opt/ms-playwright w sesjach Claude Code web)
//   4. /opt/pw-browsers/chromium - dodatkowy systemowy fallback (obserwowany w niektorych
//      zdalnych sesjach Claude Code jako gotowy symlink do tej samej binarki co #3)
// Brak wszystkich -> resolveChrome() zwraca null, wolajacy sam zglasza czytelny
// blad zamiast crashowac surowym wyjatkiem Playwrighta.
'use strict';
const path = require('path');
const fs = require('fs');

const VENDORED_CHROME = path.join(__dirname, '..', '.browsers', 'chrome-linux64', 'chrome');
const LEGACY_SYSTEM_CHROME = '/opt/pw-browsers/chromium';

// Playwright instaluje pod $PLAYWRIGHT_BROWSERS_PATH/chromium-<numer rewizji>/chrome-linux/chrome
// - numer rewizji zmienia sie z wersja Playwrighta, wiec trzeba go wyszukac, nie zgadywac.
function findVersionedChrome(browsersPath) {
  if (!browsersPath) return null;
  let entries;
  try { entries = fs.readdirSync(browsersPath); } catch (e) { return null; }
  const rev = entries.filter((e) => /^chromium-\d+$/.test(e)).sort().reverse()[0];
  if (!rev) return null;
  const candidate = path.join(browsersPath, rev, 'chrome-linux', 'chrome');
  return fs.existsSync(candidate) ? candidate : null;
}

function resolveChrome() {
  if (process.env.PLAYWRIGHT_CHROMIUM_PATH && fs.existsSync(process.env.PLAYWRIGHT_CHROMIUM_PATH)) return process.env.PLAYWRIGHT_CHROMIUM_PATH;
  if (fs.existsSync(VENDORED_CHROME)) return VENDORED_CHROME;
  const versioned = findVersionedChrome(process.env.PLAYWRIGHT_BROWSERS_PATH) || findVersionedChrome('/opt/ms-playwright');
  if (versioned) return versioned;
  if (fs.existsSync(LEGACY_SYSTEM_CHROME)) return LEGACY_SYSTEM_CHROME;
  return null;
}

module.exports = { resolveChrome, findVersionedChrome };
