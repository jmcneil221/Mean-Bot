'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HeaderNav({
  userEmail,
  isAdmin,
}: {
  userEmail: string | null;
  isAdmin: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="/vehicles" className="nav-link">
          Search
        </Link>
        <Link href="/apply" className="nav-link">
          Apply
        </Link>
        <Link href="/dealers" className="nav-link">
          Dealers
        </Link>
        <Link href="/about" className="nav-link">
          About
        </Link>
        {isAdmin && (
          <Link href="/admin" className="nav-link">
            Admin
          </Link>
        )}

        {/* Divider */}
        <div className="w-px h-5 bg-[#E8E4DE]" />

        {userEmail ? (
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2 group"
              aria-label="Account menu"
            >
              <span className="w-8 h-8 rounded-full bg-burgundy text-white flex items-center justify-center text-xs font-semibold tracking-wide">
                {userEmail[0]?.toUpperCase()}
              </span>
            </button>
            {accountOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAccountOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-60 rounded-lg bg-white border border-[#E8E4DE] shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-premium border-b border-[#E8E4DE]">
                    Account
                  </div>
                  <div className="px-4 py-2 text-sm text-charcoal/60 truncate">
                    {userEmail}
                  </div>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-charcoal hover:bg-parchment transition-colors"
                    onClick={() => setAccountOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/applications"
                    className="block px-4 py-2 text-sm text-charcoal hover:bg-parchment transition-colors"
                    onClick={() => setAccountOpen(false)}
                  >
                    My Applications
                  </Link>
                  <div className="border-t border-[#E8E4DE] mt-1 pt-1">
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="w-full text-left px-4 py-2 text-sm text-burgundy hover:bg-parchment transition-colors"
                      >
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link href="/login" className="nav-link">
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 text-charcoal"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          )}
        </svg>
      </button>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-[72px] md:hidden bg-white border-b border-[#E8E4DE] shadow-sm px-6 py-6 z-50">
          <div className="flex flex-col gap-1">
            <Link href="/vehicles" className="py-3 text-xs uppercase tracking-premium text-charcoal/70 hover:text-burgundy transition-colors" onClick={() => setMenuOpen(false)}>
              Search
            </Link>
            <Link href="/apply" className="py-3 text-xs uppercase tracking-premium text-charcoal/70 hover:text-burgundy transition-colors" onClick={() => setMenuOpen(false)}>
              Apply
            </Link>
            <Link href="/dealers" className="py-3 text-xs uppercase tracking-premium text-charcoal/70 hover:text-burgundy transition-colors" onClick={() => setMenuOpen(false)}>
              Dealers
            </Link>
            <Link href="/about" className="py-3 text-xs uppercase tracking-premium text-charcoal/70 hover:text-burgundy transition-colors" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            {isAdmin && (
              <Link href="/admin" className="py-3 text-xs uppercase tracking-premium text-charcoal/70 hover:text-burgundy transition-colors" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
            <div className="divider my-3" />
            {userEmail ? (
              <>
                <Link href="/account" className="py-3 text-xs uppercase tracking-premium text-charcoal/70 hover:text-burgundy transition-colors" onClick={() => setMenuOpen(false)}>
                  My Account
                </Link>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="py-3 text-xs uppercase tracking-premium text-burgundy w-full text-left">
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="py-3 text-xs uppercase tracking-premium text-charcoal/70 hover:text-burgundy transition-colors" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
