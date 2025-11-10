
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed to Inter
import './globals.css';
import { cn } from '@/lib/utils';
import AppClientLayoutWrapper from '@/components/layout/app-client-layout-wrapper';

// Configure the Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Use a standard variable name
});


export const metadata: Metadata = {
  title: {
    default: 'KASUPDA',
    template: '%s | KASUPDA',
  },
  description: 'Official portal for KASUPDA, Kaduna State. Find development guidelines, apply for permits, and stay updated on urban planning initiatives.',
  icons: {
    icon: '/image/logo.png',
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased", // Use the font variable
          inter.variable
        )}
      >
        <AppClientLayoutWrapper>
          {children}
        </AppClientLayoutWrapper>
      </body>
    </html>
  );
}
