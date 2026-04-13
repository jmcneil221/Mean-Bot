import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dealer Partnership Plans',
  description: 'List your inventory on Carbuyinghub.com. Reach qualified car buyers with secure credit applications. Founding 30 CT dealer spots now open.',
};

const plans = [
  {
    tier: 'founding',
    name: 'Founding 30',
    subtitle: 'Connecticut Launch Partners',
    price: 0,
    priceNote: 'Free for 6 months',
    features: [
      'Up to 50 vehicle listings',
      'Receive credit applications',
      'Featured "Founding Dealer" badge',
      'Priority search placement',
      'Lead management dashboard',
      'Monthly analytics report',
      'Locked-in rate of $99/mo after trial',
    ],
    cta: 'Claim Your Spot',
    limit: 'Limited to 30 CT dealers',
  },
  {
    tier: 'boutique',
    name: 'Boutique',
    subtitle: 'Independent Dealers',
    price: 149,
    priceNote: '/month',
    features: [
      'Up to 25 vehicle listings',
      'Receive credit applications',
      'Dealer profile page',
      'In-app messaging with buyers',
      'Monthly analytics report',
    ],
    cta: 'Get Started',
    limit: null,
  },
  {
    tier: 'small',
    name: 'Small Lot',
    subtitle: 'Growing Dealerships',
    price: 299,
    priceNote: '/month',
    features: [
      'Up to 100 vehicle listings',
      'Featured search placement',
      'Lead management dashboard',
      'In-app messaging with buyers',
      'Weekly analytics',
      'Inventory management tools',
    ],
    cta: 'Get Started',
    limit: null,
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Multi-Location Groups',
    price: null,
    priceNote: 'Custom pricing',
    features: [
      'Unlimited vehicle listings',
      'Premium search placement',
      'DMS integration',
      'API access',
      'Dedicated account manager',
      'Custom branding',
      'Multi-location support',
    ],
    cta: 'Contact Sales',
    limit: null,
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function DealersPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-subheading mb-4">Dealer Partnerships</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-charcoal leading-[1.1] mb-6">
            Grow Your Dealership
          </h1>
          <p className="text-lg text-charcoal/50 leading-relaxed max-w-2xl mx-auto mb-10">
            Reach thousands of qualified buyers with pre-submitted credit applications.
            Lower cost per lead than legacy platforms — built for modern dealers.
          </p>
          <a href="mailto:dealers@carbuyinghub.com" className="btn-primary">
            Partner With Us
          </a>
        </div>
      </section>

      {/* Why */}
      <section className="border-y border-[#E8E4DE] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-subheading mb-3">The Advantage</p>
            <h2 className="section-heading">Why Carbuyinghub.com?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Pre-Qualified Buyers',
                desc: 'Buyers submit credit applications before contacting you — no more tire kickers.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                ),
              },
              {
                title: 'Lower Cost Per Lead',
                desc: 'Plans starting at $149/month. A fraction of what AutoTrader or Cars.com charge per listing.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Secure & Compliant',
                desc: 'Bank-level AES-256 encryption for all credit data. Tokenized SSN storage. Full audit trail.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ),
              },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-2">{item.title}</h3>
                <p className="text-charcoal/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-subheading mb-3">Membership Tiers</p>
            <h2 className="section-heading">Dealer Partnership Plans</h2>
          </div>

          {/* Founding 30 — Featured Card */}
          <div className="mb-12">
            <div className="card relative overflow-hidden border-gold/40 bg-gradient-to-br from-white to-parchment">
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/10 to-transparent" />

              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-premium mb-4">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Limited — 30 Spots
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-charcoal mb-1">
                    Founding 30
                  </h3>
                  <p className="text-gold text-sm font-medium mb-3">Connecticut Launch Partners</p>
                  <p className="text-charcoal/50 text-sm leading-relaxed max-w-lg mb-6">
                    Be among the first 30 Connecticut dealers on CarBuyingHub. Get six months free
                    with a locked-in rate after — and a permanent &quot;Founding Dealer&quot; badge
                    that builds trust with every buyer who sees your listings.
                  </p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-serif text-4xl font-bold text-charcoal">$0</span>
                    <span className="text-charcoal/40 text-sm">for 6 months, then $99/mo</span>
                  </div>
                  <a href="mailto:dealers@carbuyinghub.com?subject=Founding%2030%20Application" className="btn-primary">
                    Claim Your Spot
                  </a>
                </div>
                <div className="flex-1">
                  <ul className="space-y-3">
                    {plans[0].features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-sm text-charcoal/70">
                        <CheckIcon className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Standard Plans */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.slice(1).map(plan => (
              <div key={plan.name} className="card flex flex-col">
                <div className="mb-6">
                  <h3 className="font-serif text-xl font-bold text-gold mb-0.5">{plan.name}</h3>
                  <p className="text-xs text-charcoal/40 uppercase tracking-premium">{plan.subtitle}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  {plan.price !== null ? (
                    <>
                      <span className="font-serif text-3xl font-bold text-charcoal">${plan.price}</span>
                      <span className="text-charcoal/40 text-sm">{plan.priceNote}</span>
                    </>
                  ) : (
                    <span className="font-serif text-xl font-bold text-charcoal">{plan.priceNote}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-charcoal/60">
                      <CheckIcon className="w-4 h-4 text-charcoal/30 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:dealers@carbuyinghub.com"
                  className={plan.tier === 'enterprise' ? 'btn-secondary text-center' : 'btn-primary text-center'}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-charcoal py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-gold text-xs uppercase tracking-premium font-medium mb-3">
            Ready to Grow?
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-white/40 mb-10 leading-relaxed">
            Have questions about which plan is right for your dealership?
            Our team is here to help you find the perfect fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:dealers@carbuyinghub.com" className="btn-primary">
              Contact Our Team
            </a>
            <Link href="/about" className="inline-flex items-center justify-center bg-transparent text-white border border-white/20 px-7 py-3 rounded text-sm font-medium uppercase tracking-premium transition-all duration-300 hover:bg-white/10">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
