// src/main.js — Admission Warrior Core Controller with History Recheck

const STORAGE_KEYS = {
  GEMINI_KEY: 'aw_gemini_api_key',
  SUPABASE_URL: 'aw_supabase_url',
  SUPABASE_ANON_KEY: 'aw_supabase_anon_key',
  HISTORY_STACK: 'aw_nav_history_v1',
  SESSION_STATE: 'aw_session_state_v1',
};

const DEFAULT_VIEW = 'dashboard';
const MAX_HISTORY_DEPTH = 40;

class HistoryRechecker {
  constructor(defaultView = DEFAULT_VIEW) {
    this.defaultView = defaultView;
    this.stack = this.loadAndRecheckStack();
    this.isHandlingPop = false;
    this.listeners = new Set();
  }

  // Recheck and sanitize persisted history so there are no empty, duplicate, or invalid entries
  loadAndRecheckStack() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.HISTORY_STACK);
      const parsed = raw ? JSON.parse(raw) : [];
      const cleaned = Array.isArray(parsed)
        ? parsed
            .filter((item) => item && typeof item.view === 'string' && item.view.trim() !== '')
            .map((item) => ({
              view: item.view.trim(),
              params: item.params && typeof item.params === 'object' ? item.params : {},
              ts: Number(item.ts) || Date.now(),
            }))
            .slice(-MAX_HISTORY_DEPTH)
        : [];

      if (cleaned.length === 0) {
        cleaned.push({ view: this.defaultView, params: {}, ts: Date.now() });
      }
      return cleaned;
    } catch {
      return [{ view: this.defaultView, params: {}, ts: Date.now() }];
    }
  }

  persist() {
    try {
      sessionStorage.setItem(
        STORAGE_KEYS.HISTORY_STACK,
        JSON.stringify(this.stack.slice(-MAX_HISTORY_DEPTH))
      );
    } catch {
      // Ignore storage quota errors
    }
  }

  current() {
    this.recheck();
    return this.stack[this.stack.length - 1];
  }

  // Recheck integrity of current history stack and anchor hash
  recheck() {
    if (!Array.isArray(this.stack) || this.stack.length === 0) {
      this.stack = [{ view: this.defaultView, params: {}, ts: Date.now() }];
    }

    // Collapse consecutive identical views without distinct params
    const deduped = [];
    for (const entry of this.stack) {
      const prev = deduped[deduped.length - 1];
      const sameView = prev && prev.view === entry.view;
      const sameParams =
        prev && JSON.stringify(prev.params || {}) === JSON.stringify(entry.params || {});
      if (!(sameView && sameParams)) {
        deduped.push(entry);
      }
    }

    this.stack = deduped.length ? deduped : [{ view: this.defaultView, params: {}, ts: Date.now() }];
    this.persist();
    return this.stack;
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(entry, action) {
    for (const fn of this.listeners) {
      try {
        fn(entry, action, [...this.stack]);
      } catch (err) {
        console.error('[HistoryRechecker listener error]:', err);
      }
    }
  }

  init() {
    this.recheck();
    const active = this.current();

    // Ensure an in-app guard entry exists so pressing Back stays inside the app first
    const targetHash = `#view=${encodeURIComponent(active.view)}`;
    try {
      window.history.replaceState(
        { awGuard: true, view: active.view, params: active.params },
        '',
        targetHash
      );
      window.history.pushState(
        { awActive: true, view: active.view, params: active.params },
        '',
        targetHash
      );
    } catch {
      window.location.hash = targetHash;
    }

    window.addEventListener('popstate', (event) => {
      if (this.isHandlingPop) return;
      this.isHandlingPop = true;

      try {
        this.recheck();

        // If user has prior in-app history, step back inside the app instead of exiting
        if (this.stack.length > 1) {
          this.stack.pop();
          const prevEntry = this.current();
          const hash = `#view=${encodeURIComponent(prevEntry.view)}`;
          try {
            window.history.pushState(
              { awActive: true, view: prevEntry.view, params: prevEntry.params },
              '',
              hash
            );
          } catch {
            window.location.hash = hash;
          }
          this.emit(prevEntry, 'back');
          return;
        }

        // At root view: re-anchor state once so accidental Back doesn't drop app context immediately
        const rootEntry = this.current();
        const rootHash = `#view=${encodeURIComponent(rootEntry.view)}`;
        try {
          window.history.pushState(
            { awRootAnchor: true, view: rootEntry.view, params: rootEntry.params },
            '',
            rootHash
          );
        } catch {
          window.location.hash = rootHash;
        }
        this.emit(rootEntry, 'reanchored');
      } finally {
        setTimeout(() => {
          this.isHandlingPop = false;
        }, 50);
      }
    });

    this.emit(active, 'init');
  }

  navigate(view, params = {}) {
    if (!view || typeof view !== 'string') return this.current();
    this.recheck();

    const cleanView = view.trim();
    const entry = { view: cleanView, params, ts: Date.now() };
    const top = this.stack[this.stack.length - 1];

    if (
      top &&
      top.view === entry.view &&
      JSON.stringify(top.params || {}) === JSON.stringify(entry.params || {})
    ) {
      top.ts = entry.ts;
      this.persist();
      this.emit(top, 'refresh');
      return top;
    }

    this.stack.push(entry);
    if (this.stack.length > MAX_HISTORY_DEPTH) {
      this.stack.shift();
    }
    this.persist();

    const hash = `#view=${encodeURIComponent(cleanView)}`;
    try {
      window.history.pushState({ awActive: true, view: cleanView, params }, '', hash);
    } catch {
      window.location.hash = hash;
    }

    this.emit(entry, 'push');
    return entry;
  }

  goBack() {
    this.recheck();
    if (this.stack.length > 1) {
      this.stack.pop();
      const prev = this.current();
      const hash = `#view=${encodeURIComponent(prev.view)}`;
      try {
        window.history.replaceState(
          { awActive: true, view: prev.view, params: prev.params },
          '',
          hash
        );
      } catch {
        window.location.hash = hash;
      }
      this.emit(prev, 'back');
      return prev;
    }
    return this.current();
  }
}

// Helper to recheck config & keys cleanly without exposing secrets
export function recheckRuntimeConfig() {
  const geminiKey =
    localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) ||
    window.__AW_ENV__?.GEMINI_API_KEY ||
    '';
  const supabaseUrl =
    localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) ||
    window.__AW_ENV__?.VITE_SUPABASE_URL ||
    window.__AW_ENV__?.SUPABASE_URL ||
    '';
  const supabaseAnonKey =
    localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) ||
    window.__AW_ENV__?.VITE_SUPABASE_ANON_KEY ||
    window.__AW_ENV__?.SUPABASE_ANON_KEY ||
    '';

  return {
    hasGeminiKey: Boolean(geminiKey && geminiKey.trim().length > 10),
    hasSupabaseUrl: Boolean(supabaseUrl && /^https?:\/\//i.test(supabaseUrl.trim())),
    hasSupabaseAnonKey: Boolean(supabaseAnonKey && supabaseAnonKey.trim().length > 10),
    geminiKey: geminiKey.trim(),
    supabaseUrl: supabaseUrl.trim().replace(/\/+$/, ''),
    supabaseAnonKey: supabaseAnonKey.trim(),
  };
}

// Helper to recheck a quiz/question item before rendering or saving
export function recheckQuestionItem(item) {
  if (!item || typeof item !== 'object') return { valid: false, reason: 'Invalid item' };
  const question = String(item.question || item.question_text || '').trim();
  const options = Array.isArray(item.options)
    ? item.options.map((o) => String(o || '').trim()).filter(Boolean)
    : ['option_a', 'option_b', 'option_c', 'option_d']
        .map((k) => String(item[k] || '').trim())
        .filter(Boolean);

  const uniqueOptions = new Set(options.map((o) => o.toLowerCase()));
  const correct = String(item.correct_option || item.answer || 'A')
    .trim()
    .toUpperCase();

  if (!question) return { valid: false, reason: 'Missing question text' };
  if (options.length !== 4) return { valid: false, reason: 'Must have exactly 4 options' };
  if (uniqueOptions.size !== 4) return { valid: false, reason: 'Duplicate options detected' };
  if (!['A', 'B', 'C', 'D'].includes(correct)) {
    return { valid: false, reason: 'Invalid correct option' };
  }

  return {
    valid: true,
    normalized: {
      question,
      options,
      correct_option: correct,
      explanation: String(item.explanation || '').trim(),
      rechecked: true,
    },
  };
}

// Bootstrap controller
export function createAppController(onViewRender) {
  const history = new HistoryRechecker(DEFAULT_VIEW);

  history.onChange((entry, action, stack) => {
    try {
      sessionStorage.setItem(
        STORAGE_KEYS.SESSION_STATE,
        JSON.stringify({ current: entry, action, depth: stack.length, updatedAt: Date.now() })
      );
    } catch {
      // Ignore storage errors
    }

    if (typeof onViewRender === 'function') {
      onViewRender(entry, { action, stack, config: recheckRuntimeConfig() });
    }
  });

  return {
    history,
    recheckConfig: recheckRuntimeConfig,
    recheckQuestion: recheckQuestionItem,
    start() {
      history.init();
      return history.current();
    },
  };
}

// Auto-start if loaded as a standalone entry script
if (typeof window !== 'undefined') {
  window.AWController = createAppController((entry, meta) => {
    document.dispatchEvent(
      new CustomEvent('aw:viewchange', { detail: { entry, ...meta } })
    );
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AWController.start(), {
      once: true,
    });
  } else {
    window.AWController.start();
  }
}
