
"use client";

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';

// This page is now a simple redirector. The actual content is in /dashboard/acknowledgement/[id]
export default function ApplicationSuccessPage() {
    const router = useRouter();

    // We use a client component with useEffect to get search params safely
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const appId = params.get('id');
        if (appId) {
            // Redirect to the new permanent acknowledgement page
            router.replace(`/dashboard/acknowledgement/${appId}`);
        } else {
            // If for some reason there's no ID, go to the applications list
            router.replace('/dashboard/my-applications');
        }
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p>Redirecting to your acknowledgement letter...</p>
        </div>
    );
}
