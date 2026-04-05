'use client';

import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  employmentStatus: string;
  annualIncome: string;
  monthlyHousingPayment: string;
  driversLicenseNumber: string;
  applicationType: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  ssn: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  employmentStatus: '',
  annualIncome: '',
  monthlyHousingPayment: '',
  driversLicenseNumber: '',
  applicationType: 'auto_loan',
};

const states = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

export default function CreditApplicationForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; applicationId?: string; errors?: string[] } | null>(null);

  const totalSteps = 3;

  function update(field: keyof FormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/credit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          annualIncome: parseFloat(formData.annualIncome) || 0,
          monthlyHousingPayment: parseFloat(formData.monthlyHousingPayment) || 0,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, errors: ['Network error. Please try again.'] });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.success) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">&#10003;</div>
        <h2 className="text-2xl font-bold text-brand-navy mb-2">Application Submitted!</h2>
        <p className="text-gray-600 mb-2">Application ID: <strong>{result.applicationId}</strong></p>
        <p className="text-gray-600 mb-6">
          We&apos;ll review your application and contact you within 24 hours.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-brand-green">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Your data has been encrypted and tokenized securely.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex-1">
            <div className={`h-2 rounded-full transition-colors ${i + 1 <= step ? 'bg-brand-blue' : 'bg-gray-200'}`} />
            <p className={`text-xs mt-1 ${i + 1 <= step ? 'text-brand-blue font-medium' : 'text-gray-400'}`}>
              {['Personal Info', 'Address & Employment', 'Review & Submit'][i]}
            </p>
          </div>
        ))}
      </div>

      {result?.errors && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium mb-1">Please fix the following:</p>
          <ul className="list-disc list-inside text-sm">
            {result.errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-brand-navy mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input type="text" className="input-field" required value={formData.firstName} onChange={e => update('firstName', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input type="text" className="input-field" required value={formData.lastName} onChange={e => update('lastName', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" className="input-field" required value={formData.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input type="tel" className="input-field" placeholder="(555) 123-4567" required value={formData.phone} onChange={e => update('phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input type="date" className="input-field" required value={formData.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Security Number *</label>
            <input type="password" className="input-field" placeholder="XXX-XX-XXXX" required value={formData.ssn} onChange={e => update('ssn', e.target.value)} autoComplete="off" />
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Encrypted and tokenized — never stored in plain text
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver&apos;s License Number *</label>
            <input type="text" className="input-field" required value={formData.driversLicenseNumber} onChange={e => update('driversLicenseNumber', e.target.value)} />
          </div>
          <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">Continue</button>
        </div>
      )}

      {/* Step 2: Address & Employment */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-brand-navy mb-4">Address & Employment</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
            <input type="text" className="input-field" required value={formData.street} onChange={e => update('street', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" className="input-field" required value={formData.city} onChange={e => update('city', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <select className="input-field" required value={formData.state} onChange={e => update('state', e.target.value)}>
                <option value="">Select</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
            <input type="text" className="input-field" placeholder="12345" required value={formData.zipCode} onChange={e => update('zipCode', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income *</label>
            <input type="number" className="input-field" placeholder="75000" required value={formData.annualIncome} onChange={e => update('annualIncome', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Housing Payment *</label>
            <input type="number" className="input-field" placeholder="1500" required value={formData.monthlyHousingPayment} onChange={e => update('monthlyHousingPayment', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Type *</label>
            <select className="input-field" required value={formData.applicationType} onChange={e => update('applicationType', e.target.value)}>
              <option value="auto_loan">Auto Loan</option>
              <option value="vehicle_financing">Vehicle Financing</option>
              <option value="personal_loan">Personal Loan</option>
              <option value="credit_line">Credit Line</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
            <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">Review</button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-brand-navy mb-4">Review Your Application</h3>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <h4 className="font-medium text-gray-900">Personal Information</h4>
            <p><span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}</p>
            <p><span className="text-gray-500">Email:</span> {formData.email}</p>
            <p><span className="text-gray-500">Phone:</span> {formData.phone}</p>
            <p><span className="text-gray-500">DOB:</span> {formData.dateOfBirth}</p>
            <p><span className="text-gray-500">SSN:</span> ***-**-{formData.ssn.replace(/\D/g, '').slice(-4) || '****'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <h4 className="font-medium text-gray-900">Address & Employment</h4>
            <p><span className="text-gray-500">Address:</span> {formData.street}, {formData.city}, {formData.state} {formData.zipCode}</p>
            <p><span className="text-gray-500">Employment:</span> {formData.employmentStatus.replace('_', ' ')}</p>
            <p><span className="text-gray-500">Annual Income:</span> ${Number(formData.annualIncome || 0).toLocaleString()}</p>
            <p><span className="text-gray-500">Monthly Housing:</span> ${Number(formData.monthlyHousingPayment || 0).toLocaleString()}</p>
            <p><span className="text-gray-500">Loan Type:</span> {formData.applicationType.replace('_', ' ')}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">By submitting this application, you agree to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Carbuyinghub.com&apos;s Terms of Service and Privacy Policy</li>
              <li>Allow participating lenders to review your application</li>
              <li>Receive communications about your application status</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
            <button type="submit" disabled={submitting} className="btn-cta flex-1 disabled:opacity-50">
              {submitting ? 'Submitting Securely...' : 'Submit Application'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
