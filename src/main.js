import { createClient } from '@supabase/supabase-js';
import './style.css';

// ---------------- CONFIGURATION ----------------

// URL clean kore nei: shesh er "/" ar "/rest/v1" fele dei
function cleanUrl(url = '') {
  return String(url)
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
}

const SUPABASE_URL = cleanUrl(import.meta.env.VITE_SUPABASE_URL);
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const BUCKET = 'study-content';
const MAX_FILE_MB = 50;

const app = document.querySelector('#app');

let supabase = null;
let user = null;
let profile = null;
let contents = [];
let pendingUsers = [];
let questions = [];        // question bank (admin)
let exams = [];            // exam list
let myResults = {};        // examId -> { score, total }
let activeQuiz = null;     // cholche emon exam/practice
let quizTimer = null;
let qFilter = 'All';
let generated = [];        // AI generated question preview
let analysisText = '';     // AI bank analysis
let chatMessages = [];     // AI chat history
let chatBusy = false;
let currentPage = 'dashboard';
let uploadBusy = false;
let currentSubject = null;

const subjects = ['Physics', 'Chemistry', 'Higher Math', 'Biology'];
const icons = ['⚡', '🧪', '📐', '🧬'];
const ADMIN_PAGES = ['admin', 'upload', 'qbank', 'makeexam', 'aigen'];

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

// AI-r text safe vabe dekhano (bold + new line)
function formatMsg(text = '') {
  return escapeHTML(text)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');
}

function notify(message) {
  alert(message);
}

function isAdmin() {
  return profile?.role === 'main_admin' &&
    profile?.status === 'approved';
}

function isApproved() {
  return profile?.status === 'approved' || isAdmin();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function subjectOptions(withAll = false) {
  return (withAll ? ['<option value="All">All Subjects</option>'] : [])
    .concat(subjects.map(s => `<option value="${s}">${s}</option>`))
    .join('');
}

// ---------------- EXTRA STYLES ----------------
// style.css-e kichu change korte hobe na, eta JS thekei jog hoy

function injectStyles() {
  if (document.querySelector('#aw-extra-css')) return;

  const st = document.createElement('style');
  st.id = 'aw-extra-css';
  st.textContent = `
    .quiz-progress{display:flex;justify-content:space-between;font-size:14px;opacity:.8;margin:6px 0}
    .quiz-bar{height:6px;border-radius:99px;background:rgba(127,127,127,.25);overflow:hidden;margin-bottom:14px}
    .quiz-bar div{height:100%;background:#6366f1;transition:width .25s}
    .quiz-card{padding:18px;border-radius:16px;border:1px solid rgba(127,127,127,.3);background:rgba(127,127,127,.08);margin-bottom:14px}
    .quiz-card h3{margin:0 0 14px;line-height:1.5}
    .quiz-opt{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;padding:12px 14px;margin:8px 0;border-radius:12px;border:1.5px solid rgba(127,127,127,.35);background:transparent;color:inherit;font:inherit;cursor:pointer}
    .quiz-opt b{min-width:22px}
    .quiz-opt.selected{border-color:#6366f1;background:rgba(99,102,241,.18)}
    .quiz-opt.correct{border-color:#16a34a;background:rgba(22,163,74,.18)}
    .quiz-opt.wrong{border-color:#dc2626;background:rgba(220,38,38,.18)}
    .quiz-opt:disabled{cursor:default;opacity:1}
    .quiz-explain{margin:10px 0 0;font-size:14px;opacity:.9}
    .quiz-nav{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
    .qnum{width:34px;height:34px;border-radius:8px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font:inherit;cursor:pointer}
    .qnum.answered{background:rgba(99,102,241,.25);border-color:#6366f1}
    .qnum.current{outline:2px solid #6366f1}
    .quiz-actions{display:flex;gap:10px;flex-wrap:wrap}
    .chat-wrap{display:flex;flex-direction:column;height:calc(100vh - 230px);min-height:380px}
    .chat-box{flex:1;overflow-y:auto;padding:10px 4px;display:flex;flex-direction:column;gap:10px}
    .chat-msg{max-width:88%;padding:10px 14px;border-radius:16px;line-height:1.55;font-size:15px;word-break:break-word}
    .chat-msg.user{align-self:flex-end;background:#6366f1;color:#fff;border-bottom-right-radius:4px}
    .chat-msg.bot{align-self:flex-start;background:rgba(127,127,127,.15);border-bottom-left-radius:4px}
    .chat-msg.err{background:rgba(220,38,38,.18)}
    .chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
    .chip{padding:8px 12px;border-radius:99px;border:1px solid rgba(127,127,127,.4);background:transparent;color:inherit;font:inherit;font-size:13px;cursor:pointer}
    .chat-form{display:flex;gap:8px;align-items:flex-end}
    .chat-form textarea{flex:1;resize:none;max-height:120px}
    .gen-card{padding:14px;border-radius:14px;border:1px solid rgba(127,127,127,.3);margin-bottom:12px}
    .gen-card label{display:flex;gap:10px;align-items:flex-start}
    .analysis-box{margin-top:12px;padding:14px;border-radius:12px;background:rgba(127,127,127,.12);line-height:1.6}
  `;
  document.head.appendChild(st);
}

// ---------------- AI API CALL ----------------

async function callAI(payload) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error('Session expire hoye geche. Abar login koro.');

  let res;
  try {
    res = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error('AI server-e connect hocche na. Internet check koro.');
  }

  let json = {};
  try {
    json = await res.json();
  } catch {
    /* ignore */
  }

  if (res.status === 404) {
    throw new Error('AI server paoa jayni. api/ai.js file ta Vercel-e deploy hoyeche kina dekho.');
  }

  if (!res.ok) {
    throw new Error(json.error || `Server error (${res.status})`);
  }

  return json;
}

// ---------------- INITIALIZATION ----------------

function startApp() {
  injectStyles();

  if (!app) {
    document.body.innerHTML =
      '<h2>Application container not found.</h2>';
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    app.innerHTML = `
      <div class="status-card">
        <h2>Configuration Error</h2>
        <p>Supabase URL অথবা Publishable Key পাওয়া যায়নি।</p>
        <p>Vercel Environment Variables পরীক্ষা করো।</p>
      </div>
    `;
    return;
  }

  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    init();
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  app.innerHTML = `
    <div class="status-card">
      <div class="brand-mark">AW</div>
      <h2>Something went wrong</h2>
      <p>${escapeHTML(message)}</p>
      <button class="primary-btn" id="retry">Try Again</button>
    </div>
  `;

  document.querySelector('#retry')?.addEventListener('click', init);
}

// ---------------- AUTHENTICATION ----------------

function authView() {
  app.innerHTML = `
    <div class="auth-layout">
      <section class="hero-panel">
        <div class="brand-mark">AW</div>
        <p class="eyebrow">ADMISSION WARRIOR</p>
        <h1>স্বপ্নের বিশ্ববিদ্যালয়ের পথে
          <span>তুমিই Warrior</span>
        </h1>
        <p>Learn • Practice • Win</p>

        <div class="hero-orbit">
          <span>Physics</span>
          <span>Chemistry</span>
          <span>Math</span>
          <span>Biology</span>
        </div>
      </section>

      <section class="auth-card">
        <h2 id="authTitle">Login</h2>

        <div class="auth-tabs">
          <button class="tab active" id="loginTab" type="button">Login</button>
          <button class="tab" id="signupTab" type="button">Sign Up</button>
        </div>

        <form id="authForm">
          <label>Email
            <input type="email" id="email" required
              placeholder="Enter your email">
          </label>

          <label>Password
            <input type="password" id="password"
              minlength="6" required
              placeholder="Minimum 6 characters">
          </label>

          <button class="primary-btn" id="authButton">
            Login
          </button>
        </form>

        <p class="notice" id="authNotice"></p>
      </section>
    </div>
  `;

  let signup = false;

  const loginTab = document.querySelector('#loginTab');
  const signupTab = document.querySelector('#signupTab');
  const title = document.querySelector('#authTitle');
  const button = document.querySelector('#authButton');
  const notice = document.querySelector('#authNotice');

  loginTab.onclick = () => {
    signup = false;
    title.textContent = 'Login';
    button.textContent = 'Login';
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    notice.textContent = '';
  };

  signupTab.onclick = () => {
    signup = true;
    title.textContent = 'Create Account';
    button.textContent = 'Sign Up';
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    notice.textContent = '';
  };

  document.querySelector('#authForm').onsubmit = async event => {
    event.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    button.disabled = true;
    button.textContent = 'Please wait...';

    try {
      const result = signup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) throw result.error;

      if (signup && !result.data.session) {
        notice.textContent =
          'Account created. Check your email for confirmation.';
        notice.className = 'notice success';
        return;
      }

      await init();

    } catch (error) {
      notice.textContent = error.message;
      notice.className = 'notice error';
    } finally {
      button.disabled = false;
      button.textContent = signup ? 'Sign Up' : 'Login';
    }
  };
}

// ---------------- DATABASE ----------------

async function loadProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;

  profile = data;
}

async function loadContents() {
  if (!isApproved()) {
    contents = [];
    return;
  }

  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('visibility', 'all')
    .order('created_at', { ascending: false });

  if (error) throw error;

  contents = data || [];
}

async function loadPendingUsers() {
  if (!isAdmin()) {
    pendingUsers = [];
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;

  pendingUsers = data || [];
}

async function approveUser(id) {
  if (!isAdmin()) return;

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'approved' })
    .eq('id', id);

  if (error) {
    notify('Approve failed: ' + error.message);
    return;
  }

  notify('User approved!');
  await openPage('admin');
}

async function rejectUser(id) {
  if (!isAdmin()) return;
  if (!confirm('Reject this user?')) return;

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'rejected' })
    .eq('id', id);

  if (error) {
    notify('Reject failed: ' + error.message);
    return;
  }

  notify('User rejected.');
  await openPage('admin');
}

async function loadQuestions() {
  if (!isAdmin()) {
    questions = [];
    return;
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2000);

  if (error) throw error;

  questions = data || [];
}

async function loadExams() {
  if (!isApproved()) {
    exams = [];
    myResults = {};
    return;
  }

  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  exams = data || [];

  myResults = {};
  const { data: res } = await supabase
    .from('results')
    .select('exam_id, score, total, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  (res || []).forEach(r => {
    myResults[r.exam_id] = { score: r.score, total: r.total };
  });
}

// ---------------- LAYOUT ----------------

function layout(content) {
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark small">AW</div>
          <b>Admission Warrior</b>
        </div>

        <p class="side-label">MAIN MENU</p>

        <button class="side-link" data-page="dashboard">
          🏠 Dashboard
        </button>

        <button class="side-link" data-page="subjects">
          📚 Subjects
        </button>

        <button class="side-link" data-page="library">
          📖 Study Library
        </button>

        <button class="side-link" data-page="exams">
          📝 Exams
        </button>

        <button class="side-link" data-page="practice">
          🎯 Practice
        </button>

        <button class="side-link" data-page="chat">
          🤖 AI Assistant
        </button>

        ${isAdmin() ? `
          <p class="side-label">ADMINISTRATION</p>
          <button class="side-link" data-page="admin">
            🛡️ Admin Panel
          </button>
          <button class="side-link" data-page="upload">
            📤 Upload Content
          </button>
          <button class="side-link" data-page="qbank">
            🗂️ Question Bank
          </button>
          <button class="side-link" data-page="aigen">
            ✨ AI Generator
          </button>
          <button class="side-link" data-page="makeexam">
            ✍️ Make Exam
          </button>
        ` : ''}

        <div class="sidebar-bottom">
          <span>${escapeHTML(user?.email || '')}</span>
          <button class="outline-btn" id="logout">
            Logout
          </button>
        </div>
      </aside>

      <main class="main-panel">
        ${content}
      </main>
    </div>
  `;

  document.querySelectorAll('[data-page]').forEach(button => {
    button.onclick = () => openPage(button.dataset.page);
  });

  document.querySelector('#logout').onclick = logout;
}

// ---------------- DASHBOARD ----------------

function dashboardPage() {
  const status = profile?.status;

  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">ADMISSION WARRIOR</p>
        <h1>Dashboard</h1>
      </div>
      <span class="role-pill">
        ${isAdmin() ? 'MAIN ADMIN' : 'STUDENT'}
      </span>
    </div>

    <section class="section-heading">
      <div>
        <h2>স্বাগতম, Warrior!</h2>
        <p>${isApproved()
          ? 'তোমার পড়াশোনা শুরু করো।'
          : status === 'rejected'
            ? 'তোমার Account অনুমোদন পায়নি।'
            : 'তোমার Account অনুমোদনের অপেক্ষায় আছে।'}
        </p>
      </div>
    </section>

    ${!isApproved() ? `
      <div class="empty-state">
        <span>${status === 'rejected' ? '❌' : '⏳'}</span>
        <h3>${status === 'rejected' ? 'Not Approved' : 'Pending Approval'}</h3>
        <p>${status === 'rejected'
          ? 'Admin-er shathe jogajog koro.'
          : 'Admin অনুমোদন দিলে Study Library ব্যবহার করতে পারবে।'}</p>
      </div>
    ` : `
      <div class="subject-grid">
        ${subjects.map((subject, index) => `
          <article class="subject-card">
            <span>${icons[index]}</span>
            <h3>${subject}</h3>
            <p>Concept revision and practice</p>
            <button class="outline-btn"
              data-subject="${subject}">
              Open Subject
            </button>
          </article>
        `).join('')}

        <article class="subject-card">
          <span>🤖</span>
          <h3>AI Assistant</h3>
          <p>Poshna koro, bujhiye dibe</p>
          <button class="outline-btn" data-page="chat">
            Ask AI
          </button>
        </article>
      </div>

      <div class="section-heading">
        <div>
          <p class="eyebrow">STUDY LIBRARY</p>
          <h2>Recent Study Content</h2>
        </div>
        <button class="text-btn" data-page="library">
          View All →
        </button>
      </div>

      ${renderContentCards(contents.slice(0, 4))}
    `}
  `;
}

// ---------------- SUBJECTS ----------------

function subjectsPage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">LEARN EVERY DAY</p>
        <h1>Subjects</h1>
      </div>
    </div>

    <div class="subject-grid">
      ${subjects.map((subject, index) => `
        <article class="subject-card">
          <span>${icons[index]}</span>
          <h3>${subject}</h3>
          <p>${contents.filter(c => c.subject === subject).length} contents</p>
          <button class="outline-btn" data-subject="${subject}">
            Open Subject
          </button>
        </article>
      `).join('')}
    </div>
  `;
}

function subjectDetailPage() {
  const subject = currentSubject || subjects[0];
  const items = contents.filter(c => c.subject === subject);

  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">SUBJECT</p>
        <h1>${escapeHTML(subject)}</h1>
      </div>
      <button class="outline-btn" data-page="subjects">
        ← Back
      </button>
    </div>

    <section class="section-heading">
      <div>
        <h2>${items.length} Study Content</h2>
      </div>
    </section>

    ${renderContentCards(items)}
  `;
}

// ---------------- LIBRARY ----------------

function renderContentCards(items) {
  if (!items.length) {
    return `
      <div class="empty-state">
        <span>📚</span>
        <h3>No Content Yet</h3>
        <p>এখনো কোনো Study Content প্রকাশ করা হয়নি।</p>
      </div>
    `;
  }

  return `
    <div class="content-grid">
      ${items.map(item => `
        <article class="content-card">
          <span class="content-kind">
            ${escapeHTML(item.kind)}
          </span>
          <p class="eyebrow">${escapeHTML(item.subject)}</p>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.description || '')}</p>

          <button class="text-btn"
            data-open-content="${escapeHTML(item.id)}">
            Open Content →
          </button>
        </article>
      `).join('')}
    </div>
  `;
}

function libraryPage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">STUDY MATERIALS</p>
        <h1>Study Library</h1>
      </div>
    </div>

    ${renderContentCards(contents)}
  `;
}

// ---------------- ADMIN ----------------

function adminPage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">ADMINISTRATION</p>
        <h1>Main Admin Panel</h1>
      </div>
      <span class="role-pill">ADMIN</span>
    </div>

    <div class="subject-grid">
      <article class="subject-card">
        <span>📚</span>
        <h3>${contents.length}</h3>
        <p>Published Contents</p>
      </article>

      <article class="subject-card">
        <span>⏳</span>
        <h3>${pendingUsers.length}</h3>
        <p>Pending Approvals</p>
      </article>

      <article class="subject-card">
        <span>🛡️</span>
        <h3>Main Admin</h3>
        <p>${escapeHTML(user.email)}</p>
      </article>
    </div>

    <section class="section-heading">
      <div>
        <p class="eyebrow">USER REQUESTS</p>
        <h2>Pending Approvals (${pendingUsers.length})</h2>
      </div>
    </section>

    ${pendingUsers.length ? `
      <div class="content-grid">
        ${pendingUsers.map(u => `
          <article class="content-card">
            <p class="eyebrow">PENDING</p>
            <h3>${escapeHTML(u.email || u.id)}</h3>
            <p>${u.created_at
              ? escapeHTML(new Date(u.created_at).toLocaleString())
              : ''}</p>

            <button class="primary-btn"
              data-approve="${escapeHTML(u.id)}">
              Approve
            </button>
            <button class="outline-btn"
              data-reject="${escapeHTML(u.id)}">
              Reject
            </button>
          </article>
        `).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <span>✅</span>
        <h3>No pending users</h3>
        <p>Notun keu signup korle ekhane dekhabe.</p>
      </div>
    `}

    <div class="subject-grid">
      <article class="subject-card">
        <span>📤</span>
        <h3>Upload Content</h3>
        <p>PDF, Notes, Images and Videos</p>
        <button class="primary-btn" data-page="upload">
          Upload Now
        </button>
      </article>

      <article class="subject-card">
        <span>🗂️</span>
        <h3>Question Bank</h3>
        <p>Add and manage MCQs</p>
        <button class="primary-btn" data-page="qbank">
          Open Bank
        </button>
      </article>

      <article class="subject-card">
        <span>✨</span>
        <h3>AI Generator</h3>
        <p>Bank analyze kore notun question</p>
        <button class="primary-btn" data-page="aigen">
          Open AI
        </button>
      </article>

      <article class="subject-card">
        <span>✍️</span>
        <h3>Make Exam</h3>
        <p>Bank theke question set banao</p>
        <button class="primary-btn" data-page="makeexam">
          Make Exam
        </button>
      </article>
    </div>
  `;
}

// ---------------- UPLOAD PAGE ----------------

function uploadPage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">MAIN ADMIN</p>
        <h1>Upload Study Content</h1>
      </div>
    </div>

    <section class="upload-card">
      <form id="uploadForm">

        <label>Content Title
          <input id="title" required
            placeholder="Enter content title">
        </label>

        <div class="form-row">
          <label>Subject
            <select id="subject">
              ${subjectOptions()}
            </select>
          </label>

          <label>Content Type
            <select id="kind">
              <option value="note">Note</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="mcq">MCQ</option>
            </select>
          </label>
        </div>

        <label>Upload File (max ${MAX_FILE_MB} MB)
          <input id="file" type="file"
            accept=".pdf,application/pdf,image/*,video/*">
        </label>

        <p class="notice" id="fileInfo"></p>

        <label>Video URL (optional)
          <input id="videoUrl" type="url"
            placeholder="https://...">
        </label>

        <label>Description
          <textarea id="description" rows="4"
            placeholder="Write a description"></textarea>
        </label>

        <button class="primary-btn" type="submit">
          Publish Content
        </button>

        <p class="notice" id="uploadNotice"></p>
      </form>
    </section>
  `;
}

// ---------------- QUESTION BANK (ADMIN) ----------------

function qListHTML() {
  const list = qFilter === 'All'
    ? questions
    : questions.filter(q => q.subject === qFilter);

  if (!list.length) {
    return `
      <div class="empty-state">
        <span>🗂️</span>
        <h3>No Questions</h3>
        <p>Ei subject-e ekhono kono question nai.</p>
      </div>
    `;
  }

  return `
    <div class="content-grid">
      ${list.map(q => `
        <article class="content-card">
          <p class="eyebrow">
            ${escapeHTML(q.subject)}${q.chapter ? ' • ' + escapeHTML(q.chapter) : ''}
          </p>
          <h3>${escapeHTML(q.question)}</h3>
          <p>A. ${escapeHTML(q.option_a)}</p>
          <p>B. ${escapeHTML(q.option_b)}</p>
          <p>C. ${escapeHTML(q.option_c)}</p>
          <p>D. ${escapeHTML(q.option_d)}</p>
          <p><b>Answer: ${escapeHTML(q.correct.toUpperCase())}</b></p>
          <button class="outline-btn"
            data-del-q="${escapeHTML(q.id)}">
            Delete
          </button>
        </article>
      `).join('')}
    </div>
  `;
}

function qbankPage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">MAIN ADMIN</p>
        <h1>Question Bank</h1>
      </div>
      <span class="role-pill">${questions.length} QUESTIONS</span>
    </div>

    <section class="upload-card">
      <h2>Add Question</h2>
      <form id="qForm">
        <div class="form-row">
          <label>Subject
            <select id="qSubject">${subjectOptions()}</select>
          </label>
          <label>Chapter (optional)
            <input id="qChapter" placeholder="e.g. Newtonian Mechanics">
          </label>
        </div>

        <label>Question
          <textarea id="qText" rows="3" required
            placeholder="Write the question"></textarea>
        </label>

        <div class="form-row">
          <label>Option A <input id="qA" required></label>
          <label>Option B <input id="qB" required></label>
        </div>
        <div class="form-row">
          <label>Option C <input id="qC" required></label>
          <label>Option D <input id="qD" required></label>
        </div>

        <label>Correct Answer
          <select id="qCorrect">
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
            <option value="d">D</option>
          </select>
        </label>

        <label>Explanation (optional)
          <textarea id="qExplain" rows="2"
            placeholder="Short explanation"></textarea>
        </label>

        <button class="primary-btn" type="submit">
          Add Question
        </button>
      </form>
    </section>

    <section class="upload-card">
      <h2>Bulk Import</h2>
      <p class="notice">
        Prottek line-e ekta question. Format:<br>
        question | A | B | C | D | correct(A/B/C/D) | explanation(optional)
      </p>
      <label>Subject
        <select id="bulkSubject">${subjectOptions()}</select>
      </label>
      <label>Questions
        <textarea id="bulkText" rows="6"
          placeholder="2+2 koto? | 3 | 4 | 5 | 6 | B | Simple addition"></textarea>
      </label>
      <button class="primary-btn" id="bulkBtn" type="button">
        Import Questions
      </button>
    </section>

    <section class="section-heading">
      <div>
        <p class="eyebrow">ALL QUESTIONS</p>
        <h2>Bank</h2>
      </div>
      <select id="qFilter">
        <option value="All">All Subjects</option>
        ${subjects.map(s =>
          `<option value="${s}" ${qFilter === s ? 'selected' : ''}>${s}</option>`
        ).join('')}
      </select>
    </section>

    <div id="qList">${qListHTML()}</div>
  `;
}

function bindQDelete() {
  document.querySelectorAll('[data-del-q]').forEach(b => {
    b.onclick = () => deleteQuestion(b.dataset.delQ);
  });
}

function setupQbank() {
  document.querySelector('#qForm')?.addEventListener('submit', addQuestion);
  document.querySelector('#bulkBtn')?.addEventListener('click', bulkImport);

  document.querySelector('#qFilter')?.addEventListener('change', e => {
    qFilter = e.target.value;
    document.querySelector('#qList').innerHTML = qListHTML();
    bindQDelete();
  });

  bindQDelete();
}

async function addQuestion(event) {
  event.preventDefault();
  if (!isAdmin()) return;

  const btn = event.currentTarget.querySelector('button[type="submit"]');
  btn.disabled = true;

  const row = {
    subject: document.querySelector('#qSubject').value,
    chapter: document.querySelector('#qChapter').value.trim() || null,
    question: document.querySelector('#qText').value.trim(),
    option_a: document.querySelector('#qA').value.trim(),
    option_b: document.querySelector('#qB').value.trim(),
    option_c: document.querySelector('#qC').value.trim(),
    option_d: document.querySelector('#qD').value.trim(),
    correct: document.querySelector('#qCorrect').value,
    explanation: document.querySelector('#qExplain').value.trim() || null,
    created_by: user.id
  };

  const { error } = await supabase.from('questions').insert(row);

  if (error) {
    btn.disabled = false;
    notify('Add failed: ' + error.message);
    return;
  }

  await openPage('qbank');
}

async function bulkImport() {
  if (!isAdmin()) return;

  const subject = document.querySelector('#bulkSubject').value;
  const text = document.querySelector('#bulkText').value;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const rows = [];
  let skipped = 0;

  lines.forEach(line => {
    const p = line.split('|').map(x => x.trim());
    const correct = (p[5] || '').toLowerCase();

    if (p.length < 6 || !p[0] || !p[1] || !p[2] || !p[3] || !p[4] ||
        !['a', 'b', 'c', 'd'].includes(correct)) {
      skipped++;
      return;
    }

    rows.push({
      subject,
      question: p[0],
      option_a: p[1],
      option_b: p[2],
      option_c: p[3],
      option_d: p[4],
      correct,
      explanation: p[6] || null,
      created_by: user.id
    });
  });

  if (!rows.length) {
    notify('Kono valid line paoa jayni. Format check koro.');
    return;
  }

  const { error } = await supabase.from('questions').insert(rows);

  if (error) {
    notify('Import failed: ' + error.message);
    return;
  }

  notify(`${rows.length} question added.` +
    (skipped ? ` ${skipped} line skip hoyeche (format thik na).` : ''));

  await openPage('qbank');
}

async function deleteQuestion(id) {
  if (!isAdmin()) return;
  if (!confirm('Delete this question?')) return;

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);

  if (error) {
    notify('Delete failed: ' + error.message);
    return;
  }

  await openPage('qbank');
}

// ---------------- AI GENERATOR (ADMIN) ----------------

function bankStatsHTML() {
  if (!questions.length) {
    return '<p class="notice">Bank ekhono khali.</p>';
  }

  const by = {};
  questions.forEach(q => {
    const c = q.chapter || 'General';
    by[q.subject] = by[q.subject] || { total: 0, chapters: {} };
    by[q.subject].total++;
    by[q.subject].chapters[c] = (by[q.subject].chapters[c] || 0) + 1;
  });

  return `
    <div class="content-grid">
      ${Object.entries(by).map(([s, info]) => `
        <article class="content-card">
          <p class="eyebrow">${escapeHTML(s)}</p>
          <h3>${info.total} questions</h3>
          <p>${Object.entries(info.chapters)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([c, n]) => `${escapeHTML(c)}: ${n}`)
            .join(' • ')}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function aiGenPage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">MAIN ADMIN • POWERED BY CLAUDE</p>
        <h1>AI Question Generator</h1>
      </div>
      <span class="role-pill">${questions.length} IN BANK</span>
    </div>

    <section class="upload-card">
      <h2>Bank Analysis</h2>
      ${bankStatsHTML()}
      <button class="outline-btn" id="analyzeBtn" type="button">
        Analyze with AI
      </button>
      <div id="analysisBox">
        ${analysisText
          ? `<div class="analysis-box">${formatMsg(analysisText)}</div>`
          : ''}
      </div>
    </section>

    <section class="upload-card">
      <h2>Generate New Questions</h2>
      <p class="notice">
        AI bank-er existing question dekhe, style ar topic bujhe, notun question banabe.
        Save korar age nijе check kore nao.
      </p>

      <form id="genForm">
        <div class="form-row">
          <label>Subject
            <select id="gSubject">${subjectOptions()}</select>
          </label>
          <label>Chapter / Topic (optional)
            <input id="gChapter" placeholder="e.g. Thermodynamics">
          </label>
        </div>

        <div class="form-row">
          <label>How many (max 10)
            <input id="gCount" type="number" min="1" max="10" value="5">
          </label>
          <label>Difficulty
            <select id="gDifficulty">
              <option value="easy">Easy</option>
              <option value="medium" selected>Medium</option>
              <option value="hard">Hard</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>
        </div>

        <label>Extra instruction (optional)
          <input id="gExtra"
            placeholder="e.g. numerical problem beshi, BUET style">
        </label>

        <button class="primary-btn" id="genBtn" type="submit">
          Generate Questions
        </button>
      </form>
    </section>

    <div id="genResult"></div>
  `;
}

function renderGenResult() {
  const box = document.querySelector('#genResult');
  if (!box) return;

  if (!generated.length) {
    box.innerHTML = '';
    return;
  }

  box.innerHTML = `
    <section class="section-heading">
      <div>
        <p class="eyebrow">PREVIEW</p>
        <h2>${generated.length} Generated Questions</h2>
      </div>
    </section>

    ${generated.map((q, i) => `
      <div class="gen-card">
        <label>
          <input type="checkbox" data-gen-idx="${i}"
            style="width:auto;margin-top:4px;"
            ${q.selected ? 'checked' : ''}>
          <span>
            <b>${escapeHTML(q.question)}</b><br>
            A. ${escapeHTML(q.option_a)}<br>
            B. ${escapeHTML(q.option_b)}<br>
            C. ${escapeHTML(q.option_c)}<br>
            D. ${escapeHTML(q.option_d)}<br>
            <b>Answer: ${escapeHTML(q.correct.toUpperCase())}</b>
            ${q.explanation
              ? `<br><small>${escapeHTML(q.explanation)}</small>`
              : ''}
          </span>
        </label>
      </div>
    `).join('')}

    <div class="quiz-actions">
      <button class="primary-btn" id="saveGenBtn" type="button">
        Save Selected to Bank
      </button>
      <button class="outline-btn" id="discardGenBtn" type="button">
        Discard All
      </button>
    </div>
  `;

  box.querySelectorAll('[data-gen-idx]').forEach(cb => {
    cb.onchange = () => {
      generated[Number(cb.dataset.genIdx)].selected = cb.checked;
    };
  });

  document.querySelector('#saveGenBtn').onclick = saveGenerated;
  document.querySelector('#discardGenBtn').onclick = () => {
    generated = [];
    renderGenResult();
  };
}

function setupAiGen() {
  document.querySelector('#genForm')?.addEventListener('submit', generateQuestions);
  document.querySelector('#analyzeBtn')?.addEventListener('click', analyzeBank);
  renderGenResult();
}

async function analyzeBank() {
  const btn = document.querySelector('#analyzeBtn');
  const box = document.querySelector('#analysisBox');

  btn.disabled = true;
  btn.textContent = 'Analyzing...';

  try {
    const res = await callAI({ mode: 'analyze' });
    analysisText = res.text || '';
    box.innerHTML = `<div class="analysis-box">${formatMsg(analysisText)}</div>`;
  } catch (error) {
    notify('Analysis failed: ' + error.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Analyze with AI';
  }
}

async function generateQuestions(event) {
  event.preventDefault();
  if (!isAdmin()) return;

  const btn = document.querySelector('#genBtn');
  btn.disabled = true;
  btn.textContent = 'Generating... (10-30 sec)';

  const subject = document.querySelector('#gSubject').value;
  const chapter = document.querySelector('#gChapter').value.trim();

  try {
    const res = await callAI({
      mode: 'generate',
      subject,
      chapter,
      count: parseInt(document.querySelector('#gCount').value, 10) || 5,
      difficulty: document.querySelector('#gDifficulty').value,
      extra: document.querySelector('#gExtra').value.trim()
    });

    generated = (res.questions || []).map(q => ({
      ...q,
      subject,
      chapter: chapter || null,
      selected: true
    }));

    renderGenResult();
    document.querySelector('#genResult')?.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    notify('Generate failed: ' + error.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate Questions';
  }
}

async function saveGenerated() {
  if (!isAdmin()) return;

  const rows = generated
    .filter(q => q.selected)
    .map(q => ({
      subject: q.subject,
      chapter: q.chapter,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct: q.correct,
      explanation: q.explanation || null,
      created_by: user.id
    }));

  if (!rows.length) {
    notify('Kono question select kora nai.');
    return;
  }

  const btn = document.querySelector('#saveGenBtn');
  btn.disabled = true;

  const { error } = await supabase.from('questions').insert(rows);

  if (error) {
    btn.disabled = false;
    notify('Save failed: ' + error.message);
    return;
  }

  notify(`${rows.length} question bank-e save hoyeche!`);
  generated = [];
  await openPage('qbank');
}

// ---------------- AI CHAT ----------------

const CHIPS = [
  'Question bank dekhe amar ki practice kora uchit?',
  'Physics-er ekta MCQ practice dao',
  'Newton-er 2nd law sohoje bujhiye dao',
  'Amar exam result analyze koro'
];

function chatHTML() {
  const welcome = `
    <div class="chat-msg bot">
      Assalamu alaikum, Warrior! 👋 Ami tomar Study Assistant.
      Physics, Chemistry, Higher Math, Biology — je kono poshna koro,
      MCQ practice chaw, ba question bank analyze kore ki porbe seta jiggesh koro.
    </div>
  `;

  const msgs = chatMessages.map(m => `
    <div class="chat-msg ${m.role === 'user' ? 'user' : 'bot'} ${m.error ? 'err' : ''}">
      ${formatMsg(m.content)}
    </div>
  `).join('');

  const typing = chatBusy
    ? '<div class="chat-msg bot">Thinking...</div>'
    : '';

  return welcome + msgs + typing;
}

function chatPage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">POWERED BY CLAUDE</p>
        <h1>AI Assistant</h1>
      </div>
      <button class="outline-btn" id="clearChat" type="button">Clear</button>
    </div>

    <div class="chat-wrap">
      <div class="chat-box" id="chatBox">${chatHTML()}</div>

      <div class="chips">
        ${CHIPS.map(c => `<button class="chip" type="button" data-chip="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join('')}
      </div>

      <form class="chat-form" id="chatForm">
        <textarea id="chatInput" rows="1"
          placeholder="Tomar proshno likho..."></textarea>
        <button class="primary-btn" id="chatSend" type="submit">Send</button>
      </form>
    </div>
  `;
}

function renderChat() {
  const box = document.querySelector('#chatBox');
  if (!box) return;

  box.innerHTML = chatHTML();
  box.scrollTop = box.scrollHeight;

  const send = document.querySelector('#chatSend');
  if (send) send.disabled = chatBusy;
}

async function sendChat(text) {
  if (chatBusy || !text) return;

  chatMessages.push({ role: 'user', content: text });
  chatBusy = true;
  renderChat();

  try {
    const history = chatMessages
      .filter(m => !m.error)
      .slice(-12)
      .map(m => ({ role: m.role, content: m.content }));

    const res = await callAI({ mode: 'chat', messages: history });
    chatMessages.push({ role: 'assistant', content: res.text || '...' });
  } catch (error) {
    chatMessages.push({
      role: 'assistant',
      content: 'Error: ' + error.message,
      error: true
    });
  } finally {
    chatBusy = false;
    renderChat();
  }
}

function setupChat() {
  const form = document.querySelector('#chatForm');
  const input = document.querySelector('#chatInput');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || chatBusy) return;
    input.value = '';
    sendChat(text);
  });

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  document.querySelectorAll('[data-chip]').forEach(b => {
    b.onclick = () => sendChat(b.dataset.chip);
  });

  document.querySelector('#clearChat')?.addEventListener('click', () => {
    chatMessages = [];
    renderChat();
  });

  renderChat();
}

// ---------------- MAKE EXAM (ADMIN) ----------------

function makeExamPage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">MAIN ADMIN</p>
        <h1>Make Exam</h1>
      </div>
    </div>

    <section class="upload-card">
      <form id="examForm">
        <label>Exam Title
          <input id="examTitle" required
            placeholder="e.g. Physics Model Test 1">
        </label>

        <div class="form-row">
          <label>Subject
            <select id="examSubject">${subjectOptions(true)}</select>
          </label>

          <label>Selection
            <select id="examMode">
              <option value="random">Random from bank</option>
              <option value="manual">Choose manually</option>
            </select>
          </label>
        </div>

        <div class="form-row">
          <label>Number of questions (random)
            <input id="examCount" type="number" min="1" value="10">
          </label>

          <label>Duration (minutes, 0 = no limit)
            <input id="examDuration" type="number" min="0" value="10">
          </label>
        </div>

        <p class="notice" id="poolInfo"></p>

        <div id="manualList"></div>

        <button class="primary-btn" type="submit">
          Create Exam
        </button>
      </form>
    </section>
  `;
}

function examPool() {
  const subject = document.querySelector('#examSubject').value;
  return subject === 'All'
    ? questions
    : questions.filter(q => q.subject === subject);
}

function updateManualList() {
  const pool = examPool();
  const mode = document.querySelector('#examMode').value;
  const info = document.querySelector('#poolInfo');
  const box = document.querySelector('#manualList');

  info.textContent = `${pool.length} questions available in bank.`;

  if (mode !== 'manual') {
    box.innerHTML = '';
    return;
  }

  box.innerHTML = pool.length
    ? pool.map(q => `
        <label style="display:flex;gap:10px;align-items:flex-start;margin:8px 0;">
          <input type="checkbox" class="pick-q" value="${escapeHTML(q.id)}"
            style="width:auto;margin-top:4px;">
          <span>${escapeHTML(q.question)}
            <small>(${escapeHTML(q.subject)})</small></span>
        </label>
      `).join('')
    : '<p>Ei subject-e kono question nai.</p>';
}

function setupMakeExam() {
  document.querySelector('#examSubject')
    ?.addEventListener('change', updateManualList);
  document.querySelector('#examMode')
    ?.addEventListener('change', updateManualList);
  document.querySelector('#examForm')
    ?.addEventListener('submit', createExam);

  if (document.querySelector('#examForm')) updateManualList();
}

async function createExam(event) {
  event.preventDefault();
  if (!isAdmin()) return;

  const title = document.querySelector('#examTitle').value.trim();
  const subject = document.querySelector('#examSubject').value;
  const mode = document.querySelector('#examMode').value;
  const count = parseInt(document.querySelector('#examCount').value, 10) || 0;
  const duration = parseInt(document.querySelector('#examDuration').value, 10) || 0;
  const pool = examPool();

  let ids = [];

  if (mode === 'manual') {
    ids = [...document.querySelectorAll('.pick-q:checked')].map(x => x.value);
  } else {
    if (count < 1) {
      notify('Question number 1 ba tar beshi dao.');
      return;
    }
    ids = shuffle(pool).slice(0, count).map(q => q.id);
  }

  if (!ids.length) {
    notify('Kono question select hoyni ba bank-e question nai.');
    return;
  }

  if (mode === 'random' && ids.length < count) {
    if (!confirm(`Bank-e shudhu ${ids.length} ta question ache. Eta diyei exam banabe?`)) {
      return;
    }
  }

  const btn = event.currentTarget.querySelector('button[type="submit"]');
  btn.disabled = true;

  const { error } = await supabase.from('exams').insert({
    title,
    subject,
    question_ids: ids,
    duration_minutes: duration,
    created_by: user.id
  });

  if (error) {
    btn.disabled = false;
    notify('Create exam failed: ' + error.message);
    return;
  }

  notify(`Exam created with ${ids.length} questions!`);
  await openPage('exams');
}

// ---------------- EXAMS ----------------

function examsPage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">TEST YOURSELF</p>
        <h1>Exams</h1>
      </div>
    </div>

    ${exams.length ? `
      <div class="content-grid">
        ${exams.map(e => {
          const r = myResults[e.id];
          const count = Array.isArray(e.question_ids) ? e.question_ids.length : 0;
          return `
            <article class="content-card">
              <span class="content-kind">${escapeHTML(e.subject || 'All')}</span>
              <h3>${escapeHTML(e.title)}</h3>
              <p>${count} questions •
                ${e.duration_minutes > 0 ? e.duration_minutes + ' min' : 'No time limit'}</p>
              ${r ? `<p><b>Last score: ${r.score}/${r.total}</b></p>` : ''}

              <button class="primary-btn"
                data-start-exam="${escapeHTML(e.id)}">
                ${r ? 'Retake' : 'Start Exam'}
              </button>
              ${isAdmin() ? `
                <button class="outline-btn"
                  data-del-exam="${escapeHTML(e.id)}">
                  Delete
                </button>
              ` : ''}
            </article>
          `;
        }).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <span>📝</span>
        <h3>No Exams Yet</h3>
        <p>Ekhono kono exam toiri hoyni.</p>
      </div>
    `}
  `;
}

async function fetchQuestionsByIds(ids) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .in('id', ids);

  if (error) throw error;

  const map = new Map((data || []).map(q => [q.id, q]));
  return ids.map(id => map.get(id)).filter(Boolean);
}

async function startExam(id) {
  const exam = exams.find(e => String(e.id) === String(id));
  if (!exam) {
    notify('Exam paoa jayni.');
    return;
  }

  try {
    const qs = await fetchQuestionsByIds(exam.question_ids || []);

    if (!qs.length) {
      notify('Ei exam-er question gulo bank theke muche gese.');
      return;
    }

    activeQuiz = {
      examId: exam.id,
      title: exam.title,
      questions: shuffle(qs),
      answers: {},
      index: 0,
      instant: false,
      submitted: false,
      score: 0,
      endsAt: exam.duration_minutes > 0
        ? Date.now() + exam.duration_minutes * 60 * 1000
        : null
    };

    await openPage('quiz');
  } catch (error) {
    notify('Could not start exam: ' + error.message);
  }
}

async function deleteExam(id) {
  if (!isAdmin()) return;
  if (!confirm('Delete this exam and its results?')) return;

  const { error } = await supabase.from('exams').delete().eq('id', id);

  if (error) {
    notify('Delete failed: ' + error.message);
    return;
  }

  await openPage('exams');
}

// ---------------- PRACTICE ----------------

function practicePage() {
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">QUESTION BANK</p>
        <h1>Practice</h1>
      </div>
    </div>

    <section class="upload-card">
      <p class="notice">
        Subject, question sonkha ar timer set koro. Bank theke random question niye quiz toiri hobe.
      </p>
      <form id="practiceForm">
        <div class="form-row">
          <label>Subject
            <select id="pSubject">${subjectOptions(true)}</select>
          </label>
          <label>Number of questions
            <input id="pCount" type="number" min="1" max="100" value="10">
          </label>
        </div>

        <div class="form-row">
          <label>Timer (minutes, 0 = no timer)
            <input id="pTimer" type="number" min="0" max="180" value="10">
          </label>
          <label style="display:flex;gap:8px;align-items:center;">
            <input id="pInstant" type="checkbox" style="width:auto;">
            Instant answer feedback
          </label>
        </div>

        <button class="primary-btn" type="submit">
          Start Quiz
        </button>
      </form>
    </section>
  `;
}

async function startPractice(event) {
  event.preventDefault();

  const subject = document.querySelector('#pSubject').value;
  const count = Math.min(
    100,
    Math.max(1, parseInt(document.querySelector('#pCount').value, 10) || 10)
  );
  const minutes = Math.min(
    180,
    Math.max(0, parseInt(document.querySelector('#pTimer').value, 10) || 0)
  );
  const instant = document.querySelector('#pInstant').checked;

  const btn = event.currentTarget.querySelector('button[type="submit"]');
  btn.disabled = true;

  try {
    let query = supabase.from('questions').select('*').limit(1000);
    if (subject !== 'All') query = query.eq('subject', subject);

    const { data, error } = await query;
    if (error) throw error;

    if (!data || !data.length) {
      btn.disabled = false;
      notify('Ei subject-e ekhono kono question nai.');
      return;
    }

    activeQuiz = {
      examId: null,
      title: `Practice: ${subject}`,
      questions: shuffle(data).slice(0, count),
      answers: {},
      index: 0,
      instant,
      submitted: false,
      score: 0,
      endsAt: minutes > 0 ? Date.now() + minutes * 60 * 1000 : null
    };

    await openPage('quiz');
  } catch (error) {
    btn.disabled = false;
    notify('Could not start quiz: ' + error.message);
  }
}

// ---------------- QUIZ (ek ek kore question) ----------------

function optionList(q) {
  return [
    ['a', q.option_a],
    ['b', q.option_b],
    ['c', q.option_c],
    ['d', q.option_d]
  ];
}

function quizPage() {
  if (!activeQuiz) {
    return `
      <div class="empty-state">
        <span>📝</span>
        <h3>No active quiz</h3>
        <button class="primary-btn" data-page="exams">Go to Exams</button>
      </div>
    `;
  }

  const quiz = activeQuiz;
  const total = quiz.questions.length;

  // ----- Result view -----
  if (quiz.submitted) {
    const percent = Math.round((quiz.score / total) * 100);

    return `
      <div class="topbar">
        <div>
          <p class="eyebrow">RESULT</p>
          <h1>${escapeHTML(quiz.title)}</h1>
        </div>
        <button class="outline-btn"
          data-page="${quiz.examId ? 'exams' : 'practice'}">
          ← Back
        </button>
      </div>

      <div class="subject-grid">
        <article class="subject-card">
          <span>🏆</span>
          <h3>${quiz.score} / ${total}</h3>
          <p>${percent}% correct</p>
        </article>
        <article class="subject-card">
          <span>🤖</span>
          <h3>Need help?</h3>
          <p>AI Assistant-ke jiggesh koro</p>
          <button class="outline-btn" data-page="chat">Ask AI</button>
        </article>
      </div>

      ${quiz.questions.map((q, i) => {
        const chosen = quiz.answers[q.id];
        const ok = chosen === q.correct;

        return `
          <article class="content-card" style="margin-bottom:14px;">
            <p class="eyebrow">
              Q${i + 1} •
              <span style="color:${ok ? '#16a34a' : '#dc2626'}">
                ${chosen ? (ok ? 'Correct' : 'Wrong') : 'Not answered'}
              </span>
            </p>
            <h3>${escapeHTML(q.question)}</h3>

            ${optionList(q).map(([key, text]) => {
              let style = '';
              if (key === q.correct) style = 'color:#16a34a;font-weight:700;';
              else if (key === chosen) style = 'color:#dc2626;font-weight:700;';
              return `<p style="${style}">${key.toUpperCase()}. ${escapeHTML(text)}
                ${key === q.correct ? ' ✓' : ''}
                ${key === chosen && key !== q.correct ? ' ✗' : ''}</p>`;
            }).join('')}

            ${q.explanation
              ? `<p><b>Explanation:</b> ${escapeHTML(q.explanation)}</p>`
              : ''}
          </article>
        `;
      }).join('')}
    `;
  }

  // ----- Quiz view (body pore renderQuizBody diye bhore) -----
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">${quiz.examId ? 'EXAM' : 'PRACTICE'}</p>
        <h1>${escapeHTML(quiz.title)}</h1>
      </div>
      <span class="role-pill" id="timer">
        ${quiz.endsAt ? '--:--' : total + ' Q'}
      </span>
    </div>

    <div id="quizBody"></div>
  `;
}

function renderQuizBody() {
  const quiz = activeQuiz;
  const body = document.querySelector('#quizBody');
  if (!quiz || !body) return;

  const total = quiz.questions.length;
  const i = quiz.index;
  const q = quiz.questions[i];
  const chosen = quiz.answers[q.id];
  const locked = quiz.instant && !!chosen;
  const answered = Object.keys(quiz.answers).length;

  body.innerHTML = `
    <div class="quiz-progress">
      <span>Question ${i + 1} / ${total}</span>
      <span>${answered} answered</span>
    </div>
    <div class="quiz-bar"><div style="width:${((i + 1) / total) * 100}%"></div></div>

    <article class="quiz-card">
      <h3>${escapeHTML(q.question)}</h3>

      ${optionList(q).map(([key, text]) => {
        let cls = 'quiz-opt';
        if (locked) {
          if (key === q.correct) cls += ' correct';
          else if (key === chosen) cls += ' wrong';
        } else if (key === chosen) {
          cls += ' selected';
        }

        return `
          <button type="button" class="${cls}" data-key="${key}"
            ${locked ? 'disabled' : ''}>
            <b>${key.toUpperCase()}</b>
            <span>${escapeHTML(text)}</span>
          </button>
        `;
      }).join('')}

      ${locked && q.explanation
        ? `<p class="quiz-explain"><b>Explanation:</b> ${escapeHTML(q.explanation)}</p>`
        : ''}
    </article>

    <div class="quiz-nav">
      ${quiz.questions.map((x, n) => `
        <button type="button"
          class="qnum ${quiz.answers[x.id] ? 'answered' : ''} ${n === i ? 'current' : ''}"
          data-goto="${n}">${n + 1}</button>
      `).join('')}
    </div>

    <div class="quiz-actions">
      <button class="outline-btn" type="button" id="prevQ"
        ${i === 0 ? 'disabled' : ''}>← Previous</button>
      ${i < total - 1
        ? '<button class="primary-btn" type="button" id="nextQ">Next →</button>'
        : ''}
      <button class="primary-btn" type="button" id="finishQ">Submit</button>
    </div>
  `;

  body.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.onclick = () => {
      if (quiz.instant && quiz.answers[q.id]) return;
      quiz.answers[q.id] = btn.dataset.key;
      renderQuizBody();
    };
  });

  body.querySelectorAll('[data-goto]').forEach(btn => {
    btn.onclick = () => {
      quiz.index = Number(btn.dataset.goto);
      renderQuizBody();
    };
  });

  document.querySelector('#prevQ')?.addEventListener('click', () => {
    if (quiz.index > 0) {
      quiz.index--;
      renderQuizBody();
    }
  });

  document.querySelector('#nextQ')?.addEventListener('click', () => {
    if (quiz.index < total - 1) {
      quiz.index++;
      renderQuizBody();
    }
  });

  document.querySelector('#finishQ')?.addEventListener('click', () => {
    const unanswered = total - Object.keys(quiz.answers).length;

    if (unanswered > 0 &&
        !confirm(`${unanswered} ta question answer kora hoyni. Submit korbe?`)) {
      return;
    }

    submitQuiz();
  });
}

function setupQuiz() {
  if (!activeQuiz || activeQuiz.submitted) return;

  renderQuizBody();

  if (activeQuiz.endsAt) {
    const tick = () => {
      if (!activeQuiz || activeQuiz.submitted) {
        clearInterval(quizTimer);
        return;
      }

      const left = activeQuiz.endsAt - Date.now();
      const el = document.querySelector('#timer');

      if (left <= 0) {
        clearInterval(quizTimer);
        notify('Time shesh! Auto submit hocche.');
        submitQuiz();
        return;
      }

      if (el) {
        const m = String(Math.floor(left / 60000)).padStart(2, '0');
        const s = String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
        el.textContent = `${m}:${s}`;
      }
    };

    tick();
    quizTimer = setInterval(tick, 1000);
  }
}

async function submitQuiz() {
  if (!activeQuiz || activeQuiz.submitted) return;

  clearInterval(quizTimer);

  const quiz = activeQuiz;
  quiz.score = quiz.questions.filter(
    q => quiz.answers[q.id] === q.correct
  ).length;
  quiz.submitted = true;

  if (quiz.examId) {
    const { error } = await supabase.from('results').insert({
      exam_id: quiz.examId,
      user_id: user.id,
      score: quiz.score,
      total: quiz.questions.length
    });

    if (error) {
      console.error('Result save failed:', error);
    } else {
      myResults[quiz.examId] = {
        score: quiz.score,
        total: quiz.questions.length
      };
    }
  }

  await openPage('quiz');
}

// ---------------- UPLOAD HELPERS ----------------

async function checkConnection() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      headers: { apikey: SUPABASE_KEY },
      signal: controller.signal
    });

    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

function getContentType(file) {
  if (file.type) return file.type;

  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return 'application/pdf';
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  if (name.endsWith('.mp4')) return 'video/mp4';

  return 'application/octet-stream';
}

function isNetworkError(error) {
  const msg = String(error?.message || '').toLowerCase();
  return msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('load failed') ||
    msg.includes('network request failed');
}

async function uploadWithRetry(path, file, attempts = 3) {
  let lastError = null;

  for (let i = 1; i <= attempts; i++) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: getContentType(file)
      });

    if (!error) return;

    lastError = error;

    if (!isNetworkError(error)) break;

    await sleep(1200 * i);
  }

  throw lastError;
}

function explainError(step, error) {
  const msg = error?.message || 'Unknown error';
  const lower = msg.toLowerCase();

  if (isNetworkError(error)) {
    return 'Server-e connect hocche na. Internet/VPN/ad-blocker check koro, ' +
      'ar Vercel-er VITE_SUPABASE_URL thik ache kina dekho. ' +
      'Supabase project paused thakle Restore koro.';
  }

  if (lower.includes('row-level security')) {
    return 'Permission nai (RLS policy). setup.sql file-ta Supabase SQL Editor-e run koro.';
  }

  if (lower.includes('bucket not found')) {
    return `"${BUCKET}" bucket paoa jayni. Supabase Storage-e bucket banao.`;
  }

  if (lower.includes('exceeded') || lower.includes('too large') ||
      lower.includes('payload')) {
    return 'File onek boro. Choto file diye try koro, ba bucket-er size limit barao.';
  }

  if (lower.includes('mime')) {
    return 'Ei file type bucket-e allowed na. Bucket settings-e allowed MIME types check koro.';
  }

  return msg;
}

// ---------------- PUBLISH CONTENT ----------------

async function publishContent(event) {
  event.preventDefault();

  if (uploadBusy) return;

  if (!isAdmin()) {
    notify('Only Main Admin can upload content.');
    return;
  }

  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const notice = document.querySelector('#uploadNotice');
  const file = document.querySelector('#file').files[0];

  const title = document.querySelector('#title').value.trim();

  if (!title) {
    notify('Content title is required.');
    return;
  }

  if (file && file.size > MAX_FILE_MB * 1024 * 1024) {
    notify(`File size must be below ${MAX_FILE_MB} MB.`);
    return;
  }

  uploadBusy = true;
  button.disabled = true;
  button.textContent = 'Uploading...';
  notice.textContent = '';
  notice.className = 'notice';

  let filePath = null;
  let step = 'Starting';

  try {
    step = 'Session Check';
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error('Session expire hoye geche. Abar login koro.');
    }

    if (file) {
      step = 'Connection Check';
      const online = await checkConnection();
      if (!online) {
        throw new Error('Failed to fetch');
      }

      step = 'Storage Upload';

      const safeName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        '_'
      );

      filePath = `${user.id}/${Date.now()}-${safeName}`;

      let body;
      try {
        const buffer = await file.arrayBuffer();
        body = new Blob([buffer], { type: getContentType(file) });
      } catch {
        throw new Error(
          'File porha jachche na. File-ta phone-er Downloads e copy kore abar select koro.'
        );
      }

      await uploadWithRetry(filePath, body);
    }

    step = 'Database Insert';

    const row = {
      title,
      subject: document.querySelector('#subject').value,
      kind: document.querySelector('#kind').value,
      description: document.querySelector('#description').value,
      video_url:
        document.querySelector('#videoUrl').value || null,
      file_path: filePath,
      visibility: 'all',
      created_by: user.id
    };

    const { error: insertError } = await supabase
      .from('contents')
      .insert(row);

    if (insertError) throw insertError;

    step = 'Refreshing Library';

    await loadContents();

    notify('Content successfully published!');
    await openPage('library');

  } catch (error) {
    console.error('Upload error:', step, error);

    if (filePath && step !== 'Storage Upload' &&
        step !== 'Connection Check') {
      try {
        await supabase.storage.from(BUCKET).remove([filePath]);
      } catch {
        /* ignore */
      }
    }

    const message = explainError(step, error);

    notice.textContent = `Failed at: ${step}. ${message}`;
    notice.className = 'notice error';

    notify(`Failed at: ${step}\n${message}`);

  } finally {
    uploadBusy = false;

    if (button.isConnected) {
      button.disabled = false;
      button.textContent = 'Publish Content';
    }
  }
}

// ---------------- OPEN CONTENT ----------------

async function openContent(id) {
  const item = contents.find(c => String(c.id) === String(id));

  if (!item) {
    notify('Content paoa jayni. Page refresh kore abar try koro.');
    return;
  }

  if (item.video_url) {
    window.open(item.video_url, '_blank', 'noopener');
    return;
  }

  if (!item.file_path) {
    notify(item.description || 'No file attached.');
    return;
  }

  const win = window.open('', '_blank');

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(item.file_path, 600);

    if (error) throw error;

    if (win) {
      win.opener = null;
      win.location.href = data.signedUrl;
    } else {
      window.location.href = data.signedUrl;
    }
  } catch (error) {
    if (win) win.close();
    notify('Unable to open content: ' + error.message);
  }
}

// ---------------- PAGE NAVIGATION ----------------

async function openPage(page, opts = {}) {
  const push = opts.push !== false;

  if (!user) {
    authView();
    return;
  }

  if (!isApproved() && page !== 'dashboard') {
    notify('Admin approval is required.');
    return;
  }

  if (!isAdmin() && ADMIN_PAGES.includes(page)) {
    notify('Admin access required.');
    return;
  }

  // Browser history: back chaple app-er bhitoreই thake
  if (push) {
    const state = { page };
    if (history.state?.page === page) {
      history.replaceState(state, '', '#' + page);
    } else {
      history.pushState(state, '', '#' + page);
    }
  }

  // Timer bondho, ar quiz chhere gele active quiz muche felo
  clearInterval(quizTimer);
  if (page !== 'quiz') activeQuiz = null;

  currentPage = page;

  try {
    if (page === 'admin') await loadPendingUsers();
    if (['qbank', 'makeexam', 'aigen'].includes(page)) await loadQuestions();
    if (page === 'exams') await loadExams();
  } catch (e) {
    notify('Could not load data: ' + e.message);
  }

  const pages = {
    dashboard: dashboardPage,
    subjects: subjectsPage,
    subject: subjectDetailPage,
    library: libraryPage,
    admin: adminPage,
    upload: uploadPage,
    qbank: qbankPage,
    aigen: aiGenPage,
    makeexam: makeExamPage,
    exams: examsPage,
    practice: practicePage,
    chat: chatPage,
    quiz: quizPage
  };

  layout((pages[page] || dashboardPage)());
  window.scrollTo(0, 0);

  document.querySelectorAll('[data-subject]').forEach(button => {
    button.onclick = () => {
      currentSubject = button.dataset.subject;
      openPage('subject');
    };
  });

  document.querySelectorAll('[data-open-content]').forEach(button => {
    button.onclick = () =>
      openContent(button.dataset.openContent);
  });

  document.querySelectorAll('[data-approve]').forEach(button => {
    button.onclick = () => approveUser(button.dataset.approve);
  });

  document.querySelectorAll('[data-reject]').forEach(button => {
    button.onclick = () => rejectUser(button.dataset.reject);
  });

  document.querySelectorAll('[data-start-exam]').forEach(button => {
    button.onclick = () => startExam(button.dataset.startExam);
  });

  document.querySelectorAll('[data-del-exam]').forEach(button => {
    button.onclick = () => deleteExam(button.dataset.delExam);
  });

  document.querySelector('#uploadForm')?.addEventListener(
    'submit',
    publishContent
  );

  document.querySelector('#practiceForm')?.addEventListener(
    'submit',
    startPractice
  );

  if (page === 'qbank') setupQbank();
  if (page === 'aigen') setupAiGen();
  if (page === 'makeexam') setupMakeExam();
  if (page === 'chat') setupChat();
  if (page === 'quiz') setupQuiz();

  // File select korle size dekhao
  const fileInput = document.querySelector('#file');
  const fileInfo = document.querySelector('#fileInfo');

  fileInput?.addEventListener('change', () => {
    const f = fileInput.files[0];
    if (!f) {
      fileInfo.textContent = '';
      return;
    }

    const mb = (f.size / 1024 / 1024).toFixed(2);

    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      fileInfo.textContent = `${f.name} (${mb} MB) - onek boro!`;
      fileInfo.className = 'notice error';
    } else {
      fileInfo.textContent = `${f.name} (${mb} MB)`;
      fileInfo.className = 'notice success';
    }
  });
}

// ---------------- BACK BUTTON HANDLING ----------------

// Phone/browser-er Back button: website chhere jabe na,
// app-er ager page-e jabe. Quiz cholar shomoy confirm chaibe.
window.addEventListener('popstate', async event => {
  if (!user) return;

  if (activeQuiz && !activeQuiz.submitted && currentPage === 'quiz') {
    const leave = confirm(
      'Quiz cholche. Ekhon berie gele tomar answer gulo hariye jabe. Berie jabe?'
    );

    if (!leave) {
      history.pushState({ page: 'quiz' }, '', '#quiz');
      return;
    }
  }

  const page = event.state?.page;

  // Shobar shurur sentinel-e pouchale dashboard-e rekhe dei
  if (!page || page === 'root') {
    history.pushState({ page: 'dashboard' }, '', '#dashboard');
    await openPage('dashboard', { push: false });
    return;
  }

  await openPage(page, { push: false });
});

// Quiz cholar shomoy accidentally refresh/close hole warning
window.addEventListener('beforeunload', event => {
  if (activeQuiz && !activeQuiz.submitted && currentPage === 'quiz') {
    event.preventDefault();
    event.returnValue = '';
  }
});

function resetHistory() {
  history.replaceState({ page: 'root' }, '', location.pathname + location.search);
  history.pushState({ page: 'dashboard' }, '', '#dashboard');
}

// ---------------- LOGOUT ----------------

async function logout() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error(error);
  }

  clearInterval(quizTimer);

  user = null;
  profile = null;
  contents = [];
  pendingUsers = [];
  questions = [];
  exams = [];
  myResults = {};
  activeQuiz = null;
  generated = [];
  analysisText = '';
  chatMessages = [];
  chatBusy = false;

  history.replaceState(null, '', location.pathname + location.search);

  authView();
}

// ---------------- APP START ----------------

async function init() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    user = data.session?.user || null;

    if (!user) {
      profile = null;
      contents = [];
      pendingUsers = [];
      authView();
      return;
    }

    await loadProfile();

    if (!profile) {
      app.innerHTML = `
        <div class="status-card">
          <div class="brand-mark">AW</div>
          <h2>Profile Not Found</h2>
          <p>তোমার Profile Database-এ পাওয়া যায়নি।</p>
          <button class="primary-btn" id="logout">
            Logout
          </button>
        </div>
      `;

      document.querySelector('#logout').onclick = logout;
      return;
    }

    await loadContents();

    resetHistory();
    await openPage('dashboard');

  } catch (error) {
    console.error('Initialization error:', error);
    showError(error.message);
  }
}

startApp();
