
'use client';

import type { Metadata } from 'next';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/layout/dashboard-sidebar';
import { supabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

// We can't use static metadata in a client component layout
// export const metadata: Metadata = {
//   title: 'KASUPDA Dashboard',
//   description: 'Manage your KASUPDA applications and services.',
// };

interface UserProfile {
  din: string | null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Check if the current page is an acknowledgement letter page
  const isAcknowledgementPage = pathname.startsWith('/dashboard/acknowledgement/');

  useEffect(() => {
    // Whenever the path changes, we assume navigation has started,
    // so we turn off the loading state. This will be re-evaluated
    // if the new page has its own loading logic.
    setLoading(false);
  }, [pathname]);


  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        // Fetch from the 'users' table which now has the 'din' column
        const { data: profile, error } = await supabase
          .from('users')
          .select('din')
          .eq('uid', session.user.id)
          .maybeSingle();
        
        if (error) {
            console.error("Error fetching user profile for layout:", error.message || error);
            // Don't block rendering, just proceed without profile data
        }

        if (profile) {
          setUserProfile(profile as UserProfile);
        }

      } else if (sessionError) {
        console.error("Session fetch error:", sessionError.message);
      }
      
      setLoading(false);
    };

    fetchUserAndProfile();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        // Re-fetch profile on auth change, e.g., after DIN application
        fetchUserAndProfile(); 
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
        <SidebarInset className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
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
