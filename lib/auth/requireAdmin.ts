import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Gate for admin-only pages. Call at the top of every /admin/* server component.
 *
 * Returns the authenticated user + their profile if they have role='admin'.
 * Redirects to /login (if unauthenticated) or / (if not an admin).
 *
 * --- Upgrade path to MFA (option B) ---
 * When ready to enforce TOTP on admin sessions, add one check here:
 *
 *   const { data: { session } } = await supabase.auth.getSession();
 *   if (session?.aal !== 'aal2') redirect('/admin/mfa');
 *
 * Because every admin route funnels through this single helper, the
 * MFA gate activates everywhere with that single change.
 */
export async function requireAdmin() {
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
