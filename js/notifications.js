// js/notifications.js (Fully Dynamic Version)

function createNotificationElement(notification) {
    const timeAgo = new Date(notification.created_at).toLocaleString();
    let actionText = '';

    // Create different text based on the notification type
    switch(notification.notification_type) {
        case 'follow':
            actionText = 'followed you';
            break;
        case 'like':
            actionText = 'liked your post';
            break;
        case 'comment':
            actionText = 'commented on your post';
            break;
        default:
            actionText = 'interacted with you';
    }

    return `
        <a href="profile.html?id=${notification.actor_id}" class="flex cursor-pointer items-center gap-4 bg-[#1C1B1F] p-4 shadow-sm transition-colors hover:bg-[#2A292E]">
            <img alt="${notification.actor_name}'s avatar" class="h-10 w-10 rounded-full object-cover" src="${notification.actor_avatar}"/>
            <div class="flex-1">
                <p class="font-bold text-white">
                    ${notification.actor_name}
                    <span class="font-normal text-gray-300">${actionText}</span>
                </p>
            </div>
            <p class="text-xs text-gray-400">${timeAgo}</p>
        </a>
    `;
}

async function loadNotifications() {
    const notificationsContainer = document.getElementById('notifications-container');
    const loggedInUser = JSON.parse(sessionStorage.getItem('lumeo_user'));

    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }
    
    notificationsContainer.innerHTML = '<p class="text-center text-gray-400 p-8">Loading notifications...</p>';

    try {
        const response = await fetch(`https://apex.oracle.com/pls/apex/lumeo/lumeo/api/v1/notifications/${loggedInUser.user_id}`);
        if (!response.ok) throw new Error("Could not fetch notifications.");

        const data = await response.json();
        const notifications = data.items;

        if (notifications && notifications.length > 0) {
            notificationsContainer.innerHTML = notifications.map(createNotificationElement).join('');
        } else {
            notificationsContainer.innerHTML = '<p class="text-center text-gray-400 p-8">You have no new notifications.</p>';
        }

    } catch (error) {
        notificationsContainer.innerHTML = `<p class="text-center text-red-500 p-8">${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadNotifications);