/* ============================================================
   calendar.js — Interactive Calendar & Reminder System
   ============================================================ */

(function () {
    'use strict';

    let viewYear  = new Date().getFullYear();
    let viewMonth = new Date().getMonth();

    function buildCalendar(state) {
        const grid = document.getElementById('cal-days-grid');
        if (!grid) return;

        const today   = new Date();
        const tYear   = today.getFullYear();
        const tMonth  = today.getMonth();
        const tDay    = today.getDate();

        grid.innerHTML = '';

        // Day labels
        ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(label => {
            const d = document.createElement('div');
            d.className = 'cal-day-label';
            d.innerText = label;
            grid.appendChild(d);
        });

        const firstDay   = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

        // Month label
        const monthLabel = document.getElementById('cal-month-label');
        if (monthLabel) {
            monthLabel.innerText = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }

        // Blank cells
        for (let i = 0; i < firstDay; i++) {
            grid.appendChild(document.createElement('div'));
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const div     = document.createElement('div');
            div.className = 'cal-day';

            const isToday = (day === tDay && viewMonth === tMonth && viewYear === tYear);
            if (isToday) div.classList.add('today');

            // Study day
            if (state.studyDates && state.studyDates.includes(dateStr)) {
                div.classList.add('study-day');
            }

            // Has reminder
            const hasRem = state.reminders && state.reminders.some(r => r.date === dateStr);
            if (hasRem) div.classList.add('has-reminder');

            div.innerText = day;
            div.title     = dateStr;
            div.addEventListener('click', () => onDayClick(dateStr, state));

            grid.appendChild(div);
        }
    }

    function onDayClick(dateStr, state) {
        const inp = document.getElementById('reminder-date');
        if (inp) inp.value = dateStr;
        // Show reminders for that day
        const panel = document.getElementById('day-reminders');
        if (!panel || !state.reminders) return;

        const rems = state.reminders.filter(r => r.date === dateStr);
        panel.innerHTML = rems.length
            ? rems.map((r, i) => `<div class="revision-card">
                <span class="revision-info">
                    <div class="revision-topic">${r.text}</div>
                    <div class="revision-date">${r.date}</div>
                </span>
                <button class="btn btn-sm btn-danger" onclick="DSAApp.removeReminder(${state.reminders.indexOf(r)})">✕</button>
              </div>`).join('')
            : `<p class="text-sm text-muted" style="padding:.5rem">No reminders for ${dateStr}</p>`;
    }

    function navigate(dir) {
        viewMonth += dir;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        if (viewMonth < 0)  { viewMonth = 11; viewYear--; }
        buildCalendar(window.DSAState || {});
    }

    // Wire navigation buttons
    window.addEventListener('DOMContentLoaded', () => {
        const prev = document.getElementById('cal-prev');
        const next = document.getElementById('cal-next');
        if (prev) prev.addEventListener('click', () => navigate(-1));
        if (next) next.addEventListener('click', () => navigate(1));
    });

    window.DSACalendar = { buildCalendar };
})();
