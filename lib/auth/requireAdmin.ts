import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const DEV_ADMIN = {
  user: { id: 'dev-admin-local', email: 'dev@localhost' } as any,
  profile: { role: 'admin' as const, full_name: 'Dev Admin', email: 'dev@localhost' },
};

export async function requireAdmin() {
  // DEV BYPASS: return mock admin user for local development
  if (process.env.DEV_BYPASS_AUTH === 'true') {
    return DEV_ADMIN;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  return { user, profile };
}