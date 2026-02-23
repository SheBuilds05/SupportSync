import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import "./App.css"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; 
import SupportDashboard from "./pages/SupportDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import UserDashboard from "./pages/UserDashboard";
import UserTickets from "./pages/UserTickets";
import UserSettings from "./pages/UserSettings";
import MyTickets from "./pages/MyTickets";
import Settings from "./pages/Settings";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Initializing...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Public route component
const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Initializing...</div>;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'support') return <Navigate to="/support-dashboard" replace />;
    return <Navigate to="/user-dashboard" replace />;
  }
  return children;
};

const DashboardSelector = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  if (user?.role === 'support') return <Navigate to="/support-dashboard" replace />;
  return <Navigate to="/user-dashboard" replace />;
};

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const backendUrl = "https://supportsync-ujib.onrender.com";
    
    fetch(`${backendUrl}/test-db`)
      .then((res) => res.json())
      .then(() => setConnected(true))
      .catch(() => setConnected(false));
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
    return <div className="flex items-center justify-center min-h-screen text-red-600 font-bold bg-[#001f54]">Backend connection failed ❌</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><DashboardSelector /></ProtectedRoute>} />

      <Route path="/admin-dashboard" element={<ProtectedRoute>{user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />}</ProtectedRoute>} />
      <Route path="/support-dashboard" element={<ProtectedRoute>{user?.role === 'support' ? <SupportDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}</ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute>{user?.role === 'support' ? <Analytics user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}</ProtectedRoute>} />
      <Route 
        path="/my-tickets" 
        element={
          <ProtectedRoute>
            <MyTickets user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      <Route path="/user-dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="my-tickets" element={<UserTickets />} />
        <Route path="settings" element={<UserSettings />} />
      </Route>

      <Route path="/profile" element={<ProtectedRoute><Profile user={user} onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
