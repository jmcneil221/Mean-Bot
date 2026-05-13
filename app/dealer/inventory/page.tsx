import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import InventoryUpload from '@/src/components/InventoryUpload';
import StatusDropdown from '@/src/components/StatusDropdown';

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('dealership_id')
    .eq('id', user!.id)
    .single();

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, year, make, model, trim, vin, price_cents, mileage, status')
    .eq('dealership_id', profile!.dealership_id)
    .order('created_at', { ascending: false });

  const activeCount = vehicles?.filter(v => v.status === 'active').length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-charcoal/40 text-xs uppercase tracking-[0.2em] font-bold mb-2">Inventory</p>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Your Vehicles</h1>
          <p className="text-charcoal/40 text-sm mt-1">
            {vehicles?.length || 0} total &middot; {activeCount} active
          </p>
        </div>
      </div>

      <div className="mb-8">
        <InventoryUpload />
      </div>

      {vehicles && vehicles.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E4DE]">
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-charcoal/40 font-bold">Vehicle</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-charcoal/40 font-bold">VIN</th>
                <th className="text-right px-6 py-4 text-xs uppercase tracking-widest text-charcoal/40 font-bold">Price</th>
                <th className="text-right px-6 py-4 text-xs uppercase tracking-widest text-charcoal/40 font-bold">Mileage</th>
                <th className="text-center px-6 py-4 text-xs uppercase tracking-widest text-charcoal/40 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-[#E8E4DE] last:border-0 hover:bg-parchment/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/vehicles/${v.id}`} className="font-medium text-charcoal hover:text-burgundy transition-colors">
                      {v.year} {v.make} {v.model} {v.trim || ''}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal/50 font-mono">
                    {v.vin ? `...${v.vin.slice(-6)}` : '—'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-charcoal">
                    ${((v.price_cents || 0) / 100).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-charcoal/60">
                    {v.mileage?.toLocaleString() || '—'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusDropdown vehicleId={v.id} currentStatus={v.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-12 text-center">
          <p className="font-serif text-xl text-charcoal mb-2">No vehicles yet</p>
          <p className="text-charcoal/50 text-sm">
            Upload a CSV above to import your inventory.
          </p>
        </div>
      )}
    </div>
  );
}
