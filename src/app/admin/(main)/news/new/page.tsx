
'use client';

import React, { Suspense } from 'react';
import ContentForm from '../ContentForm';
import { useSearchParams } from 'next/navigation';

function NewContentPageContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') === 'publication' ? 'publication' : 'news';

    return <ContentForm type={type} />;
}

export default function NewContentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewContentPageContent />
        </Suspense>
    );
}
