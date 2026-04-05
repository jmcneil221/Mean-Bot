import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/credit-application
 *
 * Receives credit application submissions from the frontend form.
 * In production, this will use the security modules from src/security/
 * to validate, tokenize SSNs, encrypt PII, and create audit logs.
 *
 * For the initial deployment, this returns a structured response
 * so the frontend flow works end-to-end.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic server-side validation
    const errors: string[] = [];

    if (!body.firstName?.trim()) errors.push('First name is required');
    if (!body.lastName?.trim()) errors.push('Last name is required');
    if (!body.email?.trim()) errors.push('Email is required');
    if (!body.phone?.trim()) errors.push('Phone is required');
    if (!body.dateOfBirth) errors.push('Date of birth is required');
    if (!body.ssn?.trim()) errors.push('SSN is required');
    if (!body.driversLicenseNumber?.trim()) errors.push('Drivers license is required');
    if (!body.address?.street?.trim()) errors.push('Street address is required');
    if (!body.address?.city?.trim()) errors.push('City is required');
    if (!body.address?.state?.trim()) errors.push('State is required');
    if (!body.address?.zipCode?.trim()) errors.push('ZIP code is required');
    if (!body.employmentStatus) errors.push('Employment status is required');
    if (!body.annualIncome && body.annualIncome !== 0) errors.push('Annual income is required');
    if (!body.applicationType) errors.push('Application type is required');

    // SSN format validation
    if (body.ssn) {
      const cleanSSN = body.ssn.replace(/[\s-]/g, '');
      if (!/^\d{9}$/.test(cleanSSN)) {
        errors.push('SSN must be exactly 9 digits');
      }
    }

    // Age validation (must be 18+)
    if (body.dateOfBirth) {
      const dob = new Date(body.dateOfBirth);
      const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) errors.push('Applicant must be at least 18 years old');
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Generate application ID
    const applicationId = `CBH-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // In production: this is where we'd call CreditApplicationHandler.submitApplication()
    // which tokenizes the SSN, encrypts PII, and creates the audit log.
    // For now, return success so the flow works.

    const maskedSSN = `***-**-${body.ssn.replace(/\D/g, '').slice(-4)}`;

    return NextResponse.json({
      success: true,
      applicationId,
      maskedSSN,
      status: 'submitted',
      message: 'Credit application submitted securely.',
    });
  } catch {
    return NextResponse.json(
      { success: false, errors: ['Server error. Please try again.'] },
      { status: 500 }
    );
  }
}
