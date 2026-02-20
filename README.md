# 🎫 SupportSync - Ticketing System

**Live Demo:**
https://supportsync-frontend.onrender.com

A modern, full-stack ticketing system for IT support teams to manage, track, and resolve internal technical issues efficiently. Built with React, Node.js, and MongoDB.

---

## 📋 Project Overview

SupportSync is a complete ticketing solution designed for IT support teams. It provides a seamless experience for end-users submitting tickets, support agents managing them, and administrators controlling the entire system. Features include role-based access control, real-time status updates, comprehensive analytics, and a beautiful responsive interface.

---

## ✨ Features

### 👥 User Roles

| Role | Capabilities |
|------|--------------|
| **Admin** | Full system control: delete tickets, manage users, view all data, assign to any agent, update status, access analytics |
| **Support Agent** | View all tickets, assign to self, update status, resolve tickets, access analytics dashboard |
| **Regular User** | Create tickets, view own tickets, track status in real-time |

### 🎯 Core Functionality

- **Authentication System**: Secure login/register with JWT token-based authentication
- **Role-Based Access**: Different views and permissions for users, agents, and admins
- **Ticket Management**: Full CRUD operations - Create, Read, Update, Delete (Admin only)
- **Real-Time Status Updates**: Track tickets from Open → In Progress → Resolved
- **Assignment System**: Agents can claim unassigned tickets; Admins can assign to any agent
- **Search & Filter**: Advanced filtering by status, priority, assigned agent, and text search
- **Category Management**: Organize tickets by type (Bug, Feature, UI/UX, Hardware, Network, etc.)

### 📊 Analytics Dashboard (Agents & Admin)

- System-wide ticket statistics with visual indicators
- Priority distribution charts with progress bars
- Category breakdown with color coding
- Agent performance metrics and resolution rates
- Personal agent statistics dashboard
- Recent activity logs with agent filtering
- Unassigned ticket alerts

### 🎨 UI/UX

- Clean, modern interface with Tailwind CSS
- Fully responsive design (mobile, tablet, desktop)
- Dark blue theme (#1B314C) with accent colors (#82AFE5)
- Interactive components with hover effects
- Hamburger menu for mobile navigation
- Real-time notification system
- Profile management with user statistics

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Vite 7, React Router DOM 7, Context API |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, CORS |
| **Deployment** | Render (Frontend + Backend), MongoDB Atlas |

---
## 🔧 Troubleshooting Guide
 
### Common Issues & Solutions
 
#### 1. **Backend Connection Failed / 503 Error**
**Symptoms:**
- App shows "Backend connection failed"
- API requests timeout or return 503
- First load takes very long
 
**Solutions:**
- **Free tier spin-down**: Render free services spin down after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.
- **Add retry logic** in your frontend:
  ```javascript
  const fetchWithRetry = async (url, options = {}, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetch(url, options);
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB)
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/supportsync.git
cd supportsync

# Backend setup
cd backend
npm install
cp .env.example .env  # Add your MongoDB URI and JWT secret
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
