import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-3" aria-label="CarBuyingHub.com home">
          <Image src="/brand/logo-icon.png" alt="" width={44} height={44} className="h-11 w-11" />
          <span className="text-xl font-bold text-brand-charcoal">
            CarBuyingHub<span className="text-brand-burgundy">.com</span>
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
