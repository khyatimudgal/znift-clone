# Znift

A keyboard-first task tracker for builders. Log what you just did, see what's pending, never scramble before a standup. *(Reference taken from znift.com)*

## ✨ Features

- **⌘+L** — quick-log a completed task from anywhere
- **⌘+K** — quick-add a new task
- Today / Overdue / Completed views on the dashboard
- Per-day task list with inline edit, due time, due date, priority
- Archive with restore + bulk delete
- Markdown export (great for standup notes)
- Streak tracking
- Global task search with optional archived filter
- JWT auth (httpOnly cookie)

## ✨ Tech Stack

**Frontend:** React 19 · Vite · React Router 7 · Tailwind v4 · shadcn/ui · lucide-react
**Backend:** Express 5 · Mongoose · JWT · bcrypt
**Database:** MongoDB Atlas
**Hosting:** Vercel (frontend) · Render (backend)

## ✨ Roadmap (v2)

- Profile: avatar upload, username/email change
- Light & dark mode toggle
- Email reminders + standup notifications
- Magic link / 2FA auth
