'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TRANSITIONS: Record<string, string[]> = {
  submitted: ['reviewing', 'denied'],
  reviewing: ['approved', 'denied'],
  approved: [],
  denied: [],
  withdrawn: [],
  draft: ['submitted'],
};

const ACTION_LABELS: Record<string, { label: string; style: string }> = {
  reviewing: { label: 'Mark as Reviewing', style: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
  approved: { label: 'Approve', style: 'bg-green-600 hover:bg-green-700 text-white' },
  denied: { label: 'Deny', style: 'bg-red-600 hover:bg-red-700 text-white' },
  submitted: { label: 'Move to Submitted', style: 'bg-blue-600 hover:bg-blue-700 text-white' },
};

export default function StatusActions({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const allowed = TRANSITIONS[currentStatus] || [];

  if (allowed.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No status transitions available from <strong className="capitalize">{currentStatus}</strong>.
      </p>
    );
  }

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    setError('');

    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || 'Status update failed');
        return;
      }
      router.refresh();
    } catch {
      setError('Network error — could not update status.');
    } finally {
      setLoading('');
    }
  }

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {allowed.map((status) => {
          const cfg = ACTION_LABELS[status];
          return (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              disabled={!!loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${cfg?.style || 'bg-gray-200 text-gray-700'}`}
            >
              {loading === status ? 'Updating...' : cfg?.label || status}
            </button>
          );
        })}
      </div>
    </div>
  );
}
