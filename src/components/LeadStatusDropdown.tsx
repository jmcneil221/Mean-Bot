'use client';

import { useState, useTransition } from 'react';
import { updateLeadStatus } from '@/app/dealer/leads/actions';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', bg: 'bg-blue-50', text: 'text-blue-700' },
  { value: 'contacted', label: 'Contacted', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  { value: 'appointment', label: 'Appointment', bg: 'bg-purple-50', text: 'text-purple-700' },
  { value: 'closed_won', label: 'Sold', bg: 'bg-green-50', text: 'text-green-700' },
  { value: 'closed_lost', label: 'Lost', bg: 'bg-charcoal/5', text: 'text-charcoal/40' },
] as const;

export default function LeadStatusDropdown({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const current = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, newStatus);
      if (!result.success) {
        setStatus(currentStatus);
      }
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`appearance-none text-[10px] font-bold uppercase tracking-widest px-3 py-1 pr-6 rounded-full border-none cursor-pointer ${current.bg} ${current.text} focus:ring-2 focus:outline-none transition-all ${isPending ? 'opacity-50' : ''}`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23999' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
    >
      {STATUS_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
