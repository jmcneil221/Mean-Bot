'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    id: 'founding_30',
    name: 'Founding 30',
    price: '$100,000',
    note: 'one-time',
    highlight: true,
    features: [
      'Zero monthly fees — for life',
      '$150 locked success fee per vehicle',
      'Connecticut territory protection',
      'Lifetime Founder Badge',
    ],
  },
  {
    id: 'boutique',
    name: 'Boutique',
    price: '$149',
    note: '/month',
    highlight: false,
    features: [
      'Up to 25 vehicle listings',
      'Receive credit applications',
      'Dealer profile page',
      'Monthly analytics',
    ],
  },
  {
    id: 'small',
    name: 'Small Lot',
    price: '$299',
    note: '/month',
    highlight: false,
    features: [
      'Up to 100 vehicle listings',
      'Featured search placement',
      'Lead management dashboard',
      'Weekly analytics',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    note: 'contact us',
    highlight: false,
    features: [
      'Unlimited vehicle listings',
      'Premium search placement',
      'DMS integration',
      'Dedicated account manager',
    ],
  },
] as const;

type Step = 1 | 2 | 3;

export default function OnboardingFlow({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [formData, setFormData] = useState({
    dealershipName: '',
    phone: '',
    email: userEmail,
    city: '',
    state: 'CT',
    zip: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.dealershipName.trim()) {
      setError('Dealership name is required.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/dealers/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealershipName: formData.dealershipName,
          plan: selectedPlan,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setSubmitting(false);
        return;
      }

      router.push('/dealer');
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-3 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
              step >= s ? 'bg-charcoal text-white' : 'bg-[#E8E4DE] text-charcoal/40'
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-px transition-colors duration-300 ${
                step > s ? 'bg-charcoal' : 'bg-[#E8E4DE]'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Plan */}
      {step === 1 && (
        <div className="fade-up">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-3">Choose Your Plan</h2>
            <p className="text-charcoal/60">Select the partnership tier that fits your dealership.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? plan.highlight
                      ? 'border-gold bg-gold/5 shadow-lg'
                      : 'border-charcoal bg-charcoal/[0.02] shadow-lg'
                    : 'border-[#E8E4DE] bg-white hover:border-charcoal/20 hover:shadow-sm'
                }`}
              >
                {plan.highlight && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full mb-3">
                    Best Value
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-charcoal mb-1">{plan.name}</h3>
                <p className="text-charcoal mb-4">
                  <span className="font-serif text-2xl font-bold">{plan.price}</span>
                  <span className="text-charcoal/40 text-sm ml-1">{plan.note}</span>
                </p>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal/60">
                      <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.25} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => { if (selectedPlan) setStep(2); }}
              disabled={!selectedPlan}
              className={`px-10 py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                selectedPlan
                  ? 'bg-charcoal text-white hover:bg-burgundy hover:-translate-y-0.5 hover:shadow-lg'
                  : 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Dealership Details */}
      {step === 2 && (
        <div className="fade-up max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-3">Dealership Details</h2>
            <p className="text-charcoal/60">Tell us about your business.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="dealershipName" className="block text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-2">
                Dealership Name *
              </label>
              <input
                id="dealershipName"
                type="text"
                value={formData.dealershipName}
                onChange={(e) => setFormData({ ...formData, dealershipName: e.target.value })}
                className="input-field"
                placeholder="e.g. Fairfield County Toyota"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="(203) 555-0100"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-2">
                  Contact Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-2">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field"
                  placeholder="Stamford"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-2">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input-field"
                  maxLength={2}
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-2">
                  ZIP
                </label>
                <input
                  id="zip"
                  type="text"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="input-field"
                  placeholder="06901"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-burgundy bg-burgundy/5 px-4 py-3 rounded-lg">{error}</p>
          )}

          <div className="flex justify-between mt-10">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-charcoal/50 text-sm font-bold uppercase tracking-widest hover:text-charcoal transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (!formData.dealershipName.trim()) {
                  setError('Dealership name is required.');
                  return;
                }
                setError('');
                setStep(3);
              }}
              className="px-10 py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase bg-charcoal text-white hover:bg-burgundy hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="fade-up max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-3">Review &amp; Submit</h2>
            <p className="text-charcoal/60">Confirm your details to activate your dealer account.</p>
          </div>

          <div className="bg-white border border-[#E8E4DE] rounded-2xl p-8 space-y-4 mb-8">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-widest text-charcoal/40 font-bold">Plan</span>
              <span className="font-serif font-bold text-charcoal">
                {PLANS.find((p) => p.id === selectedPlan)?.name}
              </span>
            </div>
            <div className="border-t border-[#E8E4DE]" />
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-widest text-charcoal/40 font-bold">Dealership</span>
              <span className="font-medium text-charcoal">{formData.dealershipName}</span>
            </div>
            {formData.phone && (
              <>
                <div className="border-t border-[#E8E4DE]" />
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-widest text-charcoal/40 font-bold">Phone</span>
                  <span className="text-charcoal/70">{formData.phone}</span>
                </div>
              </>
            )}
            <div className="border-t border-[#E8E4DE]" />
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-widest text-charcoal/40 font-bold">Email</span>
              <span className="text-charcoal/70">{formData.email}</span>
            </div>
            {formData.city && (
              <>
                <div className="border-t border-[#E8E4DE]" />
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-widest text-charcoal/40 font-bold">Location</span>
                  <span className="text-charcoal/70">
                    {formData.city}{formData.state ? `, ${formData.state}` : ''} {formData.zip}
                  </span>
                </div>
              </>
            )}
          </div>

          {error && (
            <p className="mb-6 text-sm text-burgundy bg-burgundy/5 px-4 py-3 rounded-lg">{error}</p>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-charcoal/50 text-sm font-bold uppercase tracking-widest hover:text-charcoal transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-10 py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                submitting
                  ? 'bg-charcoal/50 text-white/70 cursor-wait'
                  : 'bg-charcoal text-white hover:bg-burgundy hover:-translate-y-0.5 hover:shadow-lg'
              }`}
            >
              {submitting ? 'Activating...' : 'Activate Dealer Account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
