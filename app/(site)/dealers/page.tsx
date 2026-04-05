import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Dealers',
  description: 'List your inventory on Carbuyinghub.com. Reach qualified car buyers with secure credit applications. Plans starting at $99/month.',
};

const plans = [
  {
    name: 'Basic',
    price: 99,
    features: ['Up to 25 vehicle listings', 'Receive credit applications', 'Basic dealer profile', 'Monthly analytics report'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 299,
    features: ['Up to 100 vehicle listings', 'Featured search placement', 'In-app messaging with buyers', 'Lead management dashboard', 'Weekly analytics', 'Inventory management tools'],
    cta: 'Most Popular',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 799,
    features: ['Unlimited vehicle listings', 'Premium search placement', 'DMS integration', 'API access', 'Dedicated account manager', 'Custom branding', 'Multi-location support'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function DealersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Grow Your Dealership</h1>
          <p className="text-xl text-gray-300 mb-8">
            Reach thousands of qualified buyers with pre-submitted credit applications.
            Lower cost per lead than AutoTrader or Cars.com.
          </p>
          <a href="mailto:dealers@carbuyinghub.com" className="btn-cta inline-block">
            Partner With Us
          </a>
        </div>
      </section>

      {/* Why */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Why Carbuyinghub.com?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Pre-Qualified Buyers', desc: 'Buyers submit credit applications before contacting you — no more tire kickers.', icon: '&#10003;' },
              { title: 'Lower Cost Per Lead', desc: 'Plans starting at $99/month. A fraction of what legacy platforms charge.', icon: '$' },
              { title: 'Secure & Compliant', desc: 'Bank-level encryption for all credit data. PCI DSS and SOC 2 compliant.', icon: '&#128274;' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Dealer Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map(plan => (
              <div key={plan.name} className={`card ${plan.highlighted ? 'ring-2 ring-brand-blue' : ''}`}>
                {plan.highlighted && (
                  <div className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-brand-navy">{plan.name}</h3>
                <p className="text-4xl font-bold text-brand-blue mt-2 mb-1">${plan.price}<span className="text-lg text-gray-500 font-normal">/mo</span></p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-brand-green shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:dealers@carbuyinghub.com" className={`block text-center mt-8 ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
