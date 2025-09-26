// Date utilities for formatting, parsing, and generating month matrices

export function pad(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

export function formatISODate(date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map((v) => parseInt(v, 10));
  return new Date(y, m - 1, d);
}

export function getTodayISO() {
  return formatISODate(new Date());
}

export function getMonthLabel(year, monthIndex) {
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });
  return formatter.format(new Date(year, monthIndex, 1));
}

export function getWeekdayLabels(startOfWeek = 0) {
  const base = new Date(2021, 7, 1); // Sunday
  const labels = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + ((i + startOfWeek) % 7));
    labels.push(new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(d));
  }
  return labels;
}

export function getMonthMatrix(year, monthIndex, startOfWeek = 0) {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const start = new Date(firstDayOfMonth);
  const dayOfWeek = firstDayOfMonth.getDay();
  const diff = (dayOfWeek - startOfWeek + 7) % 7;
  start.setDate(firstDayOfMonth.getDate() - diff);

  const weeks = [];
  let cursor = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

