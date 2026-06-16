// BUG FIX: Logika highscore terbalik diperbaiki
// Untuk Tebak Angka, skor lebih KECIL = lebih baik (jumlah percobaan)
// Menggunakan setLowScore / getLowScore dari script.js

let targetNumber = Math.floor(Math.random() * 100) + 1;
let attempts     = 0;
let gameOver     = false;

const guessInput      = document.getElementById('guess-input');
const guessBtn        = document.getElementById('guess-btn');
const feedback        = document.getElementById('feedback');
const attemptsDisplay = document.getElementById('attempts');
const resetBtn        = document.getElementById('reset-btn');

function handleGuess() {
  if (gameOver) return;
  const guess = parseInt(guessInput.value);
  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = '⚠️ Masukkan angka antara 1 - 100!';
    feedback.style.color = 'var(--color-warning)';
    guessInput.value = '';
    guessInput.focus();
    return;
  }

  attempts++;
  attemptsDisplay.textContent = `Percobaan: ${attempts}`;

  if (guess === targetNumber) {
    feedback.textContent = '🎉 BENAR SEKALI!';
    feedback.style.color = 'var(--color-success)';
    guessInput.disabled = true;
    guessBtn.style.display = 'none';
    resetBtn.style.display = 'inline-flex';
    gameOver = true;

    // Pakai setLowScore — lebih sedikit percobaan = lebih baik
    const isNewBest = setLowScore('guess_number', attempts);
    const best = getLowScore('guess_number');
    let msg = `Anda menebak angka ${targetNumber} dalam ${attempts} percobaan.`;
    if (isNewBest) msg += '\n🏆 REKOR BARU terbaik!';
    else msg += `\nRekor Terbaik: ${best} percobaan.`;
    showOverlay('Menang!', msg, 'Main Lagi', resetGame);

  } else if (guess < targetNumber) {
    feedback.textContent = '📈 Terlalu kecil! Coba lebih besar.';
    feedback.style.color = 'var(--color-warning)';
    showToast('Terlalu kecil!', 'info', 1200);
  } else {
    feedback.textContent = '📉 Terlalu besar! Coba lebih kecil.';
    feedback.style.color = 'var(--color-warning)';
    showToast('Terlalu besar!', 'info', 1200);
  }

  guessInput.value = '';
  guessInput.focus();
}

function resetGame() {
  targetNumber = Math.floor(Math.random() * 100) + 1;
  attempts     = 0;
  gameOver     = false;
  attemptsDisplay.textContent = 'Percobaan: 0';
  feedback.textContent = '';
  guessInput.disabled  = false;
  guessBtn.style.display   = 'inline-flex';
  resetBtn.style.display   = 'none';
  guessInput.focus();
}

guessBtn.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleGuess();
});
resetBtn.addEventListener('click', resetGame);
