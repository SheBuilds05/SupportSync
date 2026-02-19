import { FormEvent, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams(); // Grabs the token from the URL link
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Create New Password
        </h1>

        {message && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#82AFE5] focus:border-[#82AFE5]"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#82AFE5] focus:border-[#82AFE5]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#82AFE5' }}
            className="w-full flex justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-[#82AFE5] hover:underline">
            Cancel and go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;