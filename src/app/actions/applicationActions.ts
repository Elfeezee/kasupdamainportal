
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * Converts a camelCase or dot.notation string to snake_case.
 * This is the critical function for mapping form names to database columns.
 * Handles complex nesting and preserves known patterns.
 * @param key The form field key (e.g., 'ceoIdentificationType.nationalIdCard').
 * @returns The snake_cased key for the database (e.g., 'ceo_id_type_national_id_card').
 */
function toSnakeCase(key: string): string {
    // First, handle specific nested structures with dot notation to create a clean base
    let snakeKey = key
        .replace(/^identificationType\./, 'id_type_')
        .replace(/^ceoIdentificationType\./, 'ceo_id_type_')
        .replace(/^repIdentificationType\./, 'rep_id_type_')
        .replace(/^outdoorActivity\./, 'outdoor_activity_');

    // Next, replace any remaining dots with underscores
    snakeKey = snakeKey.replace(/\./g, '_');
    
    // Finally, convert camelCase parts to snake_case for the entire string
    snakeKey = snakeKey.replace(/([A-Z])/g, '_$1').toLowerCase();
        
    return snakeKey;
}


/**
 * Processes form data from FormData and saves it to the 'applications' table in Supabase.
 * This function is designed to be robust and handle various data types including files.
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

    // 1. Manually add the core metadata required for every application
    submissionPayload.type = type;
    submissionPayload.applicant_name = applicantName;
    submissionPayload.user_id = userId;
    submissionPayload.status = 'Inprogress';

    // 2. Iterate through all FormData entries to build the submission payload
    for (const [key, value] of formData.entries()) {
        // Skip metadata fields that are handled manually above or are not part of the database record
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
                if (!publicUrlData.publicUrl) {
                    return { success: false, error: `Could not get public URL for the file associated with ${key}.`};
                }
                
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
    
    // 3. Clean the payload of any null or undefined values before insertion
    const cleanedPayload = Object.fromEntries(
      Object.entries(submissionPayload).filter(([_, v]) => v != null)
    );


    // 4. Insert the fully constructed payload into the 'applications' table
    try {
        const { data: insertedData, error: dbError } = await supabase
            .from('applications')
            .insert(cleanedPayload)
            .select('id')
            .single();

        if (dbError || !insertedData) {
            console.error('Supabase insert error:', dbError);
            throw dbError || new Error("Failed to insert application record into the database.");
        }

        // Generate and update the custom application ID (e.g., KSP001)
        const finalApplicationId = `KSP${String(insertedData.id).padStart(3, '0')}`;
        const { error: updateError } = await supabase
            .from('applications')
            .update({ original_permit_id: finalApplicationId })
            .eq('id', insertedData.id);

        if (updateError) {
             console.error('Supabase ID update error:', updateError);
             // Proceed even if this fails, as the core record is saved.
        }

        return { success: true, applicationId: insertedData.id };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred during database insertion.';
        console.error('Database Insertion Error:', errorMessage);
        return { success: false, error: `Failed to save application: ${errorMessage}` };
    }
}


/**
 * Generates a Development Identification Number (DIN) and saves the application.
 * This is a dedicated action for the DIN application form.
 */
export async function generateAndSaveDin(
    userId: string,
    applicantName: string,
    formData: FormData
): Promise<{ success: boolean; din?: string; error?: string; }> {
    const supabase = createSupabaseServerClient();
    const submissionPayload: Record<string, any> = {};

    // 1. Manually add core metadata for DIN
    submissionPayload.type = 'DIN Application';
    submissionPayload.applicant_name = applicantName;
    submissionPayload.user_id = userId;
    submissionPayload.status = 'Approved'; // DINs are auto-approved

    // 2. Process the rest of the form data
    for (const [key, value] of formData.entries()) {
        if (key === 'declaration') continue; // Ignore declaration checkbox

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
    
    // Clean the payload
    const cleanedPayload = Object.fromEntries(
      Object.entries(submissionPayload).filter(([_, v]) => v != null)
    );

    // 3. Insert record to get an ID for DIN generation
    try {
        const { data: insertedData, error: dbError } = await supabase
            .from('applications')
            .insert(cleanedPayload)
            .select('id')
            .single();

        if (dbError || !insertedData) {
            console.error('Supabase DIN insert error:', dbError);
            throw dbError || new Error("Failed to insert application record for DIN generation.");
        }

        // 4. Generate DIN and update both the application and user profile
        const newId = insertedData.id;
        const finalDin = `DIN${String(newId).padStart(3, '0')}`;
        
        await supabase.from('applications').update({ din: finalDin }).eq('id', newId);
        await supabase.from('users').update({ din: finalDin }).eq('uid', userId);

        return { success: true, din: finalDin };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred during DIN generation.';
        console.error('DIN Generation Error:', errorMessage);
        return { success: false, error: `Failed to generate DIN: ${errorMessage}` };
    }
}


/**
 * Saves a generic application form to the database by directly processing FormData.
 */
export async function saveApplication(
    formData: FormData
): Promise<{ success: boolean; applicationId?: number; applicantName?: string; error?: string; }> {
    const type = formData.get('type') as string;
    const applicantName = formData.get('applicantName') as string;
    const userId = formData.get('userId') as string;

    // Basic validation for required metadata
    if (!type || !applicantName || !userId) {
        return { success: false, error: 'Missing required application metadata (type, applicantName, or userId).' };
    }

    // Ensure this generic action is not used for DINs
    if (type === 'DIN Application') {
        return { success: false, error: 'DIN Applications must use the dedicated `generateAndSaveDin` action.' };
    }
    
    // Call the unified and robust processing and saving function
    const result = await processAndSaveData(formData, userId, type, applicantName);
    
    if (result.success) {
        return { success: true, applicationId: result.applicationId, applicantName: applicantName };
    } else {
        return { success: false, error: result.error };
    }
}
