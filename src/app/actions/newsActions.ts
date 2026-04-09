
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

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

export async function getNewsItem(id: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching news item:', error);
        return null;
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
    const imageFile = formData.get('imageFile') as File;
    let imageUrl = formData.get('existingImageUrl') as string;

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news_media')
            .upload(filePath, imageFile);

        if (uploadError) {
            return { success: false, error: `Image upload failed: ${uploadError.message}` };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('news_media')
            .getPublicUrl(filePath);

        imageUrl = publicUrl;
    }

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
    const imageFile = formData.get('imageFile') as File;
    const docFile = formData.get('docFile') as File;
    let imageUrl = formData.get('existingImageUrl') as string;
    let downloadUrl = formData.get('existingDownloadUrl') as string;

    // Handle Image Upload
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `publications/images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news_media')
            .upload(filePath, imageFile);

        if (uploadError) return { success: false, error: `Image upload failed: ${uploadError.message}` };

        const { data: { publicUrl } } = supabase.storage
            .from('news_media')
            .getPublicUrl(filePath);

        imageUrl = publicUrl;
    }

    // Handle Document Upload
    if (docFile && docFile.size > 0) {
        const fileExt = docFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `publications/docs/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news_media')
            .upload(filePath, docFile);

        if (uploadError) return { success: false, error: `Document upload failed: ${uploadError.message}` };

        const { data: { publicUrl } } = supabase.storage
            .from('news_media')
            .getPublicUrl(filePath);

        downloadUrl = publicUrl;
    }

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
    revalidatePath('/admin/news');
    return { success: true };
}

export async function deletePublication(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('publications').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/news');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function getStatistics() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('site_statistics')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching statistics:', error);
        return [];
    }
    return data;
}

export async function saveStatistic(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const id = formData.get('id') as string;
    const label = formData.get('label') as string;
    const value = formData.get('value') as string;
    const icon = formData.get('icon') as string;
    const display_order = parseInt(formData.get('display_order') as string || '0');

    const payload = {
        label,
        value,
        icon,
        display_order,
        updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
        result = await supabase.from('site_statistics').update(payload).eq('id', id);
    } else {
        result = await supabase.from('site_statistics').insert([payload]);
    }

    if (result.error) return { success: false, error: result.error.message };

    revalidatePath('/');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function deleteStatistic(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('site_statistics').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function getEvents() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('site_events')
        .select('*')
        .order('event_date', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }
    return data;
}

export async function saveEvent(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const event_date = formData.get('event_date') as string;
    const date_text = formData.get('date_text') as string;

    const payload = {
        title,
        event_date: event_date || new Date().toISOString(),
        date_text,
        updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
        result = await supabase.from('site_events').update(payload).eq('id', id);
    } else {
        result = await supabase.from('site_events').insert([payload]);
    }

    if (result.error) return { success: false, error: result.error.message };

    revalidatePath('/');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function deleteEvent(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('site_events').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function getLeadership() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('site_leadership')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching leadership:', error);
        return [];
    }
    return data;
}

export async function saveLeadershipPerson(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const bio = formData.get('bio') as string;
    const full_bio = formData.get('full_bio') as string;

    // Handle image file or existing URL
    const imageFile = formData.get('imageFile') as File;
    let imageUrl = formData.get('existingImageUrl') as string || '';

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `leadership/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news-thumbnails')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Leadership image upload error:', uploadError);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('news-thumbnails')
                .getPublicUrl(filePath);
            imageUrl = publicUrl;
        }
    }

    const payload = {
        name,
        role,
        bio,
        full_bio,
        image_url: imageUrl,
        display_order: parseInt(formData.get('display_order') as string || '0'),
        updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
        result = await supabase.from('site_leadership').update(payload).eq('id', id);
    } else {
        result = await supabase.from('site_leadership').insert([payload]);
    }

    if (result.error) return { success: false, error: result.error.message };

    revalidatePath('/');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function deleteLeadershipPerson(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('site_leadership').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function getCarouselImages() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('site_carousel')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching carousel:', error);
        return [];
    }
    return data;
}

export async function saveCarouselImage(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const alt_text = formData.get('alt_text') as string;
    const imageFile = formData.get('imageFile') as File;
    let imageUrl = formData.get('existingImageUrl') as string || '';

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `carousel-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `carousel/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news-thumbnails')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Carousel image upload error:', uploadError);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('news-thumbnails')
                .getPublicUrl(filePath);
            imageUrl = publicUrl;
        }
    }

    const payload = {
        title,
        subtitle,
        alt_text,
        image_url: imageUrl,
        display_order: parseInt(formData.get('display_order') as string || '0'),
        updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
        result = await supabase.from('site_carousel').update(payload).eq('id', id);
    } else {
        result = await supabase.from('site_carousel').insert([payload]);
    }

    if (result.error) return { success: false, error: result.error.message };

    revalidatePath('/');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function deleteCarouselImage(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('site_carousel').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function getMDALogos() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('site_mda_logos')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching MDA logos:', error);
        return [];
    }
    return data;
}

export async function saveMDALogo(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const imageFile = formData.get('imageFile') as File;
    let logoUrl = formData.get('existingImageUrl') as string || '';

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `mda-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `mda-logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news-thumbnails')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('MDA logo upload error:', uploadError);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('news-thumbnails')
                .getPublicUrl(filePath);
            logoUrl = publicUrl;
        }
    }

    const payload = {
        name,
        logo_url: logoUrl,
        display_order: parseInt(formData.get('display_order') as string || '0'),
        updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
        result = await supabase.from('site_mda_logos').update(payload).eq('id', id);
    } else {
        result = await supabase.from('site_mda_logos').insert([payload]);
    }

    if (result.error) return { success: false, error: result.error.message };

    revalidatePath('/news');
    revalidatePath('/admin/news');
    return { success: true };
}

export async function deleteMDALogo(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('site_mda_logos').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    revalidatePath('/news');
    revalidatePath('/admin/news');
    return { success: true };
}

