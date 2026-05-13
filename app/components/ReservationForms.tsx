'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReservationForm({ vehicleId, intent }: { vehicleId: string, intent: string }) {
  const router = useRouter();
  const isReserve = intent === 'reserve';
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentIntent: 'cash_outside'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, vehicleId, intent }),
      });

      if (response.ok) {
        router.push(`/checkout/success?intent=${intent}`);
      } else {
        console.error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-bold">First Name</label>
          <input 
            type="text" 
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="bg-transparent border-b border-[#1A1A1A]/20 py-2 text-[#1A1A1A] text-sm font-light focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-bold">Last Name</label>
          <input 
            type="text" 
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="bg-transparent border-b border-[#1A1A1A]/20 py-2 text-[#1A1A1A] text-sm font-light focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-bold">Email Address</label>
        <input 
          type="email" 
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="bg-transparent border-b border-[#1A1A1A]/20 py-2 text-[#1A1A1A] text-sm font-light focus:outline-none focus:border-[#1A1A1A] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 font-bold">Phone Number</label>
        <input 
          type="tel" 
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="bg-transparent border-b border-[#1A1A1A]/20 py-2 text-[#1A1A1A] text-sm font-light focus:outline-none focus:border-[#1A1A1A] transition-colors"
        />
      </div>

      {isReserve && (
        <div className="pt-6 border-t border-[#1A1A1A]/10 mt-8">
          <label className="block text-[11px] uppercase tracking-[0.2em] text-[#A8896B] font-bold mb-4">
            Anticipated Payment Method
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-4 h-4 border border-[#1A1A1A]/30 rounded-full group-hover:border-[#1A1A1A] transition-colors">
                <input 
                  type="radio" 
                  name="paymentIntent" 
                  value="cash_outside"
                  checked={formData.paymentIntent === 'cash_outside'}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="w-2 h-2 bg-[#1A1A1A] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm font-light text-[#1A1A1A]/80 group-hover:text-[#1A1A1A] transition-colors">
                Cash / Outside Financing
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-4 h-4 border border-[#1A1A1A]/30 rounded-full group-hover:border-[#1A1A1A] transition-colors">
                <input 
                  type="radio" 
                  name="paymentIntent" 
                  value="dealership_financing"
                  checked={formData.paymentIntent === 'dealership_financing'}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="w-2 h-2 bg-[#1A1A1A] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-sm font-light text-[#1A1A1A]/80 group-hover:text-[#1A1A1A] transition-colors">
                Apply for Dealership Financing
              </span>
            </label>
          </div>
        </div>
      )}

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#1A1A1A] text-[#F4F1EA] py-4 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors hover:bg-[#6B1D2F] disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : (isReserve ? 'Submit Reservation' : 'Request Availability')}
        </button>
      </div>
    </form>
  );
}