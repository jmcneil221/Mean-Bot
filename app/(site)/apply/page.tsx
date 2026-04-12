import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CreditApplicationForm from '../../components/CreditApplicationForm';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Apply for Credit',
  description: 'Submit a secure online credit application. Bank-level encryption protects your personal information. All credit levels welcome.',
};

export default async function ApplyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/apply');

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-subheading mb-3">Secure Application</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Apply for Credit
          </h1>
          <p className="text-charcoal/50 max-w-lg mx-auto leading-relaxed">
            One application, multiple lender options. Your information is protected
            with bank-level encryption and tokenization.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-12">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-premium text-gold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            256-bit Encryption
          </span>
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-premium text-gold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            SSN Tokenized
          </span>
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-premium text-gold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            All Credit Levels
          </span>
        </div>

        {/* Form */}
        <CreditApplicationForm />
      </div>
    </div>
  );
}
