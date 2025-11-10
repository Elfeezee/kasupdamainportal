
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * A robust function to convert form data keys to snake_case for the database.
 * This handles nested objects and file uploads correctly.
 * Example: 'identificationType.nationalIdCard' becomes 'id_type_national_id_card'
 * Example: 'ceoIdentificationType.nationalIdCard' becomes 'ceo_id_type_national_id_card'
 * @param key The form field key.
 * @returns The snake_cased key.
 */
function toSnakeCase(key: string): string {
    // Specific prefixes for nested object fields from the forms.
    // This is more explicit and reliable than complex regex.
    let snakeKey = key
        .replace(/^identificationType\./, 'id_type_')
        .replace(/^ceoIdentificationType\./, 'ceo_id_type_')
        .replace(/^repIdentificationType\./, 'rep_id_type_')
        .replace(/^outdoorActivity\./, 'outdoor_activity_')
        .replace(/^boardInstallations\./, 'board_installations_');

    // Generic conversion for camelCase to snake_case and replaces any remaining dots.
    snakeKey = snakeKey
        .replace(/\./g, '_')
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase();
        
    // Clean up any potential double underscores from combined logic.
    snakeKey = snakeKey.replace(/__+/g, '_');

    return snakeKey;
}


/**
 * Processes form data and saves it to the 'applications' table in Supabase.
 * This function is now robust and handles all application types.
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
            // Only process the file if it has content
            if (value.size > 0) {
                const filePath = `${userId}/${uuidv4()}-${value.name}`;
                const { error: uploadError } = await supabase.storage.from('application_documents').upload(filePath, value);
                
                if (uploadError) {
                    console.error(`Storage error for ${key}:`, uploadError);
                    return { success: false, error: `Storage error for ${key}: ${uploadError.message}` };
                }
                
                const { data: publicUrlData } = supabase.storage.from('application_documents').getPublicUrl(filePath);
                // The DB expects file URLs to have '_url' suffix.
                submissionPayload[`${dbKey}_url`] = publicUrlData.publicUrl;
            }
        } else if (typeof value === 'string') {
            // Handle specific string values that represent booleans or dates
            if (value === 'on') {
                submissionPayload[dbKey] = true;
            } else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
                // Ensure date strings are in ISO format for the database
                submissionPayload[dbKey] = new Date(value).toISOString();
            } else if (value) {
                // For all other non-empty strings
                submissionPayload[dbKey] = value;
            }
        }
    }
    
    // Final check to remove any keys that may have resulted in null or undefined values
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

        // Generate and apply the final formatted application ID
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
    submissionPayload.status = 'Approved'; // DINs are auto-approved

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
        // Also update the user's profile with their new DIN
        await supabase.from('users').update({ din: finalDin }).eq('uid', userId);

        return { success: true, din: finalDin };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during DIN generation.';
        console.error('DIN Generation Error:', errorMessage);
        return { success: false, error: `Failed to generate DIN: ${errorMessage}` };
    }
}


/**
 * Saves a generic application form to the database. This is the main entry point for form submissions.
 */
export async function saveApplication(
    formData: FormData
): Promise<{ success: boolean; applicationId?: number; applicantName?: string; error?: string; }> {
    const type = formData.get('type') as string;
    const applicantName = formData.get('applicantName') as string;
    const userId = formData.get('userId') as string;

    if (!type || !applicantName || !userId) {
        return { success: false, error: 'Missing required application metadata (type, applicantName, or userId).' };
    }
    
    // DIN applications have a separate, dedicated flow.
    if (type === 'DIN Application') {
        return { success: false, error: 'DIN Applications must use the generateAndSaveDin action.' };
    }
    
    const result = await processAndSaveData(formData, userId, type, applicantName);
    
    if (result.success) {
        return { success: true, applicationId: result.applicationId, applicantName: applicantName };
    } else {
        return { success: false, error: result.error };
    }
}
