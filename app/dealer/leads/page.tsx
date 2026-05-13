import { createClient } from '@/lib/supabase/server';
import LeadStatusDropdown from '@/src/components/LeadStatusDropdown';

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('dealership_id').eq('id', user!.id).single();
  const { data: leads } = await supabase.from('leads').select('*').eq('dealership_id', profile!.dealership_id).order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold mb-8 text-charcoal">Lead Dashboard</h1>
      <div className="space-y-4">
        {leads?.map((lead) => (
          <div key={lead.id} className={`bg-white rounded-2xl border border-[#E8E4DE] p-6 ${lead.status === 'new' ? 'ring-2 ring-blue-200' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-charcoal">{lead.buyer_name}</h3>
                <p className="text-sm text-charcoal/50">{lead.vehicle_title}</p>
              </div>
              <LeadStatusDropdown leadId={lead.id} currentStatus={lead.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <p><strong>Email:</strong> {lead.buyer_email}</p>
              <p><strong>Income:</strong> ${lead.annual_income?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
