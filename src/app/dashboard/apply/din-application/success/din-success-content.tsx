
"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PartyPopper, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DinSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const din = searchParams.get('din');

    if (!din || din === 'ERROR') {
        return (
            <Card className="w-full max-w-lg mx-auto">
                <CardHeader className='text-center'>
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                    <CardTitle className='text-destructive'>Application Submission Error</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        Your DIN application was submitted, but there was an issue retrieving the generated DIN. Please check your "My Applications" page to see its status.
                    </p>
                </CardContent>
                 <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button onClick={() => router.push('/dashboard/my-applications')}>
                        View My Applications
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>
                        Return to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    if (din === 'PENDING') {
         return (
            <Card className="w-full max-w-lg mx-auto">
                <CardHeader className='text-center'>
                    <PartyPopper className="mx-auto h-12 w-12 text-green-500" />
                    <CardTitle className='text-primary'>Application Submitted!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        Your application for a Development Identification Number was submitted successfully and is now being processed.
                    </p>
                     <p className="text-muted-foreground">
                        You can check its status on your "My Applications" page.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button onClick={() => router.push('/dashboard/my-applications')}>
                        View My Applications
                    </Button>
                     <Button variant="outline" onClick={() => router.push('/dashboard')}>
                        Return to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        );
    }


    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className='text-center'>
                <PartyPopper className="mx-auto h-12 w-12 text-green-500" />
                <CardTitle className='text-primary'>Application Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                 <p className="text-muted-foreground">Your application was submitted successfully and your DIN has been generated.</p>
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Your Development Identification Number is:</p>
                    <p className="text-2xl font-bold tracking-widest text-primary">{din}</p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
                <Button onClick={() => router.push('/dashboard/my-applications')}>
                    View My Applications
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/dashboard">
                        Return to Dashboard
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
