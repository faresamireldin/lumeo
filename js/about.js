// js/about.js (Fully Dynamic Version)

// --- MAIN LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // Get user ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        document.body.innerHTML = "<h1>User ID not found.</h1>";
        return;
    }

    loadAboutData(userId);
});


// --- DATA FETCHING & RENDERING ---
async function loadAboutData(userId) {
    try {
        // Fetch data from the user profile endpoint we already created
        const response = await fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/users/${userId}`);
        if (!response.ok) throw new Error("Could not load user information.");
        
        const data = await response.json();
        const profile = data.items[0];

        if (!profile) throw new Error("Profile data not found.");

        // Populate the page with live data
        document.getElementById('header-name').textContent = `About ${profile.name}`;
        document.getElementById('sub-header').textContent = `Details about ${profile.name}'s profile.`;
        document.getElementById('joined-date').textContent = new Date(profile.joined_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        document.getElementById('email-address').textContent = profile.email;
        document.getElementById('bio-text').textContent = profile.bio;

        // Populate interests
        const interestsContainer = document.getElementById('interests-container');
        if (profile.interests && profile.interests.length > 0) {
            interestsContainer.innerHTML = profile.interests.map(interest => 
                `<span class="bg-[#3a3a3d] text-white/90 text-sm font-medium px-3 py-1 rounded-full">${interest}</span>`
            ).join('');
        } else {
            interestsContainer.innerHTML = '<p class="text-sm text-gray-500">No interests listed.</p>';
        }

        // Populate links
        const linksContainer = document.getElementById('links-container');
        if (profile.links && profile.links.length > 0) {
            linksContainer.innerHTML = profile.links.map(link => `
                <div class="flex items-center gap-4">
                    <div class="flex-shrink-0 text-gray-400"><span class="material-icons">link</span></div>
                    <div>
                        <p class="font-semibold text-gray-400">${link.name}</p>
                        <a class="text-[var(--primary-color)] hover:underline" href="https://${link.url}" target="_blank" rel="noopener noreferrer">${link.url}</a>
                    </div>
                </div>
            `).join('');
        } else {
            linksContainer.innerHTML = '<p class="text-sm text-gray-500">No links provided.</p>';
        }

    } catch (error) {
        console.error("Failed to load about page:", error);
        document.body.innerHTML = `<h1 class="text-white text-center p-8">${error.message}</h1>`;
    }
}
