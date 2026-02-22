import { FormEvent, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
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

      <div className="glass-card text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-2xl mb-4 rotate-3">
            <span className="text-2xl font-black text-white italic">SS</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">New Password</h1>
          <p className="text-white/50 text-sm mt-1">Create a secure password</p>
        </div>

        {message && (
          <div className="mb-6 p-3 rounded-xl bg-green-500 bg-opacity-20 border border-green-500/30 text-green-100 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500 bg-opacity-20 border border-red-500/30 text-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold ml-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-400 mt-1"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/70 font-bold ml-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-400 mt-1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="mt-8">
          <Link to="/login" className="text-sm font-bold text-blue-400 hover:underline">
            Cancel and go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
