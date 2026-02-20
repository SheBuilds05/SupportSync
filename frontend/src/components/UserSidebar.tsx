import { LayoutDashboard, Ticket, Settings, LogOut, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-64 h-screen bg-[#1B314C] text-white flex flex-col p-4 fixed left-0 top-0">
      <div className="text-2xl font-bold mb-10 flex items-center gap-2">
        <span className="text-[#82AFE5]">Support</span>
        <span>Sync</span>
      </div>
      
      <nav className="flex-grow space-y-2">
        <button 
          onClick={() => navigate('/user-dashboard')}
          className="flex items-center gap-3 w-full p-3 rounded-lg bg-[#82AFE5] hover:bg-[#6B96C7] transition"
        >
          <PlusCircle size={20} /> Create Ticket
        </button>
        <button 
          onClick={() => navigate('/user-dashboard/my-tickets')}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#2A405C] transition text-gray-300 hover:text-white"
        >
          <Ticket size={20} /> My Tickets
        </button>
        <button 
          onClick={() => navigate('/user-dashboard/settings')}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#2A405C] transition text-gray-300 hover:text-white"
        >
          <Settings size={20} /> Settings
        </button>
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#2A405C] transition text-gray-300 hover:text-white"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};