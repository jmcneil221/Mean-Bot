'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface Props {
  userEmail: string | null;
  isDealer: boolean;
}

const linkClass =
  'text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium transition-colors duration-200 hover:text-[#1A1A1A] shrink-0';

export function NavbarClient({ userEmail, isDealer }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close account menu if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* ─── DESKTOP NAV ─── */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/vehicles" className={linkClass}>Inventory</Link>
        <Link href="/about" className={linkClass}>How It Works</Link>
        <div className="w-px h-4 bg-[#1A1A1A]/10" />

        {userEmail ? (
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2.5 group focus:outline-none"
              aria-label="Account menu"
              aria-expanded={accountOpen}
            >
              <span className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#F4F1EA] flex items-center justify-center text-[10px] font-semibold tracking-wide shadow-sm">
                {userEmail[0]?.toUpperCase()}
              </span>
              <svg
                className={`w-3 h-3 text-[#1A1A1A]/40 transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Account Dropdown */}
            {accountOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-md bg-white border border-[#1A1A1A]/10 shadow-2xl py-1.5 z-[100]">
                <div className="px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 font-medium border-b border-[#1A1A1A]/[0.06]">
                  Account
                </div>
                <div className="px-4 py-2.5 text-xs text-[#1A1A1A]/60 truncate font-medium">
                  {userEmail}
                </div>
                {isDealer && (
                  <Link href="/dealer" className="block px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F4F1EA] transition-colors" onClick={() => setAccountOpen(false)}>
                    Dealer Dashboard
                  </Link>
                )}
                <Link href="/account" className="block px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F4F1EA] transition-colors" onClick={() => setAccountOpen(false)}>
                  My Account
                </Link>
                <div className="border-t border-[#1A1A1A]/[0.06] mt-1 pt-1">
                  <form action="/auth/signout" method="post">
                    <button type="submit" className="w-full text-left px-4 py-2.5 text-sm text-[#6B1D2F] font-medium hover:bg-[#F4F1EA] transition-colors">
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A] bg-[#1A1A1A]/[0.04] px-5 py-2 rounded-sm transition-all duration-200 hover:bg-[#1A1A1A] hover:text-[#F4F1EA] shrink-0"
          >
            Dealer Login
          </Link>
        )}
      </div>

      {/* ─── MOBILE TOGGLE ─── */}
      <button 
        className="md:hidden p-2 text-[#1A1A1A] focus:outline-none" 
        onClick={() => setMenuOpen(!menuOpen)} 
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          {menuOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />}
        </svg>
      </button>

      {/* ─── MOBILE DRAWER ─── */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-[72px] md:hidden bg-[#F4F1EA] border-b border-[#1A1A1A]/10 shadow-xl z-[100] min-h-[calc(100vh-72px)]">
          <div className="flex flex-col px-6 py-8 gap-2">
            <Link href="/vehicles" className="py-4 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium hover:text-[#1A1A1A] transition-colors" onClick={() => setMenuOpen(false)}>Inventory</Link>
            <Link href="/about" className="py-4 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium hover:text-[#1A1A1A] transition-colors" onClick={() => setMenuOpen(false)}>How It Works</Link>
            
            <div className="border-t border-[#1A1A1A]/10 my-4" />
            
            {userEmail ? (
              <>
                <div className="py-2 text-xs text-[#1A1A1A]/40 truncate font-medium uppercase tracking-wider">{userEmail}</div>
                {isDealer && (
                  <Link href="/dealer" className="py-4 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium hover:text-[#1A1A1A] transition-colors" onClick={() => setMenuOpen(false)}>Dealer Dashboard</Link>
                )}
                <Link href="/account" className="py-4 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 font-medium hover:text-[#1A1A1A] transition-colors" onClick={() => setMenuOpen(false)}>My Account</Link>
                <form action="/auth/signout" method="post" className="mt-2">
                  <button type="submit" className="py-4 text-[11px] uppercase tracking-[0.2em] text-[#6B1D2F] font-bold w-full text-left">Sign Out</button>
                </form>
              </>
            ) : (
              <Link href="/login" className="py-4 text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] font-bold hover:text-[#6B1D2F] transition-colors" onClick={() => setMenuOpen(false)}>Dealer Login</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}