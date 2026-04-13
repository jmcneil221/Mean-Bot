import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dealer Partnership Plans',
  description: 'Exclusive dealer partnerships on CarBuyingHub. Founding 30 early adopter investment for Connecticut dealerships. Zero monthly fees for life.',
};

const standardPlans = [
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
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
            <h2 className="section-heading">Why CarBuyingHub?</h2>
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
                title: 'Eliminate Monthly Overhead',
                desc: 'Founding partners pay zero monthly fees — for life. Replace $36k–$84k in annual platform costs with a one-time investment.',
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

      {/* ────────────────────────────────────────────────────────────── */}
      {/* Founding 30 — $100k Early Adopter Investment                  */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-subheading mb-3">Exclusive Opportunity</p>
            <h2 className="section-heading">Founding 30</h2>
            <p className="text-charcoal/40 text-sm mt-3 max-w-lg mx-auto">
              A limited early-adopter investment for Connecticut Dealer Principals
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-gold/30 bg-gradient-to-br from-white via-white to-parchment shadow-sm">
            {/* Gold corner accents */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-gold/[0.07] to-transparent" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gold/[0.05] to-transparent" />

            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Badge */}
              <div className="flex justify-center mb-10">
                <div className="inline-flex items-center gap-2.5 bg-charcoal text-gold px-5 py-2 rounded-full text-xs font-medium uppercase tracking-premium">
                  <DiamondIcon className="w-3.5 h-3.5" />
                  Strictly Limited — 30 Connecticut Rooftops
                  <DiamondIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Investment headline */}
              <div className="text-center mb-12">
                <p className="text-gold text-xs uppercase tracking-premium font-medium mb-4">
                  Per-Rooftop Investment
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="font-serif text-5xl md:text-6xl font-bold text-charcoal">$100,000</span>
                </div>
                <p className="text-charcoal/40 text-sm mt-2">One-time commitment. Zero monthly fees — forever.</p>
              </div>

              {/* Tranche breakdown */}
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-14">
                <div className="bg-parchment rounded-lg p-6 text-center border border-[#E8E4DE]">
                  <p className="text-xs uppercase tracking-premium text-gold font-medium mb-2">Tranche 1</p>
                  <p className="font-serif text-2xl font-bold text-charcoal mb-1">$50,000</p>
                  <p className="text-charcoal/40 text-xs">Commitment Due Now</p>
                </div>
                <div className="bg-parchment rounded-lg p-6 text-center border border-[#E8E4DE]">
                  <p className="text-xs uppercase tracking-premium text-gold font-medium mb-2">Tranche 2</p>
                  <p className="font-serif text-2xl font-bold text-charcoal mb-1">$50,000</p>
                  <p className="text-charcoal/40 text-xs">Due at Commercial Launch</p>
                </div>
              </div>

              {/* ROI Advantages */}
              <div className="max-w-3xl mx-auto mb-14">
                <p className="text-xs uppercase tracking-premium text-gold font-medium text-center mb-8">
                  Lifetime Founder Advantages
                </p>
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    {
                      title: 'Zero Monthly Fees — For Life',
                      desc: 'Eliminates $36k–$84k in annual platform overhead. Your investment replaces recurring costs permanently.',
                    },
                    {
                      title: 'Locked-In Success Fee',
                      desc: 'Guaranteed $150 per vehicle sold through CarBuyingHub. You only pay when you close — aligned incentives.',
                    },
                    {
                      title: 'Sub-18 Month Projected ROI',
                      desc: 'Based on conservative volume projections for a single Connecticut rooftop. Breakeven accelerates with volume.',
                    },
                    {
                      title: 'Permanent "Lifetime Founder" Badge',
                      desc: 'Displayed on every listing and dealer profile within the CarBuyingHub ecosystem. Builds buyer trust from day one.',
                    },
                    {
                      title: 'Geographic Exclusivity',
                      desc: 'Strictly limited to 30 Connecticut dealerships. Once filled, this tier closes permanently — no exceptions.',
                    },
                    {
                      title: 'Priority Platform Access',
                      desc: 'Unlimited vehicle listings, premium search placement, dedicated account manager, and DMS integration included.',
                    },
                  ].map(item => (
                    <div key={item.title} className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        <DiamondIcon className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-charcoal mb-1">{item.title}</h4>
                        <p className="text-xs text-charcoal/50 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <a
                  href="mailto:dealers@carbuyinghub.com?subject=Founding%2030%20%E2%80%94%20Term%20Sheet%20Request"
                  className="btn-primary"
                >
                  Request Term Sheet
                </a>
                <p className="text-charcoal/30 text-xs mt-4">
                  For Dealer Principals only. Subject to qualification and geographic availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* Standard Plans                                                 */}
      {/* ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#E8E4DE] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-subheading mb-3">Monthly Plans</p>
            <h2 className="section-heading">Dealer Partnership Plans</h2>
            <p className="text-charcoal/40 text-sm mt-3">
              For dealerships outside the Founding 30 program
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {standardPlans.map(plan => (
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
            Whether you&apos;re a Founding 30 candidate or exploring monthly plans,
            our team is here to find the right fit for your dealership.
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
