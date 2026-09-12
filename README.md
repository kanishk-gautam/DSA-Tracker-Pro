# 🚀 DSA Tracker Pro — Premium DSA Analytics Platform

<div align="center">

![DSA Tracker Pro](https://img.shields.io/badge/DSA%20Tracker-Pro%20v2.0-6366F1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6bTAgMTFMMiAxM2wxMCA1IDEwLTV6Ii8+PC9zdmc+)
![Node.js](https://img.shields.io/badge/Node.js-v24+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

**A SaaS-quality Data Structures & Algorithms progress tracker with gamification, spaced repetition, analytics, and a stunning glassmorphism UI.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Setup](#-getting-started) · [API Docs](#-api-reference) · [Screenshots](#-ui-overview) · [Folder Structure](#-project-structure)

</div>

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
6. [Environment Variables](#-environment-variables)
7. [API Reference](#-api-reference)
8. [Frontend Pages](#-frontend-pages)
9. [Database Schema](#-database-schema)
10. [JavaScript Modules](#-javascript-modules)
11. [CSS Architecture](#-css-architecture)
12. [Gamification System](#-gamification-system)
13. [Dark Mode](#-dark-mode)
14. [Responsive Design](#-responsive-design)
15. [Contributing](#-contributing)

---

## 🎯 Project Overview

**DSA Tracker Pro** is a full-stack web application designed to help computer science students and developers systematically track their Data Structures & Algorithms practice. It transforms a dry, repetitive study process into an engaging, gamified journey with visual analytics, streak tracking, spaced repetition, and achievement badges.

### What makes it "Pro"?
- **Glassmorphism UI** — frosted-glass cards, smooth gradients, modern shadows
- **Gamification** — XP points, levels, streaks, and 12 achievement badges
- **Spaced Repetition** — scientifically proven revision scheduling (1→3→7→15→30 days)
- **Chart.js Analytics** — 5 interactive charts for deep performance insights
- **GitHub-style Heatmap** — visualize 365 days of study activity
- **Pomodoro Timer** — built-in focus timer with session XP rewards
- **Full MongoDB persistence** — all data synced to cloud via Atlas
- **Offline fallback** — localStorage keeps data safe if backend is offline

---

## ✨ Features

### 🎨 UI / Design
| Feature | Details |
|---|---|
| Glassmorphism | `backdrop-filter: blur(20px)` on all cards |
| Theme | Primary `#6366F1` · Secondary `#8B5CF6` · Success `#10B981` · Danger `#EF4444` |
| Typography | Google Fonts — **Inter** (body) + **Outfit** (headings) |
| Animations | Fade-in pages, count-up numbers, slide-in cards, flicker flame, toast pop-in |
| Buttons | All `border-radius: 12px` · hover lift · scale press · soft shadow |
| Dark Mode | Full theme switch persisted in `localStorage` |

### 📊 Dashboard
- **8 animated metric cards** — Problems Solved, Current Streak, Total XP, Level, Topics Covered, Next Milestone, Completion %, Focus Sessions
- **XP progress bar** showing current level and XP needed for next level
- **Quick problem logger** with difficulty selector (Easy / Medium / Hard)
- **Milestone setter** with dynamic progress bar
- **Mini difficulty doughnut chart** inline

### 📈 Progress Page
- **14-day daily bar chart** — problems solved per day
- **6-week line chart** — weekly performance trend
- **GitHub-style study heatmap** — 365 days, 5 intensity levels
- **Streak stats** — Current streak, Best streak, Total study days

### 🔬 Analytics Page
- **6-month monthly overview** — long-term trend line chart
- **Difficulty breakdown doughnut** — Easy / Medium / Hard split
- **Topic distribution polar chart** — coverage across all 17 DSA topics
- **Difficulty count cards** — individual Easy / Medium / Hard totals

### 🗺️ DSA Roadmap
Tracks progress across **17 core DSA topics**:
> Arrays · Strings · Linked List · Stack · Queue · HashMap · Binary Search · Recursion · Trees · BST · Heap · Trie · Graph · Greedy · Backtracking · Dynamic Programming · Segment Tree

Each topic shows:
- Progress percentage
- Completed / remaining count
- Color-coded progress bar (green → 100%, default → in progress, orange → low)
- Inline editable completed and total counts

### 📖 Revision Planner (Spaced Repetition)
- Schedule revision for any topic with intervals: **1, 3, 7, 15, 30 days**
- Automatically advances interval after each "Done" click
- Urgency indicators: 🔴 Overdue · 🟡 Due Today · 🟢 OK
- Due count badge shown live in sidebar
- +5 XP per revision session

### 📅 Calendar & Reminders
- Interactive monthly calendar with navigation
- **Study days** highlighted in green
- **Reminders** shown as purple dots
- Click any day to view reminders for that date
- Add / delete reminders with text + date

### ⏱️ Pomodoro Timer
- Modes: **25-min Focus** · **5-min Break** · **Custom**
- SVG ring animation shows real-time progress
- Start / Pause / Reset controls
- **+15 XP** awarded per completed focus session
- Sessions tracked in stats

### 🏆 Achievements (12 Badges)
| Badge | Condition |
|---|---|
| 🎯 First Blood | Solve 1st problem |
| 🔟 Getting Started | Solve 10 problems |
| 💪 Half Century | Solve 50 problems |
| 💯 Centurion | Solve 100 problems |
| 🏅 Quarter Master | Solve 250 problems |
| 👑 Legend | Solve 500 problems |
| 🔥 7 Day Streak | 7 consecutive study days |
| ⚡ 30 Day Legend | 30 consecutive study days |
| 🕸️ Graph Master | Complete Graphs roadmap |
| 🧠 DP Master | Complete Dynamic Programming roadmap |
| ⭐ XP Hunter | Earn 500 XP |
| 🌟 XP Legend | Earn 1000 XP |

Each unlock shows a toast notification and awards +50 bonus XP.

### ✅ To-Do List
- Add tasks with **priority** (High 🔴 / Medium 🟡 / Low 🟢) and **due date**
- Filter: All · Active · Completed · High Priority
- Click checkbox to toggle completion with animation
- Priority color dots and chip labels

### 📝 Topic Notes
- Write and store notes per DSA topic
- Topics include all 17 roadmap categories
- Notes persist to MongoDB
- Timestamped with last updated date

### 🎯 Weekly Goals
- Add custom goals with a numeric target (e.g., "Solve 20 problems", target: 20)
- Increment progress with +1 button
- Completion awards +50 XP
- Progress bar per goal

### 🔍 Global Search
- Searches across: Topics · Tasks · Reminders · Notes
- Live dropdown results with type labels
- Click result to navigate to the relevant page

### 🔔 Notification Center
- Revision due alerts
- Streak warning (if not studied today)
- Recent achievement unlocks
- Red dot indicator on bell icon when notifications exist

### 📤 Export
- **Export CSV** — daily activity log (date, solved, XP earned)
- **Export JSON** — complete application state

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **HTML5** | Semantic page structure |
| **Vanilla CSS** | Glassmorphism, animations, responsive grid |
| **Vanilla JavaScript (ES6+)** | All interactivity, state management, API calls |
| **Chart.js 4.4** | Data visualizations (5 chart types) |
| **Google Fonts** | Inter + Outfit typefaces |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js v24+** | JavaScript runtime |
| **Express.js 4.x** | HTTP server and REST API |
| **Mongoose 8.x** | MongoDB ODM |
| **MongoDB Atlas** | Cloud database |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin request handling |

---

## 📁 Project Structure

```
web tech/
│
├── dsprogresstracker.html          # Main SPA — all 9 pages rendered client-side
│
├── css/
│   ├── theme.css                   # CSS custom properties (light + dark tokens)
│   └── style.css                   # Full component library (800+ lines)
│
├── js/
│   ├── app.js                      # Main controller — state, API, navigation, all features
│   ├── charts.js                   # Chart.js wrappers for all 5 chart types
│   ├── calendar.js                 # Interactive calendar & month navigation
│   ├── stats.js                    # Animated number counters, metric refresh
│   ├── streak.js                   # Streak calculation, XP system, milestone detection
│   ├── achievements.js             # Badge definitions, unlock detection, grid render
│   └── theme.js                    # Dark/light mode toggle with localStorage persistence
│
└── backend/
    ├── server.js                   # Express server (API routes + static file serving)
    ├── models/
    │   └── Dashboard.js            # Mongoose schema (all fields)
    ├── .env                        # MongoDB URI + PORT (not committed to git)
    ├── package.json
    └── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 ([Download](https://nodejs.org))
- **MongoDB Atlas** account (free tier works) OR local MongoDB installation
- A modern browser (Chrome, Edge, Firefox)

### 1. Clone / Download the Project

```bash
# If using git
git clone <your-repo-url> "web tech"
cd "web tech"
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs: `express`, `mongoose`, `cors`, `dotenv`, `nodemon`

### 3. Configure Environment Variables

Edit `backend/.env`:

```env
MONGO_URI="your_mongodb_connection_string_here"
PORT=5000
```

**Getting a MongoDB Atlas URI:**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string and replace `<password>` with your DB user's password

### 4. Start the Backend Server

```bash
# From the backend/ directory
node server.js

# OR use nodemon for auto-reload during development
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

### 5. Open the Application

Visit **http://localhost:5000** in your browser.

The Express server serves the frontend files statically, so you don't need a separate frontend server.

---

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `PORT` | Port for the Express server | `5000` |

> ⚠️ **Never commit `.env` to version control.** Add it to `.gitignore`.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

---

### `GET /api/dashboard`

Returns the full dashboard state document. Creates a default document if none exists.

**Response `200 OK`:**
```json
{
  "_id": "...",
  "totalSolved": 42,
  "nextMilestone": 100,
  "currentStreak": 7,
  "bestStreak": 14,
  "totalXP": 520,
  "currentLevel": 3,
  "easySolved": 20,
  "mediumSolved": 18,
  "hardSolved": 4,
  "topicsCovered": 5,
  "lastActiveDate": "2026-06-06",
  "studyDates": ["2026-05-30", "2026-05-31", "..."],
  "todos": [{ "text": "Solve Two Sum", "completed": false, "priority": "high", "dueDate": "" }],
  "topicsDoneToday": ["Arrays", "Binary Search"],
  "reminders": [{ "text": "Revise Graph DFS", "date": "2026-06-10" }],
  "roadmapProgress": { "Arrays": { "completed": 15, "total": 20 } },
  "dailyActivity": [{ "date": "2026-06-06", "solved": 5, "xpEarned": 50 }],
  "revisionItems": [{ "topic": "DP", "nextRevision": "2026-06-09", "interval": 3, "repetition": 1 }],
  "notes": [{ "topic": "Arrays", "content": "Sliding window trick...", "updatedAt": "..." }],
  "weeklyGoals": [{ "text": "Solve 20 problems", "target": 20, "current": 12, "completed": false }],
  "unlockedAchievements": ["first_problem", "streak7"],
  "pomodoroSessions": 3
}
```

---

### `PUT /api/dashboard`

Saves the complete state object. Used for all data persistence (todos, reminders, roadmap, etc.).

**Request Body:** Full state object (same structure as GET response)

**Response `200 OK`:** Returns the saved document.

---

### `PATCH /api/dashboard/solve`

Logs a single problem solve — handles streak calculation, XP, difficulty tracking, and daily activity updates atomically on the server.

**Request Body:**
```json
{ "difficulty": "medium" }
```
`difficulty` can be `"easy"`, `"medium"`, or `"hard"`.

**Response `200 OK`:** Returns the updated dashboard document.

---

### `GET /api/analytics`

Returns a trimmed analytics payload (last 30 days of activity + difficulty breakdown).

**Response `200 OK`:**
```json
{
  "dailyActivity": [{ "date": "2026-06-06", "solved": 3, "xpEarned": 30 }],
  "topicsDoneToday": ["Arrays"],
  "easySolved": 20,
  "mediumSolved": 18,
  "hardSolved": 4,
  "totalSolved": 42,
  "currentStreak": 7,
  "totalXP": 520
}
```

---

### Static File Serving

The Express server also serves the frontend as static files:

| Route | Serves |
|---|---|
| `GET /` | `dsprogresstracker.html` |
| `GET /css/style.css` | `css/style.css` |
| `GET /js/app.js` | `js/app.js` |
| …etc | All frontend assets |

---

## 📱 Frontend Pages

The app is a **Single-Page Application (SPA)** — all 9 sections are rendered in one HTML file and toggled via JavaScript.

| Page | Route Key | Description |
|---|---|---|
| Dashboard | `dashboard` | Main overview — stat cards, quick solve, to-do, topics, weekly goals |
| Progress | `progress` | Daily/weekly charts, heatmap, streak stats |
| Analytics | `analytics` | Monthly chart, difficulty breakdown, topic polar chart |
| DSA Roadmap | `roadmap` | 17-topic progress tracker with editable fields |
| Revision Planner | `revision` | Spaced repetition queue with urgency indicators |
| Calendar | `calendar` | Monthly calendar + reminder management |
| Pomodoro | `pomodoro` | Focus timer with SVG ring animation |
| Achievements | `achievements` | Badge gallery (locked/unlocked) |
| Notes | `notes` | Topic-wise note storage |
| Settings | `settings` | Dark mode toggle, data export |

**Navigation is handled by:**
```javascript
navigate('roadmap'); // switches active page and nav item
```

---

## 🗄️ Database Schema

The entire application uses **a single MongoDB document** (singleton pattern — one document per deployment).

```javascript
// backend/models/Dashboard.js

const dashboardSchema = new mongoose.Schema({
  // ── Core Metrics ──
  totalSolved:    { type: Number, default: 0 },
  nextMilestone:  { type: Number, default: 100 },
  easySolved:     { type: Number, default: 0 },
  mediumSolved:   { type: Number, default: 0 },
  hardSolved:     { type: Number, default: 0 },
  topicsCovered:  { type: Number, default: 0 },

  // ── To-Do List ──
  todos: [{
    text:      String,
    completed: { type: Boolean, default: false },
    priority:  { type: String, enum: ['high','medium','low'], default: 'medium' },
    dueDate:   String,
    createdAt: { type: Date, default: Date.now }
  }],

  // ── Topics Logged Today ──
  topicsDoneToday: [String],

  // ── Calendar Reminders ──
  reminders: [{ text: String, date: String }],

  // ── Streak System ──
  currentStreak:   { type: Number, default: 0 },
  bestStreak:      { type: Number, default: 0 },
  lastActiveDate:  { type: String, default: '' },
  studyDates:      [String],   // ISO dates for heatmap

  // ── XP & Level ──
  totalXP:       { type: Number, default: 0 },
  currentLevel:  { type: Number, default: 1 },

  // ── Achievements ──
  unlockedAchievements: [String],

  // ── DSA Roadmap ──
  roadmapProgress: {
    type: Map,
    of: { completed: Number, total: Number }
  },

  // ── Daily Activity (for charts) ──
  dailyActivity: [{
    date:     String,
    solved:   { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 }
  }],

  // ── Revision Planner ──
  revisionItems: [{
    topic:        String,
    lastRevised:  String,
    nextRevision: String,
    interval:     { type: Number, default: 1 },
    repetition:   { type: Number, default: 0 }
  }],

  // ── Topic Notes ──
  notes: [{
    topic:     String,
    content:   String,
    updatedAt: { type: Date, default: Date.now }
  }],

  // ── Weekly Goals ──
  weeklyGoals: [{
    text:      String,
    target:    { type: Number, default: 1 },
    current:   { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  }],
  weekStartDate: { type: String, default: '' },

  // ── Pomodoro ──
  pomodoroSessions: { type: Number, default: 0 }

}, { timestamps: true });
```

---

## 🧩 JavaScript Modules

### `js/app.js` — Main Controller
The central brain of the application. Responsibilities:
- Global state object (`DSAState`)
- API fetch/save functions with offline localStorage fallback
- SPA navigation (`navigate()`)
- All CRUD operations for todos, topics, reminders, goals, notes, revision
- Toast notification system (`DSAToast`)
- Global search (`handleSearch()`)
- CSV/JSON export
- Pomodoro timer object
- `renderAll()` — refreshes all UI from state

### `js/charts.js` — Visualizations
Wraps Chart.js with 5 chart renderers:
| Function | Chart Type | Data Source |
|---|---|---|
| `renderDailyChart()` | Bar | Last 14 days of `dailyActivity` |
| `renderWeeklyChart()` | Line | Grouped weekly from `dailyActivity` |
| `renderMonthlyChart()` | Line | Grouped monthly from `dailyActivity` |
| `renderDifficultyChart()` | Doughnut | `easySolved / mediumSolved / hardSolved` |
| `renderTopicChart()` | Polar Area | `roadmapProgress` map |

### `js/stats.js` — Animated Counters
- `countUp(el, end, suffix, duration)` — smooth number animation using `requestAnimationFrame`
- `refreshStats(state)` — updates all 8+ stat card DOM elements from state

### `js/streak.js` — Streak & XP
- `recalcStreak(state)` — updates streak based on `lastActiveDate` vs yesterday
- `addXP(state, amount)` — increments XP and recalculates level
- `checkMilestone(state)` — detects milestone (1/10/50/100/250/500) and awards 100 XP
- Constants: `XP_PROBLEM = 10`, `XP_TOPIC = 25`, `XP_MILESTONE = 100`

### `js/achievements.js` — Badge System
- Array of 12 achievement definitions (id, name, desc, icon, condition function)
- `checkAchievements(state)` — scans all achievements, unlocks newly earned ones
- `renderAchievements(state)` — builds badge grid with locked/unlocked states

### `js/calendar.js` — Calendar
- `buildCalendar(state)` — renders day grid for `viewYear/viewMonth`
- Navigation with `navigate(-1/+1)` updating module-level month state
- Click handlers to pre-fill reminder date input

### `js/theme.js` — Dark Mode
- Reads preference from `localStorage` on load (falls back to `prefers-color-scheme`)
- `toggle()` — flips `.dark` class on `<body>` and saves to storage
- Fires immediately (before DOMContentLoaded) to prevent flash of wrong theme

---

## 🎨 CSS Architecture

### `css/theme.css` — Design Tokens
All visual design decisions live in CSS custom properties:
```css
/* Light mode */
:root {
  --primary:    #6366F1;
  --secondary:  #8B5CF6;
  --success:    #10B981;
  --danger:     #EF4444;
  --bg:         #F8FAFC;
  --glass:      rgba(255,255,255,0.8);
  --blur:       blur(20px);
  --radius-lg:  20px;
  --shadow-md:  0 8px 24px rgba(99,102,241,.10);
}

/* Dark mode — only overrides that change */
body.dark {
  --bg:    #0F0F1A;
  --glass: rgba(30,30,50,0.8);
  --text:  #F1F5F9;
}
```

### `css/style.css` — Component Library
Organized into sections:
1. Reset & base
2. App shell (sidebar + main)
3. Sidebar & navigation
4. Top header
5. Glass cards
6. Dashboard grid layouts
7. Stat / metric cards
8. Buttons (6 variants)
9. Inputs & forms
10. Progress bars
11. Streak display
12. Badge/Achievement grid
13. Roadmap cards
14. Calendar
15. Heatmap
16. To-Do items
17. Topic pills
18. Pomodoro timer
19. Notes
20. Notifications panel
21. Search results dropdown
22. Weekly goals
23. Revision planner
24. Toast notifications
25. Utility classes
26. Keyframe animations
27. Responsive breakpoints

---

## 🎮 Gamification System

### XP Economy

| Action | XP Reward |
|---|---|
| Solve a problem | +10 XP |
| Log a topic | +25 XP |
| Complete a milestone (1/10/50/100/250/500) | +100 XP |
| Unlock an achievement | +50 XP bonus |
| Complete weekly goal | +50 XP |
| Complete Pomodoro session | +15 XP |
| Revise a topic | +5 XP |

### Level Progression

```
Level = floor(Total XP / 200) + 1
```

| Level | XP Required |
|---|---|
| Level 1 | 0 XP |
| Level 2 | 200 XP |
| Level 3 | 400 XP |
| Level 4 | 600 XP |
| Level N | (N-1) × 200 XP |

### Streak Rules
- Study any day → streak increments
- Miss a day → streak resets to 1 on next study day
- Streak persists in both MongoDB and localStorage
- Best streak is always preserved

### Spaced Repetition Intervals
```
Repetition 0 → Next review in 1 day
Repetition 1 → Next review in 3 days
Repetition 2 → Next review in 7 days
Repetition 3 → Next review in 15 days
Repetition 4+ → Next review in 30 days
```

---

## 🌙 Dark Mode

Dark mode is implemented using a `.dark` class on `<body>`:

```javascript
// Toggle
document.body.classList.toggle('dark');
localStorage.setItem('dsa-theme', isDark ? 'dark' : 'light');
```

The theme script runs **inline and synchronously** before the page renders, preventing a flash of the wrong theme (FOUC).

All colors are CSS custom properties — switching themes updates all components automatically in one class toggle.

---

## 📐 Responsive Design

| Breakpoint | Layout |
|---|---|
| > 1200px | 4-column grid, full sidebar |
| 1024px – 1200px | 2-column grid |
| 768px – 1024px | 2-column grid, sidebar narrows |
| < 768px | 1-column stack, sidebar icon-only mode |
| < 480px | Compact padding, tighter cards |

Grid system uses named utility classes:
```css
.grid-4  { grid-template-columns: repeat(4, 1fr); }
.grid-3  { grid-template-columns: repeat(3, 1fr); }
.grid-2  { grid-template-columns: repeat(2, 1fr); }
.col-span-2 { grid-column: span 2; }
```

---

## 🔒 Security Notes

- The `.env` file contains your database credentials — **never commit it to a public repository**.
- Add `.env` and `node_modules/` to `.gitignore`:
  ```
  node_modules/
  backend/.env
  ```
- For production, add authentication middleware (JWT/session-based) to the Express API.
- MongoDB Atlas IP whitelist should be set to your server's IP in production.

---

## 📦 npm Scripts

From the `backend/` directory:

| Script | Command | Description |
|---|---|---|
| `start` | `node server.js` | Production start |
| `dev` | `nodemon server.js` | Development with auto-reload |

---

## 🐛 Troubleshooting

### Port 5000 already in use
```powershell
netstat -ano | findstr :5000
taskkill /F /PID <PID>
```

### MongoDB connection fails
- Check your `MONGO_URI` in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas Network Access
- Try adding `?connectTimeoutMS=5000` to the URI

### Charts not rendering
- Ensure `Chart.js` CDN loads (check network tab)
- Navigate to the Analytics or Progress page to trigger chart rendering
- Charts are re-rendered each time their page becomes active

### Data not persisting
- If backend is unreachable, data is saved to `localStorage` as fallback
- Check browser console for `"Backend offline — using local state"` warning
- Restart backend and reload the page to sync

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** — see the `package.json` for details.

---

## 👩‍💻 Author

Built with ❤️ as a premium full-stack DSA tracking solution.

**Stack:** Node.js · Express · MongoDB Atlas · Vanilla JS · Chart.js · Glassmorphism CSS

---

<div align="center">

**⭐ Star this repo if it helped your DSA journey!**

`http://localhost:5000` · Backend Port `5000` · MongoDB Atlas

</div>
