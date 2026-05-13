'use client';

import { useState, useMemo } from 'react';

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

export default function DealerDashboardClient({ leads: initialLeads, dealerName }: { leads: Lead[], dealerName: string }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.intent === 'reserve' && (l.status === 'pending' || l.status === 'contacted')).length;
  const pendingLeads = leads.filter(l => l.status === 'pending').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => 
        l.full_name.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q) || 
        l.phone.includes(q) ||
        (l.model && l.model.toLowerCase().includes(q)) ||
        (l.vin && l.vin.toLowerCase().includes(q))
      );
    }
    if (intentFilter !== 'all') {
      result = result.filter(l => l.intent === intentFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(l => l.status === statusFilter);
    }

    result.sort((a, b) => {
      const aIsHotPending = a.intent === 'reserve' && a.status === 'pending';
      const bIsHotPending = b.intent === 'reserve' && b.status === 'pending';
      const aIsWarmPending = a.intent === 'check_availability' && a.status === 'pending';
      const bIsWarmPending = b.intent === 'check_availability' && b.status === 'pending';

      if (aIsHotPending && !bIsHotPending) return -1;
      if (!aIsHotPending && bIsHotPending) return 1;
      if (aIsWarmPending && !bIsWarmPending) return -1;
      if (!aIsWarmPending && bIsWarmPending) return 1;
      
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [leads, search, intentFilter, statusFilter]);

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
      <header className="bg-white border-b border-[#E8E4DE] px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl text-[#1A1A1A] font-bold tracking-wide uppercase">CarBuyingHub</h1>
            <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-widest mt-1">{dealerName}'s Command Center</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-sm">
            {dealerName.charAt(0)}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-[#E8E4DE] shadow-sm">
            <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-widest mb-2">Total Leads</p>
            <p className="font-serif text-3xl text-[#1A1A1A]">{totalLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#6B1D2F]/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#6B1D2F]"></div>
            <p className="text-xs text-[#6B1D2F]/60 uppercase tracking-widest mb-2 font-bold">Hot Leads</p>
            <p className="font-serif text-3xl text-[#6B1D2F]">{hotLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-amber-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
            <p className="text-xs text-amber-700/60 uppercase tracking-widest mb-2 font-bold">Needs Action</p>
            <p className="font-serif text-3xl text-amber-700">{pendingLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#E8E4DE] shadow-sm">
            <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-widest mb-2">In Progress</p>
            <p className="font-serif text-3xl text-[#1A1A1A]">{contactedLeads}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E8E4DE] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F1EA] text-xs uppercase tracking-wider text-[#1A1A1A]/40 border-b border-[#E8E4DE]">
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
                  <td colSpan={5} className="px-6 py-12 text-center text-[#1A1A1A]/40">No leads found.</td>
                </tr>
              ) : (
                filteredAndSortedLeads.map((lead) => {
                  const isHotPending = lead.intent === 'reserve' && lead.status === 'pending';
                  return (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className={`border-b border-[#E8E4DE] last:border-none cursor-pointer transition-colors ${isHotPending ? 'bg-[#6B1D2F]/5 hover:bg-[#6B1D2F]/10' : 'hover:bg-[#F4F1EA]'}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#1A1A1A]">{lead.full_name}</p>
                        <p className="text-xs text-[#1A1A1A]/50 mt-1">{lead.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#1A1A1A] font-medium">{lead.year} {lead.make} {lead.model}</p>
                      </td>
                      <td className="px-6 py-4">
                        {lead.intent === 'reserve' ? (
                          <span className="px-2.5 py-1 bg-[#6B1D2F]/10 text-[#6B1D2F] border border-[#6B1D2F]/20 rounded-md text-xs font-bold uppercase tracking-wide">Hot</span>
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
                      <td className="px-6 py-4 text-sm text-[#1A1A1A]/60">
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
    </div>
  );
}