/* ============================================================
   theme.js — Dark Mode Toggle
   ============================================================ */

(function () {
    'use strict';

    const STORAGE_KEY = 'dsa-theme';
    const body        = document.body;
    const toggleBtn   = document.getElementById('theme-toggle');

    function applyTheme(dark) {
        if (dark) {
            body.classList.add('dark');
            if (toggleBtn) toggleBtn.classList.add('on');
        } else {
            body.classList.remove('dark');
            if (toggleBtn) toggleBtn.classList.remove('on');
        }
    }

    function init() {
        const saved = localStorage.getItem(STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(saved === 'dark' || (saved === null && prefersDark));
    }

    function toggle() {
        const isDark = body.classList.toggle('dark');
        localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
        if (toggleBtn) toggleBtn.classList.toggle('on', isDark);
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggle);
    }

    init();
    window.DSATheme = { toggle, applyTheme };
})();
