
'use client';

import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function CertificateDemoPage() {
    const searchParams = useSearchParams();
    const userName = searchParams.get('name') || 'MUSA ABDULLAHI KADUNA';
    const date = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const certNo = "KSP/CFH/2026/SEC-" + Math.floor(10000 + Math.random() * 90000);
    const dinNo = "KDS/DIN/" + Math.floor(100000 + Math.random() * 899999);

    return (
        <div className="min-h-screen bg-neutral-200 py-12 px-4 flex justify-center items-center">
            <div className="max-w-[850px] w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-1 relative overflow-hidden border border-gray-300">

                {/* Security Background Pattern (Guilloche-like) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

                {/* Main Border Container */}
                <div className="border-[3px] border-double border-emerald-900 m-2 p-8 h-full relative z-10">

                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-10 border-b-2 border-emerald-800 pb-6">
                        <div className="w-24">
                            <Image
                                src="/images/official_seal.png"
                                alt="KASUPDA Logo"
                                width={100}
                                height={100}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1 text-center px-4">
                            <h2 className="text-emerald-900 text-sm font-bold tracking-widest uppercase mb-1">Government of Kaduna State</h2>
                            <h1 className="text-emerald-950 text-2xl font-black tracking-tight uppercase leading-tight">
                                Kaduna State Urban Planning and Development Authority (KASUPDA)
                            </h1>
                            <p className="text-emerald-800 text-xs font-semibold mt-2 tracking-widest uppercase italic">
                                Statutory Instrument for Building Control & Habitation
                            </p>
                        </div>
                        <div className="w-24 flex flex-col items-center">
                            {/* Placeholder QR Code */}
                            <div className="w-20 h-20 bg-white border border-gray-300 p-1">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://kasupda.kdsg.gov.ng/verify" alt="QR Verification" className="w-full h-full" />
                            </div>
                            <span className="text-[8px] font-mono mt-1 text-gray-500">Scan to Verify</span>
                        </div>
                    </div>

                    {/* Certificate Title */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-emerald-900 text-white px-8 py-2 text-xl font-bold tracking-[0.3em] uppercase mb-2">
                            Certificate of Fitness
                        </div>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-2">Document ID: {certNo}</p>
                    </div>

                    {/* Main Content */}
                    <div className="text-gray-900 text-sm leading-relaxed mb-8">
                        <p className="mb-4">
                            Pursuant to the provisions of the <strong>Kaduna State Urban and Regional Planning Law</strong>, and based on the terminal inspection report submitted by the Building Control Directorate, this Authority hereby certifies that:
                        </p>

                        {/* Primary Subject Box */}
                        <div className="bg-emerald-50/50 border-l-4 border-emerald-800 p-4 my-6">
                            <table className="w-full text-left">
                                <tbody>
                                    <tr className="border-b border-emerald-100">
                                        <td className="py-2 text-xs font-bold text-emerald-900 uppercase">Building Owner:</td>
                                        <td className="py-2 text-lg font-bold text-black">{userName}</td>
                                    </tr>
                                    <tr className="border-b border-emerald-100">
                                        <td className="py-2 text-xs font-bold text-emerald-900 uppercase">Development ID (DIN):</td>
                                        <td className="py-2 font-mono font-bold text-emerald-700 underline">{dinNo}</td>
                                    </tr>
                                    <tr className="border-b border-emerald-100">
                                        <td className="py-2 text-xs font-bold text-emerald-900 uppercase">Property Location:</td>
                                        <td className="py-2 font-semibold">Plot 452, Sector V, Millennium City Layout, Kaduna State</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-xs font-bold text-emerald-900 uppercase">Approved Use:</td>
                                        <td className="py-2 font-semibold">Residential - Detached Duplex with BQ</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="text-justify font-serif text-base italic leading-relaxed px-2 border-l border-emerald-200">
                            "The structures situated at the aforementioned location have been found to be structurally stable and executed in complete adherence to the approved architectural, structural, and service engineering drawings. The building is hereafter declared <strong>Fit for Habitation and Use</strong> in accordance with safety standards."
                        </p>
                    </div>

                    {/* Rights/Notice Section */}
                    <div className="grid grid-cols-2 gap-4 mb-10 text-[10px] text-gray-600 bg-gray-50 p-3 border border-gray-200 uppercase font-bold tracking-tighter">
                        <div>
                            NOTICE: ANY UNAUTHORIZED ALTERATION TO THIS DOCUMENT RENDERS IT NULL AND VOID.
                        </div>
                        <div className="text-right">
                            VALIDITY: THIS INSTRUMENT REMAINS VALID SUBJECT TO ADHERENCE TO LAND USE ZONING.
                        </div>
                    </div>

                    {/* Signature and Seals Section */}
                    <div className="grid grid-cols-3 gap-8 mt-12 items-end">
                        <div className="text-center relative">
                            <div className="mb-2 italic font-serif text-xl border-b border-gray-400 pb-1">
                                <span className="opacity-70 text-blue-800">E. Arch. Gambo S.</span>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-900 uppercase">Director, Building Control</p>
                            <p className="text-[9px] text-gray-500">Professional Seal Required</p>
                        </div>

                        <div className="flex flex-col items-center justify-center relative">
                            {/* Official Seal Overlapping */}
                            <div className="absolute -top-16 opacity-80 pointer-events-none">
                                <Image
                                    src="/images/official_seal.png"
                                    alt="Seal"
                                    width={120}
                                    height={120}
                                />
                            </div>
                            <div className="mt-8 text-center bg-white/80 p-1 border border-emerald-800 rounded z-10 w-full">
                                <p className="text-[10px] font-mono font-black text-emerald-950">AUTHENTICATED</p>
                                <p className="text-[9px] font-semibold text-gray-600">{date}</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="mb-2 italic font-serif text-xl border-b border-gray-400 pb-1 underline decoration-blue-900/30">
                                <span className="opacity-90 text-blue-950 uppercase text-xs font-bold">Ismail Umaru Dikko</span>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-900 uppercase">Director General, KASUPDA</p>
                            <p className="text-[9px] text-gray-500 font-mono tracking-tighter">KDSG/SEC/CERT/HAB-0021</p>
                        </div>
                    </div>

                    {/* Bottom Security Bar */}
                    <div className="mt-12 pt-4 border-t border-emerald-800 flex justify-between items-center opacity-70">
                        <div className="text-[9px] font-mono text-gray-600">
                            VERIFICATION URL: HTTPS://KASUPDA.KDSG.GOV.NG/VERIFY-CERTIFICATE
                        </div>
                        <svg className="w-48 h-10 opacity-30" viewBox="0 0 200 40">
                            {/* Simple Barcode Placeholder */}
                            {Array.from({ length: 40 }).map((_, i) => (
                                <rect key={i} x={i * 5} y="0" width={Math.random() * 4} height="40" fill="currentColor" />
                            ))}
                        </svg>
                    </div>
                </div>
            </div>

            {/* Desktop Action Sidebar */}
            <div className="fixed top-1/2 left-8 -translate-y-1/2 flex flex-col gap-4 no-print">
                <div className="bg-white p-4 rounded-xl shadow-xl border border-emerald-100 scale-90">
                    <h4 className="font-bold text-emerald-900 text-xs uppercase mb-3 border-b pb-2">Admin Tools</h4>
                    <button
                        onClick={() => window.print()}
                        className="w-full bg-emerald-900 hover:bg-emerald-950 text-white text-[10px] py-2 px-4 rounded font-bold uppercase transition-all mb-2"
                    >
                        Print Original
                    </button>
                    <button
                        className="w-full bg-blue-900 hover:bg-blue-950 text-white text-[10px] py-2 px-4 rounded font-bold uppercase transition-all"
                    >
                        Verify DIN
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: A4; }
                    body { background: white; padding: 0; }
                    .no-print { display: none; }
                    .bg-neutral-200 { background: white !important; }
                    .shadow-\[0_20px_50px_rgba\(0\,0\,0\,0\.3\)\] { shadow: none !important; }
                    .bg-emerald-50\/50 { background-color: #f0fdf4 !important; }
                }
            `}</style>
        </div>
    );
}
