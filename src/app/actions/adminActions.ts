
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Action to update the main data of an application
export async function updateApplicationData(
  applicationId: string,
  updateData: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();

  // Remove the id from the update payload if it exists
  if (updateData.id) {
    delete updateData.id;
  }

  try {
    const { error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId);

    if (error) throw error;

    revalidatePath(`/admin/applications/${applicationId}`);
    revalidatePath(`/admin/applications`);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    console.error('Update Application Data Error:', errorMessage);
    return { success: false, error: `Failed to update application data: ${errorMessage}` };
  }
}

// Action to update the status and rejection reason of an application
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: 'Inprogress' | 'Approved' | 'Rejected' | 'Queried',
  rejectionReason: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();

  try {
    const { error } = await supabase
      .from('applications')
      .update({
        status: newStatus,
        rejection_reason: rejectionReason
      })
      .eq('id', applicationId);

    if (error) throw error;

    revalidatePath(`/admin/applications/${applicationId}`);
    revalidatePath(`/admin/applications`);
    revalidatePath(`/admin/din-applications`);
    revalidatePath(`/admin/permit-applications`);
    revalidatePath(`/admin/stage-approvals`);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    console.error('Update Application Status Error:', errorMessage);
    return { success: false, error: `Failed to update application status: ${errorMessage}` };
  }
}
