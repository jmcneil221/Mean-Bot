import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ReservationForm from './ReservationForm'; // Unbreakable relative import

export const dynamic = 'force-dynamic';

export default async function CheckoutReservePage({ 
  params,
  searchParams 
}: { 
  params: { id: string },
  searchParams: { intent?: string }
}) {
  const supabase = await createClient();
  
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !vehicle) {
    notFound();
  }

  const isReserve = searchParams.intent === 'reserve';

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans pt-20 pb-32 px-6">
      <div className="max-w-xl mx-auto">
        
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#A8896B] font-medium mb-4">
            {isReserve ? 'Secure Your Vehicle' : 'Inquire Today'}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {isReserve ? 'Reserve Vehicle' : 'Check Availability'}
          </h1>
          <p className="text-lg text-[#1A1A1A]/60 font-light">
            {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
          </p>
        </div>

        <div className="bg-white p-8 border border-[#1A1A1A]/[0.06] rounded-sm shadow-sm">
           <ReservationForm 
             vehicleId={vehicle.id} 
             intent={searchParams.intent || 'check_availability'} 
           />
        </div>

      </div>
    </div>
  );
}