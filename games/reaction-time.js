// BUG FIX: Namespace IIFE + pakai setLowScore (lebih cepat = lebih baik)
(() => {
  const area        = document.getElementById("reaction-area");
  const timeDisplay = document.getElementById("time-display");
  const bestDisplay = document.getElementById("best-display");

  let state = "idle"; // idle | waiting | ready | early
  let startTime;
  let timeoutId;

  // Load best time (lower = better)
  let bestTime = (() => {
    const raw = localStorage.getItem("highscore_reaction_lowest");
    return raw ? parseInt(raw) : null;
  })();

  if (bestTime !== null) {
    bestDisplay.textContent = `${bestTime} ms`;
  }

  area.addEventListener("click", () => {
    if (state === "idle" || state === "early") {
      startTest();
    } else if (state === "waiting") {
      clearTimeout(timeoutId);
      state = "early";
      area.className = "reaction-area state-early";
      area.innerHTML = 'Terlalu Cepat! 🚫<br><span class="reaction-hint">Klik untuk mencoba lagi</span>';
    } else if (state === "ready") {
      const reactionTime = Date.now() - startTime;
      state = "idle";
      area.className = "reaction-area state-idle";
      area.innerHTML = `${reactionTime} ms<br><span class="reaction-hint">Klik untuk mencoba lagi</span>`;
      timeDisplay.textContent = `${reactionTime} ms`;

      if (bestTime === null || reactionTime < bestTime) {
        bestTime = reactionTime;
        localStorage.setItem("highscore_reaction_lowest", bestTime);
        bestDisplay.textContent = `${bestTime} ms ⭐`;
        showToast(`Rekor baru: ${bestTime} ms!`, 'success');
      } else {
        const diff = reactionTime - bestTime;
        showToast(`+${diff} ms dari rekor terbaik`, 'info', 2000);
      }
    }
  });

  function startTest() {
    state = "waiting";
    area.className = "reaction-area state-waiting";
    area.textContent = "Tunggu...";
    timeDisplay.textContent = "—";

    const waitTime = Math.random() * 3000 + 1500;
    timeoutId = setTimeout(() => {
      state = "ready";
      area.className = "reaction-area state-ready";
      area.textContent = "KLIK SEKARANG!";
      startTime = Date.now();
    }, waitTime);
  }
})();
