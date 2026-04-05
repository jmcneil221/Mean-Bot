import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Carbuyinghub.com Terms of Service, Privacy Policy, and legal information.',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-brand-navy mb-8">Legal Information</h1>

        <div className="space-y-12 text-gray-600">
          {/* Terms */}
          <div>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Terms of Service</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p><strong>Last Updated:</strong> April 2026</p>

              <p>
                By accessing or using Carbuyinghub.com (&quot;the Service&quot;), you agree to be bound by these
                Terms of Service. You must be at least 18 years old to use the Service.
              </p>

              <h3 className="font-bold text-gray-900 text-base mt-6">1. Description of Service</h3>
              <p>
                Carbuyinghub.com is an online platform connecting car buyers with dealers and lenders.
                We are not a dealer, lender, or financial institution. We facilitate connections and
                securely process credit applications on behalf of our lending partners.
              </p>

              <h3 className="font-bold text-gray-900 text-base mt-6">2. Credit Applications</h3>
              <p>
                When you submit a credit application, your information is encrypted and tokenized
                using bank-level security (AES-256-GCM). Your Social Security Number is never stored
                in plain text. By submitting an application, you authorize participating lenders to
                review your information for the purpose of evaluating your credit application.
              </p>

              <h3 className="font-bold text-gray-900 text-base mt-6">3. No Guarantee of Approval</h3>
              <p>
                Submitting an application does not guarantee credit approval. All lending decisions are
                made by our partner lenders based on their own underwriting criteria.
              </p>

              <h3 className="font-bold text-gray-900 text-base mt-6">4. Accuracy of Information</h3>
              <p>
                You agree to provide accurate and complete information in your application. Providing
                false information may result in application denial and account termination.
              </p>

              <h3 className="font-bold text-gray-900 text-base mt-6">5. Limitation of Liability</h3>
              <p>
                Carbuyinghub.com provides the Service &quot;as is.&quot; We are not liable for lending decisions,
                vehicle conditions, dealer actions, or any damages arising from use of the Service.
              </p>

              <p className="text-xs text-gray-400 mt-8">
                This is a summary. Full terms will be published before the Service launches.
                Contact <a href="mailto:legal@carbuyinghub.com" className="underline">legal@carbuyinghub.com</a> for questions.
              </p>
            </div>
          </div>

          {/* Privacy */}
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Privacy Policy</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p><strong>Last Updated:</strong> April 2026</p>

              <h3 className="font-bold text-gray-900 text-base mt-6">Data We Collect</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Account information (name, email, phone)</li>
                <li>Credit application data (SSN, DOB, income, address — encrypted and tokenized)</li>
                <li>Vehicle search and browsing history</li>
                <li>Device and usage analytics (anonymized)</li>
              </ul>

              <h3 className="font-bold text-gray-900 text-base mt-6">How We Protect Your Data</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>SSNs are tokenized — never stored in our main database</li>
                <li>AES-256-GCM encryption for all sensitive fields</li>
                <li>TLS 1.3 for all data in transit</li>
                <li>Tamper-evident audit logging for all data access</li>
                <li>SOC 2 and PCI DSS compliant security practices</li>
              </ul>

              <h3 className="font-bold text-gray-900 text-base mt-6">We Never Sell Your Personal Data</h3>
              <p>
                We do not sell, rent, or share your individual personal information with third parties
                for their marketing purposes. Period.
              </p>

              <h3 className="font-bold text-gray-900 text-base mt-6">Your Rights</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Access:</strong> Request a copy of all data we have about you</li>
                <li><strong>Delete:</strong> Request permanent deletion of your data</li>
                <li><strong>Correct:</strong> Update or fix inaccurate information</li>
                <li><strong>Portability:</strong> Download your data in a standard format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>

              <p className="mt-4">
                To exercise any of these rights, email{' '}
                <a href="mailto:privacy@carbuyinghub.com" className="underline">privacy@carbuyinghub.com</a>.
                We respond to all requests within 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
