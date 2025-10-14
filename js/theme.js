// theme.js - Fixed Theme Toggle for ShareBite
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Theme] Initializing...');
    
    // FIXED: Changed from 'theme-toggle' to 'themeToggle' (camelCase)
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.error('[Theme] Toggle button not found! Looking for id="themeToggle"');
        return;
    }
    
    console.log('[Theme] Toggle button found:', themeToggle);

    const root = document.documentElement; // The <html> element
    const body = document.body; // The <body> element

    // This function applies the theme class to both html and body
    const applyTheme = (theme) => {
        console.log('[Theme] Applying theme:', theme);
        
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
                console.log('[Theme] Icon changed to sun ☀️');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                console.log('[Theme] Icon changed to moon 🌙');
            }
        } else { // For pages with emoji buttons
            themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            console.log('[Theme] Emoji updated');
        }
    };

    // This function handles the click event
    const toggleTheme = () => {
        console.log('[Theme] Toggle button clicked!');
        
        const isDark = root.classList.contains('dark') || body.classList.contains('dark-mode');
        const newTheme = isDark ? 'light' : 'dark';
        
        console.log('[Theme] Switching from', isDark ? 'dark' : 'light', 'to', newTheme);
        
        localStorage.setItem('sharebite-theme', newTheme);
        applyTheme(newTheme);
    };

    themeToggle.addEventListener('click', toggleTheme);
    console.log('[Theme] Click listener attached');

    // On page load, apply the saved theme or detect system preference
    const savedTheme = localStorage.getItem('sharebite-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    console.log('[Theme] Initial theme:', initialTheme, '(saved:', savedTheme, ', prefersDark:', prefersDark, ')');
    
    applyTheme(initialTheme);
    
    console.log('[Theme] Initialization complete ✓');
});