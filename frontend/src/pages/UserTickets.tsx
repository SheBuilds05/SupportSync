import { useState, useEffect } from 'react';

type User = {
    email?: string;
};

type Ticket = {
    _id: string;
    title: string;
    ticketId: string;
    createdAt: string;
    status: string;
    priority: string;
    description: string;   
    category: string;      
    assignedTo?: string;
    // Updated type to handle the Buffer data from MongoDB
    attachment?: {
        data: { data: number[] };
        contentType: string;
        fileName: string;
    };
};

type UserTicketsProps = {
    user: User | null | undefined;
};

export const UserTickets = ({ user }: UserTicketsProps) => { 
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    // Helper to convert MongoDB Buffer to a browser-usable URL
    const getAttachmentUrl = (attachment: any) => {
        if (!attachment || !attachment.data) return null;
        try {
            const uint8Array = new Uint8Array(attachment.data.data);
            const blob = new Blob([uint8Array], { type: attachment.contentType });
            return URL.createObjectURL(blob);
        } catch (e) {
            console.error("Error generating preview URL", e);
            return null;
        }
    };

    useEffect(() => {
        const fetchMyTickets = async () => {
            try {
                const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
                if (!token || !user?.email) {
                    setLoading(false);
                    return;
                }
                const response = await fetch(`https://supportsync-ujib.onrender.com/api/tickets/my-tickets/${user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTickets(data);
                }
            } catch (err) {
                console.error("❌ Error fetching user tickets:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTickets();
    }, [user]);

    const getStatusStyle = (status: string) => { 
        switch(status) { 
            case 'Open': return 'bg-blue-500 text-white'; 
            case 'In Progress': return 'bg-yellow-400 text-white'; 
            case 'Resolved': return 'bg-green-500 text-white'; 
            default: return 'bg-slate-200'; 
        } 
    }; 

    if (loading) {
        return (
            <div className="ml-64 p-8 bg-slate-50 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return ( 
        <div className="ml-64 p-8 bg-slate-50 min-h-screen relative"> 
            <h1 className="text-2xl font-bold text-slate-800 mb-6">My Tickets</h1> 
            
            <div className="space-y-4"> 
                {tickets.length > 0 ? (
                    tickets.map((t) => ( 
                        <div 
                            key={t._id} 
                            onClick={() => setSelectedTicket(t)} 
                            className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-md hover:border-blue-300 cursor-pointer transition"
                        > 
                            <div className="flex items-center gap-6"> 
                                <div className={`w-1 h-12 rounded-full ${getStatusStyle(t.status).split(' ')[0]}`}></div> 
                                <div> 
                                    <h3 className="text-lg font-bold text-slate-800">{t.title}</h3> 
                                    <p className="text-sm text-slate-500">
                                        {t.ticketId} • {new Date(t.createdAt).toLocaleDateString()}
                                    </p> 
                                </div> 
                            </div> 

                            <div className="flex items-center gap-4"> 
                                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${getStatusStyle(t.status)}`}> 
                                    {t.status} 
                                </span> 
                            </div> 
                        </div> 
                    ))
                ) : (
                    <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
                        <p className="text-slate-500">You haven't logged any tickets yet.</p>
                    </div>
                )}
            </div>

            {/* --- MODAL POP-UP --- */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedTicket.ticketId}</span>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedTicket.title}</h2>
                            </div>
                            <button 
                                onClick={() => setSelectedTicket(null)} 
                                className="text-slate-400 hover:text-slate-600 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Status</p>
                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(selectedTicket.status)}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Priority</p>
                                    <p className={`text-sm font-bold mt-1 ${selectedTicket.priority === 'High' ? 'text-red-500' : 'text-slate-700'}`}>
                                        {selectedTicket.priority}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Category</p>
                                    <p className="text-sm font-semibold text-slate-700 mt-1">{selectedTicket.category || 'General'}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Assigned To</p>
                                    <p className="text-sm font-semibold text-slate-700 mt-1">{selectedTicket.assignedTo || 'Unassigned'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-2">Description</p>
                                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedTicket.description}
                                </div>
                            </div>

                            {/* --- ATTACHMENT SECTION --- */}
                            {selectedTicket.attachment && (
                                <div className="mt-6 border-t border-slate-100 pt-6">
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-3">Attachment</p>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">
                                                        {selectedTicket.attachment.fileName}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 uppercase">{selectedTicket.attachment.contentType}</p>
                                                </div>
                                            </div>
                                            
                                            <a 
                                                href={getAttachmentUrl(selectedTicket.attachment) || '#'} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                download={selectedTicket.attachment.fileName}
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition shadow-sm"
                                            >
                                                View / Download
                                            </a>
                                        </div>

                                        {/* Image Preview */}
                                        {selectedTicket.attachment.contentType.startsWith('image/') && (
                                            <div className="mt-4 border-t border-slate-200 pt-4">
                                                <img 
                                                    src={getAttachmentUrl(selectedTicket.attachment) || ''} 
                                                    alt="Preview" 
                                                    className="rounded-lg max-h-64 mx-auto shadow-sm border border-slate-100"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 text-right">
                            <button 
                                onClick={() => setSelectedTicket(null)}
                                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div> 
    ); 
}; 

export default UserTickets;
