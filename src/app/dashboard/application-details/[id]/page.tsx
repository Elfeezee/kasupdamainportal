
import React from 'react';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { applications } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import UserApplicationDetailView from './UserApplicationDetailView';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getApplication(id: string, userId: string) {
    const appId = parseInt(id);
    if (isNaN(appId)) return null;

    const data = await db.query.applications.findFirst({
        where: and(
            eq(applications.id, appId),
            eq(applications.user_id, userId)
        )
    });

    return data;
}

export default async function UserApplicationDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect('/login');
    }

    const applicationData = await getApplication(id, user.id!);

    if (!applicationData) {
        notFound();
    }

    // Cast to expected format if needed
    const application = {
        ...applicationData,
        id: String(applicationData.id),
        status: applicationData.status as any,
        created_at: applicationData.created_at?.toISOString() || '',
    };

    return <UserApplicationDetailView application={application} />;
}
