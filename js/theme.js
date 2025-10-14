document.addEventListener('DOMContentLoaded', () => {
    // Find the toggle button, accommodating both IDs used in the project
    const themeToggle = document.getElementById('theme-toggle') || document.getElementById('themeToggle');
    if (!themeToggle) return;

    const root = document.documentElement; // The <html> element
    const body = document.body; // The <body> element

    // This function applies the theme class to both html and body
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            root.classList.add('dark');
            body.classList.add('dark-mode'); // Add dark-mode to body for auth pages
        } else {
            root.classList.remove('dark');
            body.classList.remove('dark-mode'); // Remove dark-mode from body
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
        const isDark = root.classList.contains('dark') || body.classList.contains('dark-mode');
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