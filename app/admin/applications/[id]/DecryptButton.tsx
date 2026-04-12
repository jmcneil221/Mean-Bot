'use client';

import { useState } from 'react';

interface DecryptedPII {
  ssn?: string;
  dateOfBirth?: string;
  address?: { street: string; city: string; state: string; zipCode: string };
  employment?: { status: string; employer?: string; jobTitle?: string; yearsEmployed?: string };
}

export default function DecryptButton({
  applicationId,
  adminId,
}: {
  applicationId: string;
  adminId: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DecryptedPII | null>(null);
  const [error, setError] = useState('');

  async function handleReveal() {
    if (revealed) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, adminId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || 'Decryption failed');
        return;
      }
      setData(json.data);
      setRevealed(true);
    } catch {
      setError('Network error — could not decrypt.');
    } finally {
      setLoading(false);
    }
  }

  if (!revealed) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-500 mb-4">
          Sensitive fields (full SSN, DOB, address, employment) are encrypted at rest.
          Clicking below will decrypt them and log this access to the audit trail.
        </p>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button
          onClick={handleReveal}
          disabled={loading}
          className="bg-brand-burgundy text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Decrypting...' : 'Reveal Encrypted Fields'}
        </button>
      </div>
    );
  }

  const formatSSN = (ssn: string) =>
    ssn.length === 9 ? `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}` : ssn;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        This access has been recorded in the audit log.
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {data?.ssn && (
          <div>
            <dt className="text-gray-500">Full SSN</dt>
            <dd className="text-gray-900 font-mono font-medium">{formatSSN(data.ssn)}</dd>
          </div>
        )}
        {data?.dateOfBirth && (
          <div>
            <dt className="text-gray-500">Date of Birth</dt>
            <dd className="text-gray-900">{data.dateOfBirth}</dd>
          </div>
        )}
        {data?.address && (
          <div className="sm:col-span-2">
            <dt className="text-gray-500">Address</dt>
            <dd className="text-gray-900">
              {data.address.street}, {data.address.city}, {data.address.state} {data.address.zipCode}
            </dd>
          </div>
        )}
        {data?.employment && (
          <div className="sm:col-span-2">
            <dt className="text-gray-500">Employment</dt>
            <dd className="text-gray-900 capitalize">
              {data.employment.status}
              {data.employment.employer && ` at ${data.employment.employer}`}
              {data.employment.jobTitle && ` — ${data.employment.jobTitle}`}
              {data.employment.yearsEmployed && ` (${data.employment.yearsEmployed} yrs)`}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
