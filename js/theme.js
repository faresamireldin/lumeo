// js/theme.js
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    // Get the elements for the owl animation
    const darkOwl = document.querySelector('.owl.dark');
    const lightOwl = document.querySelector('.owl.light');

    // This single function applies the theme to the entire page
    function applyTheme(theme) {
        const docElement = document.documentElement;
        const body = document.body;

        if (theme === 'dark') {
            docElement.classList.add('dark');
            body.classList.add('dark');
            body.classList.remove('light');
            toggle.checked = true;
            // Show the dark owl and hide the light one
            if (darkOwl && lightOwl) {
                darkOwl.style.display = 'block';
                lightOwl.style.display = 'none';
            }
        } else {
            docElement.classList.remove('dark');
            body.classList.add('light');
            body.classList.remove('dark');
            toggle.checked = false;
            // Show the light owl and hide the dark one
            if (darkOwl && lightOwl) {
                darkOwl.style.display = 'none';
                lightOwl.style.display = 'block';
            }
        }
    }

    // This function runs when the toggle switch is clicked
    function handleToggleClick() {
        const newTheme = toggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme); // Save the choice
        applyTheme(newTheme);
    }

    // --- INITIAL SETUP WHEN PAGE LOADS ---
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    // --- ADD EVENT LISTENERS ---
    toggle.addEventListener('change', handleToggleClick);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
});