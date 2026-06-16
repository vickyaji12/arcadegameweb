// Namespace untuk menghindari tabrakan variabel antar game
(() => {
  const area = document.getElementById("reaction-area");

  const timeDisplay = document.getElementById("time-display");
  const bestDisplay = document.getElementById("best-display");

  let state = "idle"; // idle, waiting, ready, early
  let startTime;
  let timeoutId;

  let bestTime = (() => {
    const raw = localStorage.getItem("highscore_reaction_lowest");
    const v = raw ? parseInt(raw) : 9999;
    return v;
  })();
  if (bestTime !== 9999) bestDisplay.textContent = `${bestTime} ms`;

  area.addEventListener("click", () => {
    if (state === "idle" || state === "early") {
      startTest();
    } else if (state === "waiting") {
      // Clicked too early
      clearTimeout(timeoutId);
      state = "early";
      area.className = "reaction-area state-early";
      area.innerHTML =
        'Terlalu Cepat!<br><span style="font-size:1rem;font-weight:normal">Klik untuk mencoba lagi</span>';
    } else if (state === "ready") {
      // Clicked on time
      const reactionTime = Date.now() - startTime;
      state = "idle";
      area.className = "reaction-area state-idle";
      area.innerHTML = `${reactionTime} ms<br><span style="font-size:1rem;font-weight:normal">Klik untuk mencoba lagi</span>`;
      timeDisplay.textContent = `${reactionTime} ms`;

      if (reactionTime < bestTime) {
        bestTime = reactionTime;
        // Simpan skor terbaik terendah (lebih cepat lebih baik)
        localStorage.setItem("highscore_reaction_lowest", bestTime);

        bestDisplay.textContent = `${bestTime} ms (Baru!)`;
      }
    }
  });

  function startTest() {
    state = "waiting";
    area.className = "reaction-area state-waiting";
    area.textContent = "Tunggu warna hijau...";
    timeDisplay.textContent = "0 ms";

    const waitTime = Math.random() * 3000 + 1500; // 1.5s to 4.5s

    timeoutId = setTimeout(() => {
      state = "ready";
      area.className = "reaction-area state-ready";
      area.textContent = "KLIK SEKARANG!";
      startTime = Date.now();
    }, waitTime);
  }
})();
