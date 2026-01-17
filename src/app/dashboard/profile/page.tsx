
import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function getProfileData() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirectTo=/dashboard/profile');
    }

    let profile = {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'N/A',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        din: 'Not yet assigned',
        address: 'Not available'
    };

    try {
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('din, name, phone')
            .eq('uid', user.id)
            .maybeSingle();

        if (profileError) {
            console.error("Error fetching DIN from profile:", profileError.message);
        }

        if (userProfile) {
            profile.din = userProfile.din || 'Not yet assigned';
            profile.name = user.user_metadata?.full_name || userProfile.name || profile.name;
            profile.phone = userProfile.phone || profile.phone;
        }
    } catch (error) {
        console.error("A critical error occurred while fetching profile data:", error);
    }

    return profile;
}

const ProfileItem = ({ label, value }: { label: string; value: string | null | undefined; }) => (
    <div className="flex flex-col space-y-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <p className="font-medium">{value || 'N/A'}</p>
    </div>
);

async function ProfilePageComponent() {
    const profileData = await getProfileData();

    async function handleActionClick(actionName: string) {
        'use server';
        // In a real app, this would trigger a server action.
        // For now, we just log and revalidate.
        console.log(`${actionName} functionality is not yet implemented.`);
        revalidatePath('/dashboard/profile');
    }

    return (
        <div className="space-y-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
                    <UserCircle2 className="mr-3 h-7 w-7" /> My Profile
                </CardTitle>
                <CardDescription>
                    View and manage your personal information and account settings.
                </CardDescription>
            </CardHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>This information is used for all your applications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <ProfileItem label="Full Name" value={profileData.name} />
                    <ProfileItem label="Development Identification Number (DIN)" value={profileData.din} />
                    <ProfileItem label="Email Address" value={profileData.email} />
                    <ProfileItem label="Phone Number" value={profileData.phone} />
                    <ProfileItem label="Registered Address" value={profileData.address} />

                    <div className="pt-4 flex flex-col sm:flex-row gap-2">
                        <form action={async () => { 'use server'; handleActionClick("Edit Profile") }}>
                            <Button type="submit">Edit Profile</Button>
                        </form>
                        <form action={async () => { 'use server'; handleActionClick("Change Password") }}>
                            <Button variant="outline" type="submit">Change Password</Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<LoadingProfilePage />}>
            <ProfilePageComponent />
        </Suspense>
    );
}

// Keep a loading component for suspense boundary
export function LoadingProfilePage() {
    return (
        <div className="space-y-8">
            <CardHeader className="px-0 pt-0">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-80" />
            </CardHeader>
            <Card>
                <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="flex flex-col space-y-1"><span className="text-sm text-muted-foreground">Full Name</span><Skeleton className="h-5 w-48" /></div>
                    <div className="flex flex-col space-y-1"><span className="text-sm text-muted-foreground">Development Identification Number (DIN)</span><Skeleton className="h-5 w-48" /></div>
                    <div className="flex flex-col space-y-1"><span className="text-sm text-muted-foreground">Email Address</span><Skeleton className="h-5 w-48" /></div>
                    <div className="flex flex-col space-y-1"><span className="text-sm text-muted-foreground">Phone Number</span><Skeleton className="h-5 w-48" /></div>
                    <div className="flex flex-col space-y-1"><span className="text-sm text-muted-foreground">Registered Address</span><Skeleton className="h-5 w-48" /></div>
                </CardContent>
            </Card>
        </div>
    );
}
