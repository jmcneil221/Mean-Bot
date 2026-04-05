import type { Metadata } from 'next';
import CreditApplicationForm from '../../components/CreditApplicationForm';

export const metadata: Metadata = {
  title: 'Apply for Credit',
  description: 'Submit a secure online credit application. Bank-level encryption protects your personal information. All credit levels welcome.',
};

export default function ApplyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-brand-navy text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Apply for Credit</h1>
          <p className="text-gray-300 text-lg">
            One application, multiple lender options. Your information is protected with
            bank-level encryption and tokenization.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              256-bit AES Encryption
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              SSN Tokenized — Never Stored Raw
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              All Credit Levels Welcome
            </span>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <CreditApplicationForm />
        </div>
      </section>
    </div>
  );
}
