'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

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
        <>
            {/* Unified Screen and Print View */}
            <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-white text-slate-900 print-receipt-container">
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Payment Receipt</h2>
                    <div className="flex gap-2 print:hidden">
                        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                            <Printer className="h-4 w-4" /> Print Receipt
                        </Button>
                    </div>
                </div>

                <Card className="border-2 border-slate-200 shadow-xl overflow-hidden">
                    {/* Header with Logo/Branding */}
                    <div className="bg-primary/5 border-b-2 border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
                                <Image src="/image/logo.png" alt="KASUPDA Logo" width={40} height={40} className="object-contain" />
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

                    <CardContent className="p-6 sm:p-10">
                        {/* Main Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payer Details</h3>
                                    <p className="text-sm font-bold text-slate-800">{transaction.payer_name}</p>
                                    <p className="text-xs text-slate-500">{transaction.payer_email}</p>
                                    <p className="text-xs text-slate-500">{transaction.payer_phone}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Date</h3>
                                    <p className="text-sm font-bold text-slate-800">{format(new Date(transaction.created_at), 'MMMM dd, yyyy')}</p>
                                    <p className="text-xs text-slate-500">{format(new Date(transaction.created_at), 'hh:mm a')}</p>
                                </div>
                            </div>
                            <div className="sm:text-right space-y-4">
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Reference</h3>
                                    <p className="text-sm font-mono font-bold text-slate-800">{transaction.payment_reference}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Application Type</h3>
                                    <p className="text-sm font-bold text-slate-800">{transaction.applications?.type || transaction.description}</p>
                                    <p className="text-xs text-slate-500">App ID: {transaction.application_id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Table */}
                        <div className="border rounded-xl overflow-hidden mb-10">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-bold text-slate-800">{transaction.description}</p>
                                            <p className="text-xs text-slate-500">Official processing fee for KASUPDA permit application.</p>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <p className="text-sm font-bold text-slate-800">₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-50/50">
                                        <td className="px-4 py-4 text-right">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Amount Paid</p>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <p className="text-lg font-black text-primary">₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Footer / Notes */}
                        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-end gap-6">
                            <div className="max-w-xs">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Important Information</h4>
                                <p className="text-[10px] leading-relaxed text-slate-500">
                                    This is an electronically generated receipt and does not require a physical signature.
                                    Please keep this receipt as proof of payment for your application.
                                    For any inquiries, contact KASUPDA support at support@kasupda.kdsg.gov.ng.
                                </p>
                            </div>
                            <div className="text-center sm:text-right">
                                <div className="w-24 h-24 bg-white rounded-lg mb-2 mx-auto sm:ml-auto flex items-center justify-center border-2 border-slate-200 p-1">
                                    <QRCodeSVG 
                                        value={JSON.stringify({
                                            id: transaction.id,
                                            ref: transaction.payment_reference,
                                            amount: transaction.amount,
                                            date: transaction.created_at
                                        })} 
                                        size={80} 
                                        level="L"
                                    />
                                </div>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Verified by PayKaduna</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>



            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-receipt-container, .print-receipt-container * {
                        visibility: visible;
                    }
                    .print-receipt-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    /* Override Radix Dialog styles that break printing */
                    [data-radix-portal] {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        transform: none !important;
                    }
                    [role="dialog"] {
                        position: static !important;
                        transform: none !important;
                        max-height: none !important;
                        height: auto !important;
                        overflow: visible !important;
                        box-shadow: none !important;
                        border: none !important;
                        background: transparent !important;
                    }
                }
            `}</style>
        </>
    );
}
