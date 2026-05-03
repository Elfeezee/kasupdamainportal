
'use server';

import { db } from '@/lib/db';
import { applications, users, transactions } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { createBill, createGeneralBill } from './billingActions';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Local storage helper
async function saveFileLocally(file: File, userId: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = `${uuidv4()}-${file.name}`;
    const relativePath = `/uploads/applications/${userId}/${fileName}`;
    const absolutePath = join(process.cwd(), 'public', relativePath);
    
    await mkdir(join(process.cwd(), 'public', 'uploads', 'applications', userId), { recursive: true });
    
    await writeFile(absolutePath, buffer);
    return relativePath;
}

function mapKeyToDbField(key: string): string {
    const mappings: { [key: string]: string } = {
        'applicantName': 'applicant_name',
        'userId': 'user_id',
    };
    return mappings[key] || key;
}

export async function saveApplication(
    formData: FormData
): Promise<{ success: boolean; applicationId?: number; applicantName?: string; error?: string; }> {
    const type = formData.get('type') as string;
    const applicantName = formData.get('applicantName') as string;
    const userId = formData.get('userId') as string;

    if (!type || !applicantName || !userId) {
        return { success: false, error: 'Missing required application metadata (type, applicantName, or userId).' };
    }

    const topLevelColumns = ['type', 'applicant_name', 'user_id', 'status', 'rejection_reason', 'created_at', 'din'];

    const dbPayload: any = {
        type,
        applicant_name: applicantName,
        user_id: userId,
        status: 'Inprogress',
        data: {}
    };

    try {
        for (const [key, value] of formData.entries()) {
            if (['type', 'userId', 'applicantName'].includes(key)) continue;

            if (key.includes('.')) {
                const [parentKey, childKey] = key.split('.');
                const dbParentKey = mapKeyToDbField(parentKey);
                if (!dbPayload.data[dbParentKey]) dbPayload.data[dbParentKey] = {};
                if (value === 'on') dbPayload.data[dbParentKey][childKey] = true;
                continue;
            }

            const dbKey = mapKeyToDbField(key);

            if (topLevelColumns.includes(dbKey)) {
                dbPayload[dbKey] = value;
                continue;
            }

            if (value instanceof File) {
                if (value.size > 0) {
                    dbPayload.data[`${dbKey}_url`] = await saveFileLocally(value, userId);
                }
            } else if (typeof value === 'string' && value) {
                if (value === 'on') {
                    dbPayload.data[dbKey] = true;
                } else {
                    dbPayload.data[dbKey] = value;
                }
            }
        }

        const [inserted] = await db.insert(applications).values(dbPayload);
        const applicationId = inserted.insertId;

        // Fetch the inserted data to get the full record
        const insertedData = await db.query.applications.findFirst({
            where: eq(applications.id, applicationId)
        });

        if (!insertedData) throw new Error("Failed to retrieve inserted application.");

        if (type === 'DIN Application') {
            await createGeneralBill(insertedData, userId, 5000, 'Approval Fees For Building Plan');
        } else {
            await createGeneralBill(insertedData, userId, 10000, 'Approval Fees For Building Plan');
        }

        return { success: true, applicationId, applicantName };

    } catch (error: any) {
        console.error('Database Insertion Error:', error);
        return { success: false, error: `Failed to save application: ${error.message}` };
    }
}

export async function updateUserApplication(
    applicationId: number,
    updateData: Record<string, any>,
    userId: string // Added userId for verification
): Promise<{ success: boolean; error?: string }> {
    try {
        const app = await db.query.applications.findFirst({
            where: and(eq(applications.id, applicationId), eq(applications.user_id, userId))
        });

        if (!app) return { success: false, error: 'Application not found or access denied.' };

        const topLevelColumns = ['applicant_name', 'phone1', 'email'];
        const dbUpdatePayload: any = {};
        const currentJsonData = (typeof app.data === 'object' && app.data !== null) ? app.data : {};
        const dataUpdate: any = { ...currentJsonData };

        for (const [key, value] of Object.entries(updateData)) {
            if (['id', 'user_id', 'created_at', 'status', 'rejection_reason', 'din', 'original_permit_id'].includes(key)) continue;

            if (topLevelColumns.includes(key)) {
                dbUpdatePayload[key] = value;
            } else {
                dataUpdate[key] = value;
            }
        }

        dbUpdatePayload.data = dataUpdate;

        if (app.status === 'Queried') {
            dbUpdatePayload.status = 'Inprogress';
        }

        await db.update(applications)
            .set(dbUpdatePayload)
            .where(eq(applications.id, applicationId));

        revalidatePath(`/dashboard/my-applications`);
        revalidatePath(`/dashboard/application-details/${applicationId}`);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getSignedUrl(path: string): Promise<{ success: boolean; url?: string; error?: string }> {
    // For local storage, the "signed URL" is just the public path
    // In production, you might want to serve this via a proxy that checks permissions
    return { success: true, url: path };
}
