import type { Metadata } from 'next';
import Link from 'next/link';
import AnimatedStat from '@/src/components/AnimatedStat';

export const metadata: Metadata = {
  title: 'The CarBuyingHub Founding 30',
  description: "Connecticut's first fully integrated car marketplace. One investment. Zero monthly fees. Forever.",
};

const Diamond = () => <span className="text-[10px] opacity-50">◆</span>;
const Check = () => <span className="text-gold mr-2">✓</span>;
const X = () => <span className="text-burgundy/40 mr-2">✕</span>;

export default function FoundersPage() {
  return (
    <div className="bg-parchment text-charcoal min-h-screen font-sans">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(168,137,107,0.03)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="inline-flex items-center gap-3 bg-charcoal text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-12 border border-gold/20 shadow-xl">
          <Diamond /> Exclusive Investor Opportunity <Diamond />
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
          The CarBuyingHub <br />
          <span className="text-burgundy">Founding 30</span>
        </h1>
        
        <p className="text-lg md:text-xl text-charcoal/60 max-w-2xl mx-auto mb-12 font-light">
          Connecticut&apos;s first fully integrated car marketplace. <br />
          One investment. Zero monthly fees. Forever.
        </p>

        <a href="#execute" className="inline-block bg-charcoal text-white px-10 py-5 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-burgundy hover:-translate-y-1 active:scale-95 shadow-lg">
          Secure Your Rooftop
        </a>
      </section>

      {/* 2. The Problem */}
      <section className="py-24 px-6 bg-white border-y border-[#E8E4DE]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-charcoal/40 text-xs uppercase tracking-[0.2em] font-bold mb-4">The Landscape</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal max-w-2xl mx-auto">
              The Problem with Today&apos;s Platforms
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Runaway Costs', desc: 'Traditional platforms charge $5,000+ per month and raise rates every cycle.' },
              { title: 'Zero ROI Transparency', desc: 'Flat monthly fees with no correlation to cars sold. You pay the same whether you move 10 vehicles or 100.' },
              { title: 'No Early Adopter Loyalty', desc: 'Costs only go up. Founding partners are treated exactly the same as newcomers.' },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-2xl border border-[#E8E4DE] bg-parchment/30 transition-all hover:bg-white hover:shadow-xl">
                <div className="w-10 h-10 rounded-full bg-burgundy/5 text-burgundy flex items-center justify-center mb-6">
                  <X />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal mb-3">{item.title}</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Solution / Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-charcoal/40 text-xs uppercase tracking-[0.2em] font-bold mb-4">The CarBuyingHub Solution</p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal max-w-2xl mx-auto">
              One platform. Inventory, financing, and qualified buyers — unified.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Live Searchable Inventory', desc: 'Every active vehicle rendered instantly from your DMS feed. No batch uploads, no lag, no stale listings.' },
              { title: 'In-line Financing Pre-Qualification', desc: 'Buyers submit secure, tokenized credit applications before they ever walk onto your lot. Your desk gets a deal-ready lead, not a tire-kicker.' },
              { title: 'Qualified Buyer Traffic', desc: 'Regional buyers are routed directly to your team. No aggregator middle-layer siphoning leads to competitors.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-[#E8E4DE] p-8 transition-all hover:border-gold/30 hover:shadow-lg">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-6 text-lg">
                  <Check />
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal mb-3">{item.title}</h3>
                <p className="text-charcoal/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Economics Section */}
      <section className="bg-charcoal text-white py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">Built for the Long Game</h2>
            <p className="text-white/40 uppercase text-[10px] tracking-[0.3em] font-bold">The Economics of Ownership</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {[
              { label: 'Annual Savings', value: '$84,000', sub: 'vs standard sub' },
              { label: 'Projected ROI', value: '≤ 20 Mo', sub: 'per rooftop' },
              { label: 'Monthly Fee', value: '$0', sub: 'Permanently' },
            ].map((stat) => (
              <div key={stat.label} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-center">
                <p className="font-serif text-3xl text-gold mb-2">{stat.value}</p>
                <p className="text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{stat.sub}</p>
              </div>
            ))}
            <div className="p-8 rounded-2xl border border-gold/20 bg-gold/5 text-center">
              <p className="font-serif text-3xl text-gold mb-2">
                <AnimatedStat target={150} prefix="$" />
              </p>
              <p className="text-sm font-medium mb-1">Lifetime Success Fee</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">Locked per sale</p>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid md:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            <div className="bg-charcoal p-12">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-6">Standard Subscription</p>
              <p className="font-serif text-3xl mb-8">$5,000+ <span className="text-sm font-sans opacity-40">/mo</span></p>
              <ul className="space-y-4 text-sm text-white/60">
                <li><X /> Rates rise every cycle</li>
                <li><X /> Fees regardless of sales</li>
                <li><X /> No territory protection</li>
              </ul>
            </div>
            <div className="bg-[#1a1a1a] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 font-serif text-8xl italic text-gold pointer-events-none">30</div>
              <p className="text-gold text-[10px] font-bold uppercase tracking-widest mb-6">Founding 30 Member</p>
              <p className="font-serif text-3xl mb-8">$100,000 <span className="text-sm font-sans opacity-40 text-gold">one-time</span></p>
              <ul className="space-y-4 text-sm">
                <li><Check /> Zero monthly fees — for life</li>
                <li><Check /> Connecticut territory protection</li>
                <li><Check /> Lifetime Founder Badge</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tranche Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-b border-[#E8E4DE]">
        <h3 className="text-center font-serif text-3xl mb-12">Tranche Structure</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-10 rounded-2xl border border-[#E8E4DE] bg-white">
            <p className="text-gold text-xs font-bold uppercase mb-4 tracking-widest">Tranche 1: $50,000</p>
            <p className="font-medium mb-4 italic">Due at Signing</p>
            <p className="text-sm text-charcoal/60 leading-relaxed">
              Funds full UI/UX branding customization and initial inventory ingest. Your digital storefront — built to your brand.
            </p>
          </div>
          <div className="p-10 rounded-2xl border border-gold/20 bg-gold/[0.02]">
            <p className="text-gold text-xs font-bold uppercase mb-4 tracking-widest">Tranche 2: $50,000</p>
            <p className="font-medium mb-4 italic">Due at DMS Integration</p>
            <p className="text-sm text-charcoal/60 leading-relaxed">
              100% of this tranche is pooled across all 30 founders into the <strong className="text-charcoal font-bold">CT Highway Billboard Blitz</strong> — a $1.5M+ coordinated media takeover.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Strict Scarcity */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <p className="text-charcoal/40 text-xs uppercase tracking-[0.2em] font-bold mb-6">Strict Scarcity</p>
        <h2 className="font-serif text-4xl md:text-5xl text-charcoal leading-[1.2] mb-8">
          Strictly Limited to
          <br />
          <span className="text-burgundy">30 Connecticut Rooftops.</span>
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { k: '30', v: 'Total Rooftops' },
            { k: 'CT', v: 'Geographic Lock' },
            { k: '∞', v: 'Founder Badge Duration' },
          ].map(item => (
            <div key={item.v} className="p-8 border border-gold/20 rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <p className="font-serif text-4xl text-gold mb-3">{item.k}</p>
              <p className="text-charcoal/50 text-xs uppercase tracking-[0.2em] font-semibold">{item.v}</p>
            </div>
          ))}
        </div>
        
        <div className="inline-flex items-center gap-4 bg-white border border-[#E8E4DE] rounded-full px-8 py-4 shadow-sm transition-all hover:shadow-md cursor-default">
          <Diamond />
          <p className="text-sm text-charcoal">
            <span className="font-semibold tracking-wide">Lifetime Founder Badge</span>
            <span className="text-charcoal/50 font-light"> &middot; displayed on every listing & dealer profile</span>
          </p>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section id="execute" className="py-24 px-6 text-center border-t border-[#E8E4DE] bg-gradient-to-br from-white to-parchment-dark">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8">Secure Your Territory.</h2>
        <p className="text-charcoal/60 max-w-xl mx-auto mb-12 font-light">
          Once the 30th slot executes Tranche 1, the program closes permanently. Standard dealers will pay the $5K+ monthly fee forever.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a href="mailto:dealers@carbuyinghub.com?subject=Founding%2030%20%E2%80%94%20Execute%20Term%20Sheet" className="bg-charcoal text-white px-10 py-5 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-burgundy shadow-xl">
            Execute Term Sheet
          </a>
          <Link href="/dealers" className="text-charcoal/40 text-xs font-bold uppercase tracking-widest hover:text-charcoal transition-colors">
            Explore Monthly Plans
          </Link>
        </div>
      </section>
    </div>
  );
}
