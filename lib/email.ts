// Resend email wrapper.
// All mail the site sends goes through this module so the API key and
// "From" address live in exactly one place.
//
// Env vars required:
//   RESEND_API_KEY         — from https://resend.com/api-keys
//   RESEND_FROM_EMAIL      — optional; defaults to Resend's onboarding sender
//                            until carbuyinghub.com domain DNS verifies.
//   ADMIN_NOTIFY_EMAIL     — where internal "new application" alerts go.
//                            Defaults to jmcneil@carbuyinghub.com if unset.

import { Resend } from 'resend';

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

// Lazy client so missing env vars don't blow up at import time (e.g. during build).
let client: Resend | null = null;
function getClient(): Resend | null {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

function getFrom(): string {
  // Swap to admin@carbuyinghub.com once Cloudflare DNS verifies the Resend domain.
  return process.env.RESEND_FROM_EMAIL || 'CarBuyingHub <onboarding@resend.dev>';
}

function getAdminEmail(): string {
  return process.env.ADMIN_NOTIFY_EMAIL || 'jmcneil@carbuyinghub.com';
}

export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  const resend = getClient();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping send', { subject, to });
    return { skipped: true as const };
  }
  const { data, error } = await resend.emails.send({
    from: "notifications@carbuyinghub.com",
    to,
    subject,
    html,
    replyTo,
  });
  if (error) {
    console.error('[email] send failed', error);
    throw new Error(error.message || 'Email send failed');
  }
  return { id: data?.id };
}

// ---------------------------------------------------------------------------
// Templated messages
// ---------------------------------------------------------------------------

type NewApplicationArgs = {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  ssnLast4: string;
  annualIncome: number;
  requestedAmount: number | null;
  submittedAt: string | Date;
};

/**
 * Internal alert to the CarBuyingHub team that a new credit application
 * was submitted. Contains non-sensitive fields only (SSN last-4, never full SSN).
 */
export async function sendNewApplicationAlert(args: NewApplicationArgs) {
  const submittedAt = new Date(args.submittedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const formatCents = (n: number | null) =>
    n == null ? '—' : `$${n.toLocaleString('en-US')}`;

  return sendEmail({
    to: getAdminEmail(),
    subject: `[CarBuyingHub] New credit application: ${args.applicantName}`,
    replyTo: args.applicantEmail,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f5efe6;">
        <div style="background:#ffffff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;">
          <h1 style="color:#6b1f2a;font-size:20px;margin:0 0 16px;">New credit application</h1>
          <p style="color:#374151;margin:0 0 16px;">A new application has been submitted on carbuyinghub.com.</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
            <tr><td style="padding:6px 0;color:#6b7280;">Application ID</td><td style="padding:6px 0;font-family:monospace;">${args.applicationId}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Name</td><td style="padding:6px 0;"><strong>${args.applicantName}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${args.applicantEmail}" style="color:#6b1f2a;">${args.applicantEmail}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;">${args.applicantPhone}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">SSN</td><td style="padding:6px 0;">***-**-${args.ssnLast4}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Annual income</td><td style="padding:6px 0;">${formatCents(args.annualIncome)}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Requested</td><td style="padding:6px 0;">${formatCents(args.requestedAmount)}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;">Submitted</td><td style="padding:6px 0;">${submittedAt}</td></tr>
          </table>
          <p style="color:#6b7280;font-size:12px;margin:24px 0 0;border-top:1px solid #e5e7eb;padding-top:16px;">
            Sensitive PII (full SSN, date of birth, address, employment details) is tokenized/encrypted
            in Supabase and is not included in this notification.
          </p>
        </div>
      </div>
    `.trim(),
  });
}

/**
 * Confirmation receipt sent to the applicant.
 */
export async function sendApplicationReceipt(args: {
  to: string;
  applicantName: string;
  applicationId: string;
  ssnLast4: string;
}) {
  return sendEmail({
    to: args.to,
    subject: 'We received your CarBuyingHub credit application',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f5efe6;">
        <div style="background:#ffffff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;">
          <h1 style="color:#6b1f2a;font-size:22px;margin:0 0 12px;">Thanks, ${args.applicantName.split(' ')[0]}!</h1>
          <p style="color:#374151;font-size:15px;line-height:1.5;">
            Your credit application has been received and is being reviewed.
            We'll reach out within 1 business day with next steps.
          </p>
          <div style="background:#f9fafb;border-radius:6px;padding:16px;margin:16px 0;">
            <p style="margin:0;color:#6b7280;font-size:13px;">Application ID</p>
            <p style="margin:4px 0 0;font-family:monospace;color:#111827;">${args.applicationId}</p>
            <p style="margin:12px 0 0;color:#6b7280;font-size:13px;">SSN</p>
            <p style="margin:4px 0 0;color:#111827;">***-**-${args.ssnLast4}</p>
          </div>
          <p style="color:#374151;font-size:14px;">
            Your information is protected with bank-level encryption and tokenization.
            We never store your full Social Security Number in plain text.
          </p>
          <p style="color:#6b7280;font-size:12px;margin:24px 0 0;border-top:1px solid #e5e7eb;padding-top:16px;">
            Questions? Reply to this email or contact support@carbuyinghub.com.
          </p>
        </div>
      </div>
    `.trim(),
  });
}
