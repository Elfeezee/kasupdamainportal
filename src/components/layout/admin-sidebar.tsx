
"use client";

import React, { useEffect, useState } from 'react';
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
  FileText,
  Users,
  Settings,
  LogOut,
  ArrowLeftToLine,
  Building,
  Fingerprint,
  ClipboardCheck,
  Package,
  Mail,
  Server,
  Landmark,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'All Applications', icon: Package },
  { href: '/admin/permit-applications', label: 'Permit Applications', icon: Building },
  { href: '/admin/din-applications', label: 'DIN Applications', icon: Fingerprint },
  { href: '/admin/stage-approvals', label: 'Stage Approvals', icon: ClipboardCheck },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/messages', label: 'Contact Messages', icon: Mail },
  { href: '/admin/finance/dashboard', label: 'Finance Panel', icon: Landmark },
  { href: '/admin/status', label: 'System Status', icon: Server },
  { href: '/admin/settings', label: 'Settings', icon: Settings, disabled: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { state, setOpenMobile } = useSidebar();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('read', false);

        if (error) throw error;
        setUnreadCount(count ?? 0);
      } catch (error) {
        console.error("Error fetching unread message count:", error);
      }
    };
    
    fetchUnreadCount();

    // Set up a real-time subscription
    const channel = supabase
      .channel('contact_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' },
        (payload) => {
          // Re-fetch the count whenever a message is inserted, updated, or deleted
          fetchUnreadCount();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleExitAdmin = () => {
    setOpenMobile(false);
    router.push('/dashboard');
    toast({ title: 'Exiting Admin View', description: 'Returning to your user dashboard.' });
  };

  const handleNavigation = (href: string, label: string, disabled?: boolean) => {
    setOpenMobile(false);
    if (disabled) {
      toast({
        title: 'Feature Pending',
        description: `${label} is not yet implemented.`,
      });
      return;
    }
    router.push(href);
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image src="/image/logo.png" alt="KASUPDA Logo" width={32} height={32} />
          <div className={cn("font-bold text-lg text-primary", state === 'collapsed' && "hidden")}>
            Admin Panel
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                onClick={() => handleNavigation(item.href, item.label, item.disabled)}
                isActive={pathname.startsWith(item.href)}
                tooltip={state === 'collapsed' ? item.label : undefined}
                aria-disabled={item.disabled}
                className={cn("relative", item.disabled && "opacity-50 cursor-not-allowed")}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn(state === 'collapsed' && "hidden")}>{item.label}</span>
                 {item.href === '/admin/messages' && unreadCount > 0 && (
                    <Badge className={cn("absolute right-2 transition-all duration-300", state === 'collapsed' && "top-0 right-0 h-4 w-4 p-0 justify-center")}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
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
              onClick={handleExitAdmin}
              tooltip={state === 'collapsed' ? "Exit Admin" : undefined}
            >
              <ArrowLeftToLine className="h-5 w-5" />
              <span className={cn(state === 'collapsed' && "hidden")}>Exit to App</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
