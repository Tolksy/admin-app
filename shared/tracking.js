// Local storage for cross-feature tracking (game, dope, personal items)

const TRACKING_KEY = 'ecc-tracking-v1';

function defaultTrackingData() {
  return {
    game: {
      totalCellClicks: 0,
      sessions: [],
      totalTimeMs: 0,
      lastOpened: null
    },
    dope: {
      hitsByDate: {}
    },
    items: {
      itemsById: {}
    }
  };
}

export function loadTracking() {
  try {
    const raw = localStorage.getItem(TRACKING_KEY);
    if (!raw) return defaultTrackingData();
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : defaultTrackingData();
  } catch (_e) {
    return defaultTrackingData();
  }
}

export function saveTracking(data) {
  localStorage.setItem(TRACKING_KEY, JSON.stringify(data));
}

// Game tracking
export function startGameSession() {
  const data = loadTracking();
  const start = Date.now();
  const session = { start, end: null, durationMs: 0 };
  if (!Array.isArray(data.game.sessions)) data.game.sessions = [];
  data.game.sessions.push(session);
  data.game.lastOpened = new Date(start).toISOString();
  saveTracking(data);
  return start;
}

export function endGameSession(startMs) {
  if (!startMs) return;
  const data = loadTracking();
  const end = Date.now();
  const duration = Math.max(0, end - startMs);
  const match = (data.game.sessions || []).find((s) => s.start === startMs && !s.end);
  if (match) {
    match.end = end;
    match.durationMs = duration;
  }
  data.game.totalTimeMs = (data.game.totalTimeMs || 0) + duration;
  saveTracking(data);
}

export function trackGameCellClick() {
  const data = loadTracking();
  data.game.totalCellClicks = (data.game.totalCellClicks || 0) + 1;
  saveTracking(data);
}

export function getGameStats() {
  const data = loadTracking();
  const sessions = data.game.sessions || [];
  return {
    totalCellClicks: data.game.totalCellClicks || 0,
    totalTimeMs: data.game.totalTimeMs || 0,
    sessionCount: sessions.length,
    lastOpened: data.game.lastOpened || null
  };
}

// Dope tracking
export function logDopeHit({ intensity = 3, note = '' } = {}) {
  const data = loadTracking();
  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);
  if (!data.dope.hitsByDate[isoDate]) data.dope.hitsByDate[isoDate] = [];
  const safeIntensity = Math.max(1, Math.min(5, Number(intensity) || 3));
  data.dope.hitsByDate[isoDate].push({ ts: now.getTime(), intensity: safeIntensity, note });
  saveTracking(data);
}

export function getDopeHitsByDate(isoDate) {
  const data = loadTracking();
  const list = data.dope.hitsByDate[isoDate] || [];
  return list.slice().sort((a, b) => b.ts - a.ts);
}

export function getDopeStats() {
  const data = loadTracking();
  const hitsByDate = data.dope.hitsByDate || {};
  const dates = Object.keys(hitsByDate);
  let total = 0;
  let last7 = 0;
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const start7 = new Date(today);
  start7.setDate(today.getDate() - 6);
  const start7Str = start7.toISOString().slice(0, 10);
  for (const d of dates) {
    const count = hitsByDate[d]?.length || 0;
    total += count;
    if (d >= start7Str) last7 += count;
  }
  const todayCount = hitsByDate[todayStr]?.length || 0;
  return { total, last7, today: todayCount };
}

// Personal items tracking
function genId() {
  return 'itm_' + Math.random().toString(36).slice(2, 10);
}

export function listItems() {
  const data = loadTracking();
  const items = data.items.itemsById || {};
  return Object.keys(items)
    .map((id) => ({ id, ...items[id] }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function addOrUpdateItem({ id, name, location, note }) {
  const data = loadTracking();
  if (!id) id = genId();
  data.items.itemsById[id] = {
    name: name || '',
    location: location || '',
    note: note || '',
    updatedAt: new Date().toISOString()
  };
  saveTracking(data);
  return id;
}

export function deleteItem(id) {
  const data = loadTracking();
  if (data.items.itemsById && data.items.itemsById[id]) {
    delete data.items.itemsById[id];
    saveTracking(data);
  }
}

export function findItemsByName(query) {
  const q = String(query || '').toLowerCase();
  return listItems().filter((it) => it.name.toLowerCase().includes(q));
}

