// js/story.js (Full Story Viewer Logic)

// --- GLOBAL VARIABLES ---
let stories = [];
let currentUser = null;
let currentStoryIndex = 0;
let storyTimer;

// --- DOM ELEMENTS ---
const storyImageElement = document.getElementById('story-image');
const storyImageBackground = document.getElementById('story-background');
const userAvatarElement = document.getElementById('user-avatar');
const userNameElement = document.getElementById('user-name');
const progressBarContainer = document.getElementById('progress-bars');
const closeButton = document.getElementById('close-button');

// --- STORY PLAYER LOGIC ---

function showStory(index) {
    if (!stories[index]) {
        // If no more stories, go back to the home page
        window.location.href = 'home.html';
        return;
    }
    
    const story = stories[index];

    // Update images and user info
    storyImageElement.style.backgroundImage = `url('${story.image_url}')`;
    storyImageBackground.style.backgroundImage = `url('${story.image_url}')`;
    userAvatarElement.style.backgroundImage = `url('${story.avatar_url}')`;
    userNameElement.textContent = story.name;
    
    // Update progress bars
    updateProgressBars(index);

    // Clear any previous timer and set a new one for the next story
    clearTimeout(storyTimer);
    storyTimer = setTimeout(nextStory, 5000); // 5 seconds per story
}

function nextStory() {
    if (currentStoryIndex < stories.length - 1) {
        currentStoryIndex++;
        showStory(currentStoryIndex);
    } else {
        // End of stories
        window.location.href = 'home.html';
    }
}

function prevStory() {
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        showStory(currentStoryIndex);
    }
}

function updateProgressBars(activeIndex) {
    progressBarContainer.innerHTML = ''; // Clear existing bars
    stories.forEach((story, index) => {
        const bar = document.createElement('div');
        bar.className = 'h-1 flex-1 rounded-full bg-white/20';
        
        const innerBar = document.createElement('div');
        innerBar.className = 'h-1 rounded-full bg-white';
        
        if (index < activeIndex) {
            innerBar.style.width = '100%'; // Already viewed stories are full
        } else if (index === activeIndex) {
            innerBar.style.width = '0%';
            // Animate the current story's progress bar
            setTimeout(() => { innerBar.style.transition = 'width 5s linear'; innerBar.style.width = '100%'; }, 50);
        } else {
            innerBar.style.width = '0%'; // Not yet viewed stories are empty
        }
        
        bar.appendChild(innerBar);
        progressBarContainer.appendChild(bar);
    });
}

// --- MAIN LOGIC ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get user ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        window.location.href = 'home.html';
        return;
    }

    // Add event listener for the close button
    closeButton.addEventListener('click', () => {
        window.location.href = 'home.html';
    });

    try {
        // 2. Fetch the stories for that user from the API
        const response = await fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/stories/${userId}`);
        if (!response.ok) throw new Error("Could not load stories.");

        const data = await response.json();
        stories = data.items;

        if (!stories || stories.length === 0) {
            alert("This user has no active stories.");
            window.location.href = 'home.html';
            return;
        }

        // 3. Start the story player
        showStory(currentStoryIndex);

    } catch (error) {
        console.error("Failed to load stories:", error);
        alert(error.message);
        window.location.href = 'home.html';
    }
});
