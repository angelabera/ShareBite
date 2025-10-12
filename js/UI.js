// js/themeToggle.js
(function () {
  const THEME_KEY = 'sharebite-theme'; // localStorage key
  const body = document.body;
  const toggleBtn = document.getElementById('themeToggle');

  if (!toggleBtn || !body) return;

  // apply saved theme or default to light
  const saved = localStorage.getItem(THEME_KEY);
  const initial = saved === 'dark' ? 'dark' : 'light';
  applyTheme(initial);

  // click toggles theme
  toggleBtn.addEventListener('click', () => {
    const isDark = body.classList.contains('theme-dark');
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  function applyTheme(mode) {
    if (mode === 'dark') {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      swapIconToSun();
      toggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      swapIconToMoon();
      toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // #themeToggle button (keeps UI consistent)
  function swapIconToMoon() {
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
  function swapIconToSun() {
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
})();
