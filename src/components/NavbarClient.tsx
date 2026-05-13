'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Props {
  userEmail: string | null;
  isDealer: boolean;
}

const linkClass =
  'text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium transition-colors duration-200 hover:text-[#1A1A1A]';

export function NavbarClient({ userEmail, isDealer }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/vehicles" className={linkClass}>Inventory</Link>
        <Link href="/about" className={linkClass}>How It Works</Link>
        <div className="w-px h-4 bg-[#1A1A1A]/10" />

        {userEmail ? (
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2.5 group"
              aria-label="Account menu"
            >
              <span className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F4F1EA] flex items-center justify-center text-[10px] font-semibold tracking-wide">
                {userEmail[0]?.toUpperCase()}
              </span>
              <svg
                className={`w-3 h-3 text-[#1A1A1A]/40 transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {accountOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                <div className="absolute right-0 mt-3 w-56 rounded-lg bg-white border border-[#1A1A1A]/[0.06] shadow-lg py-1.5 z-50">
                  <div className="px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-medium border-b border-[#1A1A1A]/[0.06]">
                    Account
                  </div>
                  <div className="px-4 py-2 text-xs text-[#1A1A1A]/40 truncate">{userEmail}</div>
                  {isDealer && (
                    <Link href="/dealer" className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F4F1EA] transition-colors" onClick={() => setAccountOpen(false)}>
                      Dealer Dashboard
                    </Link>
                  )}
                  <Link href="/account" className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F4F1EA] transition-colors" onClick={() => setAccountOpen(false)}>
                    My Account
                  </Link>
                  <div className="border-t border-[#1A1A1A]/[0.06] mt-1 pt-1">
                    <form action="/auth/signout" method="post">
                      <button type="submit" className="w-full text-left px-4 py-2 text-sm text-[#6B1D2F] hover:bg-[#F4F1EA] transition-colors">
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A] bg-[#1A1A1A]/[0.04] px-5 py-2 rounded-sm transition-all duration-200 hover:bg-[#1A1A1A] hover:text-[#F4F1EA]"
          >
            Dealer Login
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button className="md:hidden p-2 text-[#1A1A1A]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          {menuOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />}
        </svg>
      </button>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-[72px] md:hidden bg-[#F4F1EA] border-b border-[#1A1A1A]/[0.06] shadow-sm z-50">
          <div className="flex flex-col px-6 py-6 gap-1">
            <Link href="/vehicles" className="py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium hover:text-[#1A1A1A] transition-colors" onClick={() => setMenuOpen(false)}>Inventory</Link>
            <Link href="/about" className="py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium hover:text-[#1A1A1A] transition-colors" onClick={() => setMenuOpen(false)}>How It Works</Link>
            <div className="border-t border-[#1A1A1A]/[0.06] my-3" />
            {userEmail ? (
              <>
                <div className="py-2 text-xs text-[#1A1A1A]/30 truncate">{userEmail}</div>
                {isDealer && (
                  <Link href="/dealer" className="py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium hover:text-[#1A1A1A] transition-colors" onClick={() => setMenuOpen(false)}>Dealer Dashboard</Link>
                )}
                <Link href="/account" className="py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium hover:text-[#1A1A1A] transition-colors" onClick={() => setMenuOpen(false)}>My Account</Link>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#6B1D2F] font-medium w-full text-left">Sign Out</button>
                </form>
              </>
            ) : (
              <Link href="/login" className="py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-medium hover:text-[#6B1D2F] transition-colors" onClick={() => setMenuOpen(false)}>Dealer Login</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}