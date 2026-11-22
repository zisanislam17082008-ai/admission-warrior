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
let currentPage = 'dashboard';
let uploadBusy = false;

const subjects = ['Physics', 'Chemistry', 'Higher Math', 'Biology'];
const icons = ['⚡', '🧪', '📐', '🧬'];

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
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

// ---------------- INITIALIZATION ----------------

function startApp() {
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

        ${isAdmin() ? `
          <p class="side-label">ADMINISTRATION</p>
          <button class="side-link" data-page="admin">
            🛡️ Admin Panel
          </button>
          <button class="side-link" data-page="upload">
            📤 Upload Content
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
          : 'তোমার Account অনুমোদনের অপেক্ষায় আছে।'}
        </p>
      </div>
    </section>

    ${!isApproved() ? `
      <div class="empty-state">
        <span>⏳</span>
        <h3>Pending Approval</h3>
        <p>Admin অনুমোদন দিলে Study Library ব্যবহার করতে পারবে।</p>
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
          <p>Study materials and practice</p>
        </article>
      `).join('')}
    </div>
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
        <span>🛡️</span>
        <h3>Main Admin</h3>
        <p>${escapeHTML(user.email)}</p>
      </article>
    </div>

    <div class="subject-grid">
      <article class="subject-card">
        <span>📤</span>
        <h3>Upload Content</h3>
        <p>PDF, Notes, Images and Videos</p>
        <button class="primary-btn" data-page="upload">
          Upload Now
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
              ${subjects.map(s =>
                `<option value="${s}">${s}</option>`
              ).join('')}
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

// ---------------- UPLOAD HELPERS ----------------

// Supabase server-e pouchhano jay kina check kore
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

// Network error hole 2 bar retry kore
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
    // Session valid kina check
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

      // Android-e Drive/Downloads theke file nile direct upload fail kore,
      // tai age memory-te porhe nei
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

    // Database insert fail hole upload kora file muche fele
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
  const item = contents.find(c => c.id === id);

  if (!item) return;

  if (item.video_url) {
    window.open(item.video_url, '_blank', 'noopener');
    return;
  }

  if (!item.file_path) {
    notify(item.description || 'No file attached.');
    return;
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(item.file_path, 300);

    if (error) throw error;

    window.open(data.signedUrl, '_blank', 'noopener');

  } catch (error) {
    notify('Unable to open content: ' + error.message);
  }
}

// ---------------- PAGE NAVIGATION ----------------

async function openPage(page) {
  if (!user) {
    authView();
    return;
  }

  if (!isApproved() && page !== 'dashboard') {
    notify('Admin approval is required.');
    return;
  }

  if (!isAdmin() && ['admin', 'upload'].includes(page)) {
    notify('Admin access required.');
    return;
  }

  currentPage = page;

  const pages = {
    dashboard: dashboardPage,
    subjects: subjectsPage,
    library: libraryPage,
    admin: adminPage,
    upload: uploadPage
  };

  layout((pages[page] || dashboardPage)());

  document.querySelectorAll('[data-subject]').forEach(button => {
    button.onclick = () => {
      notify(`${button.dataset.subject} materials coming soon.`);
    };
  });

  document.querySelectorAll('[data-open-content]').forEach(button => {
    button.onclick = () =>
      openContent(button.dataset.openContent);
  });

  document.querySelector('#uploadForm')?.addEventListener(
    'submit',
    publishContent
  );

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

// ---------------- LOGOUT ----------------

async function logout() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error(error);
  }

  user = null;
  profile = null;
  contents = [];

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
    await openPage('dashboard');

  } catch (error) {
    console.error('Initialization error:', error);
    showError(error.message);
  }
}

startApp();
