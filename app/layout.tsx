import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

// Load Inter for incredibly clean, modern body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Load Cormorant Garamond for that striking, fine-art gallery aesthetic
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

// Controls browser behavior (like theme colors and zoom prevention)
export const viewport: Viewport = {
  themeColor: '#F4F1EA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Officially locks out the dreaded iOS Safari zoom!
};

// Tells devices this is an installable Progressive Web App
export const metadata: Metadata = {
  title: 'CarBuyingHub',
  description: 'A calmer path to the right car.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CarBuyingHub',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-[#F4F1EA] text-[#1A1A1A] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}