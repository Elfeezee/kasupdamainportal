
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function updateUserProfile(formData: {
    name?: string;
    phone?: string;
    address?: string;
}) {
    const session = await auth();

    if (!session || !session.user) {
        return { success: false, error: 'User not authenticated' };
    }

    try {
        // Update the users table in MySQL
        await db.update(users)
            .set({
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            })
            .where(eq(users.id, session.user.id as string));

        revalidatePath('/dashboard/profile');
        return { success: true };
    } catch (error: any) {
        console.error('Update Profile Error:', error);
        return { success: false, error: error.message || 'Failed to update profile' };
    }
}

export async function changeUserPassword(password: string) {
    const session = await auth();

    if (!session || !session.user) {
        return { success: false, error: 'User not authenticated' };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.update(users)
            .set({
                password: hashedPassword
            })
            .where(eq(users.id, session.user.id as string));

        return { success: true };
    } catch (error: any) {
        console.error('Change Password Error:', error);
        return { success: false, error: error.message || 'Failed to change password' };
    }
}
