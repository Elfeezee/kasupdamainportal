
"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase/client';

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting}>
      {isSubmitting ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const paramError = searchParams.get('error');

  useEffect(() => {
    if (paramError) {
      toast({
        title: 'Authentication Error',
        description: paramError,
        variant: 'destructive',
      });
    }
  }, [paramError, toast]);


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // If user signs in, redirect them.
        router.push(redirectTo);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router, redirectTo]);


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: 'Login Successful!',
        description: 'Redirecting to your dashboard...',
      });
      // The onAuthStateChange listener will handle the redirect.

    } catch (error: any) {
      let errorMessage = "An unknown error occurred.";
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please try again.";
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
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-var(--header-height,100px)-var(--footer-height,100px))]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your KASUPDA dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p className="text-destructive text-xs mt-1 text-center">{error}</p>}
            
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
          
          <div className="text-center mt-6 text-sm">
            <Link href="#" className="text-primary hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>

        </CardContent>
        <CardFooter className="justify-center mt-2 pb-6">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/apply-for-permit" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
