
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ApplicationSuccessPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
            <Card className="w-full max-w-lg mx-auto text-center">
                <CardHeader>
                    <PartyPopper className="mx-auto h-12 w-12 text-green-500" />
                    <CardTitle className="mt-4 text-2xl font-bold text-primary">Application Submitted Successfully!</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                        Your application has been received and is now pending review by our team.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        You can track the status of your application, including when the file number is assigned, on your "My Applications" page.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button onClick={() => router.push('/dashboard/my-applications')}>
                        Go to My Applications
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">
                            Return to Dashboard
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
