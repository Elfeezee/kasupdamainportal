
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';

interface OsoftPayResponse {
    status: string;
    message: string;
    data?: {
        paymentReference: string;
        customer_Name: string;
        customer_Email: string;
        customer_Phone: string;
        transaction_Amount: number;
    };
}

interface OsoftValidationResponse {
    payment_Status: 'Successful' | 'Pending' | 'Failed';
    [key: string]: any;
}


/**
 * Generates a payment reference from the Osoftpay API and saves the transaction record.
 */
export async function createBill(
    application: StoredApplication,
    userId: string,
    amount: number,
    description: string,
    originatingStateCode: string
): Promise<{ success: boolean; error?: string; }> {
    const supabase = createSupabaseServerClient();
    
    // 1. Get user details for payment
    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('phone, email')
        .eq('uid', userId)
        .single();
    
    if (profileError || !userProfile) {
        console.error("Error fetching user profile for billing:", profileError);
        return { success: false, error: "Could not retrieve user details for billing." };
    }

    // 2. Call Osoftpay API to generate payment reference
    try {
        const payload = {
            customer_Name: application.applicant_name,
            customer_Phone: userProfile.phone || 'N/A',
            customer_Email: userProfile.email || 'N/A',
            originating_State_Code: originatingStateCode,
            transaction_Amount: amount.toString(),
            payment_Item_Name: description,
        };

        const response = await fetch('https://agency.osoftpay.net/api/AgencyCustomers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Osoftpay API Error Body:', errorBody);
            throw new Error(`Osoftpay API responded with status: ${response.status}`);
        }

        const result: OsoftPayResponse = await response.json();

        if (result.status !== '00' || !result.data?.paymentReference) {
            throw new Error(result.message || 'Failed to generate payment reference from Osoftpay.');
        }

        const paymentReference = result.data.paymentReference;

        // 3. Save transaction to our database
        const { error: dbError } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                application_id: application.id,
                amount: amount,
                description: description,
                payment_reference: paymentReference,
                status: 'Pending',
                payer_name: application.applicant_name,
                payer_email: userProfile.email,
                payer_phone: userProfile.phone,
            });

        if (dbError) {
            throw dbError;
        }

        revalidatePath('/dashboard/billing');
        revalidatePath('/admin/applications');
        revalidatePath(`/admin/applications/${application.id}`);
        
        return { success: true };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        console.error('Create Bill Error:', errorMessage);
        return { success: false, error: `Failed to create bill: ${errorMessage}` };
    }
}


/**
 * Verifies a payment status with the Osoftpay API and updates our database.
 */
export async function verifyPayment(transactionId: number, paymentReference: string): Promise<{ success: boolean; status?: string; error?: string; }> {
    const supabase = createSupabaseServerClient();

    try {
        const response = await fetch(`https://agency.osoftpay.net/api/CallValidation/${paymentReference}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
             const errorBody = await response.text();
            console.error('Osoftpay Validation API Error Body:', errorBody);
            throw new Error(`Osoftpay validation API responded with status: ${response.status}`);
        }

        const result: OsoftValidationResponse = await response.json();
        
        const newStatus = result.payment_Status === 'Successful' ? 'Verified' : 'Pending';

        const { error: dbError } = await supabase
            .from('transactions')
            .update({ status: newStatus, last_verified_at: new Date().toISOString() })
            .eq('id', transactionId);
        
        if (dbError) {
            throw dbError;
        }
        
        revalidatePath('/dashboard/billing');

        return { success: true, status: newStatus };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        console.error('Verify Payment Error:', errorMessage);
        return { success: false, error: `Failed to verify payment: ${errorMessage}` };
    }
}
