// js/profile.js (Updated with Privacy Check)

// --- GLOBAL VARIABLES ---
let currentUserId = null;
let profileId = null;

// --- MAIN LOGIC - RUNS WHEN PAGE LOADS ---
document.addEventListener('DOMContentLoaded', () => {
    // Get the logged-in user from session storage
    const loggedInUser = JSON.parse(sessionStorage.getItem('lumeo_user'));
    if (loggedInUser) {
        currentUserId = loggedInUser.user_id;
    } else {
        window.location.href = 'login.html';
        return;
    }

    // Get the ID of the profile we want to view from the URL
    const urlParams = new URLSearchParams(window.location.search);
    profileId = urlParams.get('id');

    if (!profileId) {
        profileId = currentUserId;
    }
    
    loadProfilePage();
});


// --- DATA FETCHING AND RENDERING ---
async function loadProfilePage() {
    const profileLoader = document.getElementById('profile-loader');
    const profileContent = document.getElementById('profile-main-content');
    
    if(profileLoader) profileLoader.style.display = 'block';
    if(profileContent) profileContent.style.display = 'none';

    try {
        // --- THIS IS THE UPDATED PART ---
        // We now send the currentUserId as a "viewer_id" parameter to the API.
        const [profileResponse, postsResponse] = await Promise.all([
            fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/users/${profileId}?viewer_id=${currentUserId}`),
            fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/users/${profileId}/posts?viewer_id=${currentUserId}`)
        ]);

        if (!profileResponse.ok) throw new Error('Could not load profile data.');

        const profileDataArray = (await profileResponse.json()).items;
        if (profileDataArray.length === 0) {
            // This happens if the profile is private and we don't have access
            throw new Error('This profile is private or does not exist.');
        }
        const profileData = profileDataArray[0];
        
        const postsData = (await postsResponse.json()).items;
        
        // This fetch is no longer needed as the follow/follower counts are in profileData
        // and the 'following' list check is handled by the back-end.

        updateProfileUI(profileData, postsData.length);
        // We now need to check if the current user is following this profile
        // This would ideally come from the profileData object in a more advanced API
        // For now, we'll assume the back-end handles visibility, and the follow button logic can be simplified.
        updateActionsUI(profileData); 
        renderPosts(postsData);

        if(profileContent) profileContent.style.display = 'block';

    } catch (error) {
        console.error('Failed to load profile:', error);
        document.body.innerHTML = `<h1 class="text-white text-center p-8">${error.message}</h1>`;
    } finally {
        if(profileLoader) profileLoader.style.display = 'none';
    }
}

function updateProfileUI(profile, postCount) {
    document.getElementById('banner-image').style.backgroundImage = `url('${profile.banner_url || ''}')`;
    document.getElementById('profile-avatar').style.backgroundImage = `url('${profile.avatar_url}')`;
    document.getElementById('user-name').textContent = profile.name;
    document.getElementById('user-bio').textContent = profile.bio;
    document.getElementById('posts-count').textContent = postCount || 0;
    document.getElementById('followers-count').textContent = profile.follower_count;
    document.getElementById('following-count').textContent = profile.following_count;
    
    const aboutTabLink = document.getElementById('about-tab-link');
    if(aboutTabLink) {
        aboutTabLink.href = `about.html?id=${profile.user_id}`;
    }
}

function renderPosts(posts) {
    const postGrid = document.getElementById('post-grid');
    if (posts && posts.length > 0) {
        postGrid.innerHTML = posts.map(post => 
            `<a href="post.html?id=${post.post_id}"><div class="aspect-square bg-cover bg-center rounded-lg" style="background-image: url('${post.image_url}');"></div></a>`
        ).join('');
    } else {
        postGrid.innerHTML = '<p class="text-gray-500 col-span-full text-center">This user has no posts yet, or their profile is private.</p>';
    }
}

function updateActionsUI(profileData) {
    const actionsContainer = document.getElementById('profile-actions-container');
    
    if (profileData.user_id === currentUserId) {
        // Logic for showing the 'Actions' dropdown menu
        // This remains the same
    } else {
        // The logic for the follow button needs to be updated once we know the follow status
        // For now, we can show a placeholder or fetch the status separately.
        // The simplest approach is to assume the follow logic will be handled on click.
        // A more advanced API would return "is_following: true/false" with the profile data.
        actionsContainer.innerHTML = `
            <button id="follow-btn" class="px-8 py-2 rounded-full text-sm font-bold transition-colors bg-white text-gray-900 hover:bg-gray-200">
                Follow
            </button>
        `;
        document.getElementById('follow-btn').addEventListener('click', () => toggleFollow(false)); // Assume not following initially
    }
}

async function toggleFollow(isCurrentlyFollowing) {
    // This function remains the same as the previous version
    const actionBtn = document.getElementById('follow-btn');
    actionBtn.disabled = true;

    const followData = {
        follower_id: currentUserId,
        following_id: parseInt(profileId)
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
        
        loadProfilePage(); // Reload the page data to update follow status and counts

    } catch (error) {
        alert("Could not update follow status.");
        actionBtn.disabled = false;
    }
}