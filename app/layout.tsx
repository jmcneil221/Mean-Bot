import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Carbuyinghub.com — Find Your Perfect Car, Get Approved Today',
    template: '%s | Carbuyinghub.com',
  },
  description: 'Search thousands of vehicles, apply for credit online with bank-level security, and connect with trusted dealers. Car buying made transparent and easy.',
  keywords: ['buy a car online', 'car buying', 'auto loans', 'credit application', 'used cars', 'car dealers', 'vehicle financing'],
  openGraph: {
    title: 'Carbuyinghub.com — Find Your Perfect Car, Get Approved Today',
    description: 'Search vehicles, apply for credit, compare deals — all in one place.',
    url: 'https://carbuyinghub.com',
    siteName: 'Carbuyinghub.com',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/brand/logo-primary.png', width: 1024, height: 1024, alt: 'CarBuyingHub.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carbuyinghub.com',
    description: 'Find your perfect car and get approved today.',
    images: ['/brand/logo-primary.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/brand/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://carbuyinghub.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
