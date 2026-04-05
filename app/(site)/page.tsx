import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy via-blue-900 to-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Find Your Perfect Car.
              <br />
              <span className="text-brand-sky">Get Approved Today.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Search thousands of vehicles, apply for credit with bank-level security,
              and connect with trusted dealers — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/vehicles" className="btn-cta text-center">
                Search Cars
              </Link>
              <Link href="/apply" className="bg-white/10 backdrop-blur text-white border border-white/30 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-colors text-center">
                Apply for Credit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              256-bit Encryption
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No Impact on Credit Score to Pre-Qualify
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Trusted Dealer Network
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              All Credit Levels Welcome
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            From search to keys in hand — we make every step simple, transparent, and secure.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Search & Compare',
                description: 'Browse thousands of vehicles from trusted dealers. Filter by price, make, model, year, and location. See AI-powered deal scores instantly.',
                icon: '🔍',
              },
              {
                step: '2',
                title: 'Apply for Credit',
                description: 'Submit one secure application — reach multiple lenders. Your SSN is tokenized and encrypted with bank-level security. All credit levels welcome.',
                icon: '📋',
              },
              {
                step: '3',
                title: 'Connect & Drive',
                description: 'Get matched with the right dealer and financing. Review your offers, pick your car, and drive away with confidence.',
                icon: '🚗',
              },
            ].map((item) => (
              <div key={item.step} className="card text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="inline-block bg-brand-blue text-white text-sm font-bold px-3 py-1 rounded-full mb-3">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-brand-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Data Is Our Top Priority</h2>
            <p className="text-gray-300 text-lg mb-10">
              We handle your personal information with the same security standards used by banks and financial institutions.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {[
                { title: 'AES-256 Encryption', desc: 'Your SSN and financial data are encrypted with military-grade encryption at rest and in transit.' },
                { title: 'Tokenized Storage', desc: 'Your SSN is replaced with a meaningless token — the real number is never stored in our main systems.' },
                { title: 'SOC 2 Compliant', desc: 'We follow SOC 2 security standards for data handling, access controls, and audit logging.' },
                { title: 'CCPA & GDPR Ready', desc: 'You control your data. View it, download it, or delete it anytime — no questions asked.' },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-heading mb-4">Ready to Find Your Next Car?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of buyers who found their perfect vehicle through Carbuyinghub.com.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vehicles" className="btn-cta">Search Cars Now</Link>
            <Link href="/apply" className="btn-secondary">Get Pre-Qualified</Link>
          </div>
        </div>
      </section>
    </>
  );
}
