
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * Converts a camelCase or dot.notation string to snake_case.
 * Handles specific nested structures and preserves known patterns.
 * @param key The form field key (e.g., 'ceoIdentificationType.nationalIdCard').
 * @returns The snake_cased key for the database (e.g., 'ceo_id_type_national_id_card').
 */
function toSnakeCase(key: string): string {
    // First, handle specific prefixes for nested identification types
    let snakeKey = key
        .replace(/^identificationType\./, 'id_type_')
        .replace(/^ceoIdentificationType\./, 'ceo_id_type_')
        .replace(/^repIdentificationType\./, 'rep_id_type_')
        .replace(/^outdoorActivity\./, 'outdoor_activity_');
        
    // Then, replace any remaining dots with underscores
    snakeKey = snakeKey.replace(/\./g, '_');
    
    // Finally, convert camelCase parts to snake_case for the entire string
    snakeKey = snakeKey.replace(/([A-Z])/g, '_$1').toLowerCase();
        
    return snakeKey;
}

/**
 * Processes form data and saves it to the 'applications' table in Supabase.
 * @param formData The FormData object from the form submission.
 * @param userId The ID of the user submitting the form.
 * @param type The type of application being submitted.
 * @param applicantName The name of the applicant.
 * @returns A promise that resolves to the result of the database operation.
 */
async function processAndSaveData(
    formData: FormData,
    userId: string,
    type: string,
    applicantName: string
): Promise<{ success: boolean; applicationId?: number; error?: string; }> {
    const supabase = createSupabaseServerClient();
    const submissionPayload: Record<string, any> = {};

    submissionPayload.type = type;
    submissionPayload.applicant_name = applicantName;
    submissionPayload.user_id = userId;
    submissionPayload.status = 'Inprogress';

    // Process all entries from FormData
    for (const [key, value] of formData.entries()) {
        if (['type', 'userId', 'applicantName', 'declaration'].includes(key)) {
            continue;
        }

        const dbKey = toSnakeCase(key);

        if (value instanceof File) {
            if (value.size > 0) {
                const filePath = `${userId}/${uuidv4()}-${value.name}`;
                const { error: uploadError } = await supabase.storage.from('application_documents').upload(filePath, value);
                
                if (uploadError) {
                    console.error(`Storage error for ${key}:`, uploadError);
                    return { success: false, error: `Storage error for ${key}: ${uploadError.message}` };
                }
                
                const { data: publicUrlData } = supabase.storage.from('application_documents').getPublicUrl(filePath);
                submissionPayload[`${dbKey}_url`] = publicUrlData.publicUrl;
            }
        } else if (typeof value === 'string') {
            if (value === 'on') {
                submissionPayload[dbKey] = true;
            } else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
                submissionPayload[dbKey] = new Date(value).toISOString();
            } else if (value) {
                submissionPayload[dbKey] = value;
            }
        }
    }
    
    // Clean the payload of any null or undefined values before insertion
    const cleanedPayload = Object.fromEntries(
      Object.entries(submissionPayload).filter(([_, v]) => v != null)
    );

    try {
        const { data: insertedData, error: dbError } = await supabase
            .from('applications')
            .insert(cleanedPayload)
            .select('id')
            .single();

        if (dbError) {
            console.error('Supabase insert error:', dbError);
            throw dbError;
        }
        if (!insertedData) {
            throw new Error("Failed to get ID from inserted application record.");
        }

        const finalApplicationId = `KSP${String(insertedData.id).padStart(3, '0')}`;
        await supabase
            .from('applications')
            .update({ original_permit_id: finalApplicationId })
            .eq('id', insertedData.id);

        return { success: true, applicationId: insertedData.id };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred during database insertion.';
        console.error('Database Insertion Error:', errorMessage);
        return { success: false, error: `Failed to save application: ${errorMessage}` };
    }
}


/**
 * Generates a Development Identification Number (DIN) and saves the application.
 */
export async function generateAndSaveDin(
    userId: string,
    applicantName: string,
    formData: FormData
): Promise<{ success: boolean; din?: string; error?: string; }> {
    const supabase = createSupabaseServerClient();
    const submissionPayload: Record<string, any> = {};

    submissionPayload.type = 'DIN Application';
    submissionPayload.applicant_name = applicantName;
    submissionPayload.user_id = userId;
    submissionPayload.status = 'Approved'; 

    for (const [key, value] of formData.entries()) {
        if (key === 'declaration') continue;

        const dbKey = toSnakeCase(key);

        if (typeof value === 'string') {
            if (value === 'on') {
                submissionPayload[dbKey] = true;
            } else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
                submissionPayload[dbKey] = new Date(value).toISOString();
            } else if (value) {
                submissionPayload[dbKey] = value;
            }
        }
    }
    
    const cleanedPayload = Object.fromEntries(
      Object.entries(submissionPayload).filter(([_, v]) => v != null)
    );

    try {
        const { data: insertedData, error: dbError } = await supabase
            .from('applications')
            .insert(cleanedPayload)
            .select('id')
            .single();

        if (dbError || !insertedData) {
            console.error('Supabase DIN insert error:', dbError);
            throw dbError || new Error("Failed to insert record for DIN generation.");
        }

        const newId = insertedData.id;
        const finalDin = `DIN${String(newId).padStart(3, '0')}`;
        
        await supabase.from('applications').update({ din: finalDin }).eq('id', newId);
        await supabase.from('users').update({ din: finalDin }).eq('uid', userId);

        return { success: true, din: finalDin };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during DIN generation.';
        console.error('DIN Generation Error:', errorMessage);
        return { success: false, error: `Failed to generate DIN: ${errorMessage}` };
    }
}


/**
 * Saves a generic application form to the database.
 */
export async function saveApplication(
    formData: FormData
): Promise<{ success: boolean; applicationId?: number; applicantName?: string; error?: string; }> {
    const type = formData.get('type') as string;
    const applicantName = formData.get('applicantName') as string;
    const userId = formData.get('userId') as string;

    if (!type || !applicantName || !userId) {
        return { success: false, error: 'Missing required application metadata.' };
    }
    
    if (type === 'DIN Application') {
        return { success: false, error: 'DIN Applications must use generateAndSaveDin action.' };
    }
    
    const result = await processAndSaveData(formData, userId, type, applicantName);
    
    if (result.success) {
        return { success: true, applicationId: result.applicationId, applicantName: applicantName };
    } else {
        return { success: false, error: result.error };
    }
}
