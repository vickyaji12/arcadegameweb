const scoreDisplay = document.getElementById('score');
const ppcDisplay = document.getElementById('ppc-display');
const ppsDisplay = document.getElementById('pps-display');
const clickBtn = document.getElementById('click-btn');
const btnUpClick = document.getElementById('btn-upgrade-click');
const btnUpAuto = document.getElementById('btn-upgrade-auto');
const costClickDisplay = document.getElementById('cost-click');
const costAutoDisplay = document.getElementById('cost-auto');
const resetBtn = document.getElementById('reset-btn');

let state = {
  score: 0,
  ppc: 1, // points per click
  pps: 0, // points per second
  costClick: 50,
  costAuto: 100
};

// Load saved state
const savedState = localStorage.getItem('clicker_state');
if (savedState) {
  state = JSON.parse(savedState);
}

function updateUI() {
  scoreDisplay.textContent = Math.floor(state.score);
  ppcDisplay.textContent = state.ppc;
  ppsDisplay.textContent = state.pps;
  costClickDisplay.textContent = state.costClick;
  costAutoDisplay.textContent = state.costAuto;
  
  btnUpClick.disabled = state.score < state.costClick;
  btnUpAuto.disabled = state.score < state.costAuto;
  
  btnUpClick.style.opacity = state.score < state.costClick ? 0.5 : 1;
  btnUpAuto.style.opacity = state.score < state.costAuto ? 0.5 : 1;
}

function saveState() {
  localStorage.setItem('clicker_state', JSON.stringify(state));
}

// Click Event
clickBtn.addEventListener('click', (e) => {
  state.score += state.ppc;
  updateUI();
  
  // Create flying text
  const rect = clickBtn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const floating = document.createElement('div');
  floating.classList.add('flying-text');
  floating.textContent = `+${state.ppc}`;
  floating.style.left = `${x}px`;
  floating.style.top = `${y}px`;
  
  clickBtn.parentElement.appendChild(floating);
  setTimeout(() => floating.remove(), 1000);
});

// Upgrades
btnUpClick.addEventListener('click', () => {
  if (state.score >= state.costClick) {
    state.score -= state.costClick;
    state.ppc += 1;
    state.costClick = Math.floor(state.costClick * 1.5);
    updateUI();
    saveState();
  }
});

btnUpAuto.addEventListener('click', () => {
  if (state.score >= state.costAuto) {
    state.score -= state.costAuto;
    state.pps += 1;
    state.costAuto = Math.floor(state.costAuto * 1.5);
    updateUI();
    saveState();
  }
});

// Auto generation loop (runs 10x a second for smoothness)
setInterval(() => {
  if (state.pps > 0) {
    state.score += state.pps / 10;
    updateUI();
  }
}, 100);

// Save every 5 seconds
setInterval(saveState, 5000);

resetBtn.addEventListener('click', () => {
  if (confirm("Yakin ingin mereset semua kemajuan Clicker Anda?")) {
    localStorage.removeItem('clicker_state');
    state = { score: 0, ppc: 1, pps: 0, costClick: 50, costAuto: 100 };
    updateUI();
  }
});

updateUI();
