# RateValve — API Rate Limiting & Usage Analytics Platform

A **backend-first full-stack project** that demonstrates how modern APIs protect themselves from abuse using rate limiting, API keys, and usage analytics. The project focuses on core backend engineering concepts and common system design patterns used in real-world API platforms.

---
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

![API%20Security](https://img.shields.io/badge/Security-API-blueviolet)
![Rate%20Limiting](https://img.shields.io/badge/System-Rate%20Limiting-critical)
---
## Project Overview

RateValve simulates API infrastructure similar to platforms such as Stripe, GitHub, and Cloudflare. Unlike typical demo projects that stop at authentication or basic CRUD operations, RateValve focuses on request control, observability, and usage enforcement.

It implements:

- Traffic control through request throttling  
- Abuse prevention using a **token bucket rate limiting algorithm**  
- Request-level usage tracking and analytics  
- Admin-level visibility into platform usage  

---

## Features

### Authentication & Access Control
- JWT-based user authentication (signup/login)
- Automatic API key generation per user
- Role-based access control (USER / ADMIN)
- Secure API access via `x-api-key` header

### Rate Limiting Engine
- Custom Token Bucket implementation (no third-party rate limiting libraries)
- Configurable limit: 10 requests per minute per API key
- Per-key bucket isolation
- Proper HTTP 429 responses for throttled requests

### Request Analytics
Every API request is logged and used to derive analytics such as:
- Total requests served
- Allowed vs blocked request counts
- Per-endpoint usage statistics
- Per-user API consumption
- Time-based usage trends (last 7 days)

Analytics are derived from raw request logs using database queries rather than stored counters.

### User Dashboard
- View and copy API key
- Basic API usage guide
- Trigger protected API requests
- View live API responses

### Admin Dashboard
- Platform-wide request statistics
- Endpoint-level usage breakdown
- Per-user traffic analysis
- Visibility into allowed vs blocked requests

---

## Tech Stack

### Backend
- Runtime: Node.js
- Framework: Express.js
- Database: PostgreSQL (Neon)
- Authentication: JWT (JSON Web Tokens)
- Security: Custom API key generation and validation
- Rate Limiting: Custom Token Bucket algorithm

### Frontend
- Framework: React (Vite)
- UI Components: ShadCN UI
- Animations: Framer Motion (minimal usage)
- HTTP Client: Axios

---

## Getting Started

### Prerequisites
```bash
Node.js >= 18.x
PostgreSQL (or Neon account)
npm or yarn
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/shamanth74/RateValve.git
cd ratevalve
```

2. **Backend setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL and JWT_SECRET
npm run migrate
npm run dev
```

3. **Frontend setup**
```bash
cd frontend
npm install
cp .env.example .env
# Configure VITE_API_URL
npm run dev
```

---

## API Usage

### Protected Endpoint Example
```http
GET /api/data
x-api-key: YOUR_API_KEY
```

**Success Response (200 OK):**
```json
{
  "message": "API request successful",
  "data": {
    "info": "This is protected API data"
  }
}
```

**Rate Limit Exceeded (429 Too Many Requests):**
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 45
}
```

**Invalid API Key (401 Unauthorized):**
```json
{
  "error": "Invalid or missing API key"
}
```

---

## Project Structure
```
ratevalve/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, rate limiting, request logging
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Helper utilities
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Route components
│   │   ├── components/    # Reusable UI components
│   │   ├── api/           # API client layer
│   │   ├── lib/           # Utilities
│   │   └── ui/            # ShadCN UI components
│   └── public/
│
└── README.md
```

---

## Design Notes

- Backend-first design with emphasis on request flow and correctness
- Clear separation between authentication, rate limiting, logging, and business logic
- Request-level logging instead of aggregate counters for better observability
- Focus on simplicity and explainability over over-engineering

---

## Key Learnings

This project demonstrates understanding of:

- Rate limiting algorithms and request throttling
- API authentication using JWT and API keys
- Middleware-based backend architecture
- Database-backed analytics and aggregation
- Designing systems that are easy to reason about and explain

---

## Limitations

- Rate limiting state is stored in-memory and suitable for a single-node deployment
- Horizontal scaling would require moving bucket state to a shared store (e.g., Redis)
- Analytics queries are optimized for low-to-moderate traffic volumes

---

## Future Enhancements

Planned but not implemented:

- Tiered rate limits (free vs paid plans)
- Dynamic admin-configurable limits
- Temporary API key suspension
- Email usage reports and alerts
- Endpoint-level access control
- Emergency API-wide shutdown toggle

---

## Project Status

**Version 1.0**  
✅ Core features complete  
✅ Tested and documented  
✅ Ready for resume and interview discussion  

---

## Author

**Shamanth M**  
GitHub: https://github.com/shamanth74  
LinkedIn: https://www.linkedin.com/in/shamanth-m-b38547307/

---

## Acknowledgments

Inspired by real-world API platforms such as Stripe, GitHub, and Cloudflare.  
Built as a portfolio project to demonstrate backend engineering fundamentals.
