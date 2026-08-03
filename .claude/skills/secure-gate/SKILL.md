---
name: secure-gate
description: "Ukryj całą apkę za jednym hasłem jako prywatny/pre-launch przełącznik (Railway lub gdziekolwiek). Trigger: ukryj apkę, schowaj preview, prywatny deploy, gate, bramka hasłowa, hasło dostępu, APP_PASSWORD, SESSION_SECRET, ekran logowania, password wall, internal-only, make it private. Express/Next.js/Python (FastAPI/Flask)."
disable-model-invocation: true
---

# secure-gate

Cienka bramka hasłowa w kodzie samej aplikacji. Railway Hobby nie ma wbudowanego
auth, więc ukrycie apki = kilka linii kodu sterowanych jedną zmienną env.

Buduj bramkę **dokładnie tak, jak jest w Pulsarze** (`server.js` + ekran logowania
w `public/index.html`). To jest kanon - nie wymyślaj wariantu z inline-HTML wallem.
Bramka pilnuje danych (API), a ekran logowania jest częścią frontu aplikacji, ze
stałym kanonem wizualnym (jasny, font Geist) jednakowym w każdej apce.

## Przełącznik

Jedna zmienna env to przełącznik public/private:

- `APP_PASSWORD` ustawione  -> cała apka schowana za hasłem.
- `APP_PASSWORD` puste + redeploy -> apka w pełni publiczna.

Działa identycznie na preview i produkcji. Żeby coś opublikować: usuń `APP_PASSWORD`
z danego środowiska i zredeployuj. Żeby znów schować: ustaw je z powrotem.

## Kontrakt (taki sam w każdej apce)

Trzy zmienne env:

- `APP_PASSWORD` - przełącznik public/private (puste => publiczna).
- `APP_LOGIN` - login (domyślnie `ArturDab`). Jedna wspólna tożsamość.
- `SESSION_SECRET` - stały, mocny losowy string do podpisu ciasteczka. **Musi być
  ustawiony w środowisku.** Kod ma fallback na losowy sekret per-proces tylko dla
  lokalnego dev; w środowisku bez `SESSION_SECRET` każdy redeploy wylogowuje wszystkich.

Sesja **związana z loginem**. Token to `<random>|<APP_LOGIN>.<hmac>` podpisany
HMAC-SHA256 sekretem. Wiązanie z loginem sprawia, że zmiana/wprowadzenie `APP_LOGIN`
unieważnia wcześniejsze ciasteczka (w tym stary format „tylko hasło" sprzed wiązania).
Weryfikacja sygnatury przez `timingSafeEqual`.

Ciasteczko `<app>_session` (nazwij po aplikacji, np. `pulsar_session`):
`HttpOnly; SameSite=Strict; Path=/; Max-Age=7776000` (90 dni).

Endpointy auth są **JSON-owe**, nie form-encoded inline:

- `GET /api/auth/check` -> `{ok:true}` albo `401`.
- `POST /api/auth/login` z `{username, password}` (JSON) -> ustawia ciasteczko.
- `POST /api/auth/logout` -> czyści ciasteczko.

`authMiddleware` pilnuje **tylko `/api`** (dane). Statyki i powłoka HTML lecą wolno -
front sam pyta `/api/auth/check` i pokazuje swój ekran logowania, gdy dostanie 401.

Ekran logowania **żyje we froncie aplikacji**: ukryta nakładka pokazywana, gdy
`/api/auth/check` zwróci 401; prawdziwy `<form>` z polami username
(`autocomplete=username`) i password (`autocomplete=current-password`), żeby Chrome
proponował zapis. `doLogin` POST-uje JSON na `/api/auth/login`, po sukcesie zapisuje
`PasswordCredential` i robi `location.reload()`.

## Reguły, które psują deploy albo UX

1. NIGDY nie bramkuj healthchecka. Railway pinguje `healthcheckPath`. Jeśli bramka
   odpowie mu 401, healthcheck nigdy nie przejdzie i deploy jest FAILED, choć apka
   działa. Bramkujesz tylko `/api`, więc statyczny healthcheck (np. `/`) jest wolny;
   jeśli healthcheck celuje w `/api/...`, wyłącz tę ścieżkę z bramki.
2. Ekran logowania = front aplikacji, w stałym kanonie wizualnym (jasny, Geist) -
   nie inline-HTML wall. Bramka oddaje czyste `401 JSON` na fetch/XHR, a front
   pokazuje swój ekran.
   Jeśli bramka oddawałaby HTML logowania na fetch danych, SPA renderuje „nie udało
   się pobrać danych / błąd ładowania" zamiast czystego ekranu logowania.
3. `SESSION_SECRET` ustawiony w środowisku (fallback losowy jest tylko dla dev).
4. Sesja związana z `APP_LOGIN` - inaczej zmiana loginu nie unieważnia starych ciastek.

## Wygląd (kanon wizualny - taki sam w każdej apce)

Bramka ma **stałą, własną tożsamość wizualną**, niezależną od motywu apki: zawsze
**jasna (light)**, font **Geist**, jedna wyśrodkowana karta na pełnoekranowym tle,
clean i prosty, bez ozdobników. Świadomie **nie dziedziczy tokenów apki** - ten sam
ekran logowania wygląda identycznie wszędzie (Express, Next, Python), także gdy sama
apka jest dark. Style są self-contained.

Cechy obowiązkowe (to one robią „clean + wygodny"):
- prawdziwy `<form>` z polami username (`autocomplete=username`) i password
  (`autocomplete=current-password`) -> Chrome sam proponuje zapis i autouzupełnia;
- po sukcesie `navigator.credentials.store(new PasswordCredential(...))` -> jawna
  sugestia zapisu w Chrome (jest już w `doLogin`);
- ciasteczko `Max-Age=7776000` (90 dni) -> zapamiętane logowanie bez ponawiania;
- autofocus na pierwszym pustym polu po pokazaniu ekranu (jest już w `initApp`).

Wczytaj font Geist raz w `<head>` powłoki (degraduje się do `system-ui`, gdy CDN
nie wstanie - więc bramka działa nawet offline):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
```

Wklej te style raz (np. w `<style>` powłoki). Stała jasna paleta, bez zależności od
tokenów apki:

```css
.login-screen{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;background:#fafafa;color:#171717;font-family:'Geist',system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.login-card{width:380px;max-width:100%;padding:44px 36px;text-align:center;background:#fff;border:1px solid #e5e5e5;border-radius:14px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 8px 30px rgba(0,0,0,.06)}
.login-sub{font-size:13px;color:#71717a;margin-bottom:26px}
.login-input{display:block;width:100%;box-sizing:border-box;margin:0 0 8px;padding:11px 12px;text-align:center;font-size:16px;color:#171717;background:#fff;border:1px solid #e5e5e5;border-radius:10px;outline:none;font-family:inherit}
.login-input::placeholder{color:#a1a1aa}
.login-input:focus{border-color:#171717}
.login-err{color:#dc2626;font-size:13px;margin:4px 0 8px;min-height:20px}
.login-btn{width:100%;padding:11px 0;border:0;border-radius:10px;background:#171717;color:#fff;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit}
.login-btn:hover{background:#000}
```

Markup ekranu (ukryty domyślnie przez `display:none` w `.login-screen`; `initApp`
pokazuje go ustawiając `display:flex`):

```html
<div id="login-screen" class="login-screen">
  <div class="login-card">
    <div class="login-sub">Nazwa aplikacji</div>
    <form id="loginForm" onsubmit="return doLogin(event)">
      <input id="loginUser" type="text" name="username" class="login-input" autocomplete="username" placeholder="Login" aria-label="Login">
      <input id="loginPass" type="password" name="password" class="login-input" autocomplete="current-password" placeholder="Hasło dostępu" aria-label="Hasło dostępu">
      <div id="loginErr" class="login-err"></div>
      <button type="submit" class="login-btn">Zaloguj się</button>
    </form>
  </div>
</div>
```

Ten sam markup, te same style i to samo `doLogin`/`initApp` lecą do każdej apki
(Express, Next, Python) - różni się tylko backend. Bez emoji, bez ikon poza
ewentualnym inline-SVG logo apki nad `.login-sub`.

## Express + SPA (kanon - dokładnie jak Pulsar)

Backend w `server.js`. Auth tuż przed zamontowaniem routera API:

```js
const crypto = require('crypto');

// --- Auth ---
const APP_PASSWORD = process.env.APP_PASSWORD || '';
const APP_LOGIN = process.env.APP_LOGIN || 'ArturDab';
const SESSION_SECRET = process.env.SESSION_SECRET || '';   // MUSI byc ustawiony w env (jak w Next/Python)

function signToken(t) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(t).digest('hex');
}
function createSession() {
  // Sesja zwiazana z aktualnym loginem: zmiana/wprowadzenie APP_LOGIN
  // uniewaznia wczesniejsze ciasteczka (np. "tylko-haslo" sprzed tej zmiany).
  const t = crypto.randomBytes(32).toString('hex') + '|' + APP_LOGIN;
  return t + '.' + signToken(t);
}
function verifySession(signed) {
  if (!signed || typeof signed !== 'string') return false;
  const dot = signed.lastIndexOf('.');
  if (dot < 1) return false;
  const token = signed.slice(0, dot);
  const sig = signed.slice(dot + 1);
  // Odrzuc sesje niezwiazane z biezacym APP_LOGIN (w tym stary format bez "|login").
  const sep = token.lastIndexOf('|');
  if (sep < 0 || token.slice(sep + 1) !== APP_LOGIN) return false;
  try {
    const expected = signToken(token);
    if (sig.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch { return false; }
}
function parseCookies(req) {
  const cookies = {};
  (req.headers.cookie || '').split(';').forEach(p => {
    const eq = p.indexOf('=');
    if (eq > 0) cookies[p.slice(0, eq).trim()] = p.slice(eq + 1).trim();
  });
  return cookies;
}
function authMiddleware(req, res, next) {
  if (!APP_PASSWORD) return next();
  if (verifySession(parseCookies(req)['app_session'])) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

app.get('/api/auth/check', (req, res) => {
  if (!APP_PASSWORD) return res.json({ ok: true });
  if (verifySession(parseCookies(req)['app_session'])) return res.json({ ok: true });
  res.status(401).json({ error: 'Unauthorized' });
});
app.post('/api/auth/login', (req, res) => {
  if (!APP_PASSWORD) return res.json({ ok: true });
  const { username, password } = req.body || {};
  if (!password || password !== APP_PASSWORD || (username || '') !== APP_LOGIN)
    return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
  const session = createSession();
  res.setHeader('Set-Cookie', `app_session=${session}; HttpOnly; SameSite=Strict; Path=/; Max-Age=7776000`);
  res.json({ ok: true });
});
app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'app_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
  res.json({ ok: true });
});

// Bramka pilnuje tylko danych; statyki i powloka HTML leca wolno.
app.use('/api', authMiddleware, apiRouter);
```

Nazwij ciasteczko po aplikacji (`app_session` -> `pulsar_session`). `express.json()`
musi być zamontowany wcześniej, żeby `req.body` działał na `/api/auth/login`.

Front w `public/index.html`: markup i style ekranu logowania bierzesz z sekcji
„Wygląd (kanon wizualny)" wyżej. Logika jest zawsze ta sama:

```js
async function doLogin(ev){
  if(ev)ev.preventDefault();
  var u=(document.getElementById('loginUser')||{}).value||'',
      p=document.getElementById('loginPass').value,
      e=document.getElementById('loginErr');
  e.textContent='';
  try{
    var r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});
    var d=await r.json();
    if(r.ok){
      try{if(window.PasswordCredential&&navigator.credentials){await navigator.credentials.store(new PasswordCredential({id:u,password:p,name:u}))}}catch(_){}
      location.reload();
    } else {
      e.textContent=d.error||'Nieprawidłowy login lub hasło';
      document.getElementById('loginPass').select();
    }
  }catch(ex){ e.textContent='Błąd połączenia'; }
  return false;
}
// Bramkuj boot apki: 401 -> pokaz ekran logowania; inaczej odpal apke.
async function initApp(){
  try{
    var r=await fetch('/api/auth/check');
    if(r.status===401){
      document.getElementById('login-screen').style.display='flex';
      setTimeout(function(){var lu=document.getElementById('loginUser');(lu&&!lu.value?lu:document.getElementById('loginPass')).focus()},80);
      return;
    }
  }catch(e){}
  document.getElementById('login-screen').style.display='none';
  startApp(); // wlasny boot aplikacji
}
```

W trybie publicznym (`APP_PASSWORD` puste) `/api/auth/check` zwraca `{ok:true}`,
ekran logowania się nie pokazuje, apka rusza normalnie.

## Next.js (App Router) - ten sam kontrakt

Bramka jako Route Handlery `/api/auth/*` + sprawdzanie sesji w warstwie API; ekran
logowania jako komponent we froncie (ten sam wzorzec co wyżej: `fetch('/api/auth/check')`
na wejściu, formularz POST-uje JSON na `/api/auth/login`, `location.reload()`).

Logikę sesji trzymaj w jednym module (Web Crypto na Edge):

```ts
// lib/gate.ts
const PW = process.env.APP_PASSWORD || '';
const LOGIN = process.env.APP_LOGIN || 'ArturDab';
const SECRET = process.env.SESSION_SECRET || '';   // MUSI byc ustawiony w env
export const COOKIE = 'app_session';
export const MAXAGE = 7776000;

const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('');
async function sign(v: string){
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(v)));
}
export const enabled = () => !!PW;
export async function mint(){ const t = crypto.randomUUID() + '|' + LOGIN; return t + '.' + await sign(t); }
export async function valid(signed?: string){
  if(!signed) return false;
  const dot = signed.lastIndexOf('.'); if(dot < 1) return false;
  const token = signed.slice(0,dot), sig = signed.slice(dot+1);
  const sep = token.lastIndexOf('|'); if(sep < 0 || token.slice(sep+1) !== LOGIN) return false;
  return sig === await sign(token);
}
export function check(u: string, p: string){ return !!PW && p === PW && u === LOGIN; }
```

Route Handlery: `GET /api/auth/check` (200/401), `POST /api/auth/login` (czyta JSON,
`check()`, na sukces `Set-Cookie` z `mint()`), `POST /api/auth/logout` (Max-Age=0).
Guard danych: w każdym `/api/*` (route lub middleware z `matcher:['/api/:path*']`)
odrzucaj 401 JSON, gdy `enabled()` i `!valid(cookie)` - z wyjątkiem `/api/auth/*`
i healthchecka.

## Python (FastAPI / Flask) - ten sam kontrakt

Te same trzy zmienne env, ten sam token `<random>|<login>.<hmac>`, te same JSON-owe
endpointy `/api/auth/{check,login,logout}`, to samo ciasteczko `app_session`
(`HttpOnly; SameSite=Strict; Max-Age=7776000`). Guard na `/api`, ekran logowania w
szablonie/froncie aplikacji.

```python
import hashlib, hmac, os, secrets

PW = os.environ.get("APP_PASSWORD", "")
LOGIN = os.environ.get("APP_LOGIN", "ArturDab")
SECRET = os.environ.get("SESSION_SECRET", "")   # MUSI byc ustawiony w env
COOKIE = "app_session"
MAXAGE = 7776000

def _sign(t: str) -> str:
    return hmac.new(SECRET.encode(), t.encode(), hashlib.sha256).hexdigest()

def mint() -> str:
    t = secrets.token_hex(32) + "|" + LOGIN
    return t + "." + _sign(t)

def valid(signed: str | None) -> bool:
    if not signed:
        return False
    dot = signed.rfind(".")
    if dot < 1:
        return False
    token, sig = signed[:dot], signed[dot + 1:]
    sep = token.rfind("|")
    if sep < 0 or token[sep + 1:] != LOGIN:
        return False
    return hmac.compare_digest(sig, _sign(token))

def check(u: str, p: str) -> bool:
    return bool(PW) and p == PW and u == LOGIN
```

FastAPI: `GET /api/auth/check`, `POST /api/auth/login` (Pydantic body `{username,password}`,
na sukces `response.set_cookie(COOKIE, mint(), max_age=MAXAGE, httponly=True, samesite="strict", path="/")`),
`POST /api/auth/logout`. Guard `/api` zależnością/middleware: 401 JSON gdy `PW` i
`not valid(cookie)`, z wyłączeniem `/api/auth/*` i healthchecka. Flask: analogicznie
przez `before_request` ograniczone do `/api`.

## Checklist wdrożenia (per apka)

1. Wykryj stack (Express / Next / FastAPI / Flask). Dodaj backend wg kontraktu
   (3 zmienne env, token zwiazany z loginem, JSON `/api/auth/*`, guard tylko na `/api`).
2. Dodaj ekran logowania do frontu aplikacji w kanonie wizualnym (markup + style +
   `doLogin` + `initApp`). Ten sam clean wygląd w każdej apce; pola w prawdziwym
   `<form>` z `autocomplete`, sugestia zapisu w Chrome, ciasteczko na 90 dni.
3. Ustaw `SESSION_SECRET` na stałą mocną wartość w docelowym środowisku.
4. Deploy. Potwierdź, że healthcheck przechodzi (bramka pilnuje tylko `/api`).
5. Ustaw `APP_PASSWORD`, żeby schować; sprawdź login + zapis hasła w Chrome + że apka
   ładuje się po wpisaniu hasła. Odpal `/audit-tester` na zabramkowanym preview.
6. Publikacja później: usuń `APP_PASSWORD` z danego środowiska i zredeployuj.

## Anty-wzorce

- Hardkodowanie hasła w kodzie. Zawsze zmienna env.
- `SESSION_SECRET` nieustawiony w środowisku - losowy fallback wylogowuje wszystkich
  przy każdym deployu (zabija 90-dniowe ciasteczko).
- Sesja niezwiązana z `APP_LOGIN` - zmiana loginu nie unieważnia starych ciastek.
- Inline-HTML wall zamiast ekranu logowania we froncie apki - oddaje HTML na fetch
  danych (SPA pokazuje „błąd ładowania") i łamie jeden kanon wizualny bramki.
- Przemalowywanie bramki na dark/motyw apki - kanon jest stały (jasny + Geist),
  żeby ekran logowania był identyczny wszędzie.
- Bramkowanie healthchecka albo całej apki zamiast samego `/api` - psuje deploy.
- Oddawanie HTML logowania na żądania API/XHR zamiast czystego 401 JSON.
