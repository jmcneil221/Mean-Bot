import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-600',
  draft: 'bg-gray-100 text-gray-500',
};

const PAGE_SIZE = 25;

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || '';
  const search = params.q || '';
  const page = Math.max(1, parseInt(params.page || '1', 10));

  const admin = createAdminClient();

  let query = admin
    .from('credit_applications')
    .select(
      'id, first_name, last_name, email, phone, ssn_last4, annual_income_cents, requested_amount_cents, status, submitted_at',
      { count: 'exact' },
    )
    .order('submitted_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }
  if (search) {
    // Search by last name or ssn_last4
    query = query.or(`last_name.ilike.%${search}%,ssn_last4.eq.${search},email.ilike.%${search}%`);
  }

  const { data: apps, count, error } = await query;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p className="font-medium">Failed to load applications</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

  function formatCents(cents: number | null) {
    if (cents == null) return '\u2014';
    return `$${(cents / 100).toLocaleString('en-US')}`;
  }

  function buildUrl(overrides: Record<string, string>) {
    const p = new URLSearchParams();
    if (statusFilter) p.set('status', statusFilter);
    if (search) p.set('q', search);
    p.set('page', String(page));
    for (const [k, v] of Object.entries(overrides)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    return `/admin/applications?${p.toString()}`;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-brand-charcoal">Credit Applications</h1>
        <p className="text-sm text-gray-500">{count || 0} total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form method="get" action="/admin/applications" className="flex gap-2 flex-1">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search by last name, email, or SSN last 4..."
            className="input-field flex-1 text-sm"
          />
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          <button type="submit" className="btn-primary text-sm px-4">Search</button>
        </form>
        <div className="flex gap-2 text-sm">
          <Link
            href={buildUrl({ status: '', page: '1' })}
            className={`px-3 py-2 rounded-lg border transition-colors ${!statusFilter ? 'bg-brand-charcoal text-white border-brand-charcoal' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            All
          </Link>
          {['submitted', 'reviewing', 'approved', 'denied'].map((s) => (
            <Link
              key={s}
              href={buildUrl({ status: s, page: '1' })}
              className={`px-3 py-2 rounded-lg border transition-colors capitalize ${statusFilter === s ? 'bg-brand-charcoal text-white border-brand-charcoal' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      {apps && apps.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">SSN</th>
                <th className="px-4 py-3 font-medium">Income</th>
                <th className="px-4 py-3 font-medium">Requested</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {apps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {app.first_name} {app.last_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{app.email}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">***-**-{app.ssn_last4}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCents(app.annual_income_cents)}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCents(app.requested_amount_cents)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-600'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(app.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/applications/${app.id}`} className="text-brand-burgundy hover:underline text-xs font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          No applications found.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })} className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50">
              Previous
            </Link>
          )}
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={buildUrl({ page: String(page + 1) })} className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
