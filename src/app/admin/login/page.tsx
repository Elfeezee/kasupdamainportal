
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { signIn, useSession } from 'next-auth/react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = (session.user as any).role;
      if (role === 'Admin' || role === 'Super Admin') {
        router.replace('/admin/dashboard');
      } else if (role === 'Finance') {
        router.replace('/admin/finance/dashboard');
      }
    }
  }, [session, status, router]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>, role: 'Admin' | 'Finance') => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error === 'CredentialsSignin' ? 'Invalid email or password.' : result.error);
      }

      // The useEffect will handle redirection once the session is updated
      toast({ title: 'Login Successful!', description: 'Verifying your credentials...' });

    } catch (error: any) {
      const errorMessage = error.message || "An unknown error occurred.";
      setError(errorMessage);
      toast({ title: 'Login Error', description: errorMessage, variant: 'destructive' });
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
          <CardDescription>Select your role to access the KASUPDA admin panels.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
              <TabsTrigger value="finance">Finance Login</TabsTrigger>
            </TabsList>
            <TabsContent value="admin">
              <form onSubmit={(e) => handleLogin(e, 'Admin')} className="grid grid-cols-1 gap-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Address</Label>
                  <Input id="admin-email" name="email" type="email" placeholder="admin@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" name="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}
                <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...</> : 'Login as Admin'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="finance">
              <form onSubmit={(e) => handleLogin(e, 'Finance')} className="grid grid-cols-1 gap-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="finance-email">Email Address</Label>
                  <Input id="finance-email" name="email" type="email" placeholder="finance@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finance-password">Password</Label>
                  <Input id="finance-password" name="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}
                <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...</> : 'Login as Finance'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
