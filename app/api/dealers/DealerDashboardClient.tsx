'use client';

import { useState, useMemo } from 'react';

// Define the shape of the data we expect from the server
export type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  intent: 'reserve' | 'check_availability';
  status: 'pending' | 'contacted' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  message: string | null;
  created_at: string;
  vehicle_id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vin: string | null;
};

export default function DealerDashboardClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Drawer State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // KPIs
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.intent === 'reserve' && (l.status === 'pending' || l.status === 'contacted')).length;
  const pendingLeads = leads.filter(l => l.status === 'pending').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;

  // Filtering & Sorting Logic
  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // 1. Apply Filters
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => 
        l.full_name.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q) || 
        l.phone.includes(q) ||
        l.model.toLowerCase().includes(q) ||
        (l.vin && l.vin.toLowerCase().includes(q))
      );
    }
    if (intentFilter !== 'all') {
      result = result.filter(l => l.intent === intentFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(l => l.status === statusFilter);
    }

    // 2. Apply Apple Intelligence Sorting: Hot Pending > Warm Pending > Recent
    result.sort((a, b) => {
      const aIsHotPending = a.intent === 'reserve' && a.status === 'pending';
      const bIsHotPending = b.intent === 'reserve' && b.status === 'pending';
      const aIsWarmPending = a.intent === 'check_availability' && a.status === 'pending';
      const bIsWarmPending = b.intent === 'check_availability' && b.status === 'pending';

      if (aIsHotPending && !bIsHotPending) return -1;
      if (!aIsHotPending && bIsHotPending) return 1;
      if (aIsWarmPending && !bIsWarmPending) return -1;
      if (!aIsWarmPending && bIsWarmPending) return 1;
      
      // Fallback to most recent
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [leads, search, intentFilter, statusFilter]);

  // Action: Update Lead Status
  const handleUpdateStatus = async (newStatus: Lead['status']) => {
    if (!selectedLead) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/reservations/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Update local state instantly so the UI feels snappy
      setLeads(current => 
        current.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l)
      );
      setSelectedLead({ ...selectedLead, status: newStatus });
      
    } catch (error) {
      console.error(error);
      alert('Could not update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] font-sans pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-[#E8E4DE] px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-charcoal font-bold tracking-wide uppercase">CarBuyingHub</h1>
            <p className="text-xs text-charcoal/40 uppercase tracking-widest mt-1">Dealer Command Center</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-sm">
            D
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-8">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-[#E8E4DE] shadow-sm">
            <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-2">Total Leads</p>
            <p className="font-serif text-3xl text-charcoal">{totalLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-burgundy/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-burgundy"></div>
            <p className="text-xs text-burgundy/60 uppercase tracking-widest mb-2 font-bold">Hot Leads</p>
            <p className="font-serif text-3xl text-burgundy">{hotLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-amber-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
            <p className="text-xs text-amber-700/60 uppercase tracking-widest mb-2 font-bold">Needs Action</p>
            <p className="font-serif text-3xl text-amber-700">{pendingLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#E8E4DE] shadow-sm">
            <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-2">In Progress</p>
            <p className="font-serif text-3xl text-charcoal">{contactedLeads}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-lg border border-[#E8E4DE]">
          <input 
            type="text" 
            placeholder="Search buyers, VIN, or vehicle..." 
            className="px-4 py-2 bg-[#F4F1EA] border-none rounded-md text-sm w-full md:w-80 outline-none focus:ring-1 focus:ring-charcoal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              className="px-4 py-2 bg-[#F4F1EA] border-none rounded-md text-sm outline-none w-full md:w-auto"
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
            >
              <option value="all">All Intents</option>
              <option value="reserve">Hot (Reserve)</option>
              <option value="check_availability">Warm (Availability)</option>
            </select>
            <select 
              className="px-4 py-2 bg-[#F4F1EA] border-none rounded-md text-sm outline-none w-full md:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-white rounded-lg border border-[#E8E4DE] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F1EA] text-xs uppercase tracking-wider text-charcoal/40 border-b border-[#E8E4DE]">
                <th className="px-6 py-4 font-medium">Buyer</th>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Intent</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-charcoal/40">No leads found matching your criteria.</td>
                </tr>
              ) : (
                filteredAndSortedLeads.map((lead) => {
                  const isHotPending = lead.intent === 'reserve' && lead.status === 'pending';
                  
                  return (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className={`border-b border-[#E8E4DE] last:border-none cursor-pointer transition-colors ${isHotPending ? 'bg-burgundy/5 hover:bg-burgundy/10' : 'hover:bg-[#F4F1EA]'}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-charcoal">{lead.full_name}</p>
                        <p className="text-xs text-charcoal/50 mt-1">{lead.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-charcoal font-medium">{lead.year} {lead.make} {lead.model}</p>
                        <p className="text-xs text-charcoal/50 mt-1 uppercase">{lead.vin || 'VIN Pending'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {lead.intent === 'reserve' ? (
                          <span className="px-2.5 py-1 bg-burgundy/10 text-burgundy border border-burgundy/20 rounded-md text-xs font-bold uppercase tracking-wide">Hot</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-xs font-bold uppercase tracking-wide">Warm</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wide ${
                          lead.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-zinc-100 text-zinc-600'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal/60">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Slide-out Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-charcoal/20 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedLead(null)}
          ></div>
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E8E4DE] animate-slide-in-right overflow-y-auto">
            
            <div className="p-6 border-b border-[#E8E4DE] flex justify-between items-start bg-[#F4F1EA]">
              <div>
                <p className="text-xs uppercase tracking-widest text-charcoal/40 mb-1">Lead Review</p>
                <h2 className="font-serif text-2xl font-bold text-charcoal">{selectedLead.full_name}</h2>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-white rounded-full text-charcoal/40 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex-1 space-y-8">
              
              {/* Intent & Status Box */}
              <div className="flex gap-3">
                 <div className="flex-1 bg-parchment p-3 rounded-lg border border-[#E8E4DE] text-center">
                    <p className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-1">Intent</p>
                    <p className={`text-sm font-bold uppercase ${selectedLead.intent === 'reserve' ? 'text-burgundy' : 'text-slate-600'}`}>
                      {selectedLead.intent === 'reserve' ? 'Reserve (Hot)' : 'Check Avail (Warm)'}
                    </p>
                 </div>
                 <div className="flex-1 bg-parchment p-3 rounded-lg border border-[#E8E4DE] text-center">
                    <p className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-1">Current Status</p>
                    <p className="text-sm font-bold uppercase text-charcoal">{selectedLead.status}</p>
                 </div>
              </div>

              {/* Vehicle Specs */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-charcoal/40 mb-3 border-b border-[#E8E4DE] pb-2">Vehicle Requested</h3>
                <p className="font-medium text-charcoal text-lg">{selectedLead.year} {selectedLead.make} {selectedLead.model}</p>
                <p className="text-sm text-charcoal/60 mt-1">Trim: {selectedLead.trim || 'Standard'}</p>
                <p className="text-xs font-mono text-charcoal/40 mt-2 bg-[#F4F1EA] inline-block px-2 py-1 rounded">VIN: {selectedLead.vin || 'N/A'}</p>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-charcoal/40 mb-3 border-b border-[#E8E4DE] pb-2">Contact Details</h3>
                <div className="space-y-3">
                  <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-3 text-sm text-charcoal hover:text-burgundy transition-colors p-3 rounded-lg border border-[#E8E4DE] hover:border-burgundy/30 group">
                    <span className="w-8 h-8 rounded-full bg-[#F4F1EA] flex items-center justify-center group-hover:bg-burgundy/5 text-lg">📞</span>
                    <span className="font-medium tracking-wide">{selectedLead.phone}</span>
                  </a>
                  <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-3 text-sm text-charcoal hover:text-burgundy transition-colors p-3 rounded-lg border border-[#E8E4DE] hover:border-burgundy/30 group">
                    <span className="w-8 h-8 rounded-full bg-[#F4F1EA] flex items-center justify-center group-hover:bg-burgundy/5 text-lg">✉️</span>
                    <span className="font-medium">{selectedLead.email}</span>
                  </a>
                </div>
              </div>

              {/* Message */}
              {selectedLead.message && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-charcoal/40 mb-3 border-b border-[#E8E4DE] pb-2">Buyer Message</h3>
                  <blockquote className="bg-parchment p-4 rounded-lg border-l-4 border-gold text-charcoal/80 text-sm italic leading-relaxed">
                    "{selectedLead.message}"
                  </blockquote>
                </div>
              )}
            </div>

            {/* Action Bar (Sticky Bottom) */}
            <div className="p-6 bg-white border-t border-[#E8E4DE] shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
              <p className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-3 text-center">Update Lead Status</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('contacted')}
                  className="px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors"
                >
                  Mark Contacted
                </button>
                <button 
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('accepted')}
                  className="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors"
                >
                  Accept Lead
                </button>
                <button 
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('pending')}
                  className="px-4 py-2 border border-[#E8E4DE] rounded text-xs font-bold uppercase tracking-wider text-charcoal/60 hover:bg-[#F4F1EA] transition-colors"
                >
                  Revert to Pending
                </button>
                <button 
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('declined')}
                  className="px-4 py-2 border border-[#E8E4DE] rounded text-xs font-bold uppercase tracking-wider text-charcoal/60 hover:bg-zinc-100 transition-colors"
                >
                  Decline Lead
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}