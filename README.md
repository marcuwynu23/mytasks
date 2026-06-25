# Task Management

A full-stack task management application built with React, Express.js, and MongoDB.

## Features

- JWT authentication (login, logout, protected routes)
- Dashboard with task stats (total, completed, pending)
- Full task CRUD (create, view, update, delete, mark completed)
- User profile

## Tech Stack

| Layer    | Technologies                                      |
|----------|---------------------------------------------------|
| Frontend | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router DOM |
| Backend  | Node.js, Express.js, JWT, bcryptjs                |
| Database | MongoDB, Mongoose                                 |
| Testing  | Jest, Supertest, mongodb-memory-server            |
| Infra    | Docker / Podman, Nginx, pnpm                      |

## Application Screens

Login · Dashboard · Tasks · Profile

---

## Getting Started

### Prerequisites

- Node.js 20+, pnpm, MongoDB (or Docker / Podman)

---

## Docker / Podman Compose

The fastest way to run the full stack.

```bash
# clone
git clone <repository-url>
cd task-management

# copy and edit backend env
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/task-management
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

Then start all services:

```bash
# Docker
docker compose -f docker-compose.dev.yml up --build

# Podman
podman compose -f docker-compose.dev.yml up --build
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |
| MongoDB  | localhost:27017       |

Stop and remove containers:

```bash
docker compose -f docker-compose.dev.yml down

# include volumes (wipes DB data)
docker compose -f docker-compose.dev.yml down -v
```

---

## Manual Setup

### Backend

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

```bash
cd backend && pnpm test
cd frontend && pnpm test
```

---

## Assumptions

- Users can only access their own tasks
- Authentication required for all protected resources
- Passwords are hashed with bcrypt

## Author

Mark Wayne Menorca
