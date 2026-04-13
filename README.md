# RateValve — API Gateway with Rate Limiting, Tiered Access & Admin Controls

A **backend-focused full-stack system** that implements core API infrastructure patterns: tier-based rate limiting, user blocking, admin management, and real-time usage analytics. Built to demonstrate the kind of request control and observability found in production API platforms like Stripe, GitHub, and Cloudflare.

---

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-5.x-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Rate Limiting](https://img.shields.io/badge/Algorithm-Token%20Bucket-critical)

---

## Why This Project?

Most portfolio projects demonstrate CRUD. This one demonstrates **infrastructure** — the middleware, algorithms, and admin tooling that sit between a client and your API. Every backend engineer should understand how rate limiting, access tiers, and abuse prevention work at the system level.

---

## Architecture

```
Client Request
    │
    ▼
┌─────────────────────────────────────────────────┐
│                  Express Gateway                 │
│                                                  │
│  ┌──────────┐  ┌───────┐  ┌────────┐  ┌──────┐ │
│  │ API Key  │→ │ Block │→ │  Log   │→ │ Rate │ │
│  │  Auth    │  │ Check │  │Request │  │Limit │ │
│  └──────────┘  └───────┘  └────────┘  └──────┘ │
│       │            │           │          │      │
│   Validate     Reject if   Write to    Token    │
│   key + load   is_blocked  request_    Bucket   │
│   user tier    (HTTP 403)  logs table  (tier-   │
│                                        aware)   │
└─────────────────────────────────────────────────┘
    │
    ▼
  Controller → Response (200 / 403 / 429)
```

---

## Features

### 🔐 Authentication & Access Control
- JWT-based signup/login with role enforcement (USER / ADMIN)
- Automatic API key generation per user (64-char hex)
- Secure API access via `x-api-key` header
- Live profile sync (`GET /api/auth/me`) — dashboard always reflects current state

### ⚡ Tier-Based Rate Limiting
- **Custom Token Bucket algorithm** — no third-party rate limiting libraries
- Two tiers with different limits:

  | Tier | Requests/min | Use Case |
  |------|-------------|----------|
  | FREE | 10 | Default for all new users |
  | PRO  | 50 | Upgraded by admin |

- Per-API-key bucket isolation
- Automatic bucket reset on tier change (new limits apply instantly)
- HTTP 429 with clear messaging for throttled requests

### 🛡️ User Blocking System
- Admin can block/unblock any user
- Block check runs **before** rate limiter (saves compute on abusive users)
- Blocked users receive HTTP 403 with explicit error
- Status syncs live on user dashboard (no stale state)

### 👤 Admin Management APIs
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/admin/users` | List all users with aggregated stats |
| `GET` | `/admin/users/:id` | User detail + request history + analytics |
| `PATCH` | `/admin/users/:id/tier` | Upgrade/downgrade tier |
| `PATCH` | `/admin/users/:id/block` | Block user |
| `PATCH` | `/admin/users/:id/unblock` | Unblock user |

All endpoints protected by JWT + admin role middleware at the router level.

### 📊 Analytics & Observability
Every API request is logged to `request_logs` and used to derive:
- Total requests served (global & per-user)
- Allowed vs blocked (rate-limited) request breakdown
- Per-endpoint usage statistics
- Time-based trends (last 7 days)
- Per-user rate limit hit counts

Analytics are computed from raw logs via SQL aggregations — no pre-computed counters.

### 🖥️ Admin Dashboard
- Platform-wide stats cards (total, allowed, blocked, last 7 days)
- **User Management table** with inline controls:
  - Tier dropdown (FREE ↔ PRO) — changes apply instantly
  - Block/unblock toggle
  - View user detail (modal with full request history)
- Endpoint usage breakdown
- Per-user traffic analysis

### 📱 User Dashboard
- API key display with copy-to-clipboard
- Live tier badge showing current plan & rate limit
- Blocked account alert banner (synced from backend)
- API testing playground with live response display
- Usage guide with curl example

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Node.js 18+ | Event-driven, great for I/O-bound middleware chains |
| Framework | Express.js 5 | Minimal, middleware-first architecture |
| Database | PostgreSQL (Neon) | ACID compliance, `FILTER` clause for analytics |
| Auth | JWT + bcrypt | Stateless auth + secure password hashing |
| Rate Limiting | Custom Token Bucket | No dependencies — full control, interviewable |
| Frontend | React 19 (Vite) | Fast dev server, modern React |
| UI | shadcn/ui + Tailwind v4 | Composable components, consistent design |
| Animations | Framer Motion | Smooth page transitions |
| HTTP Client | Axios | Interceptors for automatic JWT attachment |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18.x
- PostgreSQL (or [Neon](https://neon.tech) account)

### Setup

```bash
# Clone
git clone https://github.com/shamanth74/RateValve.git
cd RateValve

# Backend
cd backend
npm install
# Create .env with DATABASE_URL and JWT_SECRET
npm run dev
# Server auto-runs database migrations on startup

# Frontend (new terminal)
cd frontend
npm install
# Create .env with VITE_API_BASE_URL=http://localhost:5000
npm run dev
```

---

## API Reference

### Authentication
```bash
# Signup
POST /api/auth/signup
{ "email": "user@example.com", "password": "secret123" }

# Login
POST /api/auth/login
{ "email": "user@example.com", "password": "secret123", "role": "USER" }

# Get current profile (live)
GET /api/auth/me
Authorization: Bearer <JWT>
```

### Protected API
```bash
# Send rate-limited API request
GET /api/data
x-api-key: <YOUR_API_KEY>

# 200 → success
# 403 → blocked
# 429 → rate limit exceeded
```

### Admin (requires admin JWT)
```bash
GET    /admin/users              # List all users + stats
GET    /admin/users/:id          # User detail + request logs
PATCH  /admin/users/:id/tier     # { "tier": "PRO" }
PATCH  /admin/users/:id/block    # Block user
PATCH  /admin/users/:id/unblock  # Unblock user
GET    /admin/analytics/usage    # Platform-wide analytics
```

---

## Project Structure

```
RateValve/
├── backend/
│   └── src/
│       ├── config/            # DB connection + auto-migration
│       ├── controllers/       # auth, api, admin, analytics
│       ├── middleware/        # JWT, API key, block, rate limiter, logger
│       ├── models/            # User, log, admin, analytics queries
│       ├── routes/            # Express routers
│       ├── services/          # Token bucket algorithm
│       └── utils/             # API key generator
│
├── frontend/
│   └── src/
│       ├── api/               # Axios client + API functions
│       ├── components/        # Navbar, UserDetailModal, shadcn/ui
│       ├── pages/             # AuthPage, UserDashboard, AdminDashboard
│       └── lib/               # Utilities
│
├── schema.sql                 # Database schema
└── README.md
```

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Token bucket over sliding window** | Allows burst traffic up to bucket capacity, then smoothly throttles. More realistic for API gateways. |
| **Block check before rate limiter** | Blocked users shouldn't consume rate limit tokens or compute. Fail fast. |
| **Separate block middleware** | Single responsibility. Blocking is a policy decision, rate limiting is traffic control. |
| **Bucket reset on tier change** | Without reset, old FREE bucket with 0 tokens would persist even after PRO upgrade. |
| **`PATCH` for block/unblock** | Explicit intent per endpoint vs generic `{ blocked: true }`. Better for audit logging. |
| **SQL aggregations over counters** | Raw logs as source of truth. Aggregations are derived, not stored — more flexible and audit-friendly. |
| **Auto-migration on startup** | Small project — no need for a migration framework. Idempotent `IF NOT EXISTS` checks. |

---

## Known Limitations & Scaling Path

| Current Limitation | Production Solution |
|--------------------|-------------------|
| In-memory token buckets (lost on restart) | Redis-backed buckets with `INCR` + `EXPIRE` |
| Single-server only | Redis shared store enables horizontal scaling |
| Real-time SQL aggregations | Materialized views or pre-computed rollup tables |
| No pagination on admin endpoints | Cursor-based pagination with `LIMIT`/`OFFSET` |
| No audit log for admin actions | Separate `admin_audit_log` table |

---

## Author

**Shamanth M**
- GitHub: [shamanth74](https://github.com/shamanth74)
- LinkedIn: [shamanth-m](https://www.linkedin.com/in/shamanth-m-b38547307/)

---

*Built as a portfolio project to demonstrate backend infrastructure engineering — rate limiting, access control, and admin tooling.*
