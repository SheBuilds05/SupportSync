import { useState } from 'react'; 


export const UserDashboard = () => { 

  return ( 

    <div className="ml-64 p-8 bg-slate-50 min-h-screen"> 

      {/* Header */} 

      <div className="flex justify-between items-center mb-8"> 

        <h1 className="text-2xl font-bold text-slate-800">Create New Ticket</h1> 

        <div className="flex items-center gap-4"> 

            <div className="relative"> 

                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">2</span> 

                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">GR</div> 

            </div> 

        </div> 

      </div> 

 

      {/* Ticket Form */} 

      <div className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-slate-200"> 

        <form className="space-y-4"> 

          <div> 

            <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label> 

            <input type="text" className="w-full p-2 border border-slate-300 rounded-md outline-blue-500" placeholder="e.g. Printer not working" /> 

          </div> 

          <div> 

            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label> 

            <textarea className="w-full p-2 border border-slate-300 rounded-md h-32 outline-blue-500" placeholder="Describe your problem..."></textarea> 

          </div> 

          <div className="flex gap-4"> 

             <div className="flex-1"> 

                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label> 

                <select className="w-full p-2 border border-slate-300 rounded-md"> 

                    <option>Hardware</option> 

                    <option>Software</option> 

                    <option>Network</option> 

                </select> 

             </div> 

             <div className="flex-1"> 

                <label className="block text-sm font-medium text-slate-700 mb-1">Attachment</label> 

                <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" /> 

             </div> 

          </div> 

          <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">Submit Ticket</button> 

        </form> 

      </div> 

 

      {/* Latest Tickets */} 

      <h2 className="text-xl font-semibold text-slate-800 mb-4">Latest Created Tickets</h2> 

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 

        {[ 

          { id: 'TKT-001', title: 'Login issues', status: 'New', color: 'bg-red-100 text-red-700 border-red-200' }, 

          { id: 'TKT-002', title: 'VPN Disconnecting', status: 'New', color: 'bg-red-100 text-red-700 border-red-200' }, 

          { id: 'TKT-003', title: 'Software Update', status: 'In Progress', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }, 

          { id: 'TKT-004', title: 'Mouse replacement', status: 'Resolved', color: 'bg-green-100 text-green-700 border-green-200' }, 

        ].map((ticket) => ( 

          <div key={ticket.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm"> 

            <div> 

              <p className="text-xs text-slate-400 font-mono">{ticket.id}</p> 

              <h3 className="font-semibold text-slate-700">{ticket.title}</h3> 

            </div> 

            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${ticket.color}`}> 

              {ticket.status} 

            </span> 

          </div> 

        ))} 

      </div> 

    </div> 

  ); 

}; 

export default UserDashboard; 

 

 