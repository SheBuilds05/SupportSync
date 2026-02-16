import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout"; // Import the layout
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard"; // New Ticket
import MyTickets from "./pages/MyTickets"; // View Tickets 
import UserSettings from "./pages/UserSettings"; // Settings 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* dashboard/ - This will show the Create Ticket page by default */}
            <Route index element={<UserDashboard />} />
            
            {/* dashboard/my-tickets */}
            <Route path="my-tickets" element={<MyTickets />} />
            
            {/* dashboard/settings */}
            <Route path="settings" element={<UserSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;