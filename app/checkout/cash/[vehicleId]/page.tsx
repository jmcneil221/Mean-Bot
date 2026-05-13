'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CashCheckoutPage({ params }: { params: { vehicleId: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Keep track of what the user types
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(''); // Clear any old errors
    
    try {
      // Shoot the data to our new API endpoint
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: params.vehicleId,
          dealer_id: 'pending_dealer_assignment', // We will pull the real dealer ID from the vehicle data later!
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          intent: 'direct_purchase' // Updated from hot_cash to leave financing doors open!
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit lead.');
      }

      // Success! Route them to the elegant thank-you page
      window.location.href = '/checkout/thank-you?type=cash';

    } catch (error: any) {
      console.error('Submission error:', error);
      setErrorMsg(error.message || 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false); // Re-enable the button so they can try again
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] font-sans py-24 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        
        {/* ─── HEADER ─── */}
        <div className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#A8896B] font-medium mb-6">
            Direct Purchase Engagement
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Direct Concierge Connection.
          </h1>
          <p className="text-lg text-[#1A1A1A]/60 font-light leading-relaxed max-w-xl mx-auto">
            Excellent choice. We will instantly notify the dealership that you are ready to proceed. A dedicated client advisor will reach out directly to discuss your purchase options and arrange delivery.
          </p>
        </div>

        {/* ─── HOT LEAD FORM ─── */}
        <div className="bg-white p-8 md:p-12 rounded-sm border border-[#1A1A1A]/[0.06] shadow-sm">
          {errorMsg && (
            <div className="mb-6 p-4 bg-[#6B1D2F]/10 border border-[#6B1D2F]/20 text-[#6B1D2F] text-sm rounded-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40 font-bold mb-3">
                  First Name
                </label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                  className="w-full bg-[#F4F1EA] border-none rounded-sm px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40 font-bold mb-3">
                  Last Name
                </label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                  className="w-full bg-[#F4F1EA] border-none rounded-sm px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all"
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="w-full bg-[#F4F1EA] border-none rounded-sm px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40 font-bold mb-3">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                  className="w-full bg-[#F4F1EA] border-none rounded-sm px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all"
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