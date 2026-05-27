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
    const dayCount = trip.days.filter(d => d.placeKey === stop.key).length;
    const hotels = [...new Set(
      trip.days.filter(d => d.placeKey === stop.key && d.stay?.hotel)
        .map(d => d.stay.hotel)
    )];
    const hotelPreview = hotels.length ? hotels[0] : '';

    return `
      <button class="city-card" data-place="${stop.key}" data-idx="${i}" style="--city-color:${place.color}; --city-bg:${place.bg}">
        ${place.img ? `<div class="city-card-img"><img src="${place.img}" alt="${stop.city}" loading="lazy"></div>` : ''}
        <div class="city-card-body">
          <div class="city-card-info">
            <h3>${place.emoji} ${stop.city}</h3>
            <span class="city-dates">${stop.dates}</span>
            <span class="city-meta">${stop.nights}n · ${dayCount} day${dayCount > 1 ? 's' : ''}</span>
            ${hotelPreview ? `<span class="city-hotel">${hotelPreview}</span>` : ''}
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
    const hotelName = day.stay?.hotel || 'In transit';
    const hasTravel = day.travel != null;

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
              <span class="day-city-pill" style="background:${place.bg}; color:${place.color}">${place.name}</span>
            </div>
            <div class="day-preview">
              ${hasTravel ? `<span class="day-travel-badge">${ITEM_TYPES[day.travel.mode]?.icon || '🚀'} ${day.travel.summary}</span>` : ''}
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

  // Stay badge
  const stayEl = panel.querySelector('.panel-stay');
  if (day.stay) {
    const stayUrl = day.stay.url ? ` <a href="${day.stay.url}" target="_blank" rel="noreferrer" class="stay-link">${ICONS.arrow}</a>` : '';
    stayEl.innerHTML = `
      <div class="stay-badge">
        <span class="stay-icon">🏨</span>
        <div class="stay-info">
          <strong>${day.stay.hotel}</strong>
          ${day.stay.room ? `<span>${day.stay.room}</span>` : ''}
          ${day.stay.confirmation ? `<span class="stay-conf">Conf: ${day.stay.confirmation}</span>` : ''}
        </div>
        ${stayUrl}
      </div>`;
    stayEl.style.display = '';
  } else {
    stayEl.style.display = 'none';
  }

  // Travel section
  const travelEl = panel.querySelector('.panel-travel');
  if (day.travel) {
    const modeIcon = ITEM_TYPES[day.travel.mode]?.icon || '🚀';
    const travelUrl = day.travel.url
      ? `<a href="${day.travel.url}" target="_blank" rel="noreferrer" class="travel-link">${ICONS.arrow}</a>`
      : '';
    travelEl.innerHTML = `
      <h4 class="panel-label">Travel</h4>
      <div class="travel-card">
        <span class="travel-icon">${modeIcon}</span>
        <div class="travel-info">
          <strong>${day.travel.summary}</strong>
          <span>${day.travel.details}</span>
          ${day.travel.confirmation ? `<span class="travel-conf">Conf: ${day.travel.confirmation}</span>` : ''}
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

  modal.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name').toString().trim();
    if (!name) return;

    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const dates = fd.get('dates').toString().trim() || 'TBD';
    const nights = parseInt(fd.get('nights')) || 1;
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

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const a = new Date(checkIn + 'T00:00:00');
  const b = new Date(checkOut + 'T00:00:00');
  return Math.round((b - a) / 86400000);
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
      if (!leg) return '';
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
    const legItems = (b.legs || []).map(l =>
      `<li><span class="booking-rail-date">${fmtBookingDate(l.date)}</span> ${escHtml(l.route)}</li>`
    ).join('');
    return `
      <ul class="booking-rail-legs">${legItems}</ul>
      <dl class="booking-dl">
        ${b.confirmation ? `<dt>Confirmation</dt><dd class="booking-mono">${escHtml(b.confirmation)}</dd>` : ''}
        ${b.cost ? `<dt>Cost</dt><dd>${escHtml(b.cost)}</dd>` : ''}
      </dl>`;
  }

  // Fallback for unknown categories
  return `<dl class="booking-dl">
    ${b.confirmation ? `<dt>Confirmation</dt><dd class="booking-mono">${escHtml(b.confirmation)}</dd>` : ''}
    ${b.cost ? `<dt>Cost</dt><dd>${escHtml(b.cost)}</dd>` : ''}
    ${b.notes ? `<dt>Notes</dt><dd>${escHtml(b.notes)}</dd>` : ''}
  </dl>`;
}

function renderBookings() {
  const bookingGrid = $('#booking-grid');
  if (!bookingGrid) return;

  bookingGrid.innerHTML = trip.bookings.map((b, idx) => {
    const place = trip.places[b.colorKey] || trip.places.transit;
    const icon = ICONS[b.icon] || ICONS.hotel;
    const categoryLabel = b.category === 'flight' ? 'Flight' : b.category === 'rail' ? 'Rail' : 'Hotel';
    return `
      <article class="booking-card" data-booking-idx="${idx}" style="--booking-color:${place.color}; --booking-color-bg:${place.bg}">
        <div class="booking-card-header">
          <div class="booking-icon">${icon}</div>
          <div>
            <span class="booking-type">${categoryLabel}</span>
            <h3>${escHtml(b.title)}</h3>
          </div>
        </div>
        <div class="booking-card-body">
          ${renderBookingBody(b)}
        </div>
        <div class="booking-card-footer">
          <button class="booking-footer-edit" data-idx="${idx}">Edit ${ICONS.edit}</button>
          ${b.url ? `<a href="${escHtml(b.url)}" target="_blank" rel="noreferrer">View ${ICONS.arrow}</a>` : ''}
        </div>
      </article>`;
  }).join('') + `
    <button class="booking-add-card" id="booking-add-btn">
      <span class="booking-add-icon">${ICONS.plus}</span>
      <span>Add Booking</span>
    </button>`;

  // Attach edit handlers
  bookingGrid.querySelectorAll('.booking-footer-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      openBookingEditor(idx);
    });
  });

  // Add booking handler
  const addBtn = $('#booking-add-btn');
  if (addBtn) addBtn.addEventListener('click', openNewBookingForm);
}

// ===================================================================
//  Booking Editor — Structured Forms
// ===================================================================

function buildHotelForm(b) {
  return `
    <div class="bef-field">
      <label>Hotel name</label>
      <input type="text" name="title" value="${escHtml(b.title)}" required>
    </div>
    <div class="bef-row">
      <div class="bef-field">
        <label>Check-in</label>
        <input type="date" name="checkIn" value="${b.checkIn || ''}" required>
      </div>
      <div class="bef-field">
        <label>Check-out</label>
        <input type="date" name="checkOut" value="${b.checkOut || ''}" required>
      </div>
      <div class="bef-field bef-field-sm">
        <label>Nights</label>
        <input type="text" name="_nights" value="${calcNights(b.checkIn, b.checkOut) || ''}" readonly class="bef-readonly">
      </div>
    </div>
    <div class="bef-row">
      <div class="bef-field">
        <label>Confirmation</label>
        <input type="text" name="confirmation" value="${escHtml(b.confirmation || '')}">
      </div>
      <div class="bef-field">
        <label>Cost</label>
        <input type="text" name="cost" value="${escHtml(b.cost || '')}">
      </div>
    </div>
    <div class="bef-field">
      <label>Notes</label>
      <textarea name="notes" rows="3" placeholder="Room type, address, phone...">${escHtml(b.notes || '')}</textarea>
    </div>
    <div class="bef-field">
      <label>URL</label>
      <input type="url" name="url" value="${escHtml(b.url || '')}" placeholder="https://...">
    </div>`;
}

function buildFlightForm(b) {
  const legFields = (leg, prefix, label) => {
    if (!leg) leg = {};
    return `
    <fieldset class="bef-leg">
      <legend>${label}</legend>
      <div class="bef-row">
        <div class="bef-field">
          <label>Flight</label>
          <input type="text" name="${prefix}_flight" value="${escHtml(leg.flight || '')}" placeholder="UA 837">
        </div>
        <div class="bef-field">
          <label>From</label>
          <input type="text" name="${prefix}_departAirport" value="${escHtml(leg.departAirport || '')}" placeholder="SFO" maxlength="4">
        </div>
        <div class="bef-field">
          <label>To</label>
          <input type="text" name="${prefix}_arriveAirport" value="${escHtml(leg.arriveAirport || '')}" placeholder="NRT" maxlength="4">
        </div>
      </div>
      <div class="bef-row">
        <div class="bef-field">
          <label>Depart date</label>
          <input type="date" name="${prefix}_departDate" value="${leg.departDate || ''}">
        </div>
        <div class="bef-field">
          <label>Depart time</label>
          <input type="time" name="${prefix}_departTime" value="${leg.departTime || ''}">
        </div>
      </div>
      <div class="bef-row">
        <div class="bef-field">
          <label>Arrive date</label>
          <input type="date" name="${prefix}_arriveDate" value="${leg.arriveDate || ''}">
        </div>
        <div class="bef-field">
          <label>Arrive time</label>
          <input type="time" name="${prefix}_arriveTime" value="${leg.arriveTime || ''}">
        </div>
      </div>
    </fieldset>`;
  };
  return `
    <div class="bef-field">
      <label>Title</label>
      <input type="text" name="title" value="${escHtml(b.title)}" required>
    </div>
    ${legFields(b.outbound, 'out', 'Outbound')}
    ${legFields(b.inbound, 'in', 'Return')}
    <div class="bef-row">
      <div class="bef-field">
        <label>Confirmation</label>
        <input type="text" name="confirmation" value="${escHtml(b.confirmation || '')}">
      </div>
      <div class="bef-field">
        <label>Cost</label>
        <input type="text" name="cost" value="${escHtml(b.cost || '')}">
      </div>
    </div>
    <div class="bef-field">
      <label>Notes</label>
      <textarea name="notes" rows="2" placeholder="Aircraft, class...">${escHtml(b.notes || '')}</textarea>
    </div>
    <div class="bef-field">
      <label>URL</label>
      <input type="url" name="url" value="${escHtml(b.url || '')}" placeholder="https://...">
    </div>`;
}

function buildRailForm(b) {
  const legRows = (b.legs || []).map((l, i) => `
    <div class="bef-row bef-leg-row" data-leg-idx="${i}">
      <div class="bef-field">
        <input type="date" name="leg_date_${i}" value="${l.date || ''}">
      </div>
      <div class="bef-field bef-field-grow">
        <input type="text" name="leg_route_${i}" value="${escHtml(l.route || '')}" placeholder="City A → City B">
      </div>
      <button type="button" class="bef-leg-remove btn btn-outline btn-xs" data-leg="${i}" title="Remove">×</button>
    </div>`).join('');

  return `
    <div class="bef-field">
      <label>Title</label>
      <input type="text" name="title" value="${escHtml(b.title)}" required>
    </div>
    <div class="bef-field">
      <label>Legs</label>
      <div class="bef-legs-list" id="bef-legs-list">${legRows}</div>
      <button type="button" class="btn btn-outline btn-xs bef-add-leg">+ Add leg</button>
    </div>
    <div class="bef-row">
      <div class="bef-field">
        <label>Confirmation</label>
        <input type="text" name="confirmation" value="${escHtml(b.confirmation || '')}">
      </div>
      <div class="bef-field">
        <label>Cost</label>
        <input type="text" name="cost" value="${escHtml(b.cost || '')}">
      </div>
    </div>
    <div class="bef-field">
      <label>Notes</label>
      <textarea name="notes" rows="2">${escHtml(b.notes || '')}</textarea>
    </div>
    <div class="bef-field">
      <label>URL</label>
      <input type="url" name="url" value="${escHtml(b.url || '')}" placeholder="https://...">
    </div>`;
}

function openBookingEditor(idx) {
  const booking = trip.bookings[idx];
  if (!booking) return;

  // Check if already editing
  const card = $(`.booking-card[data-booking-idx="${idx}"]`);
  if (!card || card.querySelector('.booking-edit-form')) return;

  // Snapshot for undo
  const snapshot = JSON.parse(JSON.stringify(booking));

  const body = card.querySelector('.booking-card-body');
  const footer = card.querySelector('.booking-card-footer');
  body.style.display = 'none';
  footer.style.display = 'none';

  const form = document.createElement('form');
  form.className = 'booking-edit-form';

  let fields = '';
  if (booking.category === 'hotel') fields = buildHotelForm(booking);
  else if (booking.category === 'flight') fields = buildFlightForm(booking);
  else if (booking.category === 'rail') fields = buildRailForm(booking);
  else fields = buildHotelForm(booking); // fallback

  form.innerHTML = `
    ${fields}
    <div class="bef-actions">
      <button type="submit" class="btn btn-primary btn-sm">Save</button>
      <button type="button" class="btn btn-outline btn-sm bef-cancel">Cancel</button>
      <button type="button" class="btn btn-danger btn-sm bef-delete">Delete</button>
    </div>`;

  body.after(form);
  form.querySelector('input[name="title"]').focus();

  // Auto-calc nights when dates change (hotel)
  if (booking.category === 'hotel') {
    const ciInput = form.querySelector('input[name="checkIn"]');
    const coInput = form.querySelector('input[name="checkOut"]');
    const nightsInput = form.querySelector('input[name="_nights"]');
    const updateNights = () => {
      const n = calcNights(ciInput.value, coInput.value);
      nightsInput.value = n > 0 ? n : '';
    };
    ciInput.addEventListener('change', updateNights);
    coInput.addEventListener('change', updateNights);
  }

  // Rail: add/remove legs
  if (booking.category === 'rail') {
    const legsList = form.querySelector('#bef-legs-list');
    form.querySelector('.bef-add-leg').addEventListener('click', () => {
      const i = legsList.children.length;
      const row = document.createElement('div');
      row.className = 'bef-row bef-leg-row';
      row.dataset.legIdx = i;
      row.innerHTML = `
        <div class="bef-field">
          <input type="date" name="leg_date_${i}" value="">
        </div>
        <div class="bef-field bef-field-grow">
          <input type="text" name="leg_route_${i}" value="" placeholder="City A → City B">
        </div>
        <button type="button" class="bef-leg-remove btn btn-outline btn-xs" data-leg="${i}" title="Remove">×</button>`;
      legsList.appendChild(row);
    });
    legsList.addEventListener('click', (e) => {
      if (e.target.classList.contains('bef-leg-remove')) {
        e.target.closest('.bef-leg-row').remove();
      }
    });
  }

  // Cancel
  form.querySelector('.bef-cancel').addEventListener('click', () => {
    form.remove();
    body.style.display = '';
    footer.style.display = '';
  });

  // Delete
  form.querySelector('.bef-delete').addEventListener('click', () => {
    trip.bookings.splice(idx, 1);
    saveTrip();
    renderBookings();
    showUndoToast('Booking deleted', () => {
      trip.bookings.splice(idx, 0, snapshot);
      saveTrip();
      renderBookings();
    });
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    booking.title = fd.get('title').toString().trim();
    booking.url = fd.get('url')?.toString().trim() || '';
    booking.confirmation = fd.get('confirmation')?.toString().trim() || '';
    booking.cost = fd.get('cost')?.toString().trim() || '';
    booking.notes = fd.get('notes')?.toString().trim() || '';

    if (booking.category === 'hotel') {
      booking.checkIn = fd.get('checkIn') || '';
      booking.checkOut = fd.get('checkOut') || '';
      syncBookingToStays(booking);
    } else if (booking.category === 'flight') {
      booking.outbound = {
        flight: fd.get('out_flight')?.toString().trim() || '',
        departAirport: fd.get('out_departAirport')?.toString().trim().toUpperCase() || '',
        arriveAirport: fd.get('out_arriveAirport')?.toString().trim().toUpperCase() || '',
        departDate: fd.get('out_departDate') || '',
        departTime: fd.get('out_departTime') || '',
        arriveDate: fd.get('out_arriveDate') || '',
        arriveTime: fd.get('out_arriveTime') || '',
      };
      booking.inbound = {
        flight: fd.get('in_flight')?.toString().trim() || '',
        departAirport: fd.get('in_departAirport')?.toString().trim().toUpperCase() || '',
        arriveAirport: fd.get('in_arriveAirport')?.toString().trim().toUpperCase() || '',
        departDate: fd.get('in_departDate') || '',
        departTime: fd.get('in_departTime') || '',
        arriveDate: fd.get('in_arriveDate') || '',
        arriveTime: fd.get('in_arriveTime') || '',
      };
    } else if (booking.category === 'rail') {
      const legRows = form.querySelectorAll('.bef-leg-row');
      booking.legs = [];
      legRows.forEach(row => {
        const i = row.dataset.legIdx;
        const date = fd.get(`leg_date_${i}`)?.toString() || '';
        const route = fd.get(`leg_route_${i}`)?.toString().trim() || '';
        if (date || route) booking.legs.push({ date, route });
      });
    }

    saveTrip();
    renderBookings();

    showUndoToast('Booking updated', () => {
      trip.bookings[idx] = snapshot;
      saveTrip();
      renderBookings();
      // Re-sync stays with old data
      if (snapshot.category === 'hotel') syncBookingToStays(snapshot);
    });
  });
}

// Sync hotel booking dates/name to matching day.stay entries
function syncBookingToStays(hotelBooking) {
  if (hotelBooking.category !== 'hotel') return;
  const ci = hotelBooking.checkIn;
  const co = hotelBooking.checkOut;
  if (!ci || !co) return;

  trip.days.forEach(day => {
    const dayDate = day.date;
    // Day falls within this hotel stay (check-in date up to but not including check-out)
    if (dayDate >= ci && dayDate < co) {
      day.stay = day.stay || {};
      day.stay.hotel = hotelBooking.title;
      day.stay.confirmation = hotelBooking.confirmation || '';
      // First line of notes is typically room type
      const firstNote = (hotelBooking.notes || '').split('\n')[0];
      if (firstNote) day.stay.room = firstNote;
    }
  });
}

// ===================================================================
//  Add New Booking
// ===================================================================

function openNewBookingForm() {
  const grid = $('#booking-grid');
  const addBtn = $('#booking-add-btn');
  if (!addBtn || grid.querySelector('.booking-new-form')) return;

  addBtn.style.display = 'none';

  const wrapper = document.createElement('div');
  wrapper.className = 'booking-new-form';

  wrapper.innerHTML = `
    <div class="bnf-step bnf-pick-type">
      <h4>New Booking</h4>
      <p class="bnf-hint">What type?</p>
      <div class="bnf-type-btns">
        <button class="btn btn-outline bnf-type-btn" data-cat="hotel">${ICONS.hotel} Hotel</button>
        <button class="btn btn-outline bnf-type-btn" data-cat="flight">${ICONS.plane} Flight</button>
        <button class="btn btn-outline bnf-type-btn" data-cat="rail">${ICONS.train} Rail</button>
      </div>
      <button class="btn btn-outline btn-xs bnf-cancel-btn">Cancel</button>
    </div>`;

  grid.appendChild(wrapper);
  wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Cancel
  wrapper.querySelector('.bnf-cancel-btn').addEventListener('click', () => {
    wrapper.remove();
    addBtn.style.display = '';
  });

  // Pick type → show form
  wrapper.querySelectorAll('.bnf-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      showNewBookingFields(wrapper, addBtn, cat);
    });
  });
}

function showNewBookingFields(wrapper, addBtn, category) {
  const blank = {
    category,
    icon: category === 'flight' ? 'plane' : category === 'rail' ? 'train' : 'hotel',
    title: '',
    colorKey: 'transit',
    confirmation: '',
    cost: '',
    notes: '',
    url: '',
  };
  if (category === 'hotel') { blank.checkIn = ''; blank.checkOut = ''; }
  if (category === 'flight') { blank.outbound = {}; blank.inbound = {}; }
  if (category === 'rail') { blank.legs = []; }

  let fields = '';
  if (category === 'hotel') fields = buildHotelForm(blank);
  else if (category === 'flight') fields = buildFlightForm(blank);
  else if (category === 'rail') fields = buildRailForm(blank);

  // Place picker
  const placeOptions = Object.entries(trip.places)
    .map(([key, p]) => `<option value="${key}">${p.emoji} ${p.name}</option>`)
    .join('');

  wrapper.innerHTML = `
    <form class="booking-edit-form">
      <h4>New ${category === 'flight' ? 'Flight' : category === 'rail' ? 'Rail' : 'Hotel'}</h4>
      <div class="bef-field">
        <label>Place</label>
        <select name="colorKey" class="bef-select">${placeOptions}</select>
      </div>
      ${fields}
      <div class="bef-actions">
        <button type="submit" class="btn btn-primary btn-sm">Add</button>
        <button type="button" class="btn btn-outline btn-sm bnf-cancel-btn">Cancel</button>
      </div>
    </form>`;

  // Auto-calc nights (hotel)
  if (category === 'hotel') {
    const ciInput = wrapper.querySelector('input[name="checkIn"]');
    const coInput = wrapper.querySelector('input[name="checkOut"]');
    const nightsInput = wrapper.querySelector('input[name="_nights"]');
    if (ciInput && coInput && nightsInput) {
      const updateNights = () => {
        const n = calcNights(ciInput.value, coInput.value);
        nightsInput.value = n > 0 ? n : '';
      };
      ciInput.addEventListener('change', updateNights);
      coInput.addEventListener('change', updateNights);
    }
  }

  // Rail leg management
  if (category === 'rail') {
    const legsList = wrapper.querySelector('#bef-legs-list');
    wrapper.querySelector('.bef-add-leg')?.addEventListener('click', () => {
      const i = legsList.children.length;
      const row = document.createElement('div');
      row.className = 'bef-row bef-leg-row';
      row.dataset.legIdx = i;
      row.innerHTML = `
        <div class="bef-field"><input type="date" name="leg_date_${i}" value=""></div>
        <div class="bef-field bef-field-grow"><input type="text" name="leg_route_${i}" value="" placeholder="City A → City B"></div>
        <button type="button" class="bef-leg-remove btn btn-outline btn-xs" data-leg="${i}" title="Remove">×</button>`;
      legsList.appendChild(row);
    });
    legsList?.addEventListener('click', (e) => {
      if (e.target.classList.contains('bef-leg-remove')) {
        e.target.closest('.bef-leg-row').remove();
      }
    });
  }

  // Cancel
  wrapper.querySelector('.bnf-cancel-btn').addEventListener('click', () => {
    wrapper.remove();
    addBtn.style.display = '';
  });

  // Submit — create the booking
  wrapper.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    const newBooking = { ...blank };
    newBooking.title = fd.get('title')?.toString().trim() || 'Untitled';
    newBooking.colorKey = fd.get('colorKey')?.toString() || 'transit';
    newBooking.url = fd.get('url')?.toString().trim() || '';
    newBooking.confirmation = fd.get('confirmation')?.toString().trim() || '';
    newBooking.cost = fd.get('cost')?.toString().trim() || '';
    newBooking.notes = fd.get('notes')?.toString().trim() || '';

    if (category === 'hotel') {
      newBooking.checkIn = fd.get('checkIn') || '';
      newBooking.checkOut = fd.get('checkOut') || '';
    } else if (category === 'flight') {
      newBooking.outbound = {
        flight: fd.get('out_flight')?.toString().trim() || '',
        departAirport: fd.get('out_departAirport')?.toString().trim().toUpperCase() || '',
        arriveAirport: fd.get('out_arriveAirport')?.toString().trim().toUpperCase() || '',
        departDate: fd.get('out_departDate') || '',
        departTime: fd.get('out_departTime') || '',
        arriveDate: fd.get('out_arriveDate') || '',
        arriveTime: fd.get('out_arriveTime') || '',
      };
      newBooking.inbound = {
        flight: fd.get('in_flight')?.toString().trim() || '',
        departAirport: fd.get('in_departAirport')?.toString().trim().toUpperCase() || '',
        arriveAirport: fd.get('in_arriveAirport')?.toString().trim().toUpperCase() || '',
        departDate: fd.get('in_departDate') || '',
        departTime: fd.get('in_departTime') || '',
        arriveDate: fd.get('in_arriveDate') || '',
        arriveTime: fd.get('in_arriveTime') || '',
      };
    } else if (category === 'rail') {
      const legRows = wrapper.querySelectorAll('.bef-leg-row');
      newBooking.legs = [];
      legRows.forEach(row => {
        const i = row.dataset.legIdx;
        const date = fd.get(`leg_date_${i}`)?.toString() || '';
        const route = fd.get(`leg_route_${i}`)?.toString().trim() || '';
        if (date || route) newBooking.legs.push({ date, route });
      });
    }

    trip.bookings.push(newBooking);
    if (category === 'hotel') syncBookingToStays(newBooking);
    saveTrip();
    renderBookings();

    const addedIdx = trip.bookings.length - 1;
    showUndoToast('Booking added', () => {
      trip.bookings.splice(addedIdx, 1);
      saveTrip();
      renderBookings();
    });
  });

  wrapper.querySelector('input[name="title"]')?.focus();
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

  // Render everything
  renderPlaces();
  renderRouteMap();
  renderFilterBar();
  renderDayList('all');
  renderBookings();
  renderCountdown();
  initStickyNav();
  initBulkPaste();
  initAddPlaceModal();
  initAsk();
  initNotifications();
  initExportImport();
  updateMobileNav();

  // Panel close handlers
  const panel = $('#day-panel');
  if (panel) {
    panel.querySelector('.day-panel-close').addEventListener('click', closeDayPanel);
    panel.querySelector('.day-panel-backdrop').addEventListener('click', closeDayPanel);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) closeDayPanel();
    });
  }

  // Mobile nav scroll update
  let scrollTimer;
  window.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(updateMobileNav, 60); }, { passive: true });

  // Periodic updates
  setInterval(() => { renderCountdown(); highlightToday(); }, 3600000);
}

init();
