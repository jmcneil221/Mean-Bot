import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const HEADER_MAP: Record<string, string> = {
  vin: 'vin',
  year: 'year',
  make: 'make',
  model: 'model',
  trim: 'trim',
  mileage: 'mileage',
  odometer: 'mileage',
  miles: 'mileage',
  price: 'price',
  asking_price: 'price',
  list_price: 'price',
  'asking price': 'price',
  'list price': 'price',
  'selling price': 'price',
  selling_price: 'price',
  msrp: 'price',
  price_cents: 'price_cents',
  body_style: 'body_style',
  body_type: 'body_style',
  'body style': 'body_style',
  'body type': 'body_style',
  style: 'body_style',
  exterior_color: 'exterior_color',
  'exterior color': 'exterior_color',
  ext_color: 'exterior_color',
  color: 'exterior_color',
  interior_color: 'interior_color',
  'interior color': 'interior_color',
  int_color: 'interior_color',
  transmission: 'transmission',
  trans: 'transmission',
  drivetrain: 'drivetrain',
  drive: 'drivetrain',
  fuel_type: 'fuel_type',
  'fuel type': 'fuel_type',
  fuel: 'fuel_type',
  description: 'description',
  notes: 'description',
  comments: 'description',
  status: 'status',
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(current.trim());
        current = '';
      } else if (char === '\n' || (char === '\r' && next === '\n')) {
        row.push(current.trim());
        if (row.some(cell => cell !== '')) rows.push(row);
        row = [];
        current = '';
        if (char === '\r') i++;
      } else {
        current += char;
      }
    }
  }

  row.push(current.trim());
  if (row.some(cell => cell !== '')) rows.push(row);

  return rows;
}

function parsePriceToCents(raw: string, isCentsColumn: boolean): number | null {
  const cleaned = raw.replace(/[$,\s]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num) || num < 0) return null;
  return isCentsColumn ? Math.round(num) : Math.round(num * 100);
}

function normalizeStatus(raw: string): string {
  const lower = raw.toLowerCase().trim();
  if (['active', 'available', 'in stock', 'in_stock', 'for sale'].includes(lower)) return 'active';
  if (['sold', 'delivered'].includes(lower)) return 'sold';
  if (['pending', 'hold', 'on hold', 'reserved'].includes(lower)) return 'pending';
  if (['archived', 'deleted', 'removed', 'inactive'].includes(lower)) return 'archived';
  return 'active';
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, dealership_id')
      .eq('id', user.id)
      .single();

    if (!profile?.dealership_id || !['dealer', 'admin'].includes(profile.role)) {
      return NextResponse.json({ success: false, error: 'Dealer access required' }, { status: 403 });
    }

    const dealershipId = profile.dealership_id;

    const { data: dealership } = await supabase
      .from('dealerships')
      .select('name, city, state')
      .eq('id', dealershipId)
      .single();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ success: false, error: 'A .csv file is required' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File must be under 5 MB' }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length < 2) {
      return NextResponse.json({ success: false, error: 'CSV must have a header row and at least one data row' }, { status: 400 });
    }

    const rawHeaders = rows[0];
    const columnMap: Record<number, string> = {};
    let hasPriceCents = false;

    for (let i = 0; i < rawHeaders.length; i++) {
      const normalized = rawHeaders[i].toLowerCase().replace(/[^a-z0-9_ ]/g, '').trim();
      const mapped = HEADER_MAP[normalized];
      if (mapped) {
        if (mapped === 'price_cents') hasPriceCents = true;
        columnMap[i] = mapped;
      }
    }

    const mappedFields = new Set(Object.values(columnMap));

    if (!mappedFields.has('vin')) {
      return NextResponse.json({ success: false, error: 'CSV must include a VIN column' }, { status: 400 });
    }
    if (!mappedFields.has('make') || !mappedFields.has('model') || !mappedFields.has('year')) {
      return NextResponse.json({ success: false, error: 'CSV must include Year, Make, and Model columns' }, { status: 400 });
    }
    if (!mappedFields.has('price') && !mappedFields.has('price_cents')) {
      return NextResponse.json({ success: false, error: 'CSV must include a Price column' }, { status: 400 });
    }

    const dataRows = rows.slice(1);
    const vehicles: Record<string, unknown>[] = [];
    const errors: { row: number; message: string }[] = [];

    for (let rowIdx = 0; rowIdx < dataRows.length; rowIdx++) {
      const cells = dataRows[rowIdx];
      const record: Record<string, string> = {};

      for (let colIdx = 0; colIdx < cells.length; colIdx++) {
        const field = columnMap[colIdx];
        if (field && cells[colIdx]) {
          record[field] = cells[colIdx];
        }
      }

      if (!record.vin || record.vin.length < 5) {
        errors.push({ row: rowIdx + 2, message: 'Invalid or missing VIN: "' + (record.vin || '') + '"' });
        continue;
      }

      const year = parseInt(record.year);
      if (!record.year || isNaN(year) || year < 1900 || year > 2100) {
        errors.push({ row: rowIdx + 2, message: 'Invalid year: "' + (record.year || '') + '"' });
        continue;
      }

      if (!record.make) { errors.push({ row: rowIdx + 2, message: 'Missing make' }); continue; }
      if (!record.model) { errors.push({ row: rowIdx + 2, message: 'Missing model' }); continue; }

      let priceCents: number | null = null;
      if (record.price_cents) {
        priceCents = parsePriceToCents(record.price_cents, true);
      } else if (record.price) {
        priceCents = parsePriceToCents(record.price, false);
      }

      if (priceCents === null || priceCents < 0) {
        errors.push({ row: rowIdx + 2, message: 'Invalid price: "' + (record.price || record.price_cents || '') + '"' });
        continue;
      }

      const vehicle: Record<string, unknown> = {
        vin: record.vin.toUpperCase().replace(/[^A-Z0-9]/g, ''),
        year,
        make: record.make,
        model: record.model,
        price_cents: priceCents,
        dealership_id: dealershipId,
        dealer_id: user.id,
        dealer_name: dealership?.name || null,
        city: dealership?.city || null,
        state: dealership?.state || 'CT',
        status: record.status ? normalizeStatus(record.status) : 'active',
      };

      if (record.trim) vehicle.trim = record.trim;
      if (record.mileage) {
        const m = parseInt(record.mileage.replace(/[,\s]/g, ''));
        if (!isNaN(m) && m >= 0) vehicle.mileage = m;
      }
      if (record.body_style) vehicle.body_style = record.body_style;
      if (record.exterior_color) vehicle.exterior_color = record.exterior_color;
      if (record.interior_color) vehicle.interior_color = record.interior_color;
      if (record.transmission) vehicle.transmission = record.transmission;
      if (record.drivetrain) vehicle.drivetrain = record.drivetrain;
      if (record.fuel_type) vehicle.fuel_type = record.fuel_type;
      if (record.description) vehicle.description = record.description;

      vehicles.push(vehicle);
    }

    if (vehicles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid vehicles found in CSV',
        errors: errors.slice(0, 20),
      }, { status: 400 });
    }

    const vins = vehicles.map(v => v.vin as string);
    const admin = createAdminClient();

    const { data: existingVehicles } = await admin
      .from('vehicles')
      .select('vin, dealership_id')
      .in('vin', vins);

    const vinOwnership = new Map<string, string>();
    if (existingVehicles) {
      for (const ev of existingVehicles) {
        if (ev.dealership_id) vinOwnership.set(ev.vin, ev.dealership_id);
      }
    }

    const toUpsert: Record<string, unknown>[] = [];
    const skippedConflicts: string[] = [];

    for (const vehicle of vehicles) {
      const vin = vehicle.vin as string;
      const owner = vinOwnership.get(vin);

      if (owner && owner !== dealershipId) {
        skippedConflicts.push(vin);
        continue;
      }

      toUpsert.push(vehicle);
    }

    let inserted = 0;
    let updated = 0;
    const existingVins = new Set(vinOwnership.keys());

    for (const vehicle of toUpsert) {
      const vin = vehicle.vin as string;
      const isUpdate = existingVins.has(vin);

      const { error: upsertError } = await admin
        .from('vehicles')
        .upsert(vehicle, { onConflict: 'vin' });

      if (upsertError) {
        errors.push({ row: 0, message: 'VIN ' + vin + ': ' + upsertError.message });
      } else if (isUpdate) {
        updated++;
      } else {
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalRows: dataRows.length,
        inserted,
        updated,
        skipped: skippedConflicts.length,
        errors: errors.length,
      },
      mappedColumns: [...mappedFields],
      errors: errors.slice(0, 20),
      skippedVins: skippedConflicts.slice(0, 10),
    });
  } catch (e) {
    console.error('[inventory/upload] error', e);
    return NextResponse.json(
      { success: false, error: 'Server error processing CSV' },
      { status: 500 },
    );
  }
}
