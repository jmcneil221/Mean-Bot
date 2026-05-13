import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="bg-[#F4F1EA] text-[#1A1A1A]">
      {/* ─── HERO ─── */}
      <section className="min-h-[85vh] flex items-center px-6 md:px-10">
        <div className="max-w-5xl mx-auto w-full py-24 md:py-32">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#1A1A1A]/40 mb-10 font-medium">
            CarBuyingHub
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight font-bold mb-10 max-w-4xl">
            Find the car you want.
            <br />
            <span className="text-[#1A1A1A]/50">Without the noise.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#1A1A1A]/65 leading-relaxed max-w-2xl mb-14 font-light">
            CarBuyingHub connects serious buyers with the right dealership for the
            exact vehicle they&rsquo;re looking for. Submit an availability check or
            high-intent request, and the dealer follows up directly. No spam.
            No auctioning your information across multiple lots.
          </p>

          <Link
            href="/vehicles"
            className="group inline-flex items-center gap-3 bg-[#1A1A1A] text-[#F4F1EA] px-8 py-4 rounded-sm
                       text-sm uppercase tracking-[0.2em] font-medium
                       transition-all duration-300 ease-out
                       hover:bg-[#6B1D2F] hover:gap-5
                       focus:outline-none focus:ring-2 focus:ring-[#A8896B] focus:ring-offset-2 focus:ring-offset-[#F4F1EA]"
          >
            Find Your Vehicle
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="border-t border-[#1A1A1A]/10 px-6 md:px-10">
        <div className="max-w-5xl mx-auto py-24 md:py-32">
          <div className="mb-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#A8896B] font-medium mb-4">
              How It Works
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight max-w-2xl">
              Three steps. No surprises.
            </h2>
          </div>

          <ol className="space-y-16 md:space-y-20">
            {[
              {
                num: '01',
                title: 'Choose the vehicle',
                body: 'Browse available inventory and select the car that matches what you’re looking for.',
              },
              {
                num: '02',
                title: 'Send a private request',
                body: 'Check availability or let the dealer know you’re ready to take the next step. No payment is collected through CarBuyingHub, and your request does not guarantee the vehicle is held.',
              },
              {
                num: '03',
                title: 'Work directly with the dealer',
                body: 'The dealership receives your request and contacts you to confirm availability, answer questions, and discuss next steps.',
              },
            ].map((step) => (
              <li
                key={step.num}
                className="grid md:grid-cols-12 gap-6 md:gap-10 items-baseline border-t border-[#1A1A1A]/10 pt-10"
              >
                <div className="md:col-span-2">
                  <p className="font-serif text-3xl md:text-4xl font-bold text-[#1A1A1A]/30">
                    {step.num}
                  </p>
                </div>
                <div className="md:col-span-10 max-w-2xl">
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-[#1A1A1A]/60 leading-relaxed font-light">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── CLOSING TAGLINE ─── */}
      <section className="border-t border-[#1A1A1A]/10 px-6 md:px-10">
        <div className="max-w-5xl mx-auto py-24 md:py-32 text-center">
          <p className="font-serif text-2xl md:text-4xl italic text-[#1A1A1A]/70 leading-relaxed tracking-tight">
            A calmer path to the right car.
          </p>
        </div>
      </section>
    </main>
  );
}