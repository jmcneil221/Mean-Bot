import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicle_id, dealer_id, first_name, last_name, email, phone, intent } = body;

    const supabase = await createClient();
    const full_name = `${first_name} ${last_name}`.trim();

    // 1. Save the lead into your Supabase database
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert([{ vehicle_id, dealer_id, full_name, email, phone, intent, status: 'new' }]);

    if (leadError) {
      return NextResponse.json({ error: leadError.message }, { status: 400 });
    }

    // 2. Fetch the specific vehicle details from the database
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicle_id)
      .single();

    const vehicleTitle = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}`.trim() : `Vehicle ID: ${vehicle_id}`;
    const vehicleVin = vehicle?.vin || 'N/A';
    
    // Convert price_cents to actual dollars! (e.g. 6200000 / 100 = $62,000)
    let vehiclePrice = 'N/A';
    if (vehicle?.price_cents) {
      const priceInDollars = vehicle.price_cents / 100;
      vehiclePrice = `$${priceInDollars.toLocaleString()}`; // Adds the nice comma formatting
    }

    // Modern System Font Stacks to match Next.js defaults
    const fontSans = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    const fontSerif = `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`;

    // 3. Fire Admin Notification Email
    const adminEmail = await resend.emails.send({
      from: 'CarBuyingHub <onboarding@resend.dev>',
      to: 'jmcneil221@gmail.com', 
      subject: `🔥 New Lead: ${full_name} on ${vehicle ? vehicle.make : 'Vehicle'}`,
      html: `
        <div style="background-color: #F4F1EA; padding: 40px 20px; font-family: ${fontSans};">
          <div style="background-color: #FFFFFF; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid rgba(26,26,26,0.06); border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
            
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; color: #A8896B; font-weight: bold; margin: 0 0 16px 0;">
              Internal Lead Alert
            </p>
            <h1 style="font-size: 28px; color: #1A1A1A; font-family: ${fontSerif}; font-weight: normal; margin: 0 0 32px 0;">
              New Purchase Request.
            </h1>
            
            <h3 style="color: #6B1D2F; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Vehicle of Interest</h3>
            <div style="background-color: #F4F1EA; padding: 20px; border-radius: 4px; margin-bottom: 32px; border-left: 4px solid #A8896B;">
              <p style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 15px;"><strong>Vehicle:</strong> ${vehicleTitle}</p>
              <p style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 15px;"><strong>VIN:</strong> ${vehicleVin}</p>
              <p style="margin: 0; color: #1A1A1A; font-size: 15px;"><strong>Listed Price:</strong> ${vehiclePrice}</p>
            </div>

            <h3 style="color: #6B1D2F; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Client Details</h3>
            <div style="background-color: #F4F1EA; padding: 20px; border-radius: 4px; margin-bottom: 32px; border-left: 4px solid #1A1A1A;">
              <p style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 15px;"><strong>Name:</strong> ${full_name}</p>
              <p style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 15px;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 0 0 8px 0; color: #1A1A1A; font-size: 15px;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0; color: #1A1A1A; font-size: 15px;"><strong>Intent:</strong> ${intent}</p>
            </div>

            <p style="color: #1A1A1A; font-size: 14px; opacity: 0.7; margin: 0; border-top: 1px solid rgba(26,26,26,0.1); padding-top: 24px;">Log in to your CarBuyingHub dashboard to assign this client advisor.</p>
          </div>
        </div>
      `
    });

    // 4. Fire Customer Acknowledgment Email
    const customerEmail = await resend.emails.send({
      from: 'CarBuyingHub <onboarding@resend.dev>',
      to: 'jmcneil221@gmail.com', 
      subject: `Your CarBuyingHub Request is Confirmed`,
      html: `
        <div style="background-color: #F4F1EA; padding: 40px 20px; font-family: ${fontSans};">
          <div style="background-color: #FFFFFF; max-width: 600px; margin: 0 auto; padding: 40px 40px 60px 40px; border: 1px solid rgba(26,26,26,0.06); border-radius: 4px;">
            
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; color: #A8896B; font-weight: bold; margin: 0 0 20px 0; text-align: center;">
              CarBuyingHub Concierge
            </p>
            <h1 style="font-size: 32px; color: #1A1A1A; font-family: ${fontSerif}; font-weight: normal; margin: 0 0 32px 0; text-align: center; letter-spacing: -0.5px;">
              Direct Connection Confirmed.
            </h1>
            
            <p style="color: #1A1A1A; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0;">
              Hello ${first_name},
            </p>
            <p style="color: #1A1A1A; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0;">
              We have successfully received your direct concierge request for the <strong>${vehicleTitle}</strong>. A dedicated client advisor is currently reviewing your file and will reach out to you shortly at <strong>${phone}</strong> to discuss your purchase options and arrange delivery.
            </p>

            <div style="background-color: #F4F1EA; padding: 24px; border-radius: 4px; margin: 32px 0; text-align: center;">
              <p style="color: #1A1A1A; font-size: 13px; font-weight: bold; margin: 0; letter-spacing: 0.1em; color: #6B1D2F;">
                EXPECT A CALL SHORTLY AT:<br>
                <strong style="font-size: 20px; display: inline-block; margin-top: 8px; color: #1A1A1A; font-weight: normal;">${phone}</strong>
              </p>
            </div>

            <p style="color: #1A1A1A; font-size: 16px; line-height: 1.8; margin: 0 0 40px 0;">
              Thank you for choosing a calmer path to the right car.
            </p>

            <hr style="border: none; border-top: 1px solid rgba(26,26,26,0.1); margin: 0 0 24px 0;">
            
            <p style="color: #A8896B; font-size: 12px; margin: 0; text-align: center; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold;">
              The CarBuyingHub Team
            </p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}