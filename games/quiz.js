// BUG FIX: MAINTENANCE_MODE dimatikan — quiz sudah bisa berjalan normal
const MAINTENANCE_MODE = false;

const startBtn    = document.getElementById("start-btn");
const quizSetup   = document.getElementById("quiz-setup");
const quizActive  = document.getElementById("quiz-active");
const questionEl  = document.getElementById("question");
const optionsEl   = document.getElementById("options");
const nextBtn     = document.getElementById("next-btn");
const qCounterEl  = document.getElementById("q-counter");
const qScoreEl    = document.getElementById("q-score");
const errorMsg    = document.getElementById("error-msg");
const progressBar = document.getElementById("progress-fill");

let questions     = [];
let currentQIndex = 0;
let score         = 0;
let answered      = false;

async function loadQuestions() {
  startBtn.disabled = true;
  startBtn.textContent = "Memuat...";
  try {
    const url = new URL("../data/quiz-questions.json", window.location.href);
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    questions = await response.json();
    startGame();
  } catch (error) {
    console.error("Fetch error:", error);
    errorMsg.style.display = "block";
    errorMsg.textContent = `Gagal memuat soal. Error: ${error.message}`;
    startBtn.disabled = false;
    startBtn.textContent = "COBA LAGI";
  }
}

function startGame() {
  quizSetup.style.display  = "none";
  quizActive.style.display = "block";
  currentQIndex = 0;
  score = 0;
  qScoreEl.textContent = "Skor: 0";
  showQuestion();
}

function showQuestion() {
  answered = false;
  resetState();
  const currentQ = questions[currentQIndex];
  qCounterEl.textContent = `Soal ${currentQIndex + 1} / ${questions.length}`;
  questionEl.textContent = currentQ.question;
  if (progressBar) {
    progressBar.style.width = `${((currentQIndex + 1) / questions.length) * 100}%`;
  }

  currentQ.options.forEach((optionText, index) => {
    const button = document.createElement("button");
    button.textContent = optionText;
    button.classList.add("option-btn");
    button.dataset.index = index;
    button.addEventListener("click", selectAnswer);
    optionsEl.appendChild(button);
  });
}

function resetState() {
  errorMsg.style.display = "none";
  nextBtn.style.display  = "none";
  while (optionsEl.firstChild) {
    optionsEl.removeChild(optionsEl.firstChild);
  }
}

function selectAnswer(e) {
  if (answered) return;
  answered = true;

  const selectedBtn   = e.target;
  const selectedIndex = parseInt(selectedBtn.dataset.index);
  const correctIndex  = questions[currentQIndex].answer;
  const isCorrect     = selectedIndex === correctIndex;

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score += 20;
    qScoreEl.textContent = `Skor: ${score}`;
    showToast("Benar! +20 poin", "success", 1500);
  } else {
    selectedBtn.classList.add("wrong");
    optionsEl.children[correctIndex].classList.add("correct");
    showToast("Salah!", "danger", 1500);
  }

  Array.from(optionsEl.children).forEach(btn => {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  });

  nextBtn.style.display = "block";
  nextBtn.textContent = currentQIndex < questions.length - 1
    ? "Soal Selanjutnya →"
    : "Lihat Hasil Akhir 🏁";
}

nextBtn.addEventListener("click", () => {
  currentQIndex++;
  if (currentQIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizActive.style.display = "none";
  quizSetup.style.display  = "block";
  startBtn.disabled = false;
  startBtn.textContent = "MAIN LAGI";

  const maxScore = questions.length * 20;
  const isNew = setHighScore("quiz_score", score);
  let msg = `Skor akhir Anda: ${score} / ${maxScore}`;
  if (isNew && score > 0) msg += "\n🎉 REKOR BARU!";
  showOverlay("Kuis Selesai!", msg, "Tutup");
}

startBtn.addEventListener("click", () => {
  if (questions.length === 0) {
    loadQuestions();
  } else {
    startGame();
  }
});
