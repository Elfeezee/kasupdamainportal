
'use server';

import React, { Suspense } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import AcknowledgementLetterContent from './AcknowledgementLetterContent';
import { Skeleton } from '@/components/ui/skeleton';

async function getApplicationData(id: string) {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?redirectTo=/dashboard/acknowledgement/${id}`);
    }

    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only see their own
        .single();

    if (error || !data) {
        console.error('Error fetching acknowledgement data:', error);
        notFound();
    }

    return data;
}

function AcknowledgementLoadingSkeleton() {
    return (
        <div className="bg-white dark:bg-card shadow-2xl max-w-4xl mx-auto font-serif text-black flex flex-col min-h-[1122px] p-8">
            <Skeleton className="h-16 w-full mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex-grow" />
            <div className="space-y-4 mt-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    )
}

export default async function AcknowledgementPage({ params }: { params: { id: string } }) {
    const applicationData = await getApplicationData(params.id);
    
    return (
        <div className="container mx-auto px-2 sm:px-4 py-8 bg-gray-200 dark:bg-gray-900 print:bg-white print-container">
             <Suspense fallback={<AcknowledgementLoadingSkeleton />}>
                <AcknowledgementLetterContent applicationData={applicationData} />
            </Suspense>
        </div>
    );
}
