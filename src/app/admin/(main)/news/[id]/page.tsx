
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
    const typeStr = searchParams.get('type') || 'news';
    const type = (['news', 'publication', 'statistic', 'event', 'leadership', 'carousel'].includes(typeStr))
        ? typeStr as any
        : 'news';

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            let table = 'news_items';
            if (type === 'publication') table = 'publications';
            else if (type === 'statistic') table = 'site_statistics';
            else if (type === 'event') table = 'site_events';
            else if (type === 'leadership') table = 'site_leadership';
            else if (type === 'carousel') table = 'site_carousel';

            try {
                const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
                if (error) throw error;
                if (data) {
                    setData(data);
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
