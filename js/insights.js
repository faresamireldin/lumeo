// js/insights.js

// --- FAKE DATA ---
const fakeInsightsData = {
    'user_me': {
        // Added avatarUrl to be used in the header
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQXbdwEfGGohpC025jPDr7DFgEn5sDqG9qT3hf7f33QlMk48lU9XTxcI_74r2DTkwqyNSVAKPUBqiIZDbm0CfrEaCdVoJWdJNhXyhzAk1GOAoNvA5-uTDyJFmRwb5-lDj4B8GUVJNwBV3VVMwSpLGLFYvSFamht7-vp9RYM593VqB_m4V2QPz-M2vzWuvUnCkKFXjOJ54BkpImWDrA6fVNJPavRX66G4G9OX0lJWVijTQ1NerRJuND-0tODrQKLN5SrvE-vupk",
        profileViews: "1,234",
        viewTrend: "+5.2%",
        storyReach: "15,840",
        reachTrend: "12%",
        recentVisitors: [
            { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmP0cIubGRZCGd4hr1oGiz0bzp08moPKGeOa6EZYNbRsXPuFhfMvv9SlS1awjmc2uCbi99EcmuoilKCm2nQM598omnaTfb1urnAfwPUuo5RwrwGm4M8WR5076rsAmi7KZTav5THJlYHOZfj1k35P2_nfmasr0Qj4pZlL_pBgN6QjEcmHf0v4epoRKPQnBoC1uo5oD781q4NK_vy6IwN1e3JUfiJ39jn4uexzQAyQzgX30NCRS8y3VUj-7l0ccy6qqQH0Q5GKY8" },
            { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDq2d6-4hObYHh7rwAIxI3kE-CqGtBAx62miAj-8_PocG7nmb9ZvQ8F0Oof5_pBMCguLUCysPMkQh1zwKch5kjX72GY81IFqO8huPtmmgCrqyuxnZWBs_-ozJOSisnSdCbMYC_p3z1GCUoYY7rQNCTRnlhY4tnDCqDmZqZtGWjatIAlzNM5TdmVDi9qKTT4doIFYMnhNYvLeD8Q-jQ13NlJjT47w7Vj6t6B3ONvzNYTqbYP5UsNl_16RDOWn_W7uDpmRg6Rh3E4" },
            { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwXSizq6nKOnWRPrzrLF3WZ9pLGFfqerWTMgSF1YHGOgtcS8FlHjK-gnJvmVNisSAIzbdg69MS9R0Lq7_vTfeeWPDS-oaUB7hufHwTHrazTYXfSIhpxpf7-Wau0q53LmdNkEq3PKm7cYaPIcYuyIMXpqcD4c_mVdR9E7Ie4IaZUa9rEsxwa7rECXJJ31Z9qRJdWWSBXcD8mEJPZOhtIQm9tRHk7I56PC4ujeQSzivlEU8u11bg_U_NGwtmQ_yGXRWdyKCAh7Gj" },
            { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRXyyN-zNLc0OhAGROKguAXpRXz4iLMIQrV0aWm2a_8NSmBmBmQ9yZ_gaGuYuNpT5J85jA82hCvhNYE7bqGGBHylfp2cMVp9zdQFPkOKv1dUSnZQle7jv5VMBm9krTR4pV7MNiBN-aXoiDUNwERTZblqkjLdBLhJemwApg46sM44I6od2VG1gTdCoxSbL1xdarMl2ok2jLEFIjf0PSraYKSiAJvGwGGGyLuEaLubw7LuaGGoebhWycL-G34iY-Fk25aEgRMcaN" },
            { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8uyZJTH7EC_KTauuj0euOHnlZUWjEtokxfNmwC2pwl7Gb2XmD4y3l1e0VnSsU8m4wFtYTt_sM4usvcNgpzgxKqi2nT7C8RBknS3gsHyiZb76vwXDelwfXt1Opux9IKIeZMQYQXdvkkjvmZ8is5RpfW8xeS2WBOWxnBc5oy-AX2zCBHUvJixmhqQxuKFMNC0n8VfRgNt8aaPI_dIMxAzx7DuPN0FjlSQL0P5vZjqKrZ835zb_ltAQz5UxbvFIw9uFXPxVVMcNH" },
        ],
        monthlyReach: [60, 100, 40, 50, 50, 80]
    }
};

// --- MAIN LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId || !fakeInsightsData[userId]) {
        document.body.innerHTML = `<div class="p-8 text-center text-red-500">Could not load insights for this user.</div>`;
        return;
    }

    const insights = fakeInsightsData[userId];

    // --- Populate the page with data ---
    
    // NEW: Update header avatar and profile link
    const navAvatar = document.getElementById('nav-user-avatar');
    const navProfileLink = document.getElementById('nav-profile-link');
    if (navAvatar) {
        navAvatar.style.backgroundImage = `url('${insights.avatarUrl}')`;
    }
    if (navProfileLink) {
        navProfileLink.href = `profile.html?id=${userId}`;
    }

    // Populate the main stats
    document.getElementById('profile-views-stat').textContent = insights.profileViews;
    document.getElementById('profile-views-trend').textContent = insights.viewTrend;
    document.getElementById('story-reach-stat').textContent = insights.storyReach;
    // We target the span inside the trend div now
    document.querySelector('#story-reach-trend span').textContent = insights.reachTrend;

    // Populate recent visitors
    const visitorsContainer = document.getElementById('recent-visitors-container');
    visitorsContainer.innerHTML = insights.recentVisitors.map(visitor => `
        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-4 border-[#131316] shadow-md" style='background-image: url("${visitor.avatar}");'></div>
    `).join('') + `
        <div class="flex items-center justify-center size-12 rounded-full bg-[#131316] border-4 border-dashed border-custom text-secondary text-sm font-semibold">
            +${Math.floor(Math.random() * 10) + 1} more
        </div>`;

    // Populate the bar chart
    const chartBars = document.querySelectorAll('#story-reach-chart .bar');
    chartBars.forEach((bar, index) => {
        if (insights.monthlyReach[index]) {
            // A short delay for a nice staggered animation effect
            setTimeout(() => {
                bar.style.height = `${insights.monthlyReach[index]}%`;
            }, index * 50);
        }
    });
});