
export const UserTickets = () => { 

    // Mock data sorted as: New, then In Progress, then Resolved 

    const tickets = [ 

        { id: 'TKT-005', title: 'Email delay', status: 'New', priority: 'High', date: 'Feb 16' }, 

        { id: 'TKT-002', title: 'Password Reset', status: 'In Progress', priority: 'Medium', date: 'Feb 15' }, 

        { id: 'TKT-004', title: 'Monitor Flicker', status: 'Resolved', priority: 'Low', date: 'Feb 14' }, 

    ]; 

 

    const getStatusStyle = (status: string) => { 

        switch(status) { 

            case 'New': return 'bg-red-500 text-white'; 

            case 'In Progress': return 'bg-yellow-400 text-white'; 

            case 'Resolved': return 'bg-green-500 text-white'; 

            default: return 'bg-slate-200'; 

        } 

    }; 

 

    return ( 

        <div className="ml-64 p-8 bg-slate-50 min-h-screen"> 

            <h1 className="text-2xl font-bold text-slate-800 mb-6">My Tickets</h1> 

            <div className="space-y-4"> 

                {tickets.map((t) => ( 

                    <div key={t.id} className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-md transition"> 

                        <div className="flex items-center gap-6"> 

                            <div className={`w-3 h-12 rounded-full ${getStatusStyle(t.status).split(' ')[0]}`}></div> 

                            <div> 

                                <h3 className="text-lg font-bold text-slate-800">{t.title}</h3> 

                                <p className="text-sm text-slate-500">{t.id} • Logged on {t.date}</p> 

                            </div> 

                        </div> 

                        <div className="flex items-center gap-4"> 

                            <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${getStatusStyle(t.status)}`}> 

                                {t.status} 

                            </span> 

                        </div> 

                    </div> 

                ))} 

            </div> 

        </div> 

    ); 

}; 

export default UserTickets; 