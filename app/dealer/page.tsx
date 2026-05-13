import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
// Fix: Removed the curly braces around DealerDashboardClient
import DealerDashboardClient from './DealerDashboardClient'; 

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Dealer Dashboard — CarBuyingHub',
};

export type Lead = {
  id: string;
  vehicle_id: string;
  user_id: string | null;
  intent: 'check_availability' | 'reserve';
  full_name: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim: string | null;
    vin: string | null;
  } | null;
};

export default async function DealerDashboardPage() {
  const supabase = await createClient();

  // Auth gate — must be logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Check role (dealer or admin can view)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  const bypassAuth = process.env.DEV_BYPASS_AUTH === 'true';
  if (!bypassAuth && (!profile || !['dealer', 'admin'].includes(profile.role))) {
    redirect('/');
  }

  // Fetch leads with vehicle details
  const { data: leads, error } = await supabase
    .from('reservation_requests')
    .select(`
      id,
      vehicle_id,
      user_id,
      intent,
      full_name,
      email,
      phone,
      message,
      status,
      created_at,
      updated_at,
      vehicle:vehicles (
        year,
        make,
        model,
        trim,
        vin
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch leads:', error);
  }

  const dealerName = profile?.full_name || 'Dealer';

  return (
    <DealerDashboardClient
      leads={(leads as unknown as Lead[]) || []}
      dealerName={dealerName}
    />
  );
}