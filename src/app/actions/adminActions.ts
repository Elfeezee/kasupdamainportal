
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
    // 1. Get the current application data to check type and existing data
    const { data: app, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError) throw fetchError;

    let updatePayload: any = {
      status: newStatus,
      rejection_reason: rejectionReason
    };

    // 2. Automated DIN Generation IF Approved and it's a DIN Application
    if (newStatus === 'Approved' && app.type === 'DIN Application' && !app.din) {
      // Get count of ALREADY APPROVED DIN applications to determine serial number
      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'DIN Application')
        .not('din', 'is', null);

      const serialNumber = (count || 0) + 1;
      const paddedSN = String(serialNumber).padStart(4, '0');

      // Get parameters from the existing data
      const appData = app.data || {};
      const pc = String(appData.postal_code || '800271').padStart(6, '0');
      const lg = String(appData.lga_code || '00').padStart(2, '0');
      const wd = String(appData.ward_code || '00').padStart(2, '0');
      const st = String(appData.street_code || '000').padStart(3, '0');
      const pl = String(appData.plot_number || '000').padStart(3, '0');

      const generatedDin = `DIN-${pc}-${lg}-${wd}-${st}-${pl}-${paddedSN}`;

      updatePayload.din = generatedDin;
      // Update the JSONB data with generation results
      updatePayload.data = {
        ...appData,
        serial_number: paddedSN,
        generated_din: generatedDin
      };
    }

    const { error } = await supabase
      .from('applications')
      .update(updatePayload)
      .eq('id', applicationId);

    if (error) throw error;

    revalidatePath(`/admin/applications/${applicationId}`);
    revalidatePath(`/admin/applications`);
    revalidatePath(`/admin/din-applications`);
    revalidatePath(`/admin/permit-applications`);
    revalidatePath(`/admin/stage-approvals`);
    revalidatePath(`/dashboard/my-applications`);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    console.error('Update Application Status Error:', errorMessage);
    return { success: false, error: `Failed to update application status: ${errorMessage}` };
  }
}
