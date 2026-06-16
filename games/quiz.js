const startBtn = document.getElementById("start-btn");
const quizSetup = document.getElementById("quiz-setup");
const quizActive = document.getElementById("quiz-active");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const qCounterEl = document.getElementById("q-counter");
const qScoreEl = document.getElementById("q-score");
const errorMsg = document.getElementById("error-msg");

let questions = [];
let currentQIndex = 0;
let score = 0;

async function loadQuestions() {
  try {
    // Gunakan URL absolut berdasarkan lokasi saat ini agar tidak tergantung folder deploy
    const url = new URL("../data/quiz-questions.json", window.location.href);
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} - ${response.statusText} (GET ${url})`,
      );
    }

    questions = await response.json();
    startGame();
  } catch (error) {
    console.error("Fetch error:", error);
    errorMsg.style.display = "block";
    const message = error && error.message ? error.message : "unknown";
    errorMsg.textContent = `Gagal memuat JSON kuis. Cek console untuk detail. Error: ${message}`;
  }
}

function startGame() {
  quizSetup.style.display = "none";
  quizActive.style.display = "block";
  currentQIndex = 0;
  score = 0;
  qScoreEl.textContent = `Skor: 0`;
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQ = questions[currentQIndex];
  qCounterEl.textContent = `Soal ${currentQIndex + 1} / ${questions.length}`;
  questionEl.textContent = currentQ.question;

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
  nextBtn.style.display = "none";
  while (optionsEl.firstChild) {
    optionsEl.removeChild(optionsEl.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const selectedIndex = parseInt(selectedBtn.dataset.index);
  const correctIndex = questions[currentQIndex].answer;

  const isCorrect = selectedIndex === correctIndex;

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score += 20; // 20 pts per question
    qScoreEl.textContent = `Skor: ${score}`;
  } else {
    selectedBtn.classList.add("wrong");
    // highlight the correct one
    optionsEl.children[correctIndex].classList.add("correct");
  }

  // Disable all buttons
  Array.from(optionsEl.children).forEach((btn) => {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  });

  if (currentQIndex < questions.length - 1) {
    nextBtn.style.display = "block";
  } else {
    nextBtn.style.display = "block";
    nextBtn.textContent = "Lihat Hasil Akhir";
  }
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
  quizSetup.style.display = "block";
  startBtn.textContent = "MAIN LAGI";

  let best = getHighScore("quiz_score") || 0;
  let msg = `Skor akhir Anda: ${score} / ${questions.length * 20}`;
  if (score > best) {
    setHighScore("quiz_score", score);
    msg += "\nREKOR BARU!";
  }
  showOverlay("Kuis Selesai", msg, "Tutup");
}

// Pop-up pemberitahuan sementara (agar user tidak bingung saat Quiz Trivia masih dalam proses perbaikan)
const MAINTENANCE_MODE = true;

function showMaintenancePopup() {
  try {
    showOverlay(
      "Pemberitahuan",
      "Quiz Trivia sedang dalam proses perbaikan. Mohon pengertiannya—silakan coba kembali nanti.",
      "Mengerti",
    );
  } catch (e) {
    // fallback jika overlay helper tidak ada
    alert(
      "Quiz Trivia sedang dalam proses perbaikan. Mohon pengertiannya—silakan coba kembali nanti.",
    );
  }
}

// Notifikasi saat halaman diakses
if (MAINTENANCE_MODE) {
  // tunggu sedikit agar DOM ready dan overlay helper sudah tersedia
  window.addEventListener("load", () => showMaintenancePopup(), { once: true });
}

startBtn.addEventListener("click", () => {
  if (MAINTENANCE_MODE) {
    showMaintenancePopup();
    return;
  }

  if (questions.length === 0) {
    loadQuestions();
  } else {
    startGame();
  }
});
