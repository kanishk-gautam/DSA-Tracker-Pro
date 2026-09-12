/* ============================================================
   app.js — Main Application Controller
   Handles: state, API, navigation, all UI features
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   CONSTANTS
────────────────────────────────────────────────────────── */
const API_BASE = 'http://localhost:5000/api';

const DSA_TOPICS = [
    'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue',
    'HashMap', 'Binary Search', 'Recursion', 'Trees', 'BST',
    'Heap', 'Trie', 'Graph', 'Greedy', 'Backtracking',
    'Dynamic Programming', 'Segment Tree'
];

const TOPIC_DEFAULTS = {
    'Arrays':             { completed: 0, total: 20 },
    'Strings':            { completed: 0, total: 15 },
    'Linked List':        { completed: 0, total: 12 },
    'Stack':              { completed: 0, total: 8  },
    'Queue':              { completed: 0, total: 6  },
    'HashMap':            { completed: 0, total: 10 },
    'Binary Search':      { completed: 0, total: 12 },
    'Recursion':          { completed: 0, total: 10 },
    'Trees':              { completed: 0, total: 15 },
    'BST':                { completed: 0, total: 10 },
    'Heap':               { completed: 0, total: 8  },
    'Trie':               { completed: 0, total: 6  },
    'Graph':              { completed: 0, total: 18 },
    'Greedy':             { completed: 0, total: 12 },
    'Backtracking':       { completed: 0, total: 10 },
    'Dynamic Programming':{ completed: 0, total: 25 },
    'Segment Tree':       { completed: 0, total: 5  },
};

/* ──────────────────────────────────────────────────────────
   GLOBAL STATE (fallback when offline)
────────────────────────────────────────────────────────── */
let DSAState = {
    totalSolved: 0,
    nextMilestone: 100,
    todos: [],
    topicsDoneToday: [],
    reminders: [],
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: '',
    studyDates: [],
    totalXP: 0,
    currentLevel: 1,
    unlockedAchievements: [],
    roadmapProgress: { ...TOPIC_DEFAULTS },
    dailyActivity: [],
    revisionItems: [],
    notes: [],
    weeklyGoals: [],
    pomodoroSessions: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    topicsCovered: 0,
};
window.DSAState = DSAState;

/* ──────────────────────────────────────────────────────────
   TOAST
────────────────────────────────────────────────────────── */
const DSAToast = {
    container: null,
    init() {
        this.container = document.getElementById('toast-container');
    },
    show(msg, type = 'success') {
        if (!this.container) return;
        const icons = { success: '✅', danger: '❌', info: '🔔', warning: '⚠️' };
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<span class="toast-icon">${icons[type] || '🔔'}</span><span>${msg}</span>`;
        this.container.appendChild(t);
        setTimeout(() => {
            t.classList.add('exit');
            setTimeout(() => t.remove(), 350);
        }, 3000);
    }
};
window.DSAToast = DSAToast;

/* ──────────────────────────────────────────────────────────
   API
────────────────────────────────────────────────────────── */
async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

async function apiPut(path, body) {
    const res = await fetch(API_BASE + path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

async function apiPatch(path, body) {
    const res = await fetch(API_BASE + path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

/* ──────────────────────────────────────────────────────────
   LOAD & SAVE
────────────────────────────────────────────────────────── */
let saveTimer = null;

async function loadDashboard() {
    try {
        const data = await apiGet('/dashboard');
        mergeState(data);
        DSAToast.show('Dashboard loaded ✓', 'success');
    } catch (e) {
        console.warn('Backend offline — using local state', e);
        loadFromLocal();
        DSAToast.show('Offline mode — data saved locally', 'warning');
    }
    renderAll();
}

function mergeState(data) {
    // Ensure roadmapProgress is plain object
    if (data.roadmapProgress && typeof data.roadmapProgress.toObject === 'function') {
        data.roadmapProgress = Object.fromEntries(data.roadmapProgress);
    }
    // Fill any missing topics
    DSA_TOPICS.forEach(t => {
        if (!data.roadmapProgress || !data.roadmapProgress[t]) {
            if (!data.roadmapProgress) data.roadmapProgress = {};
            data.roadmapProgress[t] = TOPIC_DEFAULTS[t];
        }
    });
    Object.assign(DSAState, data);
    window.DSAState = DSAState;
}

function loadFromLocal() {
    const saved = localStorage.getItem('dsa-state');
    if (saved) {
        try { mergeState(JSON.parse(saved)); } catch (e) {}
    }
}

function saveToLocal() {
    localStorage.setItem('dsa-state', JSON.stringify(DSAState));
}

async function saveToDatabase() {
    saveToLocal();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
        try {
            const saved = await apiPut('/dashboard', DSAState);
            mergeState(saved);
        } catch (e) {
            console.warn('Save failed — stored locally', e);
        }
        renderAll();
    }, 400);
}

/* ──────────────────────────────────────────────────────────
   NAVIGATION
────────────────────────────────────────────────────────── */
function navigate(page) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const section = document.getElementById('page-' + page);
    const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (section) section.classList.add('active');
    if (navItem) navItem.classList.add('active');

    // Re-render charts when analytics page opens
    if (page === 'analytics') {
        setTimeout(() => DSACharts.renderAll(DSAState), 50);
    }
    if (page === 'achievements') {
        DSAAchievements.renderAchievements(DSAState);
    }
}

/* ──────────────────────────────────────────────────────────
   SIDEBAR TOGGLE
────────────────────────────────────────────────────────── */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main    = document.getElementById('main-content');
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('sidebar-collapsed');
}

/* ──────────────────────────────────────────────────────────
   HEADER DATE
────────────────────────────────────────────────────────── */
function setHeaderDate() {
    const el = document.getElementById('header-date');
    if (el) {
        el.innerText = new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }
}

/* ──────────────────────────────────────────────────────────
   PROBLEMS SOLVED
────────────────────────────────────────────────────────── */
function changeSolvedCount(amount) {
    if (amount < 0 && DSAState.totalSolved <= 0) return;
    DSAState.totalSolved = Math.max(0, DSAState.totalSolved + amount);

    if (amount > 0) {
        const diff = document.getElementById('solve-difficulty')?.value || 'medium';
        if (diff === 'easy')   DSAState.easySolved++;
        else if (diff === 'hard') DSAState.hardSolved++;
        else DSAState.mediumSolved++;

        DSAStreak.addXP(DSAState, DSAStreak.XP_PROBLEM);
        DSAStreak.recalcStreak(DSAState);
        DSAStreak.checkMilestone(DSAState);
        DSAAchievements.checkAchievements(DSAState);

        // Daily activity
        const today = new Date().toISOString().split('T')[0];
        let dayEntry = DSAState.dailyActivity.find(d => d.date === today);
        if (!dayEntry) {
            dayEntry = { date: today, solved: 0, xpEarned: 0 };
            DSAState.dailyActivity.push(dayEntry);
        }
        dayEntry.solved++;
        dayEntry.xpEarned += DSAStreak.XP_PROBLEM;

        DSAToast.show(`+${DSAStreak.XP_PROBLEM} XP earned!`, 'success');
    }

    saveToDatabase();
}

function updateMilestone() {
    const val = parseInt(document.getElementById('milestone-target-input')?.value);
    if (val > 0) {
        DSAState.nextMilestone = val;
        saveToDatabase();
    }
}

/* ──────────────────────────────────────────────────────────
   TODOS
────────────────────────────────────────────────────────── */
function addTodo() {
    const input    = document.getElementById('todo-input');
    const priority = document.getElementById('todo-priority')?.value || 'medium';
    const dueDate  = document.getElementById('todo-due')?.value || '';

    if (!input || !input.value.trim()) return;

    DSAState.todos.push({
        text: input.value.trim(),
        completed: false,
        priority,
        dueDate,
        createdAt: new Date().toISOString()
    });

    input.value = '';
    saveToDatabase();
    renderTodos();
}

function toggleTodo(index) {
    if (!DSAState.todos[index]) return;
    DSAState.todos[index].completed = !DSAState.todos[index].completed;
    if (DSAState.todos[index].completed) {
        DSAToast.show('Task completed! 🎉', 'success');
    }
    saveToDatabase();
    renderTodos();
}

function deleteTodo(index) {
    DSAState.todos.splice(index, 1);
    saveToDatabase();
    renderTodos();
}

function renderTodos() {
    const list   = document.getElementById('todo-list');
    const filter = document.getElementById('todo-filter')?.value || 'all';
    if (!list) return;

    list.innerHTML = '';

    let items = [...DSAState.todos];
    if (filter === 'active')    items = items.filter(t => !t.completed);
    if (filter === 'completed') items = items.filter(t => t.completed);
    if (filter === 'high')      items = items.filter(t => t.priority === 'high');

    if (!items.length) {
        list.innerHTML = '<li style="text-align:center;padding:1.5rem;color:var(--text-muted);font-size:.875rem;">No tasks here — add one above!</li>';
        return;
    }

    items.forEach((todo, i) => {
        const realIndex = DSAState.todos.indexOf(todo);
        const li = document.createElement('li');
        li.style.listStyle = 'none';
        li.innerHTML = `
            <div class="todo-item ${todo.completed ? 'done' : ''}">
                <div class="todo-check ${todo.completed ? 'checked' : ''}" onclick="DSAApp.toggleTodo(${realIndex})"></div>
                <span class="todo-text">${todo.text}</span>
                <span class="priority-dot ${todo.priority || 'medium'}" title="${todo.priority}"></span>
                <span class="chip chip-${todo.priority || 'medium'}">${todo.priority || 'medium'}</span>
                ${todo.dueDate ? `<span class="text-xs text-muted">${todo.dueDate}</span>` : ''}
                <button class="btn btn-icon btn-danger" onclick="DSAApp.deleteTodo(${realIndex})" title="Delete">✕</button>
            </div>
        `;
        list.appendChild(li);
    });

    const counter = document.getElementById('todo-counter');
    if (counter) counter.innerText = `(${DSAState.todos.filter(t => !t.completed).length} active)`;
}

/* ──────────────────────────────────────────────────────────
   TOPICS
────────────────────────────────────────────────────────── */
function logTopic() {
    const select = document.getElementById('topic-select');
    if (!select) return;
    const topic = select.value;

    if (!DSAState.topicsDoneToday.includes(topic)) {
        DSAState.topicsDoneToday.push(topic);
        DSAState.topicsCovered = (DSAState.topicsCovered || 0) + 1;
        DSAStreak.addXP(DSAState, DSAStreak.XP_TOPIC);
        DSAToast.show(`+${DSAStreak.XP_TOPIC} XP — Topic logged: ${topic}`, 'success');
        DSAAchievements.checkAchievements(DSAState);
        saveToDatabase();
        renderTopics();
    } else {
        DSAToast.show('Topic already logged today!', 'warning');
    }
}

function removeTopic(index) {
    DSAState.topicsDoneToday.splice(index, 1);
    saveToDatabase();
    renderTopics();
}

function renderTopics() {
    const list = document.getElementById('topics-logged-list');
    if (!list) return;
    list.innerHTML = '';

    if (!DSAState.topicsDoneToday.length) {
        list.innerHTML = '<li style="text-align:center;padding:1rem;color:var(--text-muted);font-size:.875rem;list-style:none;">No topics logged today</li>';
        return;
    }

    DSAState.topicsDoneToday.forEach((topic, i) => {
        const li = document.createElement('li');
        li.style.listStyle = 'none';
        li.innerHTML = `
            <span class="topic-pill">
                📚 ${topic}
                <span class="remove-btn" onclick="DSAApp.removeTopic(${i})">✕</span>
            </span>
        `;
        list.appendChild(li);
    });
}

/* ──────────────────────────────────────────────────────────
   REMINDERS
────────────────────────────────────────────────────────── */
function addReminder() {
    const textEl = document.getElementById('reminder-text');
    const dateEl = document.getElementById('reminder-date');
    if (!textEl.value.trim() || !dateEl.value) {
        DSAToast.show('Please enter reminder text and date', 'warning');
        return;
    }

    DSAState.reminders.push({ text: textEl.value.trim(), date: dateEl.value });
    textEl.value = '';
    dateEl.value = '';

    saveToDatabase();
    renderReminders();
    DSACalendar.buildCalendar(DSAState);
    DSAToast.show('Reminder added!', 'success');
}

function removeReminder(index) {
    DSAState.reminders.splice(index, 1);
    saveToDatabase();
    renderReminders();
    DSACalendar.buildCalendar(DSAState);
}

function renderReminders() {
    const list = document.getElementById('active-reminders-list');
    if (!list) return;
    list.innerHTML = '';

    if (!DSAState.reminders.length) {
        list.innerHTML = '<li style="text-align:center;padding:1rem;color:var(--text-muted);font-size:.875rem;list-style:none;">No reminders set</li>';
        return;
    }

    const sorted = [...DSAState.reminders].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach((r, i) => {
        const realIdx = DSAState.reminders.indexOf(r);
        const li = document.createElement('li');
        li.style.listStyle = 'none';
        const isPast = r.date < new Date().toISOString().split('T')[0];
        li.innerHTML = `
            <div class="revision-card">
                <span class="revision-urgency ${isPast ? 'overdue' : 'ok'}"></span>
                <div class="revision-info">
                    <div class="revision-topic">${r.text}</div>
                    <div class="revision-date">📅 ${r.date}${isPast ? ' — Overdue' : ''}</div>
                </div>
                <button class="btn btn-icon btn-danger btn-sm" onclick="DSAApp.removeReminder(${realIdx})">✕</button>
            </div>
        `;
        list.appendChild(li);
    });
}

/* ──────────────────────────────────────────────────────────
   ROADMAP
────────────────────────────────────────────────────────── */
function updateRoadmapTopic(topic, completed, total) {
    if (!DSAState.roadmapProgress) DSAState.roadmapProgress = {};
    DSAState.roadmapProgress[topic] = { completed: parseInt(completed) || 0, total: parseInt(total) || 0 };
    if (parseInt(completed) >= parseInt(total) && parseInt(total) > 0) {
        DSAStreak.addXP(DSAState, DSAStreak.XP_TOPIC);
        DSAToast.show(`🎉 Topic completed: ${topic}!`, 'success');
        DSAAchievements.checkAchievements(DSAState);
    }
    saveToDatabase();
    renderRoadmap();
}

function renderRoadmap() {
    const container = document.getElementById('roadmap-container');
    if (!container) return;
    container.innerHTML = '';

    DSA_TOPICS.forEach(topic => {
        const prog = (DSAState.roadmapProgress || {})[topic] || { completed: 0, total: TOPIC_DEFAULTS[topic]?.total || 10 };
        const pct  = prog.total > 0 ? Math.min(100, Math.round((prog.completed / prog.total) * 100)) : 0;

        const card = document.createElement('div');
        card.className = 'roadmap-card';
        card.innerHTML = `
            <div class="roadmap-header">
                <span class="roadmap-title">${topic}</span>
                <span class="roadmap-pct">${pct}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill ${pct === 100 ? 'green' : pct >= 50 ? '' : 'orange'}" style="width:${pct}%"></div>
            </div>
            <div class="roadmap-meta">
                <span>✅ ${prog.completed} done</span>
                <span>⏳ ${prog.total - prog.completed} left</span>
            </div>
            <div class="input-row mt-2" style="gap:.4rem">
                <input type="number" value="${prog.completed}" min="0" max="${prog.total}" id="rm-comp-${topic.replace(/\s+/g,'-')}" style="width:60px;text-align:center">
                <span style="align-self:center;color:var(--text-muted);font-size:.8rem;">/ </span>
                <input type="number" value="${prog.total}" min="1" id="rm-total-${topic.replace(/\s+/g,'-')}" style="width:60px;text-align:center">
                <button class="btn btn-sm btn-primary" onclick="DSAApp.updateRoadmapTopic('${topic}', document.getElementById('rm-comp-${topic.replace(/\s+/g,'-')}').value, document.getElementById('rm-total-${topic.replace(/\s+/g,'-')}').value)">Save</button>
            </div>
        `;
        container.appendChild(card);
    });
}

/* ──────────────────────────────────────────────────────────
   REVISION PLANNER
────────────────────────────────────────────────────────── */
const REVISION_INTERVALS = [1, 3, 7, 15, 30];

function addRevisionTopic() {
    const topicEl    = document.getElementById('revision-topic-input');
    const intervalEl = document.getElementById('revision-interval');
    if (!topicEl || !topicEl.value.trim()) return;

    const today     = new Date().toISOString().split('T')[0];
    const interval  = parseInt(intervalEl?.value || '1');
    const nextDate  = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    DSAState.revisionItems.push({
        topic:        topicEl.value.trim(),
        lastRevised:  today,
        nextRevision: nextDate.toISOString().split('T')[0],
        interval,
        repetition:   0
    });

    topicEl.value = '';
    saveToDatabase();
    renderRevisionPlanner();
    DSAToast.show('Revision scheduled!', 'success');
}

function markRevised(index) {
    const item = DSAState.revisionItems[index];
    if (!item) return;

    item.repetition++;
    item.lastRevised = new Date().toISOString().split('T')[0];

    // Spaced repetition: increase interval
    const nextInterval = REVISION_INTERVALS[Math.min(item.repetition, REVISION_INTERVALS.length - 1)];
    item.interval = nextInterval;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextInterval);
    item.nextRevision = nextDate.toISOString().split('T')[0];

    DSAStreak.addXP(DSAState, 5);
    saveToDatabase();
    renderRevisionPlanner();
    DSAToast.show(`📖 Revised! Next in ${nextInterval} days`, 'success');
}

function deleteRevisionItem(index) {
    DSAState.revisionItems.splice(index, 1);
    saveToDatabase();
    renderRevisionPlanner();
}

function renderRevisionPlanner() {
    const list = document.getElementById('revision-list');
    if (!list) return;

    const today = new Date().toISOString().split('T')[0];
    const sorted = [...DSAState.revisionItems].sort((a, b) => a.nextRevision.localeCompare(b.nextRevision));

    // Update badge
    const due = sorted.filter(i => i.nextRevision <= today).length;
    const badge = document.querySelector('.nav-item[data-page="revision"] .nav-badge');
    if (badge) badge.innerText = due > 0 ? due : '';

    list.innerHTML = sorted.map((item, i) => {
        const realIdx  = DSAState.revisionItems.indexOf(item);
        const isOverdue = item.nextRevision < today;
        const isDueSoon = item.nextRevision === today;
        const urgency = isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : 'ok';
        return `
            <div class="revision-card">
                <span class="revision-urgency ${urgency}"></span>
                <div class="revision-info">
                    <div class="revision-topic">${item.topic}</div>
                    <div class="revision-date">Next: ${item.nextRevision} · Interval: ${item.interval}d · ×${item.repetition}</div>
                </div>
                <span class="revision-interval">${item.interval}d</span>
                <button class="btn btn-sm btn-success" onclick="DSAApp.markRevised(${realIdx})">✓ Done</button>
                <button class="btn btn-sm btn-danger" onclick="DSAApp.deleteRevisionItem(${realIdx})">✕</button>
            </div>
        `;
    }).join('') || '<p class="text-sm text-muted" style="padding:1rem;text-align:center;">No revision items. Add topics above!</p>';
}

/* ──────────────────────────────────────────────────────────
   NOTES
────────────────────────────────────────────────────────── */
function addNote() {
    const topicEl   = document.getElementById('note-topic');
    const contentEl = document.getElementById('note-content');
    if (!topicEl?.value || !contentEl?.value.trim()) return;

    const existing = DSAState.notes.find(n => n.topic === topicEl.value);
    if (existing) {
        existing.content  = contentEl.value.trim();
        existing.updatedAt = new Date().toISOString();
    } else {
        DSAState.notes.push({
            topic:     topicEl.value,
            content:   contentEl.value.trim(),
            updatedAt: new Date().toISOString()
        });
    }

    contentEl.value = '';
    saveToDatabase();
    renderNotes();
    DSAToast.show('Note saved!', 'success');
}

function deleteNote(index) {
    DSAState.notes.splice(index, 1);
    saveToDatabase();
    renderNotes();
}

function renderNotes() {
    const list = document.getElementById('notes-list');
    if (!list) return;

    if (!DSAState.notes.length) {
        list.innerHTML = '<p class="text-sm text-muted" style="padding:1rem;text-align:center;">No notes yet. Add your first note!</p>';
        return;
    }

    list.innerHTML = DSAState.notes.map((note, i) => `
        <div class="note-card">
            <div class="note-topic">📝 ${note.topic}</div>
            <div class="note-body">${note.content}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.5rem;">
                <span class="text-xs text-muted">${new Date(note.updatedAt).toLocaleDateString()}</span>
                <button class="btn btn-sm btn-danger" onclick="DSAApp.deleteNote(${i})">Delete</button>
            </div>
        </div>
    `).join('');
}

/* ──────────────────────────────────────────────────────────
   WEEKLY GOALS
────────────────────────────────────────────────────────── */
function addWeeklyGoal() {
    const textEl   = document.getElementById('goal-text');
    const targetEl = document.getElementById('goal-target');
    if (!textEl?.value.trim()) return;

    DSAState.weeklyGoals.push({
        text:      textEl.value.trim(),
        target:    parseInt(targetEl?.value || 1),
        current:   0,
        completed: false
    });

    textEl.value   = '';
    if (targetEl) targetEl.value = '1';
    saveToDatabase();
    renderWeeklyGoals();
}

function incrementGoal(index) {
    const goal = DSAState.weeklyGoals[index];
    if (!goal || goal.completed) return;
    goal.current = Math.min(goal.current + 1, goal.target);
    if (goal.current >= goal.target) {
        goal.completed = true;
        DSAStreak.addXP(DSAState, 50);
        DSAToast.show('🎯 Weekly goal completed! +50 XP', 'success');
    }
    saveToDatabase();
    renderWeeklyGoals();
}

function deleteGoal(index) {
    DSAState.weeklyGoals.splice(index, 1);
    saveToDatabase();
    renderWeeklyGoals();
}

function renderWeeklyGoals() {
    const list = document.getElementById('weekly-goals-list');
    if (!list) return;

    if (!DSAState.weeklyGoals.length) {
        list.innerHTML = '<p class="text-sm text-muted" style="padding:1rem;text-align:center;">No goals set for this week</p>';
        return;
    }

    list.innerHTML = DSAState.weeklyGoals.map((g, i) => {
        const pct = g.target > 0 ? Math.round((g.current / g.target) * 100) : 0;
        return `
            <div class="goal-item ${g.completed ? 'done' : ''}">
                <div class="goal-header">
                    <span class="goal-text">${g.completed ? '✅ ' : ''}${g.text}</span>
                    <span class="goal-count">${g.current} / ${g.target}</span>
                </div>
                <div class="progress-track" style="height:6px">
                    <div class="progress-fill ${g.completed ? 'green' : ''}" style="width:${pct}%"></div>
                </div>
                <div style="display:flex;gap:.5rem;margin-top:.5rem">
                    ${!g.completed ? `<button class="btn btn-sm btn-primary" onclick="DSAApp.incrementGoal(${i})">+1</button>` : ''}
                    <button class="btn btn-sm btn-danger" onclick="DSAApp.deleteGoal(${i})">✕</button>
                </div>
            </div>
        `;
    }).join('');
}

/* ──────────────────────────────────────────────────────────
   HEATMAP
────────────────────────────────────────────────────────── */
function renderHeatmap() {
    const container = document.getElementById('heatmap-container');
    if (!container) return;

    // Build a 53-week (1 year) grid
    const end   = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 365);

    const activityMap = {};
    (DSAState.dailyActivity || []).forEach(d => {
        activityMap[d.date] = (activityMap[d.date] || 0) + d.solved;
    });
    (DSAState.studyDates || []).forEach(d => {
        activityMap[d] = activityMap[d] || 1;
    });

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;gap:3px;overflow-x:auto;padding-bottom:.5rem';

    let day = new Date(start);
    day.setDate(day.getDate() - day.getDay()); // align to Sunday

    while (day <= end) {
        const col = document.createElement('div');
        col.style.cssText = 'display:flex;flex-direction:column;gap:3px';

        for (let w = 0; w < 7; w++) {
            const cell = document.createElement('div');
            const ds = day.toISOString().split('T')[0];
            const count = activityMap[ds] || 0;
            const level = count === 0 ? '' : count < 2 ? 'l1' : count < 4 ? 'l2' : count < 7 ? 'l3' : 'l4';
            cell.className = `heatmap-cell ${level}`;
            cell.title = `${ds}: ${count} problem${count !== 1 ? 's' : ''}`;
            cell.style.cssText = 'width:13px;height:13px;border-radius:3px';
            col.appendChild(cell);
            day = new Date(day);
            day.setDate(day.getDate() + 1);
        }

        wrapper.appendChild(col);
    }

    container.appendChild(wrapper);
}

/* ──────────────────────────────────────────────────────────
   SEARCH
────────────────────────────────────────────────────────── */
function handleSearch(query) {
    const results = document.getElementById('search-results');
    if (!results) return;

    if (!query.trim()) { results.classList.remove('open'); return; }

    const q   = query.toLowerCase();
    const hits = [];

    // Topics
    DSA_TOPICS.filter(t => t.toLowerCase().includes(q))
        .forEach(t => hits.push({ icon: '📚', label: t, type: 'Topic', action: () => navigate('roadmap') }));

    // Todos
    (DSAState.todos || []).filter(t => t.text.toLowerCase().includes(q))
        .forEach(t => hits.push({ icon: '✅', label: t.text, type: 'Task', action: () => navigate('dashboard') }));

    // Reminders
    (DSAState.reminders || []).filter(r => r.text.toLowerCase().includes(q))
        .forEach(r => hits.push({ icon: '🔔', label: r.text, type: 'Reminder', action: () => navigate('calendar') }));

    // Notes
    (DSAState.notes || []).filter(n => n.topic.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
        .forEach(n => hits.push({ icon: '📝', label: n.topic, type: 'Note', action: () => navigate('notes') }));

    results.innerHTML = hits.slice(0, 8).map((h, i) => `
        <div class="search-result-item" data-idx="${i}">
            <span>${h.icon}</span>
            <span>${h.label}</span>
            <span class="result-type">${h.type}</span>
        </div>
    `).join('') || `<div class="search-result-item" style="color:var(--text-muted)">No results found</div>`;

    results.classList.add('open');

    results.querySelectorAll('.search-result-item[data-idx]').forEach((el, i) => {
        el.addEventListener('click', () => {
            hits[parseInt(el.dataset.idx)]?.action?.();
            results.classList.remove('open');
            document.getElementById('search-input').value = '';
        });
    });
}

/* ──────────────────────────────────────────────────────────
   NOTIFICATIONS
────────────────────────────────────────────────────────── */
function toggleNotifications() {
    document.getElementById('notification-panel')?.classList.toggle('open');
}

function buildNotifications() {
    const panel = document.getElementById('notif-list');
    if (!panel) return;

    const notifs = [];
    const today  = new Date().toISOString().split('T')[0];

    // Revision due
    (DSAState.revisionItems || []).filter(r => r.nextRevision <= today)
        .forEach(r => notifs.push({ icon: '📖', title: 'Revision Due', text: r.topic }));

    // Streak warning
    if (DSAState.lastActiveDate && DSAState.lastActiveDate !== today) {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        if (DSAState.lastActiveDate < yesterday.toISOString().split('T')[0]) {
            notifs.push({ icon: '🔥', title: 'Streak at Risk!', text: 'Study today to keep your streak alive' });
        }
    }

    // Achievements
    (DSAState.unlockedAchievements || []).slice(-3).forEach(id => {
        const ach = DSAAchievements.ACHIEVEMENTS.find(a => a.id === id);
        if (ach) notifs.push({ icon: ach.icon, title: 'Achievement Unlocked!', text: ach.name });
    });

    const dot = document.querySelector('.notif-dot');
    if (dot) dot.style.display = notifs.length ? '' : 'none';

    panel.innerHTML = notifs.length
        ? notifs.map(n => `
            <div class="notif-item">
                <span class="notif-icon">${n.icon}</span>
                <div>
                    <div class="notif-title">${n.title}</div>
                    <div class="notif-text">${n.text}</div>
                </div>
            </div>
        `).join('')
        : '<p class="text-sm text-muted" style="padding:1rem;text-align:center;">All caught up! 🎉</p>';
}

/* ──────────────────────────────────────────────────────────
   EXPORT
────────────────────────────────────────────────────────── */
function exportCSV() {
    const rows = [
        ['Date','Problems Solved','XP Earned'],
        ...(DSAState.dailyActivity || []).map(d => [d.date, d.solved, d.xpEarned])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    download('dsa-progress.csv', csv, 'text/csv');
    DSAToast.show('CSV exported!', 'success');
}

function exportJSON() {
    download('dsa-state.json', JSON.stringify(DSAState, null, 2), 'application/json');
    DSAToast.show('JSON exported!', 'success');
}

function download(filename, content, type) {
    const a = document.createElement('a');
    a.href  = URL.createObjectURL(new Blob([content], { type }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

/* ──────────────────────────────────────────────────────────
   RENDER ALL
────────────────────────────────────────────────────────── */
function renderAll() {
    DSAStats.refreshStats(DSAState);
    renderTodos();
    renderTopics();
    renderReminders();
    renderRoadmap();
    renderRevisionPlanner();
    renderNotes();
    renderWeeklyGoals();
    renderHeatmap();
    DSACalendar.buildCalendar(DSAState);
    buildNotifications();
    DSAAchievements.renderAchievements(DSAState);
}

/* ──────────────────────────────────────────────────────────
   POMODORO TIMER
────────────────────────────────────────────────────────── */
const Pomodoro = {
    total:   25 * 60,
    left:    25 * 60,
    running: false,
    mode:    'focus',
    timer:   null,

    start() {
        if (this.running) return;
        this.running = true;
        this.timer = setInterval(() => {
            this.left--;
            this.render();
            if (this.left <= 0) {
                this.stop();
                DSAToast.show(this.mode === 'focus' ? '🎉 Focus session done! Take a break.' : '☕ Break over! Time to focus.', 'info');
                if (this.mode === 'focus') {
                    DSAState.pomodoroSessions = (DSAState.pomodoroSessions || 0) + 1;
                    DSAStreak.addXP(DSAState, 15);
                    saveToDatabase();
                }
            }
        }, 1000);
    },

    stop() {
        clearInterval(this.timer);
        this.running = false;
    },

    reset() {
        this.stop();
        this.left = this.total;
        this.render();
    },

    setMode(mode) {
        this.stop();
        this.mode  = mode;
        this.total = mode === 'focus' ? 25*60 : mode === 'short' ? 5*60 : parseInt(document.getElementById('custom-timer')?.value || 25) * 60;
        this.left  = this.total;
        this.render();
    },

    render() {
        const m = Math.floor(this.left / 60).toString().padStart(2,'0');
        const s = (this.left % 60).toString().padStart(2,'0');
        const timeEl = document.getElementById('timer-display');
        const modeEl = document.getElementById('timer-mode-label');
        if (timeEl) timeEl.innerText = `${m}:${s}`;
        if (modeEl) modeEl.innerText = this.mode === 'focus' ? '🎯 Focus' : '☕ Break';

        // SVG ring
        const ring    = document.getElementById('timer-ring-fill');
        const radius  = 70;
        const circum  = 2 * Math.PI * radius;
        if (ring) {
            const progress = 1 - (this.left / this.total);
            ring.style.strokeDasharray  = circum;
            ring.style.strokeDashoffset = circum * (1 - progress);
        }
    }
};
window.DSAPomodoro = Pomodoro;

/* ──────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    DSAToast.init();
    setHeaderDate();
    navigate('dashboard');

    // Populate topic select
    const topicSelect = document.getElementById('topic-select');
    if (topicSelect) {
        topicSelect.innerHTML = DSA_TOPICS.map(t => `<option value="${t}">${t}</option>`).join('');
    }

    // Populate note topic select
    const noteTopicSelect = document.getElementById('note-topic');
    if (noteTopicSelect) {
        noteTopicSelect.innerHTML = DSA_TOPICS.map(t => `<option value="${t}">${t}</option>`).join('');
    }

    // Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) navigate(page);
        });
    });

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', e => handleSearch(e.target.value));
        searchInput.addEventListener('blur', () => {
            setTimeout(() => document.getElementById('search-results')?.classList.remove('open'), 200);
        });
    }

    // Sidebar toggle
    document.getElementById('sidebar-toggle-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-toggle-footer')?.addEventListener('click', toggleSidebar);

    // Notifications
    document.getElementById('notif-btn')?.addEventListener('click', toggleNotifications);

    // Pomodoro init render
    Pomodoro.render();

    // Start loading data
    loadDashboard();
});

/* ──────────────────────────────────────────────────────────
   EXPOSE PUBLIC API (for inline onclick handlers)
────────────────────────────────────────────────────────── */
window.DSAApp = {
    changeSolvedCount,
    updateMilestone,
    addTodo, toggleTodo, deleteTodo, renderTodos,
    logTopic, removeTopic,
    addReminder, removeReminder,
    updateRoadmapTopic,
    addRevisionTopic, markRevised, deleteRevisionItem,
    addNote, deleteNote,
    addWeeklyGoal, incrementGoal, deleteGoal,
    exportCSV, exportJSON,
    navigate, toggleSidebar,
};
