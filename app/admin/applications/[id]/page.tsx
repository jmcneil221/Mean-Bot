import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import DecryptButton from './DecryptButton';
import StatusActions from './StatusActions';

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await requireAdmin();

  const admin = createAdminClient();
  const { data: app, error } = await admin
    .from('credit_applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !app) notFound();

  const formatCents = (cents: number | null) =>
    cents == null ? '\u2014' : `$${(cents / 100).toLocaleString('en-US')}`;

  const STATUS_COLORS: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    reviewing: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    denied: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-600',
    draft: 'bg-gray-100 text-gray-500',
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/applications" className="text-sm text-brand-burgundy hover:underline">
          &larr; Back to applications
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">
            {app.first_name} {app.last_name}
          </h1>
          <p className="text-sm text-gray-500 font-mono mt-1">{app.id}</p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-600'}`}>
          {app.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Non-sensitive info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Contact Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="text-gray-900 font-medium">{app.first_name} {app.last_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-900">
                <a href={`mailto:${app.email}`} className="text-brand-burgundy hover:underline">{app.email}</a>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Phone</dt>
              <dd className="text-gray-900">{app.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">SSN</dt>
              <dd className="text-gray-900 font-mono">***-**-{app.ssn_last4}</dd>
            </div>
          </dl>
        </div>

        {/* Financial info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Financial Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Annual Income</dt>
              <dd className="text-gray-900 font-medium">{formatCents(app.annual_income_cents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Requested Amount</dt>
              <dd className="text-gray-900">{formatCents(app.requested_amount_cents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Submitted</dt>
              <dd className="text-gray-900">
                {new Date(app.submitted_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </dd>
            </div>
            {app.reviewed_at && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Reviewed</dt>
                <dd className="text-gray-900">
                  {new Date(app.reviewed_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Encrypted PII — decrypt on demand */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-charcoal">Encrypted PII</h2>
            <p className="text-xs text-gray-400">Every reveal is logged to the audit trail</p>
          </div>
          <DecryptButton applicationId={app.id} adminId={user.id} />
        </div>

        {/* Status actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Actions</h2>
          <StatusActions applicationId={app.id} currentStatus={app.status} />
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Request Metadata</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">IP Address</dt>
              <dd className="text-gray-900 font-mono text-xs">{app.ip_address || '\u2014'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">User Agent</dt>
              <dd className="text-gray-700 text-xs max-w-md truncate">{app.user_agent || '\u2014'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Expires</dt>
              <dd className="text-gray-900 text-xs">
                {new Date(app.expires_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
