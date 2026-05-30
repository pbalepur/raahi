/* ============================================================
   Raahi — Travel Itinerary App  (v4)
   Data-driven · Leaflet map · Slide-in panel · Export/Import
   ============================================================ */

// ── Activity type config (UI only — not trip data) ──
const ITEM_TYPES = {
  flight:     { icon: '✈️',  label: 'Flight',     color: '#6366f1' },
  hotel:      { icon: '🏨',  label: 'Hotel',      color: '#8b5cf6' },
  train:      { icon: '🚅',  label: 'Train',      color: '#0284c7' },
  bus:        { icon: '🚌',  label: 'Bus',        color: '#0d9488' },
  walk:       { icon: '🚶',  label: 'Walk',       color: '#65a30d' },
  taxi:       { icon: '🚕',  label: 'Taxi/Car',   color: '#d97706' },
  attraction: { icon: '⛩️',  label: 'See',        color: '#c53d2d' },
  food:       { icon: '🍽️',  label: 'Food',       color: '#ea580c' },
  shopping:   { icon: '🛍️',  label: 'Shopping',   color: '#db2777' },
  event:      { icon: '🎵',  label: 'Event',      color: '#7c3aed' },
  buffer:     { icon: '⏳',  label: 'Buffer',     color: '#78716c' },
};

// ── SVG Icons ──
const ICONS = {
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  hotel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><path d="M8 7h.01M16 7h.01M12 7h.01M12 11h.01M16 11h.01M8 11h.01"/></svg>',
  train: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M9 15h.01M15 15h.01"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>',
};

// ===================================================================
//  UTILITIES
// ===================================================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const fmtDate  = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const fmtDay   = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat('en-US', { month: 'short' });
const fmtWkday = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

function parseDate(str) { return new Date(str + 'T12:00:00'); }

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ', Japan')}`;
}

function generateId() {
  return 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function to12h(t24) {
  if (!t24) return '';
  const parts = String(t24).split(':').map(Number);
  if (parts.length < 2 || isNaN(parts[0])) return '';
  const [hh, mm] = parts;
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const h = hh % 12 || 12;
  return `${h}:${String(mm).padStart(2, '0')} ${ampm}`;
}

function ampmLabel(ampm) {
  if (!ampm) return '';
  const map = { AM: 'Morning', PM: 'Afternoon', EVE: 'Evening' };
  return map[ampm.toUpperCase()] || ampm;
}

function detectType(text) {
  const t = text.toLowerCase();
  if (/\bua\s?\d|flight|depart.*airport|arrive.*airport|\bnrt\b|\bsfo\b|airport transfer|boeing/i.test(t)) return 'flight';
  if (/shinkansen|\btrain\b|\brail\b|\bjr\b/i.test(t)) return 'train';
  if (/\bbus\b|highway bus/i.test(t)) return 'bus';
  if (/\bwalk\b|stroll|walking/i.test(t)) return 'walk';
  if (/taxi|uber|transfer|move bags|\bcab\b|\bcar\b|ride/i.test(t)) return 'taxi';
  if (/dinner|lunch|breakfast|meal|eat|ramen|food|cafe|restaurant|okonomiyaki|dining|food hall/i.test(t)) return 'food';
  if (/shop|market|department store|nishiki|tsukiji|kappabashi/i.test(t)) return 'shopping';
  if (/concert|performance|festival|music|theater|hall|choir|exchange/i.test(t)) return 'event';
  if (/buffer|free|flexible|optional|pending|settle|packing/i.test(t)) return 'buffer';
  if (/check.?in|check.?out|hotel|aloft|toranomon|ubuya|ace hotel|crowne|hilton|marriott/i.test(t)) return 'hotel';
  return 'attraction';
}

// Find the days that belong to a specific route segment (by index).
// Handles repeated places (e.g. Tokyo appears twice at different points).
function getRouteSegmentDays(routeIdx) {
  const stop = trip.route[routeIdx];
  if (!stop) return [];

  // Find consecutive days for this place starting from where previous segments end
  let dayOffset = 0;
  for (let r = 0; r < routeIdx; r++) {
    dayOffset += trip.route[r].nights + (r === 0 ? 1 : 0); // first segment includes arrival day
  }
  if (routeIdx === 0) dayOffset = 0;

  // Simpler approach: use dates. Parse the route "dates" field or just match by placeKey + contiguous block.
  // Best approach: find contiguous runs of days with this placeKey
  const runs = [];
  let currentRun = null;
  trip.days.forEach((d, i) => {
    if (d.placeKey === stop.key) {
      if (!currentRun) currentRun = { start: i, days: [d] };
      else currentRun.days.push(d);
    } else {
      if (currentRun) { runs.push(currentRun); currentRun = null; }
    }
  });
  if (currentRun) runs.push(currentRun);

  // Match the Nth run of this placeKey to the Nth route entry with this key
  let matchIdx = 0;
  for (let r = 0; r < routeIdx; r++) {
    if (trip.route[r].key === stop.key) matchIdx++;
  }

  return runs[matchIdx]?.days || [];
}

// ===================================================================
//  DATA LAYER
// ===================================================================

const STORE_KEY = 'raahi_v4_trip';
const EDITS_KEY = 'raahi_v4_edits';

let trip = null;       // The full trip data
let userEdits = {};    // User overrides per day

function loadTrip() {
  try {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function saveTrip() {
  localStorage.setItem(STORE_KEY, JSON.stringify(trip));
}

function loadEdits() {
  try { return JSON.parse(localStorage.getItem(EDITS_KEY) || '{}'); }
  catch { return {}; }
}

function saveEdits() {
  localStorage.setItem(EDITS_KEY, JSON.stringify(userEdits));
}

// Get schedule + wishlist for a day, with user edits merged
function getSchedule(dayIdx) {
  const day = trip.days[dayIdx];
  const edits = userEdits[dayIdx];
  if (!edits) return [...(day.schedule || [])];
  const deleted = new Set(edits.deletedSchedule || []);
  const base = (day.schedule || []).filter(i => !deleted.has(i.id));
  const added = (edits.addedSchedule || []);
  return [...base, ...added];
}

function getWishlist(dayIdx) {
  const day = trip.days[dayIdx];
  const edits = userEdits[dayIdx];
  if (!edits) return [...(day.wishlist || [])];
  const deleted = new Set(edits.deletedWishlist || []);
  const base = (day.wishlist || []).filter(i => !deleted.has(i.id));
  const added = (edits.addedWishlist || []);
  return [...base, ...added];
}

function ensureEdits(dayIdx) {
  if (!userEdits[dayIdx]) {
    userEdits[dayIdx] = {
      addedSchedule: [], deletedSchedule: [],
      addedWishlist: [], deletedWishlist: [],
    };
  }
}

function addScheduleItem(dayIdx, item) {
  ensureEdits(dayIdx);
  userEdits[dayIdx].addedSchedule.push(item);
  saveEdits();
}

function addWishlistItem(dayIdx, item) {
  ensureEdits(dayIdx);
  userEdits[dayIdx].addedWishlist.push(item);
  saveEdits();
}

function deleteScheduleItem(dayIdx, itemId) {
  ensureEdits(dayIdx);
  const addedIdx = userEdits[dayIdx].addedSchedule.findIndex(i => i.id === itemId);
  if (addedIdx >= 0) {
    userEdits[dayIdx].addedSchedule.splice(addedIdx, 1);
  } else {
    userEdits[dayIdx].deletedSchedule.push(itemId);
  }
  saveEdits();
}

function deleteWishlistItem(dayIdx, itemId) {
  ensureEdits(dayIdx);
  const addedIdx = userEdits[dayIdx].addedWishlist.findIndex(i => i.id === itemId);
  if (addedIdx >= 0) {
    userEdits[dayIdx].addedWishlist.splice(addedIdx, 1);
  } else {
    userEdits[dayIdx].deletedWishlist.push(itemId);
  }
  saveEdits();
}

function promoteToSchedule(dayIdx, itemId, time, ampm) {
  const wishlist = getWishlist(dayIdx);
  const item = wishlist.find(i => i.id === itemId);
  if (!item) return;
  deleteWishlistItem(dayIdx, itemId);
  const schedItem = { ...item, id: generateId(), time: time || null, ampm: ampm || null, status: 'tentative' };
  addScheduleItem(dayIdx, schedItem);
  saveEdits();
}

function demoteToWishlist(dayIdx, itemId) {
  const schedule = getSchedule(dayIdx);
  const item = schedule.find(i => i.id === itemId);
  if (!item) return;
  deleteScheduleItem(dayIdx, itemId);
  const wlItem = { ...item, id: generateId(), time: null, ampm: null, status: 'wishlist' };
  addWishlistItem(dayIdx, wlItem);
  saveEdits();
}

function moveItemToDay(fromDayIdx, toDayIdx, itemId, isSchedule) {
  if (isSchedule) {
    const items = getSchedule(fromDayIdx);
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    deleteScheduleItem(fromDayIdx, itemId);
    addScheduleItem(toDayIdx, { ...item, id: generateId() });
  } else {
    const items = getWishlist(fromDayIdx);
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    deleteWishlistItem(fromDayIdx, itemId);
    addWishlistItem(toDayIdx, { ...item, id: generateId() });
  }
  saveEdits();
}

// ===================================================================
//  EXPORT / IMPORT
// ===================================================================

function exportTrip() {
  // Merge user edits into a clean copy
  const exportData = JSON.parse(JSON.stringify(trip));
  exportData.days.forEach((day, idx) => {
    day.schedule = getSchedule(idx);
    day.wishlist = getWishlist(idx);
  });
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `raahi-${trip.meta.name.toLowerCase()}-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Trip exported');
}

function importTrip(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.meta || !data.days || !data.places) {
        showToast('Invalid trip file — missing required fields');
        return;
      }
      // Confirm before overwriting
      const dayCount = data.days?.length || 0;
      const tripName = data.meta?.name || 'Unknown';
      if (!confirm(`Import "${tripName}" (${dayCount} days)? This will replace your current trip data.`)) {
        return;
      }
      trip = data;
      userEdits = {};
      saveTrip();
      saveEdits();
      showToast('Trip imported — refreshing...');
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      showToast('Failed to parse JSON file');
    }
  };
  reader.readAsText(file);
}

// ===================================================================
//  RENDER: Leaflet Route Map
// ===================================================================

let routeMap = null;

function renderRouteMap() {
  const container = $('#route-map');
  if (!container || typeof L === 'undefined') return;

  // Gather place coords
  const coords = [];
  const markers = [];

  // Start: first day's place
  trip.route.forEach(stop => {
    const place = trip.places[stop.key];
    if (place && place.lat && place.lng) {
      coords.push([place.lat, place.lng]);
      markers.push({ lat: place.lat, lng: place.lng, place, stop });
    }
  });

  if (coords.length < 2) {
    container.innerHTML = '<p style="padding:24px;color:var(--ink-muted);text-align:center">Add place coordinates to see the route map</p>';
    return;
  }

  // Dedupe coords for unique pins
  const seen = new Set();
  const uniqueMarkers = markers.filter(m => {
    const key = `${m.lat},${m.lng}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (routeMap) routeMap.remove();
  routeMap = L.map(container, { scrollWheelZoom: false, zoomControl: true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(routeMap);

  // Fit bounds with padding
  const bounds = L.latLngBounds(coords);
  routeMap.fitBounds(bounds, { padding: [30, 30] });

  // Route polyline
  L.polyline(coords, {
    color: '#1c183a',
    weight: 2.5,
    opacity: 0.5,
    dashArray: '8,6',
  }).addTo(routeMap);

  // City markers
  uniqueMarkers.forEach((m, i) => {
    const circleMarker = L.circleMarker([m.lat, m.lng], {
      radius: 8,
      fillColor: m.place.color,
      color: '#fff',
      weight: 2,
      fillOpacity: 0.9,
    }).addTo(routeMap);

    circleMarker.bindPopup(`
      <strong>${m.place.emoji} ${m.stop.city}</strong><br>
      ${m.stop.dates} · ${m.stop.nights} night${m.stop.nights > 1 ? 's' : ''}<br>
      <a href="${mapsUrl(m.stop.city)}" target="_blank" rel="noreferrer">Open in Google Maps</a>
    `);

    circleMarker.on('click', () => {
      const placeKey = m.stop.key;
      filterByPlace(placeKey);
    });
  });
}

// ===================================================================
//  RENDER: Places Section (was "City Navigation")
// ===================================================================

function renderPlaces() {
  const cityNav = $('#city-nav');
  if (!cityNav) return;

  const cards = trip.route.map((stop, i) => {
    const place = trip.places[stop.key];
    if (!place) return '';

    // Find days that belong to THIS route segment (by date range, not just placeKey)
    const segDays = getRouteSegmentDays(i);
    const dayCount = segDays.length;

    // Hotels for this specific segment only
    const hotels = [...new Set(
      segDays.filter(d => d.stay?.hotel).map(d => d.stay.hotel)
    )];
    const hotelLine = hotels.length > 1
      ? `${hotels[0]} +${hotels.length - 1} more`
      : hotels.length === 1 ? hotels[0] : '';

    return `
      <button class="city-card" data-place="${stop.key}" data-idx="${i}" style="--city-color:${place.color}; --city-bg:${place.bg}">
        ${place.img ? `<div class="city-card-img"><img src="${place.img}" alt="${stop.city}" loading="lazy"></div>` : ''}
        <div class="city-card-body">
          <div class="city-card-info">
            <h3>${place.emoji} ${stop.city}</h3>
            <span class="city-dates">${stop.dates}</span>
            <span class="city-meta">${stop.nights}n · ${dayCount} day${dayCount > 1 ? 's' : ''}</span>
            ${hotelLine ? `<span class="city-hotel">${escHtml(hotelLine)}</span>` : ''}
          </div>
          <a class="city-map-link" href="${mapsUrl(stop.city)}" target="_blank" rel="noreferrer" title="Open in Google Maps" onclick="event.stopPropagation()">
            ${ICONS.mapPin}
          </a>
        </div>
      </button>`;
  }).join('');

  // Add Place card
  const addCard = `
    <button class="city-card city-card-add" id="add-place-btn">
      <div class="city-card-add-inner">
        ${ICONS.plus}
        <span>Add Place</span>
      </div>
    </button>`;

  cityNav.innerHTML = `<div class="city-cards-row">${cards}${addCard}</div>`;

  // Click handlers
  cityNav.querySelectorAll('.city-card[data-place]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.closest('.city-map-link')) return;
      filterByPlace(btn.dataset.place);
    });
  });

  // Add Place handler
  const addBtn = $('#add-place-btn');
  if (addBtn) addBtn.addEventListener('click', openAddPlaceModal);
}

function filterByPlace(placeKey) {
  // Set filter pill active
  $$('.filter-pill').forEach(p => p.classList.remove('active'));
  const pill = $(`.filter-pill[data-place="${placeKey}"]`);
  if (pill) pill.classList.add('active');

  renderDayList(placeKey);

  // Scroll to itinerary
  const section = $('#itinerary');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===================================================================
//  RENDER: Filter Bar (Place Pills + Today)
// ===================================================================

function renderFilterBar() {
  const bar = $('#filter-bar');
  if (!bar) return;

  // Unique places in route order
  const seen = new Set();
  const uniquePlaces = [];
  trip.route.forEach(r => {
    if (!seen.has(r.key)) {
      seen.add(r.key);
      uniquePlaces.push(r);
    }
  });

  const pills = uniquePlaces.map(r => {
    const place = trip.places[r.key];
    return `<button class="filter-pill" data-place="${r.key}" style="--pill-color:${place.color}; --pill-bg:${place.bg}">${place.emoji} ${r.city}</button>`;
  }).join('');

  bar.innerHTML = `
    <button class="filter-pill active" data-place="all">All</button>
    <button class="filter-pill filter-pill-today" data-place="today">${ICONS.calendar} Today</button>
    ${pills}
  `;

  bar.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      $$('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const placeKey = pill.dataset.place;

      if (placeKey === 'today') {
        renderDayList('all');
        scrollToToday();
        updateFilterStatus('all');
      } else {
        renderDayList(placeKey);
        updateFilterStatus(placeKey);
      }
    });
  });
}

function updateFilterStatus(filter) {
  let status = $('#filter-status');
  if (!status) {
    status = document.createElement('div');
    status.id = 'filter-status';
    status.className = 'filter-status';
    const bar = $('#filter-bar');
    if (bar) bar.after(status);
    else return;
  }

  if (filter === 'all') {
    status.style.display = 'none';
    return;
  }

  const place = trip.places[filter];
  const count = trip.days.filter(d => d.placeKey === filter).length;
  status.textContent = `Showing ${count} day${count !== 1 ? 's' : ''} in ${place?.name || filter}`;
  status.style.display = '';
}

// ===================================================================
//  RENDER: Day List (compact cards that open panel)
// ===================================================================

function renderDayList(filter = 'all') {
  const dayList = $('#day-list');
  if (!dayList) return;

  dayList.innerHTML = trip.days.map((day, idx) => {
    const d = parseDate(day.date);
    const place = trip.places[day.placeKey] || trip.places.transit;

    // Filter
    if (filter !== 'all' && filter !== 'today' && day.placeKey !== filter) return '';

    const schedule = getSchedule(idx);
    const wishlist = getWishlist(idx);
    const totalCount = schedule.length + wishlist.length;

    // Stay: explicit day data takes priority, fall back to booking lookup
    const stayBooking = !day.stay ? getStayBookingForDate(day.date) : null;
    const hotelName = day.stay?.hotel || stayBooking?.title || 'In transit';

    // Travel: explicit day data takes priority, fall back to booking lookup
    const travelEntry   = !day.travel ? getTravelBookingForDate(day.date) : null;
    const travelShape   = travelEntry ? bookingToTravelShape(travelEntry) : null;
    const effectiveTravel = day.travel || travelShape;

    return `
      <article class="day-card" data-idx="${idx}" data-place="${day.placeKey}" style="--city-color:${place.color}; --city-bg:${place.bg}">
        <div class="day-rail">
          <span class="day-weekday">${fmtWkday.format(d).toUpperCase()}</span>
          <span class="day-num">${fmtDay.format(d)}</span>
          <span class="day-month">${fmtMonth.format(d)}</span>
        </div>
        <div class="day-content">
          <div class="day-summary">
            <div class="day-header">
              <h3 class="day-title">${day.title}</h3>
              <span class="place-pill" style="background:${place.bg}; color:${place.color}">${place.emoji ? place.emoji + ' ' : ''}${place.name}</span>
            </div>
            <div class="day-preview">
              ${effectiveTravel ? `<span class="day-travel-badge">${ITEM_TYPES[effectiveTravel.mode]?.icon || '🚀'} ${effectiveTravel.summary}</span>` : ''}
              <span class="preview-text">${totalCount} item${totalCount !== 1 ? 's' : ''} · ${hotelName}</span>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');

  // Clicking a card opens the panel
  dayList.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx);
      openDayPanel(idx);
    });
  });

  highlightToday();
}

// ===================================================================
//  BOOKING ↔ ITINERARY CROSS-REFERENCE
// ===================================================================

// Returns the hotel booking covering a given date (checkIn <= date < checkOut)
function getStayBookingForDate(dateStr) {
  if (!trip.bookings) return null;
  return trip.bookings.find(b => {
    if (b.category !== 'hotel' || !b.checkIn || !b.checkOut) return false;
    return b.checkIn <= dateStr && dateStr < b.checkOut;
  }) || null;
}

// Returns the first matching flight/rail event for a given date.
// Returns { booking, leg, event } where:
//   leg:   'outbound' | 'inbound' | 'transit'
//   event: 'depart' | 'arrive'
function getTravelBookingForDate(dateStr) {
  if (!trip.bookings) return null;
  for (const b of trip.bookings) {
    if (b.category === 'flight') {
      const ob = b.outbound || {};
      const ib = b.inbound  || {};
      // Outbound departure
      if (ob.departDate === dateStr)
        return { booking: b, leg: 'outbound', event: 'depart' };
      // Outbound arrival (only if it lands on a different day)
      if (ob.arriveDate && ob.arriveDate !== ob.departDate && ob.arriveDate === dateStr)
        return { booking: b, leg: 'outbound', event: 'arrive' };
      // Inbound departure
      if (ib.departDate && ib.departDate === dateStr)
        return { booking: b, leg: 'inbound', event: 'depart' };
      // Inbound arrival (cross-date, rare but possible)
      if (ib.arriveDate && ib.arriveDate !== ib.departDate && ib.arriveDate === dateStr)
        return { booking: b, leg: 'inbound', event: 'arrive' };
    }
    if (b.category === 'rail' && b.transitDate === dateStr) {
      return { booking: b, leg: 'transit', event: 'depart' };
    }
  }
  return null;
}

// Convert a travel entry { booking, leg, event } into the shape the panel expects
function bookingToTravelShape(entry) {
  if (!entry) return null;
  const { booking: b, leg, event } = entry;

  if (b.category === 'flight') {
    const l = leg === 'inbound' ? (b.inbound || {}) : (b.outbound || {});
    if (event === 'arrive') {
      const arr = l.arriveTime ? ` · ${fmtTime12(l.arriveTime)}` : '';
      return {
        mode:         'flight',
        summary:      `Arrive ${l.arriveAirport || '?'}${arr}`,
        details:      `${b.title}${l.flight ? ' · ' + l.flight : ''} from ${l.departAirport || '?'}`,
        confirmation: b.confirmation || '',
        url:          b.url || '',
      };
    }
    // depart
    const dep = l.departTime ? ` · ${fmtTime12(l.departTime)}` : '';
    return {
      mode:         'flight',
      summary:      `${l.departAirport || '?'} → ${l.arriveAirport || '?'}${dep}`,
      details:      `${b.title}${l.flight ? ' · ' + l.flight : ''}`,
      confirmation: b.confirmation || '',
      url:          b.url || '',
    };
  }

  if (b.category === 'rail') {
    const dep = b.transitTime ? ` · ${fmtTime12(b.transitTime)}` : '';
    return {
      mode:         'train',
      summary:      `${b.transitFrom || '?'} → ${b.transitTo || '?'}${dep}`,
      details:      b.title,
      confirmation: b.confirmation || '',
      url:          b.url || '',
    };
  }

  return null;
}

// ===================================================================
//  DAY PANEL (Slide-in from right)
// ===================================================================

let currentPanelDay = null;

function openDayPanel(dayIdx) {
  currentPanelDay = dayIdx;
  const panel = $('#day-panel');
  if (!panel) return;

  const day = trip.days[dayIdx];
  const place = trip.places[day.placeKey] || trip.places.transit;
  const d = parseDate(day.date);

  const schedule = getSchedule(dayIdx);
  const wishlist = getWishlist(dayIdx);

  // Sort schedule: timed items first (by time), then ampm-only items
  const sortedSchedule = schedule.sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time && !b.time) return -1;
    if (!a.time && b.time) return 1;
    const ampmOrder = { AM: 0, PM: 1, EVE: 2 };
    return (ampmOrder[(a.ampm || '').toUpperCase()] || 0) - (ampmOrder[(b.ampm || '').toUpperCase()] || 0);
  });

  // Header
  panel.querySelector('.day-panel-date').textContent = `${fmtDate.format(d)} · Day ${day.dayNum}`;
  panel.querySelector('.day-panel-title-text').textContent = day.title;
  panel.querySelector('.day-panel-title-text').style.color = place.color;

  // City pill
  const pillEl = panel.querySelector('.day-panel-place');
  pillEl.textContent = `${place.emoji} ${place.name}`;
  pillEl.style.background = place.bg;
  pillEl.style.color = place.color;

  // Stay badge — explicit day.stay takes priority, fall back to booking lookup
  const stayEl      = panel.querySelector('.panel-stay');
  const stayBooking = !day.stay ? getStayBookingForDate(day.date) : null;
  const stayData    = day.stay
    ? { hotel: day.stay.hotel, room: day.stay.room, confirmation: day.stay.confirmation, url: day.stay.url, fromBooking: false }
    : stayBooking
      ? { hotel: stayBooking.title, room: '', confirmation: stayBooking.confirmation, url: stayBooking.url, fromBooking: true }
      : null;

  if (stayData) {
    const stayUrl = stayData.url
      ? ` <a href="${escHtml(stayData.url)}" target="_blank" rel="noreferrer" class="stay-link">${ICONS.arrow}</a>`
      : '';
    stayEl.innerHTML = `
      <div class="stay-badge${stayData.fromBooking ? ' stay-badge-linked' : ''}">
        <span class="stay-icon">🏨</span>
        <div class="stay-info">
          <strong>${escHtml(stayData.hotel)}</strong>
          ${stayData.room         ? `<span>${escHtml(stayData.room)}</span>` : ''}
          ${stayData.confirmation ? `<span class="stay-conf">Conf: ${escHtml(stayData.confirmation)}</span>` : ''}
        </div>
        ${stayUrl}
      </div>`;
    stayEl.style.display = '';
  } else {
    stayEl.style.display = 'none';
  }

  // Travel section — explicit day.travel takes priority, fall back to booking lookup
  const travelEl    = panel.querySelector('.panel-travel');
  const travelEntry = !day.travel ? getTravelBookingForDate(day.date) : null;
  const travelShape = travelEntry ? bookingToTravelShape(travelEntry) : null;
  const travelData  = day.travel
    ? { ...day.travel, fromBooking: false }
    : travelShape
      ? { ...travelShape, fromBooking: true }
      : null;

  if (travelData) {
    const modeIcon = ITEM_TYPES[travelData.mode]?.icon || '🚀';
    const travelUrl = travelData.url
      ? `<a href="${escHtml(travelData.url)}" target="_blank" rel="noreferrer" class="travel-link">${ICONS.arrow}</a>`
      : '';
    travelEl.innerHTML = `
      <h4 class="panel-label">Travel</h4>
      <div class="travel-card${travelData.fromBooking ? ' travel-card-linked' : ''}">
        <span class="travel-icon">${modeIcon}</span>
        <div class="travel-info">
          <strong>${escHtml(travelData.summary)}</strong>
          <span>${escHtml(travelData.details)}</span>
          ${travelData.confirmation ? `<span class="travel-conf">Conf: ${escHtml(travelData.confirmation)}</span>` : ''}
        </div>
        ${travelUrl}
      </div>`;
    travelEl.style.display = '';
  } else {
    travelEl.style.display = 'none';
  }

  // Schedule section
  const schedEl = panel.querySelector('.panel-schedule');
  if (sortedSchedule.length > 0) {
    schedEl.innerHTML = `
      <h4 class="panel-label">Schedule</h4>
      <div class="panel-timeline">
        ${sortedSchedule.map(item => renderPanelItem(item, dayIdx, true)).join('')}
      </div>`;
    schedEl.style.display = '';
  } else {
    schedEl.innerHTML = `
      <h4 class="panel-label">Schedule</h4>
      <p class="panel-empty">No scheduled items yet</p>`;
    schedEl.style.display = '';
  }

  // Wishlist section
  const wlEl = panel.querySelector('.panel-wishlist');
  wlEl.innerHTML = `
    <h4 class="panel-label">Wishlist</h4>
    ${wishlist.length > 0
      ? `<div class="panel-wl-list">${wishlist.map(item => renderPanelItem(item, dayIdx, false)).join('')}</div>`
      : '<p class="panel-empty">No wishlist items</p>'
    }
    <button class="panel-add-btn" data-section="add" data-idx="${dayIdx}">
      ${ICONS.plus} Add
    </button>`;

  // Attach panel event handlers
  attachPanelHandlers(dayIdx);

  // Show panel
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Day navigation
  panel.querySelector('.day-panel-prev').onclick = () => {
    if (dayIdx > 0) openDayPanel(dayIdx - 1);
  };
  panel.querySelector('.day-panel-next').onclick = () => {
    if (dayIdx < trip.days.length - 1) openDayPanel(dayIdx + 1);
  };
  panel.querySelector('.day-panel-prev').style.visibility = dayIdx > 0 ? '' : 'hidden';
  panel.querySelector('.day-panel-next').style.visibility = dayIdx < trip.days.length - 1 ? '' : 'hidden';
}

function closeDayPanel() {
  const panel = $('#day-panel');
  if (panel) {
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }
  currentPanelDay = null;
}

function renderPanelItem(item, dayIdx, isSchedule) {
  const typeInfo = ITEM_TYPES[item.type] || ITEM_TYPES.attraction;
  const statusClass = item.status === 'confirmed' ? 'pi-confirmed' : item.status === 'tentative' ? 'pi-tentative' : '';

  const timeDisplay = item.time
    ? `<span class="pi-time">${to12h(item.time)}</span>`
    : item.ampm
      ? `<span class="pi-time pi-ampm">${ampmLabel(item.ampm)}</span>`
      : '';

  const mapBtn = !['flight', 'buffer', 'hotel'].includes(item.type)
    ? `<a href="${mapsUrl(item.title)}" target="_blank" rel="noreferrer" class="pi-map" title="Open in Maps" onclick="event.stopPropagation()">${ICONS.mapPin}</a>`
    : '';

  const urlLink = item.url
    ? `<a href="${item.url}" target="_blank" rel="noreferrer" class="pi-ext-link" onclick="event.stopPropagation()">${ICONS.arrow}</a>`
    : '';

  return `
    <div class="panel-item ${statusClass}" data-id="${item.id}" data-idx="${dayIdx}" data-schedule="${isSchedule}">
      <div class="pi-main">
        <span class="pi-icon" style="--type-color:${typeInfo.color}">${typeInfo.icon}</span>
        <div class="pi-body">
          ${timeDisplay}
          <span class="pi-title">${item.title}</span>
          ${item.notes ? `<span class="pi-notes">${item.notes}</span>` : ''}
          ${item.confirmation ? `<span class="pi-conf">Conf: ${item.confirmation}</span>` : ''}
        </div>
        <div class="pi-actions">
          ${mapBtn}
          ${urlLink}
        </div>
      </div>
      <div class="pi-detail" style="display:none">
        <div class="pi-detail-row">
          <label>Time</label>
          <input type="time" class="pi-time-input" value="${item.time || ''}" data-id="${item.id}">
          <select class="pi-ampm-select" data-id="${item.id}">
            <option value="">—</option>
            <option value="AM" ${item.ampm === 'AM' ? 'selected' : ''}>Morning</option>
            <option value="PM" ${item.ampm === 'PM' ? 'selected' : ''}>Afternoon</option>
            <option value="EVE" ${item.ampm === 'EVE' ? 'selected' : ''}>Evening</option>
          </select>
        </div>
        <div class="pi-detail-row">
          <label>Move to Day</label>
          <select class="pi-move-day" data-id="${item.id}">
            ${trip.days.map((d, i) => {
              const currentPlace = trip.days[dayIdx].placeKey;
              const isSamePlace = d.placeKey === currentPlace;
              const isTransit = d.placeKey === 'transit' || d.placeKey === 'home';
              const prefix = i === dayIdx ? '● ' : isSamePlace ? '' : isTransit ? '⚠ ' : '⚠ ';
              return `<option value="${i}" ${i === dayIdx ? 'selected' : ''} data-same="${isSamePlace}" data-transit="${isTransit}">${prefix}Day ${d.dayNum} — ${trip.places[d.placeKey]?.name || d.placeKey} — ${d.title}</option>`;
            }).join('')}
          </select>
        </div>
        <div class="pi-detail-actions">
          ${isSchedule
            ? `<button class="pi-demote" data-id="${item.id}" data-idx="${dayIdx}">Move to Wishlist</button>`
            : `<button class="pi-promote" data-id="${item.id}" data-idx="${dayIdx}">Move to Schedule</button>`
          }
          <button class="pi-delete" data-id="${item.id}" data-idx="${dayIdx}" data-schedule="${isSchedule}">
            ${ICONS.trash} Delete
          </button>
        </div>
      </div>
    </div>`;
}

function attachPanelHandlers(dayIdx) {
  const panel = $('#day-panel');

  // Expand/collapse items
  panel.querySelectorAll('.pi-main').forEach(main => {
    main.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const item = main.closest('.panel-item');
      const detail = item.querySelector('.pi-detail');
      const isOpen = detail.style.display !== 'none';
      // Close all others
      panel.querySelectorAll('.pi-detail').forEach(d => d.style.display = 'none');
      panel.querySelectorAll('.panel-item').forEach(i => i.classList.remove('expanded'));
      if (!isOpen) {
        detail.style.display = '';
        item.classList.add('expanded');
      }
    });
  });

  // Delete buttons
  panel.querySelectorAll('.pi-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.id;
      const idx = parseInt(btn.dataset.idx);
      const isSchedule = btn.dataset.schedule === 'true';

      if (isSchedule) {
        // Save for undo
        const items = getSchedule(idx);
        const item = items.find(i => i.id === itemId);
        deleteScheduleItem(idx, itemId);
        showUndoToast('Item deleted', () => {
          if (item) addScheduleItem(idx, item);
          openDayPanel(idx);
        });
      } else {
        const items = getWishlist(idx);
        const item = items.find(i => i.id === itemId);
        deleteWishlistItem(idx, itemId);
        showUndoToast('Item deleted', () => {
          if (item) addWishlistItem(idx, item);
          openDayPanel(idx);
        });
      }
      openDayPanel(idx);
      renderDayList(getActiveFilter());
    });
  });

  // Promote (wishlist → schedule) — reads time/ampm from expanded form inputs
  panel.querySelectorAll('.pi-promote').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.id;
      const idx = parseInt(btn.dataset.idx);
      const item = btn.closest('.panel-item');
      const timeInput = item.querySelector('.pi-time-input');
      const ampmSelect = item.querySelector('.pi-ampm-select');
      const time = timeInput?.value || null;
      const ampm = ampmSelect?.value || (time ? null : 'AM');

      // Capture original wishlist item for undo
      const wlItems = getWishlist(idx);
      const origItem = wlItems.find(i => i.id === itemId);

      promoteToSchedule(idx, itemId, time, ampm);
      openDayPanel(idx);
      renderDayList(getActiveFilter());

      showUndoToast('Moved to schedule', () => {
        // Undo: find the promoted item in schedule (by title) and move back
        const schedItems = getSchedule(idx);
        const promoted = schedItems.find(i => i.title === origItem?.title);
        if (promoted) deleteScheduleItem(idx, promoted.id);
        if (origItem) addWishlistItem(idx, { ...origItem });
        saveEdits();
        openDayPanel(idx);
        renderDayList(getActiveFilter());
      });
    });
  });

  // Demote (schedule → wishlist)
  panel.querySelectorAll('.pi-demote').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.id;
      const idx = parseInt(btn.dataset.idx);

      // Capture original schedule item for undo
      const schedItems = getSchedule(idx);
      const origItem = schedItems.find(i => i.id === itemId);

      demoteToWishlist(idx, itemId);
      openDayPanel(idx);
      renderDayList(getActiveFilter());

      showUndoToast('Moved to wishlist', () => {
        // Undo: find demoted item in wishlist and move back to schedule
        const wlItems = getWishlist(idx);
        const demoted = wlItems.find(i => i.title === origItem?.title);
        if (demoted) deleteWishlistItem(idx, demoted.id);
        if (origItem) addScheduleItem(idx, { ...origItem });
        saveEdits();
        openDayPanel(idx);
        renderDayList(getActiveFilter());
      });
    });
  });

  // Move to different day (with cross-place confirmation + undo)
  panel.querySelectorAll('.pi-move-day').forEach(select => {
    select.addEventListener('change', () => {
      const itemId = select.dataset.id;
      const toDayIdx = parseInt(select.value);
      const panelItem = select.closest('.panel-item');
      const isSchedule = panelItem.dataset.schedule === 'true';
      if (toDayIdx === dayIdx) return;

      const currentPlace = trip.days[dayIdx].placeKey;
      const targetPlace = trip.days[toDayIdx].placeKey;
      const isSamePlace = targetPlace === currentPlace;
      const isTransit = targetPlace === 'transit' || targetPlace === 'home';

      const doMove = () => {
        // Capture item before moving (for undo)
        const sourceItems = isSchedule ? getSchedule(dayIdx) : getWishlist(dayIdx);
        const itemData = sourceItems.find(i => i.id === itemId);

        moveItemToDay(dayIdx, toDayIdx, itemId, isSchedule);

        showUndoToast(`Moved to Day ${trip.days[toDayIdx].dayNum}`, () => {
          // Undo: move it back
          // The item now has a new ID in the target day — find it by title
          const targetItems = isSchedule ? getSchedule(toDayIdx) : getWishlist(toDayIdx);
          const movedItem = targetItems.find(i => i.title === itemData.title);
          if (movedItem) {
            if (isSchedule) {
              deleteScheduleItem(toDayIdx, movedItem.id);
              addScheduleItem(dayIdx, { ...itemData });
            } else {
              deleteWishlistItem(toDayIdx, movedItem.id);
              addWishlistItem(dayIdx, { ...itemData });
            }
            saveEdits();
          }
          openDayPanel(dayIdx);
          renderDayList(getActiveFilter());
        });

        openDayPanel(dayIdx);
        renderDayList(getActiveFilter());
      };

      if (!isSamePlace) {
        const targetName = trip.places[targetPlace]?.name || targetPlace;
        const warning = isTransit
          ? `Day ${trip.days[toDayIdx].dayNum} is a transit day. Move activity there anyway?`
          : `Day ${trip.days[toDayIdx].dayNum} is in ${targetName} (different from current place). Move anyway?`;
        if (!confirm(warning)) {
          // Reset dropdown
          select.value = dayIdx;
          return;
        }
      }

      doMove();
    });
  });

  // Time input changes — just store the value, don't auto-promote
  // Promotion only happens via the explicit "Move to Schedule" button

  // Add buttons
  panel.querySelectorAll('.panel-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      showPanelAddForm(dayIdx, section, btn);
    });
  });
}

function showPanelAddForm(dayIdx, section, afterEl) {
  // Remove any existing form
  const existing = $('#panel-add-form');
  if (existing) existing.remove();

  const typeOptions = Object.entries(ITEM_TYPES).map(([k, v]) =>
    `<option value="${k}">${v.icon} ${v.label}</option>`
  ).join('');

  const form = document.createElement('form');
  form.id = 'panel-add-form';
  form.className = 'panel-add-form';
  form.innerHTML = `
    <div class="paf-toggle-row">
      <button type="button" class="paf-toggle active" data-target="schedule">Schedule</button>
      <button type="button" class="paf-toggle" data-target="wishlist">Wishlist</button>
    </div>
    <input type="hidden" name="section" value="schedule">
    <div class="paf-row">
      <select name="type" class="paf-type">${typeOptions}</select>
      <input type="time" name="time" class="paf-time">
    </div>
    <input type="text" name="title" class="paf-title" placeholder="Activity name..." required autofocus>
    <input type="text" name="notes" class="paf-notes" placeholder="Notes (optional)">
    <div class="paf-actions">
      <button type="submit" class="btn btn-primary btn-sm">Add</button>
      <button type="button" class="btn btn-outline btn-sm paf-cancel">Cancel</button>
    </div>`;

  afterEl.after(form);
  form.querySelector('.paf-title').focus();

  // Toggle Schedule / Wishlist
  const toggleBtns = form.querySelectorAll('.paf-toggle');
  const sectionInput = form.querySelector('[name="section"]');
  const timeInput = form.querySelector('.paf-time');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sectionInput.value = btn.dataset.target;
      // Show/hide time input based on section
      timeInput.style.display = btn.dataset.target === 'schedule' ? '' : 'none';
    });
  });

  form.querySelector('.paf-cancel').addEventListener('click', () => form.remove());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const title = fd.get('title').toString().trim();
    if (!title) return;
    const targetSection = fd.get('section');

    const item = {
      id: generateId(),
      type: fd.get('type'),
      title,
      notes: fd.get('notes')?.toString().trim() || '',
      status: targetSection === 'schedule' ? 'tentative' : 'wishlist',
    };

    if (targetSection === 'schedule') {
      item.time = fd.get('time') || null;
      item.ampm = item.time ? null : 'AM';
      addScheduleItem(dayIdx, item);
    } else {
      item.time = null;
      item.ampm = null;
      addWishlistItem(dayIdx, item);
    }

    form.remove();
    openDayPanel(dayIdx);
    renderDayList(getActiveFilter());
    showToast('Activity added');
  });
}

function getActiveFilter() {
  const active = $('.filter-pill.active');
  return active ? active.dataset.place : 'all';
}

// ===================================================================
//  ADD PLACE MODAL
// ===================================================================

function openAddPlaceModal() {
  const modal = $('#add-place-modal');
  if (modal) {
    modal.classList.add('open');
    modal.querySelector('.apm-name').focus();
  }
}

function closeAddPlaceModal() {
  const modal = $('#add-place-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.querySelector('form').reset();
  }
}

function initAddPlaceModal() {
  const modal = $('#add-place-modal');
  if (!modal) return;

  modal.querySelectorAll('.apm-close').forEach(btn => btn.addEventListener('click', closeAddPlaceModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAddPlaceModal();
  });

  // Wire up date range picker for the add-place modal
  const apmDateRange = modal.querySelector('.apm-date-range');
  const apmStart = modal.querySelector('.apm-start');
  const apmEnd = modal.querySelector('.apm-end');
  const apmNights = modal.querySelector('.apm-nights');
  if (apmDateRange && window.flatpickr) {
    const { min, max } = tripDateRange();
    const maxPlus = max ? (() => { const d = new Date(max + 'T00:00:00'); d.setDate(d.getDate() + 1); return d; })() : null;
    flatpickr(apmDateRange, {
      mode: 'range',
      dateFormat: 'M j, Y',
      rangeSeparator: ' → ',
      minDate: min || null,
      maxDate: maxPlus || null,
      onChange(selectedDates) {
        apmStart.value = selectedDates[0] ? selectedDates[0].toISOString().slice(0, 10) : '';
        apmEnd.value   = selectedDates[1] ? selectedDates[1].toISOString().slice(0, 10) : '';
        if (apmNights) apmNights.value = calcNights(apmStart.value, apmEnd.value) || (apmStart.value ? 1 : '');
      }
    });
  }

  modal.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name').toString().trim();
    if (!name) return;

    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const startDate = fd.get('startDate') || '';
    const endDate = fd.get('endDate') || '';
    const nights = calcNights(startDate, endDate) || parseInt(fd.get('nights')) || 1;
    const dates = (startDate && endDate)
      ? `${new Date(startDate+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}–${new Date(endDate+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}`
      : 'TBD';
    const lat = parseFloat(fd.get('lat')) || null;
    const lng = parseFloat(fd.get('lng')) || null;

    // Pick a color
    const colors = ['#1e3a5f', '#4d7c0f', '#c53d2d', '#b8860b', '#0d6e6e', '#7c3aed', '#db2777'];
    const usedColors = Object.values(trip.places).map(p => p.color);
    const color = colors.find(c => !usedColors.includes(c)) || colors[Math.floor(Math.random() * colors.length)];

    // Add to places
    trip.places[key] = {
      name, color, bg: '#f5f0e8', emoji: '📍', img: '', lat, lng,
    };

    // Add to route
    trip.route.push({ city: name, dates, nights, key });

    // Save and re-render
    saveTrip();
    closeAddPlaceModal();
    renderPlaces();
    renderRouteMap();
    renderFilterBar();
    showToast(`${name} added to your trip`);
  });
}

// ===================================================================
//  DELETE PLACE
// ===================================================================

function deletePlaceConfirm(placeKey) {
  const place = trip.places[placeKey];
  if (!place) return;
  const dayCount = trip.days.filter(d => d.placeKey === placeKey).length;
  const msg = dayCount > 0
    ? `Remove ${place.name} and its ${dayCount} day${dayCount > 1 ? 's' : ''} from your trip? This cannot be undone.`
    : `Remove ${place.name} from your trip? This cannot be undone.`;

  if (!confirm(msg)) return;

  // Remove days
  trip.days = trip.days.filter(d => d.placeKey !== placeKey);
  // Renumber
  trip.days.forEach((d, i) => d.dayNum = i + 1);
  // Remove from route
  trip.route = trip.route.filter(r => r.key !== placeKey);
  // Remove place
  delete trip.places[placeKey];

  saveTrip();
  renderPlaces();
  renderRouteMap();
  renderFilterBar();
  renderDayList('all');
  showToast(`${place.name} removed`);
}

// ===================================================================
//  RENDER: Bookings
// ===================================================================

let bookingFilter = 'all';
let bookingPlaceFilter = 'all';

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const a = new Date(checkIn + 'T00:00:00');
  const b = new Date(checkOut + 'T00:00:00');
  const n = Math.round((b - a) / 86400000);
  return n > 0 ? n : null;
}

function fmtBookingDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function fmtTime12(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function getBookingSortDate(b) {
  if (b.category === 'hotel') return b.checkIn || '9999';
  if (b.category === 'flight') return b.outbound?.departDate || '9999';
  if (b.category === 'rail') return b.transitDate || b.legs?.[0]?.date || '9999';
  return '9999';
}

function sortBookings() {
  trip.bookings.sort((a, b) => getBookingSortDate(a).localeCompare(getBookingSortDate(b)));
}

function renderBookingBody(b) {
  if (b.category === 'hotel') {
    const nights = calcNights(b.checkIn, b.checkOut);
    const nightsLabel = nights ? `${nights} night${nights > 1 ? 's' : ''}` : '';
    const firstNoteLine = (b.notes || '').split('\n')[0];
    return `
      <dl class="booking-dl">
        <dt>Dates</dt><dd>${fmtBookingDate(b.checkIn)} → ${fmtBookingDate(b.checkOut)}${nightsLabel ? ` <span class="booking-nights">(${nightsLabel})</span>` : ''}</dd>
        ${b.confirmation ? `<dt>Confirmation</dt><dd class="booking-mono">${escHtml(b.confirmation)}</dd>` : ''}
        ${b.cost ? `<dt>Cost</dt><dd>${escHtml(b.cost)}</dd>` : ''}
        ${firstNoteLine ? `<dt>Room</dt><dd>${escHtml(firstNoteLine)}</dd>` : ''}
      </dl>`;
  }

  if (b.category === 'flight') {
    const renderLeg = (leg, label) => {
      if (!leg || !leg.departAirport) return '';
      return `
        <div class="booking-flight-leg">
          <span class="booking-flight-label">${label}</span>
          <span class="booking-flight-route">${leg.departAirport} → ${leg.arriveAirport}</span>
          <span class="booking-flight-detail">${leg.flight} · ${fmtBookingDate(leg.departDate)} · ${fmtTime12(leg.departTime)} – ${fmtTime12(leg.arriveTime)}${leg.arriveDate !== leg.departDate ? ' (+1)' : ''}</span>
        </div>`;
    };
    return `
      <div class="booking-flights">
        ${renderLeg(b.outbound, 'Outbound')}
        ${renderLeg(b.inbound, 'Return')}
      </div>
      <dl class="booking-dl">
        ${b.confirmation ? `<dt>Confirmation</dt><dd class="booking-mono">${escHtml(b.confirmation)}</dd>` : ''}
        ${b.cost ? `<dt>Cost</dt><dd>${escHtml(b.cost)}</dd>` : ''}
        ${b.notes ? `<dt>Aircraft</dt><dd>${escHtml(b.notes)}</dd>` : ''}
      </dl>`;
  }

  if (b.category === 'rail') {
    const route = (b.transitFrom && b.transitTo)
      ? `${escHtml(b.transitFrom)} → ${escHtml(b.transitTo)}`
      : (b.legs?.[0]?.route ? escHtml(b.legs[0].route) : '');
    const date = b.transitDate || b.legs?.[0]?.date || '';
    const time = b.transitTime ? ` · ${fmtTime12(b.transitTime)}` : '';
    return `
      <dl class="booking-dl">
        ${route ? `<dt>Route</dt><dd>${route}</dd>` : ''}
        ${date ? `<dt>Date</dt><dd>${fmtBookingDate(date)}${time}</dd>` : ''}
        ${b.confirmation ? `<dt>Confirmation</dt><dd class="booking-mono">${escHtml(b.confirmation)}</dd>` : ''}
        ${b.cost ? `<dt>Cost</dt><dd>${escHtml(b.cost)}</dd>` : ''}
      </dl>`;
  }

  return `<dl class="booking-dl">
    ${b.confirmation ? `<dt>Confirmation</dt><dd class="booking-mono">${escHtml(b.confirmation)}</dd>` : ''}
    ${b.cost ? `<dt>Cost</dt><dd>${escHtml(b.cost)}</dd>` : ''}
    ${b.notes ? `<dt>Notes</dt><dd>${escHtml(b.notes)}</dd>` : ''}
  </dl>`;
}

function bookingMetaLine(b) {
  const conf = b.confirmation ? ` · #${b.confirmation}` : '';
  if (b.category === 'hotel') {
    const nights = calcNights(b.checkIn, b.checkOut);
    const n = nights ? ` · ${nights} night${nights > 1 ? 's' : ''}` : '';
    const from = b.checkIn ? new Date(b.checkIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    const to = b.checkOut ? new Date(b.checkOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    const dates = from && to ? `${from} → ${to}${n}` : (from || '');
    return dates + conf;
  }
  if (b.category === 'flight') {
    const ob = b.outbound;
    if (!ob?.departAirport) return '';
    const date = ob.departDate ? new Date(ob.departDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    const time = ob.departTime ? ` · ${fmtTime12(ob.departTime)}` : '';
    return `${ob.departAirport} → ${ob.arriveAirport}${date ? ' · ' + date : ''}${time}${conf}`;
  }
  if (b.category === 'rail') {
    const from = b.transitFrom || '';
    const to = b.transitTo || '';
    const date = b.transitDate ? new Date(b.transitDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    const time = b.transitTime ? ` · ${fmtTime12(b.transitTime)}` : '';
    const route = from && to ? `${from} → ${to}` : (from || to || '');
    return `${route}${date ? ' · ' + date : ''}${time}${conf}`;
  }
  return '';
}

function bookingVendorLabel(b) {
  if (b.category === 'hotel') return 'Hotel site';
  if (b.category === 'flight') return 'Airline';
  if (b.category === 'rail') return 'Rail / Bus';
  return 'Website';
}

function renderBookingFilters() {
  const bar = $('#booking-filters');
  if (!bar) return;

  const cats = [
    { key: 'all', label: 'All' },
    { key: 'hotel', label: 'Hotels' },
    { key: 'flight', label: 'Flights' },
    { key: 'rail', label: 'Rail' },
  ];

  // Place dropdown — only show if 2+ places have bookings
  const usedPlaceKeys = [...new Set(trip.bookings.map(b => b.colorKey).filter(Boolean))];
  const places = usedPlaceKeys.map(k => ({ key: k, place: trip.places[k] })).filter(({ place }) => place);

  const placeDropdown = places.length > 1 ? `
    <select class="bf-place-select" id="bf-place-select">
      <option value="all">All places</option>
      ${places.map(({ key, place }) =>
        `<option value="${key}"${bookingPlaceFilter === key ? ' selected' : ''}>${place.emoji || ''} ${place.name}</option>`
      ).join('')}
    </select>` : '';

  bar.innerHTML = `
    <div class="bf-filter-bar">
      ${cats.map(c => `<button class="filter-pill${bookingFilter === c.key ? ' active' : ''}" data-bfilter="${c.key}"${c.key === 'all' ? ' data-place="all"' : ''}>${c.label}</button>`).join('')}
      ${placeDropdown}
    </div>`;

  bar.querySelectorAll('[data-bfilter]').forEach(btn => {
    btn.addEventListener('click', () => { bookingFilter = btn.dataset.bfilter; renderBookingFilters(); renderBookings(); });
  });
  const sel = bar.querySelector('#bf-place-select');
  if (sel) sel.addEventListener('change', () => { bookingPlaceFilter = sel.value; renderBookings(); });
}

function renderBookings() {
  const container = $('#booking-grid');
  if (!container) return;

  sortBookings();

  let filtered = trip.bookings;
  if (bookingFilter !== 'all') filtered = filtered.filter(b => b.category === bookingFilter);
  if (bookingPlaceFilter !== 'all') filtered = filtered.filter(b => b.colorKey === bookingPlaceFilter);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="booking-empty">No bookings match this filter.</div>`;
    return;
  }

  const rows = filtered.map(b => {
    const idx = trip.bookings.indexOf(b);
    const place = trip.places[b.colorKey] || trip.places.transit || { name: 'Trip', color: '#78716c', bg: '#f5f0e8', emoji: '' };
    const icon = ICONS[b.icon] || ICONS.hotel;
    const catLabel = b.category === 'flight' ? 'Flight' : b.category === 'rail' ? 'Rail' : 'Hotel';
    const meta = bookingMetaLine(b);
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(b.title + ' Japan')}`;
    const vendorLabel = bookingVendorLabel(b);

    return `
      <div class="bm-row" data-idx="${idx}" title="Click to edit">
        <div class="bm-icon">${icon}</div>
        <div class="bm-info">
          <div class="bm-badges">
            <span class="place-pill" style="background:${place.bg || '#f5f0e8'};color:${place.color}">${place.emoji ? place.emoji + ' ' : ''}${escHtml(place.name)}</span>
            <span class="bm-cat">${catLabel}</span>
          </div>
          <div class="bm-title">${escHtml(b.title)}</div>
          ${meta ? `<div class="bm-meta">${meta}</div>` : ''}
        </div>
        <div class="bm-actions">
          <a href="${mapsUrl}" target="_blank" rel="noreferrer" class="bm-icon-link bm-link-map" title="Map" onclick="event.stopPropagation()">${ICONS.map}</a>
          ${b.url ? `<a href="${escHtml(b.url)}" target="_blank" rel="noreferrer" class="bm-icon-link bm-link-vendor" title="${vendorLabel}" onclick="event.stopPropagation()">${ICONS.arrow}</a>` : ''}
          <div class="bm-chevron">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>`;
  });

  container.innerHTML = rows.join('');

  // Click row → open editor (but not on the icon links)
  container.querySelectorAll('.bm-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.bm-icon-link')) return;
      openBookingEditor(parseInt(row.dataset.idx));
    });
  });
}

// ===================================================================
//  WORKER / EMAIL INBOX
// ===================================================================

const WORKER_URL = 'https://raahi-worker.prashant-balepur.workers.dev';

async function fetchPending() {
  try {
    const res = await fetch(`${WORKER_URL}/api/pending`);
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

async function acceptPending(id) {
  try {
    const res = await fetch(`${WORKER_URL}/api/pending/${id}/accept`, { method: 'POST' });
    return res.ok;
  } catch { return false; }
}

async function rejectPending(id) {
  try {
    const res = await fetch(`${WORKER_URL}/api/pending/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch { return false; }
}

// Convert Worker booking format → app booking format
function workerBookingToLocal(wb) {
  const categoryMap = {
    hotel: 'hotel', flight: 'flight',
    train: 'rail', transport: 'rail',
    restaurant: 'hotel', activity: 'hotel', other: 'hotel'
  };
  const iconMap = {
    hotel: 'hotel', flight: 'plane',
    train: 'train', transport: 'train',
    restaurant: 'hotel', activity: 'hotel', other: 'hotel'
  };

  const category = categoryMap[wb.type] || 'hotel';

  // Match city name → colorKey
  let colorKey = 'transit';
  if (wb.city) {
    const cityLower = wb.city.toLowerCase();
    Object.entries(trip.places || {}).forEach(([key, place]) => {
      const pname = (place.name || '').toLowerCase();
      if (pname.includes(cityLower) || cityLower.includes(pname)) colorKey = key;
    });
  }

  // Format cost string
  let costStr = '';
  if (wb.cost) {
    const syms = { JPY: '¥', USD: '$', EUR: '€', GBP: '£' };
    const sym = syms[wb.currency] || (wb.currency ? wb.currency + ' ' : '');
    costStr = wb.currency === 'JPY'
      ? `${sym}${Math.round(wb.cost).toLocaleString()}`
      : `${sym}${wb.cost}`;
  }

  const booking = {
    id:           generateId(),
    category,
    icon:         iconMap[wb.type] || 'hotel',
    title:        wb.name || 'Booking',
    confirmation: wb.confirmationNumber || '',
    colorKey,
    cost:         costStr,
    notes:        wb.notes || '',
  };

  if (category === 'hotel') {
    booking.checkIn  = wb.checkIn  || '';
    booking.checkOut = wb.checkOut || '';
  } else if (category === 'rail') {
    // Claude returns structured train fields
    booking.transitDate = wb.transitDate || wb.checkIn || '';
    booking.transitTime = wb.transitTime || wb.time    || '';
    booking.transitFrom = wb.transitFrom || '';
    booking.transitTo   = wb.transitTo   || '';
  } else if (category === 'flight') {
    // Claude returns outbound/inbound leg objects — pass them straight through
    const emptyLeg = { flight: '', departAirport: '', arriveAirport: '', departDate: '', departTime: '', arriveDate: '', arriveTime: '' };
    booking.outbound = wb.outbound ? { ...emptyLeg, ...wb.outbound } : emptyLeg;
    booking.inbound  = wb.inbound  ? { ...emptyLeg, ...wb.inbound  } : emptyLeg;
  }

  return booking;
}

let pendingBookings = [];

function updateInboxBadge(count) {
  const badge = $('#inbox-badge');
  if (!badge) return;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

const INBOX_ICONS = {
  hotel: '🏨', flight: '✈️', train: '🚅', transport: '🚌',
  restaurant: '🍽️', activity: '⛩️', other: '📋',
};

function renderInbox(items) {
  const container = $('#inbox-section');
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="inbox-wrap">
      <div class="inbox-header">
        <span class="inbox-title">📬 From email <span class="inbox-count">${items.length}</span></span>
        <span class="inbox-hint">Review and add to your trip</span>
      </div>
      <div class="inbox-list">
        ${items.map(wb => {
          const icon = INBOX_ICONS[wb.type] || '📋';

          // Build route + date lines per booking type
          let routeStr = '', dateStr = '';
          if (wb.type === 'flight') {
            const ob = wb.outbound || {};
            const ib = wb.inbound  || {};
            const hasReturn = !!(ib.departDate);
            const arrow = hasReturn ? '↔' : '→';
            routeStr = (ob.departAirport || ob.arriveAirport)
              ? `${ob.departAirport || '?'} ${arrow} ${ob.arriveAirport || '?'}`
              : '';
            const dep = ob.departDate ? fmtBookingDate(ob.departDate) : '';
            const ret = hasReturn     ? fmtBookingDate(ib.departDate) : '';
            dateStr = dep ? (ret ? `${dep} → ${ret}` : dep) : '';
          } else if (wb.type === 'train') {
            routeStr = (wb.transitFrom || wb.transitTo)
              ? `${wb.transitFrom || '?'} → ${wb.transitTo || '?'}`
              : '';
            dateStr = wb.transitDate ? fmtBookingDate(wb.transitDate) : '';
          } else {
            const d1 = wb.checkIn  ? fmtBookingDate(wb.checkIn)  : '';
            const d2 = wb.checkOut ? fmtBookingDate(wb.checkOut) : '';
            dateStr = d1 ? (d2 ? `${d1} → ${d2}` : d1) : '';
          }

          const confBadge = wb.confidence === 'low'
            ? '<span class="inbox-conf inbox-conf-low">low confidence</span>'
            : wb.confidence === 'medium'
              ? '<span class="inbox-conf inbox-conf-med">review</span>'
              : '';
          return `
            <div class="inbox-card" data-id="${wb.id}">
              <div class="inbox-card-icon">${icon}</div>
              <div class="inbox-card-body">
                <div class="inbox-card-name">${escHtml(wb.name || 'Booking')} ${confBadge}</div>
                ${routeStr ? `<div class="inbox-card-date">${escHtml(routeStr)}</div>` : ''}
                ${dateStr  ? `<div class="inbox-card-meta">${dateStr}</div>`            : ''}
                ${!routeStr && wb.city ? `<div class="inbox-card-meta">${escHtml(wb.city)}</div>` : ''}
                ${wb.confirmationNumber ? `<div class="inbox-card-meta">Ref: ${escHtml(wb.confirmationNumber)}</div>` : ''}
              </div>
              <div class="inbox-card-actions">
                <button class="inbox-btn inbox-btn-accept" data-id="${wb.id}">✓ Add</button>
                <button class="inbox-btn inbox-btn-reject" data-id="${wb.id}">✕</button>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>`;

  // Accept
  container.querySelectorAll('.inbox-btn-accept').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const wb = pendingBookings.find(b => b.id === id);
      if (!wb) return;
      btn.textContent = '…';
      btn.disabled = true;
      const ok = await acceptPending(id);
      if (ok) {
        trip.bookings.push(workerBookingToLocal(wb));
        saveTrip();
        pendingBookings = pendingBookings.filter(b => b.id !== id);
        renderInbox(pendingBookings);
        renderBookings();
        updateInboxBadge(pendingBookings.length);
      } else {
        btn.textContent = '✓ Add';
        btn.disabled = false;
      }
    });
  });

  // Reject
  container.querySelectorAll('.inbox-btn-reject').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      btn.closest('.inbox-card').style.opacity = '0.4';
      await rejectPending(id);
      pendingBookings = pendingBookings.filter(b => b.id !== id);
      renderInbox(pendingBookings);
      updateInboxBadge(pendingBookings.length);
    });
  });
}

async function initInbox() {
  pendingBookings = await fetchPending();
  renderInbox(pendingBookings);
  updateInboxBadge(pendingBookings.length);

  // Poll every 30s for new bookings, but only when the page is visible
  setInterval(async () => {
    if (document.visibilityState !== 'visible') return;
    const fresh = await fetchPending();
    if (JSON.stringify(fresh) !== JSON.stringify(pendingBookings)) {
      pendingBookings = fresh;
      renderInbox(pendingBookings);
      updateInboxBadge(pendingBookings.length);
    }
  }, 30_000);

  // Also refresh immediately when the user switches back to this tab
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible') return;
    const fresh = await fetchPending();
    if (JSON.stringify(fresh) !== JSON.stringify(pendingBookings)) {
      pendingBookings = fresh;
      renderInbox(pendingBookings);
      updateInboxBadge(pendingBookings.length);
    }
  });
}

// ===================================================================
//  Booking Panel (slide-out editor)
// ===================================================================

function tripDateRange() {
  return { min: trip.meta.startDate || '', max: trip.meta.endDate || '' };
}

function placePickerHtml(selected, required) {
  const opts = Object.entries(trip.places)
    .filter(([k]) => k !== 'home')
    .map(([key, p]) => `<option value="${key}"${key === selected ? ' selected' : ''}>${p.emoji} ${p.name}</option>`)
    .join('');
  return `<option value=""${!selected ? ' selected' : ''}>— Select place —</option>${opts}`;
}

function openBookingPanel(title, formHtml, onSubmit, onDelete) {
  const panel = $('#booking-panel');
  const body = $('#booking-panel-body');
  const titleEl = panel.querySelector('.booking-panel-title');
  titleEl.textContent = title;

  body.innerHTML = `<form class="bpf" id="bpf-form">${formHtml}
    <div class="bpf-actions">
      <button type="submit" class="btn btn-primary">Save</button>
      ${onDelete ? '<button type="button" class="btn btn-danger bpf-delete">Delete Booking</button>' : ''}
    </div>
  </form>`;

  panel.classList.add('open');
  const form = body.querySelector('#bpf-form');

  // Wire up date helpers
  wireUpDateHelpers(form);

  // Close handlers
  const close = () => panel.classList.remove('open');
  panel.querySelector('.booking-panel-close').onclick = close;
  panel.querySelector('.booking-panel-backdrop').onclick = close;

  // Delete
  const delBtn = form.querySelector('.bpf-delete');
  if (delBtn && onDelete) delBtn.addEventListener('click', () => { close(); onDelete(); });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    close();
    onSubmit(new FormData(form));
  });

  // Focus first input after a tick (panel animation)
  setTimeout(() => {
    const first = form.querySelector('input:not([readonly]):not([type="hidden"]), select');
    if (first) first.focus();
  }, 100);
}

function placeKeyForDate(dateStr) {
  if (!dateStr) return null;
  const day = trip.days.find(d => d.date === dateStr);
  return day?.placeKey || null;
}

function wireUpDateHelpers(form) {
  const { min, max } = tripDateRange();

  // Set all date inputs to trip range so picker opens in the right month
  form.querySelectorAll('input[type="date"]').forEach(inp => {
    if (!inp.min) inp.min = min;
    if (!inp.max) {
      const maxPlus = new Date(max + 'T00:00:00');
      maxPlus.setDate(maxPlus.getDate() + 1);
      inp.max = maxPlus.toISOString().slice(0, 10);
    }
  });

  // Auto-suggest place from check-in date
  const placeSel = form.querySelector('select[name="colorKey"]');
  const autoSuggestPlace = (dateStr) => {
    if (!placeSel || !dateStr) return;
    const key = placeKeyForDate(dateStr);
    if (key && placeSel.value === '') placeSel.value = key;
  };

  // Hotel stay dates — single range picker
  const rangeInput = form.querySelector('.bpf-date-range');
  const ciHidden   = form.querySelector('input[name="checkIn"]');
  const coHidden   = form.querySelector('input[name="checkOut"]');
  const nights     = form.querySelector('input[name="_nights"]');
  if (rangeInput && ciHidden && coHidden && window.flatpickr) {
    const maxPlus = max ? (() => { const d = new Date(max + 'T00:00:00'); d.setDate(d.getDate() + 1); return d; })() : null;
    const fp = flatpickr(rangeInput, {
      mode: 'range',
      dateFormat: 'M j, Y',
      rangeSeparator: ' → ',
      minDate: min || null,
      maxDate: maxPlus || null,
      onChange(selectedDates) {
        ciHidden.value = selectedDates[0] ? selectedDates[0].toISOString().slice(0, 10) : '';
        coHidden.value = selectedDates[1] ? selectedDates[1].toISOString().slice(0, 10) : '';
        if (nights) nights.value = calcNights(ciHidden.value, coHidden.value) || '';
        autoSuggestPlace(ciHidden.value);
      }
    });
    // Pre-fill existing dates — must parse to Date objects first;
    // also fix the display value since setDate ignores rangeSeparator
    if (ciHidden.value && coHidden.value) {
      const d1 = fp.parseDate(ciHidden.value, 'Y-m-d');
      const d2 = fp.parseDate(coHidden.value, 'Y-m-d');
      fp.setDate([d1, d2]);
      rangeInput.value = fp.selectedDates.map(d => fp.formatDate(d, fp.config.dateFormat)).join(fp.config.rangeSeparator);
    }
  }

  // Transit date → auto-suggest place
  const td = form.querySelector('input[name="transitDate"]');
  if (td) {
    td.addEventListener('change', () => autoSuggestPlace(td.value));
  }

  // Transit From/To "Other" toggle + hidden input sync
  form.querySelectorAll('.bpf-place-or-other').forEach(wrapper => {
    const sel = wrapper.querySelector('select');
    const otherInp = wrapper.querySelector('.bpf-other-input');
    const hidden = wrapper.querySelector('input[type="hidden"]');
    if (!sel || !otherInp || !hidden) return;
    const syncHidden = () => {
      hidden.value = sel.value === '__other__' ? otherInp.value.trim() : (sel.value || '');
    };
    const toggle = () => {
      if (sel.value === '__other__') {
        otherInp.style.display = '';
        otherInp.focus();
      } else {
        otherInp.style.display = 'none';
        otherInp.value = '';
      }
      syncHidden();
    };
    sel.addEventListener('change', toggle);
    otherInp.addEventListener('input', syncHidden);
    toggle();
  });

  // Auto-generate transit title from From/To
  const fromHidden = form.querySelector('input[name="transitFrom"]');
  const toHidden = form.querySelector('input[name="transitTo"]');
  const titleInp = form.querySelector('input[name="title"]');
  if (fromHidden && toHidden && titleInp) {
    const autoTitle = () => {
      const f = fromHidden.value, t = toHidden.value;
      if (!f && !t) return;
      const current = titleInp.value.trim();
      if (!current || /^.+ → .+$/.test(current) || current === '') {
        if (f && t) titleInp.value = `${f} → ${t}`;
        else if (f) titleInp.value = `${f} →`;
        else if (t) titleInp.value = `→ ${t}`;
      }
    };
    const observe = () => setTimeout(autoTitle, 0);
    form.querySelectorAll('.bpf-transit-sel').forEach(s => s.addEventListener('change', observe));
    form.querySelectorAll('.bpf-other-input').forEach(i => i.addEventListener('input', observe));
  }
}

function buildHotelFields(b) {
  const { min, max } = tripDateRange();
  return `
    <div class="bpf-field">
      <label>Place <span class="bpf-req">*</span></label>
      <select name="colorKey" class="bpf-select" required>${placePickerHtml(b.colorKey, true)}</select>
    </div>
    <div class="bpf-field">
      <label>Hotel name <span class="bpf-req">*</span></label>
      <input type="text" name="title" value="${escHtml(b.title)}" required placeholder="e.g. Aloft Tokyo Ginza">
    </div>
    <div class="bpf-row">
      <div class="bpf-field">
        <label>Stay dates <span class="bpf-req">*</span></label>
        <input type="text" class="bpf-date-range" placeholder="Check-in → Check-out" autocomplete="off" readonly>
        <input type="hidden" name="checkIn" value="${b.checkIn || ''}">
        <input type="hidden" name="checkOut" value="${b.checkOut || ''}">
      </div>
      <div class="bpf-field bpf-field-sm">
        <label>Nights</label>
        <input type="text" name="_nights" value="${calcNights(b.checkIn, b.checkOut) || ''}" readonly class="bpf-readonly">
      </div>
    </div>
    <div class="bpf-row">
      <div class="bpf-field">
        <label>Confirmation #</label>
        <input type="text" name="confirmation" value="${escHtml(b.confirmation || '')}">
      </div>
      <div class="bpf-field">
        <label>Cost</label>
        <input type="text" name="cost" value="${escHtml(b.cost || '')}" placeholder="e.g. $500 or 50,000 pts">
      </div>
    </div>
    <div class="bpf-field">
      <label>Notes</label>
      <textarea name="notes" rows="3" placeholder="Room type, address, phone...">${escHtml(b.notes || '')}</textarea>
    </div>
    <div class="bpf-field">
      <label>Booking URL</label>
      <input type="url" name="url" value="${escHtml(b.url || '')}" placeholder="https://...">
    </div>`;
}

function buildFlightFields(b) {
  const legHtml = (leg, prefix, label) => {
    if (!leg) leg = {};
    return `
    <fieldset class="bpf-fieldset">
      <legend>${label}</legend>
      <div class="bpf-row">
        <div class="bpf-field"><label>Flight #</label>
          <input type="text" name="${prefix}_flight" value="${escHtml(leg.flight || '')}" placeholder="UA 837"></div>
        <div class="bpf-field"><label>From</label>
          <input type="text" name="${prefix}_departAirport" value="${escHtml(leg.departAirport || '')}" placeholder="SFO" maxlength="4" style="text-transform:uppercase"></div>
        <div class="bpf-field"><label>To</label>
          <input type="text" name="${prefix}_arriveAirport" value="${escHtml(leg.arriveAirport || '')}" placeholder="NRT" maxlength="4" style="text-transform:uppercase"></div>
      </div>
      <div class="bpf-row">
        <div class="bpf-field"><label>Depart</label>
          <input type="date" name="${prefix}_departDate" value="${leg.departDate || ''}"></div>
        <div class="bpf-field"><label>Time</label>
          <input type="time" name="${prefix}_departTime" value="${leg.departTime || ''}"></div>
      </div>
      <div class="bpf-row">
        <div class="bpf-field"><label>Arrive</label>
          <input type="date" name="${prefix}_arriveDate" value="${leg.arriveDate || ''}"></div>
        <div class="bpf-field"><label>Time</label>
          <input type="time" name="${prefix}_arriveTime" value="${leg.arriveTime || ''}"></div>
      </div>
    </fieldset>`;
  };
  return `
    <div class="bpf-field">
      <label>Place</label>
      <select name="colorKey" class="bpf-select">${placePickerHtml(b.colorKey, false)}</select>
    </div>
    <div class="bpf-field">
      <label>Title <span class="bpf-req">*</span></label>
      <input type="text" name="title" value="${escHtml(b.title)}" required placeholder="e.g. United SFO ↔ NRT">
    </div>
    ${legHtml(b.outbound, 'out', 'Outbound')}
    ${legHtml(b.inbound, 'in', 'Return')}
    <div class="bpf-row">
      <div class="bpf-field"><label>Confirmation #</label>
        <input type="text" name="confirmation" value="${escHtml(b.confirmation || '')}"></div>
      <div class="bpf-field"><label>Cost</label>
        <input type="text" name="cost" value="${escHtml(b.cost || '')}"></div>
    </div>
    <div class="bpf-field">
      <label>Notes</label>
      <textarea name="notes" rows="2" placeholder="Aircraft, class...">${escHtml(b.notes || '')}</textarea>
    </div>
    <div class="bpf-field">
      <label>Booking URL</label>
      <input type="url" name="url" value="${escHtml(b.url || '')}" placeholder="https://...">
    </div>`;
}

function transitPlacePickerHtml(selected) {
  const places = Object.entries(trip.places)
    .filter(([k]) => k !== 'home')
    .map(([key, p]) => ({ key, name: p.name, emoji: p.emoji }));
  const matchKey = places.find(p => p.name === selected);
  const isOther = selected && !matchKey;
  let opts = '<option value="">—</option>';
  places.forEach(p => {
    opts += `<option value="${escHtml(p.name)}"${p.name === selected ? ' selected' : ''}>${p.emoji} ${p.name}</option>`;
  });
  opts += `<option value="__other__"${isOther ? ' selected' : ''}>Other…</option>`;
  return opts;
}

function buildTransitFields(b) {
  const { min, max } = tripDateRange();
  const fromIsOther = b.transitFrom && !Object.values(trip.places).some(p => p.name === b.transitFrom);
  const toIsOther = b.transitTo && !Object.values(trip.places).some(p => p.name === b.transitTo);
  return `
    <div class="bpf-field">
      <label>Place</label>
      <select name="colorKey" class="bpf-select">${placePickerHtml(b.colorKey, false)}</select>
    </div>
    <div class="bpf-field">
      <label>Title <span class="bpf-req">*</span></label>
      <input type="text" name="title" value="${escHtml(b.title)}" required placeholder="e.g. Shinkansen Tokyo → Kyoto">
    </div>
    <div class="bpf-row">
      <div class="bpf-field"><label>Date <span class="bpf-req">*</span></label>
        <input type="date" name="transitDate" value="${b.transitDate || (b.legs?.[0]?.date) || ''}" required min="${min}" max="${max}"></div>
      <div class="bpf-field"><label>Time</label>
        <input type="time" name="transitTime" value="${b.transitTime || ''}"></div>
    </div>
    <div class="bpf-row">
      <div class="bpf-field bpf-place-or-other"><label>From</label>
        <input type="hidden" name="transitFrom" value="${escHtml(b.transitFrom || '')}">
        <select class="bpf-select bpf-transit-sel">${transitPlacePickerHtml(b.transitFrom || '')}</select>
        <input type="text" class="bpf-other-input" value="${fromIsOther ? escHtml(b.transitFrom) : ''}" placeholder="Enter location" style="display:${fromIsOther ? '' : 'none'}; margin-top:6px">
      </div>
      <div class="bpf-field bpf-place-or-other"><label>To</label>
        <input type="hidden" name="transitTo" value="${escHtml(b.transitTo || '')}">
        <select class="bpf-select bpf-transit-sel">${transitPlacePickerHtml(b.transitTo || '')}</select>
        <input type="text" class="bpf-other-input" value="${toIsOther ? escHtml(b.transitTo) : ''}" placeholder="Enter location" style="display:${toIsOther ? '' : 'none'}; margin-top:6px">
      </div>
    </div>
    <div class="bpf-row">
      <div class="bpf-field"><label>Confirmation #</label>
        <input type="text" name="confirmation" value="${escHtml(b.confirmation || '')}"></div>
      <div class="bpf-field"><label>Cost</label>
        <input type="text" name="cost" value="${escHtml(b.cost || '')}"></div>
    </div>
    <div class="bpf-field">
      <label>Notes</label>
      <textarea name="notes" rows="2" placeholder="Seat, platform...">${escHtml(b.notes || '')}</textarea>
    </div>
    <div class="bpf-field">
      <label>Booking URL</label>
      <input type="url" name="url" value="${escHtml(b.url || '')}" placeholder="https://...">
    </div>`;
}

function readFormIntoBooking(fd, booking) {
  booking.title = fd.get('title')?.toString().trim() || '';
  booking.colorKey = fd.get('colorKey')?.toString() || booking.colorKey || 'transit';
  booking.url = fd.get('url')?.toString().trim() || '';
  booking.confirmation = fd.get('confirmation')?.toString().trim() || '';
  booking.cost = fd.get('cost')?.toString().trim() || '';
  booking.notes = fd.get('notes')?.toString().trim() || '';

  if (booking.category === 'hotel') {
    booking.checkIn = fd.get('checkIn') || '';
    booking.checkOut = fd.get('checkOut') || '';
  } else if (booking.category === 'flight') {
    const readLeg = (prefix) => ({
      flight: fd.get(`${prefix}_flight`)?.toString().trim() || '',
      departAirport: fd.get(`${prefix}_departAirport`)?.toString().trim().toUpperCase() || '',
      arriveAirport: fd.get(`${prefix}_arriveAirport`)?.toString().trim().toUpperCase() || '',
      departDate: fd.get(`${prefix}_departDate`) || '',
      departTime: fd.get(`${prefix}_departTime`) || '',
      arriveDate: fd.get(`${prefix}_arriveDate`) || '',
      arriveTime: fd.get(`${prefix}_arriveTime`) || '',
    });
    booking.outbound = readLeg('out');
    booking.inbound = readLeg('in');
  } else if (booking.category === 'rail') {
    booking.transitDate = fd.get('transitDate') || '';
    booking.transitTime = fd.get('transitTime') || '';
    booking.transitFrom = fd.get('transitFrom')?.toString().trim() || '';
    booking.transitTo = fd.get('transitTo')?.toString().trim() || '';
  }
}

function openBookingEditor(idx) {
  const booking = trip.bookings[idx];
  if (!booking) return;
  const snapshot = JSON.parse(JSON.stringify(booking));

  let fields = '';
  if (booking.category === 'hotel') fields = buildHotelFields(booking);
  else if (booking.category === 'flight') fields = buildFlightFields(booking);
  else fields = buildTransitFields(booking);

  const catLabel = booking.category === 'flight' ? 'Flight' : booking.category === 'hotel' ? 'Hotel' : 'Transit';

  openBookingPanel(`Edit ${catLabel}`, fields,
    (fd) => {
      readFormIntoBooking(fd, booking);
      if (booking.category === 'hotel') syncBookingToStays(booking);
      sortBookings();
      saveTrip();
      renderBookings();
      renderPlaces();
      showUndoToast('Booking updated', () => {
        Object.assign(trip.bookings[trip.bookings.indexOf(booking)] || {}, snapshot);
        if (snapshot.category === 'hotel') syncBookingToStays(snapshot);
        sortBookings();
        saveTrip();
        renderBookings();
        renderPlaces();
      });
    },
    () => {
      if (booking.category === 'hotel') removeBookingStays(booking);
      trip.bookings.splice(trip.bookings.indexOf(booking), 1);
      saveTrip();
      renderBookings();
      renderPlaces();
      showUndoToast('Booking deleted', () => {
        trip.bookings.push(snapshot);
        if (snapshot.category === 'hotel') syncBookingToStays(snapshot);
        sortBookings();
        saveTrip();
        renderBookings();
        renderPlaces();
      });
    }
  );
}

function openNewBookingForm(category) {
  if (!category) {
    // Show type picker in the panel
    const pickerHtml = `
      <p class="bpf-hint">What type of booking?</p>
      <div class="bpf-type-grid">
        <button type="button" class="bpf-type-btn" data-cat="hotel">${ICONS.hotel}<span>Hotel</span></button>
        <button type="button" class="bpf-type-btn" data-cat="flight">${ICONS.plane}<span>Flight</span></button>
        <button type="button" class="bpf-type-btn" data-cat="rail">${ICONS.train}<span>Rail / Bus</span></button>
      </div>`;
    openBookingPanel('New Booking', pickerHtml, () => {}, null);
    // Prevent form submit on type picker (no actual form fields yet)
    const form = $('#bpf-form');
    if (form) form.querySelector('.bpf-actions').style.display = 'none';
    // Wire type buttons
    document.querySelectorAll('.bpf-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $('#booking-panel').classList.remove('open');
        setTimeout(() => openNewBookingForm(btn.dataset.cat), 200);
      });
    });
    return;
  }

  const blank = {
    category,
    icon: category === 'flight' ? 'plane' : category === 'rail' ? 'train' : 'hotel',
    title: '', colorKey: '', confirmation: '', cost: '', notes: '', url: '',
  };
  if (category === 'hotel') { blank.checkIn = ''; blank.checkOut = ''; }
  if (category === 'flight') { blank.outbound = {}; blank.inbound = {}; }
  if (category === 'rail') { blank.transitDate = ''; blank.transitTime = ''; blank.transitFrom = ''; blank.transitTo = ''; }

  let fields = '';
  if (category === 'hotel') fields = buildHotelFields(blank);
  else if (category === 'flight') fields = buildFlightFields(blank);
  else fields = buildTransitFields(blank);

  const catLabel = category === 'flight' ? 'Flight' : category === 'hotel' ? 'Hotel' : 'Rail / Bus';

  openBookingPanel(`New ${catLabel}`, fields,
    (fd) => {
      readFormIntoBooking(fd, blank);
      trip.bookings.push(blank);
      if (category === 'hotel') syncBookingToStays(blank);
      sortBookings();
      saveTrip();
      renderBookings();
      renderPlaces();
      showUndoToast('Booking added', () => {
        const i = trip.bookings.indexOf(blank);
        if (i >= 0) {
          if (blank.category === 'hotel') removeBookingStays(blank);
          trip.bookings.splice(i, 1);
          saveTrip();
          renderBookings();
          renderPlaces();
        }
      });
    },
    null
  );
}

// Sync hotel booking dates/name to matching day.stay entries
function syncBookingToStays(hotelBooking) {
  if (hotelBooking.category !== 'hotel') return;
  const ci = hotelBooking.checkIn;
  const co = hotelBooking.checkOut;
  if (!ci || !co) return;

  trip.days.forEach(day => {
    if (day.date >= ci && day.date < co) {
      day.stay = day.stay || {};
      day.stay.hotel = hotelBooking.title;
      day.stay.confirmation = hotelBooking.confirmation || '';
      const firstNote = (hotelBooking.notes || '').split('\n')[0];
      if (firstNote) day.stay.room = firstNote;
    }
  });
}

// Remove day.stay entries for a deleted hotel booking
function removeBookingStays(hotelBooking) {
  if (hotelBooking.category !== 'hotel') return;
  const ci = hotelBooking.checkIn;
  const co = hotelBooking.checkOut;
  if (!ci || !co) return;

  trip.days.forEach(day => {
    if (day.date >= ci && day.date < co && day.stay?.hotel === hotelBooking.title) {
      day.stay = null;
    }
  });
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// ===================================================================
//  TRIP STATUS & COUNTDOWN
// ===================================================================

function getTripStatus() {
  const now = new Date();
  const tripStart = new Date(trip.meta.startDate + 'T00:00:00-07:00');
  const tripEnd = new Date(trip.meta.endDate + 'T00:00:00-07:00');
  tripEnd.setDate(tripEnd.getDate() + 1);

  if (now < tripStart) {
    return { phase: 'before', daysUntil: Math.ceil((tripStart - now) / 86400000) };
  }
  if (now >= tripEnd) {
    return { phase: 'after' };
  }

  const dayIndex = trip.days.findIndex(d => {
    const dayDate = parseDate(d.date);
    const nextDay = new Date(dayDate); nextDay.setDate(nextDay.getDate() + 1);
    return now >= dayDate && now < nextDay;
  });

  return { phase: 'during', dayIndex: dayIndex >= 0 ? dayIndex : 0, dayNum: dayIndex >= 0 ? dayIndex + 1 : 1 };
}

function renderCountdown() {
  const countdownEl = $('#countdown');
  if (!countdownEl) return;
  const status = getTripStatus();

  if (status.phase === 'before') {
    const firstDay = trip.days[0];
    const place = trip.places[firstDay.placeKey];
    const schedule = getSchedule(0);
    const firstItem = schedule[0];
    const detail = `Day 1: ${firstDay.title}${firstItem ? ' · ' + firstItem.title : ''}`;
    countdownEl.innerHTML = `
      <span class="countdown-main">${status.daysUntil} day${status.daysUntil !== 1 ? 's' : ''} until departure</span>
      <span class="countdown-detail">${detail}</span>`;
    countdownEl.dataset.dayIdx = '0';
    countdownEl.classList.add('countdown-clickable');
    countdownEl.onclick = () => openDayPanel(0);
  } else if (status.phase === 'during') {
    const todayIdx = status.dayIndex;
    const day = trip.days[todayIdx];
    const place = trip.places[day.placeKey];
    const schedule = getSchedule(todayIdx);
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    let nextItem = null;
    for (const item of schedule) {
      if (item.time) {
        const [hh, mm] = item.time.split(':').map(Number);
        if (hh * 60 + mm > nowMinutes) { nextItem = item; break; }
      }
    }
    const detail = nextItem
      ? `Next: ${to12h(nextItem.time)} ${nextItem.title}`
      : schedule.length > 0 ? `${schedule.length} activities today` : day.title;
    countdownEl.innerHTML = `
      <span class="countdown-main">Day ${status.dayNum} · ${place?.name || day.placeKey}</span>
      <span class="countdown-detail">${detail}</span>`;
    countdownEl.style.background = 'rgba(77,124,15,.25)';
    countdownEl.dataset.dayIdx = String(todayIdx);
    countdownEl.classList.add('countdown-clickable');
    countdownEl.onclick = () => openDayPanel(todayIdx);
  } else {
    countdownEl.textContent = 'Trip complete — welcome home!';
    countdownEl.style.background = 'rgba(197,61,45,.15)';
  }
}

function highlightToday() {
  const status = getTripStatus();
  if (status.phase !== 'during') return;

  requestAnimationFrame(() => {
    const cards = document.querySelectorAll('.day-card');
    if (!cards[status.dayIndex]) return;
    cards[status.dayIndex].classList.add('is-today');

    const header = cards[status.dayIndex].querySelector('.day-header');
    if (header && !header.querySelector('.today-badge')) {
      const badge = document.createElement('span');
      badge.className = 'today-badge';
      badge.textContent = 'Today';
      header.appendChild(badge);
    }
  });
}

function scrollToToday() {
  const status = getTripStatus();
  if (status.phase === 'during') {
    const cards = document.querySelectorAll('.day-card');
    if (cards[status.dayIndex]) {
      cards[status.dayIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Auto-open the panel for today
      setTimeout(() => openDayPanel(status.dayIndex), 500);
    }
  } else {
    showToast('Trip hasn\'t started yet — showing Day 1');
    const cards = document.querySelectorAll('.day-card');
    if (cards[0]) {
      cards[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// ===================================================================
//  BULK PASTE
// ===================================================================

function initBulkPaste() {
  const modal = $('#bulk-modal');
  const openBtn = $('#bulk-open-btn');
  const closeBtn = $('#bulk-close');
  const form = $('#bulk-form');
  const preview = $('#bulk-preview');
  const textarea = $('#bulk-text');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => { modal.classList.add('open'); textarea.focus(); });
  closeBtn.addEventListener('click', () => { modal.classList.remove('open'); form.reset(); preview.innerHTML = ''; });
  modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.remove('open'); form.reset(); preview.innerHTML = ''; } });

  textarea.addEventListener('input', () => {
    const lines = textarea.value.split('\n').filter(l => l.trim());
    const parsed = lines.map(parseBulkLine).filter(Boolean);
    preview.innerHTML = parsed.length
      ? parsed.map(p => {
          const typeInfo = ITEM_TYPES[p.type] || ITEM_TYPES.attraction;
          return `<div class="bulk-preview-item">
            <span>${typeInfo.icon}</span>
            <span>${p.dayNum ? `Day ${p.dayNum}` : '?'}</span>
            <span>${p.time ? to12h(p.time) : '—'}</span>
            <span>${p.title}</span>
          </div>`;
        }).join('')
      : '<p class="bulk-hint">Enter activities, one per line. Format: <code>Day 6 8:15am Shinkansen to Kyoto</code></p>';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lines = textarea.value.split('\n').filter(l => l.trim());
    const parsed = lines.map(parseBulkLine).filter(Boolean);
    let added = 0;

    parsed.forEach(p => {
      if (!p.dayNum || p.dayNum < 1 || p.dayNum > trip.days.length) return;
      const dayIdx = p.dayNum - 1;
      const item = { id: generateId(), type: p.type, title: p.title, notes: '', status: p.time ? 'tentative' : 'wishlist' };
      if (p.time) {
        item.time = p.time;
        item.ampm = null;
        addScheduleItem(dayIdx, item);
      } else {
        item.time = null;
        item.ampm = null;
        addWishlistItem(dayIdx, item);
      }
      added++;
    });

    modal.classList.remove('open');
    form.reset();
    preview.innerHTML = '';
    if (added > 0) {
      renderDayList(getActiveFilter());
      showToast(`Added ${added} activit${added > 1 ? 'ies' : 'y'}`);
    }
  });
}

function parseBulkLine(line) {
  line = line.trim();
  if (!line) return null;
  let dayNum = null, time = null;

  const dayMatch = line.match(/^(?:day\s+)?(\d{1,2})\b[,:\s]*/i);
  if (dayMatch) {
    const n = parseInt(dayMatch[1]);
    if (n >= 1 && n <= 30) { dayNum = n; line = line.slice(dayMatch[0].length).trim(); }
  }

  const timeMatch = line.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)?\b[,:\s]*/i);
  if (timeMatch) {
    let h = parseInt(timeMatch[1]);
    const m = parseInt(timeMatch[2] || '0');
    const ampm = (timeMatch[3] || '').toLowerCase();
    if (ampm === 'pm' && h < 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
    if (h >= 0 && h < 24) { time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; line = line.slice(timeMatch[0].length).trim(); }
  }

  const title = line.trim();
  if (!title) return null;
  return { dayNum, time, title, type: detectType(title) };
}

// ===================================================================
//  Q&A ENGINE
// ===================================================================

function initAsk() {
  const fab = $('#ask-fab');
  const panel = $('#ask-panel');
  const closeBtn = $('#ask-panel-close');
  const askForm = $('#ask-form');
  const askInput = $('#ask-input');
  const body = $('#ask-panel-body');
  if (!fab || !panel) return;

  function openAsk() {
    panel.classList.add('open');
    fab.classList.add('hidden');
    setTimeout(() => askInput?.focus(), 300);
  }

  function closeAsk() {
    panel.classList.remove('open');
    fab.classList.remove('hidden');
  }

  fab.addEventListener('click', openAsk);
  closeBtn?.addEventListener('click', closeAsk);

  // All .ask-trigger buttons (hero, sticky nav, mobile nav)
  $$('.ask-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAsk();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeAsk();
  });

  // Form submit — chat bubble style
  if (askForm) {
    askForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = askInput.value.trim();
      if (!q) return;

      // Add question bubble
      const qBubble = document.createElement('div');
      qBubble.className = 'ask-bubble ask-bubble-q';
      qBubble.textContent = q;
      body.appendChild(qBubble);

      // Get answer
      const answer = answerQuestion(q);
      const aBubble = document.createElement('div');
      aBubble.className = 'ask-bubble ask-bubble-a';
      aBubble.textContent = answer;
      body.appendChild(aBubble);

      // Scroll to bottom
      body.scrollTop = body.scrollHeight;
      askInput.value = '';
    });
  }
}

function answerQuestion(raw) {
  const q = raw.toLowerCase().trim();
  if (!q) return 'Ask me about places, travel days, flexible time, hotels, or suggestions.';

  if (q.match(/how many|how long|number of/)) {
    const placeKey = findPlace(q);
    if (placeKey) {
      const place = trip.places[placeKey];
      const placeDays = trip.days.filter(d => d.placeKey === placeKey);
      const routeStops = trip.route.filter(r => r.key === placeKey);
      const totalNights = routeStops.reduce((sum, r) => sum + r.nights, 0);
      return `You have ${placeDays.length} day${placeDays.length > 1 ? 's' : ''} and ${totalNights} night${totalNights > 1 ? 's' : ''} in ${place.name}.`;
    }
    return `The trip is ${trip.days.length} days total. Ask about a specific place for details.`;
  }

  const dayMatch = q.match(/(?:day|#)\s*(\d+)/);
  if (dayMatch) {
    const dayNum = parseInt(dayMatch[1]);
    const day = trip.days.find(d => d.dayNum === dayNum);
    if (day) {
      const place = trip.places[day.placeKey];
      const hotel = day.stay?.hotel || 'In transit';
      return `Day ${dayNum} (${fmtDate.format(parseDate(day.date))}): ${day.title} in ${place.name}. Hotel: ${hotel}.`;
    }
    return `Day ${dayNum} doesn't exist. The trip is days 1–${trip.days.length}.`;
  }

  if (q.includes('hotel') || q.includes('stay') || q.includes('where')) {
    return trip.days.filter(d => d.stay?.hotel).map(d => `${fmtDate.format(parseDate(d.date))}: ${d.stay.hotel}`).join(' | ') || 'No hotel info.';
  }

  if (q.includes('cost') || q.includes('budget') || q.includes('price')) {
    return trip.bookings
      .filter(b => b.details.some(([k]) => k === 'Cost'))
      .map(b => `${b.title}: ${b.details.find(([k]) => k === 'Cost')[1]}`)
      .join(' | ') || 'No cost info found.';
  }

  return 'Try: "how many days in Kyoto?", "what hotel?", "day 5", or "costs"';
}

function findPlace(q) {
  const entries = Object.entries(trip.places);
  for (const [key, place] of entries) {
    if (key === 'transit' || key === 'home') continue;
    if (q.includes(key) || q.includes(place.name.toLowerCase())) return key;
  }
  return null;
}

// ===================================================================
//  STICKY NAV & MOBILE NAV
// ===================================================================

function initStickyNav() {
  const hero = $('#top');
  const stickyNav = $('#sticky-nav');
  if (!hero || !stickyNav) return;

  const observer = new IntersectionObserver(([entry]) => {
    stickyNav.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0, rootMargin: '-60px 0px 0px 0px' });
  observer.observe(hero);

  const sections = ['route', 'itinerary', 'bookings'];
  const snavLinks = stickyNav.querySelectorAll('.snav-link:not(.ask-trigger)');

  function updateActive() {
    let current = sections[0];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) current = id;
    }
    snavLinks.forEach(link => link.classList.toggle('active', link.dataset.section === current));
  }

  let st;
  window.addEventListener('scroll', () => { clearTimeout(st); st = setTimeout(updateActive, 60); }, { passive: true });
}

function updateMobileNav() {
  const sections = ['route', 'itinerary', 'bookings'];
  let current = 'route';
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 120) current = id;
  }
  $$('.mnav-item:not(.ask-trigger)').forEach((item) => item.classList.toggle('active', item.dataset.section === current));
}

// ===================================================================
//  NOTIFICATIONS
// ===================================================================

function initNotifications() {
  const notifyBtn = $('#notify-btn');
  const notifyStatus = $('#notify-status');
  if (!notifyBtn) return;

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
  });
}

// ===================================================================
//  EXPORT / IMPORT UI
// ===================================================================

function initExportImport() {
  // Bind all export buttons (hero, sticky nav)
  $$('.export-trigger').forEach(btn => btn.addEventListener('click', exportTrip));
  // Bind all import file inputs (hero, sticky nav)
  $$('.import-trigger').forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) importTrip(file);
    });
  });
}

// ===================================================================
//  TOAST NOTIFICATIONS
// ===================================================================

function showToast(msg) {
  const existing = $('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

function showUndoToast(msg, undoFn) {
  const existing = $('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast toast-undo';
  toast.innerHTML = `<span>${msg}</span><button class="toast-undo-btn">Undo</button>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  let undone = false;
  toast.querySelector('.toast-undo-btn').addEventListener('click', () => {
    undone = true;
    undoFn();
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });

  setTimeout(() => {
    if (!undone) {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// ===================================================================
//  INIT
// ===================================================================

async function init() {
  // Load trip data: localStorage override > fetch
  trip = loadTrip();

  if (!trip) {
    try {
      const res = await fetch('./trip.json');
      trip = await res.json();
      saveTrip();
    } catch (err) {
      document.body.innerHTML = '<div style="padding:40px;text-align:center"><h2>Failed to load trip data</h2><p>Could not fetch trip.json</p></div>';
      return;
    }
  }

  // Migrate bookings from old details-array format to structured schema
  if (trip.bookings?.length && trip.bookings[0].details && !trip.bookings[0].category) {
    trip.bookings = trip.bookings.map(b => {
      const detailMap = {};
      (b.details || []).forEach(([k, v]) => { detailMap[k] = v; });

      const base = {
        icon: b.icon || 'hotel',
        title: b.title || '',
        colorKey: b.colorKey || 'transit',
        confirmation: detailMap['Confirmation'] || detailMap['Conf'] || '',
        cost: detailMap['Cost'] || detailMap['Points'] || '',
        notes: detailMap['Room'] || detailMap['Notes'] || '',
        url: b.url || '',
      };

      const typeLower = (b.type || '').toLowerCase();
      if (typeLower === 'flight') {
        return { ...base, category: 'flight', outbound: {}, inbound: {} };
      } else if (typeLower === 'rail' || typeLower === 'train') {
        return { ...base, category: 'rail', legs: [] };
      } else {
        return {
          ...base,
          category: 'hotel',
          checkIn: detailMap['Check-in'] || '',
          checkOut: detailMap['Check-out'] || '',
        };
      }
    });
    saveTrip();
  }

  // Migrate rail bookings from legs[] to flat fields
  if (trip.bookings?.length) {
    const expanded = [];
    trip.bookings.forEach(b => {
      if (b.category === 'rail' && b.legs?.length && !b.transitDate) {
        b.legs.forEach(leg => {
          const parts = (leg.route || '').split(/\s*→\s*/);
          expanded.push({
            category: 'rail', icon: 'train',
            title: leg.route || b.title,
            colorKey: b.colorKey || 'transit',
            confirmation: b.confirmation || '', cost: '', notes: '', url: '',
            transitDate: leg.date || '', transitTime: '',
            transitFrom: parts[0] || '', transitTo: parts[1] || '',
          });
        });
      } else {
        expanded.push(b);
      }
    });
    if (expanded.length !== trip.bookings.length) {
      trip.bookings = expanded;
      saveTrip();
    }
  }

  userEdits = loadEdits();

  // Migrate from v3 edits if present
  const v3Edits = localStorage.getItem('raahi_v3_items');
  if (v3Edits && !localStorage.getItem('raahi_v4_migrated')) {
    try {
      const old = JSON.parse(v3Edits);
      Object.entries(old).forEach(([idx, edits]) => {
        if (edits.added?.length) {
          ensureEdits(parseInt(idx));
          edits.added.forEach(item => {
            if (item.time) {
              userEdits[parseInt(idx)].addedSchedule.push(item);
            } else {
              userEdits[parseInt(idx)].addedWishlist.push(item);
            }
          });
        }
      });
      saveEdits();
      localStorage.setItem('raahi_v4_migrated', '1');
    } catch {}
  }

  // Migration v2: remove hardcoded flight travel from day objects
  if ((trip.meta?.version || 1) < 2) {
    trip.days.forEach(d => { if (d.travel?.mode === 'flight') delete d.travel; });
    trip.meta.version = 2;
    saveTrip();
  }

  // Migration v3: remove all day.travel + logistical schedule items
  // (travel now comes from bookings cross-reference; no UI to delete day.travel manually)
  if ((trip.meta?.version || 1) < 3) {
    const LOGISTICAL = new Set(['flight', 'hotel', 'taxi', 'train', 'bus']);
    trip.days.forEach(d => {
      delete d.travel;
      if (d.schedule?.length) d.schedule = d.schedule.filter(it => !LOGISTICAL.has(it.type));
    });
    trip.meta.version = 3;
    saveTrip();
  }

  // Render everything
  renderPlaces();
  renderRouteMap();
  renderFilterBar();
  renderDayList('all');
  renderBookingFilters();
  renderBookings();
  renderCountdown();
  initStickyNav();
  initBulkPaste();
  initAddPlaceModal();
  initAsk();
  initNotifications();
  initExportImport();
  initInbox();
  updateMobileNav();

  // Booking add button
  const addTopBtn = $('#booking-add-top');
  if (addTopBtn) addTopBtn.addEventListener('click', () => openNewBookingForm());

  // Panel close handlers
  const panel = $('#day-panel');
  if (panel) {
    panel.querySelector('.day-panel-close').addEventListener('click', closeDayPanel);
    panel.querySelector('.day-panel-backdrop').addEventListener('click', closeDayPanel);
  }

  // Escape key for any open panel
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const bp = $('#booking-panel');
    if (bp?.classList.contains('open')) { bp.classList.remove('open'); return; }
    if (panel?.classList.contains('open')) closeDayPanel();
  });

  // Mobile nav scroll update
  let scrollTimer;
  window.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(updateMobileNav, 60); }, { passive: true });

  // Periodic updates
  setInterval(() => { renderCountdown(); highlightToday(); }, 3600000);
}

init();
