
import React, { Suspense } from 'react';
import LoginForm from '@/app/login-form';
import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-var(--header-height,100px)-var(--footer-height,100px))]">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-5 w-64 mx-auto" />
                </div>
                <div className="space-y-6">
                    <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <Skeleton className="h-12 w-full" />
                </div>
                 <div className="space-y-6">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-12 w-full" />
                 </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<Loading />}>
            <LoginForm />
        </Suspense>
    );
}
