/* PharmDreams video player: animated scenes + spoken narration + captions + timeline */
"use strict";
let ACTIVE = null;
const vText = (s, k, lang) => { const v = s[k]; return (v && typeof v === 'object') ? (v[lang] || v.en || '') : (v || ''); };
const artFor = s => (typeof s.art === 'string' && ART[s.art]) ? ART[s.art]() : genArt(s.visual);
function wordsHTML(text) { return String(text).split(/(\s+)/).map(w => (/^\s+$/.test(w) || w === '') ? w : `<span class="w">${esc(w)}</span>`).join(''); }
const warnedNoVoice = {};
leaveHooks.push(() => { if (ACTIVE) { ACTIVE.destroy(); ACTIVE = null; } });

function createPlayer(root, spec0, opt = {}) {
  if (ACTIVE) ACTIVE.destroy();
  let spec = spec0;
  const st = { i: 0, playing: false, ended: false, lang: opt.lang || LS.get('pd_lang') || 'en', rate: 1, muted: false, timers: [], t0: 0, dur: 0 };
  let el = {};
  const n = () => spec.scenes.length;
  const multi = () => !!spec.multi;
  const L = () => multi() ? st.lang : (spec.lang || 'en');
  const clearT = () => { st.timers.forEach(t => { clearInterval(t); clearTimeout(t); }); st.timers = []; };

  function build() {
    root.innerHTML = `
    <div class="vplayer">
      <div class="vscreen">
        <div class="vtop"><span class="vbadge"></span><b class="vtitle"></b></div>
        <div class="vart"></div>
        <div class="vcap" aria-live="polite"></div>
        <button class="vplaybig" data-v="play" aria-label="Play video"><span>▶</span></button>
      </div>
      <div class="vtrack" data-v="seek" role="slider" aria-label="Video progress"><i class="vfill"></i>${spec.scenes.map((_, k) => `<u style="left:${k / spec.scenes.length * 100}%"></u>`).join('')}</div>
      <div class="vctl">
        <button class="vb" data-v="prev" aria-label="Previous scene">⏮</button>
        <button class="vb vpp" data-v="play" aria-label="Play or pause">▶</button>
        <button class="vb" data-v="next" aria-label="Next scene">⏭</button>
        <span class="vtime"></span>
        <span class="vsp"></span>
        ${multi() ? `<label class="vsel">🗣 <select data-v="lang" aria-label="Voice language">${Object.entries(LANGS).map(([k, v]) => `<option value="${k}" ${k === st.lang ? 'selected' : ''}>${v.name}</option>`).join('')}</select></label>` : `<span class="vsel">🗣 ${esc(LANGS[spec.lang || 'en'].name)}</span>`}
        <label class="vsel">⚡ <select data-v="rate" aria-label="Speed"><option value="0.8">Slow</option><option value="1" selected>Normal</option><option value="1.25">Fast</option></select></label>
        <button class="vb" data-v="mute" aria-label="Voice on or off">🔊</button>
        <button class="vb" data-v="full" aria-label="Full screen">⛶</button>
      </div>
    </div>`;
    const q = s => root.querySelector(s);
    el = { box: q('.vplayer'), art: q('.vart'), cap: q('.vcap'), title: q('.vtitle'), badge: q('.vbadge'), fill: q('.vfill'), time: q('.vtime'), pp: q('.vpp') };
  }

  function ui() {
    el.box.classList.toggle('playing', st.playing);
    el.box.classList.toggle('ended', st.ended);
    el.pp.textContent = st.playing ? '⏸' : '▶';
    const big = el.box.querySelector('.vplaybig span'); if (big) big.textContent = st.ended ? '↺' : '▶';
    const m = el.box.querySelector('[data-v=mute]'); if (m) m.textContent = st.muted ? '🔇' : '🔊';
  }

  function render(i) {
    clearT(); stopSpeech();
    st.i = Math.max(0, Math.min(i, n() - 1)); st.ended = false;
    const s = spec.scenes[st.i];
    el.art.innerHTML = artFor(s);
    el.title.textContent = ((s.emoji || '') + ' ' + vText(s, 't', L())).trim();
    el.badge.textContent = `${st.i + 1} / ${n()}`;
    el.cap.innerHTML = wordsHTML(vText(s, 'x', L()));
    el.fill.style.width = (st.i / n() * 100) + '%';
    el.time.textContent = `Scene ${st.i + 1} of ${n()}`;
    st.t0 = Date.now(); ui();
    if (st.playing) run(s);
  }

  function run(s) {
    const words = [...el.cap.querySelectorAll('.w')], lang = L(), code = LANGS[lang].code;
    const perWord = (lang === 'en' ? 380 : 520) / st.rate;
    st.dur = Math.max(6500, words.length * perWord + 1500);
    let k = 0;
    st.timers.push(setInterval(() => { if (k < words.length) words[k++].classList.add('on'); }, perWord));
    st.timers.push(setInterval(() => { el.fill.style.width = ((st.i + Math.min(1, (Date.now() - st.t0) / st.dur)) / n() * 100) + '%'; }, 100));
    let done = false; const adv = () => { if (done || !st.playing) return; done = true; next(); };
    const hasSynth = 'speechSynthesis' in window;
    if (!st.muted && hasSynth && voices.length > 0 && !pickVoice(code) && !warnedNoVoice[code]) {
      warnedNoVoice[code] = 1; toast(`No ${LANGS[lang].ai} voice on this device. Showing captions only. Install the voice in your phone or PC language settings.`);
    }
    const speakable = !st.muted && hasSynth && (voices.length === 0 || !!pickVoice(code));
    if (speakable) {
      speechRate = st.rate;
      speak(vText(s, 't', lang) + '. ' + vText(s, 'x', lang), code, () => {
        if (!st.playing) return;
        words.forEach(w => w.classList.add('on'));
        st.timers.push(setTimeout(adv, Math.max(800, 6500 - (Date.now() - st.t0))));
      });
      st.timers.push(setTimeout(adv, st.dur * 1.7 + 3000));
    } else st.timers.push(setTimeout(adv, st.dur));
  }

  function next() {
    if (st.i < n() - 1) render(st.i + 1);
    else {
      clearT(); stopSpeech(); st.playing = false; st.ended = true;
      el.cap.querySelectorAll('.w').forEach(w => w.classList.add('on')); el.fill.style.width = '100%'; ui(); FX.confetti(70);
    }
  }
  function toggle() {
    if (st.playing) { st.playing = false; clearT(); stopSpeech(); ui(); return; }
    st.playing = true; render(st.ended ? 0 : st.i);
  }

  root.onclick = e => {
    const b = e.target.closest('[data-v]'); if (!b || !root.contains(b)) return;
    const a = b.dataset.v;
    if (a === 'play') toggle();
    else if (a === 'next') { if (st.i < n() - 1) render(st.i + 1); }
    else if (a === 'prev') render(st.i - 1);
    else if (a === 'seek') { const r = b.getBoundingClientRect(); render(Math.floor((e.clientX - r.left) / r.width * n())); }
    else if (a === 'mute') { st.muted = !st.muted; if (st.playing) render(st.i); else ui(); }
    else if (a === 'full') {
      if (document.fullscreenElement) document.exitFullscreen();
      else { const f = el.box.requestFullscreen || el.box.webkitRequestFullscreen; if (f) try { f.call(el.box); } catch (err) {} }
    }
  };
  root.onchange = e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    if (b.dataset.v === 'lang') { st.lang = b.value; LS.set('pd_lang', st.lang); render(st.i); opt.onChange && opt.onChange(spec, L()); }
    else if (b.dataset.v === 'rate') { st.rate = parseFloat(b.value); if (st.playing) render(st.i); }
  };

  const api = {
    load(s, o = {}) { clearT(); stopSpeech(); spec = s; st.i = 0; st.playing = false; st.ended = false; build(); render(0); opt.onChange && opt.onChange(spec, L()); if (o.autoplay) { st.playing = true; render(0); } },
    get lang() { return L(); },
    destroy() { clearT(); stopSpeech(); st.playing = false; root.onclick = null; root.onchange = null; }
  };
  build(); render(0); opt.onChange && opt.onChange(spec, L());
  ACTIVE = api; return api;
}
