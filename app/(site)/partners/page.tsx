import Link from 'next/link';

export default function PartnersPage() {
  return (
    <div className="bg-[#F4F1EA] text-[#1A1A1A]">
      {/* ─── HERO ─── */}
      <section className="min-h-[70vh] flex items-center px-6 md:px-10">
        <div className="max-w-5xl mx-auto w-full py-24 md:py-32">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#A8896B] font-medium mb-10">
            Dealer Partnership
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight font-bold mb-10 max-w-4xl">
            Better leads.
            <br />
            <span className="text-[#1A1A1A]/50">Less noise.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#1A1A1A]/65 leading-relaxed max-w-2xl mb-14 font-light">
            CarBuyingHub delivers pre-qualified, high-intent buyers directly to
            your dealership. No bidding wars for leads. No shared contact lists.
            Just serious buyers who already know what they want.
          </p>

          <a
            href="mailto:dealers@carbuyinghub.com?subject=Partnership%20Inquiry"
            className="group inline-flex items-center gap-3 bg-[#1A1A1A] text-[#F4F1EA] px-8 py-4 rounded-sm
                       text-sm uppercase tracking-[0.2em] font-medium
                       transition-all duration-300 ease-out
                       hover:bg-[#6B1D2F] hover:gap-5
                       focus:outline-none focus:ring-2 focus:ring-[#A8896B] focus:ring-offset-2 focus:ring-offset-[#F4F1EA]"
          >
            Become a Partner
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* ─── WHY CARBUYINGHUB ─── */}
      <section className="border-t border-[#1A1A1A]/10 px-6 md:px-10">
        <div className="max-w-5xl mx-auto py-24 md:py-32">
          <div className="mb-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#A8896B] font-medium mb-4">
              The Difference
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
              Built for dealerships that value quality over volume.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                title: 'Exclusive leads',
                body: 'Every buyer request goes to one dealership. Your leads are yours alone — never resold, never shared.',
              },
              {
                title: 'Intent-qualified',
                body: 'Buyers select their intent before reaching out. You see who is checking availability and who is ready to move.',
              },
              {
                title: 'Zero friction',
                body: 'No portal logins to check. Leads arrive by email with full buyer details, vehicle of interest, and intent level.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-xl md:text-2xl font-bold mb-4 leading-tight">
                  {item.title}
                </h3>
                <p className="text-base text-[#1A1A1A]/60 leading-relaxed font-light">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOUNDING DEALER PROGRAM ─── */}
      <section className="px-6 md:px-10">
        <div className="max-w-5xl mx-auto py-24 md:py-32">
          <div className="border border-[#1A1A1A]/[0.08] bg-[#1A1A1A]/[0.02] rounded-sm px-8 md:px-16 py-16 md:py-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#A8896B] font-medium mb-6">
              Limited Availability
            </p>

            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-8 max-w-3xl">
              Founding Dealer Program
            </h2>

            <p className="text-lg md:text-xl text-[#1A1A1A]/65 leading-relaxed max-w-2xl mb-10 font-light">
              We&rsquo;re onboarding a select number of dealerships in each
              market. Founding dealers lock in preferred pricing, receive
              priority placement in buyer search results, and help shape the
              platform as it grows.
            </p>

            <div className="grid sm:grid-cols-3 gap-10 mb-12">
              {[
                { value: 'Locked-in', label: 'Founding rate for life' },
                { value: 'Priority', label: 'Search placement' },
                { value: 'Direct', label: 'Product input' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl md:text-3xl font-bold text-[#6B1D2F] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#1A1A1A]/40 font-light">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="mailto:dealers@carbuyinghub.com?subject=Founding%20Dealer%20Program"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-medium text-[#6B1D2F] transition-colors duration-200 hover:text-[#1A1A1A]"
            >
              Request an invitation
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="border-t border-[#1A1A1A]/10 px-6 md:px-10">
        <div className="max-w-5xl mx-auto py-24 md:py-32">
          <div className="mb-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#A8896B] font-medium mb-4">
              Pricing
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight max-w-2xl">
              Simple, transparent plans.
            </h2>
            <p className="text-lg text-[#1A1A1A]/50 mt-6 max-w-xl font-light">
              No setup fees. No long-term contracts. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                tier: 'Starter',
                price: '$199',
                period: '/mo',
                description: 'For independent dealers testing the waters.',
                features: [
                  'Up to 25 vehicle listings',
                  'Email lead delivery',
                  'Intent-level indicators',
                  'Basic analytics',
                ],
                cta: 'Get Started',
                accent: false,
              },
              {
                tier: 'Growth',
                price: '$499',
                period: '/mo',
                description: 'For dealerships ready to scale qualified leads.',
                features: [
                  'Up to 100 vehicle listings',
                  'Priority search placement',
                  'Real-time lead dashboard',
                  'Lead status management',
                  'Dedicated onboarding',
                ],
                cta: 'Get Started',
                accent: true,
              },
              {
                tier: 'Enterprise',
                price: 'Custom',
                period: '',
                description: 'For dealer groups and high-volume operations.',
                features: [
                  'Unlimited vehicle listings',
                  'Multi-location support',
                  'API & DMS integration',
                  'Custom reporting',
                  'Account manager',
                ],
                cta: 'Contact Us',
                accent: false,
              },
            ].map((plan) => (
              <div
                key={plan.tier}
                className={`rounded-sm px-8 py-10 flex flex-col ${
                  plan.accent
                    ? 'border-2 border-[#1A1A1A] bg-[#1A1A1A]/[0.02]'
                    : 'border border-[#1A1A1A]/[0.08]'
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#A8896B] font-medium mb-6">
                  {plan.tier}
                </p>

                <div className="mb-6">
                  <span className="font-serif text-4xl md:text-5xl font-bold">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-base text-[#1A1A1A]/40 font-light ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#1A1A1A]/50 font-light mb-8 leading-relaxed">
                  {plan.description}
                </p>

                <ul className="space-y-3.5 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-[#1A1A1A]/70 font-light"
                    >
                      <svg
                        className="w-4 h-4 text-[#A8896B] mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={
                    plan.tier === 'Enterprise'
                      ? 'mailto:dealers@carbuyinghub.com?subject=Enterprise%20Inquiry'
                      : 'mailto:dealers@carbuyinghub.com?subject=Partnership%20Inquiry%20-%20' + plan.tier
                  }
                  className={`block text-center text-sm uppercase tracking-[0.2em] font-medium px-6 py-3.5 rounded-sm transition-all duration-200 ${
                    plan.accent
                      ? 'bg-[#1A1A1A] text-[#F4F1EA] hover:bg-[#6B1D2F]'
                      : 'bg-[#1A1A1A]/[0.04] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F4F1EA]'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLOSING CTA ─── */}
      <section className="border-t border-[#1A1A1A]/10 px-6 md:px-10">
        <div className="max-w-5xl mx-auto py-24 md:py-32 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-8">
            Ready to receive better leads?
          </h2>
          <p className="text-lg text-[#1A1A1A]/50 max-w-xl mx-auto mb-12 font-light leading-relaxed">
            Join the dealerships building a quieter, more direct connection with
            serious buyers.
          </p>

          <a
            href="mailto:dealers@carbuyinghub.com?subject=Partnership%20Inquiry"
            className="group inline-flex items-center gap-3 bg-[#1A1A1A] text-[#F4F1EA] px-8 py-4 rounded-sm
                       text-sm uppercase tracking-[0.2em] font-medium
                       transition-all duration-300 ease-out
                       hover:bg-[#6B1D2F] hover:gap-5
                       focus:outline-none focus:ring-2 focus:ring-[#A8896B] focus:ring-offset-2 focus:ring-offset-[#F4F1EA]"
          >
            Get in Touch
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}