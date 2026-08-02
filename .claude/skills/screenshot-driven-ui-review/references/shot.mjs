// Helper zrzutow: stabilne screenshoty desktop + mobile.
// Uzycie: node shot.mjs <url|sciezka.html> [outdir]
// Wymaga zainstalowanej binarki Chromium (patrz preflight.sh). Pakiet npm
// (playwright/playwright-core) NIE musi byc zaleznoscia repo - jak go brak,
// dociagamy sterownik bez zapisu do package.json (--no-save), bo binarka
// przegladarki != biblioteka sterujaca.
import { mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

async function loadChromium() {
  for (const m of ['playwright', 'playwright-core']) {
    try { return (await import(m)).chromium; } catch { /* nieobecny - probuj dalej */ }
  }
  execSync('npm i --no-save playwright-core', { stdio: 'inherit' });
  return (await import('playwright-core')).chromium;
}

// Binarka z poziomu srodowiska: CHROME_PATH, inaczej glob PLAYWRIGHT_BROWSERS_PATH.
function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/ms-playwright';
  try {
    const dir = readdirSync(base).filter(d => d.startsWith('chromium-')).sort().pop();
    if (dir) {
      const p = `${base}/${dir}/chrome-linux/chrome`;
      if (existsSync(p)) return p;
    }
  } catch { /* brak katalogu - zostaw domyslna rozdzielczosc playwrighta */ }
  return null;
}

const chromium = await loadChromium();
const exe = findChrome();
const launchOpts = exe ? { executablePath: exe } : {};

const target = process.argv[2];
const outdir = process.argv[3] || '/tmp/shots';
if (!target) { console.error('Podaj URL albo sciezke pliku HTML.'); process.exit(1); }
mkdirSync(outdir, { recursive: true });
const url = /^https?:\/\//.test(target) ? target : 'file://' + resolve(target);

const viewports = [['desktop', 1440, 900], ['mobile', 390, 844]];
const browser = await chromium.launch(launchOpts);
for (const [name, width, height] of viewports) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  // wylacz animacje/tranzycje i caret -> stabilny kadr
  await page.addInitScript(() => {
    const s = document.createElement('style');
    s.textContent = '*{animation:none!important;transition:none!important;caret-color:transparent!important}';
    (document.head || document.documentElement).appendChild(s);
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  const out = `${outdir}/${name}.png`;
  await page.screenshot({ path: out, fullPage: true });
  console.log(out);
  await ctx.close();
}
await browser.close();
