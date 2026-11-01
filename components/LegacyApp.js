'use client';

import { useEffect } from 'react';

// The site engine (pages, video player, quizzes) lives in /public/js and is loaded in this order.
const SCRIPTS = ['data', 'fx', 'core', 'demos', 'video', 'pages'].map((n) => `/js/${n}.js`);

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load ' + src));
    document.body.appendChild(s);
  });
}

export default function LegacyApp() {
  useEffect(() => {
    if (window.__pdBooted) return;
    window.__pdBooted = true;
    (async () => {
      for (const src of SCRIPTS) await loadScript(src);
    })().catch((err) => {
      console.error(err);
      window.__pdBooted = false;
    });
  }, []);

  return (
    <>
      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <canvas id="fx-bg" aria-hidden="true" />
      <canvas id="fx-confetti" aria-hidden="true" />

      <header className="top">
        <a className="logo" href="#/home">
          <b>💊</b> PharmDreams
        </a>
        <nav id="nav" aria-label="Main" suppressHydrationWarning />
        <div id="userbox" suppressHydrationWarning />
        <a
          className="iconbtn"
          href="#/settings"
          title="Settings"
          aria-label="Settings"
          style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}
        >
          ⚙️
        </a>
        <button
          className="iconbtn"
          id="themeBtn"
          data-act="theme"
          title="Day / night mode"
          aria-label="Switch day or night mode"
          suppressHydrationWarning
        >
          🌙
        </button>
      </header>

      <main id="app" suppressHydrationWarning />

      
      <footer>
       © 2026 PharmDreams. All rights reserved.
       <br />
        A study aid, not medical advice. Always check with your textbooks,
        teachers and the latest PCI or university syllabus.
      </footer>


      <div id="buddy" aria-live="polite">
        <button id="buddyBtn" data-act="tip" aria-label="Get a study tip from Pilly" suppressHydrationWarning />
        <div id="bubble" role="status" />
      </div>
      <div id="toast" role="status" />
    </>
  );
}
