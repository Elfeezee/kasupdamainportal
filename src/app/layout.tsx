
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import AppClientLayoutWrapper from '@/components/layout/app-client-layout-wrapper';
import { headers } from 'next/headers';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'KASUPDA',
    template: '%s | KASUPDA',
  },
  description: 'Official portal for KASUPDA, Kaduna State. Find development guidelines, apply for permits, and stay updated on urban planning initiatives.',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-next-pathname') || '';

  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAdminPage = pathname.startsWith('/admin');
  const showMainLayoutElements = !isDashboardPage && !isAdminPage;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased min-h-screen flex flex-col'
        )}
      >
        <AppClientLayoutWrapper showChatBot={showMainLayoutElements}>
            {showMainLayoutElements && <Header />}
            <main className="flex-grow">{children}</main>
            {showMainLayoutElements && <Footer />}
        </AppClientLayoutWrapper>
      </body>
    </html>
  );
}
