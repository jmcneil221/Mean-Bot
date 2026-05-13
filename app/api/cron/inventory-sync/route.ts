import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  // Security Check: Verify Vercel Cron Secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createAdminClient();
  
  // 1. Get all enabled feeds
  const { data: feeds } = await supabase
    .from('dealer_feeds')
    .select('*, dealerships(name)')
    .eq('is_enabled', true);

  if (!feeds || feeds.length === 0) return NextResponse.json({ message: 'No feeds to sync' });

  const results = [];

  for (const feed of feeds) {
    try {
      // 2. Fetch the external feed
      const response = await fetch(feed.feed_url);
      const rawData = await response.text();
      
      // 3. (Simplified for Demo) Parse & Upsert Logic
      // In production, this calls your existing CSV/XML parser logic
      console.log(`Syncing ${feed.dealerships.name}...`);
      
      // 4. Update sync status
      await supabase.from('dealer_feeds').update({
        last_sync_at: new Date().toISOString(),
        last_sync_status: 'success',
        last_sync_summary: { message: 'Sync completed successfully' }
      }).eq('id', feed.id);

      results.push({ dealer: feed.dealerships.name, status: 'success' });
    } catch (err) {
      results.push({ dealer: feed.dealerships.name, status: 'error', error: err.message });
    }
  }

  return NextResponse.json({ processed: results.length, details: results });
}
