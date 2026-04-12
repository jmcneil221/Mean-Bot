import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-subheading mb-4">The Modern Way to Buy a Car</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-charcoal leading-[1.1] mb-6">
              Find Your Perfect Car.
              <br />
              <span className="text-burgundy">Get Approved Today.</span>
            </h1>
            <p className="text-lg text-charcoal/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Search thousands of vehicles, apply for credit with bank-level security,
              and connect with trusted dealers — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vehicles" className="btn-primary">
                Search Cars
              </Link>
              <Link href="/apply" className="btn-secondary">
                Apply for Credit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-[#E8E4DE]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-xs uppercase tracking-premium text-charcoal/40">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              256-bit Encryption
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No Credit Impact to Pre-Qualify
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Trusted Dealer Network
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              All Credit Levels Welcome
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-subheading mb-3">Simple Process</p>
            <h2 className="section-heading">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search & Compare',
                description: 'Browse thousands of vehicles from trusted dealers. Filter by price, make, model, and location.',
              },
              {
                step: '02',
                title: 'Apply for Credit',
                description: 'One secure application reaches multiple lenders. Your SSN is tokenized and encrypted with bank-level security.',
              },
              {
                step: '03',
                title: 'Connect & Drive',
                description: 'Get matched with the right dealer and financing. Review offers, pick your car, and drive away with confidence.',
              },
            ].map((item) => (
              <div key={item.step} className="card text-center group">
                <div className="text-gold text-sm font-medium tracking-premium uppercase mb-6">
                  Step {item.step}
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal mb-3">{item.title}</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-charcoal py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-gold text-xs uppercase tracking-premium font-medium mb-3">
              Bank-Level Protection
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Your Data Is Our Top Priority
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              We handle your personal information with the same security standards used by banks and financial institutions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { title: 'AES-256 Encryption', desc: 'Your SSN and financial data are encrypted with military-grade encryption at rest and in transit.' },
              { title: 'Tokenized Storage', desc: 'Your SSN is replaced with a meaningless token — the real number is never stored in our main systems.' },
              { title: 'SOC 2 Compliant', desc: 'We follow SOC 2 security standards for data handling, access controls, and audit logging.' },
              { title: 'CCPA & GDPR Ready', desc: 'You control your data. View it, download it, or delete it anytime — no questions asked.' },
            ].map((item) => (
              <div key={item.title} className="bg-white/[0.04] rounded-lg p-6 border border-white/[0.06]">
                <div className="flex items-center gap-2.5 mb-2">
                  <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-serif text-white font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-subheading mb-3">Get Started</p>
          <h2 className="section-heading mb-4">Ready to Find Your Next Car?</h2>
          <p className="text-charcoal/60 text-lg mb-10 leading-relaxed">
            Join thousands of buyers who found their perfect vehicle through Carbuyinghub.com.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vehicles" className="btn-primary">Search Cars Now</Link>
            <Link href="/apply" className="btn-secondary">Get Pre-Qualified</Link>
          </div>
        </div>
      </section>
    </>
  );
}
