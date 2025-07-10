// js/main.js

// --- SESSION CHECK (AUTH GUARD) ---
// Get user data from session storage
const loggedInUser = JSON.parse(sessionStorage.getItem('lumeo_user'));

// Define which pages are protected
const protectedPages = ['home.html', 'profile.html', 'settings.html', 'notifications.html', 'create.html', 'data.html', 'insights.html', 'post.html', 'story.html'];
const currentPage = window.location.pathname.split('/').pop();

if (protectedPages.includes(currentPage) && !loggedInUser) {
    // If the user is on a protected page AND not logged in, redirect to login
    window.location.href = 'login.html';
}

// --- HEADER PERSONALIZATION & LOGOUT ---
if (loggedInUser) {
    // Find the navigation avatar and profile link if they exist
    const navAvatar = document.getElementById('nav-user-avatar');
    const profileLink = document.getElementById('dropdown-profile-link');
    const logoutBtn = document.getElementById('logout-btn');

    if (navAvatar) {
        navAvatar.src = loggedInUser.avatar_url; // Use the stored avatar
    }
    if (profileLink) {
        // Make the profile link in the dropdown point to the logged-in user's profile
        profileLink.href = `profile.html?id=${loggedInUser.user_id}`;
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear the session data and redirect to login
            sessionStorage.removeItem('lumeo_user');
            window.location.href = 'login.html';
        });
    }
}
