# Bugbaar — Bug Tracking System

A production-ready full-stack bug tracking web application built with Node.js (Express) backend and Next.js frontend.

---

## Tech Stack

| Layer     | Technologies                                         |
|-----------|------------------------------------------------------|
| Backend   | Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt |
| Email     | Nodemailer (SMTP)                                    |
| AI Bot    | Google Gemini API                                    |
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS    |
| HTTP      | Axios (with cookie credentials)                      |

---

## Features

- **Authentication** — Register, login, email verification, forgot/reset password (JWT + bcrypt)
- **Bug Reporting** — Create bugs with title, description, severity; track status (OPEN → IN_PROGRESS → RESOLVED)
- **Role-Based Access** — Users manage their own bugs; Admins can view all bugs, update status, and assign bugs
- **Email Notifications** — Sent on registration, bug creation, status updates, and password reset via Nodemailer
- **AI Support Chat** — Gemini-powered chatbot (authenticated users only) with conversation history stored in MongoDB

---

## Project Structure

```
BB/
├── backend/
│   ├── config/          # DB and Gemini configuration
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # JWT auth + role guards
│   ├── models/          # Mongoose schemas (User, Bug, SupportChat)
│   ├── routes/          # Express routers
│   ├── services/        # Email (Nodemailer) + Gemini chat services
│   ├── utils/           # HTML email templates
│   ├── app.js           # Express app setup (CORS, rate limiting, routes)
│   └── server.js        # Entry point (DB connect + HTTP listen)
│
└── frontend/
    ├── app/             # Next.js App Router pages
    │   ├── (auth)/      # login, register, forgot-password
    │   ├── dashboard/   # Stats + recent bugs
    │   ├── bugs/        # Bug list + create form
    │   └── support/     # AI chat interface
    ├── components/      # Reusable UI components
    ├── lib/
    │   ├── api/         # Axios instance
    │   ├── context/     # AuthContext (user state)
    │   ├── hooks/       # useAuth hook
    │   └── types/       # Shared TypeScript types
    └── middleware.ts    # Route protection (cookie check)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- SMTP credentials (e.g., Gmail App Password)
- Google Gemini API key

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
npm run dev            # Starts on http://localhost:5000
```

**Environment variables** (`backend/.env`):

| Variable        | Description                          |
|-----------------|--------------------------------------|
| `PORT`          | Server port (default: 5000)          |
| `MONGO_URI`     | MongoDB connection string            |
| `JWT_SECRET`    | Secret for signing JWTs              |
| `SMTP_HOST`     | SMTP host (e.g., smtp.gmail.com)     |
| `SMTP_PORT`     | SMTP port (e.g., 587)                |
| `SMTP_USER`     | SMTP username / email address        |
| `SMTP_PASS`     | SMTP password / app password         |
| `FRONTEND_URL`  | Frontend origin (e.g., http://localhost:3000) |
| `GEMINI_API_KEY`| Google Gemini API key                |

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # Set NEXT_PUBLIC_API_URL
npm run dev                         # Starts on http://localhost:3000
```

**Environment variables** (`frontend/.env.local`):

| Variable              | Description                              |
|-----------------------|------------------------------------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: http://localhost:5000/api) |

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Path                      | Description              |
|--------|---------------------------|--------------------------|
| POST   | /register                 | Register new user        |
| GET    | /verify-email/:token      | Verify email address     |
| POST   | /login                    | Login + set cookie       |
| POST   | /logout                   | Clear auth cookie        |
| POST   | /forgot-password          | Send reset email         |
| POST   | /reset-password/:token    | Reset password           |

### Bugs (`/api/bugs`) — JWT required
| Method | Path             | Role  | Description               |
|--------|------------------|-------|---------------------------|
| POST   | /                | User  | Create bug                |
| GET    | /my              | User  | Get own bugs              |
| GET    | /                | Admin | Get all bugs              |
| PATCH  | /:id/status      | Admin | Update bug status         |
| PATCH  | /:id/assign      | Admin | Assign bug to user        |

### Support (`/api/support`) — JWT required
| Method | Path     | Description                    |
|--------|----------|--------------------------------|
| POST   | /chat    | Send message to Gemini AI      |
| GET    | /history | Get conversation history       |

---

## Architecture

```
Browser (Next.js)
      │
      │  HTTPS / Axios (withCredentials)
      ▼
Express.js API (Node.js)
      │
      ├── JWT Middleware ──────── Validates token from cookie or Bearer header
      ├── Role Middleware ─────── Guards admin-only routes
      │
      ├── MongoDB (Mongoose) ──── Users, Bugs, SupportChat collections
      ├── Nodemailer ──────────── Transactional emails (SMTP)
      └── Gemini API ──────────── AI chat responses
```

- **Passwords** hashed with bcrypt (salt 12)
- **JWT** expires in 7 days; stored as `httpOnly`, `SameSite=strict` cookie
- **CORS** locked to `FRONTEND_URL`; CSRF mitigated by `SameSite=strict` + Origin header check
- **Rate limiting** on all routes (auth: 20 req/15min; others: 100 req/15min)
- **Input validation** via express-validator on all mutation endpoints