import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { dealershipName, plan, phone, email, city, state, zip } = body;

    if (!dealershipName || typeof dealershipName !== 'string' || dealershipName.trim().length < 2) {
      return NextResponse.json({ error: 'Dealership name is required (min 2 characters)' }, { status: 400 });
    }

    const validPlans = ['founding_30', 'boutique', 'small', 'enterprise', 'standard'];
    const selectedPlan = validPlans.includes(plan) ? plan : 'standard';

    const admin = createAdminClient();

    const { data: existingProfile } = await admin
      .from('profiles')
      .select('role, dealership_id')
      .eq('id', user.id)
      .single();

    if (existingProfile?.dealership_id) {
      return NextResponse.json(
        { error: 'Account is already linked to a dealership' },
        { status: 409 },
      );
    }

    const baseSlug = toSlug(dealershipName.trim());
    let slug = baseSlug;
    let suffix = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data: existing } = await admin
        .from('dealerships')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!existing) break;
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    }

    const { data: dealership, error: insertErr } = await admin
      .from('dealerships')
      .insert({
        name: dealershipName.trim(),
        slug,
        plan: selectedPlan,
        phone: phone || null,
        email: email || user.email || null,
        city: city || null,
        state: state || 'CT',
        zip: zip || null,
        status: 'pending',
      })
      .select('id, slug')
      .single();

    if (insertErr || !dealership) {
      console.error('[dealers/provision] insert failed', insertErr);
      return NextResponse.json({ error: 'Failed to create dealership' }, { status: 500 });
    }

    const { error: profileErr } = await admin
      .from('profiles')
      .update({
        role: 'dealer',
        dealership_id: dealership.id,
      })
      .eq('id', user.id);

    if (profileErr) {
      console.error('[dealers/provision] profile update failed', profileErr);
      await admin.from('dealerships').delete().eq('id', dealership.id);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    await admin.from('audit_log').insert({
      actor_id: user.id,
      action: 'dealership.provisioned',
      resource_type: 'dealership',
      resource_id: dealership.id,
      metadata: {
        dealership_name: dealershipName.trim(),
        plan: selectedPlan,
        slug: dealership.slug,
      },
      hash: `audit-${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      dealershipId: dealership.id,
      slug: dealership.slug,
    });
  } catch (e) {
    console.error('[dealers/provision] error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
