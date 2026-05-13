'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LeadStatusActions({ leadId, initialStatus }: { leadId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (!error) setStatus(newStatus);
    setLoading(false);
  };

  return (
    <select 
      value={status}
      disabled={loading}
      onChange={(e) => updateStatus(e.target.value)}
      className="text-[10px] uppercase tracking-widest font-bold bg-[#F4F1EA] border-none rounded-sm px-3 py-1.5 focus:ring-1 focus:ring-[#A8896B] outline-none cursor-pointer disabled:opacity-50"
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="appointment">Appt Set</option>
      <option value="sold">Sold</option>
      <option value="lost">Lost</option>
    </select>
  );
}