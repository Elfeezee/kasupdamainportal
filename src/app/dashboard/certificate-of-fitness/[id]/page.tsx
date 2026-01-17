
'use server';

import React, { Suspense } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import CertificateOfFitnessContent from './CertificateOfFitnessContent';

async function getApplicationData(id: string) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?redirectTo=/dashboard/certificate-of-fitness/${id}`);
    }

    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('type', 'Certificate of Fitness')
        .eq('status', 'Approved')
        .single();

    if (error || !data) {
        console.error('Error fetching certificate of fitness data:', error);
        notFound();
    }

    return data;
}

function CertificateLoadingSkeleton() {
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

export default async function CertificateOfFitnessPage({ params }: { params: { id: string } }) {
    const applicationData = await getApplicationData(params.id);

    return (
        <div className="print-container">
            <Suspense fallback={<CertificateLoadingSkeleton />}>
                <CertificateOfFitnessContent applicationData={applicationData} />
            </Suspense>
        </div>
    );
}

