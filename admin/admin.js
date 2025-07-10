// admin/admin.js

// --- SHARED FUNCTION ---
// A simple function to get the logged-in admin from session storage
function getAdminFromSession() {
    const user = JSON.parse(sessionStorage.getItem('lumeo_user'));
    // Check if a user exists AND if their role is 'admin'
    if (user && user.user_role === 'admin') {
        return user;
    }
    return null;
}


// --- ADMIN LOGIN PAGE LOGIC ---
const adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginButton = document.getElementById('login-button');
        loginButton.disabled = true;
        loginButton.textContent = 'Logging In...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
    // The new URL includes the badge type as a query parameter
    const apiUrl = `https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/admin/users/${userIdToUpdate}/badge?badge_type=${badgeValue}`;

    const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            // We still send the admin ID in the header for security
            'current_user_id': adminUser.user_id 
        }
        // The 'body' is no longer needed
    });

    if (!response.ok) throw new Error("Failed to update badge.");
    
    // Refresh the user list to show the change
    loadAllUsers(adminUser.user_id);

} catch (error) {
    alert(error.message);
    button.disabled = false;
    button.textContent = 'Set Badge';
}

// --- ADMIN DASHBOARD PAGE LOGIC ---
const userListContainer = document.getElementById('user-list-container');
if (userListContainer) {
    const adminUser = getAdminFromSession();

    // Auth Guard for the dashboard
    if (!adminUser) {
        alert("Access Denied. Please log in as an admin.");
        window.location.href = 'login.html';
    } else {
        // If logged in as admin, load the user list
        loadAllUsers(adminUser.user_id);

        // Handle logout
        const logoutBtn = document.getElementById('admin-logout-btn');
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('lumeo_user');
            window.location.href = 'login.html';
        });
    }
}

async function loadAllUsers(adminId) {
    try {
        // Call the secure API endpoint, passing the admin's ID for verification
        const response = await fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/admin/users/?current_user_id=${adminId}`);
        if (!response.ok) {
            // This will happen if the security check fails on the back-end
            throw new Error("You do not have permission to view this data.");
        }

        const data = await response.json();
        const users = data.items;

        // Create the table HTML
        let tableHTML = `
            <table class="min-w-full divide-y divide-gray-800">
                <thead class="bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Badge</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
        `;

        users.forEach(user => {
            tableHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${user.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${user.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${user.user_role}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">${user.badge_type || 'None'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-purple-400 hover:text-purple-300">Set Badge</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        userListContainer.innerHTML = tableHTML;

    } catch (error) {
        userListContainer.innerHTML = `<p class="p-8 text-center text-red-500">${error.message}</p>`;
    }
}
