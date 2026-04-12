import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <header className="bg-brand-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg tracking-tight">
              CBH <span className="text-brand-bronze font-normal text-sm ml-1">Admin</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link href="/admin/applications" className="text-gray-300 hover:text-white transition-colors">
                Applications
              </Link>
              <Link href="/admin/audit" className="text-gray-300 hover:text-white transition-colors">
                Audit Log
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">{profile.email}</span>
            <Link href="/account" className="text-brand-bronze hover:text-white transition-colors">
              My Account
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="sm:hidden bg-brand-charcoal border-t border-gray-700 px-4 py-2 flex gap-4 text-sm">
        <Link href="/admin/applications" className="text-gray-300 hover:text-white">
          Applications
        </Link>
        <Link href="/admin/audit" className="text-gray-300 hover:text-white">
          Audit Log
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
