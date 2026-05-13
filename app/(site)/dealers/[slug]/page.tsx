import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export default async function DealerProfilePage({ params }: { params: { slug: string } }) {
  const supabase = createAdminClient();
  const { slug } = params;

  // Fetch Dealership
  const { data: dealer } = await supabase
    .from('dealerships')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!dealer) notFound();

  // Fetch their active inventory + recently sold
  const soldCutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('dealership_id', dealer.id)
    .or(`status.eq.active,and(status.eq.sold,updated_at.gte.${soldCutoff})`)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-parchment">
      {/* Branded Header */}
      <header className="bg-white border-b border-[#E8E4DE] pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-serif font-bold text-white shadow-sm"
                style={{ backgroundColor: dealer.primary_color || '#2C2C2C' }}
              >
                {dealer.logo_url ? <img src={dealer.logo_url} alt={dealer.name} /> : dealer.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-serif text-3xl font-bold text-charcoal">{dealer.name}</h1>
                  {dealer.plan === 'founding_30' && (
                    <span className="bg-charcoal text-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="w-2 h-2 bg-gold rounded-sm rotate-45" />
                      Founding 30
                    </span>
                  )}
                </div>
                <p className="text-charcoal/40 text-sm">{dealer.city}, {dealer.state}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={`tel:${dealer.phone}`} className="btn-secondary text-sm">Call Dealer</a>
              <Link href="/apply" className="btn-primary text-sm">Get Pre-Qualified</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar: About */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-xs text-charcoal/40 uppercase tracking-widest font-bold mb-4">About</h2>
              <p className="text-sm text-charcoal/60 leading-relaxed">
                {dealer.about_text || `Welcome to ${dealer.name}, your premier destination for quality vehicles in ${dealer.city}.`}
              </p>
            </div>
          </div>

          {/* Main: Inventory */}
          <div className="lg:col-span-3">
            <h2 className="text-xs text-charcoal/40 uppercase tracking-widest font-bold mb-6">Current Inventory</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {vehicles?.map(v => (
                <Link key={v.id} href={`/vehicles/${v.id}`} className="group">
                  <div className={`card hover:shadow-md transition-all ${v.status === 'sold' ? 'opacity-60' : ''}`}>
                    <div className="relative aspect-video bg-parchment-dark rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                       {v.status === 'sold' && (
                         <div className="absolute inset-0 bg-burgundy/80 flex items-center justify-center z-10">
                           <span className="text-white font-serif font-bold text-xl uppercase tracking-widest">Sold</span>
                         </div>
                       )}
                       <span className="text-charcoal/10 font-serif italic text-lg">Photo Coming Soon</span>
                    </div>
                    <h3 className="font-serif font-bold text-charcoal group-hover:text-burgundy transition-colors">
                      {v.year} {v.make} {v.model}
                    </h3>
                    <p className="text-xl font-bold text-charcoal mt-1">${(v.price_cents/100).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
