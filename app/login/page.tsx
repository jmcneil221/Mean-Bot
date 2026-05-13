import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DealerLoginForm } from './DealerLoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign In — CarBuyingHub',
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already logged in — send to dashboard
  if (user) redirect('/dealer');

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-premium text-gold font-medium mb-3">
            Dealer Portal
          </p>
          <h1 className="font-serif text-3xl font-bold text-charcoal">
            CarBuyingHub
          </h1>
        </div>

        <Suspense
          fallback={
            <div className="card animate-pulse">
              <div className="h-8 bg-parchment rounded w-1/2 mb-6" />
              <div className="space-y-4">
                <div className="h-12 bg-parchment rounded" />
                <div className="h-12 bg-parchment rounded" />
                <div className="h-12 bg-parchment rounded" />
              </div>
            </div>
          }
        >
          <DealerLoginForm />
        </Suspense>

        <p className="text-xs text-charcoal/30 text-center mt-8 leading-relaxed max-w-xs mx-auto">
          This portal is for authorized CarBuyingHub dealer partners.
          Contact us if you need access.
        </p>
      </div>
    </div>
  );
}