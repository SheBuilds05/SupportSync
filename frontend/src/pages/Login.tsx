import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import your Auth hook

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Get the login function from your context
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use the login function from context instead of a raw 'fetch'
      await login(email, password);
      
      // If successful, the AuthProvider updates and we can navigate
      navigate("/"); 
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      {/* Visual Shapes */}
      <div className="shape shape-z"></div>
      <div className="shape shape-sphere"></div>
      <div className="shape shape-five">5</div>
      <div className="shape shape-glow"></div>
      <div className="shape shape-snake"></div>
      <div className="shape shape-ring"></div>
      <div className="shape shape-triangle"></div>
      <div className="shape shape-squiggle"></div>
      <div className="shape shape-pill"></div>
      
      <div className="glass-card">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-2xl mb-4 rotate-3">
            <span className="text-2xl font-black text-white italic">SS</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SupportSync</h1>
          <p className="text-white/50 text-sm mt-1">Welcome back! Please login.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-100 text-xs text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="text-left">
            <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-400 mt-1 transition-all"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-left">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Password</label>
              <Link to="/forgot-password" px-blue-400 className="text-[10px] text-blue-400 hover:underline">Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-400 mt-1 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 mt-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-white/50">
          Don't have an account? <Link to="/register" className="text-blue-400 font-bold hover:underline ml-1">Register Here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
