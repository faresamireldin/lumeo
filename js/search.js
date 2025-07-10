// js/search.js (Fully Functional Version)

let loggedInUser = null;

// --- RENDER FUNCTION ---
function renderResults(users) {
    const resultsContainer = document.getElementById('search-results-container');
    if (!resultsContainer) return;

    if (!users || users.length === 0) {
        resultsContainer.innerHTML = '<p class="text-gray-400 text-center p-8">No results found.</p>';
        return;
    }

    resultsContainer.innerHTML = users.map(user => {
        // The is_following flag (1 or 0) comes from our updated PL/SQL procedure
        const isFollowing = user.is_following > 0;
        const buttonClass = isFollowing ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-200';
        const buttonText = isFollowing ? 'Following' : 'Follow';

        return `
            <div class="flex items-center justify-between p-4 rounded-xl">
                <a href="profile.html?id=${user.user_id}" class="flex items-center gap-4">
                    <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" style='background-image: url("${user.avatar_url}");'></div>
                    <div>
                        <p class="font-semibold text-lg">${user.name}</p>
                        <p class="text-gray-400 text-sm">${user.email}</p>
                    </div>
                </a>
                <button 
                    data-user-id="${user.user_id}" 
                    data-is-following="${isFollowing}"
                    class="follow-btn ${buttonClass} px-5 py-2 rounded-full text-sm font-bold transition-colors">
                    ${buttonText}
                </button>
            </div>
        `;
    }).join('');
}


// --- INTERACTION LOGIC ---
async function handleFollowClick(event) {
    // Check if a follow button was clicked
    if (!event.target.classList.contains('follow-btn')) return;

    const button = event.target;
    const userIdToFollow = button.dataset.userId;
    const isCurrentlyFollowing = button.dataset.isFollowing === 'true';

    button.disabled = true;
    button.textContent = '...';

    const followData = {
        follower_id: loggedInUser.user_id,
        following_id: parseInt(userIdToFollow)
    };

    const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
    const apiUrl = 'https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/followers/';

    try {
        const response = await fetch(apiUrl, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(followData)
        });
        if (!response.ok) throw new Error("Follow request failed.");
        
        // Refresh the search results to show the updated button state
        performSearch();

    } catch (error) {
        console.error("Error updating follow status:", error);
        button.textContent = isCurrentlyFollowing ? 'Following' : 'Follow'; // Reset button on error
        button.disabled = false;
    }
}


// --- SEARCH LOGIC ---
async function performSearch() {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results-container');
    const query = searchInput.value.trim();

    if (query.length < 2) {
        resultsContainer.innerHTML = '<p class="text-gray-400 text-center p-8">Enter at least 2 characters to search.</p>';
        return;
    }
    
    resultsContainer.innerHTML = '<p class="text-gray-400 text-center p-8">Searching...</p>';

    try {
        const apiUrl = `https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/search/users/${encodeURIComponent(query)}?current_user_id=${loggedInUser.user_id}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Search request failed.");

        const data = await response.json();
        renderResults(data.items);

    } catch (error) {
        console.error("Search error:", error);
        resultsContainer.innerHTML = '<p class="text-red-500 text-center p-8">Error loading search results.</p>';
    }
}


// --- MAIN SETUP ---
document.addEventListener('DOMContentLoaded', () => {
    loggedInUser = JSON.parse(sessionStorage.getItem('lumeo_user'));
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results-container');

    if (searchInput && resultsContainer) {
        searchInput.addEventListener('input', performSearch);
        // Add one event listener to the container for all buttons (event delegation)
        resultsContainer.addEventListener('click', handleFollowClick);
    }
});
