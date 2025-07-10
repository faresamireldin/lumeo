// js/auth.js (Simplified for Supabase Sessions)

import { supabase_client as supabase } from './supabase-client.js';

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const loginButton = document.getElementById('login-button');
        loginButton.disabled = true;
        loginButton.textContent = 'Logging In...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Supabase handles the login and sets the session cookie automatically
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            
            // If there's no error, redirect. The auth guard in main.js will handle the rest.
            window.location.href = 'home.html';

        } catch (error) {
            alert(`Login Failed: ${error.message}`);
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    });
}


// --- SIGNUP LOGIC ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    // ... Your existing, working signup code remains here ...
    // It's already using supabase.auth.signUp(), which is correct.
}
