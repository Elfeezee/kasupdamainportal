
'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import FinanceSidebar from '@/components/layout/finance-sidebar';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function FinanceAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFinanceAdminStatus = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({ title: 'Access Denied', description: 'You must be logged in to view this page.', variant: 'destructive' });
        router.replace('/admin/login');
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('uid', user.id)
        .single();
      
      if (profileError || !userProfile) {
        toast({ title: 'Access Denied', description: 'Could not verify your user role.', variant: 'destructive' });
        await supabase.auth.signOut();
        router.replace('/admin/login');
        return;
      }

      // Grant access if the user is a full Admin or a specific Finance admin
      if (userProfile.role === 'Admin' || userProfile.role === 'Finance') {
        setIsVerified(true);
      } else {
        toast({ title: 'Access Denied', description: 'You do not have finance or admin privileges.', variant: 'destructive' });
        await supabase.auth.signOut();
        router.replace('/admin/login');
      }
      
      setLoading(false);
    };

    checkFinanceAdminStatus();
  }, [router, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Verifying finance credentials...</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return null;
  }

  return (
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-var(--header-height,60px)-var(--footer-height,60px))]">
          <Sidebar 
            collapsible="icon" 
            className="border-r"
          >
            <FinanceSidebar />
          </Sidebar>
          <SidebarInset className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/30">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
  );
}
