# Planner — Productivity Dashboard

> A responsive productivity workspace built from scratch with HTML, CSS and vanilla JavaScript.

Planner is a small portfolio web application that combines task management, a calendar, weekly progress tracking and a focus timer in one clean interface.

## 🚀 Demo

Open `index.html` in a browser, or run the project with VS Code + Live Server.

## ✨ Features

- **Welcome screen** with a local profile name
- Create, complete and delete tasks
- Task priorities: High / Medium / Low
- Task categories
- Daily task dashboard
- Weekly productivity visualization
- Monthly calendar
- Pomodoro-style focus timer: 5 / 25 / 50 minutes
- Light / dark mode
- Persistent browser storage with `localStorage`
- Responsive desktop, tablet and mobile layout
- No framework or build system required

## 🖥️ Screens

### Dashboard

The dashboard gives a quick overview of completed tasks, today's workload, productivity and weekly progress.

### Tasks

Tasks can be filtered by **All**, **Open** and **Completed**, with priority and category information visible at a glance.

### Calendar

A monthly calendar displays tasks directly on their due dates.

### Focus

A simple focus timer helps users work in distraction-free sessions.

## 🧠 What I learned

This project focuses on practical front-end fundamentals:

- Semantic HTML5 structure
- CSS Grid and Flexbox
- Responsive design and media queries
- DOM manipulation
- Event-driven JavaScript
- Client-side state management
- `localStorage` persistence
- Date and calendar calculations
- Form validation
- Reusable rendering functions
- Accessible buttons, labels and form controls

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Layout, responsive UI and themes |
| JavaScript ES6+ | Application logic and state |
| Web Storage API | Local persistence |
| Google Fonts | Typography |

## 📁 Project Structure

```text
planner/
├── index.html
├── styles.css
├── script.js
├── preview.svg
├── README.md
├── LICENSE
└── .gitignore
```

## ▶️ Run locally

### Option 1 — Browser

Open `index.html` directly.

### Option 2 — VS Code

1. Open the `planner` folder in VS Code.
2. Open `index.html`.
3. Use **Open with Live Server** if the extension is installed.

No `npm install` or backend is required.

## 💾 Data & Privacy

Planner intentionally uses browser `localStorage` instead of a backend. Tasks and the local profile name stay in the browser used to run the application.

The welcome screen is **not real authentication**; it is a local profile experience for the portfolio demo.

## 🔮 Future Improvements

- Real user authentication
- Backend REST API
- Cloud database and synchronization
- Drag & drop task ordering
- Recurring tasks
- Browser notifications
- Analytics dashboard
- German / English language switch
- Automated tests

## 🎯 Portfolio Goal

The goal of this project is to demonstrate that I can turn a product idea into a complete, usable front-end application — from UI structure and responsive styling to interactive JavaScript behavior and local data persistence.

## 📄 License

MIT License.
