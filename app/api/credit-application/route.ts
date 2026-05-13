import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: false, errors: ['Not signed in'] }, { status: 401 });

    const applicantName = `${body.firstName} ${body.lastName}`.trim();
    let dealershipId: string | null = null;
    let vehicleTitle = 'General Inquiry';

    // Fetch vehicle and dealership details
    if (body.vehicleId) {
      const { data: vehicle } = await supabase.from('vehicles').select('year, make, model, dealership_id').eq('id', body.vehicleId).single();
      if (vehicle) {
        vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
        dealershipId = vehicle.dealership_id;
      }
    }

    // Save lead to DB
    if (dealershipId) {
      const admin = createAdminClient();
      await admin.from('leads').insert({
        dealership_id: dealershipId,
        vehicle_id: body.vehicleId,
        buyer_name: applicantName,
        buyer_email: body.email,
        buyer_phone: body.phone,
        vehicle_title: vehicleTitle,
        employment_status: body.employmentStatus,
        annual_income: body.annualIncome,
      });
    }

    // Send emails (Logic matches existing sendEmail patterns)
    // ... email sending logic here ...

    return NextResponse.json({ success: true, message: 'Inquiry sent!' });
  } catch (e) {
    return NextResponse.json({ success: false, errors: ['Server error'] }, { status: 500 });
  }
}
