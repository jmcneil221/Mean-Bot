import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminDashboard() {
  const supabase = createAdminClient();
  
  const { count: dealerCount } = await supabase.from('dealerships').select('*', { count: 'exact', head: true });
  const { count: vehicleCount } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });
  const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });

  return (
    <div className="p-8 space-y-8">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Platform Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DE]">
          <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">Total Dealers</p>
          <p className="text-4xl font-serif font-bold text-charcoal">{dealerCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DE]">
          <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">Live Vehicles</p>
          <p className="text-4xl font-serif font-bold text-charcoal">{vehicleCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DE]">
          <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">Total Leads</p>
          <p className="text-4xl font-serif font-bold text-charcoal">{leadCount || 0}</p>
        </div>
      </div>
    </div>
  );
}
