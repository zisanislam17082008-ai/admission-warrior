import { createClient } from '@supabase/supabase-js';
import './style.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const app = document.querySelector('#app');

let user = null;
let profile = null;
let contents = [];
let currentPage = 'dashboard';

const subjects = [
'Physics',
'Chemistry',
'Higher Math',
'Biology'
];

const escapeHTML = (value = '') =>
String(value).replace(/[&<>"']/g, char => ({
'&': '&',
'<': '<',
'>': '>',
'"': '"',
"'": '''
})[char]);

const isAdmin = () =>
profile?.role === 'main_admin' &&
profile?.status === 'approved';

const isApproved = () =>
profile?.status === 'approved' || isAdmin();

function notify(message) {
alert(message);
}

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
      <button class="outline-btn" id="logout">Logout</button>  
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

function authView() {
app.innerHTML = `
<div class="auth-layout">
<section class="hero-panel">
<div class="brand-mark">AW</div>
<p class="eyebrow">ADMISSION WARRIOR</p>
<h1>স্বপ্নের বিশ্ববিদ্যালয়ের পথে
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
      <button class="tab active" id="loginTab">Login</button>  
      <button class="tab" id="signupTab">Sign Up</button>  
    </div>  

    <form id="authForm">  
      <label>Email  
        <input type="email" id="email" required  
          placeholder="Enter your email">  
      </label>  

      <label>Password  
        <input type="password" id="password"  
          minlength="6" required placeholder="Minimum 6 characters">  
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

document.querySelector('#loginTab').onclick = () => {
signup = false;
document.querySelector('#authTitle').textContent = 'Login';
document.querySelector('#authButton').textContent = 'Login';
document.querySelector('#loginTab').classList.add('active');
document.querySelector('#signupTab').classList.remove('active');
};

document.querySelector('#signupTab').onclick = () => {
signup = true;
document.querySelector('#authTitle').textContent = 'Create Account';
document.querySelector('#authButton').textContent = 'Sign Up';
document.querySelector('#signupTab').classList.add('active');
document.querySelector('#loginTab').classList.remove('active');
};

document.querySelector('#authForm').onsubmit = async event => {
event.preventDefault();

const email = document.querySelector('#email').value.trim();  
const password = document.querySelector('#password').value;  
const button = document.querySelector('#authButton');  
const notice = document.querySelector('#authNotice');  

button.disabled = true;  
button.textContent = 'Please wait...';  

const result = signup  
  ? await supabase.auth.signUp({ email, password })  
  : await supabase.auth.signInWithPassword({ email, password });  

button.disabled = false;  
button.textContent = signup ? 'Sign Up' : 'Login';  

if (result.error) {  
  notice.textContent = result.error.message;  
  notice.className = 'notice error';  
  return;  
}  

if (signup && !result.data.session) {  
  notice.textContent =  
    'Account created. Check your email for confirmation.';  
  notice.className = 'notice success';  
  return;  
}  

await init();

};
}

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
const { data, error } = await supabase
.from('contents')
.select('*')
.eq('visibility', 'all')
.order('created_at', { ascending: false });

if (error) throw error;

contents = data || [];
}

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
      ? 'তোমার পড়াশোনা শুরু করো।'  
      : 'তোমার Account এখনো অনুমোদনের অপেক্ষায় আছে।'}  
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
        <span>${['⚡','🧪','📐','🧬'][index]}</span>  
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
      <span>${['⚡','🧪','📐','🧬'][index]}</span>  
      <h3>${subject}</h3>  
      <p>Study materials and practice</p>  
    </article>  
  `).join('')}  
</div>

`;
}

function renderContentCards(items) {
if (!items.length) {
return   <div class="empty-state">   <span>📚</span>   <h3>No Content Yet</h3>   <p>এখনো কোনো Study Content প্রকাশ করা হয়নি।</p>   </div>  ;
}

return   <div class="content-grid">   ${items.map(item =>
<article class="content-card">
<span class="content-kind">${escapeHTML(item.kind)}</span>
<p class="eyebrow">${escapeHTML(item.subject)}</p>
<h3>${escapeHTML(item.title)}</h3>
<p>${escapeHTML(item.description || '')}</p>

<button class="text-btn"  
        data-open-content="${item.id}">  
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

function adminPage() {
if (!isAdmin()) return dashboardPage();

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

<div class="section-heading">  
  <div>  
    <h2>Admin Actions</h2>  
    <p>Manage your study platform</p>  
  </div>  
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

function uploadPage() {
if (!isAdmin()) return dashboardPage();

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
          ${subjects.map(s => `<option>${s}</option>`).join('')}  
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

    <label>Upload File  
      <input id="file" type="file"  
        accept=".pdf,image/*,video/*">  
    </label>  

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

async function publishContent(event) {
event.preventDefault();

if (!isAdmin()) {
notify('Only Main Admin can upload content.');
return;
}

const button = event.submitter;
button.disabled = true;
button.textContent = 'Uploading...';

try {
const file = document.querySelector('#file').files[0];
let filePath = null;

if (file) {  
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');  
  filePath = `${user.id}/${Date.now()}-${safeName}`;  

  const upload = await supabase.storage  
    .from('study-content')  
    .upload(filePath, file);  

  if (upload.error) throw upload.error;  
}  

const row = {  
  title: document.querySelector('#title').value.trim(),  
  subject: document.querySelector('#subject').value,  
  kind: document.querySelector('#kind').value,  
  description: document.querySelector('#description').value,  
  video_url: document.querySelector('#videoUrl').value || null,  
  file_path: filePath,  
  visibility: 'all',  
  created_by: user.id  
};  

const { error } = await supabase  
  .from('contents')  
  .insert(row);  

if (error) throw error;  

notify('Content successfully published!');  
await loadContents();  
openPage('library');

} catch (error) {
notify('Upload failed: ' + error.message);
} finally {
button.disabled = false;
button.textContent = 'Publish Content';
}
}

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

const { data, error } = await supabase.storage
.from('study-content')
.createSignedUrl(item.file_path, 300);

if (error) {
notify(error.message);
return;
}

window.open(data.signedUrl, '_blank', 'noopener');
}

async function openPage(page) {
if (!user) return authView();

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
notify(${button.dataset.subject} materials coming soon.);
};
});

document.querySelectorAll('[data-open-content]').forEach(button => {
button.onclick = () => openContent(button.dataset.openContent);
});

document.querySelector('#uploadForm')?.addEventListener(
'submit',
publishContent
);
}

async function logout() {
await supabase.auth.signOut();
user = null;
profile = null;
contents = [];
authView();
}

async function init() {
try {
const { data, error } = await supabase.auth.getSession();
if (error) throw error;

user = data.session?.user || null;  

if (!user) {  
  authView();  
  return;  
}  

await loadProfile();  

if (!profile) {  
  app.innerHTML = `  
    <div class="status-card">  
      <div class="brand-mark">AW</div>  
      <h2>Profile Not Found</h2>  
      <p>তোমার Profile Database-এ পাওয়া যায়নি। Admin-এর সাহায্য প্রয়োজন।</p>  
      <button class="primary-btn" id="logout">Logout</button>  
    </div>  
  `;  
  document.querySelector('#logout').onclick = logout;  
  return;  
}  

await loadContents();  
await openPage('dashboard');

} catch (error) {
app.innerHTML =   <div class="status-card">   <h2>Something went wrong</h2>   <p>${escapeHTML(error.message)}</p>   <button class="primary-btn" id="retry">Try Again</button>   </div>  ;
document.querySelector('#retry').onclick = init;
}
}

// Initialize the app once.
init();
