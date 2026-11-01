# PharmDreams (Next.js, ready for Vercel)

Animated PharmD videos with voice in English, Hindi and Telugu, quizzes, flashcards, the 5-year
syllabus, free study links, YouTube-to-notes and a chat buddy.

**The AI key lives on the server** (a Vercel environment variable). Friends who open your link are
never asked for a key, and nobody can copy it from the page.

---

## Put it online with Vercel (about 10 minutes)

### 1. Get a free AI key (once)
1. Open https://aistudio.google.com/apikey and sign in with Google.
2. Press **Create API key** and copy it.

### 2. Put the project on GitHub
1. Make a free account at https://github.com and press **New repository** (name it `pharmdreams`).
2. Press **uploading an existing file** and drag in everything from this folder
   (`app`, `components`, `public`, `package.json`, `next.config.mjs`, `.gitignore`, `.env.example`, `README.md`).
   Do NOT upload a file called `.env.local` or a folder called `node_modules`.
3. Press **Commit changes**.

### 3. Deploy on Vercel
1. Go to https://vercel.com, sign in with GitHub, press **Add New... > Project** and pick `pharmdreams`.
2. Vercel detects **Next.js** by itself. Leave the build settings alone.
3. Open **Environment Variables** and add:
   - Name: `GEMINI_API_KEY`   Value: *(your key from step 1)*
4. Press **Deploy**. When it finishes you get a link like `https://pharmdreams.vercel.app`.
5. Send that link to your sister and her friends.

If you add or change an environment variable later, press **Redeploy** (Deployments tab) so it takes effect.

---

## Run it on your own computer first (optional)
1. Install Node.js from https://nodejs.org (the LTS version).
2. In this folder run: `npm install`
3. Copy `.env.example` to `.env.local` and paste your key after `GEMINI_API_KEY=`
4. Run `npm run dev` and open http://localhost:3000

## Optional: Google sign-in
Email sign-up works without any setup. To add the Google button:
1. Go to https://console.cloud.google.com, create a project, open **APIs & Services > Credentials**,
   and create an **OAuth client ID** of type **Web application**.
2. Under **Authorized redirect URIs** add `https://YOUR-SITE.vercel.app/api/auth/callback/google`
   (and `http://localhost:3000/api/auth/callback/google` for local testing).
3. In Vercel add three environment variables, then Redeploy:
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (from step 1)
   - `NEXTAUTH_SECRET` = any long random text (for example 40 random letters and numbers)
The button stays hidden/inactive until all three exist.

## What works without a key
The 4 animated demo videos in 3 languages, quizzes, flashcards, syllabus, free library, exam room.
The chat answers from built-in notes. The key adds: chat with full answers, videos on any topic,
AI quizzes, important questions and YouTube notes.

## Protecting your free key
- The key never reaches the browser. The page talks to `/api/ai`, which calls Google for it.
- Each visitor is limited to 15 AI requests per minute (change with `AI_RATE_PER_MIN`).
- The free Google quota is shared by everyone who uses your link. If many people use it at once they
  will see "wait a minute and try again". Share the link with friends, not publicly.

## Good to know
- Quiz streaks, saved links and email accounts are stored in each person's own browser. They do not
  sync between devices. Google sign-in uses the same local storage for progress.
- Videos play inside the website (they are not MP4 files). To keep one, screen-record it.
- Hindi and Telugu voices depend on the phone having those voices installed. Captions always show.
- This is a study aid, not medical advice. Check the syllabus against your university's latest one.

## Where things are
- `app/` the Next.js pages and the two API routes (`app/api/ai`, `app/api/auth`)
- `components/LegacyApp.js` page shell that loads the site engine
- `public/js/` the site: `data.js` (syllabus, quiz questions, links), `demos.js` (animated videos),
  `video.js` (player), `pages.js` (all pages), `core.js`, `fx.js`
- `app/globals.css` all styling
