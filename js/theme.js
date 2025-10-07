
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle') || document.getElementById('theme-toggle');
    const body = document.body;

  
    const applyTheme = () => {
        // Default to 'light-mode' if no theme is saved.
        const savedTheme = localStorage.getItem('theme') || 'light-mode';

        // Apply the theme class to the body.
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(savedTheme);

        // Update the toggle button icon/text to reflect the current theme.
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (savedTheme === 'dark-mode') {
                if (icon) { // For index.html with Font Awesome icon
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else { // For login/register.html with emoji
                    themeToggle.innerHTML = '☀️';
                }
            } else {
                if (icon) { // For index.html
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                } else { // For login/register.html
                    themeToggle.innerHTML = '🌙';
                }
            }
        }
    };

    const toggleTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light-mode';
        const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
        
        localStorage.setItem('theme', newTheme);
        applyTheme();
    };

    // Attach the event listener to the theme toggle button if it exists.
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Apply the saved theme as soon as the page loads.
    applyTheme();
});
