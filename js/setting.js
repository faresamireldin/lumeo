// js/settings.js (Fully Functional Version)

document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('lumeo_user'));

    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    // Get all the interactive elements
    const privacyToggle = document.getElementById('privacy-toggle');
    const privacyStatusText = document.getElementById('privacy-status-text');

    // --- INITIAL DATA LOAD ---
    // Function to load the user's current settings
    async function loadUserSettings() {
        try {
            // We can reuse the user profile endpoint to get the latest data
            const response = await fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/users/${loggedInUser.user_id}`);
            if (!response.ok) throw new Error("Could not load settings.");

            const data = (await response.json()).items[0];
            
            // Set the toggle to the correct state based on database value
            const isPrivate = data.is_private === 'Y';
            privacyToggle.checked = isPrivate;
            privacyStatusText.textContent = isPrivate ? 'Your profile is currently private.' : 'Your profile is currently public.';

        } catch (error) {
            console.error("Error loading settings:", error);
        }
    }

    // --- EVENT LISTENERS ---
    if (privacyToggle) {
        privacyToggle.addEventListener('change', async (event) => {
            const isChecked = event.target.checked;
            const newStatus = isChecked ? 'Y' : 'N';
            
            // Show optimistic update on the UI immediately
            privacyStatusText.textContent = isChecked ? 'Your profile is now private.' : 'Your profile is now public.';

            // Call the API to save the change
            try {
                const response = await fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/users/${loggedInUser.user_id}/privacy`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_private: newStatus })
                });

                if (!response.ok) throw new Error("Failed to save privacy setting.");
                
            } catch (error) {
                console.error("Error saving setting:", error);
                alert("Could not save your setting. Please try again.");
                // Revert UI change on error
                loadUserSettings();
            }
        });
    }

    // --- OTHER BUTTONS (Placeholders) ---
    // ... your existing placeholder logic for other buttons ...

    // Load initial settings when the page opens
    loadUserSettings();
});
