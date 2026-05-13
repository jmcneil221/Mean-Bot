'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function BankIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PaymentMethodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  const [selectedMethod, setSelectedMethod] = useState<'finance' | 'cash' | null>(null);

  const handleContinue = () => {
    if (!selectedMethod) return;
    
    if (selectedMethod === 'finance') {
      router.push('/apply'); 
    } else {
      // Safely route to the new Temperature Check screen using the extracted vehicle ID
      if (vehicleId) {
        router.push(`/checkout/cash/${vehicleId}`);
      } else {
        // Fallback just in case the URL was missing the ID
        router.push('/vehicles'); 
      }
    }
  };

  return (
    <div className="w-full max-w-3xl fade-up" style={{ animationDelay: '0ms' }}>
      <div className="text-center mb-12">
        <p className="text-charcoal/40 text-xs uppercase tracking-[0.2em] font-bold mb-4">Step 1</p>
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal font-bold mb-4">How would you like to pay?</h1>
        <p className="text-charcoal/60 text-lg font-light">Select your preferred purchase method to customize your checkout experience.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Finance Card */}
        <button 
          onClick={() => setSelectedMethod('finance')}
          aria-pressed={selectedMethod === 'finance'}
          className={`w-full cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 ease-out flex flex-col items-center text-center ${
            selectedMethod === 'finance' 
              ? 'border-gold bg-gold/5 shadow-[0_0_30px_rgba(168,137,107,0.15)] scale-[1.02]' 
              : 'border-[#E8E4DE] bg-white hover:border-gold/30 hover:shadow-lg'
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${selectedMethod === 'finance' ? 'bg-gold text-white' : 'bg-parchment text-charcoal'}`}>
            <BankIcon />
          </div>
          <h3 className="font-serif text-2xl text-charcoal font-bold mb-3">Finance</h3>
          <p className="text-charcoal/60 text-sm leading-relaxed mb-6">
            Connect with top lenders and view your customized monthly payment terms directly through our secure portal.
          </p>
          <div className={`mt-auto text-xs font-bold uppercase tracking-widest transition-colors ${selectedMethod === 'finance' ? 'text-gold' : 'text-transparent'}`}>
            Selected
          </div>
        </button>

        {/* Cash Card */}
        <button 
          onClick={() => setSelectedMethod('cash')}
          aria-pressed={selectedMethod === 'cash'}
          className={`w-full cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 ease-out flex flex-col items-center text-center ${
            selectedMethod === 'cash' 
              ? 'border-gold bg-gold/5 shadow-[0_0_30px_rgba(168,137,107,0.15)] scale-[1.02]' 
              : 'border-[#E8E4DE] bg-white hover:border-gold/30 hover:shadow-lg'
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${selectedMethod === 'cash' ? 'bg-gold text-white' : 'bg-parchment text-charcoal'}`}>
            <CashIcon />
          </div>
          <h3 className="font-serif text-2xl text-charcoal font-bold mb-3">Pay Cash</h3>
          <p className="text-charcoal/60 text-sm leading-relaxed mb-6">
            Skip the financing. Check availability or request a reservation to secure this vehicle directly with the dealer.
          </p>
          <div className={`mt-auto text-xs font-bold uppercase tracking-widest transition-colors ${selectedMethod === 'cash' ? 'text-gold' : 'text-transparent'}`}>
            Selected
          </div>
        </button>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleContinue}
          disabled={!selectedMethod}
          className={`px-12 py-5 rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xl ${
            selectedMethod 
              ? 'bg-charcoal text-white hover:bg-burgundy hover:-translate-y-1 active:scale-95 cursor-pointer' 
              : 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function PaymentMethodPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center p-6 font-sans">
      <Suspense fallback={<div className="text-charcoal/60 text-sm">Loading options...</div>}>
        <PaymentMethodContent />
      </Suspense>
    </div>
  );
}