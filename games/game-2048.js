// game-2048.js — Added mobile swipe support + toast feedback

const gridDisplay     = document.getElementById('grid');
const scoreDisplay    = document.getElementById('score');
const bestScoreDisplay= document.getElementById('best-score');
const restartBtn      = document.getElementById('restart-btn');

let squares  = [];
let score    = 0;
let bestScore= getHighScore('2048_best') || 0;
let gameActive = true;
bestScoreDisplay.textContent = bestScore.toLocaleString();

function createBoard() {
  gridDisplay.innerHTML = '';
  squares = [];
  for (let i = 0; i < 16; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-cell');
    gridDisplay.appendChild(square);
    squares.push(square);
  }
  generate();
  generate();
  gameActive = true;
}

function generate() {
  const empty = squares.filter(sq => sq.innerHTML === '');
  if (empty.length === 0) return;
  const sq = empty[Math.floor(Math.random() * empty.length)];
  sq.innerHTML = Math.random() > 0.1 ? 2 : 4;
  updateColors();
}

function updateColors() {
  squares.forEach(sq => {
    sq.className = 'grid-cell';
    if (sq.innerHTML) sq.classList.add(`tile-${sq.innerHTML}`);
  });
}

function slide(row) {
  let filtered = row.filter(n => n !== 0);
  const missing = 4 - filtered.length;
  return Array(missing).fill(0).concat(filtered);
}

function slideRight() {
  for (let i = 0; i < 16; i += 4) {
    let row = squares.slice(i, i+4).map(sq => parseInt(sq.innerHTML) || 0);
    row = slide(row);
    for (let j = 0; j < 4; j++) squares[i+j].innerHTML = row[j] || '';
  }
}

function slideLeft() {
  for (let i = 0; i < 16; i += 4) {
    let row = squares.slice(i, i+4).map(sq => parseInt(sq.innerHTML) || 0);
    let filtered = row.filter(n => n !== 0);
    row = filtered.concat(Array(4 - filtered.length).fill(0));
    for (let j = 0; j < 4; j++) squares[i+j].innerHTML = row[j] || '';
  }
}

function slideDown() {
  for (let i = 0; i < 4; i++) {
    let col = [0,1,2,3].map(r => parseInt(squares[i + r*4].innerHTML) || 0);
    col = slide(col);
    for (let r = 0; r < 4; r++) squares[i + r*4].innerHTML = col[r] || '';
  }
}

function slideUp() {
  for (let i = 0; i < 4; i++) {
    let col = [0,1,2,3].map(r => parseInt(squares[i + r*4].innerHTML) || 0);
    let filtered = col.filter(n => n !== 0);
    col = filtered.concat(Array(4 - filtered.length).fill(0));
    for (let r = 0; r < 4; r++) squares[i + r*4].innerHTML = col[r] || '';
  }
}

function combineRow() {
  for (let i = 0; i < 15; i++) {
    if (
      squares[i].innerHTML !== '' &&
      squares[i].innerHTML === squares[i+1].innerHTML &&
      (i+1) % 4 !== 0
    ) {
      const val = parseInt(squares[i].innerHTML) * 2;
      squares[i].innerHTML = val;
      squares[i+1].innerHTML = '';
      score += val;
      scoreDisplay.textContent = score.toLocaleString();
    }
  }
  checkWin();
}

function combineCol() {
  for (let i = 0; i < 12; i++) {
    if (
      squares[i].innerHTML !== '' &&
      squares[i].innerHTML === squares[i+4].innerHTML
    ) {
      const val = parseInt(squares[i].innerHTML) * 2;
      squares[i].innerHTML = val;
      squares[i+4].innerHTML = '';
      score += val;
      scoreDisplay.textContent = score.toLocaleString();
    }
  }
  checkWin();
}

function doMove(direction) {
  if (!gameActive) return;
  const oldGrid = squares.map(s => s.innerHTML);

  if      (direction === 'right') { slideRight(); combineRow(); slideRight(); }
  else if (direction === 'left')  { slideLeft();  combineRow(); slideLeft();  }
  else if (direction === 'up')    { slideUp();    combineCol(); slideUp();    }
  else if (direction === 'down')  { slideDown();  combineCol(); slideDown();  }

  const newGrid = squares.map(s => s.innerHTML);
  if (oldGrid.join(',') !== newGrid.join(',')) generate();
  updateColors();
  checkForGameOver();
}

// ── Keyboard Control
function onKeyDown(e) {
  const map = {
    ArrowRight: 'right', ArrowLeft: 'left',
    ArrowUp: 'up', ArrowDown: 'down'
  };
  if (map[e.key]) {
    e.preventDefault();
    doMove(map[e.key]);
  }
}

// ── Touch/Swipe Control (BUG FIX: tambah support mobile)
let touchStartX = 0;
let touchStartY = 0;

gridDisplay.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

gridDisplay.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (Math.max(absDx, absDy) < 20) return; // too small
  if (absDx > absDy) {
    doMove(dx > 0 ? 'right' : 'left');
  } else {
    doMove(dy > 0 ? 'down' : 'up');
  }
}, { passive: true });

function checkWin() {
  for (let sq of squares) {
    if (sq.innerHTML == 2048) {
      gameActive = false;
      updateBestScore();
      showOverlay('🏆 Menang!', `Anda mencapai 2048!\nSkor: ${score.toLocaleString()}`, 'Main Lagi', initGame);
      return;
    }
  }
}

function checkForGameOver() {
  const empty = squares.filter(sq => sq.innerHTML === '');
  if (empty.length > 0) return;

  let canMove = false;
  for (let i = 0; i < 15; i++) {
    if (squares[i].innerHTML === squares[i+1].innerHTML && (i+1) % 4 !== 0) canMove = true;
  }
  for (let i = 0; i < 12; i++) {
    if (squares[i].innerHTML === squares[i+4].innerHTML) canMove = true;
  }

  if (!canMove) {
    gameActive = false;
    updateBestScore();
    showOverlay('Game Over', `Papan penuh, tidak ada gerakan.\nSkor akhir: ${score.toLocaleString()}`, 'Coba Lagi', initGame);
  }
}

function updateBestScore() {
  if (score > bestScore) {
    bestScore = score;
    bestScoreDisplay.textContent = bestScore.toLocaleString();
    setHighScore('2048_best', bestScore);
    showToast('Rekor skor baru!', 'success');
  }
}

function initGame() {
  score = 0;
  scoreDisplay.textContent = '0';
  document.removeEventListener('keydown', onKeyDown);
  document.addEventListener('keydown', onKeyDown);
  createBoard();
}

restartBtn.addEventListener('click', initGame);
initGame();
