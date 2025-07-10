// js/create-post.js (Updated with Cloudinary and API Call)

// --- IMPORTANT ---
// Make sure these details are correct
const CLOUDINARY_CLOUD_NAME = "dc4k7nkrz";
const CLOUDINARY_UPLOAD_PRESET = "lumeo_platform";

document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('create-post-form');
    
    if (createPostForm) {
        createPostForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const postButton = createPostForm.querySelector('button[type="submit"]');
            postButton.disabled = true;
            postButton.textContent = 'Posting...';

            // 1. Get the logged-in user's data from session storage
            const loggedInUser = JSON.parse(sessionStorage.getItem('lumeo_user'));
            if (!loggedInUser) {
                alert("You must be logged in to post.");
                postButton.disabled = false;
                postButton.textContent = 'Post';
                return;
            }

            // 2. Get form data
            const imageFile = document.getElementById('file-upload').files[0];
            const caption = document.getElementById('caption-textarea').value;

            if (!imageFile) {
                alert("Please select an image to post.");
                postButton.disabled = false;
                postButton.textContent = 'Post';
                return;
            }

            try {
                // 3. Upload image to Cloudinary first
                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

                const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: "POST", body: formData,
                });
                
                const cloudinaryData = await cloudinaryResponse.json();
                if (cloudinaryData.error) {
                    throw new Error(`Cloudinary Error: ${cloudinaryData.error.message}`);
                }
                
                const imageUrl = cloudinaryData.secure_url;

                // 4. Prepare data for our own API
                const postData = {
                    user_id: loggedInUser.user_id,
                    image_url: imageUrl,
                    caption: caption
                };

                // 5. Call our Oracle API to save the post to the database
                const apiResponse = await fetch('https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/posts/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postData)
                });

                if (!apiResponse.ok) {
                    throw new Error("Failed to save post to the database.");
                }

                alert("Post created successfully!");
                window.location.href = 'home.html'; // Go to home to see the new post

            } catch (error) {
                alert(`Error: ${error.message}`);
            } finally {
                postButton.disabled = false;
                postButton.textContent = 'Post';
            }
        });
    }
});
