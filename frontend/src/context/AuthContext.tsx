import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Role = "user" | "support";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// In dev, use relative /api so Vite proxy forwards to backend (no CORS). For production, set VITE_API_BASE_URL in env.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api"; 

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check both possible key names for backward compatibility
    const storedToken = localStorage.getItem("auth_token") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("auth_user") || localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Standardize to auth_ keys for consistency
        if (!localStorage.getItem("auth_token")) {
          localStorage.setItem("auth_token", storedToken);
        }
        if (!localStorage.getItem("auth_user")) {
          localStorage.setItem("auth_user", storedUser);
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    console.log("Attempting login at:", `${API_BASE}/auth/login`);
    
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Login failed");
    }

    const data = await res.json();
    console.log("Login successful, token received:", data.token ? "Yes" : "No");
    
    // Store in both formats for compatibility
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  async function register(name: string, email: string, password: string, role: Role) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Registration failed");
    }

    const data = await res.json();
    console.log("Registration successful, token received:", data.token ? "Yes" : "No");
    
    // Store in both formats for compatibility
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}