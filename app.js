/* ============================================================
   Raahi — Japan 2026 Travel Itinerary
   Data sourced from PDF itinerary + Google Sheet attractions
   ============================================================ */

// ── City theme config ──
const CITIES = {
  transit:    { name: 'In Transit',  color: '#78716c', bg: '#f5f0e8', emoji: '✈️' },
  tokyo:      { name: 'Tokyo',      color: '#1e3a5f', bg: '#e8eef5', emoji: '🗼' },
  fuji:       { name: 'Mt. Fuji',   color: '#4d7c0f', bg: '#f0f5e8', emoji: '🗻' },
  kyoto:      { name: 'Kyoto',      color: '#c53d2d', bg: '#fef2f0', emoji: '⛩️' },
  kobe:       { name: 'Kobe',       color: '#b8860b', bg: '#fdf6e3', emoji: '🌉' },
  hiroshima:  { name: 'Hiroshima',  color: '#0d6e6e', bg: '#e6f5f5', emoji: '🕊️' },
  home:       { name: 'Home',       color: '#78716c', bg: '#f5f0e8', emoji: '🏠' },
};

// ── Route overview data ──
const ROUTE = [
  { city: 'Tokyo',     dates: 'Jun 10–14', nights: 4, key: 'tokyo' },
  { city: 'Mt. Fuji',  dates: 'Jun 14–15', nights: 1, key: 'fuji' },
  { city: 'Kyoto',     dates: 'Jun 15–17', nights: 2, key: 'kyoto' },
  { city: 'Kobe',      dates: 'Jun 17–19', nights: 2, key: 'kobe' },
  { city: 'Hiroshima', dates: 'Jun 19–22', nights: 3, key: 'hiroshima' },
  { city: 'Tokyo',     dates: 'Jun 22–23', nights: 1, key: 'tokyo' },
];

// ── Day-by-day itinerary (merged PDF + Google Sheet) ──
const DAYS = [
  {
    date: '2026-06-09', dayNum: 1,
    title: 'Departure Day',
    cityKey: 'transit',
    hotel: null,
    transport: [
      'UA 837: SFO → NRT',
      'Depart 12:20 PM PDT',
      'Arrive Jun 10, 2:55 PM JST',
      'Confirmation: HC68FX',
      'Boeing 777-300ER · United Polaris',
    ],
    attractions: ['Travel day — settle packing, airport timing'],
    events: [],
    links: [{ label: 'United', url: 'https://www.united.com/en/us/manageres/mytrips' }],
  },
  {
    date: '2026-06-10', dayNum: 2,
    title: 'Arrive in Japan',
    cityKey: 'tokyo',
    hotel: {
      name: 'Aloft by Marriott Tokyo Ginza',
      conf: '73477725',
      checkin: '3:00 PM', checkout: '12:00 PM',
      room: 'Guest Room, 1 King',
      address: '6-14-3 Ginza, Chuo-ku, Tokyo',
      points: '113,000 redeemed',
    },
    transport: ['UA 837 arrives NRT 2:55 PM', 'Airport transfer to Ginza'],
    attractions: [
      'Easy arrival meal',
      'Neighborhood walk near hotel',
      'Ikebukuro dining (department stores, ramen, themed cafes)',
    ],
    events: [],
    links: [
      { label: 'Marriott', url: 'https://www.marriott.com/en-us/hotels/tyoal-aloft-tokyo-ginza/overview/' },
    ],
  },
  {
    date: '2026-06-11', dayNum: 3,
    title: 'Tokyo Day',
    cityKey: 'tokyo',
    hotel: { name: 'Aloft by Marriott Tokyo Ginza', conf: '73477725', room: 'Guest Room, 1 King' },
    transport: [],
    attractions: [
      'Nijubashi Bridge (Imperial Palace)',
      'Tokyo Station & Marunouchi',
      'Hibiya Park',
      'Kabukiza Theatre',
      'Tsukiji Outer Market',
      'Ginza district',
      'Meiji Shrine',
      'Harajuku (Takeshita Street, Omotesando)',
    ],
    events: [
      'Tokyo Skytree',
      'Asakusa (Senso-ji Temple, Nakamise Street)',
    ],
    links: [],
  },
  {
    date: '2026-06-12', dayNum: 4,
    title: 'Tokyo — Hotel Switch',
    cityKey: 'tokyo',
    hotel: {
      name: 'Hotel Toranomon Hills',
      conf: '9092720951162',
      checkin: '3:00 PM', checkout: '12:00 PM',
      room: 'Tower View, Shower, 1 King Bed',
      address: '2-6-4 Toranomon, Tokyo',
      cost: '$862.20',
      note: 'Aloft checkout 12 PM → Toranomon check-in 3 PM',
    },
    transport: ['Move bags: Ginza → Toranomon'],
    attractions: [
      'Tokyo Skytree',
      'Asakusa',
      'Kappabashi Kitchen Town',
      'Harajuku & Meiji Shrine (if not yet visited)',
    ],
    events: [],
    links: [
      { label: 'Hyatt', url: 'https://www.hyatt.com/unbound-collection/en-US/tyoub-hotel-toranomon-hills' },
    ],
  },
  {
    date: '2026-06-13', dayNum: 5,
    title: 'Tokyo Day',
    cityKey: 'tokyo',
    hotel: { name: 'Hotel Toranomon Hills', conf: '9092720951162', room: 'Tower View, 1 King' },
    transport: [],
    attractions: [
      'Kawagoe — Little Edo',
      'Kurazukuri historic district',
      'Toki no Kane bell tower',
    ],
    events: [
      'SWE/SSO concert at Beethoven Hall (Musashino Academia Musicae)',
      'Ikebukuro Global Ring performance',
    ],
    links: [],
  },
  {
    date: '2026-06-14', dayNum: 6,
    title: 'Leave for Mt. Fuji',
    cityKey: 'fuji',
    hotel: {
      name: 'UBUYA',
      conf: 'T790A13DD9795',
      checkin: '3:00 PM', checkout: '11:00 AM',
      room: 'Deluxe Room with Open-Air Bath, 90sqm, Mt. Fuji View',
      address: '10 Asakawa, Fujikawaguchiko-cho',
      cost: '$750.59 (non-refundable)',
      note: 'Toranomon checkout 12 PM',
    },
    transport: ['Tokyo → Fujikawaguchiko', 'Train or bus via Otsuki'],
    attractions: [
      'Mt. Fuji Fifth Station',
      'Lake Kawaguchi viewpoints',
      'Ryokan-style slow evening with onsen',
    ],
    events: [
      'Stellar Theater — Mt. Fuji Music Festival',
    ],
    links: [
      { label: 'UBUYA', url: 'https://www.ubuya.co.jp/en/' },
    ],
  },
  {
    date: '2026-06-15', dayNum: 7,
    title: 'Leave for Kyoto',
    cityKey: 'kyoto',
    hotel: {
      name: 'Ace Hotel Kyoto',
      conf: '9146SG486666',
      checkin: '3:00 PM', checkout: '12:00 PM',
      room: 'Standard King',
      address: '245-2 Kurumaya-cho, Nakagyo-ku, Kyoto',
      cost: '$660.61',
      note: 'UBUYA checkout 11 AM',
    },
    transport: ['Mt. Fuji area → Kyoto', 'Rail route (seat details pending)'],
    attractions: [
      'Hakone-En (Lake Ashi, Komagatake Ropeway)',
      'Kawaguchiko Music Forest Museum',
      'Oshino Hakkai',
      'Arrival stroll in Kyoto',
      'First Kyoto dinner',
    ],
    events: [],
    links: [
      { label: 'Ace Hotel', url: 'https://acehotel.com/kyoto/' },
    ],
  },
  {
    date: '2026-06-16', dayNum: 8,
    title: 'Kyoto Day',
    cityKey: 'kyoto',
    hotel: { name: 'Ace Hotel Kyoto', conf: '9146SG486666', room: 'Standard King' },
    transport: [],
    attractions: [
      'Kinkaku-ji (Golden Pavilion)',
      'Kiyomizu-dera',
      'Nijo Castle',
      'Sanjusangen-do',
      'Gion district',
      'Arashiyama Bamboo Grove (PM)',
    ],
    events: [],
    links: [],
  },
  {
    date: '2026-06-17', dayNum: 9,
    title: 'Leave for Kobe',
    cityKey: 'kobe',
    hotel: {
      name: 'ANA Crowne Plaza Kobe',
      conf: '2462970815',
      checkin: '3:00 PM', checkout: '11:00 AM',
      room: 'Premium Room, 1 King Bed, City View',
      address: '1-Chome, Kitano-cho, Chuo-ku, Kobe',
      cost: '$246.40',
      note: 'Ace Kyoto checkout 12 PM',
    },
    transport: ['Kyoto → Kobe', 'Train (seat details pending)'],
    attractions: [
      'Fushimi Inari Taisha (morning, en route)',
      'Fushimi Sake District',
      'Arashiyama Bamboo Forest (if not covered Day 8)',
    ],
    events: [
      'SWE/SSO Friendship Concert at Akashi Civic Hall (with Takigawa Daini HS)',
    ],
    links: [
      { label: 'IHG', url: 'https://www.ihg.com/crowneplaza/hotels/us/en/hyogo/osakb/hoteldetail' },
    ],
  },
  {
    date: '2026-06-18', dayNum: 10,
    title: 'Kobe Day',
    cityKey: 'kobe',
    hotel: { name: 'ANA Crowne Plaza Kobe', conf: '2462970815', room: 'Premium Room, 1 King, City View' },
    transport: [],
    attractions: [
      'Kobe Chinatown (Nankinmachi)',
      'Kobe Harborland',
      'Meriken Park & Port Tower',
      'Optional: Zen experience or Awaji Island day trip',
    ],
    events: [],
    links: [],
  },
  {
    date: '2026-06-19', dayNum: 11,
    title: 'Leave for Hiroshima',
    cityKey: 'hiroshima',
    hotel: {
      name: 'Hilton Hiroshima',
      conf: '3465440877',
      checkin: '3:00 PM', checkout: '12:00 PM',
      room: 'King Premium Room',
      address: '11-12 Fujimicho, Naka-ku, Hiroshima',
      points: '177,000 total',
      note: 'ANA Kobe checkout 11 AM',
    },
    transport: ['Kobe → Hiroshima', 'Shinkansen (seat details pending)'],
    attractions: [
      'Hiroshima Peace Memorial Park',
      'Atomic Bomb Dome (UNESCO)',
      'Hiroshima Station area (ekie, minamoa)',
    ],
    events: [],
    links: [
      { label: 'Hilton', url: 'https://www.hilton.com/en/hotels/hijshhi-hilton-hiroshima/' },
    ],
  },
  {
    date: '2026-06-20', dayNum: 12,
    title: 'Hiroshima Day',
    cityKey: 'hiroshima',
    hotel: { name: 'Hilton Hiroshima', conf: '3465440877', room: 'King Premium Room' },
    transport: [],
    attractions: [
      'Peace Memorial area deeper visit',
      'Food hall or okonomiyaki plan',
    ],
    events: [
      'SWE/SSO Peace Friendship Concert at Phoenix Concert Hall',
      'Choir performance at Jogakuin Girls HS',
    ],
    links: [],
  },
  {
    date: '2026-06-21', dayNum: 13,
    title: 'Hiroshima — Miyajima',
    cityKey: 'hiroshima',
    hotel: { name: 'Hilton Hiroshima', conf: '3465440877', room: 'King Premium Room' },
    transport: [],
    attractions: [
      'Miyajima Island (Itsukushima Shrine)',
      'Floating torii gate',
      'Keep tides & weather in mind for best views',
    ],
    events: [
      'Hijiyama HS cultural exchange (music, paper crane making)',
    ],
    links: [],
  },
  {
    date: '2026-06-22', dayNum: 14,
    title: 'Return to Tokyo',
    cityKey: 'tokyo',
    hotel: { name: 'Tokyo overnight (details pending)' },
    transport: ['Hiroshima → Tokyo', 'Shinkansen — long rail day (seat details pending)'],
    attractions: [
      'Tokyo Dome — professional baseball game',
      'Final Tokyo evening',
    ],
    events: [],
    links: [],
  },
  {
    date: '2026-06-23', dayNum: 15,
    title: 'Fly Home',
    cityKey: 'home',
    hotel: null,
    transport: [
      'UA 838: NRT → SFO',
      'Depart 5:25 PM JST',
      'Arrive 11:00 AM PDT (same day)',
      'Confirmation: HC68FX',
      'Boeing 777-300ER · United Polaris',
    ],
    attractions: ['Airport transfer buffer', 'Home arrival'],
    events: [],
    links: [{ label: 'United', url: 'https://www.united.com/en/us/manageres/mytrips' }],
  },
];

// ── Bookings ──
const BOOKINGS = [
  {
    type: 'Flight', icon: 'plane',
    title: 'United SFO ↔ NRT',
    colorKey: 'transit',
    details: [
      ['Confirmation', 'HC68FX'],
      ['Outbound', 'UA 837 · Jun 9, 12:20 PM PDT'],
      ['Arrival', 'Jun 10, 2:55 PM JST'],
      ['Return', 'UA 838 · Jun 23, 5:25 PM JST'],
      ['Home', 'Jun 23, 11:00 AM PDT'],
      ['Aircraft', 'Boeing 777-300ER'],
      ['Class', 'United Polaris'],
      ['Cost', '805,400 miles + $101.06'],
    ],
    url: 'https://www.united.com/en/us/manageres/mytrips',
  },
  {
    type: 'Hotel · Tokyo', icon: 'hotel',
    title: 'Aloft by Marriott Tokyo Ginza',
    colorKey: 'tokyo',
    details: [
      ['Confirmation', '73477725'],
      ['Dates', 'Jun 10–12 (2 nights)'],
      ['Check in/out', '3:00 PM / 12:00 PM'],
      ['Room', 'Guest Room, 1 King'],
      ['Address', '6-14-3 Ginza, Chuo-ku, Tokyo'],
      ['Phone', '+81-3-6278-8122'],
      ['Cost', '113,000 Marriott points'],
    ],
    url: 'https://www.marriott.com/en-us/hotels/tyoal-aloft-tokyo-ginza/overview/',
  },
  {
    type: 'Hotel · Tokyo', icon: 'hotel',
    title: 'Hotel Toranomon Hills',
    colorKey: 'tokyo',
    details: [
      ['Confirmation', '9092720951162'],
      ['Dates', 'Jun 12–14 (2 nights)'],
      ['Check in/out', '3:00 PM / 12:00 PM'],
      ['Room', 'Tower View, Shower, 1 King Bed'],
      ['Address', '2-6-4 Toranomon, Tokyo'],
      ['Phone', '+81-3-6834-5678'],
      ['Cost', '$862.20'],
    ],
    url: 'https://www.hyatt.com/unbound-collection/en-US/tyoub-hotel-toranomon-hills',
  },
  {
    type: 'Hotel · Mt. Fuji', icon: 'hotel',
    title: 'UBUYA',
    colorKey: 'fuji',
    details: [
      ['Confirmation', 'T790A13DD9795'],
      ['Dates', 'Jun 14–15 (1 night)'],
      ['Check in/out', '3:00 PM / 11:00 AM'],
      ['Room', 'Deluxe, Open-Air Bath, 90sqm, Mt. Fuji View'],
      ['Address', '10 Asakawa, Fujikawaguchiko-cho'],
      ['Phone', '0555-72-1145'],
      ['Cost', '$750.59 (non-refundable)'],
    ],
    url: 'https://www.ubuya.co.jp/en/',
  },
  {
    type: 'Hotel · Kyoto', icon: 'hotel',
    title: 'Ace Hotel Kyoto',
    colorKey: 'kyoto',
    details: [
      ['Confirmation', '9146SG486666'],
      ['Dates', 'Jun 15–17 (2 nights)'],
      ['Check in/out', '3:00 PM / 12:00 PM'],
      ['Room', 'Standard King'],
      ['Address', '245-2 Kurumaya-cho, Nakagyo-ku, Kyoto'],
      ['Cost', '$660.61'],
    ],
    url: 'https://acehotel.com/kyoto/',
  },
  {
    type: 'Hotel · Kobe', icon: 'hotel',
    title: 'ANA Crowne Plaza Kobe',
    colorKey: 'kobe',
    details: [
      ['Confirmation', '2462970815'],
      ['Dates', 'Jun 17–19 (2 nights)'],
      ['Check in/out', '3:00 PM / 11:00 AM'],
      ['Room', 'Premium Room, 1 King Bed, City View'],
      ['Address', '1-Chome, Kitano-cho, Chuo-ku, Kobe'],
      ['Cost', '$246.40'],
    ],
    url: 'https://www.ihg.com/crowneplaza/hotels/us/en/hyogo/osakb/hoteldetail',
  },
  {
    type: 'Hotel · Hiroshima', icon: 'hotel',
    title: 'Hilton Hiroshima',
    colorKey: 'hiroshima',
    details: [
      ['Confirmation', '3465440877'],
      ['Dates', 'Jun 19–22 (3 nights)'],
      ['Check in/out', '3:00 PM / 12:00 PM'],
      ['Room', 'King Premium Room'],
      ['Address', '11-12 Fujimicho, Naka-ku, Hiroshima'],
      ['Phone', '+81-82-243-2700'],
      ['Cost', '177,000 Hilton points'],
    ],
    url: 'https://www.hilton.com/en/hotels/hijshhi-hilton-hiroshima/',
  },
  {
    type: 'Rail Transfers', icon: 'train',
    title: 'Intercity Trains',
    colorKey: 'transit',
    details: [
      ['Jun 14', 'Tokyo → Fujikawaguchiko'],
      ['Jun 15', 'Mt. Fuji area → Kyoto'],
      ['Jun 17', 'Kyoto → Kobe'],
      ['Jun 19', 'Kobe → Hiroshima (Shinkansen)'],
      ['Jun 22', 'Hiroshima → Tokyo (Shinkansen)'],
    ],
    url: 'https://www.google.com/maps/dir/Tokyo/Mount+Fuji/Kyoto/Kobe/Hiroshima/Tokyo',
  },
];

// ── DOM refs ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dayList      = $('#day-list');
const bookingGrid  = $('#booking-grid');
const addForm      = $('#add-form');
const addDay       = $('#add-day');
const askForm      = $('#ask-form');
const askInput     = $('#ask-input');
const askAnswer    = $('#ask-answer');
const notifyBtn    = $('#notify-btn');
const notifyStatus = $('#notify-status');
const countdownEl  = $('#countdown');
const stickyNav    = $('#sticky-nav');

// ── Formatters ──
const fmtDate  = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const fmtDay   = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat('en-US', { month: 'short' });
const fmtWkday = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

function parseDate(str) { return new Date(str + 'T12:00:00'); }

// ── localStorage for custom activities ──
const STORE_KEY = 'japan2026_custom';
let customActivities = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');

function saveCustom() {
  localStorage.setItem(STORE_KEY, JSON.stringify(customActivities));
}

// ── SVG icons ──
const ICONS = {
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><path d="M8 7h.01M16 7h.01M12 7h.01M12 11h.01M16 11h.01M8 11h.01"/></svg>',
  train: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M9 15h.01M15 15h.01"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
};

// ── Google Maps URL helper ──
function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ', Japan')}`;
}

// ===== RENDER: City Navigation =====
function renderCityNav() {
  const cityNav = $('#city-nav');
  cityNav.innerHTML = ROUTE.map((stop, i) => {
    const c = CITIES[stop.key];
    const dayCount = DAYS.filter(d => d.cityKey === stop.key).length;
    const hotels = [...new Set(
      DAYS.filter(d => d.cityKey === stop.key && d.hotel?.name)
        .map(d => d.hotel.name)
    )];
    const hotelPreview = hotels.length ? hotels[0] : '';

    return `
      <button class="city-card" data-city="${stop.key}" data-idx="${i}" style="--city-color:${c.color}; --city-bg:${c.bg}">
        <span class="city-emoji">${c.emoji}</span>
        <div class="city-card-info">
          <h3>${stop.city}</h3>
          <span class="city-dates">${stop.dates}</span>
          <span class="city-meta">${stop.nights}n · ${dayCount} day${dayCount > 1 ? 's' : ''}</span>
          ${hotelPreview ? `<span class="city-hotel">${hotelPreview}</span>` : ''}
        </div>
        <a class="city-map-link" href="${mapsUrl(stop.city)}" target="_blank" rel="noreferrer" title="Open in Google Maps" onclick="event.stopPropagation()">
          ${ICONS.mapPin}
        </a>
      </button>`;
  }).join('');

  // Click handler: scroll to first day of that city
  cityNav.querySelectorAll('.city-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.closest('.city-map-link')) return;
      const cityKey = btn.dataset.city;
      const firstDayIdx = DAYS.findIndex(d => d.cityKey === cityKey);
      if (firstDayIdx >= 0) {
        // Make sure "all" filter is active
        const allBtn = $('.filter-btn[data-filter="all"]');
        if (allBtn && !allBtn.classList.matches?.('active')) {
          $$('.filter-btn').forEach(b => b.classList.remove('active'));
          allBtn.classList.add('active');
          renderDays('all');
        }
        requestAnimationFrame(() => {
          const cards = $$('.day-card');
          const target = [...cards].find(c => parseInt(c.dataset.idx) === firstDayIdx);
          if (target) {
            target.classList.add('expanded');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    });
  });
}

// ===== RENDER: Day Cards (uniform height, expandable) =====
function renderDays(filter = 'all') {
  dayList.innerHTML = DAYS.map((day, idx) => {
    const d = parseDate(day.date);
    const c = CITIES[day.cityKey] || CITIES.transit;
    const custom = customActivities[idx] || [];

    // Filter logic
    const hasTransport = day.transport && day.transport.length > 0;
    const isFlex = day.attractions.some(a => /flexible|pending|add|buffer|optional|free|open/i.test(a)) || day.attractions.length <= 2;
    const isExplore = day.attractions.length > 2 && !hasTransport;

    if (filter === 'travel' && !hasTransport) return '';
    if (filter === 'explore' && !isExplore && hasTransport) return '';
    if (filter === 'flexible' && !isFlex) return '';

    // Counts
    const actCount = day.attractions.length + day.events.length + custom.length;
    const hotelName = day.hotel?.name || 'In transit';
    const previewItems = [...day.attractions.slice(0, 2)];
    const previewText = previewItems.join(' · ');

    // Build activity list with Google Maps links
    const activitiesHtml = [
      ...day.attractions.map(a => {
        const isGeneric = /travel day|home arrival|airport|buffer|no transfer/i.test(a);
        return isGeneric
          ? `<li>${a}</li>`
          : `<li><a href="${mapsUrl(a)}" target="_blank" rel="noreferrer">${a} <span class="maps-hint">${ICONS.mapPin}</span></a></li>`;
      }),
      ...day.events.map(e =>
        `<li class="event"><a href="${mapsUrl(e)}" target="_blank" rel="noreferrer">${e} <span class="maps-hint">${ICONS.mapPin}</span></a></li>`
      ),
      ...custom.map(c =>
        `<li class="added">${c.title}${c.notes ? ' — ' + c.notes : ''}</li>`
      ),
    ].join('');

    // Hotel section
    const hotelHtml = day.hotel ? `
      <div class="detail-block detail-stay">
        <h4>Stay</h4>
        <p class="detail-primary">${day.hotel.name}</p>
        ${day.hotel.room ? `<p class="detail-secondary">${day.hotel.room}</p>` : ''}
        ${day.hotel.address ? `<p class="detail-secondary"><a href="${mapsUrl(day.hotel.name + ', ' + (day.hotel.address || ''))}" target="_blank" rel="noreferrer">${day.hotel.address} <span class="maps-hint">${ICONS.mapPin}</span></a></p>` : ''}
        ${day.hotel.checkin ? `<p class="detail-secondary">Check-in ${day.hotel.checkin} · Out ${day.hotel.checkout}</p>` : ''}
        ${day.hotel.conf ? `<p class="detail-secondary">Conf: ${day.hotel.conf}</p>` : ''}
        ${day.hotel.note ? `<p class="detail-note">${day.hotel.note}</p>` : ''}
      </div>` : '';

    // Transport section
    const transportHtml = day.transport.length ? `
      <div class="detail-block detail-travel">
        <h4>Travel</h4>
        <ul>${day.transport.map(t => `<li>${t}</li>`).join('')}</ul>
      </div>` : '';

    // Links
    const linksHtml = day.links.map(l =>
      `<a class="day-link" href="${l.url}" target="_blank" rel="noreferrer">${ICONS.arrow} ${l.label}</a>`
    ).join('');

    return `
      <article class="day-card" data-idx="${idx}" data-city="${day.cityKey}" style="--city-color:${c.color}; --city-bg:${c.bg}">
        <div class="day-rail">
          <span class="day-weekday">${fmtWkday.format(d)}</span>
          <span class="day-num">${fmtDay.format(d)}</span>
          <span class="day-month">${fmtMonth.format(d)}</span>
        </div>
        <div class="day-content">
          <div class="day-summary">
            <div class="day-header">
              <h3 class="day-title">${day.title}</h3>
              <span class="day-city-pill" style="background:${c.bg}; color:${c.color}">${c.name}</span>
            </div>
            <div class="day-preview">
              <span class="preview-text">${actCount} activit${actCount !== 1 ? 'ies' : 'y'} · ${hotelName}</span>
              <span class="expand-icon">${ICONS.chevron}</span>
            </div>
          </div>
          <div class="day-details">
            <div class="day-detail-grid">
              <div class="detail-block detail-activities">
                <h4>Activities</h4>
                <ul class="activity-list">${activitiesHtml || '<li class="empty">No activities planned yet</li>'}</ul>
              </div>
              ${hotelHtml}
              ${transportHtml}
            </div>
            <div class="day-links">
              <a class="day-link" href="${mapsUrl(c.name === 'In Transit' || c.name === 'Home' ? 'Tokyo' : c.name)}" target="_blank" rel="noreferrer">${ICONS.pin} ${c.name === 'In Transit' || c.name === 'Home' ? 'Tokyo' : c.name} in Maps</a>
              ${linksHtml}
            </div>
          </div>
        </div>
      </article>`;
  }).join('');

  // Expand/collapse click handlers
  dayList.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      card.classList.toggle('expanded');
    });
  });

  highlightToday();
}

// ===== RENDER: Bookings =====
function renderBookings() {
  bookingGrid.innerHTML = BOOKINGS.map((b) => {
    const c = CITIES[b.colorKey] || CITIES.transit;
    const icon = ICONS[b.icon] || ICONS.hotel;
    return `
      <article class="booking-card" style="--booking-color:${c.color}; --booking-color-bg:${c.bg}">
        <div class="booking-card-header">
          <div class="booking-icon">${icon}</div>
          <div>
            <span class="booking-type">${b.type}</span>
            <h3>${b.title}</h3>
          </div>
        </div>
        <div class="booking-card-body">
          <dl>${b.details.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
        </div>
        <div class="booking-card-footer">
          <a href="${b.url}" target="_blank" rel="noreferrer">View details ${ICONS.arrow}</a>
        </div>
      </article>`;
  }).join('');
}

// ===== RENDER: Day Selector for Quick Add =====
function renderDayOptions() {
  addDay.innerHTML = DAYS.map((day, idx) =>
    `<option value="${idx}">${fmtDate.format(parseDate(day.date))} — ${day.title}</option>`
  ).join('');
}

// ===== TRIP STATUS ENGINE =====
function getTripStatus() {
  const now = new Date();
  const tripStart = new Date('2026-06-09T00:00:00-07:00');
  const tripEnd = new Date('2026-06-24T00:00:00-07:00');

  if (now < tripStart) {
    return { phase: 'before', daysUntil: Math.ceil((tripStart - now) / 86400000) };
  }
  if (now >= tripEnd) {
    return { phase: 'after' };
  }

  const dayIndex = DAYS.findIndex(d => {
    const dayDate = parseDate(d.date);
    const nextDay = new Date(dayDate); nextDay.setDate(nextDay.getDate() + 1);
    return now >= dayDate && now < nextDay;
  });

  return {
    phase: 'during',
    dayIndex: dayIndex >= 0 ? dayIndex : 0,
    dayNum: dayIndex >= 0 ? dayIndex + 1 : 1,
  };
}

// ===== RENDER: Countdown =====
function renderCountdown() {
  const status = getTripStatus();

  if (status.phase === 'before') {
    countdownEl.textContent = `${status.daysUntil} day${status.daysUntil !== 1 ? 's' : ''} until departure`;
  } else if (status.phase === 'during') {
    countdownEl.textContent = `Day ${status.dayNum} of 15 — enjoy the trip!`;
    countdownEl.style.background = 'rgba(77,124,15,.25)';
  } else {
    countdownEl.textContent = 'Trip complete — welcome home!';
    countdownEl.style.background = 'rgba(197,61,45,.15)';
  }
}

// ===== HIGHLIGHT TODAY + AUTO-SCROLL =====
function highlightToday() {
  const status = getTripStatus();
  if (status.phase !== 'during') return;

  requestAnimationFrame(() => {
    const cards = document.querySelectorAll('.day-card');
    if (!cards[status.dayIndex]) return;

    cards[status.dayIndex].classList.add('is-today');
    cards[status.dayIndex].classList.add('expanded');

    const header = cards[status.dayIndex].querySelector('.day-header');
    if (header && !header.querySelector('.today-badge')) {
      const badge = document.createElement('span');
      badge.className = 'today-badge';
      badge.textContent = 'Today';
      header.appendChild(badge);
    }

    if (cards[status.dayIndex + 1]) {
      cards[status.dayIndex + 1].classList.add('is-next');
      const nextHeader = cards[status.dayIndex + 1].querySelector('.day-header');
      if (nextHeader && !nextHeader.querySelector('.next-badge')) {
        const badge = document.createElement('span');
        badge.className = 'next-badge';
        badge.textContent = 'Tomorrow';
        nextHeader.appendChild(badge);
      }
    }

    setTimeout(() => {
      cards[status.dayIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  });
}

// ===== STICKY NAV =====
function initStickyNav() {
  const hero = $('#top');
  if (!hero || !stickyNav) return;

  const observer = new IntersectionObserver(([entry]) => {
    stickyNav.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0, rootMargin: '-60px 0px 0px 0px' });

  observer.observe(hero);

  // Active link tracking
  const sections = ['route', 'itinerary', 'bookings', 'ask'];
  const snavLinks = stickyNav.querySelectorAll('.snav-link');

  function updateActive() {
    let current = sections[0];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) {
        current = id;
      }
    }
    snavLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateActive, 60);
  }, { passive: true });
}

// ===== FILTERS =====
$$('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderDays(btn.dataset.filter);
  });
});

// ===== QUICK ADD =====
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(addForm);
  const idx = fd.get('day');
  const title = fd.get('title').toString().trim();
  const notes = fd.get('notes').toString().trim();
  if (!title) return;

  customActivities[idx] = customActivities[idx] || [];
  customActivities[idx].push({ title, notes });
  saveCustom();
  addForm.reset();

  const activeFilter = $('.filter-btn.active')?.dataset.filter || 'all';
  renderDays(activeFilter);
});

// ===== Q&A ENGINE (improved) =====
askForm.addEventListener('submit', (e) => {
  e.preventDefault();
  askAnswer.textContent = answerQuestion(askInput.value);
});

function answerQuestion(raw) {
  const q = raw.toLowerCase().trim();
  if (!q) return 'Ask me about cities, travel days, flexible time, hotels, or suggestions.';

  // How many days/nights in [city]
  if (q.match(/how many|how long|number of/)) {
    const city = findCity(q);
    if (city) {
      const cityDays = DAYS.filter(d => d.cityKey === city);
      const routeStops = ROUTE.filter(r => r.key === city);
      const totalNights = routeStops.reduce((sum, r) => sum + r.nights, 0);
      const dateList = cityDays.map(d => fmtDate.format(parseDate(d.date))).join(', ');
      return `You have ${cityDays.length} day${cityDays.length > 1 ? 's' : ''} and ${totalNights} night${totalNights > 1 ? 's' : ''} in ${CITIES[city].name}: ${dateList}.`;
    }
    if (q.includes('city') || q.includes('cities') || q.includes('stop')) {
      return 'The trip covers 5 cities: Tokyo (5 days/4+1 nights), Mt. Fuji (1 day/1 night), Kyoto (2 days/2 nights), Kobe (2 days/2 nights), Hiroshima (3 days/3 nights).';
    }
    return 'The trip is 15 days total (Jun 9-23). Ask about a specific city for details.';
  }

  // What's on day N
  const dayMatch = q.match(/(?:day|#)\s*(\d+)/);
  if (dayMatch && !q.includes('how many')) {
    const dayNum = parseInt(dayMatch[1]);
    const day = DAYS.find(d => d.dayNum === dayNum);
    if (day) {
      const c = CITIES[day.cityKey];
      const acts = [...day.attractions, ...day.events].slice(0, 4).join(', ');
      const hotel = day.hotel?.name || 'In transit';
      return `Day ${dayNum} (${fmtDate.format(parseDate(day.date))}): ${day.title} in ${c.name}. Hotel: ${hotel}. Activities: ${acts}.`;
    }
    return `Day ${dayNum} doesn't exist. The trip is days 1–15.`;
  }

  // Confirmation lookups
  if (q.includes('confirm') || q.includes('reservation') || q.includes('booking number')) {
    const terms = [
      ['flight', 'United'], ['united', 'United'], ['aloft', 'Aloft'], ['ginza', 'Aloft'],
      ['toranomon', 'Toranomon'], ['ubuya', 'UBUYA'], ['fuji', 'UBUYA'],
      ['ace', 'Ace'], ['kyoto', 'Ace'], ['crowne', 'ANA Crowne'], ['kobe', 'ANA Crowne'],
      ['hilton', 'Hilton'], ['hiroshima', 'Hilton'],
    ];
    const match = terms.find(([t]) => q.includes(t));
    const results = match
      ? BOOKINGS.filter(b => b.title.includes(match[1]))
      : BOOKINGS.filter(b => b.details.some(([k]) => k === 'Confirmation'));
    return results.map(b => {
      const conf = b.details.find(([k]) => k === 'Confirmation');
      return conf ? `${b.title}: ${conf[1]}` : '';
    }).filter(Boolean).join(' | ') || 'No confirmation found for that term.';
  }

  // Check-in / check-out
  if (q.includes('check in') || q.includes('check-in') || q.includes('checkin') || q.includes('check out') || q.includes('checkout')) {
    const city = findCity(q);
    const matchDays = city
      ? DAYS.filter(d => d.cityKey === city && d.hotel?.checkin)
      : DAYS.filter(d => d.hotel?.checkin);
    return matchDays.map(d => {
      const h = d.hotel;
      return `${fmtDate.format(parseDate(d.date))}: ${h.name} — in ${h.checkin}, out ${h.checkout}`;
    }).join(' | ') || 'No check-in info found.';
  }

  // What hotel in [city]
  if (q.match(/what hotel|where.*stay|where.*sleep|which hotel|hotel in|where.*hotel/)) {
    const city = findCity(q);
    if (city) {
      const hotels = [...new Set(
        DAYS.filter(d => d.cityKey === city && d.hotel?.name)
          .map(d => d.hotel.name)
      )];
      if (hotels.length) {
        return `In ${CITIES[city].name}: ${hotels.join(', then ')}.`;
      }
    }
    // Show all hotels
    const allHotels = BOOKINGS.filter(b => b.icon === 'hotel')
      .map(b => `${b.title} (${b.details.find(([k]) => k === 'Dates')?.[1] || ''})`)
      .join(' | ');
    return allHotels || 'No hotel info found.';
  }

  // Travel / transport
  if (q.includes('leave') || q.includes('transfer') || q.includes('train') || q.includes('flight') || q.includes('shinkansen') || q.includes('travel')) {
    const travelDays = DAYS.filter(d => d.transport.length > 0);
    const city = findCity(q);
    const results = city ? travelDays.filter(d => d.cityKey === city || d.title.toLowerCase().includes(city)) : travelDays;
    return results.map(d => `${fmtDate.format(parseDate(d.date))}: ${d.transport.slice(0, 2).join(', ')}`).join(' | ') || 'No travel details found.';
  }

  // City query
  const city = findCity(q);
  if (city) {
    const matches = DAYS.filter(d => d.cityKey === city);
    return matches.map(d => `${fmtDate.format(parseDate(d.date))}: ${d.title} — ${d.attractions.slice(0, 3).join(', ')}`).join(' | ') || `No days found for "${city}".`;
  }

  // Flexible / open
  if (q.includes('flex') || q.includes('open') || q.includes('free') || q.includes('buffer')) {
    const flexDays = DAYS.filter(d =>
      d.attractions.some(a => /flexible|pending|add|buffer|optional|free|open/i.test(a)) || d.attractions.length <= 2
    );
    return flexDays.length
      ? 'Flexible days: ' + flexDays.map(d => `${fmtDate.format(parseDate(d.date))} (${d.title})`).join(', ')
      : 'All days currently have planned activities.';
  }

  // Suggest
  if (q.includes('suggest') || q.includes('recommend') || q.includes('idea') || q.includes('kid') || q.includes('tip')) {
    return 'Suggestions: Keep one anchor activity per day plus a flexible backup. In Kyoto, Fushimi Inari is best early morning. Miyajima depends on tides. For rainy days in Tokyo, try TeamLab Borderless or a depachika food hall.';
  }

  // Hotel (generic)
  if (q.includes('hotel') || q.includes('stay') || q.includes('where')) {
    return DAYS.filter(d => d.hotel).map(d => `${fmtDate.format(parseDate(d.date))}: ${d.hotel.name}`).join(' | ');
  }

  // Cost
  if (q.includes('cost') || q.includes('price') || q.includes('budget') || q.includes('spend') || q.includes('money')) {
    return 'Costs: Flights = 805,400 miles + $101.06 | Toranomon Hills = $862.20 | UBUYA = $750.59 | Ace Kyoto = $660.61 | ANA Kobe = $246.40 | Aloft Ginza = 113K pts | Hilton Hiroshima = 177K pts. Total cash: ~$2,519.80 + miles/points.';
  }

  // What / when
  if (q.includes('when') || q.includes('what time') || q.includes('arrive') || q.includes('depart')) {
    if (q.includes('arrive') || q.includes('land')) {
      return 'You arrive in Japan on Jun 10 at 2:55 PM JST (UA 837 into NRT). Airport transfer to Ginza for first hotel.';
    }
    if (q.includes('depart') || q.includes('leave japan') || q.includes('go home') || q.includes('fly home')) {
      return 'Return flight is Jun 23: UA 838 departing NRT at 5:25 PM JST, arriving SFO 11:00 AM PDT same day.';
    }
  }

  return 'I can help with: days per city, hotel info, confirmations, check-in times, travel logistics, flexible days, costs, and suggestions. Try asking about a specific city or "how many days in Hiroshima."';
}

function findCity(q) {
  const map = [
    ['tokyo', 'tokyo'], ['ginza', 'tokyo'], ['toranomon', 'tokyo'], ['shibuya', 'tokyo'],
    ['shinjuku', 'tokyo'], ['asakusa', 'tokyo'], ['harajuku', 'tokyo'], ['skytree', 'tokyo'],
    ['fuji', 'fuji'], ['kawaguchi', 'fuji'], ['ubuya', 'fuji'],
    ['kyoto', 'kyoto'], ['ace hotel', 'kyoto'], ['kinkaku', 'kyoto'], ['arashiyama', 'kyoto'],
    ['fushimi', 'kyoto'], ['gion', 'kyoto'],
    ['kobe', 'kobe'], ['nankinmachi', 'kobe'],
    ['hiroshima', 'hiroshima'], ['miyajima', 'hiroshima'], ['peace', 'hiroshima'],
  ];
  const match = map.find(([term]) => q.includes(term));
  return match ? match[1] : null;
}

// ===== NOTIFICATIONS =====
notifyBtn.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    notifyStatus.textContent = 'This browser does not support notifications.';
    return;
  }

  const perm = await Notification.requestPermission();
  if (perm !== 'granted') {
    notifyStatus.textContent = 'Notifications were not enabled.';
    return;
  }

  notifyStatus.textContent = "Enabled! You'll get reminders for upcoming events.";
  notifyBtn.textContent = 'Enabled';
  notifyBtn.disabled = true;

  setTimeout(() => {
    new Notification('Raahi — Japan 2026', {
      body: "Reminders are active. You'll be notified before check-ins and travel days.",
    });
  }, 2000);

  scheduleUpcoming();
});

function scheduleUpcoming() {
  const now = Date.now();
  DAYS.forEach((day) => {
    const dayDate = parseDate(day.date).getTime();
    const msAhead = dayDate - now;
    const notify24h = msAhead - 86400000;
    if (notify24h > 0 && notify24h < 15 * 86400000) {
      setTimeout(() => {
        new Notification(`Tomorrow: ${day.title}`, {
          body: day.transport.length
            ? `Travel day — ${day.transport[0]}`
            : day.hotel?.name
              ? `Stay at ${day.hotel.name}`
              : day.attractions[0] || 'Check your itinerary',
        });
      }, Math.min(notify24h, 2147483647));
    }
  });
}

// ===== MOBILE NAV ACTIVE STATE =====
function updateMobileNav() {
  const sections = ['route', 'itinerary', 'bookings', 'ask'];
  let current = 'route';

  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 120) {
      current = id;
    }
  }

  $$('.mnav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.section === current);
  });
}

let scrollTimer;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(updateMobileNav, 60);
}, { passive: true });

// ===== INIT =====
renderCityNav();
renderDays();
renderBookings();
renderDayOptions();
renderCountdown();
initStickyNav();
updateMobileNav();

setInterval(() => {
  renderCountdown();
  highlightToday();
}, 3600000);
