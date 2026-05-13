'use client';

import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  employmentStatus: string;
  annualIncome: string;
  monthlyHousingPayment: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  employmentStatus: '',
  annualIncome: '',
  monthlyHousingPayment: '',
};

const states = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

const STEP_LABELS = ['Contact Info', 'Address & Employment', 'Review & Submit'];

export default function CreditApplicationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; errors?: string[] } | null>(null);

  const totalSteps = 3;

  function update(field: keyof FormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
      employmentStatus: formData.employmentStatus,
      annualIncome: parseFloat(formData.annualIncome) || 0,
      monthlyHousingPayment: parseFloat(formData.monthlyHousingPayment) || 0,
    };

    try {
      const res = await fetch('/api/credit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        console.error('[CreditApp] Non-JSON response', res.status, res.statusText);
        setResult({
          success: false,
          errors: [`Server returned ${res.status} ${res.statusText}. Check the console for details.`],
        });
        return;
      }

      if (!res.ok && !data.errors) {
        data.errors = [`Request failed with status ${res.status}`];
      }

      if (!data.success && data.errors) {
        console.error('[CreditApp] Submission errors:', data.errors);
      }

      setResult(data);
    } catch (err) {
      console.error('[CreditApp] Network/fetch error:', err);
      setResult({
        success: false,
        errors: [
          'Network error — could not reach the server.',
          err instanceof Error ? err.message : String(err),
        ],
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.success) {
    return (
      <div className="card text-center py-16">
        <div className="w-14 h-14 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">Inquiry Sent</h2>
        <p className="text-charcoal/50 mb-8 max-w-md mx-auto">
          {result.message || 'Your inquiry has been sent directly to the dealer. They will contact you shortly.'}
        </p>
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-premium text-gold">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          No personal data stored on our servers
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      {/* Stepper */}
      <div className="flex items-center gap-3 mb-10">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum <= step;
          const isCurrent = stepNum === step;
          return (
            <div key={i} className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'bg-burgundy text-white'
                    : isActive
                      ? 'bg-charcoal text-white'
                      : 'bg-parchment-dark text-charcoal/30'
                }`}>
                  {stepNum}
                </span>
                {i < totalSteps - 1 && (
                  <div className={`flex-1 h-px transition-colors ${isActive ? 'bg-charcoal/20' : 'bg-parchment-dark'}`} />
                )}
              </div>
              <p className={`text-xs transition-colors ${
                isCurrent
                  ? 'text-burgundy font-medium'
                  : isActive
                    ? 'text-charcoal/50'
                    : 'text-charcoal/25'
              }`}>
                {STEP_LABELS[i]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Errors */}
      {result?.errors && (
        <div className="bg-burgundy/5 border border-burgundy/20 text-burgundy px-5 py-4 rounded-lg mb-8">
          <p className="font-medium text-sm mb-1">Please fix the following:</p>
          <ul className="list-disc list-inside text-sm space-y-0.5">
            {result.errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* Step 1: Contact Info */}
      {step === 1 && (
        <div className="space-y-5">
          <h3 className="font-serif text-xl font-bold text-charcoal">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-charcoal/60 mb-1.5">First Name *</label>
              <input type="text" className="input-field" required value={formData.firstName} onChange={e => update('firstName', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-charcoal/60 mb-1.5">Last Name *</label>
              <input type="text" className="input-field" required value={formData.lastName} onChange={e => update('lastName', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5">Email *</label>
            <input type="email" className="input-field" required value={formData.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5">Phone *</label>
            <input type="tel" className="input-field" placeholder="(555) 123-4567" required value={formData.phone} onChange={e => update('phone', e.target.value)} />
          </div>
          <button type="button" onClick={() => setStep(2)} className="btn-primary w-full mt-2">Continue</button>
        </div>
      )}

      {/* Step 2: Address & Employment */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-serif text-xl font-bold text-charcoal">Address & Employment</h3>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5">Street Address *</label>
            <input type="text" className="input-field" required value={formData.street} onChange={e => update('street', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-charcoal/60 mb-1.5">City *</label>
              <input type="text" className="input-field" required value={formData.city} onChange={e => update('city', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-charcoal/60 mb-1.5">State *</label>
              <select className="input-field" required value={formData.state} onChange={e => update('state', e.target.value)}>
                <option value="">Select</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5">ZIP Code *</label>
            <input type="text" className="input-field" placeholder="12345" required value={formData.zipCode} onChange={e => update('zipCode', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5">Employment Status *</label>
            <select className="input-field" required value={formData.employmentStatus} onChange={e => update('employmentStatus', e.target.value)}>
              <option value="">Select</option>
              <option value="employed">Employed</option>
              <option value="self_employed">Self Employed</option>
              <option value="retired">Retired</option>
              <option value="student">Student</option>
              <option value="unemployed">Unemployed</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5">Annual Income *</label>
            <input type="number" className="input-field" placeholder="75000" required value={formData.annualIncome} onChange={e => update('annualIncome', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5">Monthly Housing Payment *</label>
            <input type="number" className="input-field" placeholder="1500" required value={formData.monthlyHousingPayment} onChange={e => update('monthlyHousingPayment', e.target.value)} />
          </div>
          <div className="flex gap-4 mt-2">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">Review</button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-charcoal">Review Your Inquiry</h3>

          <div className="bg-parchment rounded-lg p-5 space-y-2.5 text-sm">
            <h4 className="text-xs uppercase tracking-premium text-gold mb-3">Contact Information</h4>
            <p><span className="text-charcoal/40">Name:</span> <span className="text-charcoal">{formData.firstName} {formData.lastName}</span></p>
            <p><span className="text-charcoal/40">Email:</span> <span className="text-charcoal">{formData.email}</span></p>
            <p><span className="text-charcoal/40">Phone:</span> <span className="text-charcoal">{formData.phone}</span></p>
          </div>

          <div className="bg-parchment rounded-lg p-5 space-y-2.5 text-sm">
            <h4 className="text-xs uppercase tracking-premium text-gold mb-3">Address & Employment</h4>
            <p><span className="text-charcoal/40">Address:</span> <span className="text-charcoal">{formData.street}, {formData.city}, {formData.state} {formData.zipCode}</span></p>
            <p><span className="text-charcoal/40">Employment:</span> <span className="text-charcoal capitalize">{formData.employmentStatus.replace('_', ' ')}</span></p>
            <p><span className="text-charcoal/40">Annual Income:</span> <span className="text-charcoal">${Number(formData.annualIncome || 0).toLocaleString()}</span></p>
            <p><span className="text-charcoal/40">Monthly Housing:</span> <span className="text-charcoal">${Number(formData.monthlyHousingPayment || 0).toLocaleString()}</span></p>
          </div>

          <div className="bg-parchment border border-[#E8E4DE] rounded-lg p-5 text-sm text-charcoal/60">
            <p className="font-medium text-charcoal mb-2">By submitting this inquiry, you agree to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>CarBuyingHub&apos;s Terms of Service and Privacy Policy</li>
              <li>Allow participating dealers to contact you about your vehicle interest</li>
              <li>Receive a one-time confirmation email about your inquiry</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-gold px-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your information is sent directly to the dealer — nothing stored on our servers
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
              {submitting ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
