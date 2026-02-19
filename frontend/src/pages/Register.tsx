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
    <div className="min-h-screen w-full flex items-center justify-center bg-mesh p-4">
      {/* The Glass Container */}
      <div className="glass w-full max-w-lg p-8 rounded-3xl text-white">
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold tracking-tighter mb-2 text-[#82AFE5]">SS</div>
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="text-sm text-blue-100 opacity-70">Join the SupportSync team</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 text-red-100 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1 opacity-80">Full Name</label>
              <input 
                type="text" required
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-2 outline-none focus:border-[#82AFE5] transition-all"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1 opacity-80">Email</label>
              <input 
                type="email" required
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-2 outline-none focus:border-[#82AFE5] transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest mb-1 opacity-80">Password</label>
            <input 
              type="password" required minLength={6}
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-2 outline-none focus:border-[#82AFE5] transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest mb-1 opacity-80">Role</label>
            <select 
              className="w-full bg-[#1B314C] bg-opacity-50 border border-white border-opacity-20 rounded-xl px-4 py-2 outline-none focus:border-[#82AFE5] transition-all text-white"
              value={role} onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="user" className="bg-[#1B314C]">User</option>
              <option value="support" className="bg-[#1B314C]">Support Agent</option>
              <option value="admin" className="bg-[#1B314C]">Administrator</option>
            </select>
          </div>

          {role === 'admin' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs uppercase tracking-widest mb-1 text-[#82AFE5]">Admin Secret Code</label>
              <input 
                type="text" required
                placeholder="Enter secret code"
                className="w-full bg-white bg-opacity-20 border border-[#82AFE5] border-opacity-50 rounded-xl px-4 py-2 outline-none text-white placeholder-blue-200"
                value={adminCode} onChange={(e) => setAdminCode(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-[#82AFE5] hover:bg-blue-300 text-[#1B314C] font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register Now"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <span className="opacity-70">Already have an account? </span>
          <Link to="/login" className="text-[#82AFE5] font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;