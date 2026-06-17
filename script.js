/* ============================================================
   arcadegameweb/script.js — Global Utilities v2.0
   ============================================================ */

// ─── Toast Notification ───────────────────────────────────
function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', danger: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}

// ─── Overlay / Modal ──────────────────────────────────────
function showOverlay(title, message, buttonText, onButtonClick) {
  let overlay = document.getElementById('global-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'global-overlay';
    overlay.className = 'overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'overlay-title');

    const content = document.createElement('div');
    content.className = 'overlay-content';

    const titleEl = document.createElement('h2');
    titleEl.id = 'overlay-title';

    const msgEl = document.createElement('p');
    msgEl.id = 'overlay-message';

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.id = 'overlay-btn';

    content.appendChild(titleEl);
    content.appendChild(msgEl);
    content.appendChild(btn);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideOverlay();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) hideOverlay();
    });
  }

  document.getElementById('overlay-title').textContent = title;
  document.getElementById('overlay-message').textContent = message;

  const btn = document.getElementById('overlay-btn');
  btn.textContent = buttonText || 'Tutup';
  btn.onclick = () => {
    hideOverlay();
    if (onButtonClick) onButtonClick();
  };

  overlay.classList.add('active');
  setTimeout(() => btn.focus(), 50);
}

function hideOverlay() {
  const overlay = document.getElementById('global-overlay');
  if (overlay) overlay.classList.remove('active');
}

// ─── LocalStorage Helpers ─────────────────────────────────

/** Highscore normal (lebih besar = lebih baik) */
function getHighScore(gameKey) {
  const val = localStorage.getItem(`highscore_${gameKey}`);
  return val ? Number(val) : 0;
}

function setHighScore(gameKey, score) {
  const current = getHighScore(gameKey);
  if (score > current) {
    localStorage.setItem(`highscore_${gameKey}`, score);
    return true;
  }
  return false;
}

/** Low score (lebih kecil = lebih baik, misal: waktu reaksi, jumlah percobaan) */
function getLowScore(gameKey) {
  const val = localStorage.getItem(`highscore_${gameKey}_lowest`);
  return val ? Number(val) : null;
}

function setLowScore(gameKey, score) {
  const current = getLowScore(gameKey);
  if (current === null || score < current) {
    localStorage.setItem(`highscore_${gameKey}_lowest`, score);
    return true;
  }
  return false;
}

// ─── Page Entrance Animation & Security Restrictions ──────
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';

  // Blokir Klik Kanan (Context Menu)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showToast('Fitur inspeksi dinonaktifkan demi keamanan.', 'warning', 2000);
  });

  // Blokir Keyboard Shortcut untuk Inspect Element / Developer Tools
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      showToast('Developer tools dinonaktifkan.', 'warning', 2000);
    }
    // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element Inspector)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      showToast('Developer tools dinonaktifkan.', 'warning', 2000);
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      showToast('Melihat kode sumber dinonaktifkan.', 'warning', 2000);
    }
    // Ctrl+S (Save Page) - opsional tetapi berguna mencegah download aset langsung
    if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
    }
  });
});
