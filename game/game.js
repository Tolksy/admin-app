import { startGameSession, endGameSession, trackGameCellClick, getGameStats } from '../shared/tracking.js';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const statsBtn = document.getElementById('statsBtn');
  const statsPanel = document.getElementById('statsPanel');
  const closeStats = document.getElementById('closeStats');
  const statClicks = document.getElementById('statClicks');
  const statTime = document.getElementById('statTime');
  const statSessions = document.getElementById('statSessions');
  const statLast = document.getElementById('statLast');
  if (!grid) return;

  const gridSize = 16;
  const totalCells = gridSize * gridSize;

  for (let index = 0; index < totalCells; index++) {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Cell ${x + 1}, ${y + 1}`);
    cell.addEventListener('click', () => {
      trackGameCellClick();
      cell.classList.toggle('on');
    });
    grid.appendChild(cell);
  }

  // Track session
  const sessionStart = startGameSession();
  window.addEventListener('beforeunload', () => endGameSession(sessionStart));

  function msToReadable(ms) {
    const sec = Math.floor(ms / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  function refreshStats() {
    const stats = getGameStats();
    if (statClicks) statClicks.textContent = String(stats.totalCellClicks || 0);
    if (statTime) statTime.textContent = msToReadable(stats.totalTimeMs || 0);
    if (statSessions) statSessions.textContent = String(stats.sessionCount || 0);
    if (statLast) statLast.textContent = stats.lastOpened ? new Date(stats.lastOpened).toLocaleString() : '—';
  }

  function openStats() {
    refreshStats();
    if (statsPanel) statsPanel.hidden = false;
  }
  function closeStatsPanel() {
    if (statsPanel) statsPanel.hidden = true;
  }

  if (statsBtn) statsBtn.addEventListener('click', openStats);
  if (closeStats) closeStats.addEventListener('click', closeStatsPanel);
  if (statsPanel) statsPanel.addEventListener('click', (e) => {
    if (e.target === statsPanel) closeStatsPanel();
  });
});

