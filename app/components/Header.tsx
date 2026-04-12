import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import HeaderNav from './HeaderNav';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check admin role for showing Admin link
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    isAdmin = profile?.role === 'admin';
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[#E8E4DE] sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="CarBuyingHub.com home">
            <Image
              src="/brand/logo-icon.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-10 w-10"
            />
            <span className="text-lg font-serif font-bold text-charcoal hidden sm:inline tracking-tight">
              CarBuyingHub
            </span>
          </Link>

          {/* Navigation */}
          <HeaderNav userEmail={user?.email ?? null} isAdmin={isAdmin} />
        </div>
      </nav>
    </header>
  );
}
