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
export async function createBill(
    application: StoredApplication,
    userId: string,
    amount: number,
    description: string,
    originatingStateCode: string
): Promise<{ success: boolean; error?: string; }> {
    const supabase = await createSupabaseServerClient();

    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('phone, email')
        .eq('uid', userId)
        .single();

    if (profileError || !userProfile) {
        return { success: false, error: "Could not retrieve user details for billing." };
    }

    try {
        const payload = {
            "customer_Name": application.applicant_name,
            "customer_Phone": userProfile.phone || '08000000000',
            "customer_Email": userProfile.email || 'no-email@example.com',
            "originating_State_Code": originatingStateCode,
            "transaction_Amount": amount.toString(),
            "payment_Item_Name": description
        };

        const response = await fetch('https://agency.osoftpay.net/api/AgencyCustomers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Osoftpay API error: ${response.status}`);

        const result: OsoftPayResponse = await response.json();
        if (result.status !== '00' || !result.data?.paymentReference) {
            throw new Error(result.message || 'Failed to generate reference.');
        }

        const { error: dbError } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                application_id: application.id,
                amount: amount,
                description: description,
                payment_reference: result.data.paymentReference,
                status: 'Pending',
                payer_name: application.applicant_name,
                payer_email: userProfile.email,
                payer_phone: userProfile.phone,
            });

        if (dbError) throw dbError;

        revalidatePath('/dashboard/billing');
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

/**
 * Generates a payment reference from the Osoftpay GeneralPayments API.
 */
export async function createGeneralBill(
    application: StoredApplication,
    userId: string,
    amount: number,
    description: string
): Promise<{ success: boolean; error?: string; rrrLink?: string }> {
    const supabase = await createSupabaseServerClient();

    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('phone, email')
        .eq('uid', userId)
        .single();

    if (profileError || !userProfile) {
        return { success: false, error: "Could not retrieve user details." };
    }

    try {
        let sanitizedPhone = (userProfile.phone || '08000000000').replace(/\D/g, '');
        if (sanitizedPhone.startsWith('234')) sanitizedPhone = '0' + sanitizedPhone.slice(3);
        sanitizedPhone = sanitizedPhone.slice(-11).padStart(11, '0');

        const payload = {
            "Payment_Item": description,
            "Payer_Name": application.applicant_name,
            "Payer_Phone": sanitizedPhone,
            "Payer_Email": userProfile.email || 'no-email@example.com',
            "Description": description,
            "Total_Price": amount.toFixed(2),
            "Platform": "PayKaduna"
        };

        const response = await fetch('https://kasupda.osoftpay.net/api/GeneralPayments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Osoftpay General API error: ${response.status}`);

        const result: GeneralPaymentResponse = await response.json();
        if (result.status !== '00' || !result.reference) {
            throw new Error(result.message || 'Failed to generate reference.');
        }

        const { error: dbError } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                application_id: application.id,
                amount: amount,
                description: description,
                payment_reference: result.reference,
                payment_link: result.rrrLink,
                status: 'Pending',
                payer_name: application.applicant_name,
                payer_email: userProfile.email,
                payer_phone: userProfile.phone,
            });

        if (dbError) throw dbError;

        revalidatePath('/dashboard/billing');
        return { success: true, rrrLink: result.rrrLink };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

/**
 * Verifies a payment status and handles automatic DIN assignment.
 */
export async function verifyPayment(transactionId: number, paymentReference: string): Promise<{ success: boolean; status?: string; error?: string; }> {
    const supabase = await createSupabaseServerClient();

    try {
        let response = await fetch(`https://kasupda.osoftpay.net/api/CallValidation/${paymentReference}`);

        // If 404, try the alternative agency endpoint
        if (response.status === 404) {
            response = await fetch(`https://agency.osoftpay.net/api/CallValidation/${paymentReference}`);
        }

        if (!response.ok) throw new Error(`Validation API error: ${response.status}`);

        const result: any = await response.json();
        const isSuccessful = result.payment_Status === 'Successful' || result.status === '00';
        const newStatus = isSuccessful ? 'Verified' : 'Pending';

        // Update transaction status
        const { data: transaction, error: dbError } = await supabase
            .from('transactions')
            .update({ status: newStatus, last_verified_at: new Date().toISOString() })
            .eq('id', transactionId)
            .select('*, applications(*)')
            .single();

        if (dbError) throw dbError;

        // Automatic DIN Generation Logic
        if (isSuccessful && transaction && (transaction.description === 'DIN Application Fee' || (transaction.description === 'Approval Fees For Building Plan' && transaction.amount === 5000))) {
            const applicationId = transaction.application_id;
            const userId = transaction.user_id;
            const finalDin = `DIN${String(applicationId).padStart(3, '0')}`;

            // Update application status and DIN
            await supabase
                .from('applications')
                .update({ din: finalDin, status: 'Approved' })
                .eq('id', applicationId);

            // Update user profile with DIN
            await supabase
                .from('users')
                .update({ din: finalDin })
                .eq('uid', userId);

            revalidatePath('/admin/applications');
        }

        revalidatePath('/dashboard/billing');
        revalidatePath('/admin/finance');
        return { success: true, status: newStatus };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

/**
 * Assigns a KBP number.
 */
export async function assignKbp(applicationId: string, kbpNumber: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseServerClient();

    try {
        const { data: transaction, error: transactionError } = await supabase
            .from('transactions')
            .select('status')
            .eq('application_id', applicationId)
            .eq('description', 'Approval Fees For Building Plan')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (transactionError || !transaction || transaction.status !== 'Verified') {
            return { success: false, error: "Payment not verified." };
        }

        const { error: appUpdateError } = await supabase
            .from('applications')
            .update({ original_permit_id: kbpNumber, status: 'Approved', rejection_reason: null })
            .eq('id', applicationId);

        if (appUpdateError) throw appUpdateError;

        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

/**
 * Fetches all transactions.
 */
export async function getTransactions(status?: string): Promise<any[]> {
    const supabase = await createSupabaseServerClient();
    let query = supabase.from('transactions').select('*, applications(type)').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return [];
    return data || [];
}

/**
 * Fetches a single transaction.
 */
export async function getTransactionById(id: number): Promise<any | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('transactions').select('*, applications(*)').eq('id', id).single();
    if (error) return null;
    return data;
}
