
'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CheckCircle2, Clock, Loader2, Copy, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { verifyPayment } from '@/app/actions/billingActions';

export interface Transaction {
    id: number;
    created_at: string;
    amount: number;
    description: string;
    payment_reference: string;
    status: 'Pending' | 'Verified' | 'Failed';
}

interface StatusBadgeProps {
    status: Transaction['status'];
}

const statusConfig: Record<Transaction['status'], { variant: 'secondary' | 'default' | 'destructive', icon: React.ElementType, text: string }> = {
    Pending: { variant: 'secondary', icon: Clock, text: 'Pending Verification' },
    Verified: { variant: 'default', icon: CheckCircle2, text: 'Verified' },
    Failed: { variant: 'destructive', icon: AlertTriangle, text: 'Failed' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const { variant, icon: Icon, text } = statusConfig[status];
    return (
        <Badge variant={variant} className="capitalize flex items-center gap-1.5">
            <Icon className="h-3 w-3" />
            {text}
        </Badge>
    );
};

export default function BillingTable({ transactions: initialTransactions }: { transactions: Transaction[] }) {
    const { toast } = useToast();
    const [transactions, setTransactions] = useState(initialTransactions);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isPaymentInfoOpen, setIsPaymentInfoOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState<number | null>(null);

    const openPaymentInfo = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsPaymentInfoOpen(true);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied!', description: 'Payment reference copied to clipboard.' });
    };

    const handleVerify = async (transaction: Transaction) => {
        setIsVerifying(transaction.id);
        try {
            const result = await verifyPayment(transaction.id, transaction.payment_reference);
            if (result.success) {
                toast({
                    title: 'Verification Complete',
                    description: `Payment status is now: ${result.status}`,
                });
                // Optimistically update the UI
                setTransactions(prev => 
                    prev.map(t => t.id === transaction.id ? { ...t, status: result.status as Transaction['status'] } : t)
                );
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                title: 'Verification Failed',
                description: error instanceof Error ? error.message : 'Could not verify payment status.',
                variant: 'destructive',
            });
        } finally {
            setIsVerifying(null);
        }
    };

    return (
        <>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount (₦)</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell>{format(parseISO(t.created_at), 'dd MMM, yyyy')}</TableCell>
                                <TableCell>{t.description}</TableCell>
                                <TableCell className="font-medium">{t.amount.toLocaleString()}</TableCell>
                                <TableCell className="font-mono text-xs">{t.payment_reference}</TableCell>
                                <TableCell><StatusBadge status={t.status} /></TableCell>
                                <TableCell className="text-right space-x-2">
                                    {t.status === 'Pending' && (
                                        <>
                                            <Button size="sm" onClick={() => openPaymentInfo(t)}>Pay Now</Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleVerify(t)}
                                                disabled={isVerifying === t.id}
                                            >
                                                {isVerifying === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                                            </Button>
                                        </>
                                    )}
                                     {t.status === 'Verified' && (
                                         <Button size="sm" variant="outline" disabled>View Receipt</Button>
                                     )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isPaymentInfoOpen} onOpenChange={setIsPaymentInfoOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Payment Instructions</DialogTitle>
                        <DialogDescription>
                            Use the reference number below to complete your payment via Paydirect or Quickteller.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="p-4 bg-muted rounded-lg text-center">
                            <Label className="text-sm text-muted-foreground">Your Payment Reference Number</Label>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <p className="text-2xl font-bold tracking-widest text-primary">{selectedTransaction?.payment_reference}</p>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(selectedTransaction?.payment_reference || '')}>
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">How to Pay:</h4>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <strong>Bank Branch (Paydirect):</strong> Visit any bank, tell the cashier you want to pay on "Kaduna State Collection - OSOFT" via Paydirect, and provide the reference number.
                                </li>
                                 <li>
                                    <strong>Online (Quickteller):</strong> Go to Quickteller, search for "Kaduna State Collection - OSOFT" under pay bills, enter the reference number, and follow the steps to pay.
                                </li>
                            </ul>
                        </div>
                         <p className="text-sm text-muted-foreground pt-2">After payment, click the "Verify" button on the billing page to confirm your transaction status.</p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsPaymentInfoOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
