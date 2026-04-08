'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card bg-white text-center">
        <h1 className="text-2xl font-bold text-brand-charcoal mb-4">Check your email</h1>
        <p className="text-gray-600 mb-6">
          If an account exists for <strong>{email}</strong>, we sent you a reset link.
        </p>
        <Link href="/login" className="btn-primary inline-block">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="card bg-white">
      <h1 className="text-2xl font-bold text-brand-charcoal mb-2">Reset your password</h1>
      <p className="text-gray-600 mb-6">Enter your email and we'll send you a reset link.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <div className="mt-6 text-sm text-center text-gray-600">
        Remembered it?{' '}
        <Link href="/login" className="text-brand-burgundy font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
