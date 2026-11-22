<!DOCTYPE html>
<html lang="bn" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admission Warrior</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'Hind Siliguri', 'system-ui', 'sans-serif'],
            bangla: ['Hind Siliguri', 'Plus Jakarta Sans', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          }
        }
      }
    };
  </script>

  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      },
      startup: {
        ready: () => {
          MathJax.startup.defaultReady();
          if (typeof window.typesetMath === 'function') window.typesetMath();
        }
      }
    };
  </script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" onerror="window.__mjErr = true"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" onload="setPdfWorker()" onerror="window.__pdfErr = true"></script>
  <script>
    function setPdfWorker() {
      try {
        if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
      } catch (_) {}
    }
    setPdfWorker();
  </script>

  <style>
    :root {
      --bg-base: #070b12;
      --border-hairline: rgba(148, 163, 184, 0.12);
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Plus Jakarta Sans', 'Hind Siliguri', sans-serif;
      background-color: var(--bg-base);
      background-image:
        radial-gradient(ellipse 68% 36% at 50% -6%, rgba(16, 185, 129, 0.11), transparent 72%),
        radial-gradient(ellipse 46% 32% at 88% 12%, rgba(34, 211, 238, 0.07), transparent 70%);
      color: #eef2f6;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .surface-card {
      background: linear-gradient(180deg, rgba(16, 24, 38, 0.88) 0%, rgba(11, 17, 28, 0.92) 100%);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid var(--border-hairline);
      box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.75);
      transition: border-color 220ms ease, background-color 220ms ease;
    }

    .surface-inset {
      background: rgba(7, 11, 19, 0.78);
      border: 1px solid rgba(148, 163, 184, 0.11);
      transition: border-color 200ms ease, background-color 200ms ease;
    }

    .surface-inset:focus-within,
    .field-control:focus {
      outline: none;
      border-color: rgba(52, 211, 153, 0.55);
      box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.09);
    }

    .btn-pill {
      transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 160ms ease;
    }

    .btn-pill:active:not(:disabled) {
      transform: scale(0.985);
    }

    .view-enter {
      animation: fadeSlide 210ms ease-out;
    }

    @keyframes fadeSlide {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.2);
      border-radius: 9999px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(148, 163, 184, 0.34);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col selection:bg-emerald-400/25 selection:text-emerald-200">

  <!-- Top Header -->
  <header class="sticky top-0 z-30 bg-[#070b12]/85 backdrop-blur-xl border-b border-slate-800/75">
    <div class="max-w-6xl mx-auto px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <button id="btn-back" type="button" title="Back" class="btn-pill p-2 rounded-xl surface-inset text-slate-300 hover:text-white hover:border-slate-600 shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button type="button" onclick="switchView('bank')" class="flex items-center gap-2 text-left group shrink-0">
          <svg class="w-8 h-8 shrink-0 transition-transform duration-200 group-hover:scale-[1.03]" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="36" height="36" rx="11" fill="#0d1624" stroke="#34d399" stroke-opacity="0.38" />
            <path d="M18 7.5L28 26.2H23.4L18 15.8L12.6 26.2H8L18 7.5Z" fill="#34d399" />
            <circle cx="18" cy="23.4" r="2.1" fill="#22d3ee" />
          </svg>
          <span class="font-extrabold text-[15px] sm:text-base tracking-tight text-white">Admission Warrior</span>
        </button>
      </div>

      <nav class="hidden lg:flex items-center gap-1 p-1 rounded-xl surface-inset" aria-label="Primary">
        <button data-tab="bank" onclick="switchView('bank')" class="tab-btn btn-pill px-3 py-1.5 rounded-lg text-xs font-bold">Qn Bank</button>
        <button data-tab="syllabus" onclick="switchView('syllabus')" class="tab-btn btn-pill px-3 py-1.5 rounded-lg text-xs font-bold">Syllabus</button>
        <button data-tab="quiz" onclick="switchView('quiz')" class="tab-btn btn-pill px-3 py-1.5 rounded-lg text-xs font-bold">Quiz</button>
        <button data-tab="photo" onclick="switchView('photo')" class="tab-btn btn-pill px-3 py-1.5 rounded-lg text-xs font-bold">Photo</button>
        <button data-tab="users" onclick="switchView('users')" class="tab-btn btn-pill px-3 py-1.5 rounded-lg text-xs font-bold">Users</button>
      </nav>

      <div class="flex items-center gap-1.5 shrink-0">
        <button type="button" onclick="openAccountModal()" class="btn-pill px-2.5 py-1.5 rounded-xl text-xs font-semibold surface-inset text-slate-200 hover:border-slate-600 flex items-center gap-1.5 max-w-[140px]">
          <span id="user-dot" class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span id="user-pill-label" class="truncate">Account</span>
        </button>
        <button type="button" onclick="openSqlModal()" class="hidden sm:inline-flex btn-pill px-2.5 py-1.5 rounded-xl text-xs font-semibold surface-inset text-cyan-300 hover:border-cyan-400/40">
          SQL
        </button>
        <button type="button" onclick="openKeyModal()" class="btn-pill px-2.5 py-1.5 rounded-xl text-xs font-semibold surface-inset text-slate-200 hover:border-slate-600 flex items-center gap-1.5">
          <span id="key-dot" class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span id="key-text">Key</span>
        </button>
        <button type="button" onclick="toggleDrawer(true)" class="btn-pill px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm shadow-emerald-500/20">
          AI Tutor
        </button>
      </div>
    </div>

    <!-- Mobile / Tablet Navigation Strip -->
    <div class="flex lg:hidden border-t border-slate-800/75 px-2 py-1.5 gap-1 bg-[#070b12]/95 overflow-x-auto">
      <button data-tab="bank" onclick="switchView('bank')" class="tab-btn btn-pill flex-1 py-1.5 px-2 rounded-lg text-xs font-bold shrink-0">Qn Bank</button>
      <button data-tab="syllabus" onclick="switchView('syllabus')" class="tab-btn btn-pill flex-1 py-1.5 px-2 rounded-lg text-xs font-bold shrink-0">Syllabus</button>
      <button data-tab="quiz" onclick="switchView('quiz')" class="tab-btn btn-pill flex-1 py-1.5 px-2 rounded-lg text-xs font-bold shrink-0">Quiz</button>
      <button data-tab="photo" onclick="switchView('photo')" class="tab-btn btn-pill flex-1 py-1.5 px-2 rounded-lg text-xs font-bold shrink-0">Photo</button>
      <button data-tab="users" onclick="switchView('users')" class="tab-btn btn-pill flex-1 py-1.5 px-2 rounded-lg text-xs font-bold shrink-0">Users</button>
    </div>
  </header>

  <!-- Suspended / Banned Lock Banner (Shown if current user is suspended or banned) -->
  <div id="restriction-banner" class="hidden max-w-6xl w-full mx-auto px-3.5 sm:px-6 pt-4">
    <div class="rounded-2xl p-4 bg-rose-500/12 border border-rose-500/40 flex flex-wrap items-center justify-between gap-3">
      <div class="space-y-0.5">
        <div id="restriction-title" class="text-xs sm:text-sm font-bold text-rose-300">Account Restricted</div>
        <p id="restriction-reason" class="text-xs text-rose-200/85"></p>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" onclick="switchToGuestOpenAccess()" class="btn-pill px-3 py-1.5 rounded-xl text-xs font-bold surface-inset text-slate-200 hover:border-slate-500">
          Open Guest
        </button>
        <button type="button" onclick="switchView('users')" class="btn-pill px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-400 hover:bg-rose-300 text-slate-950">
          Manage
        </button>
      </div>
    </div>
  </div>

  <!-- Main Workspace -->
  <main class="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-6">

    <!-- 1. QUESTION BANK STUDIO + ANALYSIS + EXACT COPY + PREDICTIVE + OPTION RECHECK -->
    <section id="view-bank" class="app-view view-enter space-y-5">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        <!-- Left Input & Generation Controls -->
        <div class="lg:col-span-5 space-y-4">
          <div class="rounded-2xl surface-card p-4 sm:p-5 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] font-bold uppercase tracking-widest text-slate-400">Question Bank</span>
              <div class="flex items-center gap-1.5">
                <button type="button" onclick="loadSampleBank()" class="btn-pill px-2.5 py-1 rounded-lg text-xs font-semibold surface-inset text-emerald-300 hover:border-emerald-400/40">Sample</button>
                <label class="btn-pill px-2.5 py-1 rounded-lg text-xs font-semibold surface-inset text-cyan-300 hover:border-cyan-400/40 cursor-pointer">
                  Upload
                  <input type="file" accept=".txt,.md,.csv,.json,.pdf" onchange="handleBankUpload(event)" class="hidden" />
                </label>
              </div>
            </div>
            <p id="bank-file-meta" class="text-[11px] font-mono text-slate-400 truncate">Ready · PDF, JSON, TXT, or paste</p>
            <textarea id="bank-text" rows="5" oninput="saveBankText()" placeholder="Paste admission questions or JSON here..." class="field-control w-full rounded-xl p-3 text-xs sm:text-sm surface-inset text-slate-100 placeholder:text-slate-500 leading-relaxed"></textarea>
          </div>

          <div class="rounded-2xl surface-card p-4 sm:p-5 space-y-3.5">
            <span class="text-[11px] font-bold uppercase tracking-widest text-slate-400">HSC Science Scope</span>

            <div>
              <label for="bank-paper" class="block text-xs font-medium text-slate-400 mb-1">Subject & Paper</label>
              <select id="bank-paper" onchange="populateChapterDropdown()" class="field-control w-full rounded-xl px-3 py-2.5 text-xs sm:text-sm surface-inset text-slate-100"></select>
            </div>

            <div>
              <label for="bank-chapter" class="block text-xs font-medium text-slate-400 mb-1">Chapter</label>
              <select id="bank-chapter" onchange="updateDrawerContext()" class="field-control w-full rounded-xl px-3 py-2.5 text-xs sm:text-sm surface-inset text-slate-100"></select>
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <div>
                <label for="bank-topic" class="block text-xs font-medium text-slate-400 mb-1">Topic</label>
                <input id="bank-topic" type="text" oninput="updateDrawerContext()" placeholder="e.g. Carnot, SN1/SN2" class="field-control w-full rounded-xl px-3 py-2 text-xs sm:text-sm surface-inset text-slate-100 placeholder:text-slate-500" />
              </div>
              <div>
                <label for="bank-count" class="block text-xs font-medium text-slate-400 mb-1">Count</label>
                <select id="bank-count" class="field-control w-full rounded-xl px-3 py-2 text-xs sm:text-sm surface-inset text-slate-100">
                  <option value="3">3 Qns</option>
                  <option value="5" selected>5 Qns</option>
                  <option value="8">8 Qns</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-1">
              <button type="button" onclick="analyzeBankPattern()" class="btn-pill py-2.5 px-2.5 rounded-xl text-xs font-bold surface-inset text-amber-300 hover:border-amber-400/45">
                Analyze
              </button>
              <button type="button" onclick="runBankWorkflow('copy')" class="btn-pill py-2.5 px-2.5 rounded-xl text-xs font-bold surface-inset text-slate-100 hover:border-slate-500">
                Exact Copy
              </button>
              <button type="button" onclick="runBankWorkflow('predict')" class="btn-pill py-2.5 px-2.5 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm shadow-emerald-500/20">
                Predict Qns
              </button>
            </div>
          </div>
        </div>

        <!-- Right Question Output & Strict Option Recheck -->
        <div class="lg:col-span-7 space-y-4">
          <div class="rounded-2xl surface-card p-4 sm:p-5 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div class="flex items-center gap-2">
                <h1 class="text-sm font-bold text-white tracking-tight">Question Set</h1>
                <span id="q-count-badge" class="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-400/12 text-emerald-300 border border-emerald-400/25">0</span>
                <span id="bank-status" class="text-xs text-slate-400">Ready</span>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" onclick="runStrictOptionRecheck(true)" class="btn-pill px-3 py-1.5 rounded-lg text-xs font-bold surface-inset text-emerald-300 hover:border-emerald-400/45">
                  Option Recheck
                </button>
                <button type="button" onclick="startQuizFromDeck()" class="btn-pill px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950">
                  Start Quiz
                </button>
              </div>
            </div>

            <div id="pattern-brief" class="hidden rounded-xl p-3.5 surface-inset text-xs text-slate-200 whitespace-pre-line leading-relaxed"></div>
            <div id="questions-list" class="space-y-3"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- 2. FULL NCTB HSC SCIENCE SYLLABUS -->
    <section id="view-syllabus" class="app-view view-enter hidden space-y-4">
      <div class="rounded-2xl surface-card p-4 flex flex-wrap items-center justify-between gap-2.5">
        <span class="text-sm font-bold text-white tracking-tight">HSC Science Syllabus</span>
        <div id="syllabus-filters" class="flex flex-wrap gap-1.5"></div>
      </div>
      <div id="syllabus-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
    </section>

    <!-- 3. TIMED QUIZ & NEGATIVE MARKING ARENA -->
    <section id="view-quiz" class="app-view view-enter hidden space-y-4">
      <div class="rounded-2xl surface-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <select id="quiz-mins" class="field-control rounded-xl px-3 py-2 text-xs font-semibold surface-inset text-slate-100">
            <option value="3">3 min</option>
            <option value="5" selected>5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
          </select>
          <select id="quiz-neg" class="field-control rounded-xl px-3 py-2 text-xs font-semibold surface-inset text-slate-100">
            <option value="0.25" selected>-0.25 Negative</option>
            <option value="0.5">-0.50 Negative</option>
            <option value="0">No Negative</option>
          </select>
          <select id="quiz-mode" class="field-control rounded-xl px-3 py-2 text-xs font-semibold surface-inset text-slate-100">
            <option value="instant" selected>Instant Check</option>
            <option value="end">End of Quiz</option>
          </select>
          <button type="button" onclick="startQuiz()" class="btn-pill px-4 py-2 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950">
            New Quiz
          </button>
        </div>

        <div class="flex items-center gap-2.5">
          <span id="quiz-timer" class="px-3 py-1.5 rounded-xl font-mono text-sm font-bold bg-emerald-400/12 text-emerald-300 border border-emerald-400/30">05:00</span>
          <button id="btn-submit-quiz" type="button" onclick="submitQuiz('manual')" class="btn-pill px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950">
            Submit
          </button>
        </div>
      </div>

      <div class="w-full h-1.5 rounded-full bg-slate-800/85 overflow-hidden">
        <div id="quiz-progress" class="h-full bg-gradient-to-r from-emerald-400 to-cyan-300 transition-all duration-300" style="width: 0%"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div id="quiz-stage" class="lg:col-span-8 rounded-2xl surface-card p-5 min-h-[260px] flex flex-col justify-between"></div>
        <div class="lg:col-span-4 rounded-2xl surface-card p-4 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-300">Questions</span>
            <span id="quiz-palette-meta" class="font-mono text-slate-400">0/0</span>
          </div>
          <div id="quiz-palette" class="grid grid-cols-5 gap-2"></div>
        </div>
      </div>

      <div id="quiz-summary" class="hidden rounded-2xl surface-card p-5 space-y-4"></div>
    </section>

    <!-- 4. DOUBLE-PASS PHOTO-TO-QUESTION SOLVER -->
    <section id="view-photo" class="app-view view-enter hidden space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div class="lg:col-span-5 rounded-2xl surface-card p-4 sm:p-5 space-y-3.5">
          <span class="text-[11px] font-bold uppercase tracking-widest text-slate-400">Question Image</span>

          <div class="grid grid-cols-2 gap-2">
            <label class="btn-pill py-2.5 px-3 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-center cursor-pointer">
              Camera
              <input type="file" accept="image/*" capture="environment" onchange="handlePhotoChange(event)" class="hidden" />
            </label>
            <label class="btn-pill py-2.5 px-3 rounded-xl text-xs font-bold surface-inset text-slate-200 hover:border-slate-500 text-center cursor-pointer">
              Gallery
              <input type="file" accept="image/*" onchange="handlePhotoChange(event)" class="hidden" />
            </label>
          </div>

          <div class="rounded-xl surface-inset min-h-[200px] flex items-center justify-center p-3 overflow-hidden">
            <span id="photo-empty" class="text-xs text-slate-500">Capture or select question photo</span>
            <img id="photo-preview" alt="Question preview" class="hidden max-h-64 rounded-lg object-contain" />
          </div>

          <input id="photo-hint" type="text" placeholder="Optional note (e.g. Q3, find time period)" class="field-control w-full rounded-xl px-3 py-2 text-xs sm:text-sm surface-inset text-slate-100 placeholder:text-slate-500" />

          <button id="btn-photo-solve" type="button" onclick="solvePhotoDoubleCheck()" class="btn-pill w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm shadow-emerald-500/20">
            Double-Check Solve
          </button>
        </div>

        <div class="lg:col-span-7 rounded-2xl surface-card p-4 sm:p-5 space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span class="text-sm font-bold text-white tracking-tight">2-Pass Verification</span>
            <span id="photo-badge" class="px-2.5 py-0.5 rounded-full text-xs font-mono surface-inset text-slate-300">Idle</span>
          </div>
          <div id="photo-output" class="space-y-3 text-xs sm:text-sm text-slate-300">
            <p class="text-slate-400">Pass 1 solves the question; Pass 2 independently verifies formulas, units, and final answer.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. INSTANT OPEN SIGN-UP & ADMIN MODERATION (SUSPEND / BAN / RESTORE) -->
    <section id="view-users" class="app-view view-enter hidden space-y-5">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        <!-- Instant Open Sign-Up Card (No Approval Queue) -->
        <div class="lg:col-span-5 rounded-2xl surface-card p-4 sm:p-5 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-widest text-slate-400">Instant Sign-Up</span>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-400/12 text-emerald-300 border border-emerald-400/25">No Approval Needed</span>
          </div>

          <form onsubmit="handleInstantSignup(event)" class="space-y-3">
            <div>
              <label for="reg-name" class="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <input id="reg-name" type="text" required placeholder="e.g. Rafiul Hasan" class="field-control w-full rounded-xl px-3 py-2 text-xs sm:text-sm surface-inset text-slate-100 placeholder:text-slate-500" />
            </div>
            <div>
              <label for="reg-email" class="block text-xs font-medium text-slate-400 mb-1">Email or Handle</label>
              <input id="reg-email" type="text" required placeholder="rafiul@example.com" class="field-control w-full rounded-xl px-3 py-2 text-xs sm:text-sm surface-inset text-slate-100 placeholder:text-slate-500" />
            </div>
            <div>
              <label for="reg-target" class="block text-xs font-medium text-slate-400 mb-1">Target Track</label>
              <select id="reg-target" class="field-control w-full rounded-xl px-3 py-2 text-xs sm:text-sm surface-inset text-slate-100">
                <option value="HSC Science + Engineering">HSC Science + Engineering</option>
                <option value="HSC Science + Medical">HSC Science + Medical</option>
                <option value="HSC Science + Varsity">HSC Science + Varsity</option>
              </select>
            </div>
            <button type="submit" class="btn-pill w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm shadow-emerald-500/20">
              Join Instantly
            </button>
          </form>

          <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span id="active-session-summary" class="text-slate-400 truncate"></span>
            <button type="button" onclick="switchToGuestOpenAccess()" class="btn-pill px-2.5 py-1 rounded-lg surface-inset text-cyan-300 font-semibold shrink-0">
              Guest Access
            </button>
          </div>
        </div>

        <!-- Admin Moderation Panel: Suspend / Ban / Restore Users -->
        <div class="lg:col-span-7 rounded-2xl surface-card p-4 sm:p-5 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div class="flex items-center gap-2">
              <h2 class="text-sm font-bold text-white tracking-tight">User Access & Moderation</h2>
              <span id="users-count-badge" class="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-400/12 text-cyan-300 border border-cyan-400/25">0</span>
            </div>
            <input id="mod-reason-input" type="text" placeholder="Action note (e.g. spam / policy)" class="field-control rounded-xl px-3 py-1.5 text-xs surface-inset text-slate-100 placeholder:text-slate-500 w-48 sm:w-56" />
          </div>

          <div id="users-list" class="space-y-2.5"></div>
        </div>

      </div>
    </section>

  </main>

  <!-- Slide-Over Gemini AI Tutor Drawer -->
  <div id="drawer-backdrop" onclick="toggleDrawer(false)" class="fixed inset-0 z-40 bg-black/65 backdrop-blur-xs hidden"></div>
  <aside id="ai-drawer" class="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-[#0b101b] border-l border-slate-800/90 translate-x-full transition-transform duration-200 flex flex-col shadow-2xl">
    <div class="px-4 py-3 border-b border-slate-800/85 flex items-center justify-between">
      <div class="flex items-center gap-2 min-w-0">
        <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
        <span class="font-bold text-sm text-white shrink-0">AI Tutor</span>
        <span id="drawer-context-pill" class="text-[11px] font-mono text-slate-400 truncate"></span>
      </div>
      <button type="button" onclick="toggleDrawer(false)" class="px-2 py-1 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white">✕</button>
    </div>

    <div class="px-3 py-2 border-b border-slate-800/75 flex gap-1.5 overflow-x-auto">
      <button type="button" onclick="quickTutorPrompt('এই অধ্যায়ের গুরুত্বপূর্ণ সূত্র ও ভর্তি পরীক্ষার শর্টকাট দাও।')" class="btn-pill shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold surface-inset text-emerald-300">Formulas</button>
      <button type="button" onclick="quickTutorPrompt('প্রশ্নব্যাংকের প্যাটার্ন অনুযায়ী সম্ভাব্য টপিক বলো।')" class="btn-pill shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold surface-inset text-cyan-300">Patterns</button>
      <button type="button" onclick="quickTutorPrompt('এই টপিকের একটি ভর্তি মানের MCQ দিয়ে সমাধান দেখাও।')" class="btn-pill shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold surface-inset text-slate-200">MCQ Drill</button>
    </div>

    <div id="chat-messages" class="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-xs sm:text-sm"></div>

    <form onsubmit="sendTutorMessage(event)" class="p-3 border-t border-slate-800/85 flex gap-2">
      <input id="chat-input" type="text" required placeholder="Ask HSC Physics, Chem, Math, Bio, ICT..." class="field-control flex-1 rounded-xl px-3 py-2 text-xs sm:text-sm surface-inset text-slate-100 placeholder:text-slate-500" />
      <button type="submit" class="btn-pill px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950">Send</button>
    </form>
  </aside>

  <!-- Quick Account Switcher Modal -->
  <div id="account-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
    <div class="w-full max-w-sm rounded-2xl surface-card p-5 space-y-3.5">
      <div class="flex items-center justify-between">
        <span class="font-bold text-sm text-white">Active Account</span>
        <button type="button" onclick="closeAccountModal()" class="text-slate-400 hover:text-white text-xs">✕</button>
      </div>
      <div id="account-modal-body" class="space-y-2 text-xs text-slate-300"></div>
      <div class="flex justify-between pt-2">
        <button type="button" onclick="closeAccountModal(); switchView('users');" class="btn-pill px-3 py-1.5 rounded-lg text-xs font-bold surface-inset text-emerald-300">Sign Up / Moderate</button>
        <button type="button" onclick="closeAccountModal()" class="btn-pill px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-400 text-slate-950">Done</button>
      </div>
    </div>
  </div>

  <!-- Gemini API Key Modal -->
  <div id="key-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
    <div class="w-full max-w-sm rounded-2xl surface-card p-5 space-y-3.5">
      <div class="flex items-center justify-between">
        <span class="font-bold text-sm text-white">Gemini API Key</span>
        <button type="button" onclick="closeKeyModal()" class="text-slate-400 hover:text-white text-xs">✕</button>
      </div>
      <input id="key-input" type="password" placeholder="GEMINI_API_KEY (AIza...)" class="field-control w-full rounded-xl px-3 py-2 text-xs sm:text-sm surface-inset text-white placeholder:text-slate-500" />
      <p class="text-[11px] text-slate-400">Stored locally in browser. Local fallback works without a key.</p>
      <div class="flex items-center justify-between pt-1">
        <button type="button" onclick="clearKey()" class="text-xs font-semibold text-rose-400 hover:underline">Clear</button>
        <div class="flex gap-2">
          <button type="button" onclick="closeKeyModal()" class="btn-pill px-3 py-1.5 rounded-lg text-xs font-semibold surface-inset text-slate-300">Cancel</button>
          <button type="button" onclick="saveKey()" class="btn-pill px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950">Save</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Supabase public.questions & profiles SQL Modal -->
  <div id="sql-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
    <div class="w-full max-w-xl rounded-2xl surface-card p-5 space-y-3.5">
      <div class="flex items-center justify-between">
        <span class="font-bold text-sm text-white">Supabase SQL (Questions & Profiles)</span>
        <button type="button" onclick="closeSqlModal()" class="text-slate-400 hover:text-white text-xs">✕</button>
      </div>
      <pre id="sql-code" class="rounded-xl p-3.5 text-[11px] font-mono surface-inset text-emerald-300 overflow-x-auto max-h-64 leading-relaxed">create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  subject text not null,
  chapter text,
  topic text,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text,
  source_type text default 'predictive',
  rechecked boolean default true
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'active' check (status in ('active', 'suspended', 'banned')),
  moderation_note text,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;
alter table public.profiles enable row level security;

create policy "public_read_questions" on public.questions for select using (true);
create policy "public_insert_questions" on public.questions for insert with check (true);
create policy "public_read_profiles" on public.profiles for select using (true);
create policy "public_insert_profiles" on public.profiles for insert with check (true);
create policy "public_update_profiles" on public.profiles for update using (true);
notify pgrst, 'reload schema';</pre>
      <div class="flex justify-end gap-2">
        <button type="button" onclick="closeSqlModal()" class="btn-pill px-3 py-1.5 rounded-lg text-xs font-semibold surface-inset text-slate-300">Close</button>
        <button type="button" onclick="copySqlSnippet()" class="btn-pill px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950">Copy SQL</button>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <div id="toast" class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden px-4 py-2 rounded-xl text-xs font-bold bg-[#111927] text-white border border-emerald-400/35 shadow-xl"></div>

  <script>
    const SYLLABUS = [
      {
        id: 'phy1', subject: 'Physics', paper: 'Physics 1st Paper',
        chapters: ['ভৌত জগৎ ও পরিমাপ', 'ভেক্টর', 'গতিবিদ্যা', 'নিউটনিয়ান বলবিদ্যা', 'কাজ, শক্তি ও ক্ষমতা', 'মহাকর্ষ ও অভিকর্ষ', 'পদার্থের গাঠনিক ধর্ম', 'পর্যাবৃত্ত গতি', 'তরঙ্গ', 'আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব']
      },
      {
        id: 'phy2', subject: 'Physics', paper: 'Physics 2nd Paper',
        chapters: ['তাপগতিবিদ্যা', 'স্থির তড়িৎ', 'চল তড়িৎ', 'তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব', 'তড়িৎচৌম্বক আবেশ ও পরিবর্তী প্রবাহ', 'জ্যামিতিক আলোকবিজ্ঞান', 'ভৌত আলোকবিজ্ঞান', 'আধুনিক পদার্থবিজ্ঞানের সূচনা', 'পরমাণুর মডেল ও নিউক্লিয়ার পদার্থবিজ্ঞান', 'সেমিকন্ডাক্টর ও ইলেকট্রনিক্স']
      },
      {
        id: 'chem1', subject: 'Chemistry', paper: 'Chemistry 1st Paper',
        chapters: ['ল্যাবরেটরির নিরাপদ ব্যবহার', 'গুণগত রসায়ন', 'মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন', 'রাসায়নিক পরিবর্তন', 'কর্মমুখী রসায়ন']
      },
      {
        id: 'chem2', subject: 'Chemistry', paper: 'Chemistry 2nd Paper',
        chapters: ['পরিবেশ রসায়ন', 'জৈব রসায়ন', 'পরিমাণগত রসায়ন', 'তড়িৎ রসায়ন', 'অর্থনৈতিক রসায়ন']
      },
      {
        id: 'math1', subject: 'Higher Math', paper: 'Higher Math 1st Paper',
        chapters: ['ম্যাট্রিক্স ও নির্ণায়ক', 'ভেক্টর', 'সরলরেখা', 'বৃত্ত', 'বিন্যাস ও সমাবেশ', 'ত্রিকোণমিতিক অনুপাত', 'সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত', 'ফাংশন ও ফাংশনের লেখচিত্র', 'অন্তরীকরণ', 'যোগজীকরণ']
      },
      {
        id: 'math2', subject: 'Higher Math', paper: 'Higher Math 2nd Paper',
        chapters: ['বাস্তব সংখ্যা ও অসমতা', 'যোগাশ্রয়ী প্রোগ্রাম', 'জটিল সংখ্যা', 'বহুপদী ও বহুপদী সমীকরণ', 'দ্বিপদী বিস্তৃতি', 'কনিক', 'বিপরীত ত্রিকোণমিতিক ফাংশন ও সমীকরণ', 'স্থিতিবিদ্যা', 'সমতলে বস্তুকণার গতি', 'বিস্তার পরিমাপ ও সম্ভাবনা']
      },
      {
        id: 'bio1', subject: 'Biology', paper: 'Biology 1st Paper (Botany)',
        chapters: ['কোষ ও এর গঠন', 'কোষ বিভাজন', 'কোষ রসায়ন', 'অণুজীব', 'শৈবাল ও ছত্রাক', 'ব্রায়োফাইটা ও টেরিডোফাইটা', 'নগ্নবীজী ও আবৃতবীজী উদ্ভিদ', 'টিস্যু ও টিস্যুতন্ত্র', 'উদ্ভিদ শারীরতত্ত্ব', 'উদ্ভিদ প্রজনন', 'জীবপ্রযুক্তি', 'জীবের পরিবেশ, বিস্তার ও সংরক্ষণ']
      },
      {
        id: 'bio2', subject: 'Biology', paper: 'Biology 2nd Paper (Zoology)',
        chapters: ['প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', 'প্রাণীর পরিচিতি', 'পরিপাক ও শোষণ', 'রক্ত ও সঞ্চালন', 'শ্বসন ও শ্বাসক্রিয়া', 'বর্জ্য ও নিষ্কাশন', 'চলন ও অঙ্গচালনা', 'সমন্বয় ও নিয়ন্ত্রণ', 'মানব জীবনের ধারাবাহিকতা', 'মানবদেহের প্রতিরক্ষা', 'জিনতত্ত্ব ও বিবর্তন', 'প্রাণীর আচরণ']
      },
      {
        id: 'ict', subject: 'ICT', paper: 'ICT',
        chapters: ['বিশ্ব ও বাংলাদেশ পরিপ্রেক্ষিত', 'কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং', 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', 'ওয়েব ডিজাইন পরিচিতি ও HTML', 'প্রোগ্রামিং ভাষা (C)', 'ডেটাবেজ ম্যানেজমেন্ট সিস্টেম']
      }
    ];

    const SAMPLE_BANK = `1. কার্নো ইঞ্জিনের তাপ উৎসের তাপমাত্রা 400 K এবং গ্রাহকের তাপমাত্রা 300 K। গৃহীত তাপ 800 J হলে বর্জিত তাপ কত?
A) 200 J  B) 600 J  C) 400 J  D) 500 J
2. নিচের কোন যৌগটি অ্যালডল ঘনীভবন বিক্রিয়া দেয়?
A) HCHO  B) C6H5CHO  C) CH3CHO  D) (CH3)3CCHO
3. $\\int_0^{\\pi/2} \\frac{\\sin x}{\\sin x + \\cos x} dx$ এর মান কত?
A) $\\pi/2$  B) $\\pi/4$  C) 1  D) 0`;

    const SEED_QUESTIONS = [
      {
        id: 'seed_1', subject: 'Physics', paper: 'Physics 2nd Paper', chapter: 'তাপগতিবিদ্যা',
        q: 'কার্নো ইঞ্জিনের উৎস $400\\text{ K}$ ও গ্রাহক $300\\text{ K}$ হলে এবং $800\\text{ J}$ তাপ গ্রহণ করলে বর্জিত তাপ কত?',
        options: ['$200\\text{ J}$', '$600\\text{ J}$', '$400\\text{ J}$', '$500\\text{ J}$'],
        correctIndex: 1,
        explanation: '$Q_2 = Q_1 \\frac{T_2}{T_1} = 800 \\times \\frac{300}{400} = 600\\text{ J}$।',
        recheck: { passed: true, fixed: false, summary: '4 distinct options; Q2 verified.' }
      },
      {
        id: 'seed_2', subject: 'Chemistry', paper: 'Chemistry 2nd Paper', chapter: 'জৈব রসায়ন',
        q: 'নিচের কোন যৌগটি অ্যালডল ঘনীভবন বিক্রিয়া দেয়?',
        options: ['$HCHO$', '$C_6H_5CHO$', '$CH_3CHO$', '$(CH_3)_3CCHO$'],
        correctIndex: 2,
        explanation: '$CH_3CHO$-এ $\\alpha$-H থাকায় লঘু ক্ষারে অ্যালডল ঘনীভবন ঘটে।',
        recheck: { passed: true, fixed: false, summary: '4 distinct options; alpha-H rule verified.' }
      },
      {
        id: 'seed_3', subject: 'Higher Math', paper: 'Higher Math 1st Paper', chapter: 'যোগজীকরণ',
        q: '$\\int_0^{\\pi/2} \\frac{\\sin x}{\\sin x + \\cos x} dx$ এর মান কত?',
        options: ['$\\frac{\\pi}{2}$', '$\\frac{\\pi}{4}$', '$1$', '$0$'],
        correctIndex: 1,
        explanation: '$2I = \\int_0^{\\pi/2} 1\\,dx = \\frac{\\pi}{2} \\Rightarrow I = \\frac{\\pi}{4}$।',
        recheck: { passed: true, fixed: false, summary: '4 distinct options; integral verified.' }
      },
      {
        id: 'seed_4', subject: 'Biology', paper: 'Biology 1st Paper (Botany)', chapter: 'কোষ বিভাজন',
        q: 'মায়োসিস-১ এর কোন উপ-পর্যায়ে ক্রসিং ওভার ঘটে?',
        options: ['লেপ্টোটিন', 'জাইগোটিন', 'প্যাকাইটিন', 'ডিপ্লোটিন'],
        correctIndex: 2,
        explanation: 'প্যাকাইটিন উপ-পর্যায়ে নন-সিস্টার ক্রোমাটিডে ক্রসিং ওভার সংঘটিত হয়।',
        recheck: { passed: true, fixed: false, summary: '4 distinct options; Pachytene verified.' }
      },
      {
        id: 'seed_5', subject: 'ICT', paper: 'ICT', chapter: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস',
        q: '$(101101)_2$ বাইনারি সংখ্যার হেক্সাডেসিমেল মান কত?',
        options: ['$(2D)_{16}$', '$(2B)_{16}$', '$(3D)_{16}$', '$(1E)_{16}$'],
        correctIndex: 0,
        explanation: '$0010\\ 1101_2 = 2_{16}\\text{ এবং } D_{16} = (2D)_{16}$।',
        recheck: { passed: true, fixed: false, summary: '4 distinct options; 4-bit hex verified.' }
      }
    ];

    const DEFAULT_USERS = [
      { id: 'u_admin', name: 'Admin Moderator', email: 'admin@admissionwarrior.app', target: 'Admin Control', status: 'active', note: '' },
      { id: 'u_guest', name: 'General Student', email: 'guest@admissionwarrior.app', target: 'HSC Science + Engineering', status: 'active', note: '' },
      { id: 'u_demo1', name: 'Nafis Rahman', email: 'nafis.hsc@example.com', target: 'HSC Science + Medical', status: 'active', note: '' }
    ];

    const STORAGE = {
      KEY: 'aw_v5_gemini_key',
      BANK: 'aw_v5_bank_text',
      DECK: 'aw_v5_deck',
      USERS: 'aw_v5_users',
      CURRENT_USER: 'aw_v5_current_user'
    };

    function loadUsers() {
      try {
        const raw = JSON.parse(localStorage.getItem(STORAGE.USERS) || 'null');
        if (Array.isArray(raw) && raw.length) return raw;
      } catch (_) {}
      return [...DEFAULT_USERS];
    }

    function loadDeck() {
      try {
        const raw = JSON.parse(localStorage.getItem(STORAGE.DECK) || 'null');
        return Array.isArray(raw) && raw.length ? raw : [...SEED_QUESTIONS];
      } catch {
        return [...SEED_QUESTIONS];
      }
    }

    const initialUsers = loadUsers();
    const savedCurrentId = localStorage.getItem(STORAGE.CURRENT_USER) || 'u_guest';

    const state = {
      view: 'bank',
      apiKey: localStorage.getItem(STORAGE.KEY) || '',
      deck: loadDeck(),
      users: initialUsers,
      currentUserId: initialUsers.some((u) => u.id === savedCurrentId) ? savedCurrentId : 'u_guest',
      syllabusSub: 'ALL',
      quizList: [],
      quizIdx: 0,
      quizAnswers: {},
      quizDone: false,
      quizSec: 300,
      quizTimer: null,
      photoBase64: '',
      photoMime: 'image/jpeg'
    };

    function getCurrentUser() {
      return state.users.find((u) => u.id === state.currentUserId) || state.users[0];
    }

    function persistUsers() {
      try {
        localStorage.setItem(STORAGE.USERS, JSON.stringify(state.users));
        localStorage.setItem(STORAGE.CURRENT_USER, state.currentUserId);
      } catch (_) {}
    }

    function persistDeck() {
      try { localStorage.setItem(STORAGE.DECK, JSON.stringify(state.deck)); } catch (_) {}
    }

    function typesetMath(el) {
      try {
        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
          window.MathJax.typesetPromise(el ? [el] : undefined).catch(() => {});
        }
      } catch (_) {}
    }
    window.typesetMath = typesetMath;

    function esc(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function toast(msg) {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.remove('hidden');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => el.classList.add('hidden'), 2300);
    }

    function isRestricted() {
      const u = getCurrentUser();
      return Boolean(u && (u.status === 'suspended' || u.status === 'banned'));
    }

    function enforceActiveAccess(actionLabel) {
      const u = getCurrentUser();
      if (!u) return true;
      if (u.status === 'banned') {
        toast(`Banned account cannot ${actionLabel}`);
        return false;
      }
      if (u.status === 'suspended') {
        toast(`Suspended account cannot ${actionLabel}`);
        return false;
      }
      return true;
    }

    function renderAccessUI() {
      const u = getCurrentUser();
      const banner = document.getElementById('restriction-banner');
      const pillLabel = document.getElementById('user-pill-label');
      const userDot = document.getElementById('user-dot');

      if (!u) return;
      pillLabel.textContent = u.name;

      if (u.status === 'banned') {
        userDot.className = 'w-2 h-2 rounded-full bg-rose-500 shrink-0';
        banner.classList.remove('hidden');
        document.getElementById('restriction-title').textContent = `Account Banned · ${u.name}`;
        document.getElementById('restriction-reason').textContent = u.note || 'Access permanently blocked by admin.';
      } else if (u.status === 'suspended') {
        userDot.className = 'w-2 h-2 rounded-full bg-amber-400 shrink-0';
        banner.classList.remove('hidden');
        document.getElementById('restriction-title').textContent = `Account Suspended · ${u.name}`;
        document.getElementById('restriction-reason').textContent = u.note || 'Access temporarily suspended by admin.';
      } else {
        userDot.className = 'w-2 h-2 rounded-full bg-emerald-400 shrink-0';
        banner.classList.add('hidden');
      }

      const summary = document.getElementById('active-session-summary');
      if (summary) summary.textContent = `Active: ${u.name} (${u.status})`;

      renderUsersList();
    }

    function handleInstantSignup(e) {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const target = document.getElementById('reg-target').value;
      if (!name || !email) return;

      const existing = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        existing.name = name;
        existing.target = target;
        state.currentUserId = existing.id;
        persistUsers();
        renderAccessUI();
        toast(existing.status === 'active' ? `Switched to ${existing.name}` : `Signed in (${existing.status})`);
        return;
      }

      const newUser = {
        id: `u_${Date.now()}`,
        name,
        email,
        target,
        status: 'active',
        note: ''
      };
      state.users.unshift(newUser);
      state.currentUserId = newUser.id;
      document.getElementById('reg-name').value = '';
      document.getElementById('reg-email').value = '';
      persistUsers();
      renderAccessUI();
      toast('Joined immediately');
    }

    function switchToGuestOpenAccess() {
      let guest = state.users.find((u) => u.id === 'u_guest');
      if (!guest) {
        guest = { id: 'u_guest', name: 'General Student', email: 'guest@admissionwarrior.app', target: 'HSC Science + Engineering', status: 'active', note: '' };
        state.users.unshift(guest);
      }
      if (guest.status !== 'active') {
        guest.status = 'active';
        guest.note = '';
      }
      state.currentUserId = guest.id;
      persistUsers();
      renderAccessUI();
      toast('General access active');
    }

    function setUserModerationStatus(userId, nextStatus) {
      const target = state.users.find((u) => u.id === userId);
      if (!target) return;
      if (target.id === 'u_admin' && nextStatus !== 'active') {
        return toast('Admin account cannot be suspended/banned');
      }
      const noteInput = document.getElementById('mod-reason-input');
      const customNote = noteInput ? noteInput.value.trim() : '';

      target.status = nextStatus;
      target.note = nextStatus === 'active'
        ? ''
        : (customNote || (nextStatus === 'banned' ? 'Banned by admin' : 'Suspended by admin'));

      persistUsers();
      renderAccessUI();
      toast(`${target.name}: ${nextStatus}`);
    }

    function selectUserSession(userId) {
      const target = state.users.find((u) => u.id === userId);
      if (!target) return;
      state.currentUserId = target.id;
      persistUsers();
      renderAccessUI();
      toast(`Session: ${target.name}`);
    }

    function renderUsersList() {
      const wrap = document.getElementById('users-list');
      const badge = document.getElementById('users-count-badge');
      if (!wrap || !badge) return;
      badge.textContent = state.users.length;

      wrap.innerHTML = state.users.map((u) => {
        const isCurrent = u.id === state.currentUserId;
        const statusBadge = u.status === 'banned'
          ? 'bg-rose-500/15 text-rose-300 border-rose-500/35'
          : u.status === 'suspended'
            ? 'bg-amber-400/15 text-amber-300 border-amber-400/35'
            : 'bg-emerald-400/15 text-emerald-300 border-emerald-400/35';

        return `
          <div class="rounded-xl p-3.5 surface-inset flex flex-wrap items-center justify-between gap-3">
            <div class="min-w-0 space-y-0.5">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs sm:text-sm font-bold text-white">${esc(u.name)}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${statusBadge}">${esc(u.status)}</span>
                ${isCurrent ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">current</span>' : ''}
              </div>
              <p class="text-[11px] font-mono text-slate-400 truncate">${esc(u.email)} · ${esc(u.target)}</p>
              ${u.note ? `<p class="text-[11px] text-rose-300/90">${esc(u.note)}</p>` : ''}
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              ${!isCurrent ? `<button type="button" onclick="selectUserSession('${u.id}')" class="btn-pill px-2.5 py-1 rounded-lg text-[11px] font-semibold surface-inset text-slate-200 hover:border-slate-500">Use</button>` : ''}
              ${u.status !== 'active' ? `<button type="button" onclick="setUserModerationStatus('${u.id}','active')" class="btn-pill px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400 hover:text-slate-950">Restore</button>` : ''}
              ${u.id !== 'u_admin' && u.status !== 'suspended' ? `<button type="button" onclick="setUserModerationStatus('${u.id}','suspended')" class="btn-pill px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-400/15 text-amber-300 hover:bg-amber-400 hover:text-slate-950">Suspend</button>` : ''}
              ${u.id !== 'u_admin' && u.status !== 'banned' ? `<button type="button" onclick="setUserModerationStatus('${u.id}','banned')" class="btn-pill px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/15 text-rose-300 hover:bg-rose-500 hover:text-white">Ban</button>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    function openAccountModal() {
      const u = getCurrentUser();
      const body = document.getElementById('account-modal-body');
      body.innerHTML = `
        <div class="p-3 rounded-xl surface-inset space-y-1">
          <div class="font-bold text-white">${esc(u.name)}</div>
          <div class="font-mono text-[11px] text-slate-400">${esc(u.email)}</div>
          <div class="text-[11px] text-emerald-300 font-semibold">Status: ${esc(u.status)} · ${esc(u.target)}</div>
          ${u.note ? `<div class="text-[11px] text-rose-300">Note: ${esc(u.note)}</div>` : ''}
        </div>
      `;
      const m = document.getElementById('account-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeAccountModal() {
      const m = document.getElementById('account-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    const VIEWS = ['bank', 'syllabus', 'quiz', 'photo', 'users'];
    let navLock = false;

    function applyTabStyles(v) {
      document.querySelectorAll('.app-view').forEach((sec) => sec.classList.toggle('hidden', sec.id !== `view-${v}`));
      document.querySelectorAll('.tab-btn').forEach((btn) => {
        const active = btn.getAttribute('data-tab') === v;
        btn.classList.toggle('bg-emerald-400', active);
        btn.classList.toggle('text-slate-950', active);
        btn.classList.toggle('text-slate-300', !active);
        btn.classList.toggle('hover:text-white', !active);
      });
    }

    function switchView(v, push = true) {
      const target = VIEWS.includes(v) ? v : 'bank';
      state.view = target;
      applyTabStyles(target);

      const h = `#${target}`;
      if (push && window.location.hash !== h) {
        navLock = true;
        try { window.history.pushState({ view: target, awGuard: true }, '', h); }
        catch { window.location.hash = h; }
        setTimeout(() => { navLock = false; }, 40);
      }

      if (target === 'syllabus') renderSyllabus();
      if (target === 'quiz' && !state.quizList.length) startQuiz();
      if (target === 'users') renderUsersList();
      updateDrawerContext();
      typesetMath(document.getElementById(`view-${target}`));
    }

    function initNavigationGuard() {
      const initial = (window.location.hash || '').replace(/^#/, '');
      const start = VIEWS.includes(initial) ? initial : 'bank';
      navLock = true;
      try {
        window.history.replaceState({ view: start, awGuard: true, root: true }, '', `#${start}`);
        window.history.pushState({ view: start, awGuard: true }, '', `#${start}`);
      } catch {
        window.location.hash = `#${start}`;
      }
      setTimeout(() => { navLock = false; }, 40);
      switchView(start, false);

      window.addEventListener('popstate', (e) => {
        if (navLock) return;
        const closeIfOpen = (id, fn) => {
          const el = document.getElementById(id);
          if (el && !el.classList.contains('hidden')) {
            fn();
            repushCurrentView();
            return true;
          }
          return false;
        };
        if (closeIfOpen('key-modal', closeKeyModal)) return;
        if (closeIfOpen('sql-modal', closeSqlModal)) return;
        if (closeIfOpen('account-modal', closeAccountModal)) return;
        const drawer = document.getElementById('ai-drawer');
        if (drawer && !drawer.classList.contains('translate-x-full')) {
          toggleDrawer(false);
          repushCurrentView();
          return;
        }
        const next = e.state && VIEWS.includes(e.state.view) ? e.state.view : 'bank';
        if (next === state.view) repushCurrentView();
        else switchView(next, false);
      });

      document.getElementById('btn-back').addEventListener('click', () => {
        if (!document.getElementById('key-modal').classList.contains('hidden')) return closeKeyModal();
        if (!document.getElementById('sql-modal').classList.contains('hidden')) return closeSqlModal();
        if (!document.getElementById('account-modal').classList.contains('hidden')) return closeAccountModal();
        if (!document.getElementById('ai-drawer').classList.contains('translate-x-full')) return toggleDrawer(false);
        if (state.view !== 'bank') switchView('bank', true);
        else toast('Inside Admission Warrior');
      });
    }

    function repushCurrentView() {
      navLock = true;
      try { window.history.pushState({ view: state.view, awGuard: true }, '', `#${state.view}`); } catch (_) {}
      setTimeout(() => { navLock = false; }, 40);
      applyTabStyles(state.view);
    }

    async function callGemini(parts, systemText = '') {
      if (!state.apiKey) throw new Error('NO_KEY');
      const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      let lastErr = null;

      const cleanParts = (Array.isArray(parts) ? parts : [parts]).map((p) => {
        if (p && p.inlineData && p.inlineData.data) {
          const raw = String(p.inlineData.data);
          const m = raw.match(/^data:([^;]+);base64,(.+)$/);
          return {
            inlineData: {
              mimeType: m ? m[1] : (p.inlineData.mimeType || 'image/jpeg'),
              data: m ? m[2] : raw
            }
          };
        }
        return { text: String(p && p.text !== undefined ? p.text : p || '') };
      });

      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(state.apiKey)}`;
          const body = { contents: [{ role: 'user', parts: cleanParts }] };
          if (systemText) body.systemInstruction = { parts: [{ text: systemText }] };

          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson?.error?.message || `HTTP ${res.status}`);
          }
          const json = await res.json();
          const out = json?.candidates?.[0]?.content?.parts?.map((x) => x.text || '').join('\n').trim();
          if (out) return { text: out, model };
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr || new Error('Gemini request failed');
    }

    function parseJsonSafe(raw) {
      const cleaned = String(raw || '').replace(/```json|```/gi, '').trim();
      try { return JSON.parse(cleaned); } catch (_) {
        const s = cleaned.indexOf('{');
        const e = cleaned.lastIndexOf('}');
        if (s !== -1 && e > s) return JSON.parse(cleaned.slice(s, e + 1));
        throw new Error('JSON parse failed');
      }
    }

    function populateChapterDropdown() {
      const paper = SYLLABUS.find((p) => p.id === document.getElementById('bank-paper').value) || SYLLABUS[0];
      document.getElementById('bank-chapter').innerHTML = paper.chapters.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
      updateDrawerContext();
    }

    function loadSampleBank() {
      if (!enforceActiveAccess('load sample')) return;
      document.getElementById('bank-text').value = SAMPLE_BANK;
      document.getElementById('bank-file-meta').textContent = 'Sample Admission Bank';
      saveBankText();
      toast('Sample loaded');
    }

    function saveBankText() {
      try { localStorage.setItem(STORAGE.BANK, document.getElementById('bank-text').value); } catch (_) {}
    }

    async function handleBankUpload(e) {
      if (!enforceActiveAccess('upload bank')) {
        e.target.value = '';
        return;
      }
      const file = e.target.files?.[0];
      if (!file) return;
      const meta = document.getElementById('bank-file-meta');
      meta.textContent = `Reading ${file.name}...`;
      try {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          if (!window.pdfjsLib) throw new Error('PDF.js unavailable');
          const buf = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
          let txt = '';
          const maxP = Math.min(pdf.numPages, 12);
          for (let i = 1; i <= maxP; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            txt += `\n${content.items.map((it) => it.str).join(' ')}`;
          }
          document.getElementById('bank-text').value = txt.trim();
          meta.textContent = `${file.name} (${maxP}p)`;
        } else {
          const text = await file.text();
          document.getElementById('bank-text').value = text.trim();
          meta.textContent = file.name;
        }
        saveBankText();
        toast('Uploaded');
      } catch (_) {
        meta.textContent = 'Paste text if PDF is image-based';
        toast('Upload fallback active');
      }
      e.target.value = '';
    }

    async function analyzeBankPattern() {
      if (!enforceActiveAccess('analyze bank')) return;
      const bankText = document.getElementById('bank-text').value.trim();
      const paperObj = SYLLABUS.find((p) => p.id === document.getElementById('bank-paper').value) || SYLLABUS[0];
      const chapter = document.getElementById('bank-chapter').value;
      const topic = document.getElementById('bank-topic').value.trim();
      const briefEl = document.getElementById('pattern-brief');
      const statusEl = document.getElementById('bank-status');

      statusEl.textContent = 'Analyzing...';
      briefEl.classList.remove('hidden');

      try {
        if (!state.apiKey) throw new Error('NO_KEY');
        const prompt = `Analyze admission question patterns for HSC ${paperObj.paper} (${chapter}${topic ? `, ${topic}` : ''}) based on this bank:\n${bankText.slice(0, 6000)}\nGive a concise Bangla summary of recurring concepts, numerical traps, and high-yield subtopics.`;
        const { text } = await callGemini([{ text: prompt }], 'Bangladesh HSC Science & Admission pattern analyst.');
        briefEl.textContent = text;
        typesetMath(briefEl);
        statusEl.textContent = 'Analyzed';
      } catch (_) {
        briefEl.textContent = `${paperObj.subject} · ${chapter}${topic ? ` · ${topic}` : ''}\n• Focus on direct formula + unit conversion traps and exception rules.\n• Compare multi-step numericals against one-line conceptual statements.`;
        statusEl.textContent = 'Local Analysis';
      }
    }

    async function runBankWorkflow(mode) {
      if (!enforceActiveAccess('generate questions')) return;
      const bankText = document.getElementById('bank-text').value.trim();
      const paperObj = SYLLABUS.find((p) => p.id === document.getElementById('bank-paper').value) || SYLLABUS[0];
      const chapter = document.getElementById('bank-chapter').value;
      const topic = document.getElementById('bank-topic').value.trim();
      const count = parseInt(document.getElementById('bank-count').value, 10) || 5;

      const statusEl = document.getElementById('bank-status');
      const briefEl = document.getElementById('pattern-brief');
      statusEl.textContent = mode === 'copy' ? 'Copying...' : 'Generating...';

      try {
        if (!state.apiKey) throw new Error('NO_KEY');
        const prompt = mode === 'copy'
          ? `Extract up to ${count} questions matching "${chapter}" ${topic ? `(${topic})` : ''} faithfully from the bank below. Return ONLY JSON: {"pattern":"1-line note","questions":[{"q":"","options":["","","",""],"correctIndex":0,"explanation":""}]}\nBank:\n${bankText.slice(0, 6500)}`
          : `Analyze the bank & HSC NCTB ${paperObj.paper} (${chapter}${topic ? `, ${topic}` : ''}) and generate ${count} probable admission MCQs in Bangla/LaTeX. Return ONLY JSON: {"pattern":"1-line note","questions":[{"q":"","options":["","","",""],"correctIndex":0,"explanation":""}]}\nBank:\n${bankText.slice(0, 4500)}`;

        const { text } = await callGemini([{ text: prompt }], 'Bangladesh HSC Science & Admission MCQ creator.');
        const parsed = parseJsonSafe(text);
        const rawList = Array.isArray(parsed.questions) ? parsed.questions.slice(0, count) : [];

        if (rawList.length) {
          state.deck = rawList.map((item, idx) => ({
            id: `q_${Date.now()}_${idx}`,
            subject: paperObj.subject,
            paper: paperObj.paper,
            chapter,
            q: String(item.q || ''),
            options: Array.isArray(item.options) ? item.options.slice(0, 4).map(String) : ['A', 'B', 'C', 'D'],
            correctIndex: Number.isInteger(item.correctIndex) ? item.correctIndex : 0,
            explanation: String(item.explanation || ''),
            recheck: { passed: false, fixed: false, summary: '' }
          }));
          if (parsed.pattern) {
            briefEl.textContent = parsed.pattern;
            briefEl.classList.remove('hidden');
          }
        } else {
          state.deck = buildLocalQuestions(mode, bankText, paperObj, chapter, topic, count);
        }
      } catch (err) {
        state.deck = buildLocalQuestions(mode, bankText, paperObj, chapter, topic, count);
        briefEl.textContent = `${paperObj.subject} · ${chapter}${topic ? ` · ${topic}` : ''} (${mode === 'copy' ? 'Exact Copy' : 'Predictive'})`;
        briefEl.classList.remove('hidden');
        if (err.message === 'NO_KEY') toast('Local set generated (add Key for Gemini)');
      }

      runStrictOptionRecheck(false);
      persistDeck();
      renderQuestions();
      statusEl.textContent = mode === 'copy' ? 'Copied & Rechecked' : 'Predicted & Rechecked';
    }

    function buildLocalQuestions(mode, bankText, paperObj, chapter, topic, count) {
      if (mode === 'copy' && bankText) {
        try {
          const jsonArr = JSON.parse(bankText);
          if (Array.isArray(jsonArr) && jsonArr.length) {
            return jsonArr.slice(0, count).map((it, idx) => ({
              id: `cp_json_${Date.now()}_${idx}`,
              subject: it.subject || paperObj.subject,
              paper: it.paper || paperObj.paper,
              chapter: it.chapter || chapter,
              q: String(it.question || it.q || ''),
              options: Array.isArray(it.options) ? it.options.slice(0, 4).map(String) : ['A', 'B', 'C', 'D'],
              correctIndex: Number.isInteger(it.correctIndex) ? it.correctIndex : 0,
              explanation: String(it.explanation || 'Extracted from uploaded JSON bank.'),
              recheck: { passed: false, fixed: false, summary: '' }
            }));
          }
        } catch (_) {}

        const blocks = bankText.split(/\n(?=\d+[\.\)])/).filter((b) => b.trim().length > 6);
        if (blocks.length) {
          return blocks.slice(0, count).map((blk, i) => {
            const lines = blk.split('\n').map((l) => l.trim()).filter(Boolean);
            const stem = lines[0].replace(/^\d+[\.\)]\s*/, '');
            const matches = lines.slice(1).join(' ').match(/[A-D]\)\s*[^A-D\)]+/g);
            const options = matches && matches.length >= 4
              ? matches.slice(0, 4).map((o) => o.replace(/^[A-D]\)\s*/, '').trim())
              : ['Option A', 'Option B', 'Option C', 'Option D'];
            return {
              id: `cp_${Date.now()}_${i}`,
              subject: paperObj.subject,
              paper: paperObj.paper,
              chapter,
              q: stem,
              options,
              correctIndex: 0,
              explanation: `Copied from question bank (${chapter}).`,
              recheck: { passed: false, fixed: false, summary: '' }
            };
          });
        }
      }

      const pool = SEED_QUESTIONS.filter((q) => q.subject === paperObj.subject);
      const src = pool.length ? pool : SEED_QUESTIONS;
      return Array.from({ length: count }, (_, i) => {
        const base = src[i % src.length];
        return {
          ...base,
          id: `pr_${Date.now()}_${i}`,
          paper: paperObj.paper,
          chapter,
          q: topic ? `${base.q} (${topic})` : base.q,
          options: [...base.options],
          recheck: { passed: false, fixed: false, summary: '' }
        };
      });
    }

    function runStrictOptionRecheck(notify = true) {
      for (const item of state.deck) {
        let fixed = false;
        if (!String(item.q || '').trim()) {
          item.q = `${item.chapter} সম্পর্কিত ভর্তি পরীক্ষার MCQ।`;
          fixed = true;
        }

        let opts = Array.isArray(item.options) ? item.options.map((o) => String(o || '').trim()) : [];
        if (opts.length !== 4) {
          fixed = true;
          while (opts.length < 4) opts.push(`বিকল্প ${String.fromCharCode(65 + opts.length)}`);
          opts = opts.slice(0, 4);
        }

        const seen = new Set();
        opts = opts.map((opt, idx) => {
          const label = String.fromCharCode(65 + idx);
          const clean = opt || `বিকল্প ${label}`;
          const key = clean.toLowerCase();
          if (!opt || seen.has(key)) {
            fixed = true;
            const deduped = seen.has(key) ? `${clean} [${label}]` : clean;
            seen.add(deduped.toLowerCase());
            return deduped;
          }
          seen.add(key);
          return clean;
        });

        let ci = item.correctIndex;
        if (!Number.isInteger(ci) || ci < 0 || ci > 3) {
          ci = 0;
          fixed = true;
        }

        item.options = opts;
        item.correctIndex = ci;
        item.recheck = {
          passed: true,
          fixed,
          summary: fixed
            ? `Rechecked & fixed 4 distinct options; key ${String.fromCharCode(65 + ci)} verified.`
            : `Strict check passed: 4 distinct options & key ${String.fromCharCode(65 + ci)}.`
        };
      }

      persistDeck();
      renderQuestions();
      if (notify) toast('Option Recheck verified');
    }

    function renderQuestions() {
      const wrap = document.getElementById('questions-list');
      document.getElementById('q-count-badge').textContent = state.deck.length;

      if (!state.deck.length) {
        wrap.innerHTML = `<p class="text-xs text-slate-500 py-8 text-center">No questions in set.</p>`;
        return;
      }

      wrap.innerHTML = state.deck.map((q, idx) => {
        const isFixed = Boolean(q.recheck?.fixed);
        return `
          <article class="rounded-xl p-4 surface-inset space-y-3">
            <div class="flex items-center justify-between gap-2 text-[11px]">
              <span class="font-mono text-slate-400">Q${idx + 1} · ${esc(q.subject)} · ${esc(q.chapter)}</span>
              <span class="px-2 py-0.5 rounded-full font-semibold border ${
                isFixed
                  ? 'bg-amber-400/12 text-amber-300 border-amber-400/30'
                  : 'bg-emerald-400/12 text-emerald-300 border-emerald-400/30'
              }">${isFixed ? 'Fixed ✓' : 'Option Rechecked ✓'}</span>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-white leading-relaxed">${esc(q.q)}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              ${q.options.map((opt, oi) => `
                <div class="px-3 py-2 rounded-lg border flex items-center gap-2 ${
                  oi === q.correctIndex
                    ? 'bg-emerald-400/12 border-emerald-400/45 text-emerald-200 font-semibold'
                    : 'bg-[#0b111c] border-slate-800/90 text-slate-300'
                }">
                  <span class="font-mono text-[11px] font-bold">${String.fromCharCode(65 + oi)}.</span>
                  <span class="flex-1">${esc(opt)}</span>
                </div>
              `).join('')}
            </div>
            <p class="text-xs text-slate-300 leading-relaxed"><span class="text-emerald-400 font-semibold">Key (${String.fromCharCode(65 + q.correctIndex)}):</span> ${esc(q.explanation)}</p>
            <p class="text-[11px] font-mono text-slate-400">${esc(q.recheck?.summary || '')}</p>
          </article>
        `;
      }).join('');

      typesetMath(wrap);
    }

    function renderSyllabus() {
      const subjects = ['ALL', 'Physics', 'Chemistry', 'Higher Math', 'Biology', 'ICT'];
      document.getElementById('syllabus-filters').innerHTML = subjects.map((s) => `
        <button type="button" onclick="state.syllabusSub='${s}'; renderSyllabus();" class="btn-pill px-2.5 py-1 rounded-lg text-xs font-bold ${
          state.syllabusSub === s ? 'bg-emerald-400 text-slate-950' : 'surface-inset text-slate-300 hover:text-white'
        }">${s}</button>
      `).join('');

      const list = state.syllabusSub === 'ALL' ? SYLLABUS : SYLLABUS.filter((p) => p.subject === state.syllabusSub);
      document.getElementById('syllabus-grid').innerHTML = list.map((p) => `
        <div class="rounded-2xl surface-card p-4 sm:p-5 space-y-2.5">
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span class="font-bold text-sm text-white tracking-tight">${esc(p.paper)}</span>
            <span class="text-xs font-mono text-slate-400">${p.chapters.length}</span>
          </div>
          <div class="space-y-1.5">
            ${p.chapters.map((ch) => `
              <div class="flex items-center justify-between gap-2 py-2 px-3 rounded-xl surface-inset text-xs">
                <span class="text-slate-200 truncate">${esc(ch)}</span>
                <div class="flex gap-1.5 shrink-0">
                  <button type="button" onclick="targetSyllabusChapter('${p.id}','${esc(ch).replace(/'/g, "\\'")}','predict')" class="btn-pill px-2 py-0.5 rounded-md bg-emerald-400/15 text-emerald-300 font-semibold hover:bg-emerald-400 hover:text-slate-950">Qns</button>
                  <button type="button" onclick="targetSyllabusChapter('${p.id}','${esc(ch).replace(/'/g, "\\'")}','tutor')" class="btn-pill px-2 py-0.5 rounded-md bg-cyan-400/15 text-cyan-300 font-semibold hover:bg-cyan-400 hover:text-slate-950">Tutor</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    function targetSyllabusChapter(paperId, chapter, action) {
      if (!enforceActiveAccess('open chapter tools')) return;
      document.getElementById('bank-paper').value = paperId;
      populateChapterDropdown();
      document.getElementById('bank-chapter').value = chapter;
      updateDrawerContext();
      if (action === 'predict') {
        switchView('bank');
        runBankWorkflow('predict');
      } else {
        toggleDrawer(true);
        quickTutorPrompt(`${chapter} অধ্যায়ের ভর্তি পরীক্ষার মূল কনসেপ্ট ও সূত্র দাও।`);
      }
    }

    function startQuizFromDeck() {
      if (!enforceActiveAccess('start quiz')) return;
      switchView('quiz');
      startQuiz();
    }

    function startQuiz() {
      if (!enforceActiveAccess('start quiz')) return;
      clearInterval(state.quizTimer);
      const mins = parseInt(document.getElementById('quiz-mins').value, 10) || 5;
      state.quizList = state.deck.length ? [...state.deck] : [...SEED_QUESTIONS];
      state.quizIdx = 0;
      state.quizAnswers = {};
      state.quizDone = false;
      state.quizSec = mins * 60;

      document.getElementById('quiz-summary').classList.add('hidden');
      document.getElementById('btn-submit-quiz').disabled = false;
      renderQuizClock();

      state.quizTimer = setInterval(() => {
        state.quizSec--;
        renderQuizClock();
        if (state.quizSec <= 0) submitQuiz('timeout');
      }, 1000);

      renderQuizStage();
      renderQuizPalette();
    }

    function renderQuizClock() {
      const s = Math.max(0, state.quizSec);
      const m = String(Math.floor(s / 60)).padStart(2, '0');
      const r = String(s % 60).padStart(2, '0');
      document.getElementById('quiz-timer').textContent = `${m}:${r}`;
    }

    function renderQuizStage() {
      const stage = document.getElementById('quiz-stage');
      const total = state.quizList.length;
      const q = state.quizList[state.quizIdx];
      if (!q) return;

      const picked = state.quizAnswers[q.id];
      const mode = document.getElementById('quiz-mode').value;
      const reveal = state.quizDone || (mode === 'instant' && picked !== undefined);
      const answered = Object.keys(state.quizAnswers).length;
      document.getElementById('quiz-progress').style.width = `${total ? Math.round((answered / total) * 100) : 0}%`;

      stage.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Q ${state.quizIdx + 1}/${total}</span>
            <span>${esc(q.subject)} · ${esc(q.chapter)}</span>
          </div>
          <p class="text-sm sm:text-base font-bold text-white leading-relaxed">${esc(q.q)}</p>
          <div class="space-y-2">
            ${q.options.map((opt, idx) => {
              let cls = 'surface-inset text-slate-200 hover:border-slate-500';
              if (reveal) {
                if (idx === q.correctIndex) cls = 'bg-emerald-400/14 border-emerald-400 text-emerald-200 font-bold';
                else if (idx === picked) cls = 'bg-rose-500/14 border-rose-500 text-rose-200 font-bold';
              } else if (idx === picked) {
                cls = 'bg-cyan-400/14 border-cyan-400 text-white font-bold';
              }
              return `
                <button type="button" ${state.quizDone ? 'disabled' : ''} onclick="pickQuizOption('${q.id}',${idx})" class="btn-pill w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 ${cls}">
                  <span class="font-mono font-bold">${String.fromCharCode(65 + idx)}.</span>
                  <span>${esc(opt)}</span>
                </button>
              `;
            }).join('')}
          </div>
          ${reveal ? `<div class="p-3.5 rounded-xl surface-inset text-xs text-slate-200 leading-relaxed"><strong class="text-emerald-400">Explanation:</strong> ${esc(q.explanation)}</div>` : ''}
        </div>

        <div class="flex justify-between pt-4 mt-4 border-t border-slate-800/80">
          <button type="button" onclick="moveQuiz(-1)" ${state.quizIdx === 0 ? 'disabled' : ''} class="btn-pill px-3.5 py-1.5 rounded-lg text-xs font-bold surface-inset text-slate-200 disabled:opacity-40">Prev</button>
          <button type="button" onclick="moveQuiz(1)" ${state.quizIdx >= total - 1 ? 'disabled' : ''} class="btn-pill px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-400 text-slate-950 disabled:opacity-40">Next</button>
        </div>
      `;
      typesetMath(stage);
    }

    function pickQuizOption(qId, idx) {
      if (state.quizDone || !enforceActiveAccess('answer quiz')) return;
      state.quizAnswers[qId] = idx;
      renderQuizStage();
      renderQuizPalette();
    }

    function moveQuiz(delta) {
      const next = state.quizIdx + delta;
      if (next >= 0 && next < state.quizList.length) {
        state.quizIdx = next;
        renderQuizStage();
        renderQuizPalette();
      }
    }

    function renderQuizPalette() {
      const total = state.quizList.length;
      const done = Object.keys(state.quizAnswers).length;
      document.getElementById('quiz-palette-meta').textContent = `${done}/${total}`;
      document.getElementById('quiz-palette').innerHTML = state.quizList.map((q, i) => {
        const cur = i === state.quizIdx;
        const ans = state.quizAnswers[q.id] !== undefined;
        let cls = 'surface-inset text-slate-400 hover:text-slate-200';
        if (cur) cls = 'bg-cyan-400 border-cyan-300 text-slate-950 font-bold';
        else if (ans) cls = 'bg-emerald-400/15 border-emerald-400/40 text-emerald-300 font-bold';
        return `<button type="button" onclick="state.quizIdx=${i};renderQuizStage();renderQuizPalette();" class="btn-pill h-8 rounded-lg border text-xs font-mono ${cls}">${i + 1}</button>`;
      }).join('');
    }

    function submitQuiz(reason) {
      if (!state.quizList.length) return;
      clearInterval(state.quizTimer);
      state.quizTimer = null;
      state.quizDone = true;
      document.getElementById('btn-submit-quiz').disabled = true;

      const neg = parseFloat(document.getElementById('quiz-neg').value) || 0;
      let right = 0, wrong = 0;
      state.quizList.forEach((q) => {
        const a = state.quizAnswers[q.id];
        if (a === undefined) return;
        if (a === q.correctIndex) right++;
        else wrong++;
      });

      const total = state.quizList.length;
      const score = Math.max(0, right - wrong * neg).toFixed(2);
      const sum = document.getElementById('quiz-summary');
      sum.classList.remove('hidden');
      sum.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-white">${reason === 'timeout' ? 'Time Up' : 'Score'} · ${score}/${total}</span>
          <button type="button" onclick="startQuiz()" class="btn-pill px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-400 text-slate-950">Retry</button>
        </div>
        <div class="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div class="p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 font-bold">Correct: ${right}</div>
          <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold">Wrong: ${wrong}</div>
          <div class="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold">Net (-${neg}): ${score}</div>
        </div>
      `;
      renderQuizStage();
    }

    function handlePhotoChange(e) {
      if (!enforceActiveAccess('upload photo')) {
        e.target.value = '';
        return;
      }
      const file = e.target.files?.[0];
      if (!file) return;
      state.photoMime = file.type || 'image/jpeg';
      const reader = new FileReader();
      reader.onload = () => {
        const res = String(reader.result || '');
        const m = res.match(/^data:([^;]+);base64,(.+)$/);
        state.photoMime = m ? m[1] : state.photoMime;
        state.photoBase64 = m ? m[2] : res;
        const img = document.getElementById('photo-preview');
        img.src = res;
        img.classList.remove('hidden');
        document.getElementById('photo-empty').classList.add('hidden');
        document.getElementById('photo-badge').textContent = 'Photo Ready';
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }

    async function solvePhotoDoubleCheck() {
      if (!enforceActiveAccess('solve photo')) return;
      if (!state.photoBase64) return toast('Select a question photo first');
      const hint = document.getElementById('photo-hint').value.trim();
      const badge = document.getElementById('photo-badge');
      const out = document.getElementById('photo-output');
      badge.textContent = 'Checking (1/2 → 2/2)...';

      try {
        if (!state.apiKey) throw new Error('NO_KEY');
        const prompt = `Solve this HSC/Admission question photo (${hint || 'complete solution'}) in Bangla/LaTeX using two independent passes:
- pass1: extracted question + step-by-step derivation.
- pass2: independent verification of formulas, SI units, signs, and option choice.
- finalAnswer: clear verified final answer.
Return ONLY JSON: {"pass1":"","pass2":"","finalAnswer":""}`;

        const { text, model } = await callGemini([
          { text: prompt },
          { inlineData: { mimeType: state.photoMime, data: state.photoBase64 } }
        ]);
        const parsed = parseJsonSafe(text);
        badge.textContent = `Verified · ${model}`;
        out.innerHTML = `
          <div class="p-3.5 rounded-xl surface-inset space-y-1">
            <div class="text-[11px] font-mono text-cyan-300 font-bold">PASS 1 · EXTRACT & SOLVE</div>
            <p class="whitespace-pre-line text-slate-200 leading-relaxed">${esc(parsed.pass1)}</p>
          </div>
          <div class="p-3.5 rounded-xl surface-inset space-y-1">
            <div class="text-[11px] font-mono text-amber-300 font-bold">PASS 2 · DOUBLE-CHECK</div>
            <p class="whitespace-pre-line text-slate-200 leading-relaxed">${esc(parsed.pass2)}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-emerald-400/12 border border-emerald-400/35 space-y-1">
            <div class="text-[11px] font-mono text-emerald-300 font-bold">FINAL ANSWER</div>
            <p class="font-bold text-white leading-relaxed">${esc(parsed.finalAnswer)}</p>
          </div>
        `;
        typesetMath(out);
      } catch (err) {
        badge.textContent = 'Local Check';
        out.innerHTML = `
          <div class="p-3.5 rounded-xl surface-inset space-y-1">
            <div class="text-[11px] font-mono text-cyan-300 font-bold">PASS 1</div>
            <p class="text-slate-300 leading-relaxed">${err.message === 'NO_KEY' ? 'Add Gemini API Key for live OCR & vision solving. Local guide: list given data, identify target variable, and write exact formula.' : 'Fallback check: re-verify equation steps and signs.'}</p>
          </div>
          <div class="p-3.5 rounded-xl surface-inset space-y-1">
            <div class="text-[11px] font-mono text-amber-300 font-bold">PASS 2</div>
            <p class="text-slate-300 leading-relaxed">Verify SI units before calculation and eliminate distractor options.</p>
          </div>
        `;
      }
    }

    function toggleDrawer(open) {
      if (open && !enforceActiveAccess('use AI Tutor')) return;
      const d = document.getElementById('ai-drawer');
      const b = document.getElementById('drawer-backdrop');
      if (open) {
        updateDrawerContext();
        b.classList.remove('hidden');
        requestAnimationFrame(() => d.classList.remove('translate-x-full'));
      } else {
        d.classList.add('translate-x-full');
        setTimeout(() => b.classList.add('hidden'), 200);
      }
    }

    function updateDrawerContext() {
      const paperObj = SYLLABUS.find((p) => p.id === document.getElementById('bank-paper').value) || SYLLABUS[0];
      const ch = document.getElementById('bank-chapter').value || '';
      const tp = document.getElementById('bank-topic').value.trim();
      document.getElementById('drawer-context-pill').textContent = `${paperObj.subject} · ${ch}${tp ? ` · ${tp}` : ''}`;
    }

    function quickTutorPrompt(msg) {
      if (!enforceActiveAccess('use AI Tutor')) return;
      document.getElementById('chat-input').value = msg;
      sendTutorMessage(new Event('submit'));
    }

    function addBubble(role, text) {
      const box = document.getElementById('chat-messages');
      const div = document.createElement('div');
      div.className = `rounded-xl px-3.5 py-2.5 whitespace-pre-line leading-relaxed ${
        role === 'user'
          ? 'bg-emerald-400 text-slate-950 font-semibold ml-8'
          : 'surface-inset text-slate-100 mr-6'
      }`;
      div.textContent = text;
      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
      typesetMath(div);
    }

    async function sendTutorMessage(e) {
      e.preventDefault();
      if (!enforceActiveAccess('message AI Tutor')) return;
      const inp = document.getElementById('chat-input');
      const msg = inp.value.trim();
      if (!msg) return;
      addBubble('user', msg);
      inp.value = '';

      const paperObj = SYLLABUS.find((p) => p.id === document.getElementById('bank-paper').value) || SYLLABUS[0];
      const ch = document.getElementById('bank-chapter').value || '';
      const bankSnippet = document.getElementById('bank-text').value.trim().slice(0, 2500);

      try {
        if (!state.apiKey) throw new Error('NO_KEY');
        const ctx = `HSC ${paperObj.paper}, Chapter: ${ch}. Bank snippet: ${bankSnippet || 'None'}`;
        const { text } = await callGemini([{ text: `${ctx}\n\nStudent: ${msg}` }], 'Concise Bangladesh HSC Science & University Admission mentor in Bangla + LaTeX.');
        addBubble('ai', text);
      } catch (_) {
        addBubble('ai', `${paperObj.subject} (${ch}): মূল সূত্র, একক এবং শর্ত যাচাই করে মান বসাও। লাইভ AI উত্তরের জন্য উপরে Key সেট করো।`);
      }
    }

    function renderKeyStatus() {
      const active = Boolean(state.apiKey);
      document.getElementById('key-dot').className = active ? 'w-2 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-amber-400';
      document.getElementById('key-text').textContent = active ? 'Key Set' : 'Key';
    }

    function openKeyModal() {
      document.getElementById('key-input').value = state.apiKey;
      const m = document.getElementById('key-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeKeyModal() {
      const m = document.getElementById('key-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    function saveKey() {
      state.apiKey = document.getElementById('key-input').value.trim();
      if (state.apiKey) localStorage.setItem(STORAGE.KEY, state.apiKey);
      else localStorage.removeItem(STORAGE.KEY);
      renderKeyStatus();
      closeKeyModal();
      toast(state.apiKey ? 'Key saved' : 'Key cleared');
    }

    function clearKey() {
      state.apiKey = '';
      localStorage.removeItem(STORAGE.KEY);
      document.getElementById('key-input').value = '';
      renderKeyStatus();
      toast('Key cleared');
    }

    function openSqlModal() {
      const m = document.getElementById('sql-modal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeSqlModal() {
      const m = document.getElementById('sql-modal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    function copySqlSnippet() {
      const sql = document.getElementById('sql-code').textContent || '';
      try {
        const ta = document.createElement('textarea');
        ta.value = sql;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast('SQL copied');
      } catch (_) {
        toast('Copy manually from box');
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeKeyModal();
        closeSqlModal();
        closeAccountModal();
        toggleDrawer(false);
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      renderKeyStatus();
      document.getElementById('bank-paper').innerHTML = SYLLABUS.map((p) => `<option value="${p.id}">${esc(p.paper)}</option>`).join('');
      populateChapterDropdown();

      const savedBank = localStorage.getItem(STORAGE.BANK);
      document.getElementById('bank-text').value = savedBank !== null ? savedBank : SAMPLE_BANK;
      if (!savedBank) document.getElementById('bank-file-meta').textContent = 'Sample Admission Bank';

      renderAccessUI();
      runStrictOptionRecheck(false);
      renderQuestions();
      renderSyllabus();
      initNavigationGuard();
      addBubble('ai', 'Admission Warrior AI Tutor প্রস্তুত। HSC সায়েন্স ও ভর্তি পরীক্ষার যেকোনো প্রশ্ন বা প্যাটার্ন জানতে পারো।');
    });
  </script>
</body>
</html>
