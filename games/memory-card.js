const board = document.getElementById('memory-board');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
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
    if (matches === emojis.length) {
      clearInterval(timer);
      setTimeout(() => {
        let best = getHighScore('memory_card_moves') || 999;
        let msg = `Anda menyelesaikan dalam ${moves} gerakan dan waktu ${seconds} detik.`;
        if (moves < best) {
          setHighScore('memory_card_moves', moves);
          msg += ' REKOR GERAKAN BARU!';
        }
        showOverlay('Selamat!', msg, 'Main Lagi', initGame);
      }, 500);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
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
