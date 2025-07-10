// js/main.js (Updated with Supabase Session Management)

import { supabase_client as supabase } from './supabase-client.js';

// --- SESSION CHECK (AUTH GUARD) ---
const protectedPages = ['home.html', 'profile.html', 'settings.html', 'notifications.html', 'create.html', 'data.html', 'insights.html', 'post.html', 'story.html']; // Add all pages that need login
const currentPage = window.location.pathname.split('/').pop();

// This function runs immediately to check the user's session
(async function checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (!session && protectedPages.includes(currentPage)) {
        // If there is NO session and the user is on a protected page, redirect to login
        window.location.href = 'login.html';
        return;
    }

    if (session && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        // If there IS a session and the user is on the login/signup page, redirect to home
        window.location.href = 'home.html';
        return;
    }
    
    // If a user is logged in, update the header
    if (session) {
        const user = session.user;
        const navAvatar = document.getElementById('nav-user-avatar');
        const profileLink = document.getElementById('dropdown-profile-link');
        const logoutBtn = document.getElementById('logout-btn');

        if (navAvatar) {
            // Get user's custom avatar from your public 'users' table
            const { data: profileData } = await supabase.from('users').select('avatar_url').eq('id', user.id).single();
            if(profileData) navAvatar.src = profileData.avatar_url;
        }
        if (profileLink) {
            profileLink.href = `profile.html?id=${user.id}`;
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await supabase.auth.signOut();
                window.location.href = 'login.html';
            });
        }
    }
})();
                                       
