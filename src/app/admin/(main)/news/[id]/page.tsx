
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import ContentForm from '../ContentForm';
import { useParams, useSearchParams } from 'next/navigation';
import { getContentItem } from '@/app/actions/newsActions';

function EditContentPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const typeStr = searchParams.get('type') || 'news';
    const type = (['news', 'publication', 'statistic', 'event', 'leadership', 'carousel', 'mda'].includes(typeStr))
        ? typeStr as any
        : 'news';

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getContentItem(id, type);
                if (result) {
                    setData(result);
                }
            } catch (error) {
                console.error(`Error fetching ${type}:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, type]);

    if (loading) return <div>Loading content...</div>;
    if (!data) return <div>Content not found.</div>;

    return <ContentForm initialData={data} type={type} />;
}

export default function EditContentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditContentPageContent />
        </Suspense>
    );
}
