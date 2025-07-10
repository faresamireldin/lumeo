// js/auth.js (Updated with working Login and Signup)

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
            // 1. Fetch the user data from your API using the email
            const response = await fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/users/${email}`);
            
            if (!response.ok) {
                throw new Error("User not found or server error.");
            }

            const data = await response.json();
            
            // The API returns an array of items, we want the first one
            if (data.items.length === 0) {
                throw new Error("Incorrect email or password.");
            }
            
            const user = data.items[0];

            // 2. Check if the password matches (simplified for now)
            // IMPORTANT: See security note below!
            if (password !== user.password_hash) {
                throw new Error("Incorrect email or password.");
            }

            // 3. If login is successful
            sessionStorage.setItem('lumeo_user', JSON.stringify(user));
            window.location.href = 'home.html';
        } catch (error) {
            alert(`Login Failed: ${error.message}`);
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    });
}

// In js/auth.js, REPLACE the old signup logic with this

// Import the supabase client we just created
import { supabase } from './supabase-client.js';

// Get the signup form element from the HTML
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
        // You can add password confirmation logic here if you wish

        // Use Supabase to securely sign up the user
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // You can add extra data here that will be saved with the user
                data: {
                    full_name: name,
                    avatar_url: 'https://i.pravatar.cc/150', // Default avatar
                }
            }
        });

        if (error) {
            alert(`Signup failed: ${error.message}`);
        } else {
            // Supabase handles user creation and sending a confirmation email.
            // Now, we add their profile info to our public 'users' table.
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
