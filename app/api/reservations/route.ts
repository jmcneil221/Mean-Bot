import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; 
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, paymentIntent, vehicleId, intent } = body;

    const supabase = await createClient();

    // --- THE DATA SANITIZER ---
    // Fixes the spelling for the DB, and forces NULL if they are just checking availability.
    let dbPaymentIntent = null;
    if (intent === 'reserve') {
      dbPaymentIntent = paymentIntent === 'cash_outside' ? 'cash_or_outside' : paymentIntent;
    }

    // 1. Fetch Vehicle Details
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    const vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}` : 'Requested Vehicle';
    const price = vehicle?.price_cents ? `$${(vehicle.price_cents / 100).toLocaleString()}` : 'Price Upon Request';

    // 2. Save to Database using the sanitized data
    const { error: dbError } = await supabase
      .from('reservation_requests')
      .insert([
        {
          full_name: `${firstName} ${lastName}`,
          email: email,
          phone: phone,
          intent: intent,
          payment_intent: dbPaymentIntent, // <-- Using the sanitized variable here
          vehicle_id: vehicleId,
        }
      ]);

    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    // 3. Define Email Variables
    const isReserve = intent === 'reserve';
    const leadTemp = isReserve ? '🔥 HIGH INTENT (VIP HOLD)' : '❄️ LOW INTENT (AVAIL CHECK)';
    const paymentText = isReserve 
      ? (dbPaymentIntent === 'dealership_financing' ? 'Apply for Dealership Financing' : 'Cash / Outside Financing') 
      : 'N/A (Availability Check Only)';

    // ==========================================
    // EMAIL TEMPLATE 1: CUSTOMER CONFIRMATION
    // ==========================================
    const customerHtml = `
      <div style="background-color: #F4F1EA; padding: 40px 20px; font-family: Helvetica, Arial, sans-serif; color: #1A1A1A;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; padding: 40px;">
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #A8896B; margin-bottom: 20px; font-weight: bold;">
            CarBuyingHub • Private Inquiry
          </p>
          <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 10px; color: #1A1A1A;">
            ${isReserve ? 'Reservation Received' : 'Inquiry Received'}
          </h1>
          <p style="font-size: 14px; line-height: 1.6; color: #666666; margin-bottom: 30px;">
            Hello ${firstName},<br><br>
            Thank you for your interest. We have successfully received your request regarding the <strong>${vehicleName}</strong>. 
            A client advisor will review your information and contact you shortly at ${phone}.
          </p>
          <div style="border-top: 1px solid #eeeeee; padding-top: 20px;">
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999999;">Vehicle of Interest</p>
            <p style="font-size: 14px; font-weight: bold; margin-top: 5px;">${vehicleName}</p>
          </div>
        </div>
      </div>
    `;

    // ==========================================
    // EMAIL TEMPLATE 2: DEALERSHIP NOTIFICATION
    // ==========================================
    const dealerHtml = `
      <div style="background-color: #F4F1EA; padding: 40px 20px; font-family: Helvetica, Arial, sans-serif; color: #1A1A1A;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; padding: 40px;">
          
          <div style="background-color: ${isReserve ? '#1A1A1A' : '#f8f9fa'}; color: ${isReserve ? '#ffffff' : '#1A1A1A'}; padding: 10px 15px; display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin-bottom: 20px;">
            ${leadTemp}
          </div>

          <h1 style="font-size: 22px; margin-bottom: 30px; font-weight: bold; border-bottom: 2px solid #F4F1EA; padding-bottom: 10px;">
            New Vehicle ${isReserve ? 'Reservation' : 'Inquiry'}
          </h1>

          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.6;">
            <tr>
              <td width="35%" style="color: #A8896B; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 10px;">Customer Name</td>
              <td width="65%" style="font-weight: bold; padding-bottom: 10px;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="color: #A8896B; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 10px;">Phone</td>
              <td style="padding-bottom: 10px;"><a href="tel:${phone}" style="color: #1A1A1A; text-decoration: none; font-weight: bold;">${phone}</a></td>
            </tr>
            <tr>
              <td style="color: #A8896B; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 25px;">Email</td>
              <td style="padding-bottom: 25px;"><a href="mailto:${email}" style="color: #1A1A1A; text-decoration: none;">${email}</a></td>
            </tr>
            
            <tr><td colspan="2" style="border-top: 1px solid #eeeeee; padding-top: 25px;"></td></tr>

            <tr>
              <td style="color: #A8896B; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 10px;">Vehicle</td>
              <td style="font-weight: bold; padding-bottom: 10px;">${vehicleName}</td>
            </tr>
            <tr>
              <td style="color: #A8896B; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 10px;">Listed Price</td>
              <td style="padding-bottom: 10px;">${price}</td>
            </tr>
            <tr>
              <td style="color: #A8896B; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 10px;">Financing Intent</td>
              <td style="font-weight: bold; color: ${dbPaymentIntent === 'dealership_financing' ? '#6B1D2F' : '#1A1A1A'}; padding-bottom: 10px;">
                ${paymentText}
              </td>
            </tr>
          </table>

        </div>
      </div>
    `;

    // 4. Fire off the emails via Resend
    await resend.emails.send({
      from: 'CarBuyingHub <notifications@carbuyinghub.com>', 
      to: email,
      subject: isReserve ? 'Your Vehicle Reservation Confirmed' : 'Vehicle Availability Request Received',
      html: customerHtml,
    });

    await resend.emails.send({
      from: 'CarBuyingHub Leads <notifications@carbuyinghub.com>', 
      to: 'jmcneil221@gmail.com',
      subject: `[CarBuyingHub] ${isReserve ? 'VIP HOLD' : 'LEAD'}: ${vehicleName}`,
      html: dealerHtml,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}