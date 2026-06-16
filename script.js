/* arcadegameweb/script.js */

// Global Overlay Utility
function showOverlay(title, message, buttonText, onButtonClick) {
  let overlay = document.getElementById('global-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'global-overlay';
    overlay.className = 'overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    
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
  btn.focus();
}

function hideOverlay() {
  const overlay = document.getElementById('global-overlay');
  if (overlay) overlay.classList.remove('active');
}

// LocalStorage helpers
function getHighScore(gameKey) {
  const val = localStorage.getItem(`highscore_${gameKey}`);
  return val ? Number(val) : 0;
}

function setHighScore(gameKey, score) {
  const current = getHighScore(gameKey);
  if (score > current) {
    localStorage.setItem(`highscore_${gameKey}`, score);
    return true; // New high score!
  }
  return false;
}
