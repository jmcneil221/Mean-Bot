import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Search Cars',
  description: 'Browse thousands of vehicles from trusted dealers. Filter by price, make, model, year, and location.',
};

const sampleVehicles = [
  { id: '1', year: 2022, make: 'Toyota', model: 'Camry SE', price: 24500, mileage: 28000, dealer: 'Austin Auto Mall', dealScore: 'Great Deal' },
  { id: '2', year: 2021, make: 'Honda', model: 'CR-V EX', price: 27900, mileage: 35000, dealer: 'Lone Star Honda', dealScore: 'Good Deal' },
  { id: '3', year: 2023, make: 'Ford', model: 'F-150 XLT', price: 38500, mileage: 12000, dealer: 'Texas Truck Center', dealScore: 'Fair Price' },
  { id: '4', year: 2020, make: 'Chevrolet', model: 'Equinox LT', price: 19800, mileage: 45000, dealer: 'DFW Chevrolet', dealScore: 'Great Deal' },
  { id: '5', year: 2022, make: 'Hyundai', model: 'Tucson SEL', price: 26200, mileage: 22000, dealer: 'Metro Hyundai', dealScore: 'Good Deal' },
  { id: '6', year: 2021, make: 'Nissan', model: 'Altima SR', price: 21300, mileage: 38000, dealer: 'Southwest Nissan', dealScore: 'Great Deal' },
];

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

export default function VehiclesPage() {
  return (
    <>
      {/* Search Header */}
      <section className="border-b border-[#E8E4DE] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Search Cars</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select className="input-field text-sm">
              <option value="">Any Make</option>
              <option>Toyota</option><option>Honda</option><option>Ford</option>
              <option>Chevrolet</option><option>Hyundai</option><option>Nissan</option>
              <option>BMW</option><option>Mercedes-Benz</option><option>Tesla</option>
            </select>
            <select className="input-field text-sm">
              <option value="">Any Model</option>
            </select>
            <select className="input-field text-sm">
              <option value="">Price Range</option>
              <option>Under $10,000</option><option>$10,000 - $20,000</option>
              <option>$20,000 - $30,000</option><option>$30,000 - $50,000</option>
              <option>$50,000+</option>
            </select>
            <select className="input-field text-sm">
              <option value="">Year</option>
              <option>2024</option><option>2023</option><option>2022</option>
              <option>2021</option><option>2020</option><option>2019 &amp; older</option>
            </select>
            <button className="btn-primary text-sm">Search</button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <p className="text-charcoal/40 text-sm">{sampleVehicles.length} vehicles found</p>
          <select className="input-field w-auto text-sm">
            <option>Sort: Best Deal</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Mileage: Low to High</option>
            <option>Year: Newest</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleVehicles.map(vehicle => (
            <div key={vehicle.id} className="card hover:shadow-md transition-shadow group">
              {/* Image placeholder — links to VDP */}
              <Link href={`/vehicles/${vehicle.id}`} className="block">
                <div className="bg-parchment-dark rounded-lg h-48 mb-5 flex items-center justify-center text-charcoal/15 group-hover:bg-parchment transition-colors">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth={0.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
              </Link>

              <div className="flex items-start justify-between mb-2">
                <Link href={`/vehicles/${vehicle.id}`} className="hover:text-burgundy transition-colors">
                  <h3 className="font-serif font-bold text-charcoal">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                </Link>
                <DealBadge score={vehicle.dealScore} />
              </div>

              <p className="font-serif text-2xl font-bold text-charcoal mb-1">
                ${vehicle.price.toLocaleString()}
              </p>
              <p className="text-sm text-charcoal/40 mb-5">
                {vehicle.mileage.toLocaleString()} miles &middot; {vehicle.dealer}
              </p>

              <div className="flex gap-3">
                <Link href={`/vehicles/${vehicle.id}`} className="btn-secondary text-sm flex-1 text-center">
                  View Details
                </Link>
                <Link href="/apply" className="btn-primary text-sm flex-1 text-center">
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
