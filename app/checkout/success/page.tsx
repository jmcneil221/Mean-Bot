import Link from 'next/link';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { intent?: string };
}) {
  const isReserve = searchParams.intent === 'reserve';

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-12 border border-[#1A1A1A]/[0.06] rounded-sm shadow-sm text-center">
        
        {/* CHECKMARK ICON */}
        <div className="w-16 h-16 mx-auto border-2 border-[#1A1A1A] rounded-full flex items-center justify-center mb-8">
          <svg 
            className="w-8 h-8 text-[#1A1A1A]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <p className="text-[11px] uppercase tracking-[0.3em] text-[#A8896B] font-medium mb-4">
          Request Received
        </p>
        
        <h1 className="font-serif text-3xl font-bold tracking-tight mb-4 leading-tight">
          {isReserve ? 'Reservation Confirmed' : 'Inquiry Submitted'}
        </h1>
        
        <p className="text-[#1A1A1A]/70 font-light leading-relaxed mb-10">
          {isReserve 
            ? 'Your VIP hold request has been successfully transmitted to our sales desk. A client advisor will contact you shortly to finalize your appointment.' 
            : 'Thank you for your interest. Our team is verifying the current availability of this vehicle and will reach out to you momentarily.'}
        </p>

        <Link 
          href="/vehicles" 
          className="inline-block w-full bg-transparent border border-[#1A1A1A]/20 text-[#1A1A1A] px-8 py-4 rounded-sm text-[11px] uppercase tracking-[0.2em] font-medium transition-colors hover:border-[#1A1A1A] hover:bg-[#1A1A1A]/5"
        >
          Return to Inventory
        </Link>
      </div>
    </div>
  );
}