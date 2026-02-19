#live link for the application 
https://supportsync-frontend.onrender.com

# 🎫 SupportSync - Ticketing System

A modern, full-stack ticketing system for IT support teams to manage, track, and resolve internal technical issues efficiently.


## ✨ Features

### 👥 User Roles
- **Regular Users**: Create and track their own support tickets
- **Support Agents**: View all tickets, assign to themselves, update status, and resolve issues

### 🎯 Core Functionality
- **Authentication System**: Secure login/register with JWT
- **Role-Based Access**: Different views and permissions for users and agents
- **Ticket Management**: Create, view, update, and resolve tickets
- **Real-Time Status Updates**: Track tickets from Open → In Progress → Resolved
- **Assignment System**: Agents can claim unassigned tickets
- **Search & Filter**: Find tickets by title, description, status, or priority
- **Category Management**: Organize tickets by type (Bug, Feature, UI/UX, etc.)

### 📊 Analytics Dashboard (Agents Only)
- System-wide ticket statistics
- Priority distribution charts
- Category breakdown
- Agent performance metrics
- Personal agent statistics
- Recent activity logs
- Unassigned ticket alerts

### 🎨 UI/UX
- Clean, modern interface with Tailwind CSS
- Fully responsive design (mobile, tablet, desktop)
- Dark blue theme with accent colors
- Interactive components with hover effects
- Hamburger menu for mobile navigation
- Notification system
- Profile management

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Context API** for state management
- **React Hooks** for component logic

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **CORS** enabled
- **Dotenv** for environment variables
