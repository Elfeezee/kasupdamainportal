
'use server';

import { db } from '@/lib/db';
import { news_items, publications, site_statistics, site_events, site_leadership, site_carousel, site_mda_logos } from '@/lib/db/schema';
import { desc, eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Local storage helper
async function saveFileLocally(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const relativePath = `/uploads/${folder}/${fileName}`;
    const absolutePath = join(process.cwd(), 'public', relativePath);
    
    // Ensure directory exists
    await mkdir(join(process.cwd(), 'public', 'uploads', folder), { recursive: true });
    
    await writeFile(absolutePath, buffer);
    return relativePath;
}

export async function getNewsItems() {
    try {
        return await db.query.news_items.findMany({
            orderBy: [desc(news_items.date)]
        });
    } catch (error) {
        console.error('Error fetching news items:', error);
        return [];
    }
}

export async function getNewsItem(id: string) {
    try {
        const item = await db.query.news_items.findFirst({
            where: eq(news_items.id, id)
        });
        return item || null;
    } catch (error) {
        console.error('Error fetching news item:', error);
        return null;
    }
}

export async function getPublications() {
    try {
        return await db.query.publications.findMany({
            orderBy: [desc(publications.created_at)]
        });
    } catch (error) {
        console.error('Error fetching publications:', error);
        return [];
    }
}

export async function saveNewsItem(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const date = formData.get('date') as string;
    const imageFile = formData.get('imageFile') as File;
    let imageUrl = formData.get('existingImageUrl') as string;

    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveFileLocally(imageFile, 'news');
    }

    const payload = {
        title,
        summary,
        content,
        date: date ? new Date(date) : new Date(),
        image_url: imageUrl,
    };

    try {
        if (id) {
            await db.update(news_items).set({ ...payload, updated_at: new Date() }).where(eq(news_items.id, id));
        } else {
            await db.insert(news_items).values({
                id: uuidv4(),
                ...payload
            });
        }

        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteNewsItem(id: string) {
    try {
        await db.delete(news_items).where(eq(news_items.id, id));
        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function savePublication(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const summary = formData.get('summary') as string;
    const imageFile = formData.get('imageFile') as File;
    const docFile = formData.get('docFile') as File;
    let imageUrl = formData.get('existingImageUrl') as string;
    let downloadUrl = formData.get('existingDownloadUrl') as string;

    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveFileLocally(imageFile, 'publications/images');
    }

    if (docFile && docFile.size > 0) {
        downloadUrl = await saveFileLocally(docFile, 'publications/docs');
    }

    const payload = {
        title,
        type,
        summary,
        download_url: downloadUrl,
        image_url: imageUrl,
    };

    try {
        if (id) {
            await db.update(publications).set({ ...payload, updated_at: new Date() }).where(eq(publications.id, id));
        } else {
            await db.insert(publications).values({
                id: uuidv4(),
                ...payload
            });
        }

        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePublication(id: string) {
    try {
        await db.delete(publications).where(eq(publications.id, id));
        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getStatistics() {
    try {
        return await db.query.site_statistics.findMany({
            orderBy: [asc(site_statistics.display_order)]
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return [];
    }
}

export async function saveStatistic(formData: FormData) {
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
    };

    try {
        if (id) {
            await db.update(site_statistics).set({ ...payload, updated_at: new Date() }).where(eq(site_statistics.id, id));
        } else {
            await db.insert(site_statistics).values({
                id: uuidv4(),
                ...payload
            });
        }

        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteStatistic(id: string) {
    try {
        await db.delete(site_statistics).where(eq(site_statistics.id, id));
        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getEvents() {
    try {
        return await db.query.site_events.findMany({
            orderBy: [asc(site_events.event_date)]
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

export async function saveEvent(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const event_date = formData.get('event_date') as string;
    const date_text = formData.get('date_text') as string;

    const payload = {
        title,
        event_date: event_date ? new Date(event_date) : new Date(),
        date_text,
    };

    try {
        if (id) {
            await db.update(site_events).set({ ...payload, updated_at: new Date() }).where(eq(site_events.id, id));
        } else {
            await db.insert(site_events).values({
                id: uuidv4(),
                ...payload
            });
        }

        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteEvent(id: string) {
    try {
        await db.delete(site_events).where(eq(site_events.id, id));
        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getLeadership() {
    try {
        return await db.query.site_leadership.findMany({
            orderBy: [asc(site_leadership.display_order)]
        });
    } catch (error) {
        console.error('Error fetching leadership:', error);
        return [];
    }
}

export async function saveLeadershipPerson(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const bio = formData.get('bio') as string;
    const full_bio = formData.get('full_bio') as string;
    const imageFile = formData.get('imageFile') as File;
    let imageUrl = formData.get('existingImageUrl') as string || '';

    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveFileLocally(imageFile, 'leadership');
    }

    const payload = {
        name,
        role,
        bio,
        full_bio,
        image_url: imageUrl,
        display_order: parseInt(formData.get('display_order') as string || '0'),
    };

    try {
        if (id) {
            await db.update(site_leadership).set({ ...payload, updated_at: new Date() }).where(eq(site_leadership.id, id));
        } else {
            await db.insert(site_leadership).values({
                id: uuidv4(),
                ...payload
            });
        }

        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteLeadershipPerson(id: string) {
    try {
        await db.delete(site_leadership).where(eq(site_leadership.id, id));
        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getCarouselImages() {
    try {
        return await db.query.site_carousel.findMany({
            orderBy: [asc(site_carousel.display_order)]
        });
    } catch (error) {
        console.error('Error fetching carousel:', error);
        return [];
    }
}

export async function saveCarouselImage(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const alt_text = formData.get('alt_text') as string;
    const imageFile = formData.get('imageFile') as File;
    let imageUrl = formData.get('existingImageUrl') as string || '';

    if (imageFile && imageFile.size > 0) {
        imageUrl = await saveFileLocally(imageFile, 'carousel');
    }

    const payload = {
        title,
        subtitle,
        alt_text,
        image_url: imageUrl,
        display_order: parseInt(formData.get('display_order') as string || '0'),
    };

    try {
        if (id) {
            await db.update(site_carousel).set({ ...payload, updated_at: new Date() }).where(eq(site_carousel.id, id));
        } else {
            await db.insert(site_carousel).values({
                id: uuidv4(),
                ...payload
            });
        }

        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteCarouselImage(id: string) {
    try {
        await db.delete(site_carousel).where(eq(site_carousel.id, id));
        revalidatePath('/');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getMDALogos() {
    try {
        return await db.query.site_mda_logos.findMany({
            orderBy: [asc(site_mda_logos.display_order)]
        });
    } catch (error) {
        console.error('Error fetching MDA logos:', error);
        return [];
    }
}

export async function saveMDALogo(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const imageFile = formData.get('imageFile') as File;
    let logoUrl = formData.get('existingImageUrl') as string || '';

    if (imageFile && imageFile.size > 0) {
        logoUrl = await saveFileLocally(imageFile, 'mda-logos');
    }

    const payload = {
        name,
        logo_url: logoUrl,
        display_order: parseInt(formData.get('display_order') as string || '0'),
    };

    try {
        if (id) {
            await db.update(site_mda_logos).set({ ...payload, updated_at: new Date() }).where(eq(site_mda_logos.id, id));
        } else {
            await db.insert(site_mda_logos).values({
                id: uuidv4(),
                ...payload
            });
        }

        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteMDALogo(id: string) {
    try {
        await db.delete(site_mda_logos).where(eq(site_mda_logos.id, id));
        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
