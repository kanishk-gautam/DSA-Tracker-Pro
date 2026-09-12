/* ============================================================
   streak.js — Streak tracking & XP system
   ============================================================ */

(function () {
    'use strict';

    /* ─── XP CONSTANTS ─── */
    const XP_PROBLEM   = 10;
    const XP_TOPIC     = 25;
    const XP_MILESTONE = 100;
    const XP_PER_LEVEL = 200;

    function getLevel(xp) {
        return Math.floor(xp / XP_PER_LEVEL) + 1;
    }

    function xpForNextLevel(xp) {
        return XP_PER_LEVEL - (xp % XP_PER_LEVEL);
    }

    /**
     * Recalculate streak from lastActiveDate in state
     * Returns updated { currentStreak, bestStreak, lastActiveDate }
     */
    function recalcStreak(state) {
        const todayStr = new Date().toISOString().split('T')[0];
        const lastDate = state.lastActiveDate || '';

        if (lastDate === todayStr) {
            // already updated today — no change
            return state;
        }

        const yesterday  = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        if (lastDate === yStr) {
            newStreak = (state.currentStreak || 0) + 1;
        }

        state.currentStreak  = newStreak;
        state.bestStreak     = Math.max(state.bestStreak || 0, newStreak);
        state.lastActiveDate = todayStr;

        // add to heatmap
        if (!state.studyDates) state.studyDates = [];
        if (!state.studyDates.includes(todayStr)) {
            state.studyDates.push(todayStr);
        }

        return state;
    }

    /**
     * Add XP and update level
     */
    function addXP(state, amount) {
        state.totalXP    = (state.totalXP || 0) + amount;
        state.currentLevel = getLevel(state.totalXP);
        return state;
    }

    /**
     * Check & fire milestone XP
     */
    function checkMilestone(state) {
        const milestones = [1, 10, 50, 100, 250, 500];
        if (milestones.includes(state.totalSolved)) {
            addXP(state, XP_MILESTONE);
            window.DSAToast && window.DSAToast.show(`🏆 Milestone unlocked: ${state.totalSolved} problems!`, 'success');
        }
        return state;
    }

    window.DSAStreak = {
        recalcStreak,
        addXP,
        checkMilestone,
        getLevel,
        xpForNextLevel,
        XP_PROBLEM,
        XP_TOPIC,
        XP_MILESTONE,
    };
})();
