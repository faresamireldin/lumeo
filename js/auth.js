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

// ==================================
//  SIGNUP LOGIC (UPDATED WITH API CALL)
// ==================================
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const signupButton = document.getElementById('signup-button');
        signupButton.disabled = true;
        signupButton.textContent = 'Creating Account...';

        // 1. Get user data from the form
        const name = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            signupButton.disabled = false;
            signupButton.textContent = 'Sign Up';
            return;
        }

        // 2. Prepare the data for the API
        const userData = {
            p_name: name,
            p_email: email,
            p_password_hash: password, // See security note below
            p_avatar_url: 'https://i.pravatar.cc/150', // Default avatar
            p_bio: 'Welcome to Lumeo!'
        };

        // 3. Call the API using fetch()
        try {
            const response = await fetch('https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                // If the server responded with an error, show it
                throw new Error(`Server responded with status: ${response.status}`);
            }

            alert('Success! Your account has been created. Please log in.');
            window.location.href = 'login.html'; // Redirect to login page

        } catch (error) {
            alert(`Signup failed: ${error.message}`);
        } finally {
            signupButton.disabled = false;
            signupButton.textContent = 'Sign Up';
        }
    });
}