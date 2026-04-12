import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const VALID_STATUSES = ['draft', 'submitted', 'reviewing', 'approved', 'denied', 'withdrawn'];

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  submitted: ['reviewing', 'denied'],
  reviewing: ['approved', 'denied'],
  draft: ['submitted'],
};

export async function POST(request: NextRequest) {
  try {
    // Auth: must be admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { applicationId, newStatus } = await request.json();
    if (!applicationId || !newStatus) {
      return NextResponse.json({ success: false, error: 'applicationId and newStatus required' }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json({ success: false, error: `Invalid status: ${newStatus}` }, { status: 400 });
    }

    const admin = createAdminClient();

    // Fetch current status to enforce transition rules
    const { data: app, error: fetchErr } = await admin
      .from('credit_applications')
      .select('status, ssn_last4')
      .eq('id', applicationId)
      .single();

    if (fetchErr || !app) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    const allowed = ALLOWED_TRANSITIONS[app.status] || [];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: `Cannot transition from "${app.status}" to "${newStatus}"` },
        { status: 400 },
      );
    }

    // Update
    const { error: updateErr } = await admin
      .from('credit_applications')
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', applicationId);

    if (updateErr) {
      console.error('[admin/update-status] update failed', updateErr);
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    // Audit log
    await admin.from('audit_log').insert({
      actor_id: user.id,
      action: `credit_application.status_changed`,
      resource_type: 'credit_application',
      resource_id: applicationId,
      metadata: {
        from: app.status,
        to: newStatus,
        ssn_last4: app.ssn_last4,
      },
      hash: `audit-${Date.now()}`, // placeholder
    });

    return NextResponse.json({ success: true, status: newStatus });
  } catch (e) {
    console.error('[admin/update-status] error', e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
