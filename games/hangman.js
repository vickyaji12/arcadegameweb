const wordDisplay = document.getElementById('word-display');
const keyboard = document.getElementById('keyboard');
const drawing = document.getElementById('drawing');
const statusText = document.getElementById('status-text');
const restartBtn = document.getElementById('restart-btn');

const words = ["JAVASCRIPT", "ARCADE", "PEMROGRAMAN", "INTERNET", "KOMPUTER", "WEBSITE", "HTML", "GAMING", "KEYBOARD", "MOUSE"];
const stages = [
  `
  
  
  
  
  
=========`,
  `
      |
      |
      |
      |
      |
=========`,
  `
  +---+
      |
      |
      |
      |
      |
=========`,
  `
  +---+
  |   |
      |
      |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
      |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
  `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

let selectedWord = "";
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = stages.length - 1;

function initGame() {
  selectedWord = words[Math.floor(Math.random() * words.length)];
  guessedLetters = [];
  mistakes = 0;
  
  updateWordDisplay();
  updateDrawing();
  generateKeyboard();
  
  statusText.textContent = "Tebak kata rahasia!";
  statusText.style.color = "inherit";
  restartBtn.style.display = "none";
  keyboard.style.display = "flex";
}

function updateWordDisplay() {
  wordDisplay.innerHTML = selectedWord
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
}

function updateDrawing() {
  drawing.textContent = stages[mistakes];
}

function generateKeyboard() {
  keyboard.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.classList.add("key");
    btn.textContent = letter;
    btn.addEventListener("click", () => handleGuess(letter, btn));
    keyboard.appendChild(btn);
  }
}

function handleGuess(letter, btn) {
  btn.disabled = true;
  guessedLetters.push(letter);
  
  if (selectedWord.includes(letter)) {
    updateWordDisplay();
    checkWin();
  } else {
    mistakes++;
    updateDrawing();
    checkLose();
  }
}

function checkWin() {
  const currentWord = wordDisplay.innerHTML.replace(/\s/g, "");
  if (currentWord === selectedWord) {
    statusText.textContent = "SELAMAT! ANDA MENANG 🎉";
    statusText.style.color = "var(--color-accent)";
    endGame();
  }
}

function checkLose() {
  if (mistakes === maxMistakes) {
    statusText.textContent = `KALAH! Katanya adalah: ${selectedWord}`;
    statusText.style.color = "#ff4757";
    endGame();
  }
}

function endGame() {
  keyboard.style.display = "none";
  restartBtn.style.display = "inline-block";
}

restartBtn.addEventListener("click", initGame);

initGame();
