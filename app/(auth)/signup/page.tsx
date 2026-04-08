'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmation is disabled in Supabase settings, we're signed in already.
    if (data.session) {
      router.push('/');
      router.refresh();
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="card bg-white text-center">
        <h1 className="text-2xl font-bold text-brand-charcoal mb-4">Check your email</h1>
        <p className="text-gray-600 mb-6">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <Link href="/login" className="btn-primary inline-block">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="card bg-white">
      <h1 className="text-2xl font-bold text-brand-charcoal mb-2">Create your account</h1>
      <p className="text-gray-600 mb-6">Start your car buying journey in under a minute.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
          <input
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-field"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-gray-400 text-xs">(min 8 characters)</span>
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By creating an account you agree to our{' '}
          <Link href="/legal" className="underline">Terms</Link> and{' '}
          <Link href="/legal" className="underline">Privacy Policy</Link>.
        </p>
      </form>

      <div className="mt-6 text-sm text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-burgundy font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
