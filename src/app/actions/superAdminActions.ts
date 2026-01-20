'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Fetches all users for the super admin dashboard.
 */
export async function getAllUsers(): Promise<any[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }
    return data || [];
}

/**
 * Updates a user's role.
 */
export async function updateUserRole(uid: string, newRole: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseServerClient();

    try {
        const { error } = await supabase
            .from('users')
            .update({ role: newRole })
            .eq('uid', uid);

        if (error) throw error;

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
 * Note: This does not delete the user from Supabase Auth without the service role key.
 */
export async function deleteUserRecord(uid: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseServerClient();

    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('uid', uid);

        if (error) throw error;

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error('Delete User Error:', errorMessage);
        return { success: false, error: `Failed to delete user record: ${errorMessage}` };
    }
}

/**
 * Manually creates a user record in the public users table.
 * Note: This does not create a Supabase Auth account.
 */
export async function createUserRecord(data: { name: string, email: string, role: string, phone?: string }): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseServerClient();

    try {
        // We need a UID for the public.users table. 
        // Since we can't create an Auth user without the service role key,
        // this is primarily for pre-registering users or for systems where 
        // Auth is handled separately.
        // For now, we'll return an error explaining this limitation if we don't have a UID.

        return {
            success: false,
            error: "Creating a full user account requires the Supabase Service Role Key. Please use the Supabase Dashboard to add users to Auth first, then they will appear here automatically."
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to create user: ${errorMessage}` };
    }
}
