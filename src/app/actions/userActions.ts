
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserProfile(formData: {
    name?: string;
    phone?: string;
    address?: string;
}) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'User not authenticated' };
    }

    try {
        // Update user metadata in Supabase Auth
        const { error: authError } = await supabase.auth.updateUser({
            data: {
                full_name: formData.name,
                phone: formData.phone,
                address: formData.address
            }
        });

        if (authError) throw authError;

        // Update the users table
        const { error: dbError } = await supabase
            .from('users')
            .update({
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            })
            .eq('uid', user.id);

        if (dbError) {
            // If the table update fails, we still have auth metadata updated, 
            // but let's log it.
            console.error('Error updating users table:', dbError);
        }

        revalidatePath('/dashboard/profile');
        return { success: true };
    } catch (error: any) {
        console.error('Update Profile Error:', error);
        return { success: false, error: error.message || 'Failed to update profile' };
    }
}

export async function changeUserPassword(password: string) {
    const supabase = await createSupabaseServerClient();

    try {
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Change Password Error:', error);
        return { success: false, error: error.message || 'Failed to change password' };
    }
}
