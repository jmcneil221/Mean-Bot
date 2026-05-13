'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type PlanTier = 'founding_30' | 'boutique' | 'small_lot' | null;

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(null);
  const [dealerName, setDealerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    
    // Create the Supabase user and inject dealer metadata
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: dealerName,
          role: 'dealer',
          plan: selectedPlan
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Success! Move to the final confirmation screen
    setLoading(false);
    setStep(4);
  };

  return (
    <div className="card bg-white shadow-xl rounded-xl border border-border-default overflow-hidden">
      {/* Progress Bar */}
      <div className="h-2 w-full bg-parchment-dark">
        <div 
          className="h-full bg-burgundy transition-all duration-500 ease-in-out" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="p-8 md:p-12">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="section-heading text-2xl font-serif text-charcoal">Select Your Tier</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setSelectedPlan('founding_30')}
                className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                  selectedPlan === 'founding_30' 
                    ? 'border-gold bg-gold/5' 
                    : 'border-border-default hover:border-gold/50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-xl text-charcoal font-semibold">Founding 30</h3>
                  <span className="bg-gold text-white text-xs font-bold px-2 py-1 rounded tracking-widest uppercase">CT Only</span>
                </div>
                <p className="text-3xl font-serif text-charcoal mb-4">$100k <span className="text-sm font-sans text-charcoal/60">/rooftop</span></p>
                <ul className="space-y-2 text-sm text-charcoal/80 mb-6">
                  <li>✓ Lifetime platform equity</li>
                  <li>✓ Zero per-lead fees</li>
                  <li>✓ White-glove inventory setup</li>
                </ul>
              </div>

              <div 
                onClick={() => setSelectedPlan('boutique')}
                className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                  selectedPlan === 'boutique' 
                    ? 'border-burgundy bg-burgundy/5' 
                    : 'border-border-default hover:border-burgundy/50'
                }`}
              >
                <h3 className="font-serif text-xl text-charcoal font-semibold mb-4">Boutique</h3>
                <p className="text-3xl font-serif text-charcoal mb-4">$149 <span className="text-sm font-sans text-charcoal/60">/mo</span></p>
                <ul className="space-y-2 text-sm text-charcoal/80 mb-6">
                  <li>✓ Up to 50 active listings</li>
                  <li>✓ Direct lender routing</li>
                  <li>✓ Standard support</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button 
                onClick={nextStep} 
                disabled={!selectedPlan}
                className="btn-primary bg-burgundy text-white px-8 py-3 rounded hover:bg-burgundy/90 disabled:opacity-50 transition-all"
              >
                Continue Setup
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="section-heading text-2xl font-serif text-charcoal">Dealership Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Dealership Name</label>
                <input 
                  type="text" 
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                  className="input-field w-full border border-border-default rounded p-3 focus:outline-none focus:border-burgundy transition-colors" 
                  placeholder="e.g. Hartford Motorcars" 
                />
              </div>
            </div>
            <div className="pt-6 flex justify-between">
              <button onClick={prevStep} className="btn-ghost text-charcoal/60 hover:text-charcoal font-medium">Back</button>
              <button 
                onClick={nextStep} 
                disabled={!dealerName.trim()}
                className="btn-primary bg-burgundy text-white px-8 py-3 rounded hover:bg-burgundy/90 disabled:opacity-50 transition-all"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="section-heading text-2xl font-serif text-charcoal">Create Partner Account</h2>
            <p className="text-charcoal/60 text-sm">Secure your {selectedPlan === 'founding_30' ? 'Founding 30' : 'Boutique'} allocation.</p>
            
            {error && <div className="p-3 bg-burgundy/10 text-burgundy text-sm rounded border border-burgundy/20">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Business Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full border border-border-default rounded p-3 focus:outline-none focus:border-burgundy transition-colors" 
                  placeholder="gm@dealership.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Secure Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full border border-border-default rounded p-3 focus:outline-none focus:border-burgundy transition-colors" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            
            <div className="pt-6 flex justify-between items-center">
              <button onClick={prevStep} className="btn-ghost text-charcoal/60 hover:text-charcoal font-medium">Back</button>
              <button 
                onClick={handleSignUp} 
                disabled={loading || !email || !password}
                className="btn-primary bg-burgundy text-white px-8 py-3 rounded hover:bg-burgundy/90 disabled:opacity-50 transition-all"
              >
                {loading ? 'Creating Account...' : 'Execute & Continue'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-12 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-3xl font-serif text-charcoal mb-4">Welcome to CarBuyingHub</h2>
            <p className="text-charcoal/60 mb-8 max-w-md mx-auto leading-relaxed">
              Your account has been securely created. Your regional representative will be in touch shortly to finalize your inventory sync.
            </p>
            <button 
              onClick={() => router.push('/admin')} 
              className="bg-charcoal text-white px-8 py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase hover:bg-burgundy transition-colors shadow-lg hover:shadow-burgundy/20 hover:-translate-y-0.5"
            >
              Enter Dealer Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
