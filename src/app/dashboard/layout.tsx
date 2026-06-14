
'use client';

import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/layout/dashboard-sidebar';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface UserProfile {
  din: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check if the current page is an acknowledgement letter page
  const isAcknowledgementPage = pathname.startsWith('/dashboard/acknowledgement/');

  // Handle redirection if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      const timer = setTimeout(() => {
        router.push('/login?redirectTo=' + pathname);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status, router, pathname]);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        setLoading(true);
        try {
          // This would ideally be a server action, but we'll simulate it for now 
          // or use the session directly if it has the data
          // For now, let's just use the session data
          setUserProfile({
            din: (session.user as any).din || null
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
        fetchProfile();
    } else if (status === 'loading') {
        setLoading(true);
    } else {
        setLoading(false);
    }
  }, [session, status]);

  // If it's the acknowledgement page, render children directly without the sidebar layout
  if (isAcknowledgementPage) {
    return <div className="bg-muted/30">{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-var(--header-height,60px)-var(--footer-height,60px))]"> {/* Adjusted default heights slightly */}
        <Sidebar
          collapsible="icon"
          className="border-r"
        >
          <DashboardSidebar userProfile={userProfile} setLoading={setLoading} />
        </Sidebar>
        <SidebarInset className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative flex flex-col items-center">
          {loading ? (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">Loading Page...</p>
              </div>
            </div>
          ) : children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
