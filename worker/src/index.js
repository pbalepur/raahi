/**
 * Raahi Worker — heyraahi.com
 *
 * Handles:
 *   email()  — receives forwarded booking confirmations, parses with Claude, stores in KV
 *   fetch()  — REST API for the Raahi app to read/accept/reject pending bookings
 *
 * KV schema:
 *   trips                         → JSON array of trip objects
 *   pending:{uuid}                → parsed booking awaiting review
 *   accepted:{tripId}:{uuid}      → confirmed booking
 */

import PostalMime from 'postal-mime';

// ─── Email handler ────────────────────────────────────────────────────────────

export default {
  async email(message, env, ctx) {
    try {
      // Parse MIME
      const parser = new PostalMime();
      const email = await parser.parse(message.raw);

      const subject   = email.subject || '(no subject)';
      const emailText = email.text || stripHtml(email.html) || '';

      if (!emailText.trim()) {
        console.log('Empty email body — skipping');
        return;
      }

      // Load trips for date-matching context
      const trips = await getTrips(env);

      // Parse with Claude
      const booking = await parseWithClaude(emailText, subject, trips, env);
      if (!booking) {
        console.warn('Claude could not extract a booking from:', subject);
        return;
      }

      // Store as pending
      const id = crypto.randomUUID();
      await env.RAAHI_KV.put(
        `pending:${id}`,
        JSON.stringify({
          id,
          ...booking,
          receivedAt: new Date().toISOString(),
          fromEmail:  message.from,
          subject,
        }),
        { expirationTtl: 60 * 60 * 24 * 30 } // auto-expire after 30 days
      );

      console.log(`Stored pending booking [${id}]: ${booking.type} — ${booking.name}`);

    } catch (err) {
      console.error('email() handler error:', err);
    }
  },

  // ─── HTTP / REST API ───────────────────────────────────────────────────────

  async fetch(request, env) {
    const url  = new URL(request.url);
    const path = url.pathname;

    const cors = {
      'Access-Control-Allow-Origin':  env.ALLOWED_ORIGIN || 'https://pbalepur.github.io',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Bearer auth
    const auth = request.headers.get('Authorization');
    if (!env.API_SECRET || auth !== `Bearer ${env.API_SECRET}`) {
      return json({ error: 'Unauthorized' }, 401, cors);
    }

    try {
      // GET /api/pending
      if (path === '/api/pending' && request.method === 'GET') {
        const { keys } = await env.RAAHI_KV.list({ prefix: 'pending:' });
        const items = await Promise.all(keys.map(k => env.RAAHI_KV.get(k.name, 'json')));
        return json(items.filter(Boolean), 200, cors);
      }

      // DELETE /api/pending/:id  (reject)
      if (/^\/api\/pending\/[\w-]+$/.test(path) && request.method === 'DELETE') {
        const id = path.split('/').pop();
        await env.RAAHI_KV.delete(`pending:${id}`);
        return json({ ok: true }, 200, cors);
      }

      // POST /api/pending/:id/accept
      if (/^\/api\/pending\/[\w-]+\/accept$/.test(path) && request.method === 'POST') {
        const id      = path.split('/')[3];
        const booking = await env.RAAHI_KV.get(`pending:${id}`, 'json');
        if (!booking) return json({ error: 'Not found' }, 404, cors);

        const tripId = booking.tripId || 'japan-2026';
        await env.RAAHI_KV.put(
          `accepted:${tripId}:${id}`,
          JSON.stringify({ ...booking, acceptedAt: new Date().toISOString() })
        );
        await env.RAAHI_KV.delete(`pending:${id}`);
        return json({ ok: true, booking }, 200, cors);
      }

      // GET /api/accepted/:tripId
      if (/^\/api\/accepted\/[\w-]+$/.test(path) && request.method === 'GET') {
        const tripId      = path.split('/').pop();
        const { keys }    = await env.RAAHI_KV.list({ prefix: `accepted:${tripId}:` });
        const items       = await Promise.all(keys.map(k => env.RAAHI_KV.get(k.name, 'json')));
        return json(items.filter(Boolean), 200, cors);
      }

      // GET /api/trips
      if (path === '/api/trips' && request.method === 'GET') {
        return json(await getTrips(env), 200, cors);
      }

      // POST /api/trips  (sync trip list from app)
      if (path === '/api/trips' && request.method === 'POST') {
        const body = await request.json();
        await env.RAAHI_KV.put('trips', JSON.stringify(body));
        return json({ ok: true }, 200, cors);
      }

      return json({ error: 'Not found' }, 404, cors);

    } catch (err) {
      console.error('fetch() handler error:', err);
      return json({ error: 'Internal server error' }, 500, cors);
    }
  },
};

// ─── Claude parsing ───────────────────────────────────────────────────────────

async function parseWithClaude(emailText, subject, trips, env) {
  const tripsContext = trips
    .map(t => `- ${t.name} (id: ${t.id}): ${t.startDate} → ${t.endDate}${t.places?.length ? ` · ${t.places.join(', ')}` : ''}`)
    .join('\n');

  const prompt = `You are a travel booking confirmation parser. Extract booking details from the email below.

Known trips:
${tripsContext}

Return ONLY a valid JSON object — no markdown fences, no explanation. Fields:
{
  "type":               "hotel" | "flight" | "train" | "activity" | "restaurant" | "transport" | "other",
  "name":               "descriptive name (hotel name, airline + flight number, restaurant, etc.)",
  "confirmationNumber": "booking / confirmation reference, or null",
  "tripId":             "id of the matching trip (match booking dates against trip date ranges), or null",
  "city":               "city this is in, or null",
  "checkIn":            "YYYY-MM-DD — for hotels: check-in; for flights/trains/activities: departure/event date; or null",
  "checkOut":           "YYYY-MM-DD — for hotels: check-out; for flights: arrival date if overnight; else null",
  "time":               "HH:MM (24h) departure or start time, or null",
  "cost":               numeric total cost or null,
  "currency":           "ISO 4217 code (JPY, USD, EUR…) or null",
  "notes":              "any useful extras: seat number, address, airline, platform, etc. — or null",
  "confidence":         "high" | "medium" | "low"
}

Subject: ${subject}

Email body:
${emailText.slice(0, 4000)}`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5',
      max_tokens: 512,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  if (!resp.ok) {
    console.error('Claude API error:', resp.status, await resp.text());
    return null;
  }

  const result = await resp.json();
  const text   = result.content?.[0]?.text || '';

  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch (e) {
    console.error('Failed to parse Claude JSON:', text);
    return null;
  }
}

// ─── KV helpers ───────────────────────────────────────────────────────────────

async function getTrips(env) {
  const stored = await env.RAAHI_KV.get('trips', 'json');
  return stored || defaultTrips();
}

function defaultTrips() {
  return [
    {
      id:        'japan-2026',
      name:      'Japan 2026',
      startDate: '2026-06-09',
      endDate:   '2026-06-23',
      places:    ['Tokyo', 'Mt. Fuji', 'Kyoto', 'Kobe', 'Hiroshima'],
    },
  ];
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
