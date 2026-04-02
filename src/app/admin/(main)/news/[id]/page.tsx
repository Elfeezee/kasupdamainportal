
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import ContentForm from '../ContentForm';
import { useParams, useSearchParams } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';

function EditContentPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const typeStr = searchParams.get('type');
    const type = (typeStr === 'publication' || typeStr === 'statistic' || typeStr === 'event') ? typeStr : 'news';

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            let table = 'news_items';
            if (type === 'publication') table = 'publications';
            else if (type === 'statistic') table = 'site_statistics';
            else if (type === 'event') table = 'site_events';

            const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
            if (data) {
                setData(data);
            }
            setLoading(false);
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
