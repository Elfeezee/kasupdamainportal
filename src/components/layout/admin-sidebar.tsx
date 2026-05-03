
'use client';

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
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { getUnreadMessageCount } from '@/app/actions/contactActions';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'All Applications', icon: Package },
  { href: '/admin/permit-applications', label: 'Permit Applications', icon: Building },
  { href: '/admin/din-applications', label: 'DIN Applications', icon: Fingerprint },
  { href: '/admin/stage-approvals', label: 'Stage Approvals', icon: ClipboardCheck },
  { href: '/admin/users', label: 'User Management', icon: Users, allowedRoles: ['Super Admin'] },
  { href: '/admin/finance/dashboard', label: 'Finance', icon: Landmark, allowedRoles: ['Super Admin', 'Finance'] },
  { href: '/admin/messages', label: 'Contact Messages', icon: Mail },
  { href: '/admin/news', label: 'News & Publications', icon: FileText },
  { href: '/admin/status', label: 'System Status', icon: Server },
  { href: '/admin/settings', label: 'Settings', icon: Settings, allowedRoles: ['Super Admin'] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { state, setOpenMobile } = useSidebar();
  const [unreadCount, setUnreadCount] = useState(0);

  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadMessageCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching unread message count:", error);
      }
    };

    fetchUnreadCount();
    
    // We can't do real-time easily with Drizzle/MySQL without WebSockets/Pusher
    // For now, we'll just poll every 30 seconds or just fetch once
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleExitAdmin = () => {
    setOpenMobile(false);
    router.push('/dashboard');
    toast({ title: 'Exiting Admin View', description: 'Returning to your user dashboard.' });
  };

  const handleNavigation = (href: string, label: string) => {
    setOpenMobile(false);
    router.push(href);
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Image src="/image/logo.png" alt="KASUPDA Logo" width={40} height={40} className="h-10 w-10" />
          <div className={cn("font-bold text-lg text-primary", state === 'collapsed' && "hidden")}>
            Admin Panel
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {adminNavItems.map((item) => {
            // Role-based visibility check
            if (item.allowedRoles && (!userRole || !item.allowedRoles.includes(userRole))) {
              return null;
            }

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  onClick={() => handleNavigation(item.href, item.label)}
                  isActive={pathname.startsWith(item.href)}
                  tooltip={state === 'collapsed' ? item.label : undefined}
                  className="relative"
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
            );
          })}
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
