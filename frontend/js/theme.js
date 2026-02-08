document.addEventListener('DOMContentLoaded', () => {
    // Find the toggle button, accommodating both ID formats (themeToggle and theme-toggle)
    let themeToggle = document.getElementById('themeToggle') || document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const body = document.body; // The <body> element

    // This function applies the theme class to body only
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        updateIcon(theme);
    };

    // This function updates the visual state of the toggle button
    const updateIcon = (theme) => {
        const icon = themeToggle.querySelector('i'); // For pages with Font Awesome icons
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        } else { // For pages with emoji buttons
            themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        }
    };

    // This function handles the click event
    const toggleTheme = () => {
        const isDark = body.classList.contains('dark-mode');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('sharebite-theme', newTheme);
        applyTheme(newTheme);
    };

    themeToggle.addEventListener('click', toggleTheme);

    // On page load, apply the saved theme or detect system preference
    const savedTheme = localStorage.getItem('sharebite-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
});