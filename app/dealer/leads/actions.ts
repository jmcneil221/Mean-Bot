'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('leads').update({ status }).eq('id', leadId);
  if (error) return { success: false };
  revalidatePath('/dealer/leads');
  return { success: true };
}
