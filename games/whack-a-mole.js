const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const timeBoard = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const moles = document.querySelectorAll('.mole');

let lastHole;
let timeUp = false;
let score = 0;
let time = 30;
let timerId;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function peep() {
  const time = randomTime(400, 1000);
  const hole = randomHole(holes);
  hole.classList.add('up');
  
  setTimeout(() => {
    hole.classList.remove('up');
    hole.querySelector('.mole').classList.remove('bonked');
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  scoreBoard.textContent = 0;
  timeBoard.textContent = 30;
  timeUp = false;
  score = 0;
  time = 30;
  startBtn.style.display = 'none';
  peep();
  
  timerId = setInterval(() => {
    time--;
    timeBoard.textContent = time;
    if (time <= 0) {
      clearInterval(timerId);
      timeUp = true;
      startBtn.style.display = 'inline-block';
      startBtn.textContent = 'MAIN LAGI';
      
      let best = getHighScore('whack_score');
      let msg = `Skor akhir Anda adalah ${score}.`;
      if (score > best) {
        setHighScore('whack_score', score);
        msg += ' REKOR BARU!';
      }
      showOverlay('Waktu Habis!', msg, 'Tutup');
    }
  }, 1000);
}

function bonk(e) {
  if (!e.isTrusted) return; // cheater!
  if (this.classList.contains('bonked')) return; // already bonked
  
  score++;
  this.classList.add('bonked');
  scoreBoard.textContent = score;
  
  // Visual hit effect
  this.parentNode.style.boxShadow = 'inset 0 10px 20px rgba(0, 242, 254, 0.8)';
  setTimeout(() => {
    this.parentNode.style.boxShadow = 'inset 0 10px 20px rgba(0,0,0,0.8)';
    this.parentNode.classList.remove('up');
    setTimeout(() => this.classList.remove('bonked'), 200);
  }, 150);
}

moles.forEach(mole => mole.addEventListener('click', bonk));
startBtn.addEventListener('click', startGame);
