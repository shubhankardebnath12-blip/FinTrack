# FinTrack — Smart Expense Tracker

> A full-stack, AI-powered expense tracker with a premium fintech UI.  
> **Stack:** React · Vite · Tailwind CSS · Node.js · Express · MongoDB · JWT

---

## Quick Start (2 steps)

### 1. Open in VS Code
```
File → Open Workspace from File → FinTrack.code-workspace
```

### 2. Run everything with one shortcut
Press **`Ctrl+Shift+B`** (macOS: **`Cmd+Shift+B`**) to trigger the default build task:  
**"Start FinTrack (Both)"** — launches frontend and backend in separate integrated terminal panels.

---

## First-Time Setup

### Step 1 — Install dependencies
```bash
# From the expense-tracker/ root:
cd backend  && npm install
cd ../frontend && npm install
```

Or use the VS Code task: **Terminal → Run Task → Install All Dependencies**

### Step 2 — Configure environment variables

**Backend** — create `backend/.env` (copy from `backend/.env.example`):
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/expense-tracker
JWT_SECRET=any_long_random_string_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend** — create `frontend/.env.local` (copy from `frontend/.env.example`):
```env
VITE_API_URL=http://localhost:5001/api
```

### Step 3 — Start

| Service | URL | Command |
|---|---|---|
| Frontend | http://localhost:5173 | `cd frontend && npm run dev` |
| Backend | http://localhost:5001 | `cd backend && npm run dev` |

---

## VS Code Features

| Feature | How to use |
|---|---|
| **Run both servers** | `Cmd/Ctrl+Shift+B` |
| **Run backend only** | Terminal → Run Task → Start Backend |
| **Run frontend only** | Terminal → Run Task → Start Frontend |
| **Debug backend** | F5 → "Launch Backend" (uses `.env` automatically) |
| **Recommended extensions** | VS Code will prompt to install on first open |

---

## Project Structure

```
expense-tracker/
├── FinTrack.code-workspace   ← Open this in VS Code
├── .gitignore
│
├── backend/
│   ├── .env.example          ← Copy → .env
│   ├── .gitignore
│   ├── render.yaml           ← Render deployment config
│   ├── server.js             ← Entry point
│   └── src/
│       ├── app.js            ← Express + CORS
│       ├── controllers/      ← Route handlers + AI insights
│       ├── middleware/       ← Auth + error handling
│       ├── models/           ← Mongoose schemas
│       └── routes/           ← API routes
│
└── frontend/
    ├── .env.example          ← Copy → .env.local
    ├── .gitignore
    ├── vercel.json           ← Vercel deployment config
    ├── vite.config.js        ← Optimized build + dev proxy
    ├── tailwind.config.js
    └── src/
        ├── components/
        │   ├── charts/       ← Recharts wrappers
        │   ├── insights/     ← AI Insights panel
        │   ├── layout/       ← Sidebar, Header, MobileNav
        │   ├── transactions/ ← TransactionCard, TransactionForm
        │   └── ui/           ← Card, Button, Input, Modal, Skeleton
        ├── context/          ← AuthContext, ThemeContext, ExpenseContext
        ├── hooks/            ← Custom hooks
        ├── layouts/          ← AppLayout
        ├── pages/            ← Dashboard, Transactions, Analytics, Settings
        ├── services/         ← Axios API service
        └── utils/            ← Helpers (formatCurrency, etc.)
```

---

## Features

- 🤖 **AI Financial Insights** — spending patterns, overspend detection, 50/30/20 budget rule, month-end forecast
- 💳 **Expense & Income tracking** — categories, search, date filters, pagination
- 📊 **Analytics** — bar charts, donut chart, spending trend (Recharts)
- 🌓 **Dark / Light mode** — full theme toggle with persistent preference
- 🔐 **JWT Auth** — register, login, protected routes
- 📱 **Fully responsive** — floating mobile nav, collapsible sidebar
- 🚀 **Production-ready** — Vercel + Render deployment configs included

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full step-by-step instructions (MongoDB Atlas → Render → Vercel).

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/expenses` | List transactions (paginated) |
| POST | `/api/expenses` | Create transaction |
| PUT | `/api/expenses/:id` | Update transaction |
| DELETE | `/api/expenses/:id` | Delete transaction |
| GET | `/api/expenses/stats/summary` | Total income/expense/balance |
| GET | `/api/expenses/stats/monthly` | Monthly breakdown |
| GET | `/api/expenses/stats/category` | Category breakdown |
| GET | `/api/expenses/stats/trend` | 30-day spending trend |
| GET | `/api/expenses/stats/insights` | **AI-powered insights** |
