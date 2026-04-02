
'use client';

import React, { Suspense } from 'react';
import ContentForm from '../ContentForm';
import { useSearchParams } from 'next/navigation';

function NewContentPageContent() {
    const searchParams = useSearchParams();
    const typeStr = searchParams.get('type');
    const type = (typeStr === 'publication' || typeStr === 'statistic' || typeStr === 'event') ? typeStr : 'news';

    return <ContentForm type={type} />;
}

export default function NewContentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewContentPageContent />
        </Suspense>
    );
}
