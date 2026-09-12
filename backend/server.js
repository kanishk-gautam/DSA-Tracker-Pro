const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const path     = require("path");
require("dotenv").config();

const Dashboard = require("./models/Dashboard");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* ─── SERVE STATIC FRONTEND ─── */
app.use(express.static(path.join(__dirname, '..')));

/* ─── ROOT → Dashboard HTML ─── */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dsprogresstracker.html'));
});

/* ─── CONNECT DATABASE ─── */

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

/* ───────────────────────────────────────────
   HELPER: ensure one document always exists
─────────────────────────────────────────── */
async function getOrCreateDashboard() {
    let data = await Dashboard.findOne();
    if (!data) {
        data = await Dashboard.create({
            totalSolved: 0,
            nextMilestone: 100,
            todos: [],
            topicsDoneToday: [],
            reminders: [],
            currentStreak: 0,
            bestStreak: 0,
            lastActiveDate: '',
            totalXP: 0,
            currentLevel: 1,
            unlockedAchievements: [],
            dailyActivity: [],
            revisionItems: [],
            notes: [],
            weeklyGoals: [],
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            topicsCovered: 0
        });
    }
    return data;
}

/* ─── GET DASHBOARD ─── */

app.get("/api/dashboard", async (req, res) => {
    try {
        const data = await getOrCreateDashboard();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* ─── UPDATE DASHBOARD (full save) ─── */

app.put("/api/dashboard", async (req, res) => {
    try {
        let dashboard = await Dashboard.findOne();
        if (!dashboard) {
            dashboard = new Dashboard(req.body);
        } else {
            Object.assign(dashboard, req.body);
            dashboard.markModified('roadmapProgress');
            dashboard.markModified('dailyActivity');
            dashboard.markModified('revisionItems');
            dashboard.markModified('notes');
            dashboard.markModified('weeklyGoals');
            dashboard.markModified('todos');
            dashboard.markModified('reminders');
            dashboard.markModified('studyDates');
            dashboard.markModified('unlockedAchievements');
        }
        await dashboard.save();
        res.json(dashboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* ─── PATCH: log a problem solved ─── */

app.patch("/api/dashboard/solve", async (req, res) => {
    try {
        const { difficulty = 'medium' } = req.body;
        const dashboard = await getOrCreateDashboard();

        const todayStr = new Date().toISOString().split('T')[0];

        // Update totals
        dashboard.totalSolved   += 1;
        dashboard.totalXP       += 10;
        dashboard.currentLevel   = Math.floor(dashboard.totalXP / 200) + 1;

        // Difficulty tracking
        if (difficulty === 'easy')   dashboard.easySolved   += 1;
        else if (difficulty === 'hard') dashboard.hardSolved += 1;
        else dashboard.mediumSolved += 1;

        // Streak logic
        const lastDate = dashboard.lastActiveDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];

        if (lastDate === todayStr) {
            // already counted today
        } else if (lastDate === yStr) {
            dashboard.currentStreak += 1;
        } else {
            dashboard.currentStreak = 1;
        }
        dashboard.bestStreak    = Math.max(dashboard.bestStreak, dashboard.currentStreak);
        dashboard.lastActiveDate = todayStr;

        // Study dates for heatmap
        if (!dashboard.studyDates.includes(todayStr)) {
            dashboard.studyDates.push(todayStr);
        }

        // Daily activity
        const dayEntry = dashboard.dailyActivity.find(d => d.date === todayStr);
        if (dayEntry) {
            dayEntry.solved   += 1;
            dayEntry.xpEarned += 10;
        } else {
            dashboard.dailyActivity.push({ date: todayStr, solved: 1, xpEarned: 10 });
        }

        dashboard.markModified('dailyActivity');
        dashboard.markModified('studyDates');
        await dashboard.save();
        res.json(dashboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* ─── GET ANALYTICS ─── */

app.get("/api/analytics", async (req, res) => {
    try {
        const dashboard = await getOrCreateDashboard();
        const last30 = dashboard.dailyActivity
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-30);
        res.json({
            dailyActivity: last30,
            topicsDoneToday: dashboard.topicsDoneToday,
            easySolved:   dashboard.easySolved,
            mediumSolved: dashboard.mediumSolved,
            hardSolved:   dashboard.hardSolved,
            totalSolved:  dashboard.totalSolved,
            currentStreak: dashboard.currentStreak,
            totalXP:       dashboard.totalXP,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* ─── START SERVER ─── */

app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});