'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Clock, Loader2, Copy, AlertTriangle, ExternalLink, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { verifyPayment } from '@/app/actions/billingActions';
import Receipt from '@/components/billing/Receipt';

export interface Transaction {
    id: number;
    created_at: string | Date;
    amount: number;
    description: string;
    payment_reference: string;
    payment_link?: string;
    status: 'Pending' | 'Verified' | 'Failed';
    payer_name: string;
    payer_email: string;
    payer_phone: string;
    application_id: string;
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
    const config = statusConfig[status] || statusConfig.Pending;
    const { variant, icon: Icon, text } = config;
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
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState<number | null>(null);

    const openPaymentInfo = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsPaymentInfoOpen(true);
    };

    const openReceipt = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsReceiptOpen(true);
    };

    const handlePayNow = (transaction: Transaction) => {
        if (transaction.payment_link) {
            window.open(transaction.payment_link, '_blank');
        } else {
            openPaymentInfo(transaction);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied!', description: 'Payment reference copied to clipboard.' });
    };

    const handleVerify = async (transaction: Transaction) => {
        setIsVerifying(transaction.id);
        try {
            const result = await verifyPayment(transaction.id, transaction.payment_reference);
            if (result.success && result.status) {
                toast({
                    title: 'Verification Complete',
                    description: `Payment status is now: ${result.status}`,
                });
                // Optimistically update the UI
                setTransactions(prev =>
                    prev.map(t => t.id === transaction.id ? { ...t, status: result.status as Transaction['status'] } : t)
                );
            } else {
                throw new Error(result.error || 'Verification request failed');
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
            <div className="border rounded-md overflow-x-auto">
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
                                <TableCell className="whitespace-nowrap">{format(t.created_at instanceof Date ? t.created_at : parseISO(t.created_at as string), 'dd MMM, yyyy')}</TableCell>
                                <TableCell>{t.description}</TableCell>
                                <TableCell className="font-medium">{t.amount.toLocaleString()}</TableCell>
                                <TableCell className="font-mono text-xs">{t.payment_reference}</TableCell>
                                <TableCell><StatusBadge status={t.status} /></TableCell>
                                <TableCell className="text-right space-x-2">
                                    {t.status === 'Pending' && (
                                        <>
                                            <Button size="sm" onClick={() => handlePayNow(t)}>
                                                {t.payment_link ? (
                                                    <span className="flex items-center gap-1">
                                                        Pay Online <ExternalLink className="h-3 w-3" />
                                                    </span>
                                                ) : 'Pay Now'}
                                            </Button>
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
                                        <Button size="sm" variant="outline" onClick={() => openReceipt(t)} className="gap-2">
                                            <FileText className="h-4 w-4" /> View Receipt
                                        </Button>
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
                                {selectedTransaction?.payment_link && (
                                    <li>
                                        <strong>Online (Remita):</strong> <a href={selectedTransaction.payment_link} target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">Click here to pay online <ExternalLink className="h-3 w-3" /></a>
                                    </li>
                                )}
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

            {/* Receipt Dialog */}
            <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-50">
                    <DialogHeader className="p-6 bg-white border-b">
                        <DialogTitle>Official Payment Receipt</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[80vh] overflow-y-auto p-6">
                        {selectedTransaction && <Receipt transaction={selectedTransaction} />}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
