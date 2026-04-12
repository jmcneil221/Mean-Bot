import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminAuditPage() {
  const admin = createAdminClient();

  const { data: events, error } = await admin
    .from('audit_log')
    .select('id, occurred_at, actor_id, action, resource_type, resource_id, metadata')
    .order('occurred_at', { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p className="font-medium">Failed to load audit log</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  const ACTION_COLORS: Record<string, string> = {
    'credit_application.submitted': 'text-blue-700 bg-blue-50',
    'credit_application.pii_viewed': 'text-amber-700 bg-amber-50',
    'credit_application.status_changed': 'text-purple-700 bg-purple-50',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-charcoal">Audit Log</h1>
        <p className="text-sm text-gray-500">Last 100 events</p>
      </div>

      {events && events.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Resource</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(ev.occurred_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${ACTION_COLORS[ev.action] || 'text-gray-700 bg-gray-100'}`}>
                      {ev.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {ev.resource_type && (
                      <>
                        {ev.resource_type}
                        {ev.resource_id && (
                          <span className="text-gray-400 ml-1">
                            {ev.resource_id.slice(0, 8)}...
                          </span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                    {ev.actor_id ? `${ev.actor_id.slice(0, 8)}...` : '\u2014'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                    {ev.metadata ? JSON.stringify(ev.metadata) : '\u2014'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          No audit events recorded yet.
        </div>
      )}
    </div>
  );
}
