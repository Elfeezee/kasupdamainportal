
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Banknote, Landmark, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { getTransactions } from '@/app/actions/billingActions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { isToday, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';

interface DashboardStats {
  totalRevenue: number;
  transactionsToday: number;
  pendingVerifications: number;
  chartData: { name: string; revenue: number }[];
}

export default function FinanceDashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    transactionsToday: 0,
    pendingVerifications: 0,
    chartData: [],
  });
  const { toast } = useToast();
  const router = useRouter();

  const roleLoading = status === 'loading';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const loadDashboardData = useCallback(async () => {
    if (roleLoading) return;
    setLoading(true);
    try {
      const transactions = await getTransactions();

      const verifiedTransactions = transactions.filter(t => t.status === 'Verified');
      const totalRevenue = verifiedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const transactionsToday = transactions.filter(t => {
        const date = t.created_at instanceof Date ? t.created_at : parseISO(t.created_at as string);
        return isToday(date);
      }).length;
      const pendingVerifications = transactions.filter(t => t.status === 'Pending').length;

      // Process chart data
      const revenueByType: Record<string, number> = {};
      verifiedTransactions.forEach(t => {
        const type = t.applications?.type || 'Other';
        const simpleType = type.split('(')[0].trim().replace(' Application', '');
        revenueByType[simpleType] = (revenueByType[simpleType] || 0) + (t.amount || 0);
      });

      const chartData = Object.entries(revenueByType).map(([name, revenue]) => ({
        name,
        revenue,
      })).sort((a, b) => b.revenue - a.revenue);

      setStats({
        totalRevenue,
        transactionsToday,
        pendingVerifications,
        chartData,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({ title: "Error", description: "Failed to load dashboard statistics.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [roleLoading, toast]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadDashboardData();
    }
  }, [status, loadDashboardData]);

  if (roleLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const overviewCards = [
    { title: "Total Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
    { title: "Transactions Today", value: stats.transactionsToday.toString(), icon: Banknote },
    { title: "Pending Verifications", value: stats.pendingVerifications.toString(), icon: Landmark },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Finance Dashboard</h1>
        <p className="text-muted-foreground">Financial overview and transaction statistics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {overviewCards.map(card => (
          <Card key={card.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Revenue by Application Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading chart data...
              </div>
            ) : stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`} />
                  <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">
                No revenue data available to display.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
