'use strict';

/* ================= helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}[c]));

const LS = {
  get: (k, d) => {
    try {
      const raw = localStorage.getItem(k);
      return raw === null ? d : JSON.parse(raw);
    } catch {
      return d;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  }
};

const SUB = {
  Physics: 'পদার্থবিজ্ঞান',
  Chemistry: 'রসায়ন',
  Math: 'উচ্চতর গণিত',
  Biology: 'জীববিজ্ঞান'
};

const L4 = 'ABCD';

const typeset = el => {
  try {
    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
      MathJax.typesetPromise(el ? [el] : undefined).catch(() => {});
    }
  } catch {}
};

function toast(m) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = m;
  t.style.display = 'block';
  clearTimeout(toast.h);
  toast.h = setTimeout(() => {
    t.style.display = 'none';
  }, 2500);
}

const shuffle = a => {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const b64 = f => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
  reader.onerror = reject;
  reader.readAsDataURL(f);
});

/* ================= built-in questions (HSC syllabus) ================= */
const RAW_SEED = [
  ['Physics', 'তাপগতিবিদ্যা', 'কার্নো ইঞ্জিনের উৎস $400\\,K$, গ্রাহক $300\\,K$, গৃহীত তাপ $800\\,J$ হলে বর্জিত তাপ কত?', ['200 J', '600 J', '400 J', '500 J'], 1, '$Q_2=Q_1\\frac{T_2}{T_1}=600\\,J$'],
  ['Physics', 'ভেক্টর', 'দুটি লম্ব ভেক্টরের স্কেলার গুণফল কত?', ['0', 'AB', '1', 'A+B'], 0, '$AB\\cos90^\\circ=0$'],
  ['Physics', 'কাজ, শক্তি ও ক্ষমতা', '$2\\,kg$ বস্তু $3\\,m/s$ বেগে চললে গতিশক্তি কত?', ['6 J', '9 J', '18 J', '3 J'], 1, '$\\frac12mv^2=9\\,J$'],
  ['Physics', 'চল তড়িৎ', '$6\\,\\Omega$ রোধে $12\\,V$ দিলে প্রবাহ কত?', ['0.5 A', '72 A', '2 A', '18 A'], 2, '$I=V/R=2\\,A$'],
  ['Physics', 'ভৌত আলোকবিজ্ঞান', 'কোন ঘটনা আলোর তরঙ্গ প্রকৃতি প্রমাণ করে?', ['ব্যতিচার', 'ফটোইলেকট্রিক ক্রিয়া', 'কম্পটন বিক্ষেপণ', 'কৃষ্ণবস্তু বিকিরণ'], 0, 'ব্যতিচার ও অপবর্তন আলোর তরঙ্গধর্ম প্রমাণ করে।'],
  ['Chemistry', 'গুণগত রসায়ন', '$0.01\\,M$ HCl দ্রবণের pH কত?', ['1', '2', '12', '7'], 1, '$-\\log(10^{-2})=2$'],
  ['Chemistry', 'পরিমাণগত রসায়ন', 'STP-তে ১ মোল আদর্শ গ্যাসের আয়তন কত?', ['22.4 L', '24.5 L', '11.2 L', '44.8 L'], 0, 'STP-তে মোলার আয়তন $22.4\\,L$।'],
  ['Chemistry', 'জৈব রসায়ন', 'কোন যৌগটি অ্যালডল ঘনীভবন বিক্রিয়া দেয়?', ['HCHO', 'C₆H₅CHO', 'CH₃CHO', '(CH₃)₃CCHO'], 2, '$\\alpha$-হাইড্রোজেন থাকতে হয়; $CH_3CHO$-এ আছে।'],
  ['Chemistry', 'তড়িৎ রসায়ন', 'তড়িৎ বিশ্লেষণে ক্যাথোডে কোন বিক্রিয়া ঘটে?', ['বিজারণ', 'জারণ', 'নিরপেক্ষীকরণ', 'আর্দ্রবিশ্লেষণ'], 0, 'ক্যাথোডে বিজারণ ঘটে।'],
  ['Chemistry', 'রাসায়নিক পরিবর্তন', 'তাপ বাড়ালে তাপহারী বিক্রিয়ার সাম্যাবস্থা কোনদিকে সরে?', ['অগ্রগামী', 'পশ্চাদগামী', 'সরে না', 'থেমে যায়'], 0, 'লা শাতেলিয়ের নীতি অনুযায়ী অগ্রগামী দিকে।'],
  ['Math', 'ম্যাট্রিক্স ও নির্ণায়ক', '$\\begin{vmatrix}1&2\\\\3&4\\end{vmatrix}$ এর মান কত?', ['2', '10', '-10', '-2'], 3, '$1\\cdot4-2\\cdot3=-2$'],
  ['Math', 'যোগজীকরণ', '$\\int_0^{\\pi/2}\\frac{\\sin x}{\\sin x+\\cos x}dx$ এর মান কত?', ['$\\frac{\\pi}{2}$', '$\\frac{\\pi}{4}$', '$1$', '$0$'], 1, '$2I=\\frac{\\pi}{2}\\Rightarrow I=\\frac{\\pi}{4}$'],
  ['Math', 'বৃত্ত', '$x^2+y^2=25$ বৃত্তের ব্যাসার্ধ কত?', ['5', '25', '$\\sqrt5$', '10'], 0, '$r^2=25\\Rightarrow r=5$'],
  ['Math', 'অন্তরীকরণ', '$\\frac{d}{dx}\\ln\\sin x$ এর মান কত?', ['$\\cot x$', '$\\tan x$', '$-\\cot x$', '$\\sec x$'], 0, '$\\frac{\\cos x}{\\sin x}=\\cot x$'],
  ['Math', 'সরলরেখা', '$y=2x+3$ রেখার ঢাল কত?', ['3', '2', '-2', '$\\frac12$'], 1, '$y=mx+c$ থেকে $m=2$'],
  ['Biology', 'কোষ বিভাজন', 'মায়োসিস-১ এর কোন উপ-পর্যায়ে ক্রসিং ওভার ঘটে?', ['লেপ্টোটিন', 'জাইগোটিন', 'প্যাকাইটিন', 'ডিপ্লোটিন'], 2, 'ক্রসিং ওভার প্যাকাইটিনে ঘটে।'],
  ['Biology', 'কোষ ও এর গঠন', 'কোষের শক্তিঘর কোনটি?', ['রাইবোসোম', 'গলগি বডি', 'লাইসোসোম', 'মাইটোকন্ড্রিয়া'], 3, 'মাইটোকন্ড্রিয়ায় ATP তৈরি হয়।'],
  ['Biology', 'জিনতত্ত্ব ও বিবর্তন', 'DNA-তে থাইমিনের সাথে কোনটি জোড়া বাঁধে?', ['গুয়ানিন', 'সাইটোসিন', 'অ্যাডেনিন', 'ইউরাসিল'], 2, 'A=T এবং G≡C।'],
  ['Biology', 'রক্ত ও সঞ্চালন', 'অক্সিজেন পরিবহন করে কোন কোষ?', ['WBC', 'RBC', 'অণুচক্রিকা', 'প্লাজমা'], 1, 'RBC-র হিমোগ্লোবিন অক্সিজেন বহন করে।'],
  ['Biology', 'উদ্ভিদ শারীরতত্ত্ব', 'সালোকসংশ্লেষণের আলোক দশা কোথায় ঘটে?', ['থাইলাকয়েড', 'স্ট্রোমা', 'মাইটোকন্ড্রিয়া', 'নিউক্লিয়াস'], 0, 'আলোক দশা থাইলাকয়েড ঝিল্লিতে ঘটে।']
];

const SEED = RAW_SEED.map((a, i) => ({
  id: 's' + i,
  subject: a[0],
  chapter: a[1],
  src: 'Built-in',
  q: a[2],
  options: a[3],
  correctIndex: a[4],
  explanation: a[5]
}));

const genSet = () => LS.get('aw_gen', []);
const allQ = () => [...SEED, ...genSet()];

/* ================= theme & tabs ================= */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  const tb = $('#themeb');
  if (tb) tb.textContent = t === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  LS.set('aw_theme', next);
}

function showTab(t) {
  $$('.tab').forEach(s => s.classList.toggle('on', s.id === 'tab-' + t));
  $$('#nav .btn').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  location.hash = t;
  typeset(document.body);
}

if ($('#nav')) {
  $('#nav').addEventListener('click', e => {
    const t = e.target.closest('[data-tab]')?.dataset?.tab;
    if (t) showTab(t);
  });
}

if ($('#themeb')) {
  $('#themeb').addEventListener('click', toggleTheme);
}

/* ================= users & moderation (this browser) ================= */
let users = LS.get('aw_users', [{ id: 'g', name: 'General Student', status: 'active', note: '' }]);
let aid = LS.get('aw_aid', 'g');
let admin = false;

const cur = () => users.find(u => u.id === aid) || users[0];
const saveU = () => {
  LS.set('aw_users', users);
  LS.set('aw_aid', aid);
};

function allowed(what) {
  const u = cur();
  if (u && u.status !== 'active' && !admin) {
    toast(`Your account is ${u.status} — cannot ${what}`);
    return false;
  }
  return true;
}

function refreshUser() {
  const u = cur();
  const b = $('#ban');
  if ($('#who')) $('#who').textContent = (admin ? 'Admin · ' : '') + u.name;
  if ($('#admb')) $('#admb').textContent = admin ? 'Admin ✓ (logout)' : 'Admin';
  if ($('#reason')) $('#reason').classList.toggle('hide', !admin);
  if (b) {
    b.style.display = u.status !== 'active' && !admin ? 'block' : 'none';
    b.textContent = `Account ${u.status}. ${u.note || ''}`;
  }
  if ($('#ucount')) $('#ucount').textContent = users.length;
  if ($('#ulist')) {
    $('#ulist').innerHTML = users.map(x => `
      <div class="q row sp">
        <div>
          <b>${esc(x.name)}</b>
          <span class="tag ${x.status === 'active' ? 'ok' : x.status === 'banned' ? 'bd' : 'wn'}">${esc(x.status)}</span>
          ${x.id === aid ? ' <span class="tag">you</span>' : ''}
          <div class="mut" style="font-size:12px">${esc(x.note)}</div>
        </div>
        ${admin ? `
          <div class="row">
            ${x.id !== aid ? `<button class="btn" onclick="useU('${x.id}')">Select</button>` : ''}
            ${x.status !== 'active' ? `<button class="btn" onclick="mod('${x.id}','active')">Restore</button>` : ''}
            ${x.status !== 'suspended' ? `<button class="btn w" onclick="mod('${x.id}','suspended')">Suspend</button>` : ''}
            ${x.status !== 'banned' ? `<button class="btn d" onclick="mod('${x.id}','banned')">Ban</button>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('');
  }
}

window.useU = function (id) {
  aid = id;
  saveU();
  refreshUser();
};

window.mod = function (id, st) {
  if (!admin) return;
  const u = users.find(x => x.id === id);
  if (!u) return;
  u.status = st;
  u.note = st === 'active' ? '' : (($('#reason')?.value || '').trim() || (st === 'banned' ? 'Banned by admin' : 'Suspended by admin'));
  saveU();
  refreshUser();
  toast(`${u.name} → ${st}`);
};

function adminLogin() {
  if (admin) {
    admin = false;
    refreshUser();
    return toast('Admin logged out');
  }
  const pin = LS.get('aw_pin', null);
  if (!pin) {
    const p = prompt('Admin PIN সেট করো:');
    if (!p) return;
    LS.set('aw_pin', p);
    admin = true;
    toast('PIN set — admin mode');
  } else {
    if (prompt('Admin PIN:') !== pin) return toast('ভুল PIN');
    admin = true;
    toast('Admin mode on');
  }
  refreshUser();
}

if ($('#admb')) {
  $('#admb').addEventListener('click', adminLogin);
}

if ($('#ssign')) {
  $('#ssign').addEventListener('click', () => {
    const name = ($('#sname')?.value || '').trim();
    if (!name) return toast('নাম লেখো');
    let u = users.find(x => x.name.toLowerCase() === name.toLowerCase());
    if (u) {
      toast(u.status === 'active' ? 'Signed in as ' + u.name : `এই account ${u.status}`);
    } else {
      u = { id: 'u' + Date.now(), name, status: 'active', note: '' };
      users.unshift(u);
      if ($('#sname')) $('#sname').value = '';
      toast('Signed up — instant access ✓');
    }
    aid = u.id;
    saveU();
    refreshUser();
  });
}

/* ================= Gemini (server proxy first, browser key second) ================= */
let SERVER = false;

async function probe() {
  try {
    const r = await fetch('/api/health');
    SERVER = r.ok && (await r.json()).gemini === true;
  } catch {
    SERVER = false;
  }
  updAI();
}

const hasAI = () => SERVER || Boolean(LS.get('aw_key', ''));

function updAI() {
  const b = $('#aib');
  if (!b) return;
  b.textContent = hasAI() ? (SERVER ? 'AI: server ✓' : 'AI: key ✓') : 'AI: off';
}

function openKey() {
  if ($('#keyinfo')) {
    $('#keyinfo').textContent = SERVER ? 'Server key চালু আছে (.env)।' : 'Free key: aistudio.google.com/apikey';
  }
  if ($('#keyin')) $('#keyin').value = LS.get('aw_key', '');
  if ($('#keym')) $('#keym').classList.add('on');
}

function closeKey() {
  if ($('#keym')) $('#keym').classList.remove('on');
}

function saveKey(k) {
  const clean = String(k || '').trim();
  LS.set('aw_key', clean);
  updAI();
  closeKey();
  toast(clean ? 'Gemini key saved' : 'Key removed');
}

if ($('#aib')) $('#aib').addEventListener('click', openKey);
if ($('#keyclose')) $('#keyclose').addEventListener('click', closeKey);
if ($('#keysave')) $('#keysave').addEventListener('click', () => saveKey($('#keyin')?.value));
if ($('#keydel')) $('#keydel').addEventListener('click', () => saveKey(''));

async function gemini(text, { system = '', images = [], json = false } = {}) {
  const parts = [{ text }];
  for (const f of images) {
    parts.push({
      inlineData: {
        mimeType: f.type || 'image/jpeg',
        data: await b64(f)
      }
    });
  }

  const payload = { parts, system, json };

  if (SERVER) {
    const r = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'AI error');
    return d.text;
  }

  const key = LS.get('aw_key', '');
  if (!key) throw new Error('NOKEY');

  let lastErr;
  for (const m of ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']) {
    try {
      const body = { contents: [{ role: 'user', parts }] };
      if (system) body.systemInstruction = { parts: [{ text: system }] };
      if (json) body.generationConfig = { responseMimeType: 'application/json' };

      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }
      );
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error?.message || 'HTTP ' + r.status);
      const outText = d?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n').trim();
      if (outText) return outText;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Gemini failed');
}

const parseJSON = t => {
  const cleaned = String(t).replace(/```json|```/gi, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.search(/[\[{]/);
    const end = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));
    return JSON.parse(cleaned.slice(start, end + 1));
  }
};

/* ================= question bank ================= */
const KW = {
  Physics: /তাপ|ভেক্টর|বল\b|শক্তি|তড়িৎ প্রবাহ|রোধ|আলো|তরঙ্গ|চুম্বক|কার্নো|বেগ|ত্বরণ|ভরবেগ|কাজ|ক্ষমতা|\bJ\b|\bK\b|\bm\/s/,
  Chemistry: /অ্যাসিড|ক্ষার|\bpH\b|মোল|বিক্রিয়া|যৌগ|জৈব|আয়ন|অ্যালডল|অ্যালকেন|অ্যালকোহল|মৌল|\bCH|HCl|NaOH|দ্রবণ/,
  Math: /ম্যাট্রিক্স|যোগজ|অন্তরজ|অন্তরীকরণ|বৃত্ত|সরলরেখা|কনিক|∫|\bsin|\bcos|\blog|\blim|সমীকরণ/,
  Biology: /কোষ|DNA|RNA|ক্রোমোজোম|মায়োসিস|মাইটোসিস|এনজাইম|রক্ত|উদ্ভিদ|প্রাণী|জিন|হরমোন|সালোকসংশ্লেষণ|ব্যাকটেরিয়া/
};

const guessSub = t => Object.entries(KW)
  .map(([k, r]) => [k, (String(t).match(new RegExp(r.source, 'g')) || []).length])
  .sort((a, b) => b[1] - a[1])[0];

function cleanQ(x, src = 'Bank') {
  if (!x || (!x.q && !x.question)) return null;
  const opts = (x.options || []).map(v => String(v ?? '').trim()).filter(Boolean);
  if (opts.length < 4) return null;
  const fourOpts = opts.slice(0, 4);
  if (new Set(fourOpts.map(v => v.toLowerCase())).size < 4) return null;

  let ansIdx = Number.isInteger(x.correctIndex)
    ? x.correctIndex
    : L4.indexOf(String(x.correctIndex || x.answer || '').trim().toUpperCase());
  if (ansIdx < 0 || ansIdx > 3) return null;

  const sub = /math|গণিত/i.test(x.subject)
    ? 'Math'
    : Object.keys(SUB).find(k => new RegExp(k, 'i').test(x.subject)) || 'Physics';

  return {
    id: 'g' + Date.now() + Math.random().toString(36).slice(2, 7),
    subject: sub,
    chapter: x.chapter || '—',
    src: x.src || src,
    q: String(x.q || x.question).trim(),
    options: fourOpts,
    correctIndex: ansIdx,
    explanation: String(x.explanation || '')
  };
}

function parseBank(txt) {
  const trimmed = String(txt || '').trim();
  if (!trimmed) return [];

  try {
    const p = JSON.parse(trimmed);
    const arr = Array.isArray(p) ? p : p.questions;
    if (Array.isArray(arr) && arr.length) {
      return arr.map(item => cleanQ(item)).filter(Boolean);
    }
  } catch {}

  return trimmed
    .split(/\n(?=\s*\d+[.)])/)
    .map(b => b.trim())
    .filter(b => b.length > 8)
    .map(b => {
      const lines = b.split('\n').map(l => l.trim()).filter(Boolean);
      const stem = lines[0].replace(/^\d+[.)]\s*/, '');
      const matches = lines.slice(1).join(' ').match(/[A-Da-d][).]\s*.+?(?=\s+[A-Da-d][).]\s|$)/g) || [];
      const [g, n] = guessSub(b);
      return cleanQ({
        subject: n ? g : 'Physics',
        chapter: 'Bank',
        q: stem,
        options: matches.slice(0, 4).map(o => o.replace(/^[A-Da-d][).]\s*/, '')),
        correctIndex: 0,
        explanation: 'Uploaded bank-এ উত্তর দেওয়া নেই — যাচাই করো।',
        src: 'Bank (unverified key)'
      });
    })
    .filter(Boolean);
}

const shuffleOpts = q => {
  const idx = shuffle([0, 1, 2, 3]);
  return {
    ...q,
    options: idx.map(i => q.options[i]),
    correctIndex: idx.indexOf(q.correctIndex)
  };
};

const setStat = m => {
  if ($('#gstat')) $('#gstat').textContent = m;
};

function renderBank() {
  const g = genSet();
  if ($('#qcount')) $('#qcount').textContent = g.length;
  if ($('#qlist')) {
    $('#qlist').innerHTML = g.map((x, i) => `
      <div class="q">
        <div class="row sp mut" style="font-size:11px">
          <span>Q${i + 1} · ${SUB[x.subject]} · ${esc(x.chapter)} · ${esc(x.src)}</span>
          <span class="tag ok">verified format ✓</span>
        </div>
        <p style="font-weight:700;margin:8px 0">${esc(x.q)}</p>
        ${x.options.map((o, j) => `
          <div class="opt ${j === x.correctIndex ? 'c' : ''}">
            <b>${L4[j]}.</b><span>${esc(o)}</span>
          </div>
        `).join('')}
        <p style="font-size:12.5px;margin:10px 0 0">
          <b class="ok">Answer ${L4[x.correctIndex]}:</b> ${esc(x.explanation)}
        </p>
      </div>
    `).join('') || '<p class="mut">এখনো কোনো generate/extract করা প্রশ্ন নেই।</p>';
    typeset($('#qlist'));
  }
  if ($('#epool')) $('#epool').textContent = `Pool: ${allQ().length} questions`;
}

const limit = () => Math.min(60, Math.max(1, +($('#gcount')?.value) || 20));
const stems = () => allQ().slice(-40).map(x => x.q.slice(0, 50)).join(' | ');

function saveSet(list, mode) {
  const merged = [...genSet(), ...list].slice(-60);
  LS.set('aw_gen', mode === 'replace' ? list.slice(0, 60) : merged);
  renderBank();
}

if ($('#bsample')) {
  $('#bsample').addEventListener('click', () => {
    if (!allowed('load')) return;
    if ($('#bt')) {
      $('#bt').value = SEED.slice(0, 5)
        .map((q, i) => `${i + 1}. ${q.q.replace(/\$/g, '')}\n` + q.options.map((o, j) => `${L4[j]}) ${o.replace(/\$/g, '')}`).join('  '))
        .join('\n');
    }
    if ($('#bmeta')) $('#bmeta').textContent = 'Sample loaded';
  });
}

if ($('#bclear')) {
  $('#bclear').addEventListener('click', () => {
    if ($('#bt')) $('#bt').value = '';
    if ($('#bmeta')) $('#bmeta').textContent = 'Cleared';
  });
}

if ($('#bfile')) {
  $('#bfile').addEventListener('change', async e => {
    if (!allowed('upload')) {
      e.target.value = '';
      return;
    }
    const f = e.target.files?.[0];
    if (!f) return;
    if ($('#bmeta')) $('#bmeta').textContent = 'Reading ' + f.name + '...';
    try {
      if (/\.pdf$/i.test(f.name)) {
        if (!window.pdfjsLib) throw new Error('PDF.js missing');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
        let text = '';
        const pages = Math.min(pdf.numPages, 40);
        for (let p = 1; p <= pages; p++) {
          const page = await pdf.getPage(p);
          const content = await page.getTextContent();
          text += '\n' + content.items.map(item => item.str).join(' ');
        }
        if ($('#bt')) $('#bt').value = text.trim();
        if ($('#bmeta')) $('#bmeta').textContent = `${f.name} (${pages} pages)`;
      } else {
        const text = await f.text();
        if ($('#bt')) $('#bt').value = text.trim();
        if ($('#bmeta')) $('#bmeta').textContent = `${f.name} (${text.length} chars)`;
      }
      toast('Bank uploaded');
    } catch {
      if ($('#bmeta')) $('#bmeta').textContent = 'পড়া যায়নি (scanned PDF হলে text paste করো)';
    }
    e.target.value = '';
  });
}

if ($('#banalyze')) {
  $('#banalyze').addEventListener('click', async () => {
    if (!allowed('analyze')) return;
    const bank = ($('#bt')?.value || '').trim();
    if (!bank) return toast('আগে bank paste/upload করো');

    const items = parseBank(bank);
    const cnt = {};
    items.forEach(x => {
      cnt[x.subject] = (cnt[x.subject] || 0) + 1;
    });

    let out = `Bank Analysis\n• মোট শনাক্ত প্রশ্ন: ${items.length}\n` +
      Object.entries(cnt).map(([k, v]) => `• ${SUB[k]}: ${v} টি`).join('\n');

    if (hasAI()) {
      setStat('Gemini analysis...');
      try {
        out = await gemini(
          `নিচের Bangladesh HSC-ভিত্তিক বিশ্ববিদ্যালয় ভর্তি প্রশ্ন bank বিশ্লেষণ করো (Physics, Chemistry, Higher Math, Biology)। বাংলায় সংক্ষেপে দাও: ১) বিষয়ভিত্তিক বণ্টন ২) বারবার আসা chapter/topic ৩) প্রশ্নের ধরন ও কঠিনতা ৪) সম্ভাব্য high-yield টপিক ৫) সাধারণ distractor/trap।\n\n${bank.slice(0, 14000)}`,
          { system: 'Expert Bangladeshi admission test analyst. Use LaTeX $..$ for math.' }
        );
      } catch (e) {
        out += '\n\n(AI বন্ধ: ' + (e.message === 'NOKEY' ? 'Gemini key দাওনি' : e.message) + ')';
      }
    } else {
      out += '\n\n(Gemini key দিলে গভীর AI analysis পাবে।)';
    }

    if ($('#analysis')) {
      $('#analysis').textContent = out;
      typeset($('#analysis'));
    }
    setStat('Analyzed');
  });
}

if ($('#bcopy')) {
  $('#bcopy').addEventListener('click', () => {
    if (!allowed('extract')) return;
    const items = parseBank($('#bt')?.value || '').slice(0, limit());
    if (!items.length) return toast('Bank থেকে প্রশ্ন পাওয়া যায়নি');
    saveSet(items.map(x => ({ ...x, src: 'Extracted' })), 'replace');
    setStat(`${items.length} টি প্রশ্ন extract হয়েছে`);
  });
}

if ($('#bgen')) {
  $('#bgen').addEventListener('click', async () => {
    if (!allowed('generate')) return;
    const n = limit();
    const sub = $('#gsub')?.value || 'All';
    const bank = ($('#bt')?.value || '').trim();
    let out = [];

    if (hasAI()) {
      const btn = $('#bgen');
      btn.disabled = true;
      try {
        for (let t = 0; t < 8 && out.length < n; t++) {
          const need = Math.min(15, n - out.length);
          setStat(`Gemini generating... ${out.length}/${n}`);
          const prompt = `Bangladesh NCTB HSC syllabus-ভিত্তিক বিশ্ববিদ্যালয় ভর্তি পরীক্ষার (DU/JU/RU/CU/GST/BUET/Medical মানের) ${need} টি নতুন, মৌলিক, সম্ভাব্য (predictable) MCQ বানাও।
Subject: ${sub === 'All' ? 'Physics, Chemistry, Math, Biology — চার বিষয়ে সমানভাবে ভাগ করো' : sub}.
নিচের question bank বিশ্লেষণ করে বারবার আসা chapter/pattern/difficulty অনুযায়ী প্রশ্ন বানাও, কিন্তু হুবহু কপি করবে না এবং এই প্রশ্নগুলো এড়াবে: ${stems()}
নিয়ম: প্রশ্ন বাংলায়, math/chemistry-তে LaTeX $...$; ঠিক ৪টি আলাদা অপশন; ঠিক একটি সঠিক উত্তর; সংক্ষিপ্ত ধাপে ব্যাখ্যা; গণনা নিজে যাচাই করো।
Return ONLY JSON: {"questions":[{"subject":"Physics|Chemistry|Math|Biology","chapter":"","q":"","options":["","","",""],"correctIndex":0,"explanation":""}]}
Question bank:
${bank ? bank.slice(0, 12000) : '(empty — use general HSC admission patterns)'}`;

          const parsed = parseJSON(await gemini(prompt, {
            json: true,
            system: 'You are a careful Bangladeshi admission-test question setter. Output valid JSON only.'
          }));

          const seen = new Set([...allQ(), ...out].map(x => x.q.slice(0, 40)));
          for (const item of (parsed.questions || [])) {
            const c = cleanQ(item, 'AI predicted');
            if (c && (sub === 'All' || c.subject === sub) && !seen.has(c.q.slice(0, 40))) {
              out.push(shuffleOpts(c));
              seen.add(c.q.slice(0, 40));
            }
            if (out.length >= n) break;
          }
        }
      } catch (e) {
        toast(e.message === 'NOKEY' ? 'Gemini key দাও' : 'AI error: ' + e.message);
      }
      btn.disabled = false;
    }

    if (!out.length) {
      out = shuffle([
        ...parseBank(bank).map(x => ({ ...x, src: 'Bank' })),
        ...SEED.filter(x => sub === 'All' || x.subject === sub)
      ]).slice(0, n);
      setStat('AI ছাড়া: built-in/bank থেকে সেট করা হয়েছে');
    } else {
      setStat(`${out.length} টি নতুন MCQ তৈরি ✓ (max 60)`);
    }

    saveSet(out, 'replace');
    toast(out.length + ' questions ready');
  });
}

if ($('#bexp')) {
  $('#bexp').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(genSet(), null, 2)], { type: 'application/json' }));
    a.download = 'questions.json';
    a.click();
  });
}

if ($('#bdel')) {
  $('#bdel').addEventListener('click', () => {
    LS.set('aw_gen', []);
    renderBank();
    toast('Set deleted');
  });
}

/* ================= exam (answers only after submit) ================= */
let ex = null;
let tmr = null;

const fmt = s =>
  String(Math.floor(Math.max(0, s) / 60)).padStart(2, '0') + ':' +
  String(Math.max(0, s) % 60).padStart(2, '0');

function tick() {
  const t = $('#etimer');
  if (t && ex) {
    t.textContent = fmt(ex.left);
    t.classList.toggle('bd', ex.left < 60);
  }
}

window.pickA = function (j) {
  if (!ex || ex.done) return;
  ex.ans[ex.qs[ex.i].id] = j;
  drawExam();
};

window.clearA = function () {
  if (!ex || ex.done) return;
  delete ex.ans[ex.qs[ex.i].id];
  drawExam();
};

window.jumpQ = function (idx) {
  if (!ex || ex.done) return;
  ex.i = idx;
  drawExam();
};

window.trySubmit = function () {
  if (!ex || ex.done) return;
  const un = ex.qs.length - Object.keys(ex.ans).length;
  if (!un || confirm(`${un} টি প্রশ্ন উত্তর দাওনি। Submit করবে?`)) {
    submitExam('');
  }
};

function drawExam() {
  if (!ex || !$('#earea')) return;
  const q = ex.qs[ex.i];
  const sel = ex.ans[q.id];
  const n = ex.qs.length;
  const done = Object.keys(ex.ans).length;

  $('#earea').innerHTML = `
    <div class="card">
      <div class="row sp">
        <div class="row">
          <b>Question ${ex.i + 1} / ${n}</b>
          <span class="tag">${SUB[q.subject]}</span>
        </div>
        <div class="row">
          <span class="tag" id="etimer">${fmt(ex.left)}</span>
          <button class="btn p" onclick="trySubmit()">Submit</button>
        </div>
      </div>
      <div class="bar" style="margin:12px 0"><div style="width:${(done / n) * 100}%"></div></div>
      <p style="font-weight:700;font-size:15px">${esc(q.q)}</p>
      ${q.options.map((o, j) => `
        <button class="opt ${sel === j ? 's' : ''}" onclick="pickA(${j})">
          <b>${L4[j]}.</b><span>${esc(o)}</span>
        </button>
      `).join('')}
      <div class="row sp" style="margin-top:14px">
        <button class="btn" ${ex.i ? '' : 'disabled'} onclick="jumpQ(${ex.i - 1})">Previous</button>
        <button class="btn" onclick="clearA()">Clear</button>
        <button class="btn p" ${ex.i < n - 1 ? '' : 'disabled'} onclick="jumpQ(${ex.i + 1})">Next</button>
      </div>
    </div>
    <div class="card">
      <h3>Palette · ${done}/${n} answered</h3>
      <div class="pal">
        ${ex.qs.map((x, idx) => `
          <button class="btn ${idx === ex.i ? 'on' : ex.ans[x.id] !== undefined ? 'a' : ''}" onclick="jumpQ(${idx})">${idx + 1}</button>
        `).join('')}
      </div>
    </div>
  `;
  typeset($('#earea'));
}

function submitExam(pre) {
  if (!ex) return;
  clearInterval(tmr);
  ex.done = true;

  let c = 0;
  let w = 0;
  const by = {};

  ex.qs.forEach(q => {
    const a = ex.ans[q.id];
    const s = by[q.subject] ||= { c: 0, w: 0, n: 0 };
    s.n++;
    if (a === undefined) return;
    if (a === q.correctIndex) {
      c++;
      s.c++;
    } else {
      w++;
      s.w++;
    }
  });

  const net = Math.max(0, c - w * ex.neg);
  const n = ex.qs.length;
  const pct = Math.round((net / n) * 100);

  $('#earea').innerHTML = `
    <div class="card">
      <div class="row sp">
        <div>
          <div class="mut">${esc(pre)}Your score</div>
          <div class="big">${net.toFixed(2)} / ${n} <span style="font-size:16px">(${pct}%)</span></div>
        </div>
        <button class="btn p" onclick="$('#earea').innerHTML='';$('#ecfg')?.scrollIntoView()">New exam</button>
      </div>
      <div class="row" style="margin-top:10px">
        <span class="tag ok">Correct ${c}</span>
        <span class="tag bd">Wrong ${w}</span>
        <span class="tag">Skipped ${n - c - w}</span>
        <span class="tag">Negative −${(w * ex.neg).toFixed(2)}</span>
      </div>
      <h3 style="margin-top:16px">Subject-wise</h3>
      ${Object.entries(by).map(([k, s]) => `
        <div style="margin-top:8px">
          <div class="row sp"><span>${SUB[k]}</span><span class="mut">${s.c}/${s.n} correct</span></div>
          <div class="bar"><div style="width:${(s.c / s.n) * 100}%"></div></div>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <h3>Answer review</h3>
      ${ex.qs.map((q, idx) => {
        const a = ex.ans[q.id];
        return `
          <div class="q">
            <div class="row sp mut" style="font-size:11px">
              <span>Q${idx + 1} · ${SUB[q.subject]} · ${esc(q.chapter)}</span>
              <span class="tag ${a === undefined ? '' : a === q.correctIndex ? 'ok' : 'bd'}">${a === undefined ? 'Skipped' : a === q.correctIndex ? 'Correct' : 'Wrong'}</span>
            </div>
            <p style="font-weight:700;margin:8px 0">${esc(q.q)}</p>
            ${q.options.map((o, j) => `
              <div class="opt ${j === q.correctIndex ? 'c' : j === a ? 'x' : ''}">
                <b>${L4[j]}.</b><span>${esc(o)}</span>
              </div>
            `).join('')}
            <p style="font-size:12.5px;margin:10px 0 0">
              <b class="ok">Answer ${L4[q.correctIndex]}:</b> ${esc(q.explanation)}
            </p>
          </div>
        `;
      }).join('')}
    </div>
  `;
  typeset($('#earea'));
  $('#earea').scrollIntoView({ behavior: 'smooth' });
}

if ($('#estart')) {
  $('#estart').addEventListener('click', () => {
    if (!allowed('start exam')) return;
    const subs = $$('.esub:checked').map(i => i.value);
    const pool = allQ().filter(q => subs.includes(q.subject));
    if (!pool.length) return toast('অন্তত একটি বিষয় বেছে নাও');

    const requested = Math.min(60, Math.max(1, +($('#ecount')?.value) || 20));
    const n = Math.min(requested, pool.length);

    ex = {
      qs: shuffle(pool).slice(0, n),
      i: 0,
      ans: {},
      left: Math.max(1, +($('#emin')?.value) || 20) * 60,
      neg: +($('#eneg')?.value ?? 0.25),
      done: false
    };

    clearInterval(tmr);
    tmr = setInterval(() => {
      if (!ex) return;
      ex.left--;
      tick();
      if (ex.left <= 0) submitExam('Time up · ');
    }, 1000);

    drawExam();
    if (n < requested) toast(`Pool-এ ${n} টি প্রশ্ন আছে — Bank থেকে আরও generate করো`);
  });
}

/* ================= AI chat ================= */
const hist = [];
let cimg = null;

function bubble(t, u) {
  const box = $('#chatbox');
  if (!box) return null;
  const d = document.createElement('div');
  d.className = 'm' + (u ? ' u' : '');
  d.textContent = t;
  box.append(d);
  box.scrollTop = 1e9;
  typeset(d);
  return d;
}

if ($('#cimg')) {
  $('#cimg').addEventListener('change', e => {
    cimg = e.target.files?.[0] || null;
    if ($('#cimgname')) $('#cimgname').textContent = cimg ? '📷 ' + cimg.name : '';
    e.target.value = '';
  });
}

async function sendChat(p) {
  const promptText = String(p ?? $('#cin')?.value ?? '').trim();
  if (!promptText && !cimg) return;
  if (!allowed('chat')) return;

  if ($('#cin')) $('#cin').value = '';
  bubble((cimg ? '📷 ' : '') + promptText, 1);
  const wait = bubble('...');

  if (!hasAI()) {
    if (wait) wait.textContent = 'AI চালু নেই। উপরে "AI" বাটনে Gemini key দাও, অথবা .env-এ GEMINI_API_KEY দিয়ে npm start চালাও।';
    return;
  }

  try {
    const ctx = hist.slice(-8).map(h => `${h[0]}: ${h[1]}`).join('\n');
    const a = await gemini(
      `${ctx}\nStudent: ${promptText || 'এই ছবির প্রশ্নটি সমাধান করো।'}\nTutor:`,
      {
        images: cimg ? [cimg] : [],
        system: 'You are a friendly expert tutor for Bangladeshi HSC Science and university admission tests (Physics, Chemistry, Higher Math, Biology). Reply in the student\'s language (Bangla by default), step by step, concise. Use LaTeX $...$ for math. Double-check calculations and state the final answer clearly.'
      }
    );
    hist.push(['Student', promptText || '[Image]'], ['Tutor', a]);
    if (wait) {
      wait.textContent = a;
      typeset(wait);
    }
  } catch (e) {
    if (wait) wait.textContent = 'AI error: ' + (e.message === 'NOKEY' ? 'Gemini key দাওনি' : e.message);
  } finally {
    cimg = null;
    if ($('#cimgname')) $('#cimgname').textContent = '';
    if ($('#chatbox')) $('#chatbox').scrollTop = 1e9;
  }
}

if ($('#csend')) $('#csend').addEventListener('click', () => sendChat());
if ($('#cin')) $('#cin').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendChat();
});
$$('[data-q]').forEach(b => b.addEventListener('click', () => sendChat(b.dataset.q)));

/* ================= boot ================= */
setTheme(LS.get('aw_theme', matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));
renderBank();
refreshUser();
updAI();
probe();
bubble('Admission Warrior-এ স্বাগতম! HSC Physics, Chemistry, Math, Biology বা ভর্তি প্রস্তুতি নিয়ে প্রশ্ন করো। প্রশ্নের ছবিও দিতে পারো (📷)।');
const h0 = location.hash.slice(1);
showTab(['bank', 'exam', 'chat', 'users'].includes(h0) ? h0 : 'bank');
addEventListener('keydown', e => {
  if (e.key === 'Escape') closeKey();
});
