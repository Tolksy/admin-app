document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
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
    grid.appendChild(cell);
  }
});

