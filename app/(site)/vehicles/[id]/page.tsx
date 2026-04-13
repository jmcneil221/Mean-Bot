import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Sample data — mirrors the search page. In production this will query Supabase.
const sampleVehicles = [
  {
    id: '1', year: 2022, make: 'Toyota', model: 'Camry', trim: 'SE',
    price_cents: 2450000, mileage: 28000, dealer: 'Austin Auto Mall', dealScore: 'Great Deal',
    vin: '4T1G11AK8NU000123', body_style: 'Sedan', exterior_color: 'Midnight Black',
    interior_color: 'Ash Gray', transmission: 'Automatic', drivetrain: 'FWD',
    fuel_type: 'Gasoline', description: 'Well-maintained one-owner vehicle with complete service history. Features include blind spot monitoring, adaptive cruise control, and an 8-inch touchscreen with Apple CarPlay and Android Auto.',
  },
  {
    id: '2', year: 2021, make: 'Honda', model: 'CR-V', trim: 'EX',
    price_cents: 2790000, mileage: 35000, dealer: 'Lone Star Honda', dealScore: 'Good Deal',
    vin: '2HKRW2H55MH600456', body_style: 'SUV', exterior_color: 'Crystal Black Pearl',
    interior_color: 'Black', transmission: 'CVT', drivetrain: 'AWD',
    fuel_type: 'Gasoline', description: 'Popular compact SUV with Honda Sensing suite, heated front seats, moonroof, and smart entry with push button start. Clean title, no accidents.',
  },
  {
    id: '3', year: 2023, make: 'Ford', model: 'F-150', trim: 'XLT',
    price_cents: 3850000, mileage: 12000, dealer: 'Texas Truck Center', dealScore: 'Fair Price',
    vin: '1FTFW1E81NFA00789', body_style: 'Truck', exterior_color: 'Oxford White',
    interior_color: 'Medium Dark Slate', transmission: 'Automatic 10-Speed', drivetrain: '4WD',
    fuel_type: 'Gasoline', description: 'Nearly new F-150 XLT SuperCrew with 2.7L EcoBoost, trailer tow package, SYNC 4 infotainment, and Ford Co-Pilot360. Bed liner and running boards included.',
  },
  {
    id: '4', year: 2020, make: 'Chevrolet', model: 'Equinox', trim: 'LT',
    price_cents: 1980000, mileage: 45000, dealer: 'DFW Chevrolet', dealScore: 'Great Deal',
    vin: '2GNAXUEV7L6200321', body_style: 'SUV', exterior_color: 'Silver Ice Metallic',
    interior_color: 'Jet Black', transmission: 'Automatic 6-Speed', drivetrain: 'FWD',
    fuel_type: 'Gasoline', description: 'Affordable and reliable compact SUV with remote start, heated seats, power liftgate, and a turbocharged 1.5L engine. Great fuel economy for daily driving.',
  },
  {
    id: '5', year: 2022, make: 'Hyundai', model: 'Tucson', trim: 'SEL',
    price_cents: 2620000, mileage: 22000, dealer: 'Metro Hyundai', dealScore: 'Good Deal',
    vin: '5NMJB3AE6NH100654', body_style: 'SUV', exterior_color: 'Amazon Gray',
    interior_color: 'Black', transmission: 'Automatic 8-Speed', drivetrain: 'AWD',
    fuel_type: 'Gasoline', description: 'Redesigned Tucson with bold styling, 8-inch touchscreen, wireless Apple CarPlay, and a host of advanced safety features. Remaining factory warranty.',
  },
  {
    id: '6', year: 2021, make: 'Nissan', model: 'Altima', trim: 'SR',
    price_cents: 2130000, mileage: 38000, dealer: 'Southwest Nissan', dealScore: 'Great Deal',
    vin: '1N4BL4BV5MN300987', body_style: 'Sedan', exterior_color: 'Scarlet Ember Tintcoat',
    interior_color: 'Charcoal', transmission: 'CVT', drivetrain: 'FWD',
    fuel_type: 'Gasoline', description: 'Sport-tuned Altima SR with paddle shifters, sport seats, 19-inch wheels, and ProPILOT Assist. Excellent condition with clean Carfax.',
  },
];

function findVehicle(id: string) {
  return sampleVehicles.find(v => v.id === id) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const v = findVehicle(id);
  if (!v) return { title: 'Vehicle Not Found' };
  return {
    title: `${v.year} ${v.make} ${v.model} ${v.trim}`,
    description: `${v.year} ${v.make} ${v.model} ${v.trim} — ${v.mileage.toLocaleString()} miles, $${(v.price_cents / 100).toLocaleString()}. ${v.dealer}.`,
  };
}

function DealBadge({ score }: { score: string }) {
  const styles: Record<string, string> = {
    'Great Deal': 'bg-gold/10 text-gold border-gold/20',
    'Good Deal': 'bg-charcoal/5 text-charcoal/60 border-charcoal/10',
    'Fair Price': 'bg-parchment-dark text-charcoal/50 border-[#E8E4DE]',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-premium px-3 py-1 rounded-full border ${styles[score] || 'bg-parchment-dark text-charcoal/50 border-[#E8E4DE]'}`}>
      {score === 'Great Deal' && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {score}
    </span>
  );
}

function SpecRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-3 border-b border-[#E8E4DE] last:border-0">
      <dt className="text-charcoal/40 text-sm">{label}</dt>
      <dd className="text-charcoal text-sm font-medium">{value}</dd>
    </div>
  );
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = findVehicle(id);
  if (!vehicle) notFound();

  const price = (vehicle.price_cents / 100).toLocaleString('en-US');
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-[#E8E4DE]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-xs text-charcoal/40">
            <Link href="/vehicles" className="hover:text-charcoal transition-colors">Search</Link>
            <span>/</span>
            <span className="text-charcoal/60">{title}</span>
          </nav>
        </div>
      </div>

      {/* Gallery */}
      <section className="bg-parchment-dark">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg border border-[#E8E4DE] h-72 md:h-96 flex flex-col items-center justify-center text-charcoal/20">
            <svg className="w-20 h-20 mb-3" fill="none" stroke="currentColor" strokeWidth={0.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <p className="text-sm">Vehicle photos coming soon</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column — details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <DealBadge score={vehicle.dealScore} />
                  <span className="text-xs text-charcoal/30 uppercase tracking-premium">{vehicle.body_style}</span>
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mb-2">
                  {title}
                </h1>
                <p className="text-charcoal/40 text-sm">
                  {vehicle.mileage.toLocaleString()} miles &middot; {vehicle.dealer}
                </p>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="card">
                  <h2 className="font-serif text-lg font-bold text-charcoal mb-4">About This Vehicle</h2>
                  <p className="text-charcoal/60 text-sm leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Detailed Specifications */}
              <div className="card">
                <h2 className="font-serif text-lg font-bold text-charcoal mb-6">Detailed Specifications</h2>
                <dl>
                  <SpecRow label="VIN" value={vehicle.vin} />
                  <SpecRow label="Year" value={vehicle.year} />
                  <SpecRow label="Make" value={vehicle.make} />
                  <SpecRow label="Model" value={`${vehicle.model} ${vehicle.trim}`} />
                  <SpecRow label="Body Style" value={vehicle.body_style} />
                  <SpecRow label="Mileage" value={`${vehicle.mileage.toLocaleString()} miles`} />
                  <SpecRow label="Exterior" value={vehicle.exterior_color} />
                  <SpecRow label="Interior" value={vehicle.interior_color} />
                  <SpecRow label="Transmission" value={vehicle.transmission} />
                  <SpecRow label="Drivetrain" value={vehicle.drivetrain} />
                  <SpecRow label="Fuel Type" value={vehicle.fuel_type} />
                </dl>
              </div>

              {/* Vehicle History */}
              <div className="card">
                <h2 className="font-serif text-lg font-bold text-charcoal mb-6">Vehicle History</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Accidents', value: 'No accidents reported', ok: true },
                    { label: 'Owners', value: '1 previous owner', ok: true },
                    { label: 'Title', value: 'Clean title', ok: true },
                    { label: 'Service Records', value: 'Complete service history available', ok: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${item.ok ? 'bg-gold/10 text-gold' : 'bg-charcoal/5 text-charcoal/30'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">{item.label}</p>
                        <p className="text-xs text-charcoal/40">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-[#E8E4DE]">
                  <p className="text-xs text-charcoal/30">
                    Vehicle history is provided as a courtesy and should be independently verified.
                    Full Carfax or AutoCheck reports available upon request from the dealer.
                  </p>
                </div>
              </div>
            </div>

            {/* Right column — sticky CTA */}
            <div className="lg:col-span-1">
              <div className="card sticky top-[88px] space-y-6">
                {/* Price */}
                <div>
                  <p className="font-serif text-3xl font-bold text-charcoal">${price}</p>
                  <p className="text-charcoal/40 text-xs mt-1">
                    Est. ${Math.round(vehicle.price_cents / 100 / 60).toLocaleString()}/mo
                    <span className="text-charcoal/25 ml-1">(60 mo, 6.5% APR)</span>
                  </p>
                </div>

                {/* Deal badge */}
                <div className="flex items-center gap-2">
                  <DealBadge score={vehicle.dealScore} />
                </div>

                {/* Divider */}
                <div className="border-t border-[#E8E4DE]" />

                {/* Quick specs */}
                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-charcoal/40">Mileage</dt>
                    <dd className="text-charcoal font-medium">{vehicle.mileage.toLocaleString()} mi</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal/40">Drivetrain</dt>
                    <dd className="text-charcoal font-medium">{vehicle.drivetrain}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal/40">Transmission</dt>
                    <dd className="text-charcoal font-medium">{vehicle.transmission}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal/40">Fuel</dt>
                    <dd className="text-charcoal font-medium">{vehicle.fuel_type}</dd>
                  </div>
                </dl>

                {/* Divider */}
                <div className="border-t border-[#E8E4DE]" />

                {/* CTA */}
                <Link href="/apply" className="btn-primary w-full text-center">
                  Apply for Credit
                </Link>
                <a
                  href={`mailto:dealers@carbuyinghub.com?subject=Inquiry%20%E2%80%94%20${encodeURIComponent(title)}`}
                  className="btn-secondary w-full text-center"
                >
                  Contact Dealer
                </a>

                {/* Dealer info */}
                <div className="pt-2">
                  <p className="text-xs text-charcoal/40 uppercase tracking-premium mb-1">Listed by</p>
                  <p className="text-sm font-medium text-charcoal">{vehicle.dealer}</p>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-1.5 text-xs text-gold">
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Your data is protected with bank-level encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
