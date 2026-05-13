import Link from 'next/link';

export default function Footer() {
  const linkClass =
    'text-sm text-white/40 hover:text-white transition-colors duration-200';

  return (
    <footer className="bg-[#1A1A1A] text-white font-sans">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="text-lg font-bold tracking-wider mb-4">CarBuyingHub</p>
            <p className="text-sm text-white/35 leading-relaxed max-w-sm font-light">
              Connecting serious buyers with the right dealership — directly,
              privately, and without the noise.
            </p>
          </div>
          <div className="md:col-span-2 md:col-start-7">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 font-medium mb-5">Buyers</p>
            <ul className="space-y-3">
              <li><Link href="/vehicles" className={linkClass}>Inventory</Link></li>
              <li><Link href="/about" className={linkClass}>How It Works</Link></li>
              <li><a href="mailto:support@carbuyinghub.com" className={linkClass}>Contact Us</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 font-medium mb-5">Dealers</p>
            <ul className="space-y-3">
              <li><Link href="/login" className={linkClass}>Dealer Login</Link></li>
              <li><Link href="/partners" className={linkClass}>Become a Partner</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 font-medium mb-5">Legal</p>
            <ul className="space-y-3">
              <li><Link href="/legal/terms" className={linkClass}>Terms</Link></li>
              <li><Link href="/legal/privacy" className={linkClass}>Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.06] mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20 font-light">&copy; {new Date().getFullYear()} CarBuyingHub. All rights reserved.</p>
          <p className="text-xs text-white/20 font-light italic">A calmer path to the right car.</p>
        </div>
      </div>
    </footer>
  );
}