import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SupportDashboard from "./pages/SupportDashboard";
import MyTickets from "./pages/MyTickets";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public route component - only accessible when NOT logged in
const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (user) {
    // If user is logged in, redirect to appropriate dashboard
    if (user.role === 'support') {
      return <Navigate to="/support-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Role-based dashboard selector
const DashboardSelector = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect support agents to support dashboard
  if (user.role === 'support') {
    return <Navigate to="/support-dashboard" replace />;
  }
  
  // Regular users go to regular dashboard
  return <Dashboard />;
};

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [connected, setConnected] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:5000/test-db")
      .then((res) => res.json())
      .then((data) => {
        setMessage(
          data.collections
            ? "Connected ✅ Collections: " + data.collections.join(", ")
            : "Connected ✅ but no collections found"
        );
        setConnected(true);
      })
      .catch((err) => {
        console.error("Error:", err);
        setMessage("Connection failed ❌");
        setConnected(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading while checking backend connection
  if (connected === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (connected === false) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{message}</div>;
  }

  // Show loading while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes - only accessible when NOT logged in */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Root route - redirects to appropriate dashboard based on role */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardSelector />
        </ProtectedRoute>
      } />
      
      {/* Dashboard route - only for regular users */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {user?.role === 'support' ? <Navigate to="/support-dashboard" replace /> : <Dashboard />}
          </ProtectedRoute>
        } 
      />
      
      {/* Support Dashboard route - only for support agents */}
      <Route 
        path="/support-dashboard" 
        element={
          <ProtectedRoute>
            {user?.role === 'support' ? <SupportDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />}
          </ProtectedRoute>
        } 
      />
      
      {/* Analytics route - only for support agents */}
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            {user?.role === 'support' ? <Analytics user={user} onLogout={handleLogout} /> : <Navigate to="/dashboard" replace />}
          </ProtectedRoute>
        } 
      />
      
      {/* Other protected routes */}
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
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all - redirect to root which handles role-based routing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;