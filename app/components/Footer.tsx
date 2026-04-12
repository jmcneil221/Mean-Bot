import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src="/brand/logo-white.png"
              alt="CarBuyingHub.com"
              width={180}
              height={180}
              className="h-20 w-auto mb-5"
            />
            <p className="text-white/50 text-sm leading-relaxed">
              Your trusted destination for finding the perfect vehicle and securing financing — all in one place.
            </p>
          </div>

          {/* Buyers */}
          <div>
            <h4 className="text-xs uppercase tracking-premium text-white/40 mb-5 font-sans font-medium">
              For Buyers
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/vehicles" className="text-white/60 hover:text-white transition-colors duration-200">Search Vehicles</Link></li>
              <li><Link href="/apply" className="text-white/60 hover:text-white transition-colors duration-200">Apply for Credit</Link></li>
              <li><Link href="/about" className="text-white/60 hover:text-white transition-colors duration-200">How It Works</Link></li>
            </ul>
          </div>

          {/* Dealers */}
          <div>
            <h4 className="text-xs uppercase tracking-premium text-white/40 mb-5 font-sans font-medium">
              For Dealers
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/dealers" className="text-white/60 hover:text-white transition-colors duration-200">List Your Inventory</Link></li>
              <li><Link href="/dealers" className="text-white/60 hover:text-white transition-colors duration-200">Dealer Plans</Link></li>
              <li><Link href="/dealers" className="text-white/60 hover:text-white transition-colors duration-200">Dealer Login</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-premium text-white/40 mb-5 font-sans font-medium">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/legal" className="text-white/60 hover:text-white transition-colors duration-200">Terms of Service</Link></li>
              <li><Link href="/legal" className="text-white/60 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><a href="mailto:support@carbuyinghub.com" className="text-white/60 hover:text-white transition-colors duration-200">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Carbuyinghub.com. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-white/30">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Bank-level encryption protects your data
          </div>
        </div>
      </div>
    </footer>
  );
}
