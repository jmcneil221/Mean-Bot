import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Carbuyinghub.com makes car buying transparent, secure, and accessible. Learn about our mission and how we protect your data.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Car Buying, Simplified</h1>
          <p className="text-xl text-gray-300">
            We believe everyone deserves a fair, transparent car buying experience —
            regardless of their credit score.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-3xl mx-auto px-4">
        <div className="space-y-12">
          <div>
            <h2 className="section-heading mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg">
              Carbuyinghub.com was built to solve the biggest pain points in car buying:
              confusing financing, hidden fees, and the stress of not knowing if you&apos;re getting a fair deal.
              We bring everything together — vehicle search, secure credit applications, and trusted
              dealer connections — so you can buy with confidence.
            </p>
          </div>

          <div>
            <h2 className="section-heading mb-4">Why Trust Us</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: 'Bank-Level Security', desc: 'Your SSN is tokenized and encrypted with AES-256. We never store it in plain text.' },
                { title: 'Transparent Pricing', desc: 'AI-powered deal scores tell you if a price is good, fair, or overpriced — before you negotiate.' },
                { title: 'All Credit Welcome', desc: 'First-time buyers, rebuilders, and prime credit — we have lender partners for every situation.' },
                { title: 'Your Data, Your Control', desc: 'View, download, or delete your data at any time. We never sell individual personal information.' },
              ].map(item => (
                <div key={item.title} className="card">
                  <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center py-8">
            <h2 className="section-heading mb-4">Ready to Get Started?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vehicles" className="btn-primary">Search Cars</Link>
              <Link href="/apply" className="btn-secondary">Apply for Credit</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
