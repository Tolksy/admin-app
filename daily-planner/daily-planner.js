import { formatISODate, parseISODate } from '../shared/date-utils.js';
import { getDay, patchDay, setDay } from '../shared/storage.js';
import { computeDailyScore } from '../shared/scoring.js';

const dateLabel = document.getElementById('dateLabel');
const scoreBadge = document.getElementById('scoreBadge');
const printBtn = document.getElementById('printBtn');

const mitListEl = document.getElementById('mitList');
const mitInput = document.getElementById('mitInput');
const addMitBtn = document.getElementById('addMitBtn');

const habitExercise = document.getElementById('habitExercise');
const habitReading = document.getElementById('habitReading');
const habitPlanning = document.getElementById('habitPlanning');

const refGratitude = document.getElementById('refGratitude');
const refVictories = document.getElementById('refVictories');
const refLessons = document.getElementById('refLessons');

let dateISO;
let day;

function parseQueryDate() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('date');
  if (q) {
    try {
      const d = parseISODate(q);
      if (!isNaN(d.getTime())) return formatISODate(d);
    } catch (_e) {}
  }
  return formatISODate(new Date());
}

function updateScore() {
  day.score = computeDailyScore(day);
  scoreBadge.textContent = `${day.score}%`;
  setDay(dateISO, day);
}

function renderMits() {
  mitListEl.innerHTML = '';
  const list = Array.isArray(day.mitList) ? day.mitList : [];
  list.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'item';

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = !!item.done;
    check.addEventListener('change', () => {
      day.mitList[idx].done = check.checked;
      setDay(dateISO, day);
      updateScore();
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.value = item.text || '';
    input.placeholder = 'Describe task...';
    input.addEventListener('input', () => {
      day.mitList[idx].text = input.value;
      setDay(dateISO, day);
    });

    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', () => {
      day.mitList.splice(idx, 1);
      setDay(dateISO, day);
      renderMits();
      updateScore();
    });

    row.appendChild(check);
    row.appendChild(input);
    row.appendChild(del);
    mitListEl.appendChild(row);
  });
}

function addMit(text) {
  if (!text || !text.trim()) return;
  day.mitList.push({ text: text.trim(), done: false });
  setDay(dateISO, day);
  renderMits();
}

function init() {
  dateISO = parseQueryDate();
  day = getDay(dateISO);

  const display = new Date(dateISO + 'T00:00:00');
  const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
  dateLabel.textContent = fmt.format(display);

  // hydrate
  habitExercise.checked = !!day.habits.exercise;
  habitReading.checked = !!day.habits.reading;
  habitPlanning.checked = !!day.habits.planning;
  refGratitude.value = day.reflections.gratitude || '';
  refVictories.value = day.reflections.victories || '';
  refLessons.value = day.reflections.lessons || '';

  renderMits();
  updateScore();

  // events
  addMitBtn.addEventListener('click', () => {
    addMit(mitInput.value);
    mitInput.value = '';
    mitInput.focus();
    updateScore();
  });
  mitInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addMit(mitInput.value);
      mitInput.value = '';
      updateScore();
    }
  });

  habitExercise.addEventListener('change', () => { patchDay(dateISO, { habits: { exercise: habitExercise.checked } }); day = getDay(dateISO); updateScore(); });
  habitReading.addEventListener('change', () => { patchDay(dateISO, { habits: { reading: habitReading.checked } }); day = getDay(dateISO); updateScore(); });
  habitPlanning.addEventListener('change', () => { patchDay(dateISO, { habits: { planning: habitPlanning.checked } }); day = getDay(dateISO); updateScore(); });

  const saveReflections = () => {
    patchDay(dateISO, { reflections: { gratitude: refGratitude.value, victories: refVictories.value, lessons: refLessons.value } });
    day = getDay(dateISO);
    updateScore();
  };
  refGratitude.addEventListener('input', saveReflections);
  refVictories.addEventListener('input', saveReflections);
  refLessons.addEventListener('input', saveReflections);

  printBtn.addEventListener('click', () => window.print());
}

init();

