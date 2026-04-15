import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getVehicle(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const v = await getVehicle(id);
  if (!v) return { title: 'Vehicle Not Found' };
  return {
    title: `${v.year} ${v.make} ${v.model} ${v.trim || ''}`.trim(),
    description: `${v.year} ${v.make} ${v.model} — ${v.dealer_name || ''}, ${v.city || ''} ${v.state || ''}`.trim(),
  };
}

function Spec({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-3 border-b border-[#E8E4DE] last:border-0">
      <dt className="text-charcoal/40 text-sm">{label}</dt>
      <dd className="text-charcoal text-sm font-medium">{value}</dd>
    </div>
  );
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await getVehicle(id);
  if (!v) notFound();

  const price = (v.price_cents / 100).toLocaleString('en-US');
  const title = `${v.year} ${v.make} ${v.model} ${v.trim || ''}`.trim();
  const location = [v.city, v.state].filter(Boolean).join(', ');

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <nav className="text-xs text-charcoal/40 mb-6">
        <Link href="/vehicles" className="hover:text-charcoal">Search</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/60">{title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mb-2">{title}</h1>
            <p className="text-charcoal/40 text-sm">
              {v.mileage?.toLocaleString() || '—'} miles &middot; {v.dealer_name || 'Dealer'}{location ? `, ${location}` : ''}
            </p>
          </div>

          {v.description && (
            <div className="card">
              <h2 className="font-serif text-lg font-bold text-charcoal mb-4">About This Vehicle</h2>
              <p className="text-charcoal/60 text-sm leading-relaxed">{v.description}</p>
            </div>
          )}

          <div className="card">
            <h2 className="font-serif text-lg font-bold text-charcoal mb-4">Specifications</h2>
            <dl>
              <Spec label="VIN" value={v.vin} />
              <Spec label="Year" value={v.year} />
              <Spec label="Make" value={v.make} />
              <Spec label="Model" value={[v.model, v.trim].filter(Boolean).join(' ')} />
              <Spec label="Body Style" value={v.body_style} />
              <Spec label="Mileage" value={v.mileage ? `${v.mileage.toLocaleString()} miles` : null} />
              <Spec label="Exterior" value={v.exterior_color} />
              <Spec label="Interior" value={v.interior_color} />
              <Spec label="Transmission" value={v.transmission} />
              <Spec label="Drivetrain" value={v.drivetrain} />
              <Spec label="Fuel" value={v.fuel_type} />
              <Spec label="Location" value={location || null} />
            </dl>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="card sticky top-24 space-y-5">
            <p className="font-serif text-3xl font-bold text-charcoal">${price}</p>
            <div className="border-t border-[#E8E4DE]" />
            <Link href="/apply" className="btn-primary w-full text-center block">Apply for Credit</Link>
            <a
              href={`mailto:dealers@carbuyinghub.com?subject=Inquiry%20${encodeURIComponent(title)}`}
              className="btn-secondary w-full text-center block"
            >
              Contact Dealer
            </a>
            <div className="pt-2 text-xs text-charcoal/40 uppercase tracking-premium">Listed by</div>
            <div className="text-sm font-medium text-charcoal">{v.dealer_name || 'Dealer'}</div>
            {location && <div className="text-xs text-charcoal/40">{location}</div>}
          </div>
        </aside>
      </div>
    </section>
  );
}
