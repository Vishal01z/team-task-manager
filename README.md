# TaskFlow — Team Task Manager

> A full-stack collaborative task management web application with role-based access control, built for modern engineering teams.

![TaskFlow Banner](https://img.shields.io/badge/TaskFlow-Team%20Task%20Manager-6366f1?style=for-the-badge&logo=task&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Railway](https://img.shields.io/badge/Deployed-Railway-0B0D0E?style=flat-square&logo=railway)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ **Frontend (Live App)** | https://team-task-manager-vishal.vercel.app |
| 🔧 **Backend API** | https://team-task-manager-production-4c65.up.railway.app/api |
| ❤️ **Health Check** | https://team-task-manager-production-4c65.up.railway.app/api/health |
| 📁 **GitHub Repository** | https://github.com/Vishal01z/team-task-manager |

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Role-Based Access](#role-based-access)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## 🎯 Overview

**TaskFlow** is a production-grade Team Task Management application inspired by tools like Trello and Asana. It allows teams to collaborate efficiently by creating projects, assigning tasks, and tracking progress — all with a clean, modern UI and secure role-based access control.

### Problem Solved
Managing team tasks across multiple projects is chaotic without structure. TaskFlow provides:
- Clear ownership of tasks with user assignment
- Role-based control so only admins can create/delete tasks
- Real-time progress tracking via an intelligent dashboard
- Overdue task alerts to keep teams accountable

---

## ✨ Features

### 🔐 Authentication
- Secure signup with name, email, and password
- JWT-based login with 7-day token expiry
- Password hashing using bcryptjs (salt rounds: 10)
- Auto-redirect on token expiry

### 👥 User Roles (Per Project)
- **Admin** — Full control: create projects, add/remove members, create/assign/delete tasks
- **Member** — Limited access: view assigned tasks, update task status only

### 📁 Project Management
- Create projects (creator becomes Admin automatically)
- Add members by email with role selection (Admin/Member)
- Remove members from project
- View all projects you're part of

### ✅ Task Management
- Create tasks with title, description, due date, and priority (Low / Medium / High)
- Assign tasks to any project member
- Update task status: **To Do → In Progress → Done**
- Delete tasks (Admin only)
- Visual status indicators and priority badges

### 📊 Dashboard
- Total projects, tasks, and status breakdown
- Personal task progress with completion percentage
- Team performance table (tasks per member)
- Overdue task alerts with priority indicators
- Role-aware dashboard (Admin view vs Member view)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 (Vite) | UI framework with fast HMR |
| React Router v6 | Client-side routing & protected routes |
| Axios | HTTP client with JWT interceptors |
| Tailwind CSS (CDN) | Utility-first styling |
| Plus Jakarta Sans | Premium Google Font |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | RESTful API server |
| Mongoose | MongoDB ODM with schema validation |
| JWT (jsonwebtoken) | Stateless authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin request handling |
| dotenv | Environment variable management |

### Database & Deployment
| Service | Usage |
|---------|-------|
| MongoDB Atlas | Cloud NoSQL database |
| Railway | Backend hosting with auto-deploy |
| Vercel | Frontend hosting with CDN |
| GitHub | Version control & CI/CD trigger |

---

## 🔐 Role-Based Access Control

```
┌─────────────────────────────────────────────────────────┐
│                    ROLE PERMISSIONS                      │
├─────────────────────────┬───────────┬───────────────────┤
│ Action                  │   Admin   │      Member       │
├─────────────────────────┼───────────┼───────────────────┤
│ Create Project          │    ✅     │        ❌         │
│ View Projects           │    ✅     │        ✅         │
│ Add/Remove Members      │    ✅     │        ❌         │
│ Create Tasks            │    ✅     │        ❌         │
│ Assign Tasks            │    ✅     │        ❌         │
│ Delete Tasks            │    ✅     │        ❌         │
│ Update Own Task Status  │    ✅     │        ✅         │
│ View Dashboard          │    ✅     │   Limited View    │
└─────────────────────────┴───────────┴───────────────────┘
```

---

## 📡 API Documentation

### Authentication
```
POST   /api/auth/signup     → Register new user
POST   /api/auth/login      → Login & get JWT token
GET    /api/auth/me         → Get current user profile
```

### Projects
```
GET    /api/projects               → Get all user's projects
POST   /api/projects               → Create new project (becomes Admin)
GET    /api/projects/:id           → Get project details
POST   /api/projects/:id/members   → Add member (Admin only)
DELETE /api/projects/:id/members/:userId → Remove member (Admin only)
```

### Tasks
```
POST   /api/tasks                        → Create task (Admin only)
GET    /api/tasks/project/:projectId     → Get tasks by project
PUT    /api/tasks/:id                    → Update task
DELETE /api/tasks/:id                    → Delete task (Admin only)
```

### Dashboard
```
GET    /api/dashboard    → Get stats (total tasks, by status, per user, overdue)
```

---

## 🗄️ Database Schema

```
Users Collection
├── _id (ObjectId)
├── name (String, required)
├── email (String, unique, required)
├── password (String, hashed, required)
└── timestamps

Projects Collection
├── _id (ObjectId)
├── name (String, required)
├── description (String)
├── members []
│   ├── user (ref: Users)
│   └── role (enum: admin | member)
└── timestamps

Tasks Collection
├── _id (ObjectId)
├── title (String, required)
├── description (String)
├── project (ref: Projects)
├── assignedTo (ref: Users)
├── createdBy (ref: Users)
├── status (enum: todo | inprogress | done)
├── priority (enum: low | medium | high)
├── dueDate (Date)
└── timestamps
```

---

## 🚀 Local Setup

### Prerequisites
```bash
node -v   # v18 or higher
npm -v    # v9 or higher
```

> MongoDB Atlas free cluster required (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/Vishal01z/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/taskflow
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

```bash
npm run dev
# Server running on http://localhost:5000
# MongoDB Connected ✅
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# App running on http://localhost:5173
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## ☁️ Deployment Guide

### Backend → Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → Login with GitHub
3. New Project → Deploy from GitHub Repo → Select `team-task-manager`
4. Set **Root Directory** → `backend`
5. Add **Environment Variables**:
   ```
   MONGO_URI = mongodb+srv://...
   JWT_SECRET = your_secret_key
   NODE_ENV = production
   ```
6. Railway auto-deploys on every push ✅

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → Login with GitHub
2. New Project → Import `team-task-manager`
3. Set **Root Directory** → `frontend`
4. Add **Environment Variable**:
   ```
   VITE_API_URL = https://your-backend.up.railway.app/api
   ```
5. Click **Deploy** → Live URL generated ✅

---

## 📁 Project Structure

```
team-task-manager/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js      # Signup, Login, Me
│   │   │   ├── projectController.js   # CRUD + member management
│   │   │   ├── taskController.js      # CRUD + role-based access
│   │   │   └── dashboardController.js # Stats aggregation
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # JWT verification
│   │   │   └── roleMiddleware.js      # Admin/Member guard
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── railway.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js               # Axios instance + interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProjectCard.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx          # Admin dashboard
    │   │   ├── MemberDashboard.jsx    # Member-specific view
    │   │   ├── Projects.jsx
    │   │   └── Tasks.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🧪 Test Credentials

You can use these to test the live app:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskflow.com | admin123 |
| Member | member@taskflow.com | member123 |

> Or create your own account via Signup

---

## 🎬 Demo Video

📹 Watch the 3-minute demo: **[Click here to watch](#)**

The demo covers:
- User signup and login
- Creating a project (Admin)
- Adding a team member
- Creating and assigning tasks with priority and due dates
- Member login and task status update
- Dashboard stats and overdue task tracking

---

## 👨‍💻 Author

**Vishal Kumar**
- GitHub: [@Vishal01z](https://github.com/Vishal01z)

---

## 📄 License

This project was built as part of a Full-Stack Engineering Assessment.

---

<div align="center">
  <strong>Built with ❤️ using React, Node.js, Express & MongoDB</strong>
</div>
