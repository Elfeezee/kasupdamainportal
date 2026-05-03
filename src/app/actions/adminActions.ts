
'use server';

import { db } from '@/lib/db';
import { applications } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Action to update the main data of an application
export async function updateApplicationData(
  applicationId: number,
  updateData: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  // Remove the id from the update payload if it exists
  if (updateData.id) {
    delete updateData.id;
  }

  try {
    await db.update(applications)
      .set(updateData)
      .where(eq(applications.id, applicationId));

    revalidatePath(`/admin/applications/${applicationId}`);
    revalidatePath(`/admin/applications`);

    return { success: true };
  } catch (error: any) {
    const errorMessage = error.message || 'An unknown server error occurred.';
    console.error('Update Application Data Error:', errorMessage);
    return { success: false, error: `Failed to update application data: ${errorMessage}` };
  }
}

// Action to update the status and rejection reason of an application
export async function updateApplicationStatus(
  applicationId: number,
  newStatus: 'Inprogress' | 'Approved' | 'Rejected' | 'Queried',
  rejectionReason: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Get the current application data
    const app = await db.query.applications.findFirst({
        where: eq(applications.id, applicationId)
    });

    if (!app) throw new Error("Application not found");

    let updatePayload: any = {
      status: newStatus,
      rejection_reason: rejectionReason
    };

    // 2. Automated DIN Generation IF Approved and it's a DIN Application
    if (newStatus === 'Approved' && app.type === 'DIN Application' && !app.din) {
      // Get count of ALREADY APPROVED DIN applications
      const approvedDinCount = await db.query.applications.findMany({
          where: and(eq(applications.type, 'DIN Application'), sql`${applications.din} IS NOT NULL`)
      });

      const serialNumber = (approvedDinCount.length || 0) + 1;
      const paddedSN = String(serialNumber).padStart(4, '0');

      // Get parameters from the existing data
      const appData: any = app.data || {};
      const pc = String(appData.postal_code || '800271').padStart(6, '0');
      const lg = String(appData.lga_code || '00').padStart(2, '0');
      const wd = String(appData.ward_code || '00').padStart(2, '0');
      const st = String(appData.street_code || '000').padStart(3, '0');
      const pl = String(appData.plot_number || '000').padStart(3, '0');

      const generatedDin = `DIN-${pc}-${lg}-${wd}-${st}-${pl}-${paddedSN}`;

      updatePayload.din = generatedDin;
      updatePayload.data = {
        ...appData,
        serial_number: paddedSN,
        generated_din: generatedDin
      };
    }

    await db.update(applications)
      .set(updatePayload)
      .where(eq(applications.id, applicationId));

    revalidatePath(`/admin/applications/${applicationId}`);
    revalidatePath(`/admin/applications`);
    revalidatePath(`/admin/din-applications`);
    revalidatePath(`/admin/permit-applications`);
    revalidatePath(`/admin/stage-approvals`);
    revalidatePath(`/dashboard/my-applications`);

    return { success: true };
  } catch (error: any) {
    const errorMessage = error.message || 'An unknown server error occurred.';
    console.error('Update Application Status Error:', errorMessage);
    return { success: false, error: `Failed to update application status: ${errorMessage}` };
  }
}
