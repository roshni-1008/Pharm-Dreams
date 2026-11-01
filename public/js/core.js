/* PharmDreams core: helpers, speech, accounts, AI, router */
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LS = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3400); }
function download(name, text, mime = 'text/plain') {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime + ';charset=utf-8' }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
function md(src) {
  const lines = esc(src).split('\n'); let out = '', list = null;
  const inline = t => t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/`(.+?)`/g, '<code>$1</code>');
  const close = () => { if (list) { out += `</${list}>`; list = null; } };
  for (const raw of lines) {
    const l = raw.trimEnd(); let m;
    if ((m = l.match(/^(#{1,4})\s+(.*)/))) { close(); const n = Math.min(m[1].length + 1, 4); out += `<h${n}>${inline(m[2])}</h${n}>`; }
    else if ((m = l.match(/^\s*[-*•]\s+(.*)/))) { if (list !== 'ul') { close(); out += '<ul>'; list = 'ul'; } out += `<li>${inline(m[1])}</li>`; }
    else if ((m = l.match(/^\s*\d+[.)]\s+(.*)/))) { if (list !== 'ol') { close(); out += '<ol>'; list = 'ol'; } out += `<li>${inline(m[1])}</li>`; }
    else if (l.trim() === '') { close(); }
    else { close(); out += `<p>${inline(l)}</p>`; }
  }
  close(); return out;
}
const todayStr = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const timers = [];
const langOptions = (sel = 'en') => Object.entries(LANGS).map(([k, v]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${v.name}</option>`).join('');

/* ---- mascot: Pilly the capsule ---- */
const mascot = (cls = '') => `<svg class="mascot ${cls}" viewBox="0 0 140 190" aria-hidden="true">
  <g class="cap-bot"><path d="M30 95 H110 V130 A40 40 0 0 1 30 130 Z" fill="#fff" stroke="#2b1b5a" stroke-width="4" stroke-linejoin="round"/>
    <ellipse class="eye" cx="54" cy="125" rx="5" ry="7" fill="#2b1b5a"/><ellipse class="eye" cx="86" cy="125" rx="5" ry="7" fill="#2b1b5a"/>
    <path d="M60 140 Q70 152 80 140" fill="none" stroke="#2b1b5a" stroke-width="4" stroke-linecap="round"/>
    <circle cx="44" cy="140" r="6" fill="#ff9ac4" opacity=".7"/><circle cx="96" cy="140" r="6" fill="#ff9ac4" opacity=".7"/></g>
  <g class="cap-top"><path d="M30 95 V70 A40 40 0 0 1 110 70 V95 Z" fill="#ff5fa2" stroke="#2b1b5a" stroke-width="4" stroke-linejoin="round"/>
    <path d="M44 66 Q46 50 62 46" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"/></g>
</svg>`;

/* ---- theme ---- */
function setTheme(t) { document.documentElement.setAttribute('data-theme', t); LS.set('pd_theme', t); const b = $('#themeBtn'); if (b) b.textContent = t === 'dark' ? '☀️' : '🌙'; }
function initTheme() {
  const saved = LS.get('pd_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);
}

/* ---- speech ---- */
let voices = [], speakToken = 0, speechRate = 1; const warnedVoice = {};
function loadVoices() { if ('speechSynthesis' in window) voices = speechSynthesis.getVoices(); }
loadVoices(); if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;
function pickVoice(code) {
  const c = code.toLowerCase().replace('_', '-'), p = c.slice(0, 2);
  return voices.find(v => v.lang.toLowerCase().replace('_', '-') === c) || voices.find(v => v.lang.toLowerCase().startsWith(p));
}
function stopSpeech() { speakToken++; if ('speechSynthesis' in window) speechSynthesis.cancel(); }
function speak(text, code, onend) {
  stopSpeech(); const my = speakToken;
  if (!('speechSynthesis' in window)) { onend && onend(); return; }
  const clean = String(text).replace(/[*#`_>]/g, ' ').replace(/\s+/g, ' ').trim();
  const chunks = clean.match(/[^.!?।\n]+[.!?।]?/g) || [clean];
  const v = pickVoice(code);
  if (!v && !warnedVoice[code]) { warnedVoice[code] = 1; toast('No voice for this language on your device. Add it in your phone or PC language settings, or read along.'); }
  let i = 0;
  const next = () => {
    if (my !== speakToken) return;
    if (i >= chunks.length) { onend && onend(); return; }
    const t = chunks[i++].trim(); if (!t) { next(); return; }
    const u = new SpeechSynthesisUtterance(t); u.lang = code; if (v) u.voice = v; u.rate = speechRate;
    u.onend = next; u.onerror = () => { if (my === speakToken) next(); };
    speechSynthesis.speak(u);
  };
  next();
}

/* ---- accounts (kept in this browser only) ---- */
async function hashPw(p) {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('pd:' + p)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  catch (e) { return btoa(unescape(encodeURIComponent('pd:' + p))); }
}
const Auth = {
  users() { return LS.get('pd_users', {}); },
  user() { return LS.get('pd_session', null); },
  async signup(name, email, pw) {
    email = email.trim().toLowerCase(); const u = this.users();
    if (u[email]) throw new Error('This email already has an account on this device. Please sign in.');
    u[email] = { name: name.trim(), hash: await hashPw(pw), created: Date.now() }; LS.set('pd_users', u);
    LS.set('pd_session', { email, name: name.trim() });
  },
  async signin(email, pw) {
    email = email.trim().toLowerCase(); const u = this.users()[email];
    if (!u || u.hash !== await hashPw(pw)) throw new Error('Email or password is not correct.');
    LS.set('pd_session', { email, name: u.name });
  },
  out() { LS.del('pd_session'); }
};
const progKey = () => 'pd_prog_' + (Auth.user()?.email || 'guest');
const getProg = () => LS.get(progKey(), { streak: 0, best: 0, last: '', done: {}, scores: [] });
const setProg = p => LS.set(progKey(), p);

/* ---- AI: runs on the server at /api/ai. The key lives in Vercel environment variables, never in the browser ---- */
let AI_ON = false, GOOGLE_ON = false;
const hasAI = () => AI_ON;
async function ai(prompt, o = {}) {
  let r;
  try {
    r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, system: o.system, history: o.history, json: !!o.json, ytUrl: o.ytUrl }) });
  } catch (e) { throw new Error('Could not reach the AI. Check your internet connection and try again.'); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || ('Request failed (' + r.status + ')'));
  if (!d.text) throw new Error('The AI returned an empty answer. Please try again.');
  return d.text;
}
async function bootServices() {
  const j = async (u, ms = 3500) => {
    try { const c = new AbortController(), t = setTimeout(() => c.abort(), ms); const r = await fetch(u, { signal: c.signal, cache: 'no-store' }); clearTimeout(t); return r.ok ? await r.json() : null; }
    catch (e) { return null; }
  };
  const [st, prov, sess] = await Promise.all([j('/api/ai'), j('/api/auth/providers'), j('/api/auth/session')]);
  AI_ON = !!(st && st.enabled);
  GOOGLE_ON = !!(prov && prov.google);
  if (sess && sess.user && sess.user.email) LS.set('pd_session', { email: sess.user.email.toLowerCase(), name: sess.user.name || sess.user.email.split('@')[0], google: true });
  else if (sess && (LS.get('pd_session') || {}).google) Auth.out();
}
function parseJSON(t) { t = t.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim(); return JSON.parse(t); }
function showErr(box, e) {
  const m = String(e.message || '');
  if (m === 'NOKEY') box.innerHTML = `<div class="warn">🤖 The AI is switched off on this site right now. Ask the site owner to switch it on (see <a href="#/settings">Settings</a>). Quizzes, flashcards, the syllabus and the 4 demo videos still work.</div>`;
  else if (/quota|429|rate|exhaust|limit/i.test(m)) box.innerHTML = `<div class="warn">⏳ Many people are using the free AI right now. Wait a minute and press the button again.</div>`;
  else if (/API key|API_KEY|invalid|permission|403|400/i.test(m)) box.innerHTML = `<div class="warn">🔑 The AI key on the server was not accepted. The site owner should check GEMINI_API_KEY in Vercel.</div>`;
  else box.innerHTML = `<div class="warn">😢 ${esc(m)}<br><span class="muted">Check your internet connection and try again.</span></div>`;
}
const LOADING = '<span class="typing"><i></i><i></i><i></i></span> Thinking...';

/* ---- router ---- */
const NAV = [['home', '🏠 Home'], ['learn', '🎬 Videos'], ['syllabus', '📚 Syllabus'], ['library', '🎁 Library'], ['quiz', '🧠 Quiz'], ['cards', '🃏 Flashcards'], ['exam', '⏰ Exam Room'], ['youtube', '🎬 YouTube Notes'], ['chat', '💬 Buddy Chat']];
const routes = {}, actions = {};
const LANDING = ['welcome', 'signin', 'signup'];
function renderChrome(cur) {
  const u = Auth.user();
  const landing = LANDING.includes(cur) && !u;
  $('#nav').innerHTML = landing ? '' : NAV.map(([r, l]) => `<a href="#/${r}" class="${r === cur ? 'on' : ''}">${l}</a>`).join('');
  $('#userbox').innerHTML = u ? `<span>Hi, ${esc(u.name.split(' ')[0])} 💜</span><button class="btn soft small" data-act="signout">Sign out</button>`
    : `<a class="btn small" href="#/signin">Sign in</a><a class="btn soft small" href="#/signup">Sign up</a>`;
}
const leaveHooks = [];
function route() {
  stopSpeech(); timers.splice(0).forEach(clearInterval); leaveHooks.forEach(f => f());
  const h = location.hash.replace(/^#\/?/, '') || 'home';
  const [name, qs] = h.split('?'); const p = new URLSearchParams(qs || '');
  if (!Auth.user() && !LS.get('pd_guest') && !LANDING.concat(['settings']).includes(name)) { location.hash = '#/welcome'; return; }
  const r = routes[name] || routes.home;
  renderChrome(routes[name] ? name : 'home');
  $('#app').innerHTML = r.html(p);
  r.init && r.init(p);
  FX.afterRender();
  window.scrollTo(0, 0);
}
addEventListener('hashchange', route);
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const f = actions[el.dataset.act]; if (f) { e.preventDefault(); f(el, e); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && e.target.matches && e.target.matches('[data-enter]')) { e.preventDefault(); actions[e.target.dataset.enter](e.target); }
});
actions.signout = async () => {
  const wasGoogle = !!(Auth.user() && Auth.user().google);
  Auth.out(); LS.del('pd_guest');
  if (wasGoogle) {
    try {
      const t = await (await fetch('/api/auth/csrf')).json();
      await fetch('/api/auth/signout', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ csrfToken: t.csrfToken, json: 'true' }) });
    } catch (e) {}
  }
  toast('Signed out. See you soon! 🌸');
  if (location.hash === '#/welcome') route(); else location.hash = '#/welcome';
};
actions.guest = () => { LS.set('pd_guest', true); location.hash = '#/home'; };
actions.theme = () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

/* ---- Pilly the helper ---- */
let tipI = Math.floor(Math.random() * TIPS.length), bubbleT;
function showBubble(msg, ms = 6500) {
  const b = $('#bubble'); if (!b) return; b.textContent = msg; b.classList.add('show');
  clearTimeout(bubbleT); bubbleT = setTimeout(() => b.classList.remove('show'), ms);
}
actions.tip = () => { tipI = (tipI + 1) % TIPS.length; showBubble('💡 ' + TIPS[tipI]); };
