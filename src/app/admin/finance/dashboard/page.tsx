
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Banknote, Landmark } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const overviewData = [
  { title: "Total Revenue", value: "₦1,250,000", icon: DollarSign },
  { title: "Transactions Today", value: "12", icon: Banknote },
  { title: "Pending Verifications", value: "3", icon: Landmark },
];

const chartData = [
  { name: 'DIN', revenue: 40000 },
  { name: 'Permit', revenue: 300000 },
  { name: 'Stage', revenue: 20000 },
  { name: 'Street', revenue: 27800 },
  { name: 'Ads', revenue: 18900 },
];

export default function FinanceDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Finance Dashboard</h1>
        <p className="text-muted-foreground">Financial overview and transaction statistics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {overviewData.map(card => (
          <Card key={card.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
