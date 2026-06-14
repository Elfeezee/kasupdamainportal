
'use server';

import React, { Suspense } from 'react';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { applications } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import AcknowledgementLetterContent from './AcknowledgementLetterContent';
import { Skeleton } from '@/components/ui/skeleton';

async function getApplicationData(id: string) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect(`/login?redirectTo=/dashboard/acknowledgement/${id}`);
    }

    const appId = parseInt(id);
    if (isNaN(appId)) notFound();

    const data = await db.query.applications.findFirst({
        where: and(
            eq(applications.id, appId),
            eq(applications.user_id, user.id!)
        )
    });

    if (!data) {
        notFound();
    }

    return {
        id: String(data.id),
        created_at: data.created_at?.toISOString() || '',
        user_id: data.user_id,
        type: data.type,
        applicant_name: data.applicant_name,
        status: data.status as any,
        rejection_reason: data.rejection_reason || undefined,
        original_permit_id: data.original_permit_id || undefined,
        din: data.din || undefined,
        data: data.data,
    };
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
        <div className="print-container">
            <Suspense fallback={<AcknowledgementLoadingSkeleton />}>
                <AcknowledgementLetterContent applicationData={applicationData} />
            </Suspense>
        </div>
    );
}
