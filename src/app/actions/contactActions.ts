
'use server';

import { db } from '@/lib/db';
import { contact_messages } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getUnreadMessageCount() {
    try {
        const result = await db.select({ value: count() })
            .from(contact_messages)
            .where(eq(contact_messages.is_read, false));
        
        return result[0]?.value || 0;
    } catch (error) {
        console.error('Error fetching unread message count:', error);
        return 0;
    }
}

export async function getContactMessages() {
    try {
        return await db.query.contact_messages.findMany({
            orderBy: (messages, { desc }) => [desc(messages.created_at)]
        });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        return [];
    }
}

export async function markMessageAsRead(id: string) {
    try {
        await db.update(contact_messages)
            .set({ is_read: true })
            .where(eq(contact_messages.id, id));
        
        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteMessage(id: string) {
    try {
        await db.delete(contact_messages).where(eq(contact_messages.id, id));
        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function submitContactForm(data: { name: string, email: string, subject: string, message: string }) {
    try {
        await db.insert(contact_messages).values({
            id: uuidv4(),
            ...data,
            is_read: false,
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
