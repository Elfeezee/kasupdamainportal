'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, CheckCircle2, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';

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
            {/* Screen View */}
            <div className="print:hidden max-w-3xl mx-auto p-4 sm:p-8 bg-white text-slate-900">
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Payment Receipt</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                            <Printer className="h-4 w-4" /> Print Receipt
                        </Button>
                    </div>
                </div>

                <Card className="border-2 border-slate-200 shadow-xl overflow-hidden">
                    {/* Header with Logo/Branding */}
                    <div className="bg-primary/5 border-b-2 border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <Landmark className="h-8 w-8 text-white" />
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
                                <div className="w-24 h-24 bg-slate-100 rounded-lg mb-2 mx-auto sm:ml-auto flex items-center justify-center border-2 border-slate-200">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase text-center px-2">KASUPDA SECURE QR CODE</span>
                                </div>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Verified by PayKaduna</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Print View - Simplified Structure */}
            <div className="hidden print:block w-full bg-white p-2" style={{ fontSize: '12px' }}>
                {/* Header with Logo/Branding */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #ccc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Landmark style={{ width: '24px', height: '24px', color: '#2563eb' }} />
                        <div>
                            <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2563eb', margin: '0' }}>KASUPDA</h1>
                            <p style={{ fontSize: '8px', fontWeight: 'bold', color: '#666', margin: '0', textTransform: 'uppercase' }}>Kaduna State Urban Planning & Dev. Authority</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#059669', marginBottom: '4px' }}>✓ PAYMENT SUCCESSFUL</div>
                        <p style={{ fontSize: '11px', color: '#666', margin: '0' }}>Receipt No: <span style={{ fontWeight: 'bold' }}>REC-{transaction.payment_reference.slice(-8).toUpperCase()}</span></p>
                    </div>
                </div>

                {/* Main Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '11px' }}>
                    <div>
                        <h3 style={{ fontSize: '9px', fontWeight: 'bold', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Payer Details</h3>
                        <p style={{ fontWeight: 'bold', color: '#000', margin: '0' }}>{transaction.payer_name}</p>
                        <p style={{ color: '#666', margin: '0', fontSize: '10px' }}>{transaction.payer_email}</p>
                        <p style={{ color: '#666', margin: '0', fontSize: '10px' }}>{transaction.payer_phone}</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '9px', fontWeight: 'bold', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Payment Date</h3>
                        <p style={{ fontWeight: 'bold', color: '#000', margin: '0' }}>{format(new Date(transaction.created_at), 'MMM dd, yyyy')}</p>
                        <p style={{ color: '#666', margin: '0', fontSize: '10px' }}>{format(new Date(transaction.created_at), 'hh:mm a')}</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '9px', fontWeight: 'bold', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Payment Reference</h3>
                        <p style={{ fontWeight: 'bold', color: '#000', margin: '0', fontFamily: 'monospace' }}>{transaction.payment_reference}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h3 style={{ fontSize: '9px', fontWeight: 'bold', color: '#666', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Application Type</h3>
                        <p style={{ fontWeight: 'bold', color: '#000', margin: '0' }}>{transaction.applications?.type || transaction.description}</p>
                        <p style={{ color: '#666', margin: '0', fontSize: '10px' }}>App ID: {transaction.application_id}</p>
                    </div>
                </div>

                {/* Transaction Table */}
                <table style={{ width: '100%', fontSize: '10px', marginBottom: '16px', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold', fontSize: '9px' }}>Description</th>
                            <th style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '9px' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #ccc' }}>
                            <td style={{ padding: '8px' }}>
                                <p style={{ fontWeight: 'bold', margin: '0' }}>{transaction.description}</p>
                                <p style={{ fontSize: '9px', color: '#666', margin: '2px 0 0 0' }}>Official processing fee for KASUPDA permit application.</p>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                        <tr style={{ backgroundColor: '#f9f9f9', borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc' }}>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>Total Amount Paid:</td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '12px' }}>₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer / Notes */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid #ccc', fontSize: '9px', color: '#666' }}>
                    <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Important Information:</p>
                    <p style={{ lineHeight: '1.4', margin: '0' }}>
                        This is an electronically generated receipt and does not require a physical signature. Please keep this receipt as proof of payment. For inquiries, contact KASUPDA support at support@kasupda.kdsg.gov.ng.
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body, html {
                        margin: 0;
                        padding: 0;
                    }
                }
            `}</style>
        </>
    );
}
