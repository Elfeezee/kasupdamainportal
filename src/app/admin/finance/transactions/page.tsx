'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoreHorizontal, Search, Landmark, CheckCircle, Clock, XCircle, Eye, Download, FileText, Loader2, Filter, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { getTransactions } from '@/app/actions/billingActions';
import Receipt from '@/components/billing/Receipt';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type TransactionStatus = 'Verified' | 'Pending' | 'Failed';

interface Transaction {
    id: number;
    created_at: string;
    user_id: string;
    application_id: string;
    amount: number;
    status: TransactionStatus;
    description: string;
    payment_reference: string;
    payer_name: string;
    payer_email: string;
    payer_phone: string;
}

const statusConfig: Record<TransactionStatus, { variant: 'default' | 'secondary' | 'destructive', icon: React.ElementType }> = {
    Verified: { variant: 'default', icon: CheckCircle },
    Pending: { variant: 'secondary', icon: Clock },
    Failed: { variant: 'destructive', icon: XCircle },
};

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
    const config = statusConfig[status] || statusConfig.Pending;
    const { variant, icon: Icon } = config;
    return (
        <Badge variant={variant} className="capitalize flex items-center gap-1.5">
            <Icon className="h-3 w-3" />
            {status}
        </Badge>
    )
}

export default function FinanceTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleLoading, setRoleLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | TransactionStatus>('Verified');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const checkRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('users').select('role').eq('uid', user.id).single();
                if (data && (data.role === 'Super Admin' || data.role === 'Finance')) {
                    setRoleLoading(false);
                } else {
                    toast({ title: "Access Denied", description: "You do not have permission to view finance transactions.", variant: "destructive" });
                    router.push('/admin/dashboard');
                }
            } else {
                router.push('/admin/login');
            }
        };
        checkRole();
    }, [router, toast]);

    const loadTransactions = useCallback(async () => {
        if (roleLoading) return;
        setLoading(true);
        try {
            const data = await getTransactions(statusFilter === 'All' ? undefined : statusFilter);
            setTransactions(data);
        } catch (error) {
            console.error("Error loading transactions:", error);
            toast({ title: "Error", description: "Failed to load transactions.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [statusFilter, toast, roleLoading]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    if (roleLoading) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredTransactions = transactions.filter(t =>
        t.payment_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.payer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.application_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportCSV = () => {
        if (filteredTransactions.length === 0) return;

        const headers = ['Date', 'Transaction ID', 'Reference', 'Applicant', 'App ID', 'Description', 'Amount', 'Status'];
        const rows = filteredTransactions.map(t => [
            format(parseISO(t.created_at), 'yyyy-MM-dd HH:mm'),
            t.id,
            t.payment_reference,
            t.payer_name,
            t.application_id || 'N/A',
            t.description,
            t.amount,
            t.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `KASUPDA_Finance_Report_${format(new Date(), 'yyyyMMdd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Report Generated", description: "CSV report has been downloaded." });
    };

    const openReceipt = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsReceiptOpen(true);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Landmark className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>Transaction History</CardTitle>
                                <CardDescription>Detailed list of all financial transactions and their verification status.</CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={loadTransactions} disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                            </Button>
                            <Button onClick={handleExportCSV} disabled={filteredTransactions.length === 0} className="gap-2">
                                <Download className="h-4 w-4" /> Export Report
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Reference, Applicant, or App ID..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full sm:w-auto justify-between gap-2">
                                        Status: {statusFilter}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setStatusFilter('All')}>All Transactions</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('Verified')}>Verified Only</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>Pending Only</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('Failed')}>Failed Only</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="border rounded-md overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                            <p className="text-xs text-muted-foreground mt-2">Loading transactions...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="text-xs">
                                                {format(parseISO(transaction.created_at), 'dd MMM, yyyy')}
                                                <div className="text-[10px] text-muted-foreground">{format(parseISO(transaction.created_at), 'HH:mm')}</div>
                                            </TableCell>
                                            <TableCell className="font-mono text-[10px]">{transaction.payment_reference}</TableCell>
                                            <TableCell className="font-medium text-sm">
                                                {transaction.payer_name}
                                                <div className="text-[10px] text-muted-foreground font-normal">{transaction.payer_email}</div>
                                            </TableCell>
                                            <TableCell className="text-xs max-w-[200px] truncate">{transaction.description}</TableCell>
                                            <TableCell className="font-bold">₦{transaction.amount.toLocaleString()}</TableCell>
                                            <TableCell><StatusBadge status={transaction.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => openReceipt(transaction)}>
                                                            <Printer className="mr-2 h-4 w-4" /> Print Receipt
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openReceipt(transaction)}>
                                                            <FileText className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem disabled>
                                                            <Eye className="mr-2 h-4 w-4" /> App Details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No transactions found for the selected filter.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

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
        </div>
    );
}
