'use client';

import { useState, useTransition } from 'react';
import { updateDealerStatus } from '@/app/admin/dealerships/actions';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  { value: 'active', label: 'Active', bg: 'bg-green-50', text: 'text-green-700' },
  { value: 'suspended', label: 'Suspended', bg: 'bg-red-50', text: 'text-red-700' },
  { value: 'churned', label: 'Churned', bg: 'bg-charcoal/5', text: 'text-charcoal/40' },
] as const;

export default function DealershipStatusDropdown({ dealerId, currentStatus }: { dealerId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const current = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        setStatus(next);
        startTransition(async () => {
          await updateDealerStatus(dealerId, next);
        });
      }}
      className={`appearance-none text-[10px] font-bold uppercase tracking-widest px-3 py-1 pr-6 rounded-full border-none cursor-pointer ${current.bg} ${current.text} focus:ring-2 focus:outline-none transition-all ${isPending ? 'opacity-50' : ''}`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23999' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
    >
      {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  );
}
