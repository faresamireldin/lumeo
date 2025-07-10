// js/post-view.js

// --- GLOBAL VARIABLES ---
// These hold the state for the current page
let postId = null;
let currentPostData = null;
let loggedInUser = null;

// --- MAIN LOGIC - RUNS WHEN PAGE LOADS ---
document.addEventListener('DOMContentLoaded', () => {
    // Get the logged-in user from session storage
    loggedInUser = JSON.parse(sessionStorage.getItem('lumeo_user'));
    
    // Get the ID of the post to display from the URL
    const urlParams = new URLSearchParams(window.location.search);
    postId = urlParams.get('id');

    // Basic validation
    if (!postId || !loggedInUser) {
        document.body.innerHTML = "<h1>Error: Missing Post ID or User not logged in.</h1>";
        return;
    }
    
    // Load all the data for the page and set up interactions
    loadPostAndComments();
    setupCommentForm();
});

// --- DATA FETCHING & RENDERING ---

async function loadPostAndComments() {
    try {
        // Fetch post details and comments at the same time for speed
        const [postRes, commentsRes] = await Promise.all([
            fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/posts/${postId}?current_user_id=${loggedInUser.user_id}`),
            fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/posts/${postId}/comments`)
        ]);

        if (!postRes.ok) throw new Error("Post not found.");

        // ORDS wraps results in an "items" array. We get the first item for the post.
        const postData = (await postRes.json()).items[0];
        const commentsData = (await commentsRes.json()).items;
        
        currentPostData = postData; // Save the current post data for other functions to use

        // Update all parts of the UI with the real data
        renderPostDetails(postData);
        renderComments(commentsData);

    } catch (error) {
        console.error("Failed to load post data:", error);
        document.body.innerHTML = `<h1 class="text-white text-center p-8">Error: ${error.message}</h1>`;
    }
}

function renderPostDetails(post) {
    document.getElementById('post-image').style.backgroundImage = `url('${post.image_url}')`;
    document.getElementById('author-avatar').style.backgroundImage = `url('${post.author_avatar}')`;
    document.getElementById('author-name').textContent = post.author_name;
    document.getElementById('author-username').textContent = `@${post.author_name.toLowerCase().replace(' ', '.')}`;
    document.getElementById('post-caption').textContent = post.caption;
    document.getElementById('like-count').textContent = post.like_count;
    document.getElementById('comment-count').textContent = post.comment_count;
    
    // Update the like button's appearance based on data from the database
    updateLikeButton(post.current_user_has_liked > 0);
}

function renderComments(comments) {
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) return;

    if (comments && comments.length > 0) {
        commentsContainer.innerHTML = comments.map(comment => {
            const commentDate = new Date(comment.created_at).toLocaleDateString();
            return `
                <div class="flex items-start gap-3">
                    <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0" style='background-image: url("${comment.author_avatar}");'></div>
                    <div class="flex-1">
                        <div class="flex items-baseline gap-2">
                            <p class="text-sm font-bold">${comment.author_name}</p>
                            <p class="text-xs text-neutral-400">${commentDate}</p>
                        </div>
                        <p class="text-sm text-neutral-300">${comment.comment_text}</p>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        commentsContainer.innerHTML = '<p class="text-sm text-neutral-400">No comments yet.</p>';
    }
}


// --- INTERACTION LOGIC ---

function updateLikeButton(isLiked) {
    const likeButton = document.getElementById('like-button');
    if (!likeButton) return;

    if (isLiked) {
        likeButton.classList.add('text-red-500'); // Style for a liked post
    } else {
        likeButton.classList.remove('text-red-500'); // Style for a non-liked post
    }

    // This technique ensures the event listener is always fresh and correct
    const newLikeButton = likeButton.cloneNode(true);
    likeButton.parentNode.replaceChild(newLikeButton, likeButton);
    newLikeButton.addEventListener('click', () => handleLikeClick(isLiked));
}

async function handleLikeClick(isCurrentlyLiked) {
    const likeButton = document.getElementById('like-button');
    likeButton.disabled = true;

    const method = isCurrentlyLiked ? 'DELETE' : 'POST';
    
    try {
        const response = await fetch('https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/likes/', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: loggedInUser.user_id,
                post_id: postId
            })
        });

        if (!response.ok) throw new Error("Like request failed.");

        // Refresh the post data to get the new like count and button state
        loadPostData();

    } catch (error) {
        console.error("Failed to update like status:", error);
    } finally {
        likeButton.disabled = false;
    }
}

function setupCommentForm() {
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const commentButton = commentForm.querySelector('button[type="submit"]');

    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentText = commentInput.value.trim();
        if (!commentText) return;

        commentButton.disabled = true;

        try {
            const response = await fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: parseInt(postId),
                    user_id: loggedInUser.user_id,
                    comment_text: commentText
                })
            });

            if (!response.ok) throw new Error("Failed to post comment.");

            commentInput.value = ''; // Clear the input
            loadPostData(); // Refresh everything to show the new comment and update count

        } catch (error) {
            alert(error.message);
        } finally {
            commentButton.disabled = false;
        }
    });
}
