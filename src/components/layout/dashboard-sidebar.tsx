
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  UserCircle2,
  ReceiptText,
  FolderArchive,
  LogOut,
  Fingerprint,
  ClipboardCheck, 
  BookUser,
  Award,
  Landmark,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

interface DashboardSidebarProps {
    userProfile: { din: string | null } | null;
    setLoading: (loading: boolean) => void;
}

export default function DashboardSidebar({ userProfile, setLoading }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { state, setOpenMobile } = useSidebar();
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      href: '/dashboard/apply/din-application', 
      label: 'Apply for DIN', 
      icon: Fingerprint 
    },
    { href: '/dashboard/my-dins', label: 'My DINs', icon: BookUser },
    { href: '/dashboard/apply', label: 'Apply for Permit', icon: FilePlus2, disabled: false },
    { href: '/dashboard/stage-approval', label: 'Apply for Stage Approval', icon: ClipboardCheck, disabled: false },
    { href: '/dashboard/apply/certificate-of-fitness', label: 'Apply for Certificate of Fitness', icon: Award, disabled: false },
    { href: '/dashboard/my-applications', label: 'My Applications', icon: ListChecks },
    { href: '/dashboard/billing', label: 'Billing & Payments', icon: Landmark },
    { href: '/dashboard/profile', label: 'My Profile', icon: UserCircle2, disabled: false },
    { href: '/dashboard/documents', label: 'My Documents', icon: FolderArchive, disabled: true },
  ];

  const handleLogout = async () => {
    setOpenMobile(false); // Close sidebar on mobile if open
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
    } else {
      router.push('/');
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    }
  };

  const handleNavigation = (href: string, label: string, disabled?: boolean) => {
    setOpenMobile(false); // Close sidebar on mobile
    if (disabled) {
      toast({
        title: 'Feature Pending',
        description: `The "${label}" feature is not yet available.`,
        variant: 'destructive',
      });
      return;
    }
    
    // If the path is the same, don't trigger loading
    if (pathname === href) return;

    setLoading(true);
    router.push(href);
  };


  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image src="/image/logo.png" alt="KASUPDA Logo" width={32} height={32} />
          <div className={cn("font-semibold text-lg text-primary", state === 'collapsed' && "hidden")}>
            KASUPDA
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                onClick={() => handleNavigation(item.href, item.label, item.disabled)}
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))}
                tooltip={state === 'collapsed' ? (item.label) : undefined}
                aria-disabled={item.disabled}
                className={cn(item.disabled && "opacity-50 cursor-not-allowed")}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn(state === 'collapsed' && "hidden")}>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="my-1" />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={state === 'collapsed' ? "Logout" : undefined}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span className={cn(state === 'collapsed' && "hidden")}>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
