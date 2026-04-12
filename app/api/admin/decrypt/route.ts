import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { decryptField } from '@/src/security/encryption.js';

export const runtime = 'nodejs';

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

    const { applicationId } = await request.json();
    if (!applicationId) {
      return NextResponse.json({ success: false, error: 'applicationId required' }, { status: 400 });
    }

    const masterKey = process.env.ENCRYPTION_MASTER_KEY;
    if (!masterKey) {
      return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500 });
    }

    const admin = createAdminClient();
    const { data: app, error: fetchErr } = await admin
      .from('credit_applications')
      .select('encrypted_ssn, ssn_last4, encrypted_dob, encrypted_address, encrypted_employment')
      .eq('id', applicationId)
      .single();

    if (fetchErr || !app) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    // Decrypt each field
    let ssn: string | undefined;
    if (app.encrypted_ssn) {
      const payload = JSON.parse(app.encrypted_ssn);
      ssn = decryptField(payload, masterKey);
    }

    let dateOfBirth: string | undefined;
    if (app.encrypted_dob) {
      const payload = JSON.parse(app.encrypted_dob);
      dateOfBirth = decryptField(payload, masterKey);
    }

    let address: object | undefined;
    if (app.encrypted_address) {
      const payload = JSON.parse(app.encrypted_address);
      const raw = decryptField(payload, masterKey);
      try { address = JSON.parse(raw); } catch { address = undefined; }
    }

    let employment: object | undefined;
    if (app.encrypted_employment) {
      const payload = JSON.parse(app.encrypted_employment);
      const raw = decryptField(payload, masterKey);
      try { employment = JSON.parse(raw); } catch { employment = undefined; }
    }

    // Audit log: record this PII access
    await admin.from('audit_log').insert({
      actor_id: user.id,
      action: 'credit_application.pii_viewed',
      resource_type: 'credit_application',
      resource_id: applicationId,
      metadata: {
        ssn_last4: app.ssn_last4,
        fields_decrypted: ['ssn', 'dob', 'address', 'employment'].filter(Boolean),
        ip: request.headers.get('x-forwarded-for')?.split(',')[0] || null,
      },
      hash: `audit-${Date.now()}`, // placeholder
    });

    return NextResponse.json({
      success: true,
      data: { ssn, dateOfBirth, address, employment },
    });
  } catch (e) {
    console.error('[admin/decrypt] error', e);
    return NextResponse.json({ success: false, error: 'Decryption failed' }, { status: 500 });
  }
}
