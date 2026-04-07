import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { encryptField } from '@/src/security/encryption.js';
import { TokenVault } from '@/src/security/tokenization.js';

export const runtime = 'nodejs';

// Process-wide token vault, created lazily so the build doesn't crash
// when env vars are absent. In production this lives in a managed KMS / Redis.
let ssnVault: InstanceType<typeof TokenVault> | null = null;
function getVault() {
  if (!ssnVault) ssnVault = new TokenVault(process.env.ENCRYPTION_MASTER_KEY);
  return ssnVault;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors: string[] = [];

    // ---- Server-side validation ----
    if (!body.firstName?.trim()) errors.push('First name is required');
    if (!body.lastName?.trim()) errors.push('Last name is required');
    if (!body.email?.trim()) errors.push('Email is required');
    if (!body.phone?.trim()) errors.push('Phone is required');
    if (!body.dateOfBirth) errors.push('Date of birth is required');
    if (!body.ssn?.trim()) errors.push('SSN is required');
    if (!body.address?.street?.trim()) errors.push('Street address is required');
    if (!body.address?.city?.trim()) errors.push('City is required');
    if (!body.address?.state?.trim()) errors.push('State is required');
    if (!body.address?.zipCode?.trim()) errors.push('ZIP code is required');
    if (!body.employmentStatus) errors.push('Employment status is required');
    if (body.annualIncome == null) errors.push('Annual income is required');

    const cleanSSN = (body.ssn || '').replace(/[\s-]/g, '');
    if (cleanSSN && !/^\d{9}$/.test(cleanSSN)) {
      errors.push('SSN must be exactly 9 digits');
    }

    if (body.dateOfBirth) {
      const dob = new Date(body.dateOfBirth);
      const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) errors.push('Applicant must be at least 18 years old');
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // ---- Auth: must be a logged-in user ----
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, errors: ['You must be signed in to submit an application.'] },
        { status: 401 },
      );
    }

    // ---- Encryption + tokenization ----
    const masterKey = process.env.ENCRYPTION_MASTER_KEY;
    if (!masterKey || masterKey.startsWith('REPLACE_ME')) {
      console.error('ENCRYPTION_MASTER_KEY not configured');
      return NextResponse.json(
        { success: false, errors: ['Server misconfiguration. Try again later.'] },
        { status: 500 },
      );
    }

    const ssnToken = getVault().tokenize(cleanSSN);
    const ssnLast4 = cleanSSN.slice(-4);

    const encryptedDob = JSON.stringify(encryptField(body.dateOfBirth, masterKey));
    const encryptedAddress = JSON.stringify(
      encryptField(JSON.stringify(body.address), masterKey),
    );
    const encryptedEmployment = JSON.stringify(
      encryptField(
        JSON.stringify({
          status: body.employmentStatus,
          employer: body.employer || null,
          jobTitle: body.jobTitle || null,
          yearsEmployed: body.yearsEmployed || null,
        }),
        masterKey,
      ),
    );

    // ---- Persist via service role (bypasses RLS for the audit_log insert) ----
    const admin = createAdminClient();

    const annualIncomeCents = Math.round(Number(body.annualIncome) * 100);
    const requestedAmountCents = body.requestedAmount
      ? Math.round(Number(body.requestedAmount) * 100)
      : null;

    const { data: app, error: insertErr } = await admin
      .from('credit_applications')
      .insert({
        user_id: user.id,
        ssn_token: ssnToken,
        ssn_last4: ssnLast4,
        encrypted_dob: encryptedDob,
        encrypted_address: encryptedAddress,
        encrypted_employment: encryptedEmployment,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone,
        annual_income_cents: annualIncomeCents,
        requested_amount_cents: requestedAmountCents,
        ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || null,
        user_agent: request.headers.get('user-agent') || null,
      })
      .select('id, status, submitted_at')
      .single();

    if (insertErr || !app) {
      console.error('credit_applications insert failed', insertErr);
      return NextResponse.json(
        { success: false, errors: ['Failed to save application.'] },
        { status: 500 },
      );
    }

    // ---- Audit log ----
    await admin.from('audit_log').insert({
      actor_id: user.id,
      action: 'credit_application.submitted',
      resource_type: 'credit_application',
      resource_id: app.id,
      metadata: { ssn_last4: ssnLast4 },
      hash: ssnToken, // placeholder — real chained hash will replace this
    });

    return NextResponse.json({
      success: true,
      applicationId: app.id,
      maskedSSN: `***-**-${ssnLast4}`,
      status: app.status,
      message: 'Credit application submitted securely.',
    });
  } catch (e) {
    console.error('credit-application route error', e);
    return NextResponse.json(
      { success: false, errors: ['Server error. Please try again.'] },
      { status: 500 },
    );
  }
}
