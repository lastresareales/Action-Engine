# ⚙️ Action Engine

A highly personalized goal planner and time utilization app that helps direct you on the best path to attain goals and offers high-ROI activities to fill empty timeslots in your schedule.

**Break down goals → Track progress → Maximize productivity**

---

## ✨ Features

### 🎯 Goal Tracker
- Create goals with a title, description, deadline, category, and priority level
- Organize goals into categories: **Health**, **Career**, **Learning**, **Personal**, or **General**
- Set priority levels: **Low**, **Medium**, or **High**
- Track per-goal progress based on completed subtasks
- Separate views for active goals and completed goals
- Data persists automatically via localStorage

### 🧩 Goal Atomizer (AI-Powered)
- Breaks any goal into 5–7 concrete, actionable atomic subtasks
- Each subtask includes an estimated duration (minutes) and difficulty level
- Powered by the **Groq API** (mixtral-8x7b-32768 model) when an API key is provided
- Intelligent fallback mock generation when no API key is set — detects goal type (Learning, Project, Health, Career) and generates context-aware steps automatically

### 📅 Calendar
- Full interactive monthly calendar view
- Add custom events to any day with a title, category, and optional notes
- Event categories with color coding: **Work**, **Personal**, **Exercise**, **Learning**, **Break**
- Navigate between months with Prev / Next controls

### 📈 ROI Scheduler
- Calculates an estimated ROI score for each subtask based on difficulty and duration
- Sorts pending subtasks by ROI-per-minute ratio
- One-click **"Generate ROI Activities"** button auto-schedules the highest-value pending subtasks into free time slots on the selected day
- Respects configurable work hours (default 9 AM – 5 PM)
- Enforces a daily limit of 2 auto-generated ROI activities per day
- Shows available free minutes for the selected day

### ⏱️ Time Blocker (Gap Optimizer)
- Enter available minutes in a free time gap
- Instantly recommends the highest-ROI pending task that fits within that time window

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vite.dev) | Build tool & dev server |
| [Groq API](https://groq.com) | AI-powered goal atomization |
| localStorage | Client-side data persistence |
| ESLint | Code linting |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or later recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/lastresareales/Action-Engine.git
cd Action-Engine/Action-Engine

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 🤖 AI Goal Atomization (Optional)

Action Engine supports AI-powered goal breakdown via the **Groq API**.

1. Get a free API key at [console.groq.com](https://console.groq.com)
2. When creating a goal, enter your Groq API key in the provided field — it is stored locally in your browser only and never sent anywhere except Groq's API
3. With a key set, the app uses the `mixtral-8x7b-32768` model to generate highly tailored subtasks

Without an API key, the app automatically falls back to intelligent pattern-based step generation based on the detected goal type.

---

## 📁 Project Structure

```
Action-Engine/
└── src/
    ├── features/
    │   ├── GoalTracker.jsx     # Goal management and subtask tracking
    │   ├── GoalAtomizer.jsx    # AI goal breakdown interface
    │   ├── Calendar.jsx        # Interactive calendar and event scheduling
    │   └── TimeBlocker.jsx     # Gap optimization tool
    ├── components/
    │   ├── GoalForm.jsx        # Form to create new goals
    │   ├── GoalItem.jsx        # Individual goal card with subtasks
    │   ├── Button.jsx          # Reusable button component
    │   ├── Badge.jsx           # Status/label badges
    │   └── ProgressBar.jsx     # Visual progress indicator
    ├── utils/
    │   ├── models.js           # Data models and ROI calculation logic
    │   ├── atomizer.js         # Groq API integration and fallback logic
    │   └── storage.js          # localStorage read/write helpers
    ├── App.jsx                 # Root component and layout
    └── main.jsx                # Application entry point
```

---

## 📊 ROI Scoring

Every subtask is automatically assigned an ROI score using the formula:

```
ROI = difficultyScore × durationScore × 10
```

Where:
- `difficultyScore`: Easy = 1, Medium = 2, Hard = 3
- `durationScore`: `min(duration / 15, 3)` — capped at 3 points

The ROI Scheduler ranks tasks by **ROI per minute** to maximize the value of every free slot in your day.

---

## 📄 License

This project is licensed under the terms found in the [LICENSE](./LICENSE) file.
