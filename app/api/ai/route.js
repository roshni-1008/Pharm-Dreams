// Server-side AI route. The Gemini key is read from the GEMINI_API_KEY environment variable
// (set in Vercel), so it never reaches the browser.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const YT = /^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i;
const hits = new Map(); // best-effort per-IP limiter (resets when the serverless instance restarts)

function limited(ip) {
  const now = Date.now();
  const max = Number(process.env.AI_RATE_PER_MIN || 15);
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET() {
  return reply({ enabled: Boolean(process.env.GEMINI_API_KEY) });
}

function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export async function POST(req) {
  if (!sameOrigin(req)) return reply({ error: 'Request blocked.' }, 403);
  const key = process.env.GEMINI_API_KEY;
  if (!key) return reply({ error: 'NOKEY' }, 503);

  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (limited(ip)) return reply({ error: 'Too many requests. Wait a minute and try again.' }, 429);

  let b;
  try {
    b = await req.json();
  } catch {
    return reply({ error: 'Bad request.' }, 400);
  }

  const prompt = typeof b.prompt === 'string' ? b.prompt : '';
  if (!prompt || prompt.length > 140000) return reply({ error: 'Your request is empty or too long.' }, 400);
  const system = typeof b.system === 'string' ? b.system.slice(0, 4000) : '';
  const history = Array.isArray(b.history) ? b.history.slice(-16) : [];
  const ytUrl = typeof b.ytUrl === 'string' && YT.test(b.ytUrl) ? b.ytUrl : '';
  if (b.ytUrl && !ytUrl) return reply({ error: 'That does not look like a YouTube link.' }, 400);

  const contents = history
    .filter((h) => h && (h.role === 'user' || h.role === 'model') && typeof h.text === 'string')
    .map((h) => ({ role: h.role, parts: [{ text: h.text.slice(0, 20000) }] }));
  const parts = [];
  if (ytUrl) parts.push({ fileData: { fileUri: ytUrl } });
  parts.push({ text: prompt });
  contents.push({ role: 'user', parts });

  const body = { contents };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  if (b.json === true) body.generationConfig = { responseMimeType: 'application/json' };

  // Try the chosen model first. If Google says "high demand" (503/500/429), quickly try the
  // next model in the list so students almost never see an error.
  const first = (process.env.GEMINI_MODEL || 'gemini-3.8-flash').trim();
  const models = [first, 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'].filter(
    (m, i, arr) => m && arr.indexOf(m) === i
  );
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 55000);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let last = { status: 0, msg: '' };
  try {
    for (let i = 0; i < models.length; i++) {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(models[i])}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify(body),
          signal: ctrl.signal
        }
      );
      const d = await r.json().catch(() => ({}));
      if (r.ok) {
        const text = ((d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || [])
          .map((p) => p.text || '')
          .join('');
        if (text) return reply({ text });
        last = { status: 502, msg: 'empty' };
        continue;
      }
      const msg = String((d.error && d.error.message) || '');
      last = { status: r.status, msg };
      if (r.status === 401 || r.status === 403 || (r.status === 400 && /API key/i.test(msg))) {
        return reply({ error: 'The AI key on the server was not accepted.' }, 502);
      }
      if (r.status === 400) return reply({ error: 'The AI could not handle that request. Try rewording it.' }, 502);
      // 404 (model name wrong), 429, 500, 503: try the next model
      if (r.status === 503 || r.status === 500) await wait(400);
    }
    if (last.status === 429 || last.status === 503 || last.status === 500) {
      return reply({ error: 'The AI is very busy right now. Please try again in a minute.' }, 503);
    }
    if (last.msg === 'empty') return reply({ error: 'The AI could not answer that. Try rewording it.' }, 502);
    return reply({ error: `The AI service returned an error (${last.status}).` }, 502);
  } catch (e) {
    const timedOut = e && e.name === 'AbortError';
    return reply({ error: timedOut ? 'The AI took too long. Try a shorter request.' : 'Could not reach the AI service.' }, 504);
  } finally {
    clearTimeout(timer);
  }
}
