import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function testTransactionData() {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('transactions')
            .select('*, applications(type)')
            .limit(5)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Database error:', error);
            return { success: false, error: error.message };
        }

        console.log('Transaction data sample:', JSON.stringify(data, null, 2));

        // Check if amounts are properly formatted
        if (data && data.length > 0) {
            data.forEach((transaction, index) => {
                console.log(`Transaction ${index + 1}:`);
                console.log(`  ID: ${transaction.id}`);
                console.log(`  Amount: ${transaction.amount} (type: ${typeof transaction.amount})`);
                console.log(`  Formatted: ₦${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
                console.log(`  Status: ${transaction.status}`);
                console.log(`  Payment Reference: ${transaction.payment_reference}`);
                console.log(`  Created At: ${transaction.created_at}`);
                console.log('---');
            });
        } else {
            console.log('No transactions found in database');
        }

        return { success: true, data };
    } catch (e) {
        console.error('Exception:', e);
        return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
}