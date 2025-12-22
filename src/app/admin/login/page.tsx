
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: userProfile } = await supabase
                .from('users')
                .select('role')
                .eq('uid', user.id)
                .single();
            if (userProfile?.role === 'Admin') {
                router.replace('/admin/dashboard');
            } else if (userProfile?.role === 'Finance') {
                router.replace('/admin/finance/dashboard');
            }
        }
    };
    checkUser();
  }, [router]);

  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }
      
      if (authData.user) {
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('role')
            .eq('uid', authData.user.id)
            .single();

        if (profileError) {
            throw new Error("Could not verify user role.");
        }

        if (userProfile && userProfile.role === 'Admin') {
            toast({
                title: 'Admin Login Successful!',
                description: 'Redirecting to the admin dashboard...',
            });
            router.replace('/admin/dashboard');
        } else if (userProfile && userProfile.role === 'Finance') {
            toast({
                title: 'Finance Login Successful!',
                description: 'Redirecting to the finance dashboard...',
            });
            router.replace('/admin/finance/dashboard');
        } else {
            await supabase.auth.signOut();
            throw new Error("Access Denied. You do not have sufficient privileges.");
        }
      }

    } catch (error: any) {
      let errorMessage = "An unknown error occurred.";
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast({
        title: 'Login Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="text-3xl font-bold text-primary">Restricted Access</CardTitle>
          <CardDescription>Enter your credentials to access the KASUPDA admin panels.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="admin@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}
            
            <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting}>
                {isSubmitting ? 'Authenticating...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
