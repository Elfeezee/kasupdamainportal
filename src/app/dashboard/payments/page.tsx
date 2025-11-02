
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReceiptText, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const paymentHistory = [
  {
    id: "PAY-2024-001",
    date: "2024-07-15",
    description: "DIN Application Fee",
    amount: "₦10,000.00",
    status: "Paid",
  },
  {
    id: "PAY-2024-002",
    date: "2024-07-18",
    description: "Building Permit (Individual) - Assessment Fee",
    amount: "₦50,000.00",
    status: "Paid",
  },
  {
    id: "PAY-2024-003",
    date: "2024-07-20",
    description: "Stage Approval Inspection Fee (Foundation)",
    amount: "₦5,000.00",
    status: "Paid",
  },
   {
    id: "PAY-2024-004",
    date: "2024-07-22",
    description: "Street Naming Permit Fee",
    amount: "₦25,000.00",
    status: "Pending",
  },
];

export default function PaymentHistoryPage() {
  const { toast } = useToast();

  const handleDownload = (paymentId: string) => {
    toast({
      title: 'Prototype Feature',
      description: `Downloading receipt for payment ${paymentId} is not implemented yet.`,
    });
  };

  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
          <ReceiptText className="mr-3 h-7 w-7" /> Payment History
        </CardTitle>
        <CardDescription>
          View a complete history of all your payments to KASUPDA.
        </CardDescription>
      </CardHeader>
      <Card>
        <CardContent className="pt-6">
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentHistory.length > 0 ? (
                            paymentHistory.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.id}</TableCell>
                                    <TableCell>{payment.date}</TableCell>
                                    <TableCell>{payment.description}</TableCell>
                                    <TableCell>{payment.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant={payment.status === 'Paid' ? 'default' : 'secondary'}>
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="gap-2"
                                            onClick={() => handleDownload(payment.id)}
                                        >
                                            <Download className="h-4 w-4" /> Receipt
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                No payment history found.
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
