'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateDealershipSettings(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('dealership_id')
    .eq('id', user.id)
    .single();

  if (!profile?.dealership_id) return { success: false, error: 'No dealership found' };

  const { error } = await supabase
    .from('dealerships')
    .update({
      logo_url: formData.logo_url,
      primary_color: formData.primary_color,
      about_text: formData.about_text,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      address_street: formData.address_street,
      address_city: formData.address_city,
      address_state: formData.address_state,
      address_zip: formData.address_zip
    })
    .eq('id', profile.dealership_id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dealer/settings');
  revalidatePath(`/dealers/${formData.slug}`);
  return { success: true };
}
