'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ConciergeCheckoutPage({ params }: { params: { vehicleId: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulating the API routing to the dealership
    setTimeout(() => {
      window.location.href = '/checkout/thank-you?type=concierge';
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans py-24 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        
        {/* ─── PREMIUM CONCIERGE HEADER ─── */}
        <div className="mb-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#A8896B] font-bold mb-4">
            CarBuyingHub Concierge
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[#1A1A1A]">
            Direct Concierge Connection.
          </h1>
          <p className="text-lg text-[#1A1A1A]/60 font-light leading-relaxed max-w-xl mx-auto">
            Excellent choice. We will instantly notify the dealership that you are ready to proceed. A dedicated client advisor will reach out directly to discuss your options, arrange payment, and schedule delivery.
          </p>
        </div>

        {/* ─── HOT LEAD FORM ─── */}
        <div className="bg-white p-8 md:p-12 rounded-sm border border-[#1A1A1A]/[0.06] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40 font-bold mb-3">
                  First Name
                </label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-[#F4F1EA] border-none rounded-sm px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all text-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40 font-bold mb-3">
                  Last Name
                </label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-[#F4F1EA] border-none rounded-sm px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all text-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40 font-bold mb-3">
                  Email Address
                </label>
                <input 
                  type="email" 
                  required 
                  className="w-full bg-[#F4F1EA] border-none rounded-sm px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all text-[#1A1A1A]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40 font-bold mb-3">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  required 
                  className="w-full bg-[#F4F1EA] border-none rounded-sm px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all text-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-[#1A1A1A]/10 flex flex-col md:flex-row gap-6 items-center justify-between">
              <p className="text-xs text-[#1A1A1A]/40 font-light max-w-sm leading-relaxed">
                By continuing, you authorize CarBuyingHub to share your contact information securely with the selling dealership to facilitate your purchase.
              </p>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-[#1A1A1A] text-[#F4F1EA] px-10 py-5 rounded-sm text-[11px] uppercase tracking-[0.2em] font-medium transition-colors hover:bg-[#6B1D2F] disabled:opacity-50 shrink-0 shadow-md"
              >
                {isSubmitting ? 'Notifying Dealer...' : 'Notify Dealership'}
              </button>
            </div>
            
          </form>
        </div>

        <div className="text-center mt-12">
          <Link href={`/vehicles/${params.vehicleId}`} className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 font-medium hover:text-[#1A1A1A] transition-colors">
            Cancel & Return to Vehicle
          </Link>
        </div>

      </div>
    </main>
  );
}