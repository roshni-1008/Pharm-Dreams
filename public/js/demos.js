/* PharmDreams animated explainer videos: moving diagrams (SVG) + narration in English, Hindi, Telugu */
"use strict";
const A = {
  mv: (path, dur, inner, o = {}) => `<g><animateMotion path="${path}" dur="${dur}s" begin="${o.begin || 0}s" repeatCount="${o.rep || 'indefinite'}"${o.freeze ? ' fill="freeze"' : ''}${o.kp ? ` keyPoints="${o.kp}" keyTimes="${o.kt}" calcMode="linear"` : ''}/>${inner}</g>`,
  dot: (c, r = 7) => `<circle r="${r}" fill="${c}" stroke="#2b1b5a" stroke-width="2"/>`,
  em: (e, s = 28) => `<text font-size="${s}" text-anchor="middle" dominant-baseline="central">${e}</text>`,
  lbl: (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 16}" font-weight="800" fill="${o.c || '#2b1b5a'}" text-anchor="${o.a || 'middle'}" font-family="DM Sans,Trebuchet MS,sans-serif">${t}</text>`,
  at: (x, y, inner) => `<g transform="translate(${x} ${y})">${inner}</g>`,
  pulse: (inner, v = '1;1.18;1', d = 1.4) => `<g><animateTransform attributeName="transform" type="scale" values="${v}" dur="${d}s" repeatCount="indefinite"/>${inner}</g>`,
  fade: (inner, vals, kt, d) => `<g><animate attributeName="opacity" values="${vals}" keyTimes="${kt}" dur="${d}s" repeatCount="indefinite"/>${inner}</g>`
};
const svg = b => `<svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
const STOMACH = (x = 0, y = 0, s = 1, fill = '#ffd1a8') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M110 120 Q60 130 70 200 Q80 270 160 270 Q250 270 250 190 Q250 130 200 110 Q170 100 150 120 Q130 130 110 120Z" fill="${fill}" stroke="#2b1b5a" stroke-width="4"/></g>`;
const COX = (fill = '#cbb8ff') => `<path d="M250 230 Q240 160 300 150 L330 150 Q345 180 360 150 L390 150 Q440 170 400 240 Q330 280 250 230Z" fill="${fill}" stroke="#2b1b5a" stroke-width="4"/>`;
const ASPIRIN = `<polygon points="-14,-8 0,-16 14,-8 14,8 0,16 -14,8" fill="#fff" stroke="#2b1b5a" stroke-width="3"/><text font-size="11" font-weight="800" fill="#ff5fa2" text-anchor="middle" dominant-baseline="central">A</text>`;
const ELLIPSE = 'M150 180 A170 90 0 1 1 490 180 A170 90 0 1 1 150 180Z';

const ART = {
  /* ---- ADME ---- */
  adme0: () => svg(`
    ${STOMACH()}
    <path d="M430 30 Q480 100 430 170 Q380 240 430 310 Q460 340 430 360" fill="none" stroke="#ff5fa2" stroke-opacity=".3" stroke-width="36" stroke-linecap="round"/>
    <path d="M430 30 Q480 100 430 170 Q380 240 430 310 Q460 340 430 360" fill="none" stroke="#e8325f" stroke-width="12" stroke-linecap="round" stroke-dasharray="2 18"><animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.2s" repeatCount="indefinite"/></path>
    <line x1="325" y1="70" x2="325" y2="300" stroke="#2b1b5a" stroke-opacity=".35" stroke-width="3" stroke-dasharray="6 8"/>
    ${A.mv('M150 10 L150 175', 2.4, A.em('💊', 32))}
    ${[0, .8, 1.6].map(b => A.mv('M215 190 L430 175', 2.4, A.dot('#ffd84d'), { begin: b })).join('')}
    ${A.lbl(160, 305, 'Stomach')}${A.lbl(540, 200, 'Blood')}${A.lbl(325, 56, 'Gut wall', { s: 14 })}`),
  adme1: () => svg(`
    <path d="${ELLIPSE}" fill="none" stroke="#ff5fa2" stroke-opacity=".3" stroke-width="32"/>
    ${[0, 1, 2, 3, 4].map(i => A.mv(ELLIPSE, 8, A.dot('#e8325f', 8), { begin: -i * 1.6 })).join('')}
    ${[-.8, -4.8].map(b => A.mv(ELLIPSE, 8, `<circle r="14" fill="#cbb8ff" stroke="#2b1b5a" stroke-width="2"/><circle cx="11" cy="-10" r="6" fill="#ffd84d" stroke="#2b1b5a" stroke-width="2"/>`, { begin: b })).join('')}
    ${[-2.4, -6.4].map(b => A.mv(ELLIPSE, 8, A.dot('#ffd84d', 6), { begin: b })).join('')}
    <rect x="270" y="14" width="100" height="42" rx="14" fill="#ffd1e8" stroke="#2b1b5a" stroke-width="3"/>${A.lbl(320, 41, 'Brain')}
    <rect x="270" y="304" width="100" height="42" rx="14" fill="#ffe3b8" stroke="#2b1b5a" stroke-width="3"/>${A.lbl(320, 331, 'Muscle')}
    ${A.mv('M320 92 L320 60', 1.6, A.dot('#ffd84d', 6))}${A.mv('M320 268 L320 302', 1.6, A.dot('#ffd84d', 6), { begin: .8 })}
    <circle cx="40" cy="300" r="9" fill="#cbb8ff" stroke="#2b1b5a" stroke-width="2"/><circle cx="46" cy="294" r="4" fill="#ffd84d"/>${A.lbl(60, 305, 'Bound to albumin: stored', { s: 13, a: 'start' })}
    <circle cx="40" cy="330" r="6" fill="#ffd84d" stroke="#2b1b5a" stroke-width="2"/>${A.lbl(60, 335, 'Free drug: active', { s: 13, a: 'start' })}`),
  adme2: () => svg(`
    <path d="M150 150 Q150 90 260 90 L460 100 Q540 110 520 190 Q500 270 380 270 Q300 270 260 240 Q150 230 150 150Z" fill="#ff9f6b" stroke="#2b1b5a" stroke-width="4"/>
    ${A.mv('M30 180 L300 180', 3, A.dot('#ffd84d', 10), {})}
    ${A.mv('M300 180 L620 180', 3, A.dot('#19d3c5', 10), { begin: 3 })}
    <g transform="translate(300 180)"><text font-size="52" text-anchor="middle" dominant-baseline="central">⚙️</text><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" additive="sum"/></g>
    ${A.lbl(300, 235, 'CYP450 enzymes', { s: 15 })}${A.lbl(80, 215, 'Drug')}${A.lbl(560, 215, 'Metabolite')}${A.lbl(400, 130, 'Liver', { s: 20 })}`),
  adme3: () => svg(`
    <path d="M200 100 Q140 115 150 190 Q160 270 230 270 Q268 270 262 228 Q215 205 238 170 Q268 135 246 108 Q228 92 200 100Z" fill="#cbb8ff" stroke="#2b1b5a" stroke-width="4"/>
    <ellipse cx="460" cy="280" rx="64" ry="48" fill="#ffe27a" stroke="#2b1b5a" stroke-width="4"/>
    <path d="M262 195 Q360 190 430 250" fill="none" stroke="#2b1b5a" stroke-opacity=".4" stroke-width="10" stroke-linecap="round"/>
    ${A.mv('M110 20 L190 120', 2.2, A.dot('#e8325f', 7))}
    ${[0, .7, 1.4].map(b => A.mv('M262 195 Q360 190 430 250', 2.1, A.dot('#19d3c5', 7), { begin: b })).join('')}
    ${A.mv('M455 235 L455 300', 1.2, A.em('💧', 18))}
    ${A.lbl(200, 305, 'Kidney')}${A.lbl(460, 345, 'Urine')}${A.lbl(95, 50, 'Blood in', { s: 14 })}`),

  /* ---- Aspirin ---- */
  asp0: () => svg(`
    ${COX()}${A.lbl(320, 215, 'COX enzyme', { s: 17 })}
    ${[0, 1].map(b => A.mv('M60 90 L340 155', 2.4, '<rect x="-8" y="-8" width="16" height="16" rx="3" fill="#4da3ff" stroke="#2b1b5a" stroke-width="2"/>', { begin: b })).join('')}
    ${A.lbl(100, 60, 'Arachidonic acid', { s: 14 })}
    ${[0, 1.2].map(b => A.mv('M400 225 L560 300', 2.4, A.em('⭐', 24), { begin: b })).join('')}
    ${A.lbl(540, 335, 'Prostaglandins', { s: 14 })}
    ${A.at(560, 90, A.pulse(A.em('🤕', 56)))}${A.lbl(560, 140, 'Pain · fever · swelling', { s: 13 })}`),
  asp1: () => svg(`
    ${COX()}${A.lbl(320, 215, 'COX enzyme', { s: 17 })}
    ${A.mv('M70 110 L345 160', 2.6, ASPIRIN, { freeze: true, rep: 1 })}
    ${A.lbl(90, 80, 'Aspirin', { s: 17 })}
    ${A.fade(A.lbl(320, 320, 'Aspirin acetylates COX: the enzyme is blocked', { s: 16, c: '#d1007a' }), '0;0;1;1', '0;.5;.6;1', 4)}`),
  asp2: () => svg(`
    ${COX('#b9b0cc')}<g transform="translate(345 158)">${ASPIRIN}</g>${A.lbl(320, 215, 'COX (blocked)', { s: 17 })}
    ${[0, 1.1].map(b => A.mv('M60 90 L300 140 L60 90', 2.8, '<rect x="-8" y="-8" width="16" height="16" rx="3" fill="#4da3ff" stroke="#2b1b5a" stroke-width="2"/>', { begin: b })).join('')}
    ${A.at(300, 130, A.pulse(A.em('🚫', 30), '1;1.3;1', 1.2))}
    ${A.at(540, 120, A.pulse(A.em('😌', 64)))}
    ${A.lbl(540, 175, 'Less pain · less fever', { s: 14 })}${A.lbl(320, 320, 'Fewer prostaglandins are made', { s: 16, c: '#0e8f85' })}`),
  asp3: () => svg(`
    ${STOMACH(110, 20, 1.05, '#ffe1c8')}
    <path d="M120 150 Q110 120 150 100" fill="none" stroke="#19d3c5" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>
    ${[0, .7, 1.4].map(b => A.mv('M190 40 L250 150', 1.8, A.em('💧', 20), { begin: b })).join('')}
    ${A.at(210, 120, A.pulse(A.em('⚠️', 40), '1;1.25;1', 1))}
    ${A.at(500, 110, A.em('🩸', 48))}${A.lbl(500, 160, 'Gastric bleeding risk', { s: 14 })}
    ${A.lbl(320, 330, 'Fewer protective prostaglandins in the stomach', { s: 15, c: '#d1007a' })}`),

  /* ---- Penicillin ---- */
  pen0: () => svg(`
    <rect x="150" y="110" width="340" height="160" rx="80" fill="#d8f5ee" stroke="#4da3ff" stroke-width="14" stroke-dasharray="22 6"/>
    ${A.at(320, 190, A.em('🦠', 54))}
    ${[0, .8, 1.6].map(b => A.mv('M320 30 L320 98', 1.8, '<rect x="-9" y="-6" width="18" height="12" rx="2" fill="#4da3ff" stroke="#2b1b5a" stroke-width="2"/>', { begin: b })).join('')}
    ${A.at(320, 108, A.pulse(`<circle r="16" fill="#b9a2ff" stroke="#2b1b5a" stroke-width="3"/>${A.lbl(0, 5, 'PBP', { s: 12, c: '#fff' })}`))}
    ${A.lbl(320, 330, 'PBP enzyme joins the wall bricks', { s: 16 })}${A.lbl(120, 70, 'Cell wall', { s: 14 })}`),
  pen1: () => svg(`
    <rect x="150" y="110" width="340" height="160" rx="80" fill="#d8f5ee" stroke="#4da3ff" stroke-width="14" stroke-dasharray="22 6"/>
    ${A.at(320, 190, A.em('🦠', 54))}
    <g transform="translate(320 108)"><circle r="16" fill="#b9a2ff" stroke="#2b1b5a" stroke-width="3"><animate attributeName="fill" values="#b9a2ff;#b9a2ff;#999;#999" keyTimes="0;.45;.6;1" dur="4s" repeatCount="indefinite"/></circle>${A.lbl(0, 5, 'PBP', { s: 12, c: '#fff' })}</g>
    ${A.mv('M70 40 L310 100', 4, `<circle r="14" fill="#ffd84d" stroke="#2b1b5a" stroke-width="3"/><rect x="-7" y="-3" width="14" height="6" fill="#2b1b5a"/>`, { kp: '0;1;1', kt: '0;.45;1' })}
    ${A.lbl(80, 75, 'Penicillin', { s: 16 })}
    ${A.fade(A.at(350, 70, A.em('🚫', 34)), '0;0;1;1', '0;.5;.6;1', 4)}
    ${A.lbl(320, 330, 'Penicillin binds PBP and switches it off', { s: 16, c: '#d1007a' })}`),
  pen2: () => svg(`
    <rect x="150" y="110" width="340" height="160" rx="80" fill="#d8f5ee" stroke="#ff5fa2" stroke-width="14" stroke-dasharray="10 24"/>
    <path d="M230 105 L245 125 L232 140 M410 105 L395 125 L412 142 M200 255 L222 240 L208 225 M440 262 L425 244 L444 232" fill="none" stroke="#e8325f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    ${A.at(320, 190, A.pulse(A.em('🦠', 54), '1;.9;1', 1.2))}
    ${[0, 1, 2].map(b => A.mv('M320 40 L320 100 L360 60', 2.2, '<rect x="-9" y="-6" width="18" height="12" rx="2" fill="#4da3ff" stroke="#2b1b5a" stroke-width="2"/>', { begin: b * .7 })).join('')}
    ${A.lbl(320, 330, 'No cross-links: a weak wall full of cracks', { s: 16, c: '#d1007a' })}`),
  pen3: () => svg(`
    <g transform="translate(320 190)"><g>
      <animateTransform attributeName="transform" type="scale" values="1;1.3;1.38;1" keyTimes="0;.6;.68;1" dur="3.4s" repeatCount="indefinite"/>
      <rect x="-170" y="-80" width="340" height="160" rx="80" fill="#d8f5ee" stroke="#ff5fa2" stroke-width="12" stroke-dasharray="10 24"/>
      ${A.em('🦠', 54)}</g></g>
    ${[[60, 190], [580, 190], [320, 40]].map(([x, y], i) => A.mv(`M${x} ${y} L320 190`, 2.2, A.em('💧', 22), { begin: i * .5 })).join('')}
    ${A.fade(A.at(320, 190, A.em('💥', 120)), '0;0;1;0', '0;.66;.76;1', 3.4)}
    ${A.lbl(320, 335, 'Water rushes in and the bacterium bursts', { s: 16, c: '#d1007a' })}`),

  /* ---- Insulin ---- */
  ins0: () => svg(`
    ${A.at(90, 90, A.pulse(A.em('🍛', 64)))}${A.lbl(90, 140, 'Meal', { s: 15 })}
    <path d="M30 270 L330 270" stroke="#ff5fa2" stroke-opacity=".3" stroke-width="34" stroke-linecap="round"/>
    ${[0, .6, 1.2, 1.8, 2.4].map(b => A.mv('M60 130 L110 255 L310 270', 3, A.dot('#ffd84d', 7), { begin: b })).join('')}
    ${A.lbl(180, 315, 'Glucose enters the blood', { s: 14 })}
    <line x1="400" y1="300" x2="610" y2="300" stroke="#2b1b5a" stroke-width="3"/><line x1="400" y1="300" x2="400" y2="60" stroke="#2b1b5a" stroke-width="3"/>
    <path d="M400 280 Q450 270 490 200 T600 90" fill="none" stroke="#e8325f" stroke-width="7" stroke-linecap="round" stroke-dasharray="400" stroke-dashoffset="400"><animate attributeName="stroke-dashoffset" values="400;0;0" keyTimes="0;.7;1" dur="3.4s" repeatCount="indefinite"/></path>
    ${A.lbl(505, 335, 'Blood sugar rises', { s: 14 })}`),
  ins1: () => svg(`
    <path d="M200 90 Q320 40 450 90 Q480 110 440 130 Q320 100 220 140 Q170 120 200 90Z" fill="#ffe3b8" stroke="#2b1b5a" stroke-width="4"/>
    ${[[260, 100], [320, 90], [380, 98], [430, 108]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#ff9ac4" stroke="#2b1b5a" stroke-width="2"/>`).join('')}
    ${A.lbl(320, 30, 'Pancreas: beta cells', { s: 16 })}
    <path d="M30 290 L610 290" stroke="#ff5fa2" stroke-opacity=".3" stroke-width="36" stroke-linecap="round"/>
    ${[[280, 0], [340, .6], [400, 1.2]].map(([x, b]) => A.mv(`M${x} 125 L${x + 10} 285`, 2.2, A.em('🔑', 24), { begin: b })).join('')}
    ${[0, 1.1, 2.2].map(b => A.mv('M20 290 L620 290', 6, A.dot('#ffd84d', 7), { begin: b })).join('')}
    ${A.lbl(320, 340, 'Insulin (key) is released into the blood', { s: 15, c: '#d1007a' })}`),
  ins2: () => svg(`
    <rect x="300" y="60" width="300" height="240" rx="40" fill="#ffe0ec" stroke="#2b1b5a" stroke-width="4"/>${A.lbl(470, 100, 'Muscle / fat cell', { s: 15 })}
    <line x1="300" y1="120" x2="300" y2="240" stroke="#7c4dff" stroke-width="8"/>
    ${A.mv('M70 150 L275 180', 5, A.em('🔑', 28), { kp: '0;1;1', kt: '0;.35;1' })}
    <g transform="translate(300 180)"><g><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.38;.4;1" dur="5s" repeatCount="indefinite"/>${A.em('🔒', 30)}</g>
      <g><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.38;.4;1" dur="5s" repeatCount="indefinite"/>${A.em('🔓', 30)}</g></g>
    ${[110, 150, 190, 230].map((y, i) => A.mv(`M70 ${y} L300 ${y} L420 ${y}`, 5, A.dot('#ffd84d', 7), { kp: '0;0;1', kt: `0;${.45 + i * .04};1` })).join('')}
    ${A.lbl(150, 80, 'Glucose', { s: 15 })}${A.lbl(320, 335, 'Insulin unlocks the cell. Glucose goes in.', { s: 15, c: '#d1007a' })}`),
  ins3: () => svg(`
    <line x1="40" y1="300" x2="360" y2="300" stroke="#2b1b5a" stroke-width="3"/><line x1="40" y1="300" x2="40" y2="50" stroke="#2b1b5a" stroke-width="3"/>
    <path d="M40 90 Q120 100 170 190 T350 270" fill="none" stroke="#19d3c5" stroke-width="7" stroke-linecap="round" stroke-dasharray="450" stroke-dashoffset="450"><animate attributeName="stroke-dashoffset" values="450;0;0" keyTimes="0;.7;1" dur="3.4s" repeatCount="indefinite"/></path>
    <path d="M40 90 Q150 90 250 100 T350 100" fill="none" stroke="#e8325f" stroke-width="5" stroke-dasharray="10 8" stroke-linecap="round"/>
    ${A.lbl(200, 255, 'Normal', { s: 14, c: '#0e8f85' })}${A.lbl(250, 82, 'Diabetes: stays high', { s: 14, c: '#e8325f' })}
    ${A.at(500, 130, A.pulse(A.em('📉', 60)))}
    ${A.lbl(500, 200, 'Low insulin or', { s: 14 })}${A.lbl(500, 220, 'cells that ignore it', { s: 14 })}
    ${A.lbl(200, 335, 'Blood sugar comes down', { s: 15 })}`)
};

/* generic animated scene for AI lessons: {type, a, b, mover, labelA, labelB} */
function genArt(v) {
  v = v || {};
  const a = v.a || '💊', b = v.b || '🧬', m = v.mover || '✨', ty = v.type || 'move';
  const la = esc(v.labelA || ''), lb = esc(v.labelB || '');
  const labels = `${A.lbl(110, 255, la, { s: 15 })}${A.lbl(530, 255, lb, { s: 15 })}`;
  const sides = `${A.at(110, 180, A.em(a, 64))}${A.at(530, 180, A.em(b, 64))}`;
  const line = '<line x1="170" y1="180" x2="470" y2="180" stroke="#7c4dff" stroke-opacity=".4" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/>';
  switch (ty) {
    case 'block': return svg(`${line}${sides}${labels}${A.mv('M170 180 L360 180 L170 180', 3, A.em(m, 34))}${A.at(405, 180, A.pulse(A.em('🚫', 54)))}`);
    case 'merge': return svg(`${sides}${labels}${A.mv('M150 180 L300 180', 3, A.em(m, 30))}${A.mv('M490 180 L340 180', 3, A.em(m, 30))}${A.fade(A.at(320, 180, A.em('✨', 70)), '0;0;1;0', '0;.65;.8;1', 3)}`);
    case 'grow': return svg(`${A.at(320, 175, `<g><animateTransform attributeName="transform" type="scale" values=".6;1.6;.6" dur="3.2s" repeatCount="indefinite"/>${A.em(a, 70)}</g>`)}${A.at(450, 90, A.pulse(A.em('✨', 34)))}${A.at(200, 100, A.pulse(A.em('✨', 26), '1;1.4;1', 1.8))}${A.lbl(320, 300, la, { s: 16 })}`);
    case 'split': return svg(`${A.at(320, 180, A.em(a, 60))}${A.mv('M320 180 L170 180', 2.6, A.em(a, 48))}${A.mv('M320 180 L470 180', 2.6, A.em(a, 48))}${A.lbl(320, 300, la, { s: 16 })}`);
    case 'cycle': return svg(`<ellipse cx="320" cy="175" rx="130" ry="100" fill="none" stroke="#7c4dff" stroke-opacity=".3" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>${[[a, 0], [m, -2], [b, -4]].map(([e, d]) => A.mv('M190 175 A130 100 0 1 1 450 175 A130 100 0 1 1 190 175Z', 6, A.em(e, 40), { begin: d })).join('')}${A.lbl(320, 320, la, { s: 15 })}`);
    default: return svg(`${line}${sides}${labels}${A.mv('M170 180 L470 180', 2.6, A.em(m, 34))}`);
  }
}

/* ---- the demo videos ---- */
const DEMOS = [
  { id: 'adme', cls: 't1', emoji: '💊', blurb: 'From swallowing to leaving the body', title: LESSONS.adme.title,
    scenes: LESSONS.adme.scenes.map((s, i) => ({ art: 'adme' + i, emoji: s.e, t: s.t, x: s.x })) },
  { id: 'aspirin', cls: 't5', emoji: '🤕', blurb: 'Blocking COX to calm pain and fever', title: LESSONS.aspirin.title,
    scenes: LESSONS.aspirin.scenes.map((s, i) => ({ art: 'asp' + i, emoji: s.e, t: s.t, x: s.x })) },
  { id: 'penicillin', cls: 't3', emoji: '🦠', blurb: 'How beta-lactams burst bacteria',
    title: { en: 'How penicillin kills bacteria', hi: 'पेनिसिलिन बैक्टीरिया को कैसे मारती है', te: 'పెనిసిలిన్ బ్యాక్టీరియాను ఎలా చంపుతుంది' },
    scenes: [
      { art: 'pen0', emoji: '🧱', t: { en: 'Building the wall', hi: 'दीवार का निर्माण', te: 'గోడ నిర్మాణం' },
        x: { en: 'Bacteria are protected by a strong cell wall. An enzyme called PBP, or penicillin-binding protein, joins the wall\'s building blocks together.', hi: 'बैक्टीरिया एक मज़बूत कोशिका भित्ति से सुरक्षित रहते हैं। PBP यानी पेनिसिलिन-बाइंडिंग प्रोटीन नाम का एंजाइम इस दीवार की ईंटों को आपस में जोड़ता है।', te: 'బ్యాక్టీరియాను బలమైన కణ గోడ రక్షిస్తుంది. PBP అంటే పెనిసిలిన్-బైండింగ్ ప్రోటీన్ అనే ఎంజైమ్ ఈ గోడ ఇటుకలను కలుపుతుంది.' } },
      { art: 'pen1', emoji: '💊', t: { en: 'Penicillin arrives', hi: 'पेनिसिलिन पहुँचती है', te: 'పెనిసిలిన్ వస్తుంది' },
        x: { en: 'Penicillin, a beta-lactam antibiotic, binds to the PBP enzyme and switches it off.', hi: 'बीटा-लैक्टम एंटीबायोटिक पेनिसिलिन PBP एंजाइम से जुड़कर उसे बंद कर देती है।', te: 'బీటా-లాక్టమ్ యాంటీబయాటిక్ అయిన పెనిసిలిన్ PBP ఎంజైమ్‌కు అతుక్కుని దాన్ని ఆపేస్తుంది.' } },
      { art: 'pen2', emoji: '💔', t: { en: 'The wall weakens', hi: 'दीवार कमज़ोर होती है', te: 'గోడ బలహీనపడుతుంది' },
        x: { en: 'Without cross-links, the wall cannot be built or repaired. The new wall becomes weak and full of cracks.', hi: 'क्रॉस-लिंक न बनने से दीवार का निर्माण या मरम्मत नहीं हो पाती। नई दीवार कमज़ोर हो जाती है और उसमें दरारें पड़ जाती हैं।', te: 'క్రాస్-లింక్‌లు ఏర్పడకపోవడంతో గోడను నిర్మించడం, బాగుచేయడం సాధ్యం కాదు. కొత్త గోడ బలహీనంగా మారి పగుళ్లు వస్తాయి.' } },
      { art: 'pen3', emoji: '💥', t: { en: 'The bacterium bursts', hi: 'बैक्टीरिया फट जाता है', te: 'బ్యాక్టీరియా పగిలిపోతుంది' },
        x: { en: 'Water rushes in, the weak cell swells, and the bacterium bursts. That is why penicillins are bactericidal.', hi: 'पानी अंदर घुसता है, कमज़ोर कोशिका फूलती है और बैक्टीरिया फट जाता है। इसीलिए पेनिसिलिन जीवाणुनाशक होती हैं।', te: 'నీరు లోపలికి దూసుకువచ్చి బలహీన కణం ఉబ్బి బ్యాక్టీరియా పగిలిపోతుంది. అందుకే పెనిసిలిన్లు బ్యాక్టీరియాను చంపుతాయి.' } }
    ] },
  { id: 'insulin', cls: 't4', emoji: '🔑', blurb: 'The key that lets sugar into cells',
    title: { en: 'Insulin and blood sugar', hi: 'इंसुलिन और ब्लड शुगर', te: 'ఇన్సులిన్, రక్తంలో చక్కెర' },
    scenes: [
      { art: 'ins0', emoji: '🍛', t: { en: 'After a meal', hi: 'खाने के बाद', te: 'భోజనం తర్వాత' },
        x: { en: 'After you eat, food is broken down and glucose enters the blood, so blood sugar rises.', hi: 'खाना खाने के बाद भोजन टूटकर ग्लूकोज़ में बदलता है और खून में पहुँचता है, इसलिए ब्लड शुगर बढ़ जाती है।', te: 'భోజనం చేసిన తర్వాత ఆహారం విచ్ఛిన్నమై గ్లూకోజ్ రక్తంలోకి చేరుతుంది, అందువల్ల రక్తంలో చక్కెర పెరుగుతుంది.' } },
      { art: 'ins1', emoji: '🥜', t: { en: 'Insulin is released', hi: 'इंसुलिन निकलता है', te: 'ఇన్సులిన్ విడుదలవుతుంది' },
        x: { en: 'Beta cells in the pancreas sense the high glucose and release insulin into the blood.', hi: 'अग्न्याशय की बीटा कोशिकाएँ ज़्यादा ग्लूकोज़ को पहचानकर खून में इंसुलिन छोड़ती हैं।', te: 'క్లోమంలోని బీటా కణాలు గ్లూకోజ్ ఎక్కువగా ఉందని గుర్తించి రక్తంలోకి ఇన్సులిన్‌ను విడుదల చేస్తాయి.' } },
      { art: 'ins2', emoji: '🔑', t: { en: 'The key opens the door', hi: 'चाबी से खुलता है दरवाज़ा', te: 'తాళానికి తాళం చెవి' },
        x: { en: 'Insulin binds to receptors on muscle and fat cells, like a key in a lock. This opens the way for glucose to enter the cells.', hi: 'इंसुलिन मांसपेशियों और वसा की कोशिकाओं के रिसेप्टर से ताले में चाबी की तरह जुड़ता है। इससे ग्लूकोज़ के कोशिका में जाने का रास्ता खुल जाता है।', te: 'ఇన్సులిన్ కండరాలు, కొవ్వు కణాలపై ఉన్న గ్రాహకాలకు తాళంలో తాళం చెవిలా అతుక్కుంటుంది. దాంతో గ్లూకోజ్ కణాల్లోకి వెళ్లే దారి తెరుచుకుంటుంది.' } },
      { art: 'ins3', emoji: '📉', t: { en: 'Sugar comes down', hi: 'शुगर कम होती है', te: 'చక్కెర తగ్గుతుంది' },
        x: { en: 'Glucose moves from the blood into cells, so blood sugar falls. In diabetes, insulin is missing or the cells do not respond well, and sugar stays high.', hi: 'ग्लूकोज़ खून से कोशिकाओं में चला जाता है, इसलिए ब्लड शुगर घटती है। डायबिटीज़ में इंसुलिन कम होता है या कोशिकाएँ ठीक से जवाब नहीं देतीं, और शुगर ऊँची रहती है।', te: 'గ్లూకోజ్ రక్తం నుండి కణాల్లోకి వెళ్లడంతో రక్తంలో చక్కెర తగ్గుతుంది. మధుమేహంలో ఇన్సులిన్ తక్కువగా ఉంటుంది లేదా కణాలు సరిగా స్పందించవు, అందుకే చక్కెర ఎక్కువగా ఉంటుంది.' } }
    ] }
];
const demoById = id => DEMOS.find(d => d.id === id) || DEMOS[0];
const demoSpec = id => { const d = demoById(id); return { id: d.id, title: d.title, scenes: d.scenes, multi: true }; };
