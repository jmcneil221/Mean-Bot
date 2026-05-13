import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-parchment">
      {/* Admin top bar */}
      <header className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif font-bold text-lg tracking-tight">
              CBH <span className="text-gold font-normal text-sm ml-1">Admin</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-xs uppercase tracking-premium">
              <Link href="/admin/audit" className="text-white/50 hover:text-white transition-colors">
                Audit Log
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/40">{profile.email}</span>
            <Link href="/account" className="text-gold hover:text-white transition-colors text-xs uppercase tracking-premium">
              My Account
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="sm:hidden bg-charcoal border-t border-white/10 px-4 py-2 flex gap-4 text-xs uppercase tracking-premium">
        <Link href="/admin/audit" className="text-white/50 hover:text-white">
          Audit Log
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
