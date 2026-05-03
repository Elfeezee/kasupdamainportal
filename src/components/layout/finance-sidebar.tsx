
'use client';

import React from 'react';
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
  LogOut,
  ArrowLeftToLine,
  Landmark,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

const financeNavItems = [
  { href: '/admin/finance/dashboard', label: 'Finance Dashboard', icon: LayoutDashboard },
  { href: '/admin/finance/transactions', label: 'Transactions', icon: Landmark },
];

import { signOut } from 'next-auth/react';

export default function FinanceSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { state, setOpenMobile } = useSidebar();

  const handleExit = () => {
    setOpenMobile(false);
    router.push('/dashboard');
    toast({ title: 'Exiting Finance Panel', description: 'Returning to your user dashboard.' });
  };

  const handleNavigation = (href: string) => {
    setOpenMobile(false);
    router.push(href);
  };
  
  const handleLogout = async () => {
    setOpenMobile(false);
    await signOut({ callbackUrl: '/admin/login' });
    toast({ title: 'Logged Out' });
  };


  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image src="/image/logo.png" alt="KASUPDA Logo" width={32} height={32} />
          <div className={cn("font-bold text-lg text-primary", state === 'collapsed' && "hidden")}>
            Finance
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {financeNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                onClick={() => handleNavigation(item.href)}
                isActive={pathname === item.href}
                tooltip={state === 'collapsed' ? item.label : undefined}
                className="relative"
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
              onClick={handleExit}
              tooltip={state === 'collapsed' ? "Exit to App" : undefined}
            >
              <ArrowLeftToLine className="h-5 w-5" />
              <span className={cn(state === 'collapsed' && "hidden")}>Exit to App</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
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
