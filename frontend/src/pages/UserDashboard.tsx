import { useState, useEffect } from 'react';

interface User {
  name?: string;
  email?: string;
}

interface UserDashboardProps {
  user?: User;
}

interface Ticket {
  _id: string;
  ticketId: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export const UserDashboard = ({ user }: UserDashboardProps) => { 
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // NEW: State for file attachment
  const [attachment, setAttachment] = useState<File | null>(null);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (user?.email) return user;
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        return {
          email: decoded.email || decoded.sub,
          name: decoded.name || decoded.username || decoded.email?.split('@')[0] || 'User'
        };
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
    return { name: 'User', email: '' };
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    priority: 'Medium'
  });

  useEffect(() => {
    if (currentUser.email) {
      fetchUserTickets();
    }
  }, [currentUser.email]);

  const fetchUserTickets = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token || !currentUser?.email) return;
      const response = await fetch(`http://localhost:5000/api/tickets/${currentUser.email}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const sortedTickets = [...data].sort((a: Ticket, b: Ticket) => {
          if ((a as any).createdAt && (b as any).createdAt) {
            return new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime();
          }
          if (a.ticketId && b.ticketId) {
            return b.ticketId.localeCompare(a.ticketId);
          }
          return 0;
        });
        setTickets(sortedTickets.slice(0, 4));
      }
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) {
      setError("No session found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      // NEW: Using FormData to handle file uploads
      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);
      dataToSend.append('description', formData.description);
      dataToSend.append('category', formData.category);
      dataToSend.append('priority', formData.priority);
      dataToSend.append('createdBy', currentUser?.name || "User");
      dataToSend.append('createdByEmail', currentUser?.email || "");
      
      if (attachment) {
        dataToSend.append('attachment', attachment);
      }

      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: {
          // NOTE: Do NOT set Content-Type header when sending FormData; 
          // the browser will set it automatically with the correct boundary.
          "Authorization": `Bearer ${token}` 
        },
        body: dataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Ticket created: " + data.ticketId);
        setFormData({ title: '', description: '', category: 'Other', priority: 'Medium' });
        setAttachment(null); // Clear file input
        fetchUserTickets();
      } else {
        setError(data.message || "Failed to create ticket");
      }
    } catch (err) {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (currentUser.name) return currentUser.name.substring(0, 2).toUpperCase();
    if (currentUser.email) return currentUser.email.substring(0, 2).toUpperCase();
    return "U";
  };

  return (
    <div className="ml-64 p-8 bg-slate-50 min-h-screen"> 
      <div className="flex justify-between items-center mb-8"> 
        <h1 className="text-2xl font-bold text-slate-800">Create New Ticket</h1> 
        <div className="flex items-center gap-4"> 
          <div className="relative user-menu-container"> 
            <div 
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white uppercase cursor-pointer hover:bg-blue-700 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {getInitials()}
            </div>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white uppercase text-lg">
                      {getInitials()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{currentUser.name || "User"}</p>
                      <p className="text-sm text-slate-600 break-all">{currentUser.email || "No email available"}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 text-xs text-slate-500 border-t border-slate-200">
                  <p>Click anywhere outside to close</p>
                </div>
              </div>
            )}
          </div> 
        </div> 
      </div> 

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-slate-200"> 
        <form className="space-y-4" onSubmit={handleSubmit}> 
          <div> 
            <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label> 
            <input 
              type="text" 
              required
              className="w-full p-2 border border-slate-300 rounded-md outline-blue-500" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Printer not working" 
            /> 
          </div> 
          <div> 
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label> 
            <textarea 
              required
              className="w-full p-2 border border-slate-300 rounded-md h-32 outline-blue-500" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your problem..."
            ></textarea> 
          </div> 
          
          <div className="flex gap-4"> 
             <div className="flex-1"> 
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label> 
                <select 
                  className="w-full p-2 border border-slate-300 rounded-md"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                > 
                    <option value="Authentication">Authentication</option>
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature</option>
                    <option value="UI/UX">UI/UX</option> 
                    <option value="Performance">Performance</option> 
                    <option value="Database">Database</option> 
                    <option value="Hardware">Hardware</option>
                    <option value="Network">Network</option> 
                    <option value="Other">Other</option>
                </select> 
             </div> 
             <div className="flex-1"> 
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label> 
                <select 
                   className="w-full p-2 border border-slate-300 rounded-md"
                   value={formData.priority}
                   onChange={(e) => setFormData({...formData, priority: e.target.value})}
                > 
                    <option value="Low">Low</option> 
                    <option value="Medium">Medium</option> 
                    <option value="High">High</option> 
                </select> 
             </div> 
          </div> 

          {/* NEW: File Attachment Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Attach File (PDF, Image, Doc)</label>
            <input 
              type="file" 
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button> 
        </form> 
      </div> 
    </div> 
  ); 
}; 

export default UserDashboard;