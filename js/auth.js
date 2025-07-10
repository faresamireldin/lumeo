// js/auth.js (Updated with working Login and Signup)

import { supabase } from './supabase-client.js';

// ==================================
//  LOGIN LOGIC
// ==================================
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
            // 1. Use Supabase to sign the user in
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Login failed, please try again.");

            // 2. Fetch the user's public profile data from your 'users' table
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .single(); // .single() gets one record instead of an array

            if (profileError) throw profileError;

            // 3. Save the user's data to session storage to keep them logged in
            sessionStorage.setItem('lumeo_user', JSON.stringify(profileData));

            // 4. Redirect to the home page
            window.location.href = 'home.html';

        } catch (error) {
            alert(`Login Failed: ${error.message}`);
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    });
}


// ==================================
//  SIGNUP LOGIC
// ==================================
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const signupButton = document.getElementById('signup-button');
        signupButton.disabled = true;
        signupButton.textContent = 'Creating Account...';

        const name = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Use Supabase to securely sign up the user
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { full_name: name, avatar_url: 'https://i.pravatar.cc/150' }
            }
        });

        if (error) {
            alert(`Signup failed: ${error.message}`);
        } else {
            // Now, add their profile info to our public 'users' table
            const { error: profileError } = await supabase
                .from('users')
                .insert([
                    { id: data.user.id, name: name, email: email, bio: 'Welcome to Lumeo!', avatar_url: 'https://i.pravatar.cc/150' }
                ]);

            if (profileError) {
                alert(`Could not create profile: ${profileError.message}`);
            } else {
                alert('Success! Please check your email for a confirmation link to log in.');
                window.location.href = 'login.html';
            }
        }
        
        signupButton.disabled = false;
        signupButton.textContent = 'Sign Up';
    });
}
