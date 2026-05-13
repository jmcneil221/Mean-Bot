import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PaymentCalculator from './PaymentCalculator';

export const dynamic = 'force-dynamic';

export default async function VehicleDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !vehicle) {
    notFound();
  }

  // Handle pricing
  const rawPrice = vehicle.price_cents ? vehicle.price_cents / 100 : 0;
  const priceInDollars = rawPrice > 0 ? rawPrice.toLocaleString() : 'N/A';

  const displayEngine = vehicle.engine_description || vehicle.engine || 'Inquire for Details';

  // Fixes the broken image issue by stripping hidden spaces/quotes
  const defaultImage = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1600";
  let imageToDisplay = defaultImage;
  
  if (vehicle.image_url) {
    imageToDisplay = vehicle.image_url.replace(/['"]+/g, '').trim();
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans pb-40 md:pb-12">
      <div className="pt-8 px-6 max-w-5xl mx-auto">
        <Link href="/vehicles" className="text-[11px] uppercase tracking-[0.2em] text-[#A8896B] font-bold hover:text-[#1A1A1A] transition-colors flex items-center gap-2">
          <span>←</span> Back to Inventory
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 grid md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: VISUALS & DESCRIPTION */}
        <div className="space-y-10">
          
          <div className="bg-white p-6 sm:p-8 border border-[#1A1A1A]/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative group transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#1A1A1A]/[0.05] bg-[#1A1A1A]">
              <img 
                src={imageToDisplay} 
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover grayscale-[25%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-3 right-8 bg-[#F4F1EA] px-4 py-1 border border-[#1A1A1A]/10 shadow-sm z-10">
              <p className="text-[8px] uppercase tracking-[0.4em] text-[#1A1A1A]/60 font-bold">Exhibit</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-2xl font-bold border-b border-[#1A1A1A]/10 pb-2">Advisor's Notes</h3>
            <p className="text-[#1A1A1A]/70 leading-relaxed font-light whitespace-pre-wrap">
              {vehicle.description || "This premium vehicle is currently being inspected and detailed by our service team. Please check back shortly for a full detailed description of features and history."}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: SPECS & ACTIONS */}
        <div className="flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#A8896B] font-medium mb-4">
            {vehicle.year} • {vehicle.mileage?.toLocaleString() || '—'} miles
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-2 leading-tight">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-xl text-[#1A1A1A]/60 font-light mb-8">
            {vehicle.trim || 'Standard Trim'}
          </p>

          {/* LISTED PRICE BLOCK */}
          <div className="bg-white p-6 rounded-sm border border-[#1A1A1A]/[0.06] shadow-sm mb-6 flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 font-bold mb-2">Listed Price</p>
              <p className="font-serif text-4xl font-bold text-[#6B1D2F]">${priceInDollars}</p>
            </div>
          </div>

          {/* PAYMENT CALCULATOR BLOCK (Stacked directly underneath) */}
          {rawPrice > 0 && <PaymentCalculator vehiclePrice={rawPrice} />}

          {/* SPECIFICATIONS GRID */}
          <div className="space-y-4 text-sm font-light text-[#1A1A1A]/80 mb-10">
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span className="font-medium text-[#1A1A1A]">VIN</span>
              <span className="uppercase tracking-wider">{vehicle.vin || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span className="font-medium text-[#1A1A1A]">Engine</span>
              <span>{displayEngine}</span>
            </div>
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span className="font-medium text-[#1A1A1A]">Drive Type</span>
              <span>{vehicle.drivetrain || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span className="font-medium text-[#1A1A1A]">Transmission</span>
              <span>{vehicle.transmission || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span className="font-medium text-[#1A1A1A]">Exterior</span>
              <span>{vehicle.exterior_color || 'N/A'}</span>
            </div>
          </div>
          
          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex flex-col space-y-3">
            <Link 
              href={`/checkout/reserve/${vehicle.id}?intent=reserve`} 
              className="group flex items-center justify-center gap-2 w-full text-center bg-[#1A1A1A] text-[#F4F1EA] px-10 py-5 rounded-sm text-[11px] uppercase tracking-[0.2em] font-medium transition-colors hover:bg-[#6B1D2F] shadow-md"
            >
              <span>Reserve Vehicle</span>
            </Link>
            
            <div className="flex flex-col items-center gap-2 pt-2">
              <Link 
                href={`/checkout/reserve/${vehicle.id}?intent=check_availability`} 
                className="block w-full text-center bg-transparent border border-[#1A1A1A]/20 text-[#1A1A1A] px-10 py-4 rounded-sm text-[11px] uppercase tracking-[0.2em] font-medium transition-all hover:border-[#1A1A1A] hover:bg-[#1A1A1A]/5"
              >
                Check Availability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}