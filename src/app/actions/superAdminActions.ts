
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';

/**
 * Fetches all users for the super admin dashboard.
 */
export async function getAllUsers(): Promise<any[]> {
    try {
        const data = await db.query.users.findMany({
            orderBy: [desc(users.createdAt)]
        });
        
        // Map MySQL schema fields to what the UI expects (AppUser interface)
        return data.map(user => ({
            uid: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            created_at: user.createdAt,
            din: user.din
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

/**
 * Updates a user's role.
 */
export async function updateUserRole(uid: string, newRole: string): Promise<{ success: boolean; error?: string }> {
    const session = await auth();
    if (!session || (session.user as any).role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized. Only Super Admins can change roles.' };
    }

    try {
        await db.update(users)
            .set({ role: newRole as any })
            .where(eq(users.id, uid));

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error('Update User Role Error:', errorMessage);
        return { success: false, error: `Failed to update user role: ${errorMessage}` };
    }
}

/**
 * Deletes a user from the public users table.
 */
export async function deleteUserRecord(uid: string): Promise<{ success: boolean; error?: string }> {
    const session = await auth();
    if (!session || (session.user as any).role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized. Only Super Admins can delete users.' };
    }

    try {
        await db.delete(users)
            .where(eq(users.id, uid));

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error('Delete User Error:', errorMessage);
        return { success: false, error: `Failed to delete user record: ${errorMessage}` };
    }
}

/**
 * Manually creates a user record in the database.
 */
export async function createUserRecord(data: { name: string, email: string, role: string, phone?: string }): Promise<{ success: boolean; error?: string }> {
    const session = await auth();
    if (!session || (session.user as any).role !== 'Super Admin') {
        return { success: false, error: 'Unauthorized. Only Super Admins can create users.' };
    }

    try {
        // Since we don't have a password here, we'll need to set a default or handle it
        // For now, this is just to create the record. 
        // Real user creation usually happens via signup or a dedicated admin form with password.
        
        await db.insert(users).values({
            id: crypto.randomUUID(), // Or let MySQL generate if using auto-increment, but schema uses string ID
            name: data.name,
            email: data.email,
            role: data.role as any,
            phone: data.phone,
        });

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to create user: ${errorMessage}` };
    }
}
