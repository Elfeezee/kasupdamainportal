
import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import ApplicationDetails from '@/app/admin/(main)/applications/ApplicationDetails';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

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

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/my-applications">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Application Details</h1>
                    <p className="text-sm text-slate-500">
                        Viewing details for application ID: <span className="font-mono">{id}</span>
                    </p>
                </div>
            </div>

            <Card className="border-0 shadow-lg ring-1 ring-slate-200">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="bg-white p-2 rounded shadow-sm">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle>{application.type}</CardTitle>
                            <CardDescription>Submitted on {new Date(application.created_at).toLocaleDateString()}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <ApplicationDetails
                        application={application}
                        isEditing={false}
                        editedData={{}}
                        onInputChange={() => { }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
