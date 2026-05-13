import { createClient } from '@/lib/supabase/server';
import { NavbarClient } from './NavbarClient';
import Link from 'next/link';
import Image from 'next/image';

export default async function Navbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  let isDealer = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    isDealer = profile?.role === 'dealer' || profile?.role === 'admin';
  }

  return (
    // Removed absolute/fixed positioning so it behaves normally. 
    // Hardcoded bg-[#F4F1EA] so it flawlessly matches the page body!
    <header className="w-full py-8 px-6 md:px-10 bg-[#F4F1EA]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="CarBuyingHub Logo" 
            width={200} 
            height={45} 
            className="object-contain"
            priority
          />
        </Link>
        <NavbarClient userEmail={user?.email || null} isDealer={isDealer} />
      </div>
    </header>
  );
}