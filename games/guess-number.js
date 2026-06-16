let targetNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const feedback = document.getElementById('feedback');
const attemptsDisplay = document.getElementById('attempts');
const resetBtn = document.getElementById('reset-btn');

function handleGuess() {
  const guess = parseInt(guessInput.value);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = 'Masukkan angka 1 - 100!';
    feedback.style.color = '#ff4757';
    return;
  }
  
  attempts++;
  attemptsDisplay.textContent = `Percobaan: ${attempts}`;
  
  if (guess === targetNumber) {
    feedback.textContent = 'BENAR SEKALI! 🎉';
    feedback.style.color = 'var(--color-accent)';
    guessInput.disabled = true;
    guessBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    
    // Check local storage for least attempts
    let best = getHighScore('guess_number') || 999;
    let msg = `Anda berhasil menebak dalam ${attempts} percobaan.`;
    if (attempts < best) {
      setHighScore('guess_number', attempts);
      msg += ' REKOR BARU!';
    }
    showOverlay('Menang!', msg, 'Lanjut');
    
  } else if (guess < targetNumber) {
    feedback.textContent = 'Terlalu kecil! 📉';
    feedback.style.color = '#ffa502';
  } else {
    feedback.textContent = 'Terlalu besar! 📈';
    feedback.style.color = '#ffa502';
  }
  
  guessInput.value = '';
  guessInput.focus();
}

guessBtn.addEventListener('click', handleGuess);
guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleGuess();
});

resetBtn.addEventListener('click', () => {
  targetNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  attemptsDisplay.textContent = `Percobaan: 0`;
  feedback.textContent = '';
  guessInput.disabled = false;
  guessBtn.style.display = 'inline-block';
  resetBtn.style.display = 'none';
  guessInput.focus();
});

// Input focus style
guessInput.addEventListener('focus', () => {
  guessInput.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.5)';
});
guessInput.addEventListener('blur', () => {
  guessInput.style.boxShadow = 'none';
});
