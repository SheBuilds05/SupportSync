import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "support" | "admin">("user");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password, role, adminCode);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="shape shape-z"></div>
      <div className="shape shape-sphere"></div>
      <div className="shape shape-five">5</div>
      <div className="shape shape-glow"></div>
      <div className="shape shape-snake"></div>
      <div className="shape shape-ring"></div>
      <div className="shape shape-triangle"></div>
      <div className="shape shape-squiggle"></div>
      <div className="shape shape-pill"></div>

      <div className="glass-card max-w-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
               <span className="text-2xl font-black text-white italic">SS</span>
             </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-white/50 text-sm mt-1">Join the SupportSync team</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500 bg-opacity-20 border border-red-500/30 text-red-100 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold ml-1">Full Name</label>
              <input 
                type="text" required
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-400 mt-1"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold ml-1">Email</label>
              <input 
                type="email" required
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-400 mt-1"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold ml-1">Password</label>
            <input 
              type="password" required minLength={6}
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-400 mt-1"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold ml-1">Role</label>
            <select 
              className="w-full bg-[#0b1b36] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-400 mt-1"
              value={role} onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="user">User</option>
              <option value="support">Support Agent</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {role === 'admin' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] uppercase tracking-widest text-blue-400 font-bold ml-1">Admin Secret Code</label>
              <input 
                type="text" required
                placeholder="Enter secret code"
                className="w-full bg-white/10 border border-blue-400/50 p-3 rounded-xl text-white mt-1"
                value={adminCode} onChange={(e) => setAdminCode(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? "Creating account..." : "Register Now"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/50">
          Already have an account? 
          <Link to="/login" className="text-blue-400 font-bold hover:underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
