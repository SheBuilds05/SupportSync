import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/Layout";

// Page Imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; 
import Dashboard from "./pages/Dashboard";
import SupportDashboard from "./pages/SupportDashboard";
import AdminDashboard from "./pages/AdminDashboard"; // Added this import
import MyTickets from "./pages/MyTickets";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import UserDashboard from "./pages/UserDashboard";
import UserTickets from "./pages/UserTickets";
import UserSettings from "./pages/UserSettings";

// 1. Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Auth...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// 2. Public route component (Login/Register/Forgot Pass)
const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Auth...</div>;
  if (user) {
    // Redirect logic updated for Admin
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'support') return <Navigate to="/support-dashboard" replace />;
    return <Navigate to="/user-dashboard" replace />;
  }
  return children;
};

// 3. Role-based dashboard selector for the "/" path
const DashboardSelector = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  if (user?.role === 'support') return <Navigate to="/support-dashboard" replace />;
  return <Navigate to="/user-dashboard" replace />;
};

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [connected, setConnected] = useState<boolean | null>(null);
  const [dbMessage, setDbMessage] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:5000/test-db")
      .then((res) => res.json())
      .then((data) => {
        setDbMessage(data.collections ? "Connected ✅" : "No collections found");
        setConnected(true);
      })
      .catch((err) => {
        setDbMessage("Backend connection failed ❌");
        setConnected(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (connected === false) {
    return <div className="flex items-center justify-center min-h-screen text-red-600 font-bold">{dbMessage}</div>;
  }

  if (connected === null || loading) {
    return <div className="flex items-center justify-center min-h-screen">Initializing SupportSync...</div>;
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      {/* ROOT REDIRECT */}
      <Route path="/" element={<ProtectedRoute><DashboardSelector /></ProtectedRoute>} />

      {/* ADMIN ROUTE */}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />}
          </ProtectedRoute>
        } 
      />

      {/* SUPPORT AGENT ROUTES */}
      <Route path="/support-dashboard" element={
        <ProtectedRoute>
          {user?.role === 'support' ? <SupportDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          {user?.role === 'support' ? <Analytics user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        </ProtectedRoute>
      } />

      {/* USER ROUTES (WITH SHARED LAYOUT) */}
      <Route path="/user-dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="my-tickets" element={<UserTickets />} />
        <Route path="settings" element={<UserSettings />} />
      </Route>

      {/* MISC PROTECTED ROUTES */}
      <Route path="/profile" element={<ProtectedRoute><Profile user={user} onLogout={handleLogout} /></ProtectedRoute>} />
      
      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// MAIN APP COMPONENT
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}