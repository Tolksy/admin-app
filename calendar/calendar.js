import { getMonthLabel, getMonthMatrix, getWeekdayLabels, getTodayISO, formatISODate } from '../shared/date-utils.js';
import { getSettings, getAllScores } from '../shared/storage.js';

const monthLabelEl = document.getElementById('monthLabel');
const gridEl = document.getElementById('grid');
const weekdayRowEl = document.getElementById('weekdayRow');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const todayBtn = document.getElementById('todayBtn');

let viewYear;
let viewMonth; // 0-11

function initWeekdayHeaders() {
  const { startOfWeek } = getSettings();
  const labels = getWeekdayLabels(startOfWeek);
  weekdayRowEl.innerHTML = '';
  labels.forEach((l) => {
    const div = document.createElement('div');
    div.textContent = l;
    weekdayRowEl.appendChild(div);
  });
}

function render() {
  const scores = getAllScores();
  monthLabelEl.textContent = getMonthLabel(viewYear, viewMonth);

  const weeks = getMonthMatrix(viewYear, viewMonth, getSettings().startOfWeek);
  const isCurrentMonth = (d) => d.getMonth() === viewMonth;
  const todayISO = getTodayISO();

  gridEl.innerHTML = '';
  weeks.forEach((week) => {
    week.forEach((date) => {
      const iso = formatISODate(date);
      const card = document.createElement('div');
      card.className = 'day-card';
      if (!isCurrentMonth(date)) card.classList.add('muted');

      const top = document.createElement('div');
      top.className = 'day-top';

      const num = document.createElement('div');
      num.className = 'day-num';
      num.textContent = String(date.getDate());
      if (iso === todayISO) num.style.color = '#2563eb';

      const score = scores[iso] || 0;
      const badge = document.createElement('div');
      badge.className = 'score-badge';
      badge.textContent = `${score}%`;

      top.appendChild(num);
      top.appendChild(badge);

      const heat = document.createElement('div');
      heat.className = 'heatbar';
      const fill = document.createElement('div');
      fill.className = 'fill';
      fill.style.width = `${score}%`;
      heat.appendChild(fill);

      const btn = document.createElement('button');
      btn.className = 'open-btn';
      btn.textContent = 'Open';
      btn.addEventListener('click', () => {
        const target = `../daily-planner/daily-planner.html?date=${iso}`;
        window.location.href = target;
      });

      card.appendChild(top);
      card.appendChild(heat);
      card.appendChild(btn);
      gridEl.appendChild(card);
    });
  });
}

function setView(date) {
  viewYear = date.getFullYear();
  viewMonth = date.getMonth();
  render();
}

function init() {
  initWeekdayHeaders();
  const now = new Date();
  setView(now);

  prevBtn.addEventListener('click', () => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setView(d);
  });
  nextBtn.addEventListener('click', () => {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setView(d);
  });
  todayBtn.addEventListener('click', () => setView(new Date()));
}

init();

