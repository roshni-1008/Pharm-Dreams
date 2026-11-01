/* PharmDreams pages */
"use strict";

/* ===== helpers for video cards ===== */
function demoCards(mode) {
  return `<div class="demo-grid">${DEMOS.map(d => {
    const attrs = mode === 'play' ? `data-act="demoPlay" data-id="${d.id}" role="button" tabindex="0"` : `href="#/learn?demo=${d.id}"`;
    const tag = mode === 'play' ? 'div' : 'a';
    return `<${tag} class="demo ${d.cls} reveal" id="demo-${d.id}" ${attrs} style="--sh:rgba(124,77,255,.5)">
      <div class="thumb">${ART[d.scenes[0].art]()}</div>
      <div class="meta"><h3>${esc(d.title.en)}</h3><div class="muted">${esc(d.blurb)}</div><div class="langs">🗣 English · हिन्दी · తెలుగు</div></div></${tag}>`;
  }).join('')}</div>`;
}
actions.demoPlay = el => {
  if (!ACTIVE) return;
  ACTIVE.load(demoSpec(el.dataset.id), { autoplay: true });
  $$('.demo').forEach(d => d.classList.toggle('sel', d === el));
  const h = $('#vhost'); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

/* ===== WELCOME (landing + create account) ===== */
routes.welcome = {
  html() {
    if (Auth.user()) return `<section class="card cta reveal"><div class="big-emoji">💜</div><h1>You are signed in</h1><a class="btn" href="#/home">Go to home</a></section>`;
    return `
    <section class="card land">
      <div>
        <h1>PharmD, explained in animated videos you can hear</h1>
        <div class="typer" id="typer"></div>
        <p class="lead">Short videos with moving diagrams and a voice that explains every step, in English, Hindi or Telugu. Then test yourself with quizzes and flashcards. Free for PharmD students.</p>
        <div class="counters">
          <span class="counter"><b data-count="${DEMOS.length}">0</b>demo videos</span>
          <span class="counter"><b data-count="3">0</b>voice languages</span>
          <span class="counter"><b data-count="${ALL_SUBJECTS.length}">0</b>subjects</span>
        </div>
        <p style="margin-top:16px"><a class="btn lemon" href="#vhost" data-act="jump">▶ Watch a demo video</a></p>
      </div>
      <div class="signcard">
        <div class="mini">${mascot()}</div>
        <h2>Create your free account</h2>
        <label for="aName">Name</label><input id="aName" placeholder="Your name" autocomplete="name">
        <label for="aEmail">Email</label><input id="aEmail" type="email" placeholder="you@example.com" autocomplete="email">
        <label for="aPw">Password</label><input id="aPw" type="password" placeholder="At least 6 characters" autocomplete="new-password" data-enter="doSignup">
        <div id="aErr"></div>
        <div style="margin-top:14px"><button class="btn" style="width:100%" data-act="doSignup">Create account</button></div>
        <div style="margin-top:10px"><button class="btn soft" style="width:100%" data-act="google">Continue with Google</button></div>
        <p class="muted" style="text-align:center;margin:12px auto 0">Have an account? <a href="#/signin">Sign in</a> · <a href="#" data-act="guest">Look around as a guest</a></p>
      </div>
    </section>

    <div class="sec-h reveal"><h2>Watch a demo</h2><span class="muted">Press play. Switch the voice language any time.</span></div>
    <div id="vhost" class="reveal"></div>
    ${demoCards('play')}

    <div class="sec-h reveal"><h2>How it works</h2></div>
    <div class="how">
      <div class="reveal"><div class="big-emoji" style="font-size:2.4rem">🎬</div><b>Watch</b>Animated diagrams show what happens inside the body, step by step.</div>
      <div class="reveal"><div class="big-emoji" style="font-size:2.4rem">🗣</div><b>Listen</b>A voice explains each scene in the language you choose.</div>
      <div class="reveal"><div class="big-emoji" style="font-size:2.4rem">🧠</div><b>Practise</b>Daily quiz, flashcards, exam countdown and a focus timer.</div>
      <div class="reveal"><div class="big-emoji" style="font-size:2.4rem">📚</div><b>Study</b>The 5-year syllabus, free legal textbooks and YouTube-to-notes.</div>
    </div>

    <section class="card cta reveal" style="margin-top:22px">
      <div class="big-emoji">🌸</div><h2>Ready to study the fun way?</h2>
      <p class="muted" style="margin-inline:auto">Make your account in ten seconds. It stays on your device and keeps your streak.</p>
      <a class="btn" href="#" data-act="toTop">Create my account</a>
    </section>`;
  },
  init() {
    ACTIVE = createPlayer($('#vhost'), demoSpec('adme'));
    $('#demo-adme') && $('#demo-adme').classList.add('sel');
  }
};
actions.jump = () => { const h = $('#vhost'); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
actions.toTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => { const n = $('#aName'); n && n.focus(); }, 500); };

/* ===== HOME ===== */
routes.home = {
  html() {
    const p = getProg(), u = Auth.user(), hasKey = hasAI();
    const subj = ALL_SUBJECTS.map(s => `<span>${esc(s)}</span>`).join('');
    return `
    <section class="card hero">
      <div>
        <h1>${u ? `Welcome back, ${esc(u.name.split(' ')[0])}!` : 'Study PharmD the fun way'}</h1>
        <div class="typer" id="typer"></div>
        <p class="lead">Pick a video to watch, take today's quiz, or ask Buddy a doubt. Everything speaks your language.</p>
        <a class="btn" href="#/learn">Watch videos</a> <a class="btn lemon" href="#/quiz">Take today's quiz</a>
        <div class="counters">
          <span class="counter"><b data-count="${ALL_SUBJECTS.length}">0</b>subjects</span>
          <span class="counter"><b data-count="${QUIZ.length}">0</b>quiz questions</span>
          <span class="counter"><b data-count="${p.streak}">0</b>day streak</span>
        </div>
      </div>
      <div class="scene" aria-hidden="true">
        ${mascot()}
        <span class="pf" style="--x:-110px;--y:-90px;--r:-20deg;--t:1.0s">💊</span>
        <span class="pf" style="--x:115px;--y:-70px;--r:25deg;--t:1.15s">🧬</span>
        <span class="pf" style="--x:-95px;--y:70px;--r:10deg;--t:1.3s">🌸</span>
        <span class="pf" style="--x:105px;--y:85px;--r:-15deg;--t:1.45s">✨</span>
        <span class="pf" style="--x:0px;--y:-135px;--r:8deg;--t:1.6s">🧪</span>
      </div>
    </section>
    ${hasKey ? '' : `<div class="note reveal">🤖 The AI is switched off on this site right now, so videos on any topic and YouTube notes are paused. Everything else works, and chat answers from the built-in notes. <a href="#/settings">Details for the site owner</a>.</div>`}
    <div class="sec-h reveal"><h2>Watch and listen</h2><a href="#/learn">See all videos</a></div>
    ${demoCards('link')}
    <div class="marquee reveal" aria-hidden="true"><div>${subj}${subj}</div></div>
    <div class="grid">
      <a class="tile t1 reveal" href="#/learn"><div class="ico">🎬</div><h3>Animated videos</h3><div class="muted">Any topic, with voice, in 3 languages.</div></a>
      <a class="tile t2 reveal" href="#/syllabus"><div class="ico">📚</div><h3>5-year syllabus</h3><div class="muted">Every year and subject, one tap from a video.</div></a>
      <a class="tile t3 reveal" href="#/library"><div class="ico">🎁</div><h3>Free library</h3><div class="muted">Legal free textbooks, courses and drug references.</div></a>
      <a class="tile t4 reveal" href="#/quiz"><div class="ico">🧠</div><h3>Daily quiz</h3><div class="muted">🔥 ${p.streak} day streak, best ${p.best}</div></a>
      <a class="tile t5 reveal" href="#/cards"><div class="ico">🃏</div><h3>Flashcards</h3><div class="muted">Flip, recall, repeat. Great the night before.</div></a>
      <a class="tile t6 reveal" href="#/exam"><div class="ico">⏰</div><h3>Exam room</h3><div class="muted">Countdown, focus timer, important questions.</div></a>
      <a class="tile t7 reveal" href="#/youtube"><div class="ico">📝</div><h3>YouTube to notes</h3><div class="muted">Paste a link, download neat notes.</div></a>
      <a class="tile t8 reveal" href="#/chat"><div class="ico">💬</div><h3>Buddy chat</h3><div class="muted">Ask doubts by typing or speaking.</div></a>
    </div>`;
  },
  init() { setTimeout(() => { if (/^#\/?(home)?$/.test(location.hash)) showBubble('Hi! I am Pilly. Tap me any time for a study tip. 💊', 5500); }, 2600); }
};

/* ===== VIDEOS (was Learn) ===== */
let LESSON = null;
routes.learn = {
  html(p) {
    return `
    <section class="card reveal">
      <h1>Animated videos with voice</h1>
      <p class="muted">Type any topic and Buddy makes a short animated video with a spoken explanation. The 4 demo videos below need no key and speak in all 3 languages.</p>
      <div class="row">
        <div style="flex:3 1 260px"><label for="topic">Topic</label><input id="topic" placeholder="e.g. Beta-blockers, Pharmacokinetics, Antibiotic resistance" value="${esc(p.get('topic') || '')}" data-enter="explain"></div>
        <div><label for="lang">Voice language</label><select id="lang">${langOptions(LS.get('pd_lang') || 'en')}</select></div>
        <button class="btn" data-act="explain">Make my video</button>
      </div>
      <div style="margin-top:10px"><span class="muted">Try:</span>
        ${['Beta-lactam antibiotics', 'Autonomic nervous system', 'Drug-receptor interactions', 'Beta blockers', 'Pharmacokinetic parameters'].map(t => `<span class="chip" data-act="chip" data-t="${esc(t)}">${esc(t)}</span>`).join('')}
      </div>
    </section>
    <div id="learnMsg"></div>
    <div id="vhost" class="reveal"></div>
    <div class="card print-area" id="lessonNotes" style="margin-top:20px"></div>
    <div class="row" style="justify-content:flex-start;margin-bottom:20px">
      <button class="btn mint" data-act="dlNotes">⬇ Download notes (.txt)</button>
      <button class="btn soft" data-act="printNotes">🖨 Save as PDF / Print</button>
    </div>
    <div class="sec-h reveal"><h2>Demo videos</h2><span class="muted">No key needed</span></div>
    ${demoCards('play')}`;
  },
  init(p) {
    const first = p.get('demo') || 'adme';
    ACTIVE = createPlayer($('#vhost'), demoSpec(first), { onChange: (spec, lang) => renderNotes(spec, lang) });
    const sel = $('#demo-' + first); sel && sel.classList.add('sel');
    if (p.get('topic') && hasAI()) setTimeout(() => actions.explain(), 80);
  }
};
function renderNotes(spec, lang) {
  LESSON = { title: vText(spec, 'title', lang), lang, keypoints: spec.keypoints || [], mnemonic: spec.mnemonic || '',
    scenes: spec.scenes.map(s => ({ emoji: s.emoji || '', title: vText(s, 't', lang), text: vText(s, 'x', lang), bullets: s.bullets || [] })) };
  const n = $('#lessonNotes'); if (n) n.innerHTML = lessonNotesHTML(LESSON);
}
actions.chip = el => { $('#topic').value = el.dataset.t; };
actions.explain = async () => {
  const topic = $('#topic').value.trim(), lang = $('#lang').value, box = $('#learnMsg');
  if (!topic) { toast('Type a topic first 🌸'); return; }
  LS.set('pd_lang', lang);
  box.innerHTML = `<div class="card">${LOADING}</div>`;
  const prompt = `Create a short animated explainer video script on "${topic}" for an Indian PharmD student. Write the narration entirely in ${LANGS[lang].ai} (native script; keep drug names and key technical terms also in English letters).
Return ONLY JSON in this shape:
{"title":"...","scenes":[{"emoji":"one emoji","title":"short heading","text":"1 to 2 short sentences that sound natural when spoken aloud","visual":{"type":"move|block|merge|grow|split|cycle","a":"emoji for the first thing","b":"emoji for the second thing","mover":"emoji that travels or acts","labelA":"1-3 word English label","labelB":"1-3 word English label"}}],"keypoints":["5 to 8 exam-oriented points"],"mnemonic":"a memory trick if useful, else empty string"}
Visual types: move = mover travels from a to b; block = mover is stopped before b (inhibition); merge = a and b combine (binding); grow = a increases; split = a divides; cycle = a, mover and b go round a loop.
Use 5 to 6 scenes that build from basics to clinical relevance. Be accurate. Do not invent facts.`;
  try {
    const d = parseJSON(await ai(prompt, { json: true }));
    if (!d.scenes || !d.scenes.length) throw new Error('The video came back empty. Please try again.');
    const spec = { title: d.title || topic, lang, multi: false, keypoints: d.keypoints || [], mnemonic: d.mnemonic || '',
      scenes: d.scenes.map(s => ({ emoji: s.emoji, t: s.title, x: s.text, visual: s.visual, bullets: s.bullets })) };
    box.innerHTML = '';
    $$('.demo').forEach(x => x.classList.remove('sel'));
    ACTIVE = createPlayer($('#vhost'), spec, { lang, onChange: (sp, l) => renderNotes(sp, l) });
    $('#vhost').scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('Your video is ready. Press play ▶');
  } catch (e) {
    if (e.message !== 'NOKEY') return showErr(box, e);
    const words = topic.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    let best = null, bs = 0;
    DEMOS.forEach(d => { const hay = (d.title.en + ' ' + d.blurb + ' ' + d.scenes.map(s => s.x.en).join(' ')).toLowerCase(); const sc = words.filter(w => hay.includes(w)).length; if (sc > bs) { bs = sc; best = d; } });
    box.innerHTML = `<div class="note">🤖 Videos on any topic need the AI, which is switched off on this site right now. ${best ? `The closest ready-made video is <b>${esc(best.title.en)}</b>. <button class="btn small" data-act="demoPlay" data-id="${best.id}">▶ Play it</button>` : 'Try one of the 4 ready-made videos below, they speak English, Hindi and Telugu.'}</div>`;
  }
};
function lessonNotesHTML(d) {
  return `<h2>${esc(d.title || '')}</h2>` + d.scenes.map(s => `<h3>${esc(s.emoji || '')} ${esc(s.title || '')}</h3><p>${esc(s.text || '')}</p>${(s.bullets && s.bullets.length) ? '<ul>' + s.bullets.map(b => `<li>${esc(b)}</li>`).join('') + '</ul>' : ''}`).join('')
    + (d.keypoints && d.keypoints.length ? `<h3>⭐ Key points</h3><ul>${d.keypoints.map(k => `<li>${esc(k)}</li>`).join('')}</ul>` : '')
    + (d.mnemonic ? `<h3>🧠 Memory trick</h3><p>${esc(d.mnemonic)}</p>` : '');
}
function lessonText(d) {
  let t = d.title + '\n' + '='.repeat((d.title || '').length) + '\n\n';
  d.scenes.forEach(s => { t += `${s.emoji || ''} ${s.title}\n${s.text}\n`; (s.bullets || []).forEach(b => t += `  - ${b}\n`); t += '\n'; });
  if (d.keypoints && d.keypoints.length) { t += 'KEY POINTS\n'; d.keypoints.forEach(k => t += `- ${k}\n`); t += '\n'; }
  if (d.mnemonic) t += 'MEMORY TRICK\n' + d.mnemonic + '\n';
  return t;
}
actions.dlNotes = () => { if (LESSON) download((LESSON.title || 'notes').replace(/[^\wऀ-ॿఀ-౿]+/g, '_') + '.txt', lessonText(LESSON)); };
actions.printNotes = () => window.print();

/* ===== SYLLABUS ===== */
routes.syllabus = {
  html() {
    return `
    <section class="card reveal">
      <h1>PharmD syllabus: 5 years and an internship</h1>
      <p class="muted">Based on the Pharmacy Council of India PharmD regulations. Subject names and order can differ a little by university, so confirm with your latest PCI or university syllabus. A one-year internship / residency follows Year 5.</p>
    </section>
    ${SYLLABUS.map((y, i) => `
      <details class="reveal" ${i === 0 ? 'open' : ''}>
        <summary>${y.emoji} ${y.year}</summary>
        ${y.subjects.map(s => `<div class="subj"><span>${esc(s)}</span>
          <span><a class="btn soft small" href="#/learn?topic=${encodeURIComponent(s + ' overview')}">✨ Learn</a>
          <a class="btn soft small" href="#/chat?q=${encodeURIComponent('Give me an exam-oriented overview of ' + s)}">💬 Ask</a></span></div>`).join('')}
      </details>`).join('')}`;
  }
};

/* ===== LIBRARY ===== */
routes.library = {
  html() {
    const cats = [...new Set(LIBRARY.map(l => l.cat))];
    const mine = LS.get('pd_links_' + (Auth.user()?.email || 'guest'), []);
    return `
    <section class="card reveal">
      <h1>Free study library</h1>
      <p class="muted">Only legal, free sources are listed, so nobody gets in trouble. Your college e-library may also give free access to the main textbooks. Ask your librarian.</p>
      <label for="libSearch">Search</label><input id="libSearch" placeholder="Type to filter resources">
    </section>
    <div id="libList">${cats.map(c => `<section class="card reveal"><h2>${esc(c)}</h2><div class="res">${LIBRARY.filter(l => l.cat === c).map(l => `<a class="item" target="_blank" rel="noopener" href="${esc(l.url)}"><b>${esc(l.title)}</b><span class="muted">${esc(l.desc)}</span></a>`).join('')}</div></section>`).join('')}</div>
    <section class="card reveal">
      <h2>💜 My saved links</h2>
      <p class="muted">Save notes, PDFs or question-paper links your classmates share. They stay on this device.</p>
      <div class="row"><input id="lkT" placeholder="Title" aria-label="Title"><input id="lkU" placeholder="https://..." aria-label="Link"><button class="btn" data-act="addLink">Save link</button></div>
      <div class="res" id="myLinks" style="margin-top:12px">${myLinksHTML(mine)}</div>
    </section>`;
  },
  init() { $('#libSearch').addEventListener('input', actions.libFilter); }
};
function myLinksHTML(m) { return m.length ? m.map((l, i) => `<div class="row" style="flex-wrap:nowrap;align-items:center"><a class="item" style="flex:1" target="_blank" rel="noopener" href="${esc(l.url)}"><b>${esc(l.title)}</b><span class="muted">${esc(l.url)}</span></a><button class="btn soft small" data-act="delLink" data-i="${i}" aria-label="Remove">✕</button></div>`).join('') : '<span class="muted">Nothing saved yet. Add your first link above.</span>'; }
actions.libFilter = () => { const q = $('#libSearch').value.toLowerCase(); $$('#libList a.item').forEach(a => { a.style.display = a.textContent.toLowerCase().includes(q) ? '' : 'none'; }); };
actions.addLink = () => {
  let t = $('#lkT').value.trim(), u = $('#lkU').value.trim(); if (!t || !u) { toast('Add a title and a link'); return; }
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  const k = 'pd_links_' + (Auth.user()?.email || 'guest'), m = LS.get(k, []); m.push({ title: t, url: u }); LS.set(k, m);
  $('#myLinks').innerHTML = myLinksHTML(m); $('#lkT').value = ''; $('#lkU').value = ''; toast('Link saved 💜');
};
actions.delLink = el => { const k = 'pd_links_' + (Auth.user()?.email || 'guest'), m = LS.get(k, []); m.splice(+el.dataset.i, 1); LS.set(k, m); $('#myLinks').innerHTML = myLinksHTML(m); };

/* ===== QUIZ ===== */
let Q = null;
function seededRng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function dailyQuestions() {
  const seed = +todayStr().replace(/-/g, ''), r = seededRng(seed), idx = QUIZ.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx.slice(0, 5).map(i => QUIZ[i]);
}
routes.quiz = {
  html() {
    const p = getProg(), done = p.done[todayStr()];
    return `
    <section class="card reveal">
      <h1>Quizzes</h1>
      <p>🔥 Streak: <b>${p.streak}</b> day${p.streak === 1 ? '' : 's'} &nbsp; 🏆 Best: <b>${p.best}</b> ${Auth.user() ? '' : '<span class="muted">(sign in to keep it safe)</span>'}</p>
      <button class="btn" data-act="qDaily">🌞 Daily quiz, 5 questions ${done !== undefined ? '· done ✓ ' + done + '/5' : ''}</button>
      <div class="row" style="margin-top:14px">
        <div><label for="qSub">Practice by subject</label><select id="qSub"><option value="all">All subjects</option>${QUIZ_SUBJECTS.map(s => `<option>${esc(s)}</option>`).join('')}</select></div>
        <button class="btn mint" data-act="qSubject">Start practice</button>
      </div>
      <div class="row" style="margin-top:14px">
        <div style="flex:3 1 240px"><label for="qTopic">AI quiz on any topic</label><input id="qTopic" placeholder="e.g. Anti-hypertensives"></div>
        <div><label for="qLang">Language</label><select id="qLang">${langOptions('en')}</select></div>
        <button class="btn soft" data-act="qAI">Make my quiz</button>
      </div>
    </section>
    <div id="quizBox"></div>`;
  }
};
function startQuiz(qs, title, daily) { Q = { qs, i: 0, score: 0, title, daily, locked: false }; showQ(); $('#quizBox').scrollIntoView({ behavior: 'smooth' }); }
actions.qDaily = () => startQuiz(dailyQuestions(), 'Daily quiz', true);
actions.qSubject = () => {
  const s = $('#qSub').value; const pool = s === 'all' ? [...QUIZ] : QUIZ.filter(q => q.s === s);
  pool.sort(() => Math.random() - .5); startQuiz(pool.slice(0, 10), s === 'all' ? 'Mixed practice' : s, false);
};
actions.qAI = async () => {
  const t = $('#qTopic').value.trim(), l = $('#qLang').value, box = $('#quizBox'); if (!t) { toast('Type a topic first'); return; }
  box.innerHTML = `<div class="card">${LOADING}</div>`;
  try {
    const d = parseJSON(await ai(`Write 8 multiple-choice questions for a PharmD student on "${t}", in ${LANGS[l].ai} (keep drug names in English letters too). Return ONLY JSON: an array of {"q":"","o":["4 options"],"a":index_of_correct_option_0_to_3,"e":"1 sentence explanation"}. Make them accurate and exam-relevant, with exactly one correct answer.`, { json: true }));
    const qs = d.filter(x => x && x.q && Array.isArray(x.o) && x.o.length >= 2 && Number.isInteger(x.a) && x.a >= 0 && x.a < x.o.length).map(x => ({ q: x.q, o: x.o, a: x.a, e: x.e || '' }));
    if (!qs.length) throw new Error('Could not build a quiz. Try again.');
    startQuiz(qs, 'AI quiz: ' + t, false);
  } catch (e) { showErr(box, e); }
};
function showQ() {
  const box = $('#quizBox'), q = Q.qs[Q.i];
  if (!q) return finishQuiz();
  Q.locked = false;
  box.innerHTML = `<section class="card"><div class="muted">${esc(Q.title)}: question ${Q.i + 1} of ${Q.qs.length}</div>
    <div class="bar" style="margin:8px 0"><i style="width:${Q.i / Q.qs.length * 100}%"></i></div>
    <h2>${esc(q.q)}</h2>
    ${q.o.map((o, i) => `<button class="opt" data-act="answer" data-i="${i}">${String.fromCharCode(65 + i)}. ${esc(o)}</button>`).join('')}
    <div id="qFb"></div></section>`;
}
actions.answer = el => {
  if (Q.locked) return; Q.locked = true; const q = Q.qs[Q.i], i = +el.dataset.i;
  $$('#quizBox .opt').forEach((b, k) => { if (k === q.a) b.classList.add('right'); else if (k === i) b.classList.add('wrong'); });
  if (i === q.a) Q.score++;
  $('#qFb').innerHTML = `<div class="note">${i === q.a ? '🎉 Correct!' : '💡 Not quite.'} ${esc(q.e || '')}</div><button class="btn" data-act="qNext">${Q.i + 1 >= Q.qs.length ? 'See my result' : 'Next question'}</button>`;
};
actions.qNext = () => { Q.i++; showQ(); };
function finishQuiz() {
  const pct = Math.round(Q.score / Q.qs.length * 100), em = pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '🌱';
  const p = getProg(); p.scores.push({ t: Q.title, s: Q.score, n: Q.qs.length, d: todayStr() }); p.scores = p.scores.slice(-50);
  let extra = '';
  if (Q.daily && p.done[todayStr()] === undefined) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    p.streak = p.last === todayStr(y) ? p.streak + 1 : 1; p.last = todayStr(); p.best = Math.max(p.best, p.streak); p.done[todayStr()] = Q.score;
    extra = `<p>🔥 Streak: <b>${p.streak}</b> day${p.streak === 1 ? '' : 's'}!</p>`;
  }
  setProg(p);
  if (pct >= 80) FX.confetti(170); else if (pct >= 50) FX.confetti(70);
  $('#quizBox').innerHTML = `<section class="card" style="text-align:center"><div class="big-emoji">${em}</div><h2>You scored ${Q.score} out of ${Q.qs.length} (${pct}%)</h2>${extra}
    <p class="muted" style="margin-inline:auto">${pct >= 80 ? 'Brilliant. Keep it up!' : pct >= 50 ? 'Good going. A little revision will make it perfect.' : 'Every expert started here. Try a lesson or flashcards, then retry.'}</p>
    <a class="btn" href="#/quiz">Back to quizzes</a> <a class="btn soft" href="#/cards">Revise with flashcards</a></section>`;
}

/* ===== FLASHCARDS ===== */
let CARDS = null;
routes.cards = {
  html() {
    return `
    <section class="card reveal">
      <h1>Flashcards</h1>
      <p class="muted">Read the question, say the answer out loud, then flip the card. Mark the ones you knew.</p>
      <div class="row"><div><label for="fcSub">Subject</label><select id="fcSub"><option value="all">All subjects</option>${QUIZ_SUBJECTS.map(s => `<option>${esc(s)}</option>`).join('')}</select></div>
      <button class="btn" data-act="fcStart">Shuffle and start</button></div>
    </section>
    <div id="fcBox"></div>`;
  },
  init() { CARDS = null; actions.fcStart(); }
};
actions.fcStart = () => {
  const s = $('#fcSub').value, pool = (s === 'all' ? [...QUIZ] : QUIZ.filter(q => q.s === s)).sort(() => Math.random() - .5);
  CARDS = { pool, i: 0, flipped: false, known: 0, seen: 0 }; drawCard();
};
function drawCard() {
  const box = $('#fcBox'), c = CARDS.pool[CARDS.i];
  if (!c) {
    FX.confetti(120);
    box.innerHTML = `<section class="card" style="text-align:center"><div class="big-emoji">🎉</div><h2>Deck finished</h2><p class="muted" style="margin-inline:auto">You knew ${CARDS.known} of ${CARDS.pool.length}. Run it again to lock them in.</p><button class="btn" data-act="fcStart">Shuffle again</button></section>`; return;
  }
  box.innerHTML = `<div class="muted" style="text-align:center">Card ${CARDS.i + 1} of ${CARDS.pool.length} · ${esc(c.s)}</div>
    <div class="bar" style="max-width:560px;margin:8px auto"><i style="width:${CARDS.i / CARDS.pool.length * 100}%"></i></div>
    <div class="flipwrap" data-act="flip" role="button" tabindex="0" aria-label="Flip card"><div class="flipper" id="flipper">
      <div class="face front"><div class="q">${esc(c.q)}</div><p class="muted" style="color:#4a3b82;margin-top:14px">Tap to flip</p></div>
      <div class="face back"><h3>${esc(c.o[c.a])}</h3><p>${esc(c.e)}</p></div></div></div>
    <div class="row" style="justify-content:center"><button class="btn soft" data-act="fcAgain">🔁 Again</button><button class="btn mint" data-act="fcKnew">✅ I knew it</button></div>`;
}
actions.flip = () => { $('#flipper').classList.toggle('flipped'); };
actions.fcAgain = () => { const c = CARDS.pool.splice(CARDS.i, 1)[0]; CARDS.pool.push(c); drawCard(); toast('Added to the end of the deck'); };
actions.fcKnew = () => { CARDS.known++; CARDS.i++; drawCard(); };

/* ===== EXAM ROOM ===== */
let POMO = null;
routes.exam = {
  html() {
    const d = LS.get('pd_exam', '');
    return `
    <div class="grid" style="margin-bottom:20px">
      <section class="card reveal" style="margin:0"><h2>📅 Exam countdown</h2>
        <label for="examDate">Exam date</label><input type="date" id="examDate" value="${esc(d)}">
        <div class="cd" id="cdOut" style="margin-top:8px"></div></section>
      <section class="card reveal" style="margin:0"><h2>🍅 Focus timer</h2>
        <div class="clock" id="clk">25:00</div>
        <div class="row" style="justify-content:center"><button class="btn small" data-act="pomoGo">Start</button><button class="btn soft small" data-act="pomoStop">Pause</button><button class="btn soft small" data-act="pomoReset">Reset</button></div>
        <p class="muted" style="text-align:center;margin-inline:auto" id="pomoMode">Focus time 🌸</p></section>
    </div>
    <section class="card reveal"><h2>🎯 Important questions</h2>
      <p class="muted">Pick a subject and Buddy lists likely exam questions with short hints. Use them for practice. They are not a guarantee of what will come.</p>
      <div class="row">
        <div style="flex:2 1 220px"><label for="iqSub">Subject</label><select id="iqSub">${ALL_SUBJECTS.map(s => `<option>${esc(s)}</option>`).join('')}</select></div>
        <div><label for="iqType">Type</label><select id="iqType"><option>Short answer (2–5 marks)</option><option>Long answer (10 marks)</option><option>Viva questions</option></select></div>
        <div><label for="iqLang">Language</label><select id="iqLang">${langOptions('en')}</select></div>
        <button class="btn" data-act="iqGo">Generate questions</button>
      </div>
      <div id="iqOut" style="margin-top:14px"></div>
    </section>
    <section class="card reveal"><h2>📄 Question papers and syllabus</h2>
      <p class="muted">Universities and colleges publish previous papers, and rules differ for each. Start here, then save your own links in the <a href="#/library">Library</a>.</p>
      <div class="res">
        <a class="item" target="_blank" rel="noopener" href="https://knruhs.telangana.gov.in"><b>KNRUHS (Telangana)</b><span class="muted">Notices, syllabus, timetables and results.</span></a>
        <a class="item" target="_blank" rel="noopener" href="https://www.pci.nic.in"><b>Pharmacy Council of India</b><span class="muted">PharmD regulations and syllabus documents.</span></a>
        <a class="item" target="_blank" rel="noopener" href="https://www.google.com/search?q=PharmD+previous+year+question+papers"><b>Search for PharmD previous year question papers</b><span class="muted">Opens a web search.</span></a>
      </div>
    </section>`;
  },
  init() {
    const upd = () => {
      const v = $('#examDate').value; LS.set('pd_exam', v); const o = $('#cdOut');
      if (!v) { o.textContent = 'Pick your exam date'; return; }
      const days = Math.ceil((new Date(v + 'T00:00:00') - new Date(todayStr() + 'T00:00:00')) / 86400000);
      o.textContent = days > 0 ? `${days} day${days === 1 ? '' : 's'} to go 💪` : days === 0 ? 'Today! You got this 🌟' : 'Exam done 🎉';
    };
    $('#examDate').addEventListener('change', upd); upd();
    POMO = { mode: 'focus', left: 25 * 60, id: null }; drawPomo();
  }
};
function drawPomo() {
  const c = $('#clk'); if (!c) return;
  c.textContent = String(Math.floor(POMO.left / 60)).padStart(2, '0') + ':' + String(POMO.left % 60).padStart(2, '0');
  $('#pomoMode').textContent = POMO.mode === 'focus' ? 'Focus time 🌸' : 'Break time ☕';
}
actions.pomoGo = () => {
  if (POMO.id) return;
  POMO.id = setInterval(() => {
    POMO.left--;
    if (POMO.left <= 0) { POMO.mode = POMO.mode === 'focus' ? 'break' : 'focus'; POMO.left = (POMO.mode === 'focus' ? 25 : 5) * 60; toast(POMO.mode === 'focus' ? 'Back to focus! 🌸' : 'Break time. Stretch and sip some water ☕'); if (POMO.mode === 'break') FX.confetti(50); }
    drawPomo();
  }, 1000); timers.push(POMO.id);
};
actions.pomoStop = () => { clearInterval(POMO.id); POMO.id = null; };
actions.pomoReset = () => { actions.pomoStop(); POMO.mode = 'focus'; POMO.left = 25 * 60; drawPomo(); };
actions.iqGo = async () => {
  const box = $('#iqOut'); box.innerHTML = LOADING; const s = $('#iqSub').value, t = $('#iqType').value, l = $('#iqLang').value;
  try {
    const r = await ai(`List 12 likely exam questions for the PharmD subject "${s}" of type "${t}". Write in ${LANGS[l].ai} (keep drug names in English letters too). For each question add a one-line answer hint. Format as a numbered Markdown list. Be accurate and syllabus-appropriate.`);
    box.innerHTML = `<div class="md print-area">${md(r)}</div><div class="row" style="justify-content:flex-start;margin-top:12px"><button class="btn mint small" data-act="dlIQ">⬇ Download</button><button class="btn soft small" data-act="printNotes">🖨 Save as PDF / Print</button></div>`;
    box.dataset.raw = r;
  } catch (e) { showErr(box, e); }
};
actions.dlIQ = () => download('important_questions.txt', $('#iqOut').dataset.raw || '');

/* ===== YOUTUBE NOTES ===== */
routes.youtube = {
  html() {
    return `
    <section class="card reveal">
      <h1>YouTube to study notes</h1>
      <p class="muted">Paste a YouTube link and Buddy turns the video into neat, downloadable notes.</p>
      <label for="ytUrl">YouTube link</label><input id="ytUrl" placeholder="https://www.youtube.com/watch?v=...">
      <div class="row"><div><label for="ytLang">Notes language</label><select id="ytLang">${langOptions('en')}</select></div>
        <div><label for="ytStyle">Style</label><select id="ytStyle"><option>Exam-ready notes</option><option>Short summary</option><option>Detailed notes with examples</option></select></div></div>
      <details style="margin-top:14px"><summary style="font-size:1.05rem">Paste the transcript instead (more reliable)</summary>
        <p class="muted">On YouTube, open the video, tap “…more”, then <b>Show transcript</b>. Copy the text and paste it below. Use this when the link method fails, for example with private or very long videos.</p>
        <textarea id="ytTr" aria-label="Transcript" placeholder="Paste transcript here (optional)"></textarea></details>
      <div style="margin-top:14px"><button class="btn" data-act="ytGo">Make my notes</button></div>
    </section>
    <div id="ytOut"></div>`;
  }
};
actions.ytGo = async () => {
  const url = $('#ytUrl').value.trim(), tr = $('#ytTr').value.trim(), l = $('#ytLang').value, st = $('#ytStyle').value, box = $('#ytOut');
  if (!url && !tr) { toast('Paste a YouTube link or a transcript'); return; }
  if (url && !/^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(url)) { toast('That does not look like a YouTube link'); return; }
  box.innerHTML = `<div class="card">${LOADING} <span class="muted">Long videos can take a minute.</span></div>`;
  const base = `Turn this into "${st}" for a PharmD student, written in ${LANGS[l].ai} (keep drug names and technical terms also in English letters). Use Markdown: a title, headings, bullet points, bold key terms, a short "Key points to remember" list, and 5 likely exam questions at the end. Only use what is in the source; do not invent facts.`;
  try {
    const r = tr ? await ai(base + '\n\nTRANSCRIPT:\n' + tr.slice(0, 120000)) : await ai(base, { ytUrl: url });
    box.innerHTML = `<section class="card"><div class="md print-area">${md(r)}</div></section>
      <div class="row" style="justify-content:flex-start;margin-bottom:20px"><button class="btn mint" data-act="ytDl">⬇ Download (.md)</button><button class="btn soft" data-act="ytDlTxt">⬇ Download (.txt)</button><button class="btn soft" data-act="printNotes">🖨 Save as PDF / Print</button></div>`;
    box.dataset.raw = r; FX.confetti(50);
  } catch (e) {
    if (e.message === 'NOKEY') return showErr(box, e);
    box.innerHTML = `<div class="warn">😢 ${esc(e.message)}<br><br>${url && !tr ? 'If the link method does not work for this video, open the video, tap <b>Show transcript</b>, copy it, paste it in the transcript box above and try again.' : ''}</div>`;
  }
};
actions.ytDl = () => download('youtube_notes.md', $('#ytOut').dataset.raw || '', 'text/markdown');
actions.ytDlTxt = () => download('youtube_notes.txt', ($('#ytOut').dataset.raw || '').replace(/[#*`]/g, ''));

/* ===== CHAT ===== */
let CHAT = [], REC = null;
routes.chat = {
  html(p) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    return `
    <section class="card reveal">
      <h1>Buddy chat</h1>
      <div class="row">
        <div><label for="cLang">Language</label><select id="cLang">${langOptions('en')}</select></div>
        <div><label for="cSpeak">Buddy reads answers aloud</label><select id="cSpeak"><option value="0">No</option><option value="1">Yes 🔊</option></select></div>
      </div>
      <div class="msgs" id="msgs" style="margin-top:14px" aria-live="polite"></div>
      <div class="row" style="margin-top:12px;flex-wrap:nowrap;align-items:center">
        <input id="cIn" aria-label="Your question" placeholder="Ask any PharmD doubt" data-enter="chatSend" value="${esc(p.get('q') || '')}">
        ${SR ? '<button class="btn soft" id="micBtn" data-act="mic" title="Speak your question" aria-label="Speak">🎤</button>' : ''}
        <button class="btn" data-act="chatSend">Send</button>
      </div>
      <p class="muted">Buddy can make mistakes. Check important facts with your textbook or teacher. For your own medicines or symptoms, ask a doctor or pharmacist.</p>
    </section>`;
  },
  init(p) { drawChat(); if (p.get('q')) setTimeout(() => actions.chatSend(), 80); }
};
function drawChat() {
  const m = $('#msgs'); if (!m) return;
  m.innerHTML = CHAT.length ? CHAT.map(c => `<div class="msg ${c.role === 'user' ? 'me' : 'bot'}">${c.role === 'user' ? esc(c.text) : `<div class="md">${md(c.text)}</div>`}</div>`).join('')
    : `<div class="msg bot">Hi! I'm Buddy 🌸 Ask me anything about your PharmD subjects. Type, or tap 🎤 to speak.</div>`;
  m.scrollTop = m.scrollHeight;
}
actions.chatSend = async () => {
  const inp = $('#cIn'), t = inp.value.trim(); if (!t) return; inp.value = '';
  const l = $('#cLang').value, sp = $('#cSpeak').value === '1';
  const hist = CHAT.slice(-12).map(c => ({ role: c.role, text: c.text }));
  CHAT.push({ role: 'user', text: t }); drawChat();
  const m = $('#msgs'); m.insertAdjacentHTML('beforeend', `<div class="msg bot" id="typing">${LOADING}</div>`); m.scrollTop = m.scrollHeight;
  try {
    const r = await ai(t, { history: hist, system: `You are "Buddy", a warm, friendly tutor for Indian PharmD students. Always reply in ${LANGS[l].ai} (native script), keeping drug names and technical terms also in English letters. Be accurate, simple and exam-oriented, with short paragraphs and bullets. If unsure, say so. For personal medicine or symptom questions, share general educational information and advise seeing a doctor or pharmacist.` });
    CHAT.push({ role: 'model', text: r }); drawChat(); if (sp) speak(r, LANGS[l].code);
  } catch (e) {
    $('#typing')?.remove();
    if (e.message === 'NOKEY') {
      const a = localAnswer(t);
      CHAT.push({ role: 'model', text: a ? a.a + '\n\n*This answer is from my built-in notes. The full AI is switched off on this site right now.*' : "I couldn't find that in my built-in notes, and the full AI is switched off on this site right now. Try the quizzes, flashcards and the 4 demo videos, or ask the site owner to switch the AI on." });
      drawChat();
    } else $('#msgs').insertAdjacentHTML('beforeend', `<div class="msg bot">😢 ${esc(/quota|429|rate|limit/i.test(e.message) ? 'Many people are using the free AI right now. Wait a minute and ask again.' : e.message)}</div>`);
  }
};
function localAnswer(q) {
  const stop = new Set('what is the of an and to in for how does do why when which who are was be it its on with by from about explain tell me define meaning give short note write'.split(' '));
  const words = q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stop.has(w));
  if (!words.length) return null;
  const docs = [];
  QUIZ.forEach(x => docs.push({ t: x.q + ' ' + x.o[x.a] + ' ' + x.e, a: `**${x.q}**\n\nAnswer: ${x.o[x.a]}.\n\n${x.e}` }));
  DEMOS.forEach(d => d.scenes.forEach(s => docs.push({ t: d.title.en + ' ' + s.t.en + ' ' + s.x.en, a: `**${d.title.en}: ${s.t.en}**\n\n${s.x.en}` })));
  let best = null, bs = 0;
  docs.forEach(d => { const low = d.t.toLowerCase(); const sc = words.filter(w => low.includes(w)).length; if (sc > bs) { bs = sc; best = d; } });
  return best && bs >= Math.ceil(words.length / 2) ? best : null;
}
actions.mic = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return;
  if (REC) { REC.stop(); return; }
  REC = new SR(); REC.lang = LANGS[$('#cLang').value].code; REC.interimResults = false;
  const b = $('#micBtn'); b.textContent = '🔴';
  REC.onresult = e => { $('#cIn').value = e.results[0][0].transcript; };
  REC.onerror = () => { toast('Could not hear you. Check microphone permission.'); };
  REC.onend = () => { REC = null; b.textContent = '🎤'; if ($('#cIn').value.trim()) actions.chatSend(); };
  try { REC.start(); } catch (e) { REC = null; b.textContent = '🎤'; }
};

/* ===== SETTINGS ===== */
routes.settings = {
  html() {
    return `
    <section class="card reveal"><h1>Settings</h1>
      ${hasAI() ? '<div class="note">✅ The AI is switched on. Chat, videos on any topic, AI quizzes, important questions and YouTube notes all work.</div>'
        : '<div class="warn">🤖 The AI is switched off on this site. <b>Site owner:</b> in your Vercel project open Settings, then Environment Variables, add <b>GEMINI_API_KEY</b> with your free key from aistudio.google.com/apikey, and redeploy. The README has the steps.</div>'}
      <p class="muted">Google sign-in: ${GOOGLE_ON ? 'switched on ✅' : 'not switched on. The owner can add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and NEXTAUTH_SECRET.'}</p>
    </section>
    <section class="card reveal"><h2>🗑 My data</h2>
      <p class="muted">Quiz streaks, saved links and your account details are stored in this browser. They are not shared between devices or friends.</p>
      <button class="btn soft" data-act="wipe">Erase everything on this device</button></section>`;
  }
};
actions.wipe = () => { if (confirm('Erase all accounts, streaks, saved links and the key from this device?')) { try { Object.keys(localStorage).filter(k => k.startsWith('pd_')).forEach(k => localStorage.removeItem(k)); } catch (e) {} toast('All clean ✨'); route(); } };

/* ===== SIGN IN / SIGN UP ===== */
function authPage(mode) {
  const up = mode === 'up';
  return `
  <section class="card reveal" style="max-width:480px;margin:20px auto">
    <div style="text-align:center"><div class="big-emoji">${up ? '🌷' : '🌸'}</div></div>
    <h1 style="text-align:center;font-size:2.2rem">${up ? 'Create your account' : 'Welcome back'}</h1>
    ${up ? '<label for="aName">Name</label><input id="aName" placeholder="Your name" autocomplete="name">' : ''}
    <label for="aEmail">Email</label><input id="aEmail" type="email" placeholder="you@example.com" autocomplete="email">
    <label for="aPw">Password</label><input id="aPw" type="password" placeholder="${up ? 'At least 6 characters' : 'Your password'}" autocomplete="${up ? 'new-password' : 'current-password'}" data-enter="${up ? 'doSignup' : 'doSignin'}">
    <div id="aErr"></div>
    <div style="margin-top:16px"><button class="btn" style="width:100%" data-act="${up ? 'doSignup' : 'doSignin'}">${up ? 'Create account' : 'Sign in'}</button></div>
    <div style="margin-top:10px"><button class="btn soft" style="width:100%" data-act="google">Continue with Google</button></div>
    <p style="text-align:center;margin:16px auto 4px">${up ? 'Already have an account? <a href="#/signin">Sign in</a>' : 'New here? <a href="#/signup">Create an account</a>'}<br><a href="#/home">Continue as guest</a></p>
    <p class="muted" style="text-align:center;margin-inline:auto">Accounts live only on this device and browser. They keep your streak and saved links.</p>
  </section>`;
}
routes.signin = { html: () => authPage('in') };
routes.signup = { html: () => authPage('up') };
actions.google = async () => {
  if (!GOOGLE_ON) { toast('Google sign-in is not switched on for this site yet. Use email for now.'); return; }
  try {
    const t = await (await fetch('/api/auth/csrf')).json();
    const f = document.createElement('form'); f.method = 'POST'; f.action = '/api/auth/signin/google';
    [['csrfToken', t.csrfToken], ['callbackUrl', location.origin + '/#/home']].forEach(([k, v]) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; f.appendChild(i); });
    document.body.appendChild(f); f.submit();
  } catch (e) { toast('Could not start Google sign-in. Try again.'); }
};
actions.doSignup = async () => {
  const n = $('#aName').value, e = $('#aEmail').value, p = $('#aPw').value, box = $('#aErr');
  if (!n.trim() || !/^\S+@\S+\.\S+$/.test(e)) { box.innerHTML = '<div class="warn">Enter your name and a valid email address.</div>'; return; }
  if (p.length < 6) { box.innerHTML = '<div class="warn">Use a password with at least 6 characters.</div>'; return; }
  try { await Auth.signup(n, e, p); toast('Account created. Welcome! 🌸'); FX.confetti(100); location.hash = '#/home'; } catch (err) { box.innerHTML = `<div class="warn">${esc(err.message)}</div>`; }
};
actions.doSignin = async () => {
  const e = $('#aEmail').value, p = $('#aPw').value, box = $('#aErr');
  try { await Auth.signin(e, p); toast('Welcome back! 💜'); location.hash = '#/home'; } catch (err) { box.innerHTML = `<div class="warn">${esc(err.message)}</div>`; }
};

/* ---- start ---- */
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute && e.target.getAttribute('role') === 'button') { e.preventDefault(); e.target.click(); }
});
$('#buddyBtn').innerHTML = mascot();
initTheme();
FX.init();
bootServices().then(route);
