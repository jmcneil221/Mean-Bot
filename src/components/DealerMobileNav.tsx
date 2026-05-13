'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DealerMobileNav({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <div className="bg-charcoal p-4 flex justify-between items-center sticky top-0 z-50">
        <span className="text-white font-serif font-bold italic">CBH Dealer</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-charcoal z-40 p-8 flex flex-col space-y-6 pt-24" onClick={() => setIsOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}
