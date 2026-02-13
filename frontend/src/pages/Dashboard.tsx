import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    // This page should normally be wrapped in ProtectedRoute, but we guard anyway
    return null;
  }

  const isSupport = user.role === "support";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">SupportSync Dashboard</h1>
          <p className="text-sm text-gray-500">
            Signed in as {user.name} ({user.role === "support" ? "Support Agent" : "User"})
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200"
        >
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {isSupport ? "All Tickets" : "My Tickets"}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This is where ticket list will go. For now we are focused on authentication.
            </p>
            <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
              <li>
                As a <span className="font-medium">User</span>, you will see only tickets you created.
              </li>
              <li>
                As a <span className="font-medium">Support Agent</span>, you will see all tickets.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Next Steps</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
              <li>Create ticket model & APIs (backend).</li>
              <li>Build ticket list & create-ticket forms (frontend).</li>
              <li>Use roles to filter which tickets are visible.</li>
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

