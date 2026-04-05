'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CB</span>
            </div>
            <span className="text-xl font-bold text-brand-navy">
              Carbuyinghub<span className="text-brand-blue">.com</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/vehicles" className="text-gray-600 hover:text-brand-navy font-medium transition-colors">
              Search Cars
            </Link>
            <Link href="/dealers" className="text-gray-600 hover:text-brand-navy font-medium transition-colors">
              Dealers
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-brand-navy font-medium transition-colors">
              About
            </Link>
            <Link href="/apply" className="btn-primary text-sm">
              Apply for Credit
            </Link>
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
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <Link href="/vehicles" className="text-gray-600 hover:text-brand-navy font-medium py-2" onClick={() => setMenuOpen(false)}>
                Search Cars
              </Link>
              <Link href="/dealers" className="text-gray-600 hover:text-brand-navy font-medium py-2" onClick={() => setMenuOpen(false)}>
                Dealers
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-brand-navy font-medium py-2" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link href="/apply" className="btn-primary text-center text-sm" onClick={() => setMenuOpen(false)}>
                Apply for Credit
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
