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
import { EmailMessage } from 'cloudflare:email';

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

      // Send confirmation reply to sender
      try {
        await sendReply(message, booking, env);
        console.log('Reply sent to:', message.from);
      } catch(e) {
        console.error('Reply failed:', e.message, e.stack);
      }

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

Return ONLY a valid JSON object — no markdown fences, no explanation.

The schema depends on the booking type:

FOR HOTELS:
{
  "type": "hotel",
  "name": "hotel name",
  "confirmationNumber": "ref or null",
  "tripId": "matching trip id or null",
  "city": "city or null",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "cost": numeric or null,
  "currency": "JPY/USD/EUR/etc or null",
  "notes": "useful extras (address, room type, etc) or null",
  "confidence": "high|medium|low"
}

FOR FLIGHTS (round-trip or one-way):
{
  "type": "flight",
  "name": "airline name (e.g. United Airlines)",
  "confirmationNumber": "ref or null",
  "tripId": "matching trip id or null",
  "outbound": {
    "flight": "flight number (e.g. UA837)",
    "departAirport": "IATA code (e.g. ORD)",
    "arriveAirport": "IATA code (e.g. NRT)",
    "departDate": "YYYY-MM-DD",
    "departTime": "HH:MM (24h) or empty string",
    "arriveDate": "YYYY-MM-DD",
    "arriveTime": "HH:MM (24h) or empty string"
  },
  "inbound": {
    "flight": "flight number or empty string if one-way",
    "departAirport": "IATA code",
    "arriveAirport": "IATA code",
    "departDate": "YYYY-MM-DD or empty string if one-way",
    "departTime": "HH:MM (24h) or empty string",
    "arriveDate": "YYYY-MM-DD or empty string",
    "arriveTime": "HH:MM (24h) or empty string"
  },
  "cost": numeric or null,
  "currency": "USD/JPY/etc or null",
  "notes": "seat numbers, class, baggage allowance, etc or null",
  "confidence": "high|medium|low"
}

IMPORTANT for flights:
- outbound = the FIRST leg (departing FROM home toward the destination)
- inbound = the RETURN leg (coming back home). If one-way, set all inbound fields to empty strings.
- departAirport and arriveAirport must NEVER be swapped — departAirport is where the plane LEAVES FROM
- Use IATA airport codes (3 letters). If unknown, use the city name.

FOR TRAINS / RAIL:
{
  "type": "train",
  "name": "train name or route (e.g. Shinkansen Tokyo → Kyoto)",
  "confirmationNumber": "ref or null",
  "tripId": "matching trip id or null",
  "transitDate": "YYYY-MM-DD",
  "transitTime": "HH:MM (24h) or empty string",
  "transitFrom": "origin city/station",
  "transitTo": "destination city/station",
  "cost": numeric or null,
  "currency": "JPY/USD/etc or null",
  "notes": "seat, car number, etc or null",
  "confidence": "high|medium|low"
}

FOR ACTIVITIES / RESTAURANTS / OTHER:
{
  "type": "activity|restaurant|other",
  "name": "name",
  "confirmationNumber": "ref or null",
  "tripId": "matching trip id or null",
  "city": "city or null",
  "checkIn": "YYYY-MM-DD (date of event)",
  "checkOut": null,
  "time": "HH:MM (24h) or null",
  "cost": numeric or null,
  "currency": "JPY/USD/etc or null",
  "notes": "address, party size, etc or null",
  "confidence": "high|medium|low"
}

Subject: ${subject}

Email body:
${emailText.slice(0, 5000)}`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5',
      max_tokens: 800,
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

// ─── Reply email ─────────────────────────────────────────────────────────────

async function sendReply(inbound, booking, env) {
  const typeLabel = {
    hotel: 'Hotel', flight: 'Flight', train: 'Train / Rail',
    restaurant: 'Restaurant', activity: 'Activity', other: 'Booking',
  }[booking.type] || 'Booking';

  // Build date/route lines per type
  const lines = [];
  if (booking.type === 'flight') {
    const ob = booking.outbound || {};
    const ib = booking.inbound  || {};
    const hasReturn = !!(ib.departDate);
    if (ob.departDate) {
      const t = ob.departTime ? ` at ${ob.departTime}` : '';
      const a = ob.arriveTime ? `, arrives ${ob.arriveTime}` : '';
      lines.push(`Outbound:  ${ob.departAirport || '?'} -> ${ob.arriveAirport || '?'}   ${ob.departDate}${t}${a}`);
      if (ob.flight) lines.push(`           Flight ${ob.flight}`);
    }
    if (hasReturn && ib.departDate) {
      const t = ib.departTime ? ` at ${ib.departTime}` : '';
      const a = ib.arriveTime ? `, arrives ${ib.arriveTime}` : '';
      lines.push(`Return:    ${ib.departAirport || '?'} -> ${ib.arriveAirport || '?'}   ${ib.departDate}${t}${a}`);
      if (ib.flight) lines.push(`           Flight ${ib.flight}`);
    }
  } else if (booking.type === 'train') {
    if (booking.transitDate) {
      const t = booking.transitTime ? ` at ${booking.transitTime}` : '';
      lines.push(`Route:  ${booking.transitFrom || '?'} -> ${booking.transitTo || '?'}   ${booking.transitDate}${t}`);
    }
  } else {
    if (booking.checkIn) {
      lines.push(`Dates:  ${booking.checkIn}${booking.checkOut ? ' -> ' + booking.checkOut : ''}`);
    }
  }

  if (booking.confirmationNumber) lines.push(`Ref:    ${booking.confirmationNumber}`);
  if (booking.cost)               lines.push(`Cost:   ${booking.currency || ''} ${booking.cost}`.trim());
  if (booking.notes)              lines.push(`Notes:  ${booking.notes}`);

  const lowConf = booking.confidence === 'low'
    ? '\nLow confidence parse -- please double-check the details in Raahi.'
    : '';

  const body = [
    `Raahi received your forwarded confirmation and parsed the following:`,
    ``,
    `Type:  ${typeLabel}`,
    `Name:  ${booking.name || '--'}`,
    ...(lines.length ? ['', ...lines] : []),
    ``,
    `Open Raahi to review and add it to your trip.`,
    lowConf,
    ``,
    `-- Raahi`,
  ].join('\n').replace(/\n{3,}/g, '\n\n');

  const subject = `[Raahi] Parsed: ${(booking.name || typeLabel).replace(/[^\x20-\x7E]/g, '')}`;

  const raw = [
    `From: Raahi <bookings@heyraahi.com>`,
    `To: ${inbound.from}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    ``,
    body,
  ].join('\r\n');

  // Use send_email binding (avoids dependency on Message-ID in forwarded emails)
  const reply = new EmailMessage('bookings@heyraahi.com', inbound.from, raw);
  await env.SEND_EMAIL.send(reply);
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
