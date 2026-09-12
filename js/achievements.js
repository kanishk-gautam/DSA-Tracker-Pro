/* ============================================================
   achievements.js — Badge / Achievement System
   ============================================================ */

(function () {
    'use strict';

    const ACHIEVEMENTS = [
        { id: 'first_problem',  name: 'First Blood',      desc: 'Solve your first problem',  icon: '🎯', condition: s => s.totalSolved >= 1   },
        { id: 'ten_problems',   name: 'Getting Started',  desc: 'Solve 10 problems',          icon: '🔟', condition: s => s.totalSolved >= 10  },
        { id: 'fifty',          name: 'Half Century',     desc: 'Solve 50 problems',          icon: '💪', condition: s => s.totalSolved >= 50  },
        { id: 'hundred',        name: 'Centurion',        desc: 'Solve 100 problems',         icon: '💯', condition: s => s.totalSolved >= 100 },
        { id: 'twofifty',       name: 'Quarter Master',   desc: 'Solve 250 problems',         icon: '🏅', condition: s => s.totalSolved >= 250 },
        { id: 'fivehundred',    name: 'Legend',           desc: 'Solve 500 problems',         icon: '👑', condition: s => s.totalSolved >= 500 },
        { id: 'streak7',        name: '7 Day Streak',     desc: 'Study 7 days in a row',      icon: '🔥', condition: s => s.currentStreak >= 7  },
        { id: 'streak30',       name: '30 Day Legend',    desc: 'Study 30 days in a row',     icon: '⚡', condition: s => s.currentStreak >= 30 },
        { id: 'graph_master',   name: 'Graph Master',     desc: 'Complete Graphs roadmap',    icon: '🕸️', condition: s => {
            const gp = s.roadmapProgress && (s.roadmapProgress.Graph || s.roadmapProgress.get?.('Graph'));
            return gp && gp.total > 0 && gp.completed >= gp.total;
        }},
        { id: 'dp_master',      name: 'DP Master',        desc: 'Complete DP roadmap',        icon: '🧠', condition: s => {
            const dp = s.roadmapProgress && (s.roadmapProgress['Dynamic Programming'] || s.roadmapProgress.get?.('Dynamic Programming'));
            return dp && dp.total > 0 && dp.completed >= dp.total;
        }},
        { id: 'xp_500',         name: 'XP Hunter',        desc: 'Earn 500 XP',                icon: '⭐', condition: s => s.totalXP >= 500 },
        { id: 'xp_1000',        name: 'XP Legend',        desc: 'Earn 1000 XP',               icon: '🌟', condition: s => s.totalXP >= 1000 },
    ];

    /**
     * Check which achievements should fire given current state.
     * Returns array of newly unlocked achievement IDs.
     */
    function checkAchievements(state) {
        const already   = state.unlockedAchievements || [];
        const newUnlocks = [];

        for (const a of ACHIEVEMENTS) {
            if (!already.includes(a.id) && a.condition(state)) {
                newUnlocks.push(a.id);
                already.push(a.id);
                // notify
                window.DSAToast && window.DSAToast.show(`${a.icon} Achievement: ${a.name}!`, 'info');
                // add XP bonus
                window.DSAStreak && window.DSAStreak.addXP(state, 50);
            }
        }
        state.unlockedAchievements = already;
        return newUnlocks;
    }

    /**
     * Render the achievements grid inside #achievements-grid
     */
    function renderAchievements(state) {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        const unlocked = state.unlockedAchievements || [];
        grid.innerHTML = '';

        for (const a of ACHIEVEMENTS) {
            const isUnlocked = unlocked.includes(a.id);
            const card = document.createElement('div');
            card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            if (isUnlocked) card.classList.add('animate-pop');

            card.innerHTML = `
                <div class="badge-icon">${a.icon}</div>
                <div class="badge-name">${a.name}</div>
                <div class="badge-desc">${a.desc}</div>
                ${isUnlocked ? '<div class="text-xs text-success mt-1">✓ Unlocked</div>' : '<div class="text-xs text-muted mt-1">Locked</div>'}
            `;
            grid.appendChild(card);
        }
    }

    window.DSAAchievements = { checkAchievements, renderAchievements, ACHIEVEMENTS };
})();
