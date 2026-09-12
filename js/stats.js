/* ============================================================
   stats.js — Animated stat counters & metric helpers
   ============================================================ */

(function () {
    'use strict';

    /**
     * Animate a number from start → end in `duration`ms
     * @param {HTMLElement} el
     * @param {number}      end
     * @param {string}      suffix
     * @param {number}      duration
     */
    function countUp(el, end, suffix = '', duration = 1200) {
        if (!el) return;
        const start    = parseInt(el.innerText) || 0;
        const range    = end - start;
        const startTs  = performance.now();

        function step(now) {
            const elapsed = now - startTs;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out quad
            const eased = 1 - Math.pow(1 - progress, 3);
            el.innerText   = Math.round(start + range * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    /**
     * Update all visible stat cards from the global app state
     */
    function refreshStats(state) {
        const s = state || window.DSAState || {};

        countUp(document.getElementById('stat-solved'),    s.totalSolved    || 0);
        countUp(document.getElementById('stat-streak'),    s.currentStreak  || 0);
        countUp(document.getElementById('stat-xp'),        s.totalXP        || 0);
        countUp(document.getElementById('stat-level'),     s.currentLevel   || 1);
        countUp(document.getElementById('stat-topics'),    s.topicsCovered  || 0);
        countUp(document.getElementById('stat-milestone'), s.nextMilestone  || 100);
        countUp(document.getElementById('stat-pomodoro'),  s.pomodoroSessions || 0);

        const pct = s.nextMilestone
            ? Math.min(100, Math.floor((s.totalSolved / s.nextMilestone) * 100))
            : 0;

        countUp(document.getElementById('stat-pct'), pct, '%');

        // Update progress fill
        const fill = document.getElementById('milestone-fill');
        if (fill) fill.style.width = pct + '%';

        // XP bar
        const xpPerLevel = 200;
        const xpInLevel  = (s.totalXP || 0) % xpPerLevel;
        const xpFill      = document.getElementById('xp-fill');
        const xpLabel     = document.getElementById('xp-label');
        if (xpFill) xpFill.style.width = Math.round((xpInLevel / xpPerLevel) * 100) + '%';
        if (xpLabel) xpLabel.innerText = `${xpInLevel} / ${xpPerLevel} XP`;

        // Streak display
        const streakEl = document.getElementById('streak-badge');
        if (streakEl) {
            streakEl.querySelector('.streak-val').innerText = (s.currentStreak || 0) + ' day streak';
        }
    }

    window.DSAStats = { countUp, refreshStats };
})();
