/* PharmDreams effects: floating pills canvas, confetti, tilt, cursor sparks, reveal, counters, typewriter */
const FX = (() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const COLORS = ['#ff5fa2', '#7c4dff', '#19d3c5', '#ffd84d', '#ff9f6b', '#4da3ff'];
  let cv, ctx, W = 0, H = 0, parts = [], mx = 0, my = 0, twToken = 0, io = null;

  function resize() {
    if (!cv) return;
    W = cv.width = innerWidth; H = cv.height = innerHeight; mx = W / 2; my = H / 2;
    const n = Math.max(14, Math.min(40, Math.floor(W / 32)));
    parts = [];
    for (let i = 0; i < n; i++) {
      parts.push({ x: Math.random() * W, y: Math.random() * H, r: 7 + Math.random() * 12, c: COLORS[i % COLORS.length], t: i % 3,
        a: Math.random() * 6.28, va: (Math.random() - .5) * .012, vy: -(.12 + Math.random() * .35), vx: (Math.random() - .5) * .25, d: .3 + Math.random() * .7 });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.y += p.vy; p.x += p.vx; p.a += p.va;
      if (p.y < -40) { p.y = H + 40; p.x = Math.random() * W; }
      if (p.x < -40) p.x = W + 40; if (p.x > W + 40) p.x = -40;
      const ox = (mx - W / 2) * .025 * p.d, oy = (my - H / 2) * .025 * p.d;
      ctx.save(); ctx.translate(p.x + ox, p.y + oy); ctx.rotate(p.a); ctx.globalAlpha = .28 + .25 * p.d; ctx.fillStyle = p.c;
      if (p.t === 0) { // capsule
        const r = p.r * .55, L = p.r * .8;
        ctx.beginPath(); ctx.arc(-L, 0, r, Math.PI / 2, Math.PI * 1.5); ctx.arc(L, 0, r, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.globalAlpha *= .6;
        ctx.beginPath(); ctx.arc(-L, 0, r, Math.PI / 2, Math.PI * 1.5); ctx.lineTo(0, -r); ctx.lineTo(0, r); ctx.closePath(); ctx.fill();
      } else if (p.t === 1) { // round tablet
        ctx.beginPath(); ctx.arc(0, 0, p.r * .55, 0, 6.283); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.globalAlpha *= .8; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-p.r * .4, 0); ctx.lineTo(p.r * .4, 0); ctx.stroke();
      } else { // plus
        const s = p.r * .75, w = p.r * .26;
        ctx.fillRect(-s, -w, s * 2, w * 2); ctx.fillRect(-w, -s, w * 2, s * 2);
      }
      ctx.restore();
    }
  }
  function loop() { if (!document.hidden) draw(); requestAnimationFrame(loop); }

  function initBg() {
    cv = document.getElementById('fx-bg'); if (!cv) return; ctx = cv.getContext('2d');
    resize(); addEventListener('resize', resize);
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    if (reduce) draw(); else loop();
  }
  function confetti(n = 140) {
    if (reduce) return;
    const c = document.getElementById('fx-confetti'); if (!c) return;
    c.width = innerWidth; c.height = innerHeight; const x = c.getContext('2d');
    const ps = Array.from({ length: n }, (_, i) => ({ x: innerWidth / 2, y: innerHeight * .38, vx: (Math.random() - .5) * 16, vy: -Math.random() * 14 - 4,
      s: 6 + Math.random() * 8, c: COLORS[i % COLORS.length], r: Math.random() * 6, vr: (Math.random() - .5) * .45, round: i % 4 === 0 }));
    let f = 0;
    (function step() {
      x.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => { p.vy += .36; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr;
        x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c;
        if (p.round) { x.beginPath(); x.arc(0, 0, p.s / 2.2, 0, 6.283); x.fill(); } else x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        x.restore(); });
      if (++f < 160) requestAnimationFrame(step); else x.clearRect(0, 0, c.width, c.height);
    })();
  }
  function initTilt() {
    if (!fine || reduce) return;
    document.addEventListener('pointermove', e => {
      const t = e.target.closest && e.target.closest('.tile'); if (!t) return;
      const r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      t.style.transform = `perspective(700px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 11).toFixed(2)}deg) translateY(-6px)`;
    });
    document.addEventListener('pointerout', e => { const t = e.target.closest && e.target.closest('.tile'); if (t && !t.contains(e.relatedTarget)) t.style.transform = ''; });
  }
  function initTrail() {
    if (!fine || reduce) return;
    let last = 0; const em = ['✨', '💖', '💊', '🌸', '⭐'];
    addEventListener('pointermove', e => {
      const now = performance.now(); if (now - last < 55) return; last = now;
      const s = document.createElement('span'); s.className = 'spark'; s.textContent = em[Math.floor(Math.random() * em.length)];
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; document.body.appendChild(s); setTimeout(() => s.remove(), 900);
    }, { passive: true });
  }
  function reveal() {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(e => e.classList.add('in')); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .08 });
    els.forEach((e, i) => { e.style.setProperty('--d', (i % 7) * 70 + 'ms'); io.observe(e); });
  }
  function counters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const to = +el.dataset.count; if (reduce) { el.textContent = to; return; }
      const t0 = performance.now(), dur = 1300;
      (function tick(t) { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e); if (k < 1 && document.body.contains(el)) requestAnimationFrame(tick); })(t0);
    });
  }
  function typewriter(el, phrases) {
    const my = ++twToken; let i = 0, j = 0, del = false;
    if (reduce) { el.textContent = phrases[0]; return; }
    (function step() {
      if (my !== twToken || !document.body.contains(el)) return;
      const full = phrases[i];
      j += del ? -1 : 1; el.textContent = full.slice(0, j);
      let wait = del ? 28 : 70;
      if (!del && j === full.length) { del = true; wait = 1500; }
      else if (del && j === 0) { del = false; i = (i + 1) % phrases.length; wait = 350; }
      setTimeout(step, wait);
    })();
  }
  function afterRender() {
    reveal(); counters();
    const t = document.getElementById('typer');
    if (t) typewriter(t, ['Learn in English ✨', 'తెలుగులో నేర్చుకోండి 🌸', 'हिंदी में सीखें 💜', 'Ace every exam 🏆']);
    else twToken++;
    const m = document.getElementById('app'); m.classList.remove('page-enter'); void m.offsetWidth; m.classList.add('page-enter');
  }
  function init() { initBg(); initTilt(); initTrail(); }
  return { init, confetti, afterRender, reduce };
})();
