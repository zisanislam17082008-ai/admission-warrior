// Zero-dependency Node server (Node 18+): serves /public and proxies Gemini so the API key stays private.
const http = require('http'), fs = require('fs'), path = require('path');
try { for (const l of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
} } catch {}
const KEY = process.env.GEMINI_API_KEY || '', PORT = process.env.PORT || 3000;
const MODELS = (process.env.GEMINI_MODELS || 'gemini-2.5-flash,gemini-2.0-flash,gemini-1.5-flash').split(',');
const PUB = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
const hits = new Map(); // tiny per-IP rate limit: 40 AI calls / minute
const limited = ip => { const n = Date.now(), a = (hits.get(ip) || []).filter(t => n - t < 6e4); a.push(n); hits.set(ip, a); return a.length > 40; };

async function gemini({ parts, system, json }) {
  let err;
  for (const m of MODELS) {
    try {
      const body = { contents: [{ role: 'user', parts }] };
      if (system) body.systemInstruction = { parts: [{ text: system }] };
      if (json) body.generationConfig = { responseMimeType: 'application/json' };
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error?.message || 'HTTP ' + r.status);
      const t = d?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n').trim();
      if (t) return t;
    } catch (e) { err = e; }
  }
  throw err || new Error('Gemini failed');
}
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/health') return send(res, 200, { ok: true, gemini: !!KEY });
  if (url.pathname === '/api/gemini' && req.method === 'POST') {
    if (!KEY) return send(res, 503, { error: 'GEMINI_API_KEY not set in .env' });
    if (limited(req.socket.remoteAddress)) return send(res, 429, { error: 'Too many requests, wait a minute' });
    let raw = ''; for await (const c of req) { raw += c; if (raw.length > 14e6) return send(res, 413, { error: 'Too large' }); }
    try { return send(res, 200, { text: await gemini(JSON.parse(raw)) }); } catch (e) { return send(res, 502, { error: e.message }); }
  }
  let p = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (p === path.sep || p === '.') p = 'index.html';
  const f = path.join(PUB, p);
  if (!f.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, data) => {
    if (e) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(data);
  });
}).listen(PORT, () => console.log(`Admission Warrior running → http://localhost:${PORT}  (Gemini ${KEY ? 'ON' : 'OFF — add key to .env'})`));
