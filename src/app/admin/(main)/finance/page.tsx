
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Search, Landmark, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

type TransactionStatus = 'Verified' | 'Pending' | 'Failed';

interface Transaction {
  id: string;
  date: string;
  applicantName: string;
  applicationId: string;
  amount: number;
  status: TransactionStatus;
  description: string;
}

// Mock data for transactions
const mockTransactions: Transaction[] = [
  { id: 'TRN-001', date: '2024-07-25', applicantName: 'John Doe', applicationId: 'KSP123', amount: 10000, status: 'Verified', description: 'DIN Application Fee' },
  { id: 'TRN-002', date: '2024-07-24', applicantName: 'Jane Smith', applicationId: 'KSP124', amount: 50000, status: 'Pending', description: 'Building Permit Assessment' },
  { id: 'TRN-003', date: '2024-07-23', applicantName: 'Musa Bello', applicationId: 'KSP125', amount: 25000, status: 'Failed', description: 'Street Naming Fee' },
  { id: 'TRN-004', date: '2024-07-22', applicantName: 'Amina Lawal', applicationId: 'KSP126', amount: 5000, status: 'Verified', description: 'Stage Approval Fee' },
  { id: 'TRN-005', date: '2024-07-21', applicantName: 'David Okon', applicationId: 'KSP127', amount: 20000, status: 'Pending', description: 'Mast Installation Permit' },
];


const statusConfig: Record<TransactionStatus, { variant: 'default' | 'secondary' | 'destructive', icon: React.ElementType }> = {
    Verified: { variant: 'default', icon: CheckCircle },
    Pending: { variant: 'secondary', icon: Clock },
    Failed: { variant: 'destructive', icon: XCircle },
};

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
    const { variant, icon: Icon } = statusConfig[status];
    return (
        <Badge variant={variant} className="capitalize flex items-center gap-1.5">
            <Icon className="h-3 w-3" />
            {status}
        </Badge>
    )
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = (transactionId: string, newStatus: TransactionStatus) => {
    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, status: newStatus } : t));
    toast({
        title: "Status Updated",
        description: `Transaction ${transactionId} has been marked as ${newStatus}.`
    });
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Landmark className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Finance Transactions</CardTitle>
                <CardDescription>Review and manage all financial transactions from applicants.</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Transaction ID, Applicant, or App ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                      <TableCell>{format(new Date(transaction.date), 'dd MMM, yyyy')}</TableCell>
                      <TableCell className="font-medium">{transaction.applicantName}</TableCell>
                      <TableCell>{transaction.applicationId}</TableCell>
                      <TableCell>₦{transaction.amount.toLocaleString()}</TableCell>
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
                            <DropdownMenuItem disabled>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusUpdate(transaction.id, 'Verified')}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Verified
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusUpdate(transaction.id, 'Pending')}>
                                <Clock className="mr-2 h-4 w-4" /> Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(transaction.id, 'Failed')} className="text-destructive">
                                <XCircle className="mr-2 h-4 w-4" /> Mark as Failed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
