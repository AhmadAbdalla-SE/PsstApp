# 🤫 Psst API

> **Say it anonymously.** A REST API for anonymous messaging — with a consent-based flow that lets a recipient *ask* an anonymous sender to reveal themselves, and open a private conversation only if the sender agrees.

[![Node.js](https://img.shields.io/badge/Node.js-24.12-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Redis](https://img.shields.io/badge/Redis-6.3-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](#-license)
[![Stars](https://img.shields.io/github/stars/AhmadAbdalla-SE/PsstApp?style=social)](https://github.com/AhmadAbdalla-SE/PsstApp)

---

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 💡 About

### What it does

**Psst** is a backend API for anonymous messaging. Every registered user gets a shareable
link. Anyone — signed in or not — can send them a message without revealing who they are.

Where Psst differs from a plain anonymous-message board is what happens next:

1. A recipient reads an anonymous message and wants to know who sent it.
2. They send a **reveal request**.
3. The original sender gets to **accept or reject** it.
4. On accept, the API opens a **private two-person conversation** between them — and only then
   is the identity shared.

Anonymity is the default, and it is only ever lifted by the sender's own explicit consent.

### The problem it solves

Anonymous feedback apps have a structural flaw: anonymity is permanent and absolute. A piece of
honest feedback arrives, the recipient wants to talk about it, and there is no way to continue the
conversation without breaking anonymity unilaterally — or abandoning it entirely.

Psst makes the reveal a **negotiated, two-sided action**. The sender keeps control of their
identity at every step, and the recipient gets a legitimate path to a real conversation.

### Who it's for

- 🧑‍💻 **Frontend / mobile developers** who need a complete, documented auth + messaging backend
- 🏢 **Teams** wanting anonymous internal feedback that can escalate into a real discussion
- 🎓 **Backend learners** reading a production-shaped Express 5 codebase: layered architecture,
  JWT rotation, OTP flows, Redis caching, and role-based authorization

### Why it's useful

It is not just the messaging feature. The identity layer is the bulk of the work and is fully
built: email-OTP verification, password reset, optional two-factor login, Google Sign-In,
refresh-token rotation, per-device and global logout, and token revocation backed by Redis.

---

## ✨ Features

### 🔐 Authentication & Identity

- **Email + password signup** with a confirmation OTP delivered by email
- **Email-OTP verification** with TTL expiry, trial counting, and temporary blocking
- **Google Sign-In / Sign-Up** via verified Google ID tokens (`google-auth-library`)
- **Password reset** as a three-step OTP flow: request code → verify code → set new password
- **Optional two-factor login** — enable or disable it per account with an OTP confirmation
- **Brute-force protection** on login: failed attempts counted in Redis, then a timed block

### 🎟️ Token Management

- **Access + refresh token pairs** (JWT), 30 min / 365 days
- **Role-scoped signing keys** — user and admin tokens are signed with different secrets, so a
  user token is not merely under-privileged but cryptographically unverifiable as an admin token
- **Token rotation** endpoint that refuses to issue a new pair while the current access token is
  still comfortably valid
- **Revocation** — a `jti` denylist in Redis, with a TTL matched to the token's own lifetime
- **Logout, two ways** — current device (revoke this `jti`) or everywhere (invalidate by timestamp)
- **Dual auth schemes** — `Bearer <jwt>` and HTTP `Basic` both accepted

### 💬 Messaging & The Reveal Flow

- **Send anonymous messages** to any user by id, with up to 3 image attachments
- **Optional sender identity** — send signed in to allow a future reveal, or fully anonymously
- **Inbox / outbox** with pagination, sorted newest-first, filterable by received / sent / both
- **Reveal requests** — ask who sent a message; one request per message, enforced by a unique index
- **Accept or reject** — the sender decides; a rejection ends it, an acceptance opens a conversation
- **Private conversations** — exactly two participants, created from an accepted request
- **Conversation messages** with text and attachments
- **Strict resource-level authorization** — ownership is part of the database query, not an
  `if` statement after the fetch, so a non-participant gets "not found" rather than a leak that
  the conversation exists at all

### 🛡️ Security & Infrastructure

- **bcrypt** password hashing at cost factor 12
- **AES-256-CBC** encryption with a per-record random IV for stored phone numbers
- **Helmet** security headers and **CORS** configuration
- **Redis-backed rate limiting**, with a stricter limiter on the login route
- **Zod** request validation on body, query, params, and uploaded files
- **Bilingual validation messages** (English / Arabic) selected by request header
- **Centralized error handling** with typed HTTP exception factories
- **Magic-byte file validation** — uploads are checked by actual content (`file-type`), not by the
  client-supplied MIME type or file extension

---

## 🏗️ Architecture

A layered design, one directory per feature:

```
Request
   │
   ▼
┌─────────────────────────────────────────────┐
│  Middleware                                 │
│  helmet → morgan → rateLimit → cors → json  │
└─────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────┐
│  Controller  (Express Router)               │
│  authentication → authorization →           │
│  upload → validation                        │
└─────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────┐
│  Service      business rules, HTTP-agnostic │
└─────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────┐
│  Repository   generic Mongoose operations   │
└─────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────┐
│  Model        Mongoose schemas & indexes    │
└─────────────────────────────────────────────┘
   │
   ▼
MongoDB Atlas  ·  Redis  ·  SMTP
```

Services never touch `req` or `res`. Controllers never touch Mongoose. The repository layer is
model-agnostic and reused by every feature.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 24 (ES Modules) |
| **Framework** | Express.js 5 |
| **Database** | MongoDB Atlas + Mongoose 9 |
| **Cache / Store** | Redis 6 (OTPs, rate limits, token denylist) |
| **Auth** | JSON Web Token (JWT), bcrypt, argon2, Google OAuth 2.0 |
| **Validation** | Zod 4 |
| **Uploads** | Multer 2 (memory storage) + `file-type` magic-byte checks |
| **Email** | Nodemailer over SMTP, dispatched via Node `EventEmitter` |
| **Security** | Helmet, CORS, `express-rate-limit`, AES-256-CBC |
| **Logging** | Morgan |
| **Process Manager** | PM2 |
| **Reverse Proxy** | Nginx |
| **Hosting** | AWS EC2 (Ubuntu) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 24.12.0** (pinned in `package.json` → `engines`)
- A **MongoDB** database (Atlas or local)
- A **Redis** instance
- An **SMTP account** for outbound OTP email
- A **Google Cloud OAuth 2.0 Web Client ID** (only if you want Google Sign-In)

### Installation

```bash
git clone https://github.com/AhmadAbdalla-SE/PsstApp.git
cd PsstApp
npm install
```

Create your environment file — see [Environment Variables](#-environment-variables):

```bash
cp .env.example .env.development
```

### Run

```bash
npm run start:dev    # development, with --watch hot reload
npm run start:prod   # production, clustered via PM2
```

The server listens on `PORT` (default `9000`). Confirm it is up:

```bash
curl http://localhost:3000/
# {"message":"Welcome to BE API"}
```

---

## 🔑 Environment Variables

The config loader reads `.env.${NODE_ENV}` — so `.env.development` or `.env.production`.

| Variable | Description | Example |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `APPLICATION_NAME` | Display name in outgoing email `From` | `Psst` |
| `DB_URI` | MongoDB connection string | `mongodb+srv://…` |
| `REDIS_URI` | Redis connection string | `redis://…` |
| `SALT` | bcrypt cost factor | `12` |
| `ENC_KEY` | AES-256 key — **must be exactly 32 bytes** | `32-char-string` |
| `IV_LENGTH` | AES initialisation-vector length | `16` |
| `ACCESS_USER_TOKEN_SIGNATURE` | JWT secret, user access token | long random string |
| `ACCESS_ADMIN_TOKEN_SIGNATURE` | JWT secret, admin access token | long random string |
| `REFRESH_USER_TOKEN_SIGNATURE` | JWT secret, user refresh token | long random string |
| `REFRESH_ADMIN_TOKEN_SIGNATURE` | JWT secret, admin refresh token | long random string |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token lifetime, seconds | `1800` |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime, seconds | `31536000` |
| `WEB_CLIENT_IDS` | Google OAuth client IDs, comma-separated | `123-abc.apps.googleusercontent.com` |
| `ORIGINS` | Allowed CORS origins, comma-separated | `http://localhost:5173` |
| `APP_EMAIL` | SMTP username / sender address | `you@gmail.com` |
| `APP_PASSWORD` | SMTP password or app password | app password |

---

## 📖 Usage

Every successful response uses the same envelope:

```json
{
  "message": true,
  "status": 200,
  "data": { }
}
```

Every error uses this one:

```json
{
  "error_message": "Validation error",
  "issues": [ { "path": ["body", "email"], "message": "Invalid email format" } ],
  "stack": "…development only…"
}
```

### 1. Create an account

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Ahmad Abdalla",
    "email": "ahmad@example.com",
    "password": "Passw0rd!",
    "confirmPassword": "Passw0rd!",
    "phone": "+201234567890",
    "gender": 0
  }'
```

A 6-digit OTP is emailed to the address. Confirm it:

```bash
curl -X PATCH http://localhost:3000/auth/confirm-email \
  -H "Content-Type: application/json" \
  -d '{ "email": "ahmad@example.com", "otp": "123456" }'
```

### 2. Log in

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "ahmad@example.com", "password": "Passw0rd!" }'
```

```json
{
  "message": true,
  "status": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs…",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs…"
  }
}
```

> 💡 If the account has two-factor login enabled, `data` comes back empty and an OTP is emailed
> instead. Complete the login with `PATCH /auth/confirm-login`.

### 3. Send an anonymous message

No `Authorization` header → fully anonymous, and the sender can never be revealed:

```bash
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{ "receiverId": "6718…", "content": "You handled that meeting really well." }'
```

Send it **with** a token and the sender is recorded but still hidden from the recipient — which is
what makes a later reveal request possible.

With image attachments (up to 3):

```bash
curl -X POST http://localhost:3000/message \
  -H "Authorization: Bearer <access_token>" \
  -F "content=Nice work on the launch" \
  -F "attachments=@./photo.png" \
  -F "receiverId=6718…"
```

### 4. Read your inbox

```bash
curl "http://localhost:3000/message?type=0&page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

`type` — `0` received · `1` sent · `2` both

```json
{
  "message": true,
  "status": 200,
  "data": {
    "count": 23,
    "limit": 10,
    "pages": 3,
    "currentPage": 1,
    "docs": [ { "_id": "…", "content": "…", "receiverId": "…", "createdAt": "…" } ]
  }
}
```

### 5. Ask the sender to reveal themselves

```bash
curl -X POST http://localhost:3000/request \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "messageId": "6718…" }'
```

### 6. As the sender — accept or reject

List requests addressed to you, then decide:

```bash
curl -X PATCH http://localhost:3000/request/<requestId> \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "status": 1 }'
```

`status` — `1` accept · `0` reject

Accepting returns the newly created conversation. Both users can now talk:

```bash
curl -X POST http://localhost:3000/conversation/<conversationId>/message \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{ "content": "Thanks for reaching out!" }'
```

---

## 📡 API Reference

Base URL: `http://localhost:3000`
Authenticated routes require `Authorization: Bearer <access_token>`.

### Authentication — `/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | — | Register and trigger a confirmation OTP |
| `PATCH` | `/auth/confirm-email` | — | Verify the signup OTP |
| `PATCH` | `/auth/resend-confirm-email` | — | Re-send the confirmation OTP |
| `POST` | `/auth/login` | — | Log in; returns a token pair, or triggers a 2FA OTP |
| `PATCH` | `/auth/confirm-login` | — | Complete a two-factor login |
| `POST` | `/auth/signup-with-gmail` | — | Sign up / log in with a Google ID token |
| `POST` | `/auth/request-forgot-password-code` | — | Email a password-reset OTP |
| `POST` | `/auth/verify-forgot-password` | — | Verify the reset OTP |
| `PATCH` | `/auth/reset-forgot-password` | — | Set a new password with a valid OTP |

### User — `/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/user` | Access | Get the signed-in user's profile |
| `PATCH` | `/user` | Access | Update the profile |
| `PATCH` | `/user/profile-image` | Access | Upload a profile image (`attachment`) |
| `POST` | `/user/rotate-token` | **Refresh** | Exchange a refresh token for a fresh pair |
| `POST` | `/user/logout` | Access | Log out — this device or everywhere |
| `PATCH` | `/user/request-2fa` | Access | Email an OTP to toggle two-factor login |
| `PATCH` | `/user/verify-2fa` | Access | Confirm the toggle with the OTP |

### Messages — `/message`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/message` | Optional | Send an anonymous message (+ up to 3 attachments) |
| `GET` | `/message` | Access | Paginated inbox / outbox |
| `GET` | `/message/:messageId` | Access | Read one received message |
| `DELETE` | `/message/:messageId` | Access | Delete one received message |

### Reveal Requests — `/request`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/request` | Access | Ask a message's sender to reveal themselves |
| `GET` | `/request` | Access | List reveal requests awaiting your decision |
| `PATCH` | `/request/:requestId` | Access | Accept (`1`) or reject (`0`) a request |

### Conversations — `/conversation`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/conversation` | Access | Paginated list of your conversations |
| `POST` | `/conversation/:conversationId/message` | Access | Send a message in a conversation |
| `GET` | `/conversation/:conversationId/message` | Access | Read a conversation's messages |

### Enum Reference

Numeric enums are sent and returned as numbers.

| Enum | Values |
|---|---|
| `gender` | `0` male · `1` female |
| `role` | `0` user · `1` admin |
| `provider` | `0` system · `1` google |
| `loginType` | `0` regular · `1` two-step |
| `request.status` | `0` rejected · `1` accepted · `2` pending |
| `logout.action` | `0` this device · `1` everywhere |
| `accept-language` header | `0` Arabic · `1` English |

### Status Codes

| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Validation error / malformed request |
| `401` | Missing, invalid, or revoked token |
| `403` | Authenticated but not permitted |
| `404` | Not found, or not yours |
| `409` | Conflict — duplicate email, bad OTP, premature token rotation |
| `429` | Rate limit exceeded |
| `500` | Server error |

---

## ☁️ Deployment

Running on **AWS EC2 (Ubuntu)** behind **Nginx**, with **PM2** in cluster mode.

<details>
<summary><strong>Deployment steps</strong></summary>

```bash
# 1 — System
sudo apt update && sudo apt upgrade -y

# 2 — Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# 3 — Clone and install
git clone https://github.com/AhmadAbdalla-SE/PsstApp.git
cd PsstApp
npm install

# 4 — Environment (never commit this file)
nano .env.production

# 5 — Start under PM2
npm i -g pm2
pm2 start src/main.js -i 0
pm2 save && pm2 startup

# 6 — Nginx
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/default
sudo nginx -t && sudo systemctl restart nginx
```

Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade            $http_upgrade;
        proxy_set_header Connection         'upgrade';
        proxy_set_header Host               $host;
        proxy_set_header X-Real-IP          $remote_addr;
        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto  $scheme;
        proxy_cache_bypass                  $http_upgrade;
    }
}
```

> ⚠️ The `X-Forwarded-*` headers matter. The app sets `trust proxy`, and without them every
> request appears to originate from `127.0.0.1`, which breaks per-IP rate limiting and any
> geo-based logic.

**Security group** — allow `80` and `443` from anywhere, and restrict `22` to your own IP.

</details>

---

## 📁 Project Structure

```
src/
├── main.js                    # App entry: middleware chain and route mounting
├── config.js                  # Typed environment access
│
├── DB/
│   ├── connection.db.js       # Mongo connect, index sync, server start
│   ├── redis.connection.js    # Redis client
│   └── model/                 # Mongoose schemas
│       ├── user.model.js
│       ├── message.model.js
│       ├── request.model.js
│       ├── conversation.model.js
│       └── conversation.message.model.js
│
├── middleware/
│   ├── authentication.middleware.js  # Bearer / Basic auth + role authorization
│   ├── validation.middleware.js      # Zod validation factory
│   ├── multer.middleware.js          # Upload orchestration
│   └── error.middleware.js           # Global error handler
│
├── common/
│   ├── enum/                  # Shared numeric enums
│   ├── exceptions/            # Typed HTTP exception factories
│   ├── repository/            # Generic Mongoose data access
│   ├── security/              # hash · encryption · token · otp
│   ├── services/              # Redis cache service
│   ├── utils/                 # email · multer · limiter · responses
│   └── validation.js          # Reusable Zod field validators
│
└── modules/                   # One folder per feature
    ├── authentication/        # controller · service · validation
    ├── user/
    ├── message/
    ├── request/
    └── conversation/
```

Each module exposes `*.controller.js` (routing), `*.service.js` (business rules), and
`*.validation.js` (Zod schemas), re-exported through an `index.js` barrel.

---

## 🗺️ Roadmap

- [ ] Automated test suite (Jest + Supertest)
- [ ] OpenAPI / Swagger specification
- [ ] Real-time conversation delivery over WebSockets
- [ ] Cursor-based pagination for conversation messages
- [ ] Move uploads to S3 or Cloudinary instead of local disk
- [ ] Message reporting and blocking
- [ ] CI pipeline and Docker image
- [ ] HTTPS with a custom domain and Let's Encrypt

---

## 📄 License

Released under the **ISC License** — see `package.json`.

---

<div align="center">

Built by **[Ahmad Abdalla](https://github.com/AhmadAbdalla-SE)**

⭐ Star the repo if you find it useful

</div>
