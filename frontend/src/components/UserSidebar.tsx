import { LayoutDashboard, Ticket, Settings, LogOut, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-[#1e293b] text-white flex flex-col p-4 fixed left-0 top-0">
      <div className="text-2xl font-bold mb-10 flex items-center gap-2">
        <span className="text-blue-400">Support</span>Sync
      </div>
      
      <nav className="flex-grow space-y-2">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} /> Create Ticket
        </button>
        <button 
          onClick={() => navigate('/dashboard/my-tickets')}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-700 transition text-slate-300"
        >
          <Ticket size={20} /> My Tickets
        </button>
        <button 
          onClick={() => navigate('/dashboard/settings')}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-700 transition text-slate-300"
        >
          <Settings size={20} /> Settings
        </button>
      </nav>

      <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-900/20 text-red-400 mt-auto">
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};