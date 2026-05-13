'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

export async function updateDealerStatus(dealerId: string, status: string) {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('dealerships')
    .update({ status })
    .eq('id', dealerId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/dealerships');
  revalidatePath('/admin');
  return { success: true };
}
