import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/brand/logo-white.png"
              alt="CarBuyingHub.com"
              width={200}
              height={200}
              className="h-24 w-auto mb-4"
            />
            <h3 className="sr-only">CarBuyingHub.com</h3>
            <p className="text-gray-300 text-sm">
              Your trusted car buying destination. Search vehicles, apply for credit, and connect with dealers — all in one place.
            </p>
          </div>

          {/* Buyers */}
          <div>
            <h4 className="font-semibold mb-4">For Buyers</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/vehicles" className="hover:text-white transition-colors">Search Cars</Link></li>
              <li><Link href="/apply" className="hover:text-white transition-colors">Apply for Credit</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Dealers */}
          <div>
            <h4 className="font-semibold mb-4">For Dealers</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/dealers" className="hover:text-white transition-colors">List Your Inventory</Link></li>
              <li><Link href="/dealers" className="hover:text-white transition-colors">Dealer Plans</Link></li>
              <li><Link href="/dealers" className="hover:text-white transition-colors">Dealer Login</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/legal" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><a href="mailto:support@carbuyinghub.com" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Carbuyinghub.com. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Bank-level encryption protects your data
          </div>
        </div>
      </div>
    </footer>
  );
}
