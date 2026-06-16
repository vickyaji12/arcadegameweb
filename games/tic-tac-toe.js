const cells = document.querySelectorAll('.cell');
const statusMsg = document.getElementById('status-msg');
const restartBtn = document.getElementById('restart-btn');
const modeSelect = document.getElementById('mode-select');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.getAttribute('data-index'));

  if (board[index] !== '' || !gameActive) return;

  makeMove(index, currentPlayer);
  checkResult();

  if (gameActive && modeSelect.value.startsWith('ai') && currentPlayer === 'O') {
    setTimeout(makeAIMove, 400);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusMsg.textContent = `Giliran ${currentPlayer}`;
}

function checkResult() {
  let roundWon = false;
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    const winner = currentPlayer === 'X' ? 'O' : 'X';
    statusMsg.textContent = `Pemain ${winner} Menang! 🎉`;
    statusMsg.style.color = winner === 'X' ? 'var(--color-accent)' : '#ff4757';
    gameActive = false;
    showOverlay('Permainan Selesai', `Pemain ${winner} memenangkan permainan!`, 'Main Lagi', resetGame);
    return;
  }

  if (!board.includes('')) {
    statusMsg.textContent = 'Permainan Seri!';
    statusMsg.style.color = '#ffa502';
    gameActive = false;
    showOverlay('Permainan Selesai', 'Wah, seri! Tidak ada yang menang.', 'Main Lagi', resetGame);
    return;
  }
}

function makeAIMove() {
  if (!gameActive) return;
  const mode = modeSelect.value;
  let moveIndex = -1;

  if (mode === 'ai-easy') {
    const emptyCells = board.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);
    moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  } else if (mode === 'ai-hard') {
    moveIndex = minimax(board, 'O').index;
  }

  if (moveIndex !== -1) {
    makeMove(moveIndex, 'O');
    checkResult();
  }
}

// Minimax algorithm for unbeatable AI
function minimax(newBoard, player) {
  const emptyCells = newBoard.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);

  if (checkWin(newBoard, 'X')) return { score: -10 };
  else if (checkWin(newBoard, 'O')) return { score: 10 };
  else if (emptyCells.length === 0) return { score: 0 };

  const moves = [];
  for (let i = 0; i < emptyCells.length; i++) {
    const move = {};
    move.index = emptyCells[i];
    newBoard[emptyCells[i]] = player;

    if (player === 'O') {
      const result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      const result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[emptyCells[i]] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function checkWin(boardState, player) {
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (boardState[a] === player && boardState[b] === player && boardState[c] === player) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusMsg.textContent = 'Giliran X';
  statusMsg.style.color = 'inherit';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', resetGame);
modeSelect.addEventListener('change', resetGame);
