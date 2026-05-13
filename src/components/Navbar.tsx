import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NavbarClient } from './NavbarClient';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role ?? null;
  }

  const isDealer = role === 'dealer' || role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#1A1A1A]/[0.06]">
      <nav className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3" aria-label="Home">
            <span className="font-serif text-xl font-bold text-[#1A1A1A] tracking-tight">
              CarBuyingHub
            </span>
          </Link>
          <NavbarClient userEmail={user?.email ?? null} isDealer={isDealer} />
        </div>
      </nav>
    </header>
  );
}