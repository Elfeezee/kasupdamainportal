
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

interface GeneralPaymentResponse {
    status: string;
    message: string;
    reference: string;
    amount: string;
    rrrLink: string;
}


/**
 * Generates a payment reference from the Osoftpay API and saves the transaction record.
 */
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
    const supabase = await createSupabaseServerClient();

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
            "customer_Name": application.applicant_name,
            "customer_Phone": userProfile.phone || '08000000000', // Fallback if missing, as API likely requires it
            "customer_Email": userProfile.email || 'no-email@example.com',
            "originating_State_Code": originatingStateCode,
            "transaction_Amount": amount.toString(),
            "payment_Item_Name": description
        };

        console.log("Osoftpay Request Payload:", JSON.stringify(payload, null, 2));

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
        console.log("Osoftpay Response:", result);

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
 * Generates a payment reference from the Osoftpay GeneralPayments API and saves the transaction record.
 * This version does not use state code and returns an RRR link.
 */
export async function createGeneralBill(
    application: StoredApplication,
    userId: string,
    amount: number,
    description: string
): Promise<{ success: boolean; error?: string; rrrLink?: string }> {
    const supabase = await createSupabaseServerClient();

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

    // 2. Call Osoftpay GeneralPayments API
    try {
        const payload = {
            "Payment_Item": description,
            "Payer_Name": application.applicant_name,
            "Payer_Phone": userProfile.phone || '08000000000',
            "Payer_Email": userProfile.email || 'no-email@example.com',
            "Description": description,
            "Total_Price": amount.toString(),
            "Platform": "PayKaduna"
        };

        console.log("Osoftpay General Request Payload:", JSON.stringify(payload, null, 2));

        const response = await fetch('https://kasupda.osoftpay.net/api/GeneralPayments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Osoftpay General API Error Body:', errorBody);
            throw new Error(`Osoftpay General API responded with status: ${response.status}`);
        }

        const result: GeneralPaymentResponse = await response.json();
        console.log("Osoftpay General Response:", result);

        if (result.status !== '00' || !result.reference) {
            throw new Error(result.message || 'Failed to generate payment reference from Osoftpay.');
        }

        const paymentReference = result.reference;
        const rrrLink = result.rrrLink;

        // 3. Save transaction to our database
        const { error: dbError } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                application_id: application.id,
                amount: amount,
                description: description,
                payment_reference: paymentReference,
                payment_link: rrrLink,
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

        return { success: true, rrrLink };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        console.error('Create General Bill Error:', errorMessage);
        return { success: false, error: `Failed to create bill: ${errorMessage}` };
    }
}


/**
 * Verifies a payment status with the Osoftpay API and updates our database.
 */
export async function verifyPayment(transactionId: number, paymentReference: string): Promise<{ success: boolean; status?: string; error?: string; }> {
    const supabase = await createSupabaseServerClient();

    try {
        const response = await fetch(`https://kasupda.osoftpay.net/api/CallValidation/${paymentReference}`, {
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
        console.log("Osoftpay Validation Response:", result);

        // Check for "Successful" status as per documentation
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

/**
 * Assigns a DIN to a user and application after successful payment.
 * This is an admin-only action.
 */
export async function assignDin(
    applicationId: string,
    userId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseServerClient();

    try {
        // Check if the DIN application fee has been paid
        const { data: transaction, error: transactionError } = await supabase
            .from('transactions')
            .select('status')
            .eq('application_id', applicationId)
            .eq('description', 'DIN Application Fee')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (transactionError || !transaction || transaction.status !== 'Verified') {
            return { success: false, error: "Payment for DIN application has not been verified." };
        }

        // Generate DIN and update records
        const finalDin = `DIN${String(applicationId).padStart(3, '0')}`;

        const { error: appUpdateError } = await supabase
            .from('applications')
            .update({ din: finalDin, status: 'Approved' })
            .eq('id', applicationId);

        if (appUpdateError) throw appUpdateError;

        const { error: userUpdateError } = await supabase
            .from('users')
            .update({ din: finalDin })
            .eq('uid', userId);

        if (userUpdateError) throw userUpdateError;

        revalidatePath('/admin/applications');
        revalidatePath(`/admin/applications/${applicationId}`);
        revalidatePath('/admin/din-applications');
        revalidatePath('/dashboard/my-dins');

        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error('Assign DIN Error:', errorMessage);
        return { success: false, error: `Failed to assign DIN: ${errorMessage}` };
    }
}
