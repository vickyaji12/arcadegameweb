const choices = ['rock', 'paper', 'scissors'];
const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

const playerHand = document.getElementById('player-hand');
const computerHand = document.getElementById('computer-hand');
const resultMsg = document.getElementById('result-msg');
const scoreWinEl = document.getElementById('score-win');
const scoreLoseEl = document.getElementById('score-lose');
const scoreTieEl = document.getElementById('score-tie');
const resetStatsBtn = document.getElementById('reset-stats');

let stats = { win: 0, lose: 0, tie: 0 };
const savedStats = localStorage.getItem('rps_stats');
if (savedStats) stats = JSON.parse(savedStats);

function updateScoreUI() {
  scoreWinEl.textContent = stats.win;
  scoreLoseEl.textContent = stats.lose;
  scoreTieEl.textContent = stats.tie;
}

updateScoreUI();

document.querySelectorAll('.choice-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const playerChoice = btn.dataset.choice;
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    // Animation reset
    playerHand.style.transform = 'translateY(-20px)';
    computerHand.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      playerHand.style.transform = 'translateY(0)';
      computerHand.style.transform = 'translateY(0)';
      playerHand.textContent = emojis[playerChoice];
      computerHand.textContent = emojis[computerChoice];
      
      let outcome = 'tie';
      if (playerChoice === computerChoice) {
        outcome = 'tie';
        resultMsg.textContent = 'SERI!';
        resultMsg.style.color = '#ffa502';
      } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
      ) {
        outcome = 'win';
        resultMsg.textContent = 'ANDA MENANG! 🎉';
        resultMsg.style.color = 'var(--color-accent)';
      } else {
        outcome = 'lose';
        resultMsg.textContent = 'KOMPUTER MENANG! 💀';
        resultMsg.style.color = '#ff4757';
      }
      
      stats[outcome]++;
      localStorage.setItem('rps_stats', JSON.stringify(stats));
      localStorage.setItem('rps_wins', stats.win);
      updateScoreUI();
    }, 150);
  });
});

resetStatsBtn.addEventListener('click', () => {
  stats = { win: 0, lose: 0, tie: 0 };
  localStorage.removeItem('rps_stats');
  localStorage.removeItem('rps_wins');
  updateScoreUI();
  playerHand.textContent = '❓';
  computerHand.textContent = '❓';
  resultMsg.textContent = 'Pilih senjatamu!';
  resultMsg.style.color = 'inherit';
});
