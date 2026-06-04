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
      const rawText   = email.text || '';
      const emailText = rawText.trim() ? rawText : stripHtml(email.html) || '';

      if (!emailText.trim()) {
        console.log('Empty email body — skipping');
        return;
      }

      // Log first 800 chars of extracted text for debugging parse failures
      console.log(`Email body preview (${emailText.length} chars):\n${emailText.slice(0, 800)}`);

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

      // Send Web Push notification to subscribed devices
      ctx.waitUntil(sendPushNotifications(env));

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

    // Allow both heyraahi.com and the old GitHub Pages URL during transition
    const allowedOrigins = new Set([
      env.ALLOWED_ORIGIN || 'https://heyraahi.com',
      'https://pbalepur.github.io',
      'https://heyraahi.com',
    ]);
    const requestOrigin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin':  allowedOrigins.has(requestOrigin) ? requestOrigin : (env.ALLOWED_ORIGIN || 'https://heyraahi.com'),
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

      // POST /api/push/subscribe  (register a push subscription)
      if (path === '/api/push/subscribe' && request.method === 'POST') {
        const body = await request.json();
        // Body is the PushSubscription object directly: { endpoint, keys: { p256dh, auth } }
        if (!body?.endpoint) return json({ error: 'Invalid subscription' }, 400, cors);
        const subs = await getPushSubscriptions(env);
        if (!subs.some(s => s.endpoint === body.endpoint)) {
          subs.push(body);
          await env.RAAHI_KV.put('pushsubs', JSON.stringify(subs));
        }
        return json({ ok: true }, 200, cors);
      }

      // DELETE /api/push/subscribe  (unregister a push subscription)
      if (path === '/api/push/subscribe' && request.method === 'DELETE') {
        const body = await request.json();
        const subs = await getPushSubscriptions(env);
        const filtered = subs.filter(s => s.endpoint !== body?.endpoint);
        await env.RAAHI_KV.put('pushsubs', JSON.stringify(filtered));
        return json({ ok: true }, 200, cors);
      }

      // GET /api/trip/:id/data  (fetch full trip data)
      if (/^\/api\/trip\/[\w-]+\/data$/.test(path) && request.method === 'GET') {
        const tripId = path.split('/')[3];
        const data = await env.RAAHI_KV.get(`tripdata:${tripId}`, 'json');
        if (!data) return json({ error: 'Not found' }, 404, cors);
        return json(data, 200, cors);
      }

      // PUT /api/trip/:id/data  (save full trip data — requires write token if set)
      if (/^\/api\/trip\/[\w-]+\/data$/.test(path) && request.method === 'PUT') {
        if (env.WRITE_TOKEN) {
          const auth = request.headers.get('Authorization') || '';
          if (auth !== `Bearer ${env.WRITE_TOKEN}`) {
            return json({ error: 'Unauthorized' }, 401, cors);
          }
        }
        const tripId = path.split('/')[3];
        const body = await request.json();
        await env.RAAHI_KV.put(`tripdata:${tripId}`, JSON.stringify(body));
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
  "confirmationNumber": "confirmation/reservation number or null",
  "tripId": "matching trip id or null",
  "city": "city name only (e.g. 'Hiroshima', 'Tokyo') — not the hotel name, not 'Japan'",
  "neighborhood": "district/ward/area within the city (e.g. Ginza, Naka-ku, Gion, Motomachi) or null — look in the address block for ward names ending in -ku or -cho",
  "address": "full street address — look for lines containing a building number, street/ward name, and postal code. In Japanese addresses look for patterns like '6-36 Motomachi' or 'Naka-ku'. Copy the address exactly as it appears, or null if not present",
  "room": "room type or number if mentioned (e.g. Deluxe King, Room 812) or null",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "cost": numeric or null,
  "currency": "JPY/USD/EUR/etc or null",
  "notes": "any other useful extras (phone number, loyalty program, special requests) or null",
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
    "departAirport": "IATA code (e.g. SFO)",
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

FOR ACTIVITIES / RESTAURANTS / EVENTS:
{
  "type": "activity|restaurant|event",
  "name": "venue or activity name",
  "confirmationNumber": "reservation number or null",
  "tripId": "matching trip id or null",
  "city": "city or null",
  "neighborhood": "district or area (e.g. Ginza, Gion) or null",
  "address": "full street address or null",
  "activityDate": "YYYY-MM-DD",
  "activityTime": "HH:MM (24h) or null",
  "cost": numeric or null,
  "currency": "JPY/USD/etc or null",
  "notes": "party size, dress code, special notes or null",
  "confidence": "high|medium|low"
}

EXTRACTION TIPS:
- Hotel address: look for lines with building numbers (e.g. "6-36"), ward/district names (-ku, -cho, -machi), or postal codes (7xx-xxxx in Japan). Address is often near "Property Information", "Hotel Address", "Get Directions", or at the bottom before the legal footer.
- Neighborhood: often a ward name like "Naka-ku", "Shinjuku", "Ginza" found in or near the address.
- City: if address says "Hiroshima, Japan" the city is "Hiroshima" — do not include "Japan" or prefecture names.
- Do NOT leave address null if a street address appears anywhere in the email — scan the full text carefully.

Subject: ${subject}

Email body:
${emailText.slice(0, 8000)}`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5',
      max_tokens: 1200,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  if (!resp.ok) {
    console.error('Claude API error:', resp.status, await resp.text());
    return null;
  }

  const result = await resp.json();
  const text   = result.content?.[0]?.text || '';

  // Log Claude's full raw response for diagnosing field extraction
  console.log('Claude raw response:', text.slice(0, 600));

  try {
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;
    if (parsed) console.log(`Parsed: type=${parsed.type} name="${parsed.name}" city="${parsed.city}" neighborhood="${parsed.neighborhood}" address="${parsed.address}"`);
    return parsed;
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
  if (booking.neighborhood)       lines.push(`Area:   ${booking.neighborhood}`);
  if (booking.address)            lines.push(`Addr:   ${booking.address}`);
  if (booking.room)               lines.push(`Room:   ${booking.room}`);
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

// ─── Web Push ─────────────────────────────────────────────────────────────────

async function getPushSubscriptions(env) {
  return (await env.RAAHI_KV.get('pushsubs', 'json')) || [];
}

async function sendPushNotifications(env) {
  if (!env.VAPID_PRIVATE_KEY_JWK || !env.VAPID_PUBLIC_KEY) return;
  const subs = await getPushSubscriptions(env);
  if (!subs.length) return;

  const results = await Promise.allSettled(subs.map(sub => sendPushToSub(sub, env)));

  // Remove expired/gone subscriptions (410 = gone, 404 = not found)
  const active = subs.filter((_, i) => results[i].value !== false);
  if (active.length !== subs.length) {
    await env.RAAHI_KV.put('pushsubs', JSON.stringify(active));
    console.log(`Removed ${subs.length - active.length} expired push subscription(s)`);
  }
}

async function sendPushToSub(subscription, env) {
  try {
    const jwt = await buildVapidJwt(subscription.endpoint, env);
    const res = await fetch(subscription.endpoint, {
      method:  'POST',
      headers: {
        'Authorization': `vapid t=${jwt},k=${env.VAPID_PUBLIC_KEY}`,
        'TTL':            '86400',
        'Content-Length': '0',
      },
    });
    if (res.status === 410 || res.status === 404) return false; // expired
    if (!res.ok) console.warn('Push failed:', res.status, subscription.endpoint);
    return true;
  } catch (e) {
    console.error('Push send error:', e.message);
    return true; // network error — keep subscription
  }
}

async function buildVapidJwt(endpoint, env) {
  const { protocol, hostname } = new URL(endpoint);
  const audience = `${protocol}//${hostname}`;
  const now      = Math.floor(Date.now() / 1000);

  const header  = toBase64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const payload = toBase64url(JSON.stringify({
    aud: audience,
    exp: now + 43200,   // 12 hours
    sub: env.VAPID_SUBJECT || 'mailto:bookings@heyraahi.com',
  }));
  const unsigned = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    'jwk',
    JSON.parse(env.VAPID_PRIVATE_KEY_JWK),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const sigBuf = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(unsigned)
  );

  return `${unsigned}.${bufToBase64url(new Uint8Array(sigBuf))}`;
}

function toBase64url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function bufToBase64url(buf) {
  let binary = '';
  for (const b of buf) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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
    // ── Remove entire head section (CSS, meta, fonts — all noise) ──────────
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    // ── Remove non-content blocks ───────────────────────────────────────────
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    // ── Remove base64 images (can be 100kB+, completely useless for parsing) ─
    .replace(/data:[^"';\s]+;base64,[A-Za-z0-9+/=]+/gi, '')
    // ── Block-level elements → newline so table cells / divs stay separate ──
    .replace(/<\/?(div|p|tr|li|h[1-6]|blockquote|section|article|header|footer|main)[^>]*>/gi, '\n')
    .replace(/<\/?(td|th)[^>]*>/gi, ' | ')
    .replace(/<br\s*\/?>/gi, '\n')
    // ── Strip remaining tags ────────────────────────────────────────────────
    .replace(/<[^>]+>/g, '')
    // ── Decode HTML entities (broad coverage for hotel email formats) ────────
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&bull;|&#8226;/gi, '•')
    .replace(/&mdash;|&#8212;/gi, '—')
    .replace(/&ndash;|&#8211;/gi, '–')
    .replace(/&thinsp;|&#8201;/gi, ' ')
    .replace(/&#(\d+);/g, (_, n) => { try { return String.fromCharCode(parseInt(n)); } catch { return ''; } })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => { try { return String.fromCharCode(parseInt(h, 16)); } catch { return ''; } })
    // ── Clean up whitespace while preserving meaningful newlines ────────────
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
