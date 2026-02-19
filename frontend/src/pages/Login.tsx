import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    /* The main wrapper with the mesh background */
    <div className="min-h-screen w-full flex items-center justify-center bg-mesh p-4">
      
      {/* The "Glass" Container */}
      <div className="glass w-full max-w-md p-8 rounded-3xl text-white">
        
        {/* SupportSync Logo/Title */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold tracking-tighter mb-2">
            <span className="text-[#82AFE5]">S</span>S
          </div>
          <h1 className="text-2xl font-semibold">SupportSync</h1>
          <p className="text-sm text-blue-100 opacity-70">Welcome back! Please login.</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 opacity-80">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-3 outline-none focus:border-[#82AFE5] transition-all placeholder-blue-200"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 opacity-80">Password</label>
            <input 
              type="password" 
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-3 outline-none focus:border-[#82AFE5] transition-all placeholder-blue-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#82AFE5] hover:bg-blue-300 text-[#1B314C] font-bold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="opacity-70">Don't have an account? </span>
          <Link to="/register" className="text-[#82AFE5] font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;