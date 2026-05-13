import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createClient } from '@/lib/supabase/server';

const DEV_PROFILE = {
  full_name: 'Dev User',
  email: 'dev@localhost',
  phone: '555-0000',
  role: 'admin',
  created_at: new Date().toISOString(),
};

export default async function AccountPage() {
  const isBypass = process.env.DEV_BYPASS_AUTH === 'true';
  let user: any = null;
  let profile: any = null;

  if (isBypass) {
    user = { id: 'dev-admin-local', email: 'dev@localhost' };
    profile = DEV_PROFILE;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (!user) redirect('/login?next=/account');

    const { data: p } = await supabase
      .from('profiles')
      .select('full_name, email, phone, role, created_at')
      .eq('id', user.id)
      .single();
    profile = p;
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#F4F1EA] text-[#1A1A1A] min-h-screen py-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-3">
              My Account
            </h1>
            <p className="text-base text-[#1A1A1A]/60 font-light">
              {user.email}
            </p>
          </header>

          {isBypass && (
            <div className="bg-[#1A1A1A]/[0.02] border border-[#1A1A1A]/10 p-4 text-xs tracking-[0.05em] text-[#1A1A1A]/60 mb-10">
              Dev bypass active — running without Supabase auth.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-12">
            {/* Profile Info */}
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-[#A8896B] font-medium mb-6">
                Profile Details
              </h2>
              <div className="border-t border-[#1A1A1A]/10">
                <dl className="divide-y divide-[#1A1A1A]/10">
                  <div className="py-5 flex justify-between">
                    <dt className="text-sm text-[#1A1A1A]/60 font-light">Name</dt>
                    <dd className="text-sm font-medium">{profile?.full_name || '—'}</dd>
                  </div>
                  <div className="py-5 flex justify-between">
                    <dt className="text-sm text-[#1A1A1A]/60 font-light">Email</dt>
                    <dd className="text-sm font-medium">{profile?.email || user.email}</dd>
                  </div>
                  <div className="py-5 flex justify-between">
                    <dt className="text-sm text-[#1A1A1A]/60 font-light">Phone</dt>
                    <dd className="text-sm font-medium">{profile?.phone || '—'}</dd>
                  </div>
                  <div className="py-5 flex justify-between">
                    <dt className="text-sm text-[#1A1A1A]/60 font-light">Role</dt>
                    <dd className="text-sm font-medium capitalize">{profile?.role || 'buyer'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-[#A8896B] font-medium mb-6">
                Quick Links
              </h2>
              <ul className="space-y-4 border-t border-[#1A1A1A]/10 pt-5">
                <li>
                  <Link 
                    href="/vehicles" 
                    className="group inline-flex items-center gap-2 text-sm text-[#1A1A1A] transition-colors hover:text-[#6B1D2F]"
                  >
                    Browse inventory
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </li>
                {profile?.role === 'dealer' && (
                  <li>
                    <Link 
                      href="/dealer" 
                      className="group inline-flex items-center gap-2 text-sm text-[#1A1A1A] transition-colors hover:text-[#6B1D2F]"
                    >
                      Dealer Dashboard
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </li>
                )}
                <li>
                  <form action="/auth/signout" method="post">
                    <button type="submit" className="text-sm text-[#6B1D2F] hover:text-[#1A1A1A] transition-colors mt-4">
                      Sign out
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}