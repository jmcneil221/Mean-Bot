import { redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { createClient } from '@/lib/supabase/server';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone, role, created_at')
    .eq('id', user.id)
    .single();

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-2">My account</h1>
        <p className="text-gray-600 mb-8">{user.email}</p>

        <div className="card bg-white mb-6">
          <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Profile</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="text-gray-900 font-medium">{profile?.full_name || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-900 font-medium">{profile?.email || user.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Phone</dt>
              <dd className="text-gray-900 font-medium">{profile?.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Role</dt>
              <dd className="text-gray-900 font-medium capitalize">{profile?.role || 'buyer'}</dd>
            </div>
          </dl>
        </div>

        <div className="card bg-white">
          <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Quick links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/account/applications" className="text-brand-burgundy hover:underline">
                View my credit applications →
              </Link>
            </li>
            <li>
              <Link href="/apply" className="text-brand-burgundy hover:underline">
                Start a new credit application →
              </Link>
            </li>
            <li>
              <Link href="/vehicles" className="text-brand-burgundy hover:underline">
                Browse vehicles →
              </Link>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
