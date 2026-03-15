# ☕ Chill with You — Lo-Fi Productivity Companion

A beautiful dark-themed productivity web app inspired by **Chill with You: Lo-Fi Story**. Work alongside your virtual companion Satone while staying focused with lo-fi music, timers, and habit tracking.

![Dark Theme Dashboard](https://img.shields.io/badge/theme-dark-111113?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![Deploy](https://img.shields.io/badge/deploy-Vercel-black?style=flat-square&logo=vercel)

## ✨ Features

### 🏠 Home Dashboard
- **Analog Clock Timer** — Pomodoro timer with elegant clock face, adjustable work/break/rounds
- **Calendar** — 5-day view with daily focus stats
- **Music Player** — Lo-fi tracks with shuffle/repeat, ambient sound mixer (rain, fire, birds, wind, crickets, ocean)
- **Task List** — Add, check off, delete tasks (+10 XP each)
- **Daily Habits** — Track daily habits with one-tap toggle (+15 XP each)
- **Progress Heatmap** — GitHub-style contribution graph for your work sessions
- **Satone's Story** — Visual novel episodes unlocked by earning XP

### 📊 Statistics
- Focus time bar chart (weekly view)
- Productivity breakdown (deep focus / light work / breaks)
- Habit consistency tracker
- Most played tracks
- Daily goal progress

### 👤 Profile
- Level & XP progression system
- 8 unlockable achievements
- Bond meter with Satone
- Personal stats overview

### ⚙ Settings
- Display name & avatar customization
- Timer duration controls
- Notification & auto-break toggles
- Theme selection (Dark / Midnight / Forest)
- Accent color picker
- Data export & reset

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/chill-with-you.git
cd chill-with-you

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

## 🌐 Deploy to Vercel

### Option 1: Via Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repository
4. Vercel auto-detects Vite — click **Deploy**
5. Done! Your app is live.

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 📁 Project Structure

```
chill-with-you/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AnalogTimer.jsx    # Clock face timer
│   │   ├── StoryOverlay.jsx   # Visual novel dialog
│   │   └── UI.jsx             # Shared components (Card, Toggle, Badge)
│   ├── data/
│   │   ├── constants.js       # Tracks, episodes, achievements, defaults
│   │   └── utils.js           # Helper functions
│   ├── hooks/
│   │   ├── useLocalStorage.js # Persistent state
│   │   └── useTimer.js        # Pomodoro timer logic
│   ├── App.jsx                # Main app with all pages
│   ├── index.css              # Global styles
│   └── main.jsx               # React entry point
├── index.html
├── package.json
├── vercel.json
├── vite.config.js
└── README.md
```

## 🎨 Design

- **Background:** `#111113`
- **Cards:** `#1a1a1e`
- **Accent:** `#c9463d` (rose red)
- **Font:** DM Sans

## 📄 License

MIT — free to use, modify, and distribute.

---

Made with 💕 — *Because no one should work alone.*
