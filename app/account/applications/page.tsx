import { redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { createClient } from '@/lib/supabase/server';

const STATUS_STYLES: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-800',
  withdrawn: 'bg-gray-100 text-gray-600',
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/account/applications');

  const { data: apps } = await supabase
    .from('credit_applications')
    .select('id, status, ssn_last4, first_name, last_name, submitted_at, requested_amount_cents')
    .order('submitted_at', { ascending: false });

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-brand-charcoal">My applications</h1>
          <Link href="/apply" className="btn-primary text-sm">
            New application
          </Link>
        </div>

        {!apps || apps.length === 0 ? (
          <div className="card bg-white text-center py-12">
            <p className="text-gray-600 mb-4">You haven't submitted any applications yet.</p>
            <Link href="/apply" className="btn-primary inline-block">
              Start your first application
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app) => (
              <div key={app.id} className="card bg-white flex items-center justify-between">
                <div>
                  <div className="font-semibold text-brand-charcoal">
                    {app.first_name} {app.last_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    SSN ending •••{app.ssn_last4} · Submitted{' '}
                    {new Date(app.submitted_at).toLocaleDateString()}
                  </div>
                  {app.requested_amount_cents && (
                    <div className="text-sm text-gray-600 mt-1">
                      Requested: ${(app.requested_amount_cents / 100).toLocaleString()}
                    </div>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    STATUS_STYLES[app.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
