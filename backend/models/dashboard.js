const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({

    /* ─── EXISTING FIELDS (preserved) ─── */
    totalSolved: { type: Number, default: 0 },
    nextMilestone: { type: Number, default: 100 },

    todos: [{
        text: { type: String },
        completed: { type: Boolean, default: false },
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        dueDate: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
    }],

    topicsDoneToday: [String],

    reminders: [{
        text: { type: String },
        date: { type: String }
    }],

    /* ─── STREAK SYSTEM ─── */
    currentStreak: { type: Number, default: 0 },
    bestStreak:    { type: Number, default: 0 },
    lastActiveDate: { type: String, default: '' },
    studyDates: [String],  // ISO date strings for heatmap

    /* ─── XP & LEVEL SYSTEM ─── */
    totalXP:      { type: Number, default: 0 },
    currentLevel: { type: Number, default: 1 },

    /* ─── ACHIEVEMENTS ─── */
    unlockedAchievements: [String],

    /* ─── DSA ROADMAP PROGRESS ─── */
    roadmapProgress: {
        type: Map,
        of: {
            completed: { type: Number, default: 0 },
            total:     { type: Number, default: 0 }
        },
        default: {}
    },

    /* ─── DAILY ANALYTICS (problems per day) ─── */
    dailyActivity: [{
        date:   { type: String },
        solved: { type: Number, default: 0 },
        xpEarned: { type: Number, default: 0 }
    }],

    /* ─── REVISION PLANNER (spaced repetition) ─── */
    revisionItems: [{
        topic:        { type: String },
        lastRevised:  { type: String },
        nextRevision: { type: String },
        interval:     { type: Number, default: 1 },  // days
        repetition:   { type: Number, default: 0 }   // how many times revised
    }],

    /* ─── TOPIC-WISE NOTES ─── */
    notes: [{
        topic:     { type: String },
        content:   { type: String },
        updatedAt: { type: Date, default: Date.now }
    }],

    /* ─── WEEKLY GOALS ─── */
    weeklyGoals: [{
        text:      { type: String },
        target:    { type: Number, default: 1 },
        current:   { type: Number, default: 0 },
        completed: { type: Boolean, default: false }
    }],
    weekStartDate: { type: String, default: '' },

    /* ─── POMODORO STATS ─── */
    pomodoroSessions: { type: Number, default: 0 },

    /* ─── DIFFICULTY BREAKDOWN ─── */
    easySolved:   { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved:   { type: Number, default: 0 },

    /* ─── TOPICS COVERED (overall count) ─── */
    topicsCovered: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("Dashboard", dashboardSchema);