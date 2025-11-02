
"use client";

import React, { Suspense } from 'react';
import DinSuccessContent from './din-success-content';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function Loading() {
    return (
         <Card className="w-full max-w-lg mx-auto">
            <CardHeader className='text-center'>
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-8 w-48 mx-auto mt-4" />
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <Skeleton className="h-5 w-full" />
                <div className="p-4 bg-muted rounded-lg space-y-2">
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                    <Skeleton className="h-8 w-1/3 mx-auto" />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-36" />
            </CardFooter>
        </Card>
    );
}


export default function DinApplicationSuccessPage() {
    return (
        <div className="container mx-auto px-2 sm:px-4 py-8">
            <Suspense fallback={<Loading />}>
                <DinSuccessContent />
            </Suspense>
        </div>
    )
}
