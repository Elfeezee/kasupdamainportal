
import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import UserApplicationDetailView from './UserApplicationDetailView';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getApplication(id: string, userId: string) {
    const supabase = await createSupabaseServerClient();

    // We fetch the single application ensuring it belongs to the user
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return null;
    }
    return data;
}

export default async function UserApplicationDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const application = await getApplication(id, user.id);

    if (!application) {
        notFound();
    }

    return <UserApplicationDetailView application={application} />;
}
