import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Search Cars',
  description: 'Browse thousands of vehicles from trusted dealers. Filter by price, make, model, year, and location.',
};

const sampleVehicles = [
  { id: 1, year: 2022, make: 'Toyota', model: 'Camry SE', price: 24500, mileage: 28000, image: null, dealer: 'Austin Auto Mall', dealScore: 'Great Deal' },
  { id: 2, year: 2021, make: 'Honda', model: 'CR-V EX', price: 27900, mileage: 35000, image: null, dealer: 'Lone Star Honda', dealScore: 'Good Deal' },
  { id: 3, year: 2023, make: 'Ford', model: 'F-150 XLT', price: 38500, mileage: 12000, image: null, dealer: 'Texas Truck Center', dealScore: 'Fair Price' },
  { id: 4, year: 2020, make: 'Chevrolet', model: 'Equinox LT', price: 19800, mileage: 45000, image: null, dealer: 'DFW Chevrolet', dealScore: 'Great Deal' },
  { id: 5, year: 2022, make: 'Hyundai', model: 'Tucson SEL', price: 26200, mileage: 22000, image: null, dealer: 'Metro Hyundai', dealScore: 'Good Deal' },
  { id: 6, year: 2021, make: 'Nissan', model: 'Altima SR', price: 21300, mileage: 38000, image: null, dealer: 'Southwest Nissan', dealScore: 'Great Deal' },
];

function DealBadge({ score }: { score: string }) {
  const colors: Record<string, string> = {
    'Great Deal': 'bg-green-100 text-green-800',
    'Good Deal': 'bg-blue-100 text-blue-800',
    'Fair Price': 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors[score] || 'bg-gray-100 text-gray-800'}`}>
      {score}
    </span>
  );
}

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-brand-navy mb-4">Search Cars</h1>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{sampleVehicles.length} vehicles found</p>
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
            <div key={vehicle.id} className="card hover:shadow-lg transition-shadow">
              {/* Image placeholder */}
              <div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-brand-navy">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <DealBadge score={vehicle.dealScore} />
              </div>

              <p className="text-2xl font-bold text-brand-blue mb-1">
                ${vehicle.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                {vehicle.mileage.toLocaleString()} miles &middot; {vehicle.dealer}
              </p>

              <div className="flex gap-2">
                <Link href="/apply" className="btn-primary text-sm flex-1 text-center">
                  Apply Now
                </Link>
                <button className="btn-secondary text-sm px-4">
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
