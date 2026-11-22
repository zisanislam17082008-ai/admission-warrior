import { createClient } from '@supabase/supabase-js';
import './style.css';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = url && key && !url.includes('YOUR_PROJECT') ? createClient(url, key) : null;
const app = document.querySelector('#app');
let mode = 'admission';
let user = null;
let profile = null;
let contents = [];
const subjects = ['Physics','Chemistry','Higher Math','Biology'];

function shell(content) {
  app.innerHTML = `<header><div class="brand"><span class="logo">AW</span><div><b>Admission Warrior</b><small>লক্ষ্য বিশ্ববিদ্যালয়ে ভর্তি</small></div></div><span class="tag">${supabase ? 'Online setup' : 'Demo mode'}</span></header><main>${content}</main><footer>Admission Warrior · Learn • Practice • Win</footer>`;
}
function authView() {
  shell(`<section class="hero"><p class="eyebrow">YOUR ADMISSION JOURNEY STARTS HERE</p><h1>স্বপ্নের বিশ্ববিদ্যালয়ের পথে<br><em>তুমিই Warrior</em></h1><p>বিষয়ভিত্তিক প্রস্তুতি, সাজানো স্টাডি লাইব্রেরি এবং MCQ অনুশীলন।</p></section>
  <section class="panel"><h2>শুরু করো</h2><div class="tabs"><button class="active" id="loginTab">লগইন</button><button id="signupTab">নতুন অ্যাকাউন্ট</button></div><form id="authForm"><label>ইমেইল<input type="email" id="email" required placeholder="তোমার ইমেইল"></label><label>পাসওয়ার্ড<input type="password" id="password" minlength="6" required placeholder="কমপক্ষে ৬ অক্ষর"></label><button class="primary" type="submit" id="authSubmit">লগইন</button></form><p class="hint" id="authHint">নতুন হলে নতুন অ্যাকাউন্ট নির্বাচন করো।</p></section>`);
  let signup = false;
  const loginTab = document.querySelector('#loginTab'), signupTab = document.querySelector('#signupTab');
  function setTab(v){signup=v;loginTab.classList.toggle('active',!v);signupTab.classList.toggle('active',v);document.querySelector('#authSubmit').textContent=v?'রেজিস্ট্রেশন':'লগইন';document.querySelector('#authHint').textContent=v?'রেজিস্ট্রেশনের পর Main Admin অনুমোদন না দেওয়া পর্যন্ত অ্যাকাউন্ট Pending থাকবে।':'তোমার অ্যাকাউন্টে প্রবেশ করো।'}
  loginTab.onclick=()=>setTab(false);signupTab.onclick=()=>setTab(true);
  document.querySelector('#authForm').onsubmit=async e=>{e.preventDefault();const email=document.querySelector('#email').value,password=document.querySelector('#password').value; if(!supabase){alert('Demo mode: Supabase URL ও Publishable key সেট করলে অনলাইন লগইন চালু হবে।');return;} const res=signup?await supabase.auth.signUp({email,password}):await supabase.auth.signInWithPassword({email,password});if(res.error){alert(res.error.message);return;}if(signup){alert('রেজিস্ট্রেশন হয়েছে। Admin অনুমোদনের অপেক্ষা করো।');}await init();};
}
function dashboard() {
  const approved = profile?.status === 'approved' || profile?.role === 'main_admin';
  shell(`<section class="welcome"><div><p class="eyebrow">${mode==='admission'?'UNIVERSITY ADMISSION':'HSC PREPARATION'}</p><h1>স্বাগতম, Warrior!</h1><p>${approved?'আজকের প্রস্তুতি শুরু করো।':'তোমার অ্যাকাউন্ট Admin অনুমোদনের অপেক্ষায় আছে।'}</p></div><button id="logout" class="ghost">লগআউট</button></section>
  <section class="toolbar"><div class="tabs"><button id="admissionMode" class="${mode==='admission'?'active':''}">ভর্তি প্রস্তুতি</button><button id="hscMode" class="${mode==='hsc'?'active':''}">HSC প্রস্তুতি</button></div></section>
  <section class="grid">${subjects.map((s,i)=>`<article class="subject"><span class="num">0${i+1}</span><h3>${s}</h3><p>কনসেপ্ট রিভিশন ও MCQ অনুশীলন</p><button data-subject="${s}" class="outline">বিষয় খুলুন →</button></article>`).join('')}</section>
  <section class="panel"><div class="panelHead"><div><p class="eyebrow">STUDY LIBRARY</p><h2>স্টাডি লাইব্রেরি</h2></div><span class="tag">${contents.length} items</span></div><div id="library">${approved?renderContents():'অনুমোদনের পর পড়ার উপকরণ দেখতে পাবে।'}</div></section>
  ${profile?.role==='main_admin'?`<section class="panel"><p class="eyebrow">MAIN ADMIN</p><h2>কনটেন্ট যোগ করো</h2><form id="uploadForm"><label>শিরোনাম<input id="title" required placeholder="যেমন: পর্যায় সারণি"></label><label>বিষয়<select id="subject">${subjects.map(s=>`<option>${s}</option>`).join('')}</select></label><label>ধরন<select id="kind"><option value="note">নোট</option><option value="pdf">PDF</option><option value="image">ছবি</option><option value="video">ভিডিও URL</option><option value="mcq">MCQ</option></select></label><label>ফাইল / ভিডিও URL<input id="file" type="file" accept=".pdf,image/*,video/*"></label><label>ভিডিও URL (ঐচ্ছিক)<input id="videoUrl" type="url" placeholder="https://..."></label><label>বর্ণনা<textarea id="description" rows="3"></textarea></label><button class="primary">কনটেন্ট প্রকাশ করো</button></form></section>`:''}`);
  document.querySelector('#logout').onclick=async()=>{if(supabase)await supabase.auth.signOut();user=null;profile=null;authView();};
  document.querySelector('#admissionMode').onclick=()=>{mode='admission';dashboard();};document.querySelector('#hscMode').onclick=()=>{mode='hsc';dashboard();};
  document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=()=>alert(`${b.dataset.subject}: এখানে অধ্যায়ভিত্তিক কনটেন্ট ও পরীক্ষা যোগ করা যাবে।`));
  document.querySelector('#uploadForm')?.addEventListener('submit',publish);
}
function renderContents(){return contents.length?contents.map(c=>`<div class="contentRow"><div><b>${escapeHtml(c.title)}</b><small>${escapeHtml(c.subject||'')} · ${escapeHtml(c.kind||'')}</small></div>${c.file_url?`<a href="${c.file_url}" target="_blank" rel="noreferrer">খুলুন ↗</a>`:''}</div>`).join(''):'এখনো কোনো কনটেন্ট প্রকাশ করা হয়নি।';}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function publish(e){e.preventDefault();if(!supabase||!user){alert('অনলাইন Supabase সেটআপ প্রয়োজন।');return;}const file=document.querySelector('#file').files[0];let file_url=null;if(file){const path=`${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;const up=await supabase.storage.from('study-content').upload(path,file);if(up.error){alert(up.error.message);return;}file_url=path;}const row={title:document.querySelector('#title').value,subject:document.querySelector('#subject').value,kind:document.querySelector('#kind').value,description:document.querySelector('#description').value,video_url:document.querySelector('#videoUrl').value||null,file_path:file_url,visibility:'all',created_by:user.id};const result=await supabase.from('contents').insert(row);if(result.error){alert(result.error.message);return;}alert('কনটেন্ট যোগ হয়েছে।');await loadContents();dashboard();}
async function loadContents(){if(!supabase||!user)return;const {data}=await supabase.from('contents').select('*').eq('visibility','all').order('created_at',{ascending:false});contents=data||[];}
async function init(){if(!supabase){authView();return;}const {data}=await supabase.auth.getSession();user=data.session?.user||null;if(!user){authView();return;}const p=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();profile=p.data;await loadContents();dashboard();}
init();
