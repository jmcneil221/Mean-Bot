import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ─── 1. QUICK BROWSER TEST ───
// You can visit http://localhost:3000/api/leads/submit in your browser to see if this works!
export async function GET() {
  return NextResponse.json({ message: "The CarBuyingHub API is alive and reachable!" });
}

export async function POST(request: Request) {
  try {
    // ─── 2. SAFETY CHECK FOR ENV VARIABLES ───
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("CRITICAL ERROR: Supabase keys are missing from .env.local!");
      return NextResponse.json(
        { error: 'Server configuration error. Missing database keys.' },
        { status: 500 }
      );
    }

    // ─── 3. INITIALIZE DB SAFELY INSIDE THE FUNCTION ───
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const body = await request.json();
    const { vehicle_id, dealer_id, first_name, last_name, email, phone, intent } = body;

    // Validate inputs
    if (!vehicle_id || !dealer_id || !first_name || !last_name || !email || !phone || !intent) {
      return NextResponse.json(
        { error: 'Missing required concierge fields.' },
        { status: 400 }
      );
    }

    const full_name = `${first_name.trim()} ${last_name.trim()}`;

    // Insert into database
    const { error: dbError } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          vehicle_id,
          dealer_id,
          full_name,
          email: email.toLowerCase().trim(),
          phone: phone.replace(/\D/g, ''), // Strip non-numeric characters
          intent, 
          status: 'new'
        }
      ]);

    if (dbError) {
      console.error('Lead Insertion Error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save lead to the database. Check Supabase logs.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Lead routed successfully.' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Concierge API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during lead routing.' },
      { status: 500 }
    );
  }
}