
"use client";

import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTopButton from '@/components/ui/scroll-to-top-button';
import { ThemeProvider } from '@/context/theme-provider';
import { ToastProvider } from '@/hooks/use-toast.tsx';
import ChatBot from '@/components/ai/chat-bot';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';

export default function AppClientLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const pathname = usePathname();

  const isDashboardPage = pathname.startsWith('/dashboard');
  const isAdminPage = pathname.startsWith('/admin');
  const showMainLayoutElements = !isDashboardPage && !isAdminPage;

  return (
    <ThemeProvider>
      <ToastProvider>
        {showMainLayoutElements && <Header />}
        <main className="flex-grow">{children}</main>
        {showMainLayoutElements && <Footer />}
        <Toaster />
        <ScrollToTopButton />

        {showMainLayoutElements && (
          <>
            <div className={cn(
              "fixed bottom-[2.5rem] right-[2.5rem] z-[100] transition-transform duration-300 ease-in-out",
              isChatOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
            )}>
              <Button
                size="icon"
                className="w-16 h-16 rounded-full shadow-2xl"
                onClick={() => setIsChatOpen(true)}
                aria-label="Open AI Chat"
              >
                <MessageSquare className="h-8 w-8" />
              </Button>
            </div>
            
            <div className={cn(
              "fixed bottom-0 right-0 z-[100] w-full h-full max-w-md max-h-[80vh] sm:bottom-8 sm:right-8 sm:max-h-[600px] transform transition-all duration-500 ease-in-out",
              isChatOpen ? "translate-x-0 translate-y-0 opacity-100" : "translate-x-full translate-y-full opacity-0 sm:translate-x-0"
            )}>
              <div className="h-full w-full relative flex flex-col">
                <ChatBot />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsChatOpen(false)}
                  className="absolute top-2 right-2 z-50 rounded-full w-8 h-8 bg-background/50 hover:bg-background"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}
