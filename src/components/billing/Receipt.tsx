'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, CheckCircle2, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ReceiptProps {
    transaction: {
        id: string | number;
        created_at: string;
        amount: number;
        description: string;
        payment_reference: string;
        status: string;
        payer_name: string;
        payer_email: string;
        payer_phone: string;
        application_id: string;
        applications?: {
            id: string;
            type: string;
        };
    };
}

export default function Receipt({ transaction }: ReceiptProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-white text-slate-900 print:p-0 print:shadow-none print-container">
            <div className="flex justify-between items-start mb-8 print:hidden">
                <h2 className="text-2xl font-bold text-slate-800">Payment Receipt</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                        <Printer className="h-4 w-4" /> Print Receipt
                    </Button>
                </div>
            </div>

            <Card className="border-2 border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none print:m-0 print:overflow-visible">
                {/* Header with Logo/Branding */}
                <div className="bg-primary/5 border-b-2 border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 print:bg-white print:p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg print:bg-transparent print:p-0">
                            <Landmark className="h-8 w-8 text-white print:text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-primary">KASUPDA</h1>
                            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Kaduna State Urban Planning & Dev. Authority</p>
                        </div>
                    </div>
                    <div className="text-center sm:text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-2">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            PAYMENT SUCCESSFUL
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Receipt No: <span className="text-slate-900 font-bold">REC-{transaction.payment_reference.slice(-8).toUpperCase()}</span></p>
                    </div>
                </div>

                <CardContent className="p-6 sm:p-10 print:p-6">
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 print:gap-4 print:mb-6">
                        <div className="space-y-4 print:space-y-3">
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payer Details</h3>
                                <p className="text-sm font-bold text-slate-800 print:text-xs">{transaction.payer_name}</p>
                                <p className="text-xs text-slate-500">{transaction.payer_email}</p>
                                <p className="text-xs text-slate-500">{transaction.payer_phone}</p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Date</h3>
                                <p className="text-sm font-bold text-slate-800 print:text-xs">{format(new Date(transaction.created_at), 'MMMM dd, yyyy')}</p>
                                <p className="text-xs text-slate-500">{format(new Date(transaction.created_at), 'hh:mm a')}</p>
                            </div>
                        </div>
                        <div className="sm:text-right space-y-4 print:space-y-3">
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Reference</h3>
                                <p className="text-sm font-mono font-bold text-slate-800 print:text-xs">{transaction.payment_reference}</p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Application Type</h3>
                                <p className="text-sm font-bold text-slate-800 print:text-xs">{transaction.applications?.type || transaction.description}</p>
                                <p className="text-xs text-slate-500">App ID: {transaction.application_id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="border rounded-xl overflow-hidden mb-10 print:border print:rounded-none print:mb-6">
                        <table className="w-full text-left border-collapse print:text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 print:bg-white print:border-b">
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider print:px-2 print:py-2 print:text-[9px]">Description</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right print:px-2 print:py-2 print:text-[9px]">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="print:border-b">
                                    <td className="px-4 py-4 print:px-2 print:py-3">
                                        <p className="text-sm font-bold text-slate-800 print:text-xs">{transaction.description}</p>
                                        <p className="text-xs text-slate-500 print:text-[9px]">Official processing fee for KASUPDA permit application.</p>
                                    </td>
                                    <td className="px-4 py-4 text-right print:px-2 print:py-3">
                                        <p className="text-sm font-bold text-slate-800 print:text-xs">₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-50/50 print:bg-white print:border-t print:border-b print:font-bold">
                                    <td className="px-4 py-4 text-right print:px-2 print:py-3">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider print:text-[9px]">Total Amount Paid</p>
                                    </td>
                                    <td className="px-4 py-4 text-right print:px-2 print:py-3">
                                        <p className="text-lg font-black text-primary print:text-sm print:font-bold">₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Footer / Notes */}
                    <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-6 print:pt-4 print:border-t print:gap-3">
                        <div className="max-w-xs print:max-w-full print:flex-1">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 print:mb-1">Important Information</h4>
                            <p className="text-[10px] leading-relaxed text-slate-500 print:text-[8px] print:leading-tight">
                                This is an electronically generated receipt and does not require a physical signature.
                                Please keep this receipt as proof of payment for your application.
                                For any inquiries, contact KASUPDA support at support@kasupda.kdsg.gov.ng.
                            </p>
                        </div>
                        <div className="text-center sm:text-right print:hidden">
                            <div className="w-24 h-24 bg-slate-100 rounded-lg mb-2 mx-auto sm:ml-auto flex items-center justify-center border-2 border-slate-200">
                                <span className="text-[8px] font-bold text-slate-400 uppercase text-center px-2">KASUPDA SECURE QR CODE</span>
                            </div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Verified by PayKaduna</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <style jsx global>{`
                @media print {
                    * {
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                    }
                    html, body {
                        width: 100% !important;
                        height: 100% !important;
                        background: white !important;
                    }
                    body {
                        visibility: hidden !important;
                    }
                    .print-container {
                        visibility: visible !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                    }
                    .print-container * {
                        visibility: visible !important;
                    }
                    @page {
                        size: A4;
                        margin: 0.5cm;
                    }
                }
            `}</style>
        </div>
    );
}
