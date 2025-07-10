// js/auth.js (Simplified)

import { signUpUser, loginUser } from './api.js';

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userProfile = await loginUser(email, password);
            sessionStorage.setItem('lumeo_user', JSON.stringify(userProfile));
            window.location.href = 'home.html';
        } catch (error) {
            alert(`Login Failed: ${error.message}`);
        }
    });
}

// --- SIGNUP LOGIC ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signUpUser(name, email, password);
            alert('Success! Please check your email for a confirmation link to log in.');
            window.location.href = 'login.html';
        } catch (error) {
            alert(`Signup failed: ${error.message}`);
        }
    });
}
