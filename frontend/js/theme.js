// Initialize theme on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Theme.js: Initializing...');
    
    // Find the toggle button, accommodating both IDs used in the project
    const themeToggle = document.getElementById('themeToggle') || document.getElementById('theme-toggle');
    if (!themeToggle) {
        console.log('Theme.js: No theme toggle button found');
        return;
    }

    console.log('Theme.js: Theme toggle button found');

    const root = document.documentElement; // The <html> element
    const body = document.body; // The <body> element

    // This function applies the theme class to both html and body
    const applyTheme = (theme) => {
        console.log('Theme.js: Applying theme:', theme);
        
        if (theme === 'dark') {
            root.classList.add('dark');
            body.classList.add('dark-mode');
            console.log('Theme.js: Dark mode classes added');
        } else {
            root.classList.remove('dark');
            body.classList.remove('dark-mode');
            console.log('Theme.js: Light mode classes added');
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
        console.log('Theme.js: Toggling theme to:', newTheme);
        localStorage.setItem('sharebite-theme', newTheme);
        applyTheme(newTheme);
        
        // Show toast notification if available
        if (typeof showToast === 'function') {
            showToast(newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
        }
    };

    // Add click event listener
    themeToggle.addEventListener('click', toggleTheme);
    console.log('Theme.js: Click listener added');

    // On page load, apply the saved theme or detect system preference
    const savedTheme = localStorage.getItem('sharebite-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    console.log('Theme.js: Saved theme:', savedTheme);
    console.log('Theme.js: Initial theme:', initialTheme);
    
    applyTheme(initialTheme);
});