const board = document.getElementById('memory-board');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const pairsEl = document.getElementById('pairs');
const restartBtn = document.getElementById('restart-btn');

const emojis = ['🐶', '🐱', '🐭', '🦊', '🐻', '🐼', '🐸', '🦄'];
let cards = [...emojis, ...emojis];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matches = 0;
let timer;
let seconds = 0;
let gameStarted = false;

function shuffle() {
  cards.sort(() => Math.random() - 0.5);
}

function initGame() {
  board.innerHTML = '';
  shuffle();
  moves = 0;
  matches = 0;
  seconds = 0;
  gameStarted = false;
  movesEl.textContent = moves;
  timeEl.textContent = '0s';
  if (pairsEl) pairsEl.textContent = '0/8';
  clearInterval(timer);
  
  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.emoji = emoji;
    
    card.innerHTML = `
      <div class="front">${emoji}</div>
      <div class="back"></div>
    `;
    
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function startTimer() {
  if (!gameStarted) {
    gameStarted = true;
    timer = setInterval(() => {
      seconds++;
      timeEl.textContent = `${seconds}s`;
    }, 1000);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  startTimer();
  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesEl.textContent = moves;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    disableCards();
    matches++;
    if (pairsEl) pairsEl.textContent = `${matches}/8`;
    if (matches === emojis.length) {
      clearInterval(timer);
      setTimeout(() => {
        let rawBest = localStorage.getItem('highscore_memory_moves');
        let best = rawBest ? Number(rawBest) : null;
        let isNewRecord = false;
        
        if (best === null || moves < best) {
          localStorage.setItem('highscore_memory_moves', moves);
          best = moves;
          isNewRecord = true;
        }
        
        let msg = `Anda menyelesaikan dalam ${moves} gerakan dan waktu ${seconds} detik.`;
        if (isNewRecord) {
          msg += ' REKOR GERAKAN BARU!';
          showToast('Rekor gerakan baru!', 'success');
        }
        showOverlay('Selamat!', msg, 'Main Lagi', initGame);
      }, 500);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

restartBtn.addEventListener('click', initGame);

// Mulai game saat pertama dimuat
initGame();
