import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import OnboardingFlow from '@/src/components/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Dealer Onboarding — CarBuyingHub',
  description: 'Set up your dealership on CarBuyingHub. Choose your plan, enter your business details, and start receiving qualified leads.',
};

export default async function DealerOnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/dealers/onboarding');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, dealership_id')
    .eq('id', user.id)
    .single();

  if (profile?.dealership_id) {
    redirect('/dealer');
  }

  return (
    <div className="min-h-screen bg-parchment py-20 px-6">
      <div className="text-center mb-4">
        <p className="text-charcoal/40 text-xs uppercase tracking-[0.2em] font-bold mb-4">Dealer Onboarding</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-4">
          Set Up Your Dealership
        </h1>
        <p className="text-charcoal/60 text-lg max-w-xl mx-auto">
          Three quick steps to start receiving qualified buyers on CarBuyingHub.
        </p>
      </div>
      <OnboardingFlow userEmail={user.email || ''} />
    </div>
  );
}
