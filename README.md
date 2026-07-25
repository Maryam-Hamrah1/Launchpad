# Launchpad

**Launchpad** is an AI-powered goal tracker that turns any goal into a personalized, day-by-day roadmap. Set a goal and a timeframe, and the AI builds a step-by-step plan — broken into months, then daily missions — so progress always feels achievable instead of overwhelming.

Built as a final project for **Code Weekend**, starting from zero prior web development experience.



## ✨ Features

- **AI Roadmap Generator** — describe a goal, and the AI builds a full roadmap broken into monthly milestones and daily tasks, sized to your available time.
- **Daily Planner** — a calendar view of daily missions, notes, and task completion tracking.
- **AI Coach** — a chat assistant that answers questions about your goal and helps you stay on track.
- **Progress Tracking** — visual charts of completed days, streaks, and overall progress per goal.
- **Streaks** — daily-completion streak tracking to encourage consistency.
- **Resource Library** — curated courses, videos, docs, and project ideas matched to your roadmap, powered by semantic search (embeddings).
- **Notifications** — a live "what needs your attention" panel (drafts waiting, streak reminders, ready milestones).
- **In-app Search** — search across your goals and app pages from the top bar.
- **Multi-account support** — remembers previously used accounts on a device for quick switching, alongside standard sign up / login.
- **Profile & Settings** — editable profile (name, bio), theme toggle (dark/light), and full account deletion.
- **Responsive design** — optimized layouts for phone, tablet, and desktop.



## 🛠 Tech Stack

**Frontend**
- [React](https://react.dev/) (Vite)
- [React Router](https://reactrouter.com/) for routing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for progress charts
- [lucide-react](https://lucide.dev/) for icons
- [Supabase JS](https://supabase.com/docs/reference/javascript) for auth and data

**Backend**
- [Cloudflare Workers](https://workers.cloudflare.com/) — serverless API layer for AI generation and admin actions
- [Supabase](https://supabase.com/) — Postgres database + authentication
- [OpenRouter](https://openrouter.ai/) — AI provider (GPT-4o-mini for roadmap/chat generation, text-embedding-3-small for resource matching)

**Deployment**
- Frontend: Cloudflare Pages
- Backend: Cloudflare Workers



## 📁 Project Structure

```
Launchpad/
├── launchpad-react/          # Frontend (Vite + React)
│   └── src/
│       ├── Pages/            # Route-level pages (Dashboard, Goals, GoalDetails, Planner, AICoach, Resources, Progress, Profile, Settings, ...)
│       ├── components/       # Shared components (Sidebar, Topbar, GoalContext, AuthContext, ...)
│       └── data/             # Static resource data
│
└── launchpad-worker/         # Backend (Cloudflare Worker)
    └── src/
        └── index.js          # API routes: roadmap generation, chat, day/month detail, progress, account deletion
```



## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A [Supabase](https://supabase.com/) project
- An [OpenRouter](https://openrouter.ai/) API key
- A [Cloudflare](https://cloudflare.com/) account (for deployment)

### 1. Frontend setup

```bash
cd launchpad-react
npm install
```

Create a `.env` file in `launchpad-react/`:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Run the dev server:

```bash
npm run dev
```

### 2. Worker setup

```bash
cd launchpad-worker
npm install
```

Set the required secrets:

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put OPENROUTER_API_KEY
```

> `SUPABASE_SERVICE_ROLE_KEY` is required only for account deletion — keep it server-side only, never in the frontend `.env`.

Run locally or deploy:

```bash
npx wrangler dev       # local development
npx wrangler deploy    # deploy to Cloudflare
```

### 3. Deploying the frontend

Push to your connected Git repository, or deploy directly via Cloudflare Pages. Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set as **Environment Variables** in the Cloudflare Pages project settings — `.env` files are not included in deployments.



## 📝 License

This project was built as a personal learning project for Code Weekend.



*Built by Maryam Hamrah.*
