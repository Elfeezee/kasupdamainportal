
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getNewsItems() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching news items:', error);
        return [];
    }
    return data;
}

export async function getPublications() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching publications:', error);
        return [];
    }
    return data;
}

export async function saveNewsItem(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const date = formData.get('date') as string;
    const imageUrl = formData.get('imageUrl') as string;

    const payload = {
        title,
        summary,
        content,
        date: date || new Date().toISOString(),
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
        result = await supabase.from('news_items').update(payload).eq('id', id);
    } else {
        result = await supabase.from('news_items').insert([payload]);
    }

    if (result.error) {
        return { success: false, error: result.error.message };
    }

    revalidatePath('/news');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function deleteNewsItem(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('news_items').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/news');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function savePublication(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const summary = formData.get('summary') as string;
    const downloadUrl = formData.get('downloadUrl') as string;
    const imageUrl = formData.get('imageUrl') as string;

    const payload = {
        title,
        type,
        summary,
        download_url: downloadUrl,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
        result = await supabase.from('publications').update(payload).eq('id', id);
    } else {
        result = await supabase.from('publications').insert([payload]);
    }

    if (result.error) {
        return { success: false, error: result.error.message };
    }

    revalidatePath('/news');
    revalidatePath('/admin/publications');
    return { success: true };
}

export async function deletePublication(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('publications').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/news');
    revalidatePath('/admin/publications');
    return { success: true };
}
