
'use server';

import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BillingTable from './BillingTable';
import type { Transaction } from './BillingTable';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { transactions as transactionsSchema } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

async function getBillingData(userId: string) {
    try {
        const data = await db.query.transactions.findMany({
            where: eq(transactionsSchema.user_id, userId),
            orderBy: [desc(transactionsSchema.created_at)]
        });
        return data as unknown as Transaction[];
    } catch (error) {
        console.error("Error fetching user transactions:", error);
        return [];
    }
}

function LoadingSkeleton() {
    return (
        <div className="space-y-8">
            <CardHeader className="px-0 pt-0">
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-5 w-96 mt-2" />
            </CardHeader>
            <Card>
                <CardContent className="pt-6 space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

export default async function BillingPage() {
    const PageComponent = async () => {
        const session = await auth();

        if (!session || !session.user) {
            redirect('/login?redirectTo=/dashboard/billing');
        }

        const transactions = await getBillingData(session.user.id as string);

        return (
            <div className="space-y-8">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
                        <Landmark className="mr-3 h-7 w-7" /> Billing & Payments
                    </CardTitle>
                    <CardDescription>
                        View and manage all your pending and completed payments.
                    </CardDescription>
                </CardHeader>

                {transactions.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">You have no bills or transactions yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <BillingTable transactions={transactions} />
                        </CardContent>
                    </Card>
                )}

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
                    <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-3 text-blue-500" />
                        <div>
                            <h4 className="font-semibold">Payment Instructions</h4>
                            <p className="text-sm mt-1">To complete a payment, take the generated 'Payment Reference' to any bank branch and ask to pay on "Kaduna State Collection - OSOFT" via Paydirect. Alternatively, you can pay online at Quickteller by searching for the same biller.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <PageComponent />
        </Suspense>
    );
}
