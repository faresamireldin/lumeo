// js/post.js (Final Simplified Version)

import { getLoggedInUser, getTimelinePosts, createStory, getActiveStories } from './api.js';

// --- IMPORTANT ---
// Cloudinary details are still needed here for the image upload part of story creation
const CLOUDINARY_CLOUD_NAME = "dc4k7nkrz";
const CLOUDINARY_UPLOAD_PRESET = "lumeo_platform";


// --- RENDER FUNCTIONS (These create the HTML) ---
function createStoryElement(story) {
    return `
        <a href="story.html?id=${story.user_id}" class="flex-shrink-0 text-center">
            <div class="w-16 h-16 rounded-full story-ring">
                <img alt="${story.name} avatar" class="w-full h-full rounded-full border-2 border-white dark:border-[#1E1C24]" src="${story.avatar_url}"/>
            </div>
            <p class="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">${story.name}</p>
        </a>
    `;
}

function createPostElement(post) {
    const postDate = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    return `
        <a href="post.html?id=${post.post_id}" class="block transition-transform hover:scale-[1.01] duration-300">
            <div class="bg-white dark:bg-[#1E1C24] rounded-xl shadow-sm dark:shadow-none mx-2">
                <div class="p-4"><div class="flex items-center mb-3"><img alt="${post.author_name} avatar" class="w-10 h-10 rounded-full mr-3" src="${post.author_avatar}"/><div><p class="font-semibold text-gray-900 dark:text-white">${post.author_name}</p><p class="text-xs text-gray-500 dark:text-gray-400">${postDate}</p></div></div></div>
                <img alt="Post image" class="w-full h-auto" src="${post.image_url}"/>
                <div class="p-4"><p class="text-gray-800 dark:text-gray-300 mb-4">${post.caption || ''}</p></div>
            </div>
        </a>
    `;
}

// --- LOGIC TO RUN WHEN THE PAGE LOADS ---
document.addEventListener('DOMContentLoaded', () => {
    loadStories();
    loadTimeline();
    setupStoryCreation();
});


// --- DATA-FETCHING FUNCTIONS ---
async function loadStories() {
    const storiesContainer = document.getElementById('stories-container');
    try {
        const stories = await getActiveStories();
        if (stories && stories.length > 0) {
            storiesContainer.innerHTML += stories.map(createStoryElement).join('');
        }
    } catch (error) {
        console.error("Failed to load stories:", error);
    }
}

async function loadTimeline() {
    const feedContainer = document.getElementById('feed-container');
    const user = await getLoggedInUser();
    if (!user) return;

    try {
        const posts = await getTimelinePosts(user.id);
        if (posts && posts.length > 0) {
            feedContainer.innerHTML = posts.map(post => createPostElement(post)).join('');
        } else {
            feedContainer.innerHTML = '<p class="text-center text-gray-500 p-8">Your timeline is empty. Follow people to see their posts!</p>';
        }
    } catch (error) {
        console.error("Failed to load timeline:", error);
        feedContainer.innerHTML = `<p class="text-center text-red-500 p-8">Could not load timeline.</p>`;
    }
}

// --- STORY CREATION LOGIC ---
function setupStoryCreation() {
    const yourStoryButton = document.getElementById('your-story-button');
    const storyUploadInput = document.getElementById('story-upload-input');

    if (!yourStoryButton || !storyUploadInput) return;

    yourStoryButton.addEventListener('click', () => storyUploadInput.click());

    storyUploadInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const user = await getLoggedInUser();
        if (!user) return alert("You must be logged in to add a story.");

        alert("Uploading your story...");

        try {
            // 1. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST", body: formData,
            });
            const cloudinaryData = await cloudinaryResponse.json();
            if (cloudinaryData.error) throw new Error(`Cloudinary Error: ${cloudinaryData.error.message}`);
            
            // 2. Call our API function to save the story
            await createStory(user.id, cloudinaryData.secure_url);

            alert("Your story has been added!");
            window.location.reload();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
}
