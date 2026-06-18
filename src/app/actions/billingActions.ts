
'use server';

import { db } from '@/lib/db';
import { transactions, users, applications } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
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
    try {
        const userProfile = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!userProfile) {
            return { success: false, error: "Could not retrieve user details for billing." };
        }

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

        await db.insert(transactions).values({
            user_id: userId,
            application_id: Number(application.id),
            amount: amount.toString(),
            description: description,
            payment_reference: result.data.paymentReference,
            status: 'Pending',
            payer_name: application.applicant_name,
            payer_email: userProfile.email,
            payer_phone: userProfile.phone,
        });

        revalidatePath('/dashboard/billing');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Unknown error" };
    }
}

/**
 * Generates a payment reference from the Osoftpay GeneralPayments API.
 */
export async function createGeneralBill(
    application: any,
    userId: string,
    amount: number,
    description: string
): Promise<{ success: boolean; error?: string; rrrLink?: string }> {
    try {
        const userProfile = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!userProfile) {
            return { success: false, error: "Could not retrieve user details." };
        }

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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Osoftpay General API error: ${response.status}`);
        }

        const result: GeneralPaymentResponse = await response.json();
        if (result.status !== '00' || !result.reference) {
            throw new Error(result.message || 'Failed to generate reference.');
        }

        await db.insert(transactions).values({
            user_id: userId,
            application_id: Number(application.id),
            amount: amount.toString(),
            description: description,
            payment_reference: result.reference,
            payment_link: result.rrrLink,
            status: 'Pending',
            payer_name: application.applicant_name,
            payer_email: userProfile.email,
            payer_phone: userProfile.phone,
        });

        revalidatePath('/dashboard/billing');
        return { success: true, rrrLink: result.rrrLink };
    } catch (error: any) {
        // Fallback: save a pending transaction with a local reference so the bill is visible
        try {
            const fallbackRef = `LOCAL-${Date.now()}-${application.id}`;
            await db.insert(transactions).values({
                user_id: userId,
                application_id: Number(application.id),
                amount: amount.toString(),
                description: description,
                payment_reference: fallbackRef,
                status: 'Pending',
                payer_name: application.applicant_name,
                payer_email: userProfile?.email,
                payer_phone: userProfile?.phone,
            });
            revalidatePath('/dashboard/billing');
            console.warn('Osoftpay API failed, fallback transaction saved:', fallbackRef);
        } catch (fallbackError: any) {
            console.error('Fallback transaction also failed:', fallbackError.message);
        }
        return { success: false, error: error.message || "Unknown error" };
    }
}

/**
 * Verifies a payment status.
 */
export async function verifyPayment(transactionId: number, paymentReference: string): Promise<{ success: boolean; status?: string; error?: string; }> {
    try {
        let response = await fetch(`https://kasupda.osoftpay.net/api/CallValidation/${paymentReference}`);

        if (response.status === 404) {
            response = await fetch(`https://agency.osoftpay.net/api/CallValidation/${paymentReference}`);
        }

        if (!response.ok) throw new Error(`Validation API error: ${response.status}`);

        const result: any = await response.json();
        const isSuccessful = result.payment_Status === 'Successful' || result.status === '00';
        const newStatus = isSuccessful ? 'Verified' : 'Pending';

        await db.update(transactions)
            .set({ status: newStatus, last_verified_at: new Date() })
            .where(eq(transactions.id, transactionId));

        revalidatePath('/dashboard/billing');
        revalidatePath('/admin/finance');
        return { success: true, status: newStatus };
    } catch (error: any) {
        return { success: false, error: error.message || "Unknown error" };
    }
}

/**
 * Assigns a KBP number.
 */
export async function assignKbp(applicationId: number, kbpNumber: string): Promise<{ success: boolean; error?: string }> {
    try {
        const lastTransaction = await db.query.transactions.findFirst({
            where: eq(transactions.application_id, applicationId),
            orderBy: [desc(transactions.created_at)]
        });

        if (!lastTransaction || lastTransaction.status !== 'Verified') {
            return { success: false, error: "Payment not verified." };
        }

        await db.update(applications)
            .set({ original_permit_id: kbpNumber, status: 'Approved', rejection_reason: null })
            .where(eq(applications.id, applicationId));

        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Unknown error" };
    }
}

/**
 * Fetches all transactions.
 */
export async function getTransactions(status?: string): Promise<any[]> {
    try {
        if (status) {
            return await db.query.transactions.findMany({
                where: eq(transactions.status, status),
                orderBy: [desc(transactions.created_at)],
                with: {
                    application: true
                }
            });
        }
        return await db.query.transactions.findMany({
            orderBy: [desc(transactions.created_at)],
            with: {
                application: true
            }
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

/**
 * Fetches a single transaction.
 */
export async function getTransactionById(id: number): Promise<any | null> {
    try {
        return await db.query.transactions.findFirst({
            where: eq(transactions.id, id),
            with: {
                application: true
            }
        });
    } catch (error) {
        return null;
    }
}

/**
 * Manually generates a DIN for an application.
 */
export async function generateDin(applicationId: number): Promise<{ success: boolean; error?: string }> {
    try {
        const application = await db.query.applications.findFirst({
            where: eq(applications.id, applicationId)
        });

        if (!application) {
            return { success: false, error: "Application not found." };
        }

        const finalDin = `DIN${String(application.id).padStart(3, '0')}`;

        await db.update(applications)
            .set({ din: finalDin, status: 'Approved', rejection_reason: null })
            .where(eq(applications.id, applicationId));

        await db.update(users)
            .set({ din: finalDin })
            .where(eq(users.id, application.user_id));

        revalidatePath('/admin/applications');
        revalidatePath('/admin/din-applications');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Unknown error" };
    }
}
