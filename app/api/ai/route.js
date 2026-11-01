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

  const model = 'gemini-3.8-flash';
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 55000);
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body),
        signal: ctrl.signal
      }
    );
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = String((d.error && d.error.message) || '');
      if (r.status === 429) return reply({ error: 'Many people are using the free AI right now. Wait a minute and try again.' }, 429);
      if (r.status === 400 && /API key/i.test(msg)) return reply({ error: 'The AI key on the server was not accepted.' }, 502);
      if (r.status === 403 || r.status === 401) return reply({ error: 'The AI key on the server was not accepted.' }, 502);
      return reply({ error: msg.replace(key, '') || `The AI service returned an error (${r.status}).` }, 502);
    }
    const text = ((d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || [])
      .map((p) => p.text || '')
      .join('');
    if (!text) return reply({ error: 'The AI could not answer that. Try rewording it.' }, 502);
    return reply({ text });
  } catch (e) {
    const timedOut = e && e.name === 'AbortError';
    return reply({ error: timedOut ? 'The AI took too long. Try a shorter request.' : 'Could not reach the AI service.' }, 504);
  } finally {
    clearTimeout(timer);
  }
}
