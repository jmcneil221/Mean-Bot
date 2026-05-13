import Link from 'next/link';

export const metadata = {
  title: 'How It Works | CarBuyingHub',
  description: 'The premier concierge vehicle purchasing experience.',
};

export default function HowItWorksPage() {
  return (
    <main className="bg-[#F4F1EA] text-[#1A1A1A] font-sans pb-0 selection:bg-[#6B1D2F] selection:text-[#F4F1EA]">
      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 px-6 md:px-10 border-b border-[#1A1A1A]/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#A8896B] font-medium mb-6">
            The Methodology
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            The White-Glove Standard.
          </h1>
          <p className="text-lg md:text-xl text-[#1A1A1A]/60 font-light max-w-2xl mx-auto leading-relaxed">
            We believe acquiring a premium vehicle should feel like a curated concierge service, not a high-pressure transaction. Here is how we remove the noise.
          </p>
        </div>
      </section>

      {/* ─── THE STEPS ─── */}
      <section className="py-24 px-6 md:px-10 max-w-5xl mx-auto">
        <div className="space-y-32">
          
          {/* Step 01 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-serif text-8xl text-[#A8896B]/20 font-bold block mb-4 select-none">01</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Anonymous Discovery</h2>
              <p className="text-[#1A1A1A]/60 leading-relaxed font-light mb-6">
                Browse our exclusive network of top-tier Connecticut rooftops entirely under the radar. No required sign-ups to view inventory, no lead forms blocking your path, and no sudden phone calls interrupting your day.
              </p>
            </div>
            <div className="bg-[#1A1A1A]/[0.03] aspect-square rounded-sm border border-[#1A1A1A]/10 flex items-center justify-center p-10 shadow-inner">
               <p className="font-serif text-2xl text-[#1A1A1A]/30 italic text-center">Curated<br/>Inventory</p>
            </div>
          </div>

          {/* Step 02 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-[#1A1A1A]/[0.03] aspect-square rounded-sm border border-[#1A1A1A]/10 flex items-center justify-center p-10 shadow-inner">
               <p className="font-serif text-2xl text-[#1A1A1A]/30 italic text-center">Zero-Liability<br/>Review</p>
            </div>
            <div className="order-1 md:order-2">
              <span className="font-serif text-8xl text-[#A8896B]/20 font-bold block mb-4 select-none">02</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Private Pre-Qualification</h2>
              <p className="text-[#1A1A1A]/60 leading-relaxed font-light mb-6">
                Understand your exact purchasing power without exposing your most sensitive data. We utilize a zero-liability pre-qualification model—meaning you see real terms with absolutely no SSN required and zero impact on your credit score.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-serif text-8xl text-[#A8896B]/20 font-bold block mb-4 select-none">03</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Direct Connection</h2>
              <p className="text-[#1A1A1A]/60 leading-relaxed font-light mb-6">
                When you are ready to move forward, you bypass the traditional BDC funnel entirely. We connect you directly with a dedicated client advisor at the dealership to finalize your terms and arrange your delivery.
              </p>
            </div>
            <div className="bg-[#1A1A1A]/[0.03] aspect-square rounded-sm border border-[#1A1A1A]/10 flex items-center justify-center p-10 shadow-inner">
               <p className="font-serif text-2xl text-[#1A1A1A]/30 italic text-center">Direct<br/>Engagement</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[#1A1A1A] text-[#F4F1EA] py-32 px-6 md:px-10 text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8">Ready to experience the difference?</h2>
        <Link 
          href="/vehicles" 
          className="inline-block bg-[#F4F1EA] text-[#1A1A1A] px-10 py-5 rounded-sm text-[11px] uppercase tracking-[0.2em] font-medium transition-colors hover:bg-[#A8896B] hover:text-[#F4F1EA]"
        >
          Browse Inventory
        </Link>
      </section>
    </main>
  );
}