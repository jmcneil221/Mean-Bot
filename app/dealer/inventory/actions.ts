'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const VALID_STATUSES = ['active', 'pending', 'sold', 'archived'] as const;
type VehicleStatus = (typeof VALID_STATUSES)[number];

export async function updateVehicleStatus(vehicleId: string, status: string) {
  if (!VALID_STATUSES.includes(status as VehicleStatus)) {
    return { success: false, error: 'Invalid status' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('dealership_id, role')
    .eq('id', user.id)
    .single();

  if (!profile?.dealership_id || !['dealer', 'admin'].includes(profile.role)) {
    return { success: false, error: 'Dealer access required' };
  }

  const { error } = await supabase
    .from('vehicles')
    .update({ status })
    .eq('id', vehicleId)
    .eq('dealership_id', profile.dealership_id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dealer/inventory');
  return { success: true };
}
