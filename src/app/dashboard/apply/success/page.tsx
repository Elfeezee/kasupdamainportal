
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
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Your application has been received. To process your application further, please proceed to the billing section to make the required payment.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800 text-sm">
                        <strong>Important:</strong> Your application will not be processed until the application fee is paid.
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button onClick={() => router.push('/dashboard/billing')} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                        Proceed to Payment
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/dashboard/my-applications')} className="w-full sm:w-auto">
                        View My Applications
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
