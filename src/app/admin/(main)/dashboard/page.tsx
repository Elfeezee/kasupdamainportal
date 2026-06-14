
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle2, XCircle, BarChart as BarChartIcon, Loader2 } from 'lucide-react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart } from 'recharts';
import { getAllApplications } from '@/app/actions/adminActions';
import type { StoredApplication } from '../applications/page';
import { useToast } from '@/hooks/use-toast';

const processApplicationData = (applications: StoredApplication[]) => {
  const stats = {
    total: applications.length,
    inprogress: 0,
    approved: 0,
    rejected: 0,
    byType: {} as Record<string, { inprogress: number; approved: number; rejected: number; total: number }>,
  };

  applications.forEach(app => {
    // Skip if app or app.type is null/undefined
    if (!app || !app.type) {
      return;
    }

    if (app.status === 'Approved') {
      stats.approved++;
    } else if (app.status === 'Rejected') {
      stats.rejected++;
    } else {
      stats.inprogress++;
    }

    const simpleType = typeof app.type === 'string' ? app.type.split('(')[0].trim() : 'Unknown';
    if (!stats.byType[simpleType]) {
      stats.byType[simpleType] = { inprogress: 0, approved: 0, rejected: 0, total: 0 };
    }
    stats.byType[simpleType].total++;

    if (app.status === 'Approved') {
      stats.byType[simpleType].approved++;
    } else if (app.status === 'Rejected') {
      stats.byType[simpleType].rejected++;
    } else {
      stats.byType[simpleType].inprogress++;
    }
  });

  return {
    overview: [
      { title: "Total Applications", value: stats.total.toString(), icon: FileText },
      { title: "Inprogress Applications", value: stats.inprogress.toString(), icon: Clock },
      { title: "Approved Applications", value: stats.approved.toString(), icon: CheckCircle2 },
      { title: "Rejected Applications", value: stats.rejected.toString(), icon: XCircle },
    ],
    chartData: Object.entries(stats.byType).map(([name, data]) => ({
      name: name.replace(' Permit', ''),
      approved: data.approved,
      inprogress: data.inprogress,
      rejected: data.rejected
    }))
  };
};

const initialData: {
  overview: { title: string; value: string; icon: any }[];
  chartData: { name: string; approved: number; inprogress: number; rejected: number }[];
} = {
  overview: [
    { title: "Total Applications", value: "0", icon: FileText },
    { title: "Inprogress Applications", value: "0", icon: Clock },
    { title: "Approved Applications", value: "0", icon: CheckCircle2 },
    { title: "Rejected Applications", value: "0", icon: XCircle },
  ],
  chartData: []
};

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      setLoading(true);
      try {
        const result = await getAllApplications();
        if (result.success && result.data) {
          setDashboardData(processApplicationData(result.data as StoredApplication[]));
        } else {
          setDashboardData(initialData);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive"
        });
        setDashboardData(initialData);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, [toast]);

  const overviewCards = dashboardData.overview;

  return (
    <div className="space-y-8 w-full max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and statistics from the database.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map(card => (
          <Card key={card.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChartIcon className="mr-2 h-5 w-5 text-primary" />
            Application Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading chart data...
              </div>
            ) : dashboardData.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="approved" stackId="a" fill="hsl(var(--primary))" name="Approved" />
                  <Bar dataKey="inprogress" stackId="a" fill="hsl(var(--accent))" name="Inprogress" />
                  <Bar dataKey="rejected" stackId="a" fill="hsl(var(--destructive))" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No application data to display.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-muted rounded-md ${className}`} />;
}
