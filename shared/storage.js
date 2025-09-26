// Local storage helpers for planner data

const STORAGE_KEY = 'ecc-planner-v1';

function defaultData() {
  return {
    byDate: {},
    settings: {
      startOfWeek: 0,
      theme: 'light'
    }
  };
}

function defaultDay() {
  return {
    mitList: [],
    habits: {
      exercise: false,
      reading: false,
      planning: false
    },
    reflections: {
      gratitude: '',
      victories: '',
      lessons: ''
    },
    score: 0
  };
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : defaultData();
  } catch (_e) {
    return defaultData();
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSettings() {
  const data = loadData();
  if (!data.settings) data.settings = defaultData().settings;
  return data.settings;
}

export function updateSettings(partial) {
  const data = loadData();
  data.settings = { ...data.settings, ...partial };
  saveData(data);
}

export function getDay(dateISO) {
  const data = loadData();
  if (!data.byDate[dateISO]) {
    data.byDate[dateISO] = defaultDay();
    saveData(data);
  }
  return data.byDate[dateISO];
}

export function setDay(dateISO, day) {
  const data = loadData();
  data.byDate[dateISO] = day;
  saveData(data);
}

export function patchDay(dateISO, partial) {
  const current = getDay(dateISO);
  const next = {
    ...current,
    ...partial,
    habits: { ...current.habits, ...(partial.habits || {}) },
    reflections: { ...current.reflections, ...(partial.reflections || {}) }
  };
  setDay(dateISO, next);
}

export function getAllScores() {
  const data = loadData();
  const scores = {};
  for (const key in data.byDate) {
    if (Object.prototype.hasOwnProperty.call(data.byDate, key)) {
      const day = data.byDate[key];
      if (typeof day.score === 'number') scores[key] = day.score;
    }
  }
  return scores;
}

