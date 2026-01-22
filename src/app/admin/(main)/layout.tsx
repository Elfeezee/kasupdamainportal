
'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/layout/admin-sidebar';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({ title: 'Access Denied', description: 'You must be logged in to view this page.', variant: 'destructive' });
        router.replace('/admin/login');
        return;
      }

      // User exists, now check the user's role from the public 'users' table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('uid', user.id)
        .single();

      if (profileError || !userProfile) {
        console.error('Profile Error:', profileError?.message || 'User profile not found.');
        toast({ title: 'Access Denied', description: 'Could not verify your user role.', variant: 'destructive' });
        await supabase.auth.signOut();
        router.replace('/admin/login');
        return;
      }

      const allowedRoles = ['Admin', 'Super Admin', 'Finance'];
      if (userProfile && allowedRoles.includes(userProfile.role)) {
        setIsVerified(true);
      } else {
        toast({ title: 'Access Denied', description: 'You do not have administrative privileges.', variant: 'destructive' });
        await supabase.auth.signOut();
        router.replace('/admin/login');
      }

      setLoading(false); // Set loading to false after all checks are done
    };

    checkAdminStatus();
  }, [router, toast]);

  if (loading) { // Show a loading screen while we verify
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    // This part should ideally not be reached if redirects work, but serves as a fallback.
    return null;
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-var(--header-height,60px)-var(--footer-height,60px))]">
        <Sidebar
          collapsible="icon"
          className="border-r"
        >
          <AdminSidebar />
        </Sidebar>
        <SidebarInset className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/30 flex flex-col items-center">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
