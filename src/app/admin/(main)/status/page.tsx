
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { CheckCircle2, AlertTriangle, Loader2, Server } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function StatusPage() {
  const [dbStatus, setDbStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkDatabaseConnection = async () => {
    setDbStatus('loading');
    setErrorMessage(null);
    try {
      // Perform a simple, lightweight query to check the connection.
      // Fetching the count of users is a good, low-impact test.
      const { error } = await supabase
        .from('users')
        .select('uid', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      setDbStatus('success');
    } catch (error: any) {
      setDbStatus('error');
      setErrorMessage(error.message || 'An unknown error occurred.');
      console.error("Database connection check failed:", error);
    }
  };

  const StatusIndicator = () => {
    switch (dbStatus) {
        case 'success':
            return (
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Successfully connected to the database.</span>
                </div>
            );
        case 'error':
            return (
                <div className="flex flex-col gap-2 text-destructive">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">Failed to connect to the database.</span>
                    </div>
                    <p className="text-xs ml-7 bg-destructive/10 p-2 rounded-md">{errorMessage}</p>
                </div>
            );
        case 'loading':
            return (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-semibold">Testing connection...</span>
                </div>
            );
        default:
             return <p className="text-sm text-muted-foreground">Click the button to test the database connection.</p>;
    }
  };

  return (
    <div className="space-y-8">
       <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
            <Server className="mr-3 h-7 w-7" /> System Status
        </CardTitle>
        <CardDescription>
          Check the health and connectivity of your application's services.
        </CardDescription>
      </CardHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Database Connection</CardTitle>
          <CardDescription>
            Verify that the application can successfully communicate with the Supabase database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/40 min-h-[60px] flex items-center">
            <StatusIndicator />
          </div>
          <Button onClick={checkDatabaseConnection} disabled={dbStatus === 'loading'}>
            {dbStatus === 'loading' ? 'Checking...' : 'Check Connection'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
