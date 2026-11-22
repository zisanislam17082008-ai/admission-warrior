/**
 * main.js — Admission Warrior Core Engine
 * Features:
 * 1. HistoryRechecker (Safe in-app navigation & Back button interception)
 * 2. Bangladesh HSC Science Syllabus (Physics, Higher Math, Chemistry, Biology)
 * 3. Question Bank Upload (PDF/TXT) & Pattern Analysis
 * 4. Predictable MCQ Generator (Up to 60 MCQs) with 4-Option Integrity Recheck
 * 5. Timed Exam Engine (Answers & Explanations strictly revealed AFTER Submit)
 * 6. Gemini Free Model API Connector + Offline Smart Fallback
 */

(function () {
  'use strict';

  const STORAGE = {
    GEMINI_KEY: 'aw_gemini_api_key_v1',
    HISTORY: 'aw_history_stack_v1',
    BANK_TEXT: 'aw_qn_bank_text_v1',
    LAST_SCORE: 'aw_last_score_v1',
  };

  // ==================== 1. BANGLADESH HSC SCIENCE SYLLABUS ====================
  const HSC_SYLLABUS = {
    Physics: [
      { paper: '1st Paper', chapter: 'ভেক্টর (Vector)', weight: 'High (DU / BUET)' },
      { paper: '1st Paper', chapter: 'নিউটনিয়ান বলবিদ্যা (Newtonian Mechanics)', weight: 'Very High' },
      { paper: '1st Paper', chapter: 'কাজ, শক্তি ও ক্ষমতা (Work, Energy & Power)', weight: 'High' },
      { paper: '1st Paper', chapter: 'মহাকর্ষ ও অভিকর্ষ (Gravitation & Gravity)', weight: 'Medium' },
      { paper: '1st Paper', chapter: 'পর্যাবৃত্ত গতি (Periodic Motion)', weight: 'High' },
      { paper: '2nd Paper', chapter: 'তাপগতিবিদ্যা (Thermodynamics)', weight: 'Very High' },
      { paper: '2nd Paper', chapter: 'স্থির তড়িৎ ও চল তড়িৎ (Electrostatics & Current)', weight: 'Very High' },
      { paper: '2nd Paper', chapter: 'ভৌত আলোকবিজ্ঞান (Physical Optics)', weight: 'High' },
      { paper: '2nd Paper', chapter: 'আধুনিক পদার্থবিজ্ঞানের সূচনা (Modern Physics)', weight: 'Very High' },
      { paper: '2nd Paper', chapter: 'সেমিকন্ডাক্টর ও ইলেকট্রনিক্স (Semiconductors)', weight: 'High' },
    ],
    'Higher Math': [
      { paper: '1st Paper', chapter: 'ম্যাট্রিক্স ও নির্ণায়ক (Matrices & Determinants)', weight: 'Very High' },
      { paper: '1st Paper', chapter: 'সরলরেখা ও বৃত্ত (Straight Lines & Circle)', weight: 'High' },
      { paper: '1st Paper', chapter: 'ত্রিকোণমিতিক অনুপাত (Trigonometry)', weight: 'High' },
      { paper: '1st Paper', chapter: 'অন্তরীকরণ (Differentiation)', weight: 'Very High' },
      { paper: '1st Paper', chapter: 'যোগজীকরণ (Integration)', weight: 'Very High' },
      { paper: '2nd Paper', chapter: 'জটিল সংখ্যা (Complex Numbers)', weight: 'High' },
      { paper: '2nd Paper', chapter: 'বহুপদী ও বহুপদী সমীকরণ (Polynomials)', weight: 'High' },
      { paper: '2nd Paper', chapter: 'কনিকস (Conics: Parabola, Ellipse, Hyperbola)', weight: 'Very High' },
      { paper: '2nd Paper', chapter: 'বিপরীত ত্রিকোণমিতিক ফাংশন (Inverse Trig)', weight: 'High' },
      { paper: '2nd Paper', chapter: 'স্থিতিবিদ্যা ও সমতলে বস্তুকণার গতি (Statics & Dynamics)', weight: 'High' },
    ],
    Chemistry: [
      { paper: '1st Paper', chapter: 'গুণগত রসায়ন (Qualitative Chemistry)', weight: 'Very High' },
      { paper: '1st Paper', chapter: 'মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন', weight: 'Very High' },
      { paper: '1st Paper', chapter: 'রাসায়নিক পরিবর্তন (Chemical Changes & Kp/Kc)', weight: 'Very High' },
      { paper: '1st Paper', chapter: 'কর্মমুখী রসায়ন (Vocational Chemistry)', weight: 'Medium' },
      { paper: '2nd Paper', chapter: 'পরিবেশ রসায়ন (Environmental Chemistry)', weight: 'High' },
      { paper: '2nd Paper', chapter: 'জৈব রসায়ন (Organic Chemistry)', weight: 'Very High' },
      { paper: '2nd Paper', chapter: 'পরিমাণগত রসায়ন (Quantitative Chemistry)', weight: 'Very High' },
      { paper: '2nd Paper', chapter: 'তড়িৎ রসায়ন (Electrochemistry)', weight: 'High' },
    ],
    Biology: [
      { paper: 'Botany', chapter: 'কোষ ও এর গঠন (Cell & Its Structure)', weight: 'Very High' },
      { paper: 'Botany', chapter: 'কোষ বিভাজন (Cell Division)', weight: 'High' },
      { paper: 'Botany', chapter: 'অণুজীব (Microorganisms)', weight: 'High' },
      { paper: 'Botany', chapter: 'উদ্ভিদ শারীরতত্ত্ব (Plant Physiology)', weight: 'Very High' },
      { paper: 'Botany', chapter: 'জীবপ্রযুক্তি (Biotechnology)', weight: 'High' },
      { paper: 'Zoology', chapter: 'প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', weight: 'High' },
      { paper: 'Zoology', chapter: 'পরিপাক ও শোষণ (Digestion & Absorption)', weight: 'High' },
      { paper: 'Zoology', chapter: 'রক্ত ও সঞ্চালন (Blood & Circulation)', weight: 'Very High' },
      { paper: 'Zoology', chapter: 'সমন্বয় ও নিয়ন্ত্রণ (Coordination & Control)', weight: 'High' },
      { paper: 'Zoology', chapter: 'জিনতত্ত্ব ও বিবর্তন (Genetics & Evolution)', weight: 'Very High' },
    ],
  };

  // Curated High-Yield Fallback Question Bank (Used when offline or before API key is added)
  const CURATED_ADMISSION_BANK = [
    {
      subject: 'Physics',
      chapter: 'ভেক্টর (Vector)',
      question: '$\\vec{A} = 2\\hat{i} + 3\\hat{j} - \\hat{k}$ এবং $\\vec{B} = m\\hat{i} + 2\\hat{j} + 4\\hat{k}$ পরস্পর লম্ব হলে $m$-এর মান কত?',
      options: ['1', '-1', '2', '-2'],
      correctIndex: 1,
      explanation: 'দুটি ভেক্টর লম্ব হলে $\\vec{A}\\cdot\\vec{B} = 0 \\Rightarrow 2m + 6 - 4 = 0 \\Rightarrow 2m = -2 \\Rightarrow m = -1$।'
    },
    {
      subject: 'Physics',
      chapter: 'আধুনিক পদার্থবিজ্ঞানের সূচনা (Modern Physics)',
      question: 'কোনো ধাতব পৃষ্ঠের কার্য অপেক্ষক $2.2\\text{ eV}$ হলে সূচন তরঙ্গদৈর্ঘ্য প্রায় কত?',
      options: ['$5640\\text{ \\AA}$', '$4500\\text{ \\AA}$', '$6200\\text{ \\AA}$', '$3200\\text{ \\AA}$'],
      correctIndex: 0,
      explanation: '$\\lambda_0 = \\frac{hc}{\\phi} = \\frac{12400\\text{ eV\\cdot\\AA}}{2.2\\text{ eV}} \\approx 5636\\text{ \\AA} \\approx 5640\\text{ \\AA}$।'
    },
    {
      subject: 'Higher Math',
      chapter: 'অন্তরীকরণ (Differentiation)',
      question: '$\\lim_{x \\to 0} \\frac{1 - \\cos 4x}{x^2}$ এর মান কত?',
      options: ['4', '8', '16', '2'],
      correctIndex: 1,
      explanation: '$\\lim_{x \\to 0} \\frac{2\\sin^2(2x)}{x^2} = 2 \\times 2^2 = 8$।'
    },
    {
      subject: 'Higher Math',
      chapter: 'ম্যাট্রিক্স ও নির্ণায়ক (Matrices & Determinants)',
      question: '$A = \\begin{pmatrix} 3 & 4 \\\\ 2 & 3 \\end{pmatrix}$ হলে $A^{-1}$ কোনটি?',
      options: [
        '$\\begin{pmatrix} 3 & -4 \\\\ -2 & 3 \\end{pmatrix}$',
        '$\\begin{pmatrix} 3 & 4 \\\\ 2 & 3 \\end{pmatrix}$',
        '$\\begin{pmatrix} -3 & 4 \\\\ 2 & -3 \\end{pmatrix}$',
        '$\\frac{1}{2}\\begin{pmatrix} 3 & -4 \\\\ -2 & 3 \\end{pmatrix}$'
      ],
      correctIndex: 0,
      explanation: '$|A| = 9 - 8 = 1$, এবং অ্যাডজয়েন্ট ম্যাট্রিক্স নিলে $A^{-1} = \\begin{pmatrix} 3 & -4 \\\\ -2 & 3 \\end{pmatrix}$।'
    },
    {
      subject: 'Chemistry',
      chapter: 'রাসায়নিক পরিবর্তন (Chemical Changes & Kp/Kc)',
      question: '$25^\\circ\\text{C}$ তাপমাত্রায় $0.005\\text{ M } H_2SO_4$ দ্রবণের $\\text{pH}$ কত?',
      options: ['2.0', '2.3', '1.7', '3.0'],
      correctIndex: 0,
      explanation: '$H_2SO_4$ দ্বি-ক্ষারকীয় এসিড, তাই $[H^+] = 2 \\times 0.005 = 0.01 = 10^{-2}\\text{ M} \\Rightarrow \\text{pH} = 2.0$।'
    },
    {
      subject: 'Chemistry',
      chapter: 'জৈব রসায়ন (Organic Chemistry)',
      question: 'নিচের কোন যৌগটি টলেন বিকারকের সাথে সিলভার দর্পণ পরীক্ষা দেয়?',
      options: ['প্রোপানোন', 'ইথান্যাল', 'ইথানল', 'ডাইইথাইল ইথার'],
      correctIndex: 1,
      explanation: 'অ্যালডিহাইডসমূহ (যেমন ইথান্যাল, $CH_3CHO$) টলেন বিকারককে বিজারিত করে সিলভার দর্পণ সৃষ্টি করে।'
    },
    {
      subject: 'Biology',
      chapter: 'উদ্ভিদ শারীরতত্ত্ব (Plant Physiology)',
      question: 'সবাত শ্বসনে এক অণু গ্লুকোজ সম্পূর্ণ জারিত হলে ক্রেবস চক্রে সরাসরি কতটি $\\text{ATP}$ (বা $\\text{GTP}$) তৈরি হয়?',
      options: ['2 টি', '4 টি', '24 টি', '36 টি'],
      correctIndex: 0,
      explanation: 'প্রতি অণু গ্লুকোজ থেকে ২ অণু অ্যাসিটাইল CoA ক্রেবস চক্রে প্রবেশ করে এবং সরাসরি ২ অণু GTP (যা ২ অণু ATP-এর সমতুল্য) উৎপন্ন হয়।'
    },
    {
      subject: 'Biology',
      chapter: 'রক্ত ও সঞ্চালন (Blood & Circulation)',
      question: 'মানবদেহের কোন রক্তকণিকা অ্যান্টিবডি তৈরি করে রোগ প্রতিরোধে অংশ নেয়?',
      options: ['নিউট্রোফিল', 'B-লিম্ফোসাইট', 'বেসোফিল', 'মনোসাইট'],
      correctIndex: 1,
      explanation: 'B-লিম্ফোসাইট প্লাজমা কোষে রূপান্তরিত হয়ে অ্যান্টিবডি উৎপন্ন করে।'
    },
    {
      subject: 'Physics',
      chapter: 'তাপগতিবিদ্যা (Thermodynamics)',
      question: 'রুদ্ধতাপীয় প্রক্রিয়ায় নিচের কোন রাশিটি স্থির থাকে?',
      options: ['তাপমাত্রা', 'চাপ', 'এনট্রপি', 'আয়তন'],
      correctIndex: 2,
      explanation: 'প্রত্যাবর্তী রুদ্ধতাপীয় প্রক্রিয়ায় তাপের আদান-প্রদান ($dQ = 0$) হয় না বলে এনট্রপি ($dS = dQ/T = 0$) স্থির থাকে।'
    },
    {
      subject: 'Higher Math',
      chapter: 'জটিল সংখ্যা (Complex Numbers)',
      question: '$i^{4n+3}$ (যেখানে $n \\in \\mathbb{Z}$) এর মান কোনটি?',
      options: ['$1$', '$-1$', '$i$', '$-i$'],
      correctIndex: 3,
      explanation: '$i^{4n+3} = (i^4)^n \\cdot i^3 = 1 \\cdot (-i) = -i$।'
    }
  ];

  // ==================== 2. SAFE HISTORY RECHECKER ====================
  class HistoryRechecker {
    constructor(defaultView = 'home') {
      this.defaultView = defaultView;
      this.stack = this.loadAndRecheck();
      this.isPopping = false;
    }

    loadAndRecheck() {
      try {
        const raw = sessionStorage.getItem(STORAGE.HISTORY);
        const parsed = raw ? JSON.parse(raw) : [];
        const valid = Array.isArray(parsed)
          ? parsed.filter((v) => typeof v === 'string' && v.trim().length > 0).slice(-30)
          : [];
        return valid.length ? valid : [this.defaultView];
      } catch {
        return [this.defaultView];
      }
    }

    recheck() {
      if (!Array.isArray(this.stack) || this.stack.length === 0) {
        this.stack = [this.defaultView];
      }
      // Collapse accidental consecutive duplicate views
      const cleaned = [];
      for (const view of this.stack) {
        if (cleaned[cleaned.length - 1] !== view) {
          cleaned.push(view);
        }
      }
      this.stack = cleaned.length ? cleaned : [this.defaultView];
      try {
        sessionStorage.setItem(STORAGE.HISTORY, JSON.stringify(this.stack));
      } catch {
        // Ignore quota error
      }
      return this.stack;
    }

    init(onRouteChange) {
      this.recheck();
      const active = this.stack[this.stack.length - 1];
      const hash = `#${active}`;

      try {
        window.history.replaceState({ awGuard: true, view: active }, '', hash);
        window.history.pushState({ awActive: true, view: active }, '', hash);
      } catch {
        window.location.hash = hash;
      }

      window.addEventListener('popstate', () => {
        if (this.isPopping) return;
        this.isPopping = true;
        try {
          this.recheck();
          if (this.stack.length > 1) {
            this.stack.pop();
            const prevView = this.stack[this.stack.length - 1];
            this.recheck();
            try {
              window.history.pushState({ awActive: true, view: prevView }, '', `#${prevView}`);
            } catch {
              window.location.hash = `#${prevView}`;
            }
            onRouteChange(prevView, 'back');
          } else {
            // Keep user inside the web app instead of exiting on single Back press
            const rootView = this.stack[0];
            try {
              window.history.pushState({ awAnchor: true, view: rootView }, '', `#${rootView}`);
            } catch {
              window.location.hash = `#${rootView}`;
            }
            onRouteChange(rootView, 'anchored');
          }
        } finally {
          setTimeout(() => {
            this.isPopping = false;
          }, 40);
        }
      });

      onRouteChange(active, 'init');
    }

    push(view, onRouteChange) {
      this.recheck();
      if (this.stack[this.stack.length - 1] !== view) {
        this.stack.push(view);
        this.recheck();
        try {
          window.history.pushState({ awActive: true, view }, '', `#${view}`);
        } catch {
          window.location.hash = `#${view}`;
        }
      }
      onRouteChange(view, 'push');
    }

    back(onRouteChange) {
      this.recheck();
      if (this.stack.length > 1) {
        this.stack.pop();
        const prev = this.stack[this.stack.length - 1];
        this.recheck();
        try {
          window.history.replaceState({ awActive: true, view: prev }, '', `#${prev}`);
        } catch {
          window.location.hash = `#${prev}`;
        }
        onRouteChange(prev, 'back');
        return true;
      }
      return false;
    }
  }

  // ==================== 3. QUESTION INTEGRITY RECHECKER ====================
  function recheckMcqItem(raw, fallbackSubject = 'Science') {
    if (!raw || typeof raw !== 'object') return null;
    const question = String(raw.question || '').trim();
    if (!question) return null;

    let options = Array.isArray(raw.options)
      ? raw.options.map((o) => String(o || '').trim()).filter(Boolean)
      : [];

    if (options.length !== 4) return null;

    // Ensure 4 distinct options
    const unique = new Set(options.map((o) => o.toLowerCase()));
    if (unique.size !== 4) return null;

    let correctIndex = Number(raw.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      const letterMap = { A: 0, B: 1, C: 2, D: 3 };
      const key = String(raw.correctAnswer || raw.answer || 'A').trim().toUpperCase();
      correctIndex = letterMap[key] ?? 0;
    }

    return {
      subject: String(raw.subject || fallbackSubject),
      chapter: String(raw.chapter || 'HSC Admission'),
      question,
      options,
      correctIndex,
      explanation: String(raw.explanation || 'সঠিক উত্তরটি HSC মূল পাঠ্যবইয়ের সূত্র ও ধারণা অনুযায়ী নির্ধারিত হয়েছে।').trim(),
    };
  }

  // ==================== 4. MAIN APPLICATION CONTROLLER ====================
  const AppState = {
    history: new HistoryRechecker('home'),
    bankText: localStorage.getItem(STORAGE.BANK_TEXT) || '',
    questions: [],
    userAnswers: {},
    isSubmitted: false,
    timerSeconds: 900,
    timerInterval: null,
  };

  function showToast(msg) {
    const box = document.getElementById('toastBox');
    if (!box) return;
    box.textContent = msg;
    box.classList.remove('hidden');
    clearTimeout(box._t);
    box._t = setTimeout(() => box.classList.add('hidden'), 3200);
  }

  function typesetMath() {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise().catch(() => {});
    }
  }

  function getGeminiKey() {
    return (localStorage.getItem(STORAGE.GEMINI_KEY) || '').trim();
  }

  function updateApiBadge() {
    const btn = document.getElementById('btnApiStatus');
    if (!btn) return;
    if (getGeminiKey()) {
      btn.textContent = 'Gemini Connected ✓';
      btn.className = 'px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-medium';
    } else {
      btn.textContent = 'Connect API Key';
      btn.className = 'px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-medium';
    }
  }

  async function callGeminiAPI(promptText, expectJson = false) {
    const apiKey = getGeminiKey();
    if (!apiKey) {
      throw new Error('NO_API_KEY');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
      },
    };

    if (expectJson) {
      body.generationConfig.responseMimeType = 'application/json';
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API Error (${res.status})`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) throw new Error('Empty response from Gemini');
    return text;
  }

  function renderView(viewName, action) {
    document.querySelectorAll('.view-section').forEach((sec) => {
      sec.classList.add('hidden');
    });
    const target = document.getElementById(`view-${viewName}`) || document.getElementById('view-home');
    target.classList.remove('hidden');

    document.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-nav') === viewName);
    });

    if (action === 'anchored') {
      showToast('You are on the Home screen (Safe In-App Back active).');
    }
    typesetMath();
  }

  // Public API attached to window.AWApp
  window.AWApp = {
    navigate(view) {
      AppState.history.push(view, renderView);
    },

    goBack() {
      const moved = AppState.history.back(renderView);
      if (!moved) {
        showToast('Already at the starting screen.');
      }
    },

    selectSubjectAndGo(subject) {
      const subjEl = document.getElementById('genSubject');
      if (subjEl) {
        subjEl.value = subject;
        this.syncChapterOptions();
      }
      this.navigate('qnbank');
    },

    syncChapterOptions() {
      const subj = document.getElementById('genSubject').value;
      const chapSelect = document.getElementById('genChapter');
      chapSelect.innerHTML = '<option value="Full HSC Syllabus">Full HSC Syllabus</option>';

      const subjects = subj === 'All Science' ? Object.keys(HSC_SYLLABUS) : [subj];
      subjects.forEach((s) => {
        (HSC_SYLLABUS[s] || []).forEach((item) => {
          const opt = document.createElement('option');
          opt.value = `${s}: ${item.chapter}`;
          opt.textContent = `${s} — ${item.chapter}`;
          chapSelect.appendChild(opt);
        });
      });
    },

    renderSyllabus(subject = 'Physics') {
      const grid = document.getElementById('syllabusChaptersGrid');
      const items = HSC_SYLLABUS[subject] || [];
      grid.innerHTML = items
        .map(
          (item) => `
          <div class="rounded-2xl bg-slate-950/65 border border-white/10 p-4 flex items-center justify-between gap-3">
            <div>
              <span class="text-[11px] text-emerald-300 font-medium">${item.paper} • ${item.weight}</span>
              <h4 class="text-sm font-semibold text-white mt-0.5">${item.chapter}</h4>
            </div>
            <button onclick="AWApp.practiceChapter('${subject}', '${item.chapter.replace(/'/g, "\\'")}')" class="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              Practice
            </button>
          </div>
        `
        )
        .join('');
    },

    practiceChapter(subject, chapter) {
      document.getElementById('genSubject').value = subject;
      this.syncChapterOptions();
      document.getElementById('genChapter').value = `${subject}: ${chapter}`;
      document.getElementById('genCount').value = 10;
      this.navigate('qnbank');
      this.generateQuestions();
    },

    async handleBankFileUpload(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      const label = document.getElementById('uploadedFileName');
      label.textContent = `Reading: ${file.name}...`;

      try {
        let extracted = '';
        if (file.name.toLowerCase().endsWith('.pdf') && window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const buffer = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
          const maxPages = Math.min(pdf.numPages, 25);
          for (let p = 1; p <= maxPages; p++) {
            const page = await pdf.getPage(p);
            const content = await page.getTextContent();
            extracted += content.items.map((it) => it.str).join(' ') + '\n';
          }
        } else {
          extracted = await file.text();
        }

        extracted = extracted.trim();
        if (!extracted) throw new Error('Could not extract readable text from file.');

        AppState.bankText = extracted;
        localStorage.setItem(STORAGE.BANK_TEXT, extracted.slice(0, 40000));
        document.getElementById('qnBankText').value = extracted;
        document.getElementById('statBankCount').textContent = `${Math.max(1, Math.round(extracted.length / 180))} Qns`;
        label.textContent = `Loaded: ${file.name} (${extracted.length.toLocaleString()} chars)`;
        showToast('Question Bank loaded! Click "Analyze Pattern" or "Generate MCQs".');
      } catch (err) {
        label.textContent = `Error: ${err.message}`;
        showToast('File read failed. You can paste the text directly.');
      }
    },

    loadSampleBank() {
      const sample = [
        '1. দুটি সমান ভেক্টরের লব্ধি এদের যেকোনো একটির সমান হলে ভেক্টরদ্বয়ের মধ্যবর্তী কোণ কত? (DU A-Unit)',
        '2. রুদ্ধতাপীয় প্রক্রিয়ায় গ্যাসের চাপ ও আয়তনের সম্পর্ক কোনটি? (BUET / GST)',
        '3. lim(x->0) (sin 5x / x) এর মান কত? (DU)',
        '4. 0.01 M HCl দ্রবণের pH কত? (Medical / DU)',
        '5. বেনজিন বলয়ে নাইট্রেশন বিক্রিয়ায় ইলেকট্রোফাইল কোনটি? (GST)',
        '6. মাইটোকন্ড্রিয়ার কোন অংশে ATP সিন্থেজ থাকে? (Medical / DU)',
        '7. মানুষের রক্তের স্বাভাবিক pH কত? (Medical)',
        '8. ফটোইলেকট্রিক ক্রিয়ায় নির্গত ইলেকট্রনের সর্বোচ্চ গতিশক্তি আলোর কম্পাঙ্কের সমানুপাতিক। (DU)',
      ].join('\n');

      document.getElementById('qnBankText').value = sample;
      AppState.bankText = sample;
      localStorage.setItem(STORAGE.BANK_TEXT, sample);
      document.getElementById('statBankCount').textContent = '8 Qns';
      showToast('HSC Admission Sample Question Bank loaded.');
    },

    async analyzeQuestionBank() {
      const text = (document.getElementById('qnBankText').value || '').trim();
      const box = document.getElementById('analysisResultBox');
      if (!text) {
        showToast('Please upload or paste a Question Bank first.');
        return;
      }

      AppState.bankText = text;
      localStorage.setItem(STORAGE.BANK_TEXT, text.slice(0, 40000));
      box.classList.remove('hidden');
      box.innerHTML = '<span class="text-indigo-300">Analyzing HSC chapter frequency &amp; question patterns...</span>';

      try {
        if (getGeminiKey()) {
          const prompt = `Analyze this Bangladesh University Admission Question Bank (HSC Science: Physics, Math, Chemistry, Biology). Provide a concise Bangla + English bullet summary of:
1. Dominant HSC chapters & topics
2. Question style (conceptual vs mathematical shortcut)
3. Top 4 predictable topics for upcoming exams.

Question Bank snippet:
${text.slice(0, 6000)}`;
          const reply = await callGeminiAPI(prompt, false);
          box.innerHTML = `<div class="font-semibold text-indigo-300 mb-1">AI Question Bank Pattern Analysis:</div><div class="whitespace-pre-line leading-relaxed">${reply}</div>`;
        } else {
          // Local keyword & topic heuristic analysis
          const lower = text.toLowerCase();
          const detected = [];
          if (/ভেক্টর|vector|বল|গতি|তাপ|তড়িৎ|আলোক/.test(lower)) detected.push('Physics (Vector, Mechanics, Thermodynamics, Electricity)');
          if (/lim|sin|cos|ম্যাট্রিক্স|matrix|অন্তরীকরণ|যোগজীকরণ|কনিক/.test(lower)) detected.push('Higher Math (Calculus, Matrix, Trigonometry, Conics)');
          if (/ph|জৈব|বেনজিন|মোল|রসায়ন|acid|হাইড্রোকার্বন/.test(lower)) detected.push('Chemistry (Quantitative pH, Organic Reaction, Chemical Change)');
          if (/কোষ|রক্ত|শ্বসন|atp|জিন|উদ্ভিদ|প্রাণী/.test(lower)) detected.push('Biology (Cell Biology, Plant Physiology, Blood & Genetics)');
          if (!detected.length) detected.push('Mixed HSC Science Core Concepts');

          box.innerHTML = `
            <div class="font-semibold text-indigo-300">Pattern Analysis Complete (Local Engine):</div>
            <ul class="list-disc pl-4 space-y-1 mt-1">
              <li><strong>Detected Subjects:</strong> ${detected.join(', ')}</li>
              <li><strong>Exam Format:</strong> Conceptual + 30-second formula application (DU A-Unit / GST standard)</li>
              <li><strong>Recommendation:</strong> Generate 15–30 Predictable MCQs to test speed &amp; negative marking accuracy.</li>
            </ul>
          `;
        }
      } catch (err) {
        box.innerHTML = `<span class="text-rose-300">Analysis note: ${err.message}</span>`;
      }
    },

    async generateQuestions() {
      const subject = document.getElementById('genSubject').value;
      const standard = document.getElementById('genStandard').value;
      const chapter = document.getElementById('genChapter').value;
      const mode = document.getElementById('genMode').value;
      let count = parseInt(document.getElementById('genCount').value, 10) || 15;
      count = Math.max(1, Math.min(60, count)); // Enforce max 60 MCQs
      document.getElementById('genCount').value = count;

      const bankText = (document.getElementById('qnBankText').value || AppState.bankText || '').trim();
      const progressBox = document.getElementById('genProgressBox');
      const btn = document.getElementById('btnGenerateMcqs');

      progressBox.classList.remove('hidden');
      progressBox.textContent = `Generating ${count} rechecked MCQs (${standard})...`;
      btn.disabled = true;

      let finalQuestions = [];

      try {
        if (getGeminiKey()) {
          const prompt = `You are a Bangladesh University Admission Exam Setter (${standard}, NCTB HSC Science Syllabus: Physics, Higher Math, Chemistry, Biology).
Generate EXACTLY ${count} high-standard MCQs in Bangla (with standard English scientific symbols and LaTeX $...$ for math/physics formulas).
Subject focus: ${subject}
Chapter focus: ${chapter}
Mode: ${mode}
${bankText ? `Reference Question Bank to analyze & predict similar/next-level questions from:\n${bankText.slice(0, 7500)}` : ''}

Strict Rules:
- Every MCQ must have 4 distinct, unambiguous options.
- Double-check calculations and scientific facts so the answer is 100% accurate.
- Return ONLY a valid JSON array of objects with keys:
  "subject": string,
  "chapter": string,
  "question": string,
  "options": [string, string, string, string],
  "correctIndex": number (0, 1, 2, or 3),
  "explanation": string (concise step-by-step Bangla explanation)`;

          const rawJson = await callGeminiAPI(prompt, true);
          const cleanedJson = rawJson.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
          const parsed = JSON.parse(cleanedJson);
          if (Array.isArray(parsed)) {
            finalQuestions = parsed
              .map((item) => recheckMcqItem(item, subject))
              .filter(Boolean)
              .slice(0, 60);
          }
        }
      } catch (err) {
        showToast(`Using built-in HSC bank (${err.message === 'NO_API_KEY' ? 'Connect Gemini API for unlimited custom sets' : 'API fallback'}).`);
      } finally {
        btn.disabled = false;
      }

      // Fallback / Top-up from curated HSC Admission Bank so quiz always runs smoothly
      if (finalQuestions.length === 0) {
        const pool = CURATED_ADMISSION_BANK.filter(
          (q) => subject === 'All Science' || q.subject === subject
        );
        const source = pool.length ? pool : CURATED_ADMISSION_BANK;
        while (finalQuestions.length < count) {
          const base = source[finalQuestions.length % source.length];
          finalQuestions.push({
            ...base,
            question:
              finalQuestions.length >= source.length
                ? `${base.question} [Set ${Math.floor(finalQuestions.length / source.length) + 1}]`
                : base.question,
          });
        }
      }

      document.getElementById('statGeneratedCount').textContent = `${finalQuestions.length}`;
      progressBox.textContent = `Ready! ${finalQuestions.length} verified MCQs generated. Launching Exam...`;
      this.startExamWithQuestions(finalQuestions, `${standard} • ${subject} (${finalQuestions.length} MCQs)`);
    },

    quickStartExam() {
      const shuffled = [...CURATED_ADMISSION_BANK].sort(() => Math.random() - 0.5);
      this.startExamWithQuestions(shuffled, 'Quick Admission Model Test (10 MCQs)');
    },

    startExamWithQuestions(questions, title) {
      AppState.questions = questions.slice(0, 60);
      AppState.userAnswers = {};
      AppState.isSubmitted = false;
      AppState.timerSeconds = AppState.questions.length * 60; // 1 min per MCQ (standard DU/GST pace)

      document.getElementById('examHeaderTitle').textContent = title;
      document.getElementById('examMetaSubtitle').textContent =
        'Answers & solutions are hidden during the test and will be revealed right after you click Submit Exam.';
      document.getElementById('examResultSummary').classList.add('hidden');
      document.getElementById('btnSubmitExam').disabled = false;
      document.getElementById('btnSubmitExam').classList.remove('opacity-50');

      this.renderExamQuestions();
      this.startExamTimer();
      this.navigate('exam');
    },

    startExamTimer() {
      clearInterval(AppState.timerInterval);
      const display = document.getElementById('examTimerDisplay');

      const tick = () => {
        const mins = Math.floor(AppState.timerSeconds / 60);
        const secs = AppState.timerSeconds % 60;
        display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (AppState.timerSeconds <= 0) {
          clearInterval(AppState.timerInterval);
          if (!AppState.isSubmitted) {
            showToast('Time is up! Auto-submitting your exam...');
            this.submitExam();
          }
        }
        AppState.timerSeconds--;
      };

      tick();
      AppState.timerInterval = setInterval(tick, 1000);
    },

    selectOption(qIndex, optIndex) {
      if (AppState.isSubmitted) return; // Lock selections after submit
      AppState.userAnswers[qIndex] = optIndex;
      this.renderExamQuestions();
    },

    renderExamQuestions() {
      const container = document.getElementById('examQuestionsContainer');
      const labels = ['ক (A)', 'খ (B)', 'গ (C)', 'ঘ (D)'];

      container.innerHTML = AppState.questions
        .map((q, qIdx) => {
          const picked = AppState.userAnswers[qIdx];
          const submitted = AppState.isSubmitted;

          const optionsHtml = q.options
            .map((opt, oIdx) => {
              let stateClass = '';
              if (!submitted) {
                if (picked === oIdx) stateClass = 'selected';
              } else {
                if (oIdx === q.correctIndex) stateClass = 'correct-reveal';
                else if (picked === oIdx && picked !== q.correctIndex) stateClass = 'wrong-reveal';
              }

              return `
                <button
                  type="button"
                  ${submitted ? 'disabled' : ''}
                  onclick="AWApp.selectOption(${qIdx}, ${oIdx})"
                  class="omr-option ${stateClass} w-full text-left px-4 py-3 rounded-2xl border border-white/10 bg-slate-950/60 text-sm flex items-start gap-3">
                  <span class="font-bold text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-300 shrink-0 mt-0.5">${labels[oIdx]}</span>
                  <span class="leading-relaxed">${opt}</span>
                </button>
              `;
            })
            .join('');

          // Explanation block is ONLY rendered after Submit
          const answerRevealHtml = submitted
            ? `
              <div class="mt-3 pt-3 border-t border-white/10 text-xs space-y-1">
                <div class="font-semibold ${picked === q.correctIndex ? 'text-emerald-400' : picked === undefined ? 'text-amber-300' : 'text-rose-400'}">
                  ${
                    picked === q.correctIndex
                      ? '✓ Correct Answer!'
                      : picked === undefined
                      ? `• Skipped — Correct: ${labels[q.correctIndex]}`
                      : `✕ Wrong — Correct: ${labels[q.correctIndex]}`
                  }
                </div>
                <p class="text-slate-300 leading-relaxed"><strong>Solution:</strong> ${q.explanation}</p>
              </div>
            `
            : '';

          return `
            <article class="soft-card rounded-3xl p-5 sm:p-6 space-y-3.5">
              <div class="flex items-center justify-between gap-2 text-xs">
                <span class="px-2.5 py-0.5 rounded-full bg-white/5 text-emerald-300 font-medium">Q${qIdx + 1} • ${q.subject}</span>
                <span class="text-slate-400">${q.chapter}</span>
              </div>
              <h3 class="text-sm sm:text-base font-semibold text-white leading-relaxed">${q.question}</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">${optionsHtml}</div>
              ${answerRevealHtml}
            </article>
          `;
        })
        .join('');

      typesetMath();
    },

    submitExam() {
      if (AppState.isSubmitted || AppState.questions.length === 0) return;
      AppState.isSubmitted = true;
      clearInterval(AppState.timerInterval);

      const useNeg = document.getElementById('negMarkToggle').checked;
      let correct = 0;
      let wrong = 0;
      let skipped = 0;

      AppState.questions.forEach((q, idx) => {
        const picked = AppState.userAnswers[idx];
        if (picked === undefined) skipped++;
        else if (picked === q.correctIndex) correct++;
        else wrong++;
      });

      const total = AppState.questions.length;
      const netScore = Math.max(0, correct - (useNeg ? wrong * 0.25 : 0));
      const scoreText = `${netScore.toFixed(2)} / ${total}`;

      localStorage.setItem(STORAGE.LAST_SCORE, scoreText);
      document.getElementById('statLastScore').textContent = scoreText;

      const summaryCard = document.getElementById('examResultSummary');
      summaryCard.classList.remove('hidden');
      document.getElementById('scoreHeadline').textContent = `Net Score: ${scoreText}`;
      document.getElementById('scoreBreakdownGrid').innerHTML = `
        <div class="rounded-2xl bg-emerald-500/10 border border-emerald-400/25 p-3">
          <div class="text-slate-400">Correct (+1)</div>
          <div class="text-lg font-bold text-emerald-400">${correct}</div>
        </div>
        <div class="rounded-2xl bg-rose-500/10 border border-rose-400/25 p-3">
          <div class="text-slate-400">Wrong (${useNeg ? '-0.25' : '0'})</div>
          <div class="text-lg font-bold text-rose-400">${wrong}</div>
        </div>
        <div class="rounded-2xl bg-amber-500/10 border border-amber-400/25 p-3">
          <div class="text-slate-400">Skipped</div>
          <div class="text-lg font-bold text-amber-300">${skipped}</div>
        </div>
        <div class="rounded-2xl bg-indigo-500/10 border border-indigo-400/25 p-3">
          <div class="text-slate-400">Accuracy</div>
          <div class="text-lg font-bold text-indigo-300">${total ? Math.round((correct / total) * 100) : 0}%</div>
        </div>
      `;

      const submitBtn = document.getElementById('btnSubmitExam');
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50');

      this.renderExamQuestions();
      summaryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Exam submitted! All correct answers & solutions are now unlocked.');
    },

    retakeExam() {
      if (!AppState.questions.length) return;
      this.startExamWithQuestions(AppState.questions, document.getElementById('examHeaderTitle').textContent);
    },

    // ==================== 5. GEMINI AI CHATBOT & KEY MODAL ====================
    toggleChat(open) {
      const drawer = document.getElementById('aiChatDrawer');
      drawer.classList.toggle('translate-x-full', !open);
    },

    async sendChatMessage(event) {
      event.preventDefault();
      const input = document.getElementById('chatInputField');
      const list = document.getElementById('chatMessagesList');
      const userMsg = (input.value || '').trim();
      if (!userMsg) return;

      input.value = '';
      list.innerHTML += `
        <div class="ml-auto max-w-[85%] rounded-2xl bg-emerald-500/20 border border-emerald-400/30 p-3 text-xs text-emerald-50 leading-relaxed">
          ${userMsg.replace(/</g, '&lt;')}
        </div>
      `;
      const pendingId = `msg_${Date.now()}`;
      list.innerHTML += `<div id="${pendingId}" class="rounded-2xl bg-slate-800/80 p-3 text-xs text-slate-400">Thinking...</div>`;
      list.scrollTop = list.scrollHeight;

      try {
        let reply = '';
        if (getGeminiKey()) {
          const contextPrompt = `You are a helpful Bangladesh HSC Science & University Admission Tutor (Physics, Higher Math, Chemistry, Biology). Answer clearly in Bangla + English with formulas in $...$.
${AppState.bankText ? `Context from student's uploaded Question Bank:\n${AppState.bankText.slice(0, 2500)}\n` : ''}
Student question: ${userMsg}`;
          reply = await callGeminiAPI(contextPrompt, false);
        } else {
          reply =
            'Gemini API Key এখনো যুক্ত করা হয়নি। ওপরে ডানপাশের "Connect API Key" বাটনে গিয়ে আপনার ফ্রি Google AI Studio key সেভ করলে আমি যেকোনো গাণিতিক সমস্যা, জৈব রসায়ন বিক্রিয়া বা Question Bank বিশ্লেষণ করে উত্তর দিতে পারব!';
        }

        const bubble = document.getElementById(pendingId);
        if (bubble) {
          bubble.className = 'rounded-2xl bg-slate-800/90 border border-white/10 p-3.5 text-xs text-slate-100 whitespace-pre-line leading-relaxed';
          bubble.textContent = reply;
        }
        typesetMath();
      } catch (err) {
        const bubble = document.getElementById(pendingId);
        if (bubble) {
          bubble.className = 'rounded-2xl bg-rose-950/70 border border-rose-400/30 p-3 text-xs text-rose-200';
          bubble.textContent = `Error: ${err.message}`;
        }
      }
      list.scrollTop = list.scrollHeight;
    },

    openKeyModal() {
      document.getElementById('geminiKeyInput').value = getGeminiKey();
      document.getElementById('apiKeyModal').classList.remove('hidden');
    },

    closeKeyModal() {
      document.getElementById('apiKeyModal').classList.add('hidden');
    },

    saveGeminiKey() {
      const val = (document.getElementById('geminiKeyInput').value || '').trim();
      if (val) {
        localStorage.setItem(STORAGE.GEMINI_KEY, val);
        showToast('Gemini API Key saved successfully!');
      } else {
        localStorage.removeItem(STORAGE.GEMINI_KEY);
        showToast('Gemini API Key removed.');
      }
      updateApiBadge();
      this.closeKeyModal();
    },
  };

  // ==================== 6. INITIALIZE ON LOAD ====================
  document.addEventListener('DOMContentLoaded', () => {
    updateApiBadge();
    AWApp.syncChapterOptions();
    AWApp.renderSyllabus('Physics');

    const savedScore = localStorage.getItem(STORAGE.LAST_SCORE);
    if (savedScore) {
      document.getElementById('statLastScore').textContent = savedScore;
    }

    if (AppState.bankText) {
      document.getElementById('qnBankText').value = AppState.bankText;
      document.getElementById('statBankCount').textContent = `${Math.max(1, Math.round(AppState.bankText.length / 180))} Qns`;
    }

    // Boot HistoryRechecker so Back button stays safely inside the web app
    AppState.history.init(renderView);
  });
})();
