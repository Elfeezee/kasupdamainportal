
'use client';

import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar'; // For mobile toggle
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, CalendarDays, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // State for client-side date and time to prevent hydration mismatch
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login?redirectTo=/dashboard');
    } else if (session?.user) {
      const role = (session.user as any).role;
      if (role === 'Admin' || role === 'Super Admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }
  }, [status, session, router]);

  useEffect(() => {
    // This effect runs only on the client, after hydration, to prevent mismatch
    const updateDateTime = () => {
        const now = new Date();
        setCurrentDate(format(now, "MMMM d, yyyy"));
        setCurrentTime(now.toLocaleTimeString());
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);
  
  if (loading || status === 'loading') {
    return (
        <div className="space-y-8">
            <Skeleton className="h-12 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
        </div>
    );
  }
  
  if (!session?.user) {
    return <div className="text-center p-8">Redirecting to login...</div>;
  }

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'User';

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" /> {/* Mobile sidebar toggle */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Welcome, {userName}!</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              This is your central hub for managing KASUPDA services.
            </p>
          </div>
        </div>
         {isAdmin && (
            <Button asChild>
                <Link href="/admin/dashboard">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Go to Admin Dashboard
                </Link>
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Date</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {currentDate ? (
              <div className="text-2xl font-bold">{currentDate}</div>
            ) : (
              <Skeleton className="h-8 w-48" />
            )}
            <p className="text-xs text-muted-foreground">
              Kaduna local date.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Time</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {currentTime ? (
              <div className="text-2xl font-bold">{currentTime}</div>
            ) : (
              <Skeleton className="h-8 w-32" />
            )}
             <p className="text-xs text-muted-foreground">
              Kaduna local time.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Use the sidebar navigation to apply for permits, check your application status, manage your profile, or access other KASUPDA services.
          </p>
            <Button asChild>
                <Link href="/dashboard/apply">
                    Apply for a Permit <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
};

export default DashboardPage;
