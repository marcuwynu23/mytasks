<div align="center">

# MyTasks - Task Management System

A full-stack task management application built with React, Express.js, and MongoDB.

</div>

## Features

- JWT authentication (register, login, logout, protected routes)
- Dashboard with task stats (total, completed, pending)
- Full task CRUD (create, view, update, delete, mark completed)
- Quote of the Day via public API
- User profile

## Tech Stack

| Layer      | Technologies                                                               |
| ---------- | -------------------------------------------------------------------------- |
| Frontend   | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Base UI, Radix UI, React Router DOM, Zustand, Axios, Lucide |
| Backend    | Node.js, Express.js, JWT, bcryptjs, Helmet, Morgan, dotenv                  |
| Validation | Zod                                                                         |
| Database   | MongoDB, Mongoose                                                           |
| Testing    | Vitest, Testing Library, jsdom, Jest, Supertest, mongodb-memory-server      |
| Linting    | ESLint, typescript-eslint, Biome                                            |
| Infra      | Docker / Podman, Nginx, pnpm, esbuild                                       |

## Application Screens

Login · Register · Dashboard · Tasks · Profile

---

## Getting Started

### Prerequisites

- Node.js 20+, pnpm, MongoDB (or Docker / Podman)

---

## Docker / Podman Compose

The fastest way to run the full stack.

Then start all services:

```bash
# Docker
docker compose up --build

# Podman
podman compose up --build
```

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |
| MongoDB  | localhost:27017       |

Stop and remove containers:

```bash
docker compose down

# include volumes (wipes DB data)
docker compose down -v

# Podman
podman compose down
# include volumes (wipes DB data)
docker compose down -v
```

---

## Manual Setup

### Backend

> **Note:** Copy `.env.example` to `.env` and fill in the values before starting.

```bash
cd backend
pnpm install
cp .env.example .env   # fill in values
pnpm dev               # http://localhost:5000
```

### Frontend

```bash
cd frontend
pnpm install
# create .env with: VITE_API_URL=http://localhost:5000/api
pnpm dev               # http://localhost:5173
```

---

## API Endpoints

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/profile
PUT    /api/auth/profile
PUT    /api/auth/password
```

### Tasks

```
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

## Database Schema

```js
User  { firstName, middleName?, lastName, email, password }
Task  { title, description, status, userId, createdAt, updatedAt }
```

---

## Running Tests

### Backend

> **Note:** Make sure `.env` exists (see [backend setup](#backend)) before running tests.

```bash
cd backend && pnpm test
```

### Frontend

```bash
cd frontend && pnpm test
```

---

## Assumptions

- Users can only access their own tasks
- Authentication required for all protected resources
- Passwords are hashed with bcrypt

## Author

Mark Wayne Menorca
