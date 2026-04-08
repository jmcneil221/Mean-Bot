'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HeaderNav({ userEmail }: { userEmail: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/vehicles" className="text-gray-600 hover:text-brand-charcoal font-medium transition-colors">
          Search Cars
        </Link>
        <Link href="/dealers" className="text-gray-600 hover:text-brand-charcoal font-medium transition-colors">
          Dealers
        </Link>
        <Link href="/about" className="text-gray-600 hover:text-brand-charcoal font-medium transition-colors">
          About
        </Link>
        <Link href="/apply" className="btn-primary text-sm">
          Apply for Credit
        </Link>

        {userEmail ? (
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-brand-charcoal font-medium"
              aria-label="Account menu"
            >
              <span className="w-8 h-8 rounded-full bg-brand-burgundy text-white flex items-center justify-center text-sm font-bold">
                {userEmail[0]?.toUpperCase()}
              </span>
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 truncate">
                  {userEmail}
                </div>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setAccountOpen(false)}
                >
                  My account
                </Link>
                <Link
                  href="/account/applications"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setAccountOpen(false)}
                >
                  My applications
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="text-gray-700 hover:text-brand-charcoal font-medium">
            Sign in
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-16 md:hidden py-4 border-t border-gray-100 bg-white shadow-lg px-4">
          <div className="flex flex-col gap-3">
            <Link href="/vehicles" className="text-gray-600 font-medium py-2" onClick={() => setMenuOpen(false)}>
              Search Cars
            </Link>
            <Link href="/dealers" className="text-gray-600 font-medium py-2" onClick={() => setMenuOpen(false)}>
              Dealers
            </Link>
            <Link href="/about" className="text-gray-600 font-medium py-2" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/apply" className="btn-primary text-center text-sm" onClick={() => setMenuOpen(false)}>
              Apply for Credit
            </Link>
            {userEmail ? (
              <>
                <Link href="/account" className="text-gray-600 font-medium py-2" onClick={() => setMenuOpen(false)}>
                  My account
                </Link>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="text-red-600 font-medium py-2 text-left w-full">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="text-gray-600 font-medium py-2" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
