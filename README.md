# 🌿 HabitFlow — Multi-User Habit Tracker

A modern, calm, bright habit tracking platform with Google OAuth, personal dashboards, and real-time analytics.

## ✨ Features

- ✅ **Google Sign-In** — No password required
- 📊 **Weekly Grid** — Mon–Sun habit tracking table
- 🔥 **Streaks** — Track your consecutive days
- 📈 **Analytics** — Bar, line, and pie charts
- 🟩 **Heatmap** — GitHub-style year activity view
- 🔒 **Data Isolation** — Every user sees only their own data
- 📱 **Responsive** — Works on mobile and desktop

---

## 🗂 Project Structure

```
habit-tracker/
├── frontend/        # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Sidebar, Navbar
│   │   │   ├── habits/       # WeeklyGrid, HabitCard, HabitModal, TodayChecklist
│   │   │   └── analytics/    # HabitHeatmap, StatsPanel
│   │   ├── context/          # AuthContext
│   │   ├── pages/            # Dashboard, Habits, Analytics, Settings, Login
│   │   ├── services/         # api.js, authService, habitService, logService
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/         # Node.js + Express REST API
│   ├── config/      # db.js (MongoDB Atlas)
│   ├── controllers/ # authController, habitController, logController
│   ├── middleware/  # auth.js (JWT), errorHandler.js
│   ├── models/      # User, Habit, HabitLog
│   ├── routes/      # authRoutes, habitRoutes, logRoutes
│   └── server.js
│
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/techwingzcloud-git/habit-tracker.git
cd habit-tracker
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your MONGO_URI, GOOGLE_CLIENT_ID, JWT_SECRET
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
# Fill in VITE_GOOGLE_CLIENT_ID
npm install
npm run dev
```

Open **http://localhost:5173** 🎉

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `FRONTEND_URL` | Allowed CORS origin |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |

---

## 🌐 Deployment

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy ✅

### Backend → Render
1. Push `backend/` to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy ✅

### Database → MongoDB Atlas
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user with read/write access
3. Whitelist IP `0.0.0.0/0` for Render
4. Copy connection string to `MONGO_URI`

---

## 🔐 Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google+ API** and **Google OAuth**
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized origins:
   - `http://localhost:5173`
   - `https://your-app.vercel.app`
6. Copy Client ID to both `.env` files

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#F8FAFC` |
| Primary | `#4F46E5` |
| Success | `#22C55E` |
| Cards | `#FFFFFF` |
| Text | `#111827` |
| Font | Inter |

---

Built with ❤️ by [techwingzcloud](https://github.com/techwingzcloud-git)
