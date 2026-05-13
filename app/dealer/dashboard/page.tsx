import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LeadStatusActions from './LeadStatusActions';

export default async function DealerDashboard() {
  const supabase = await createClient();

  // 1. Verify session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Fetch leads with vehicle details
  const { data: leads } = await supabase
    .from('leads')
    .select(`
      *,
      vehicles (
        year,
        make,
        model
      )
    `)
    .eq('dealer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#A8896B] font-bold mb-2">
              Dealer Portal
            </p>
            <h1 className="font-serif text-4xl font-bold text-[#1A1A1A]">
              Command Center
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-sm border border-[#1A1A1A]/[0.06] shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/40 font-bold">Total Leads</p>
              <p className="text-xl font-serif font-bold">{leads?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* LEADS TABLE */}
        <div className="bg-white rounded-sm border border-[#1A1A1A]/[0.06] shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] text-[#F4F1EA]">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Date</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Client</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Vehicle</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/[0.06]">
                {leads?.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F4F1EA]/50 transition-colors">
                    <td className="px-6 py-5 text-sm text-[#1A1A1A]/60">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-[#1A1A1A]">{lead.full_name}</p>
                      <p className="text-xs text-[#1A1A1A]/40">{lead.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">
                        {lead.vehicles?.year} {lead.vehicles?.make} {lead.vehicles?.model}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      {/* INTERACTIVE STATUS UPDATER */}
                      <LeadStatusActions leadId={lead.id} initialStatus={lead.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-[10px] uppercase tracking-widest font-bold text-[#6B1D2F] hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(!leads || leads.length === 0) && (
              <div className="py-20 text-center">
                <p className="text-[#1A1A1A]/30 uppercase tracking-[0.2em] text-xs">No leads received yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}