// js/api.js (Complete Version)

import { supabase_client as supabase } from './supabase-client.js';

// ==================================
// --- USER & AUTH FUNCTIONS ---
// ==================================

export async function signUpUser(name, email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    // Also add their profile info to the public 'users' table
    const { error: profileError } = await supabase
        .from('users')
        .insert([{ id: data.user.id, name, email, bio: 'Welcome to Lumeo!', avatar_url: 'https://i.pravatar.cc/150' }]);
    
    if (profileError) throw profileError;
    return data.user;
}

export async function loginUser(email, password) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) throw authError;

    const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
    if (profileError) throw profileError;
    return profileData;
}

export async function getLoggedInUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function signOutUser() {
    await supabase.auth.signOut();
}

export async function getUserById(profileId, viewerId) {
    const { data, error } = await supabase.rpc('get_user_by_id', {
        p_user_id: profileId,
        p_viewer_id: viewerId
    });
    if (error) throw error;
    return data[0]; // RPC returns an array, we want the single object
}


// ==================================
// --- POSTS & TIMELINE FUNCTIONS ---
// ==================================

export async function createPost(userId, imageUrl, caption) {
    const { error } = await supabase
        .from('posts')
        .insert([{ user_id: userId, image_url: imageUrl, caption: caption }]);
    if (error) throw error;
}

export async function getTimelinePosts(userId) {
    const { data, error } = await supabase.rpc('get_timeline_for_user', {
        p_user_id: userId
    });
    if (error) throw error;
    return data;
}

export async function getPostsByUser(userId, viewerId) {
    const { data, error } = await supabase.rpc('get_posts_by_user', {
        p_user_id: userId,
        p_viewer_id: viewerId
    });
    if (error) throw error;
    return data;
}

export async function getPostById(postId, viewerId) {
    const { data, error } = await supabase.rpc('get_post_by_id', {
        p_post_id: postId,
        p_current_user_id: viewerId
    });
    if (error) throw error;
    return data[0];
}


// ==================================
// --- COMMENTS, LIKES, FOLLOWS ---
// ==================================

export async function getCommentsForPost(postId) {
    const { data, error } = await supabase.rpc('get_comments_for_post', {
        p_post_id: postId
    });
    if (error) throw error;
    return data;
}

export async function addComment(postId, userId, commentText) {
    const { error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, user_id: userId, comment_text: commentText }]);
    if (error) throw error;
}

export async function likePost(postId, userId) {
    const { error } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userId }]);
    if (error) throw error;
}

export async function unlikePost(postId, userId) {
    const { error } = await supabase
        .from('likes')
        .delete()
        .match({ post_id: postId, user_id: userId });
    if (error) throw error;
}

export async function followUser(followerId, followingId) {
    const { error } = await supabase
        .from('followers')
        .insert([{ follower_id: followerId, following_id: followingId }]);
    if (error) throw error;
}

export async function unfollowUser(followerId, followingId) {
    const { error } = await supabase
        .from('followers')
        .delete()
        .match({ follower_id: followerId, following_id: followingId });
    if (error) throw error;
}


// ==================================
// --- STORIES & SEARCH ---
// ==================================

export async function createStory(userId, imageUrl) {
    const { error } = await supabase
        .from('stories')
        .insert([{ user_id: userId, image_url: imageUrl }]);
    if (error) throw error;
}

export async function getActiveStories() {
    const { data, error } = await supabase.rpc('get_active_stories');
    if (error) throw error;
    return data;
}

export async function searchUsers(query, currentUserId) {
    const { data, error } = await supabase.rpc('search_users', {
        p_query: query,
        p_current_user_id: currentUserId
    });
    if (error) throw error;
    return data;
}
