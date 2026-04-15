import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Search Cars',
  description: 'Browse thousands of vehicles from trusted dealers.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function DealBadge({ score }: { score: string }) {
  const styles: Record<string, string> = {
    'Great Deal': 'bg-gold/10 text-gold border-gold/20',
    'Good Deal': 'bg-charcoal/5 text-charcoal/60 border-charcoal/10',
    'Fair Price': 'bg-parchment-dark text-charcoal/50 border-[#E8E4DE]',
  };
  return (
    <span className={`text-xs font-medium uppercase tracking-premium px-2.5 py-0.5 rounded-full border ${styles[score] || 'bg-parchment-dark text-charcoal/50 border-[#E8E4DE]'}`}>
      {score}
    </span>
  );
}

export default async function VehiclesPage() {
  const supabase = await createClient();
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('id, year, make, model, trim, mileage, price_cents, dealer_name, city, state')
    .eq('status', 'active')
    .order('price_cents', { ascending: true });

  function getDealScore(p: number): string {
    if (p < 2200000) return 'Great Deal';
    if (p < 3000000) return 'Good Deal';
    return 'Fair Price';
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Search Cars</h1>
      <p className="text-charcoal/40 text-sm mb-8">{vehicles?.length || 0} vehicles found</p>

      {error ? (
        <div className="card border-red-200 bg-red-50 text-red-700">
          <p className="font-medium">Unable to load vehicles</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      ) : vehicles && vehicles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => {
            const price = v.price_cents / 100;
            const model = [v.model, v.trim].filter(Boolean).join(' ');
            return (
              <div key={v.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif font-bold text-charcoal">
                    {v.year} {v.make} {model}
                  </h3>
                  <DealBadge score={getDealScore(v.price_cents)} />
                </div>
                <p className="font-serif text-2xl font-bold text-charcoal mb-1">
                  ${price.toLocaleString()}
                </p>
                <p className="text-sm text-charcoal/40 mb-5">
                  {v.mileage?.toLocaleString() || '—'} miles &middot; {v.dealer_name || 'Dealer'}{v.city ? `, ${v.city}` : ''} {v.state ? ` ${v.state}` : ''}
                </p>
                <div className="flex gap-3">
                  <Link href={`/vehicles/${v.id}`} className="btn-secondary text-sm flex-1 text-center">View Details</Link>
                  <Link href="/apply" className="btn-primary text-sm flex-1 text-center">Apply Now</Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center text-charcoal/40">No vehicles found</div>
      )}
    </section>
  );
}
