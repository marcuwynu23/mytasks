# Task Management

A full-stack task management application built with React, Express.js, and MongoDB. The application allows users to securely manage their personal tasks through a simple and responsive interface.

## Features

### Authentication

- User login
- User logout
- JWT authentication
- Protected routes

### Dashboard

- Total tasks count
- Completed tasks count
- Pending tasks count

### Task Management

- Create a task
- View all tasks
- Update a task
- Delete a task
- Mark a task as completed

### Profile

- View user information

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router DOM

### Backend

- Express.js
- Node.js
- JWT Authentication

### Database

- MongoDB
- Mongoose

### Testing

- Jest
- React Testing Library

````

## Application Screens

1. Login
2. Dashboard
3. Tasks
4. Profile

## Getting Started

### Prerequisites

- Node.js 20 or later
- MongoDB
- npm

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd task-management
````

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

Start the backend server:

```bash
npm run dev
```

The backend server will run on:

```text
http://localhost:5000
```

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend application:

```bash
npm run dev
```

The frontend application will run on:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

```http
POST /api/auth/login
POST /api/auth/register
GET /api/auth/profile
```

### Tasks

```http
GET /api/tasks
POST /api/tasks
GET /api/tasks/:id
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

## Database Schema

### User

```javascript
{
  name: String,
  email: String,
  password: String
}
```

### Task

```javascript
{
  title: String,
  description: String,
  status: String,
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Running Tests

### Backend

```bash
cd backend
npm run test
```

### Frontend

```bash
cd frontend
npm run test
```

## Assumptions

- Users can only access their own tasks.
- Authentication is required to access protected resources.
- Each task belongs to a single user.
- Passwords are securely hashed before storage.

## Future Improvements

- Task categories
- Task priorities
- Due dates
- Dark mode
- Email notifications
- Drag-and-drop task board

## Author

Mark Wayne Menorca
