// Lightweight cursor trail that adapts to theme (light/dark)
// Exposes a simple controller at window.cursorTrailController
(function () {
  const TRAIL_MIN_DELAY = 12; // ms between trail dots
  let lastTime = 0;
  let enabled = localStorage.getItem('cursorTrailEnabled') === null ? true : localStorage.getItem('cursorTrailEnabled') === 'true';

  function createDot(x, y) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    document.body.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }

  function onMove(e) {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastTime < TRAIL_MIN_DELAY) return;
    lastTime = now;
    const x = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
    const y = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
    createDot(x, y);
  }

  // Adapt trail color to theme by syncing CSS variable
  function updateTrailColor() {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    if (root.classList.contains('dark')) {
      root.style.setProperty('--trail-color', '#81C784');
    } else {
      const primary = cs.getPropertyValue('--primary-color') || '#4CAF50';
      root.style.setProperty('--trail-color', primary.trim());
    }
  }

  // Watch for class changes (theme toggles) on the root element
  const mo = new MutationObserver(() => updateTrailColor());
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Honor reduced motion preference
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced && reduced.matches) {
    // expose a no-op controller when motion is reduced
    window.cursorTrailController = {
      isEnabled: () => false,
      setEnabled: () => {}
    };
    return;
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });

  function setEnabled(val) {
    enabled = !!val;
    localStorage.setItem('cursorTrailEnabled', enabled);
  }

  // Expose controller
  window.cursorTrailController = {
    isEnabled: () => enabled,
    setEnabled
  };

  // Initialize
  updateTrailColor();
})();