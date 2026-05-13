import { createClient } from '@/lib/supabase/server';
import SearchableInventory from './SearchableInventory';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VehiclesPage() {
  const supabase = await createClient();

  // Fetch all active vehicles from the database securely on the server
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inventory:', error);
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans py-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#A8896B] font-medium mb-6">
            Current Inventory
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Seamless Car Buying.
          </h1>
          <p className="text-lg text-[#1A1A1A]/60 font-light max-w-xl mx-auto">
            Explore available vehicles across all brands with zero pressure and zero liability.
          </p>
        </div>

        {/* We pass the database results into our new Client Component! */}
        <SearchableInventory initialVehicles={vehicles || []} />
        
      </div>
    </div>
  );
}