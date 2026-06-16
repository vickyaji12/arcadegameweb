const gridDisplay = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const restartBtn = document.getElementById('restart-btn');

let squares = [];
let score = 0;
let bestScore = getHighScore('2048_best') || 0;
bestScoreDisplay.textContent = bestScore;

function createBoard() {
  gridDisplay.innerHTML = '';
  squares = [];
  for (let i = 0; i < 16; i++) {
    let square = document.createElement('div');
    square.classList.add('grid-cell');
    square.innerHTML = '';
    gridDisplay.appendChild(square);
    squares.push(square);
  }
  generate();
  generate();
}

function generate() {
  const emptySquares = squares.filter(sq => sq.innerHTML == '');
  if (emptySquares.length === 0) return;
  
  const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  randomSquare.innerHTML = Math.random() > 0.1 ? 2 : 4;
  updateColors();
}

function updateColors() {
  squares.forEach(square => {
    square.className = 'grid-cell'; // reset classes
    if (square.innerHTML) {
      square.classList.add(`tile-${square.innerHTML}`);
    }
  });
}

function moveRight() {
  for (let i = 0; i < 16; i += 4) {
    let row = [
      parseInt(squares[i].innerHTML || 0),
      parseInt(squares[i+1].innerHTML || 0),
      parseInt(squares[i+2].innerHTML || 0),
      parseInt(squares[i+3].innerHTML || 0)
    ];
    let filteredRow = row.filter(num => num);
    let missing = 4 - filteredRow.length;
    let zeros = Array(missing).fill('');
    let newRow = zeros.concat(filteredRow);
    
    for(let j=0; j<4; j++) squares[i+j].innerHTML = newRow[j];
  }
}

function moveLeft() {
  for (let i = 0; i < 16; i += 4) {
    let row = [
      parseInt(squares[i].innerHTML || 0),
      parseInt(squares[i+1].innerHTML || 0),
      parseInt(squares[i+2].innerHTML || 0),
      parseInt(squares[i+3].innerHTML || 0)
    ];
    let filteredRow = row.filter(num => num);
    let missing = 4 - filteredRow.length;
    let zeros = Array(missing).fill('');
    let newRow = filteredRow.concat(zeros);
    
    for(let j=0; j<4; j++) squares[i+j].innerHTML = newRow[j];
  }
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    let col = [
      parseInt(squares[i].innerHTML || 0),
      parseInt(squares[i+4].innerHTML || 0),
      parseInt(squares[i+8].innerHTML || 0),
      parseInt(squares[i+12].innerHTML || 0)
    ];
    let filteredCol = col.filter(num => num);
    let missing = 4 - filteredCol.length;
    let zeros = Array(missing).fill('');
    let newCol = zeros.concat(filteredCol);
    
    for(let j=0; j<4; j++) squares[i+(j*4)].innerHTML = newCol[j];
  }
}

function moveUp() {
  for (let i = 0; i < 4; i++) {
    let col = [
      parseInt(squares[i].innerHTML || 0),
      parseInt(squares[i+4].innerHTML || 0),
      parseInt(squares[i+8].innerHTML || 0),
      parseInt(squares[i+12].innerHTML || 0)
    ];
    let filteredCol = col.filter(num => num);
    let missing = 4 - filteredCol.length;
    let zeros = Array(missing).fill('');
    let newCol = filteredCol.concat(zeros);
    
    for(let j=0; j<4; j++) squares[i+(j*4)].innerHTML = newCol[j];
  }
}

function combineRow() {
  for (let i = 0; i < 15; i++) {
    if (squares[i].innerHTML === squares[i+1].innerHTML && squares[i].innerHTML !== '' && (i+1)%4 !== 0) {
      let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i+1].innerHTML);
      squares[i].innerHTML = combinedTotal;
      squares[i+1].innerHTML = '';
      score += combinedTotal;
      scoreDisplay.textContent = score;
    }
  }
  checkWin();
}

function combineCol() {
  for (let i = 0; i < 12; i++) {
    if (squares[i].innerHTML === squares[i+4].innerHTML && squares[i].innerHTML !== '') {
      let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i+4].innerHTML);
      squares[i].innerHTML = combinedTotal;
      squares[i+4].innerHTML = '';
      score += combinedTotal;
      scoreDisplay.textContent = score;
    }
  }
  checkWin();
}

// Controls
function control(e) {
  if(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(e.key)) {
    e.preventDefault();
  }
  
  let oldGrid = squares.map(s => s.innerHTML);
  
  if (e.key === 'ArrowRight') {
    moveRight();
    combineRow();
    moveRight();
  } else if (e.key === 'ArrowLeft') {
    moveLeft();
    combineRow();
    moveLeft();
  } else if (e.key === 'ArrowUp') {
    moveUp();
    combineCol();
    moveUp();
  } else if (e.key === 'ArrowDown') {
    moveDown();
    combineCol();
    moveDown();
  }
  
  let newGrid = squares.map(s => s.innerHTML);
  if (oldGrid.join(',') !== newGrid.join(',')) {
    generate();
  }
  updateColors();
  checkForGameOver();
}

document.addEventListener('keydown', control);

function checkWin() {
  for (let i=0; i<squares.length; i++) {
    if (squares[i].innerHTML == 2048) {
      document.removeEventListener('keydown', control);
      updateBestScore();
      showOverlay('Menang!', 'Anda telah mencapai 2048! 🎉', 'Main Lagi', initGame);
    }
  }
}

function checkForGameOver() {
  let zeros = 0;
  for (let i=0; i<squares.length; i++) {
    if (squares[i].innerHTML == '') {
      zeros++;
    }
  }
  if (zeros === 0) {
    // Check if any moves possible
    let movesPossible = false;
    for(let i=0; i<15; i++) {
      if(squares[i].innerHTML === squares[i+1].innerHTML && (i+1)%4 !== 0) movesPossible = true;
    }
    for(let i=0; i<12; i++) {
      if(squares[i].innerHTML === squares[i+4].innerHTML) movesPossible = true;
    }
    
    if(!movesPossible) {
      document.removeEventListener('keydown', control);
      updateBestScore();
      showOverlay('Game Over', `Skor akhir Anda: ${score}`, 'Coba Lagi', initGame);
    }
  }
}

function updateBestScore() {
  if (score > bestScore) {
    bestScore = score;
    bestScoreDisplay.textContent = bestScore;
    setHighScore('2048_best', bestScore);
  }
}

function initGame() {
  score = 0;
  scoreDisplay.textContent = score;
  createBoard();
  document.removeEventListener('keydown', control);
  document.addEventListener('keydown', control);
}

restartBtn.addEventListener('click', initGame);

initGame();
