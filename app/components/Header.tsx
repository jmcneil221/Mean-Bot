import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import HeaderNav from './HeaderNav';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3" aria-label="CarBuyingHub.com home">
            <Image
              src="/brand/logo-icon.png"
              alt=""
              width={44}
              height={44}
              priority
              className="h-11 w-11"
            />
            <span className="text-xl font-bold text-brand-charcoal hidden sm:inline">
              CarBuyingHub<span className="text-brand-burgundy">.com</span>
            </span>
          </Link>

          <HeaderNav userEmail={user?.email ?? null} />
        </div>
      </nav>
    </header>
  );
}
