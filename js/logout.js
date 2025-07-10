// js/logout.js

document.addEventListener('DOMContentLoaded', () => {
    const cancelButton = document.getElementById('cancel-button');
    const logoutButton = document.getElementById('logout-button');

    // If the cancel button is clicked, go back to the previous page
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            window.history.back();
        });
    }

    // If the logout button is clicked, log the user out and redirect
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // LATER: This is where we will call our API to log the user out on the server.

            // For now, show an alert and redirect to the login page.
            alert("You have been logged out.");
            window.location.href = 'login.html';
        });
    }
});
