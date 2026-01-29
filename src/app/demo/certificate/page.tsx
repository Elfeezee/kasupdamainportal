
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
            {/* Main Certificate Sheet */}
            <div className="max-w-[850px] w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-1 relative overflow-hidden border border-gray-300">

                {/* Security Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

                {/* KASUPDA Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none z-0">
                    <div className="relative w-[500px] h-[500px]">
                        <Image
                            src="/image/logo.png"
                            alt="KASUPDA Watermark"
                            fill
                            className="object-contain grayscale"
                        />
                    </div>
                </div>

                {/* Main Border Container */}
                <div className="border-[3px] border-double border-emerald-900 m-2 p-8 h-full relative z-10">

                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-10 border-b-2 border-emerald-800 pb-6 relative z-20">
                        <div className="w-24 h-24 relative">
                            <Image
                                src="/image/logo.png"
                                alt="KASUPDA Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1 text-center px-4">
                            <h1 className="text-emerald-950 text-2xl font-black tracking-tight uppercase leading-tight">
                                Kaduna State Urban Planning and Development Authority (KASUPDA)
                            </h1>
                            <p className="text-emerald-800 text-xs font-semibold mt-3 tracking-widest uppercase italic">
                                Statutory Instrument for Building Control & Habitation
                            </p>
                            <div className="mt-4 flex justify-center gap-4">
                                <span className="h-[2px] w-8 bg-emerald-800"></span>
                                <span className="h-[2px] w-12 bg-emerald-600"></span>
                                <span className="h-[2px] w-8 bg-emerald-800"></span>
                            </div>
                        </div>
                        <div className="w-24 flex flex-col items-center">
                            {/* QR Code for Verification */}
                            <div className="w-20 h-20 bg-white border border-gray-300 p-1 shadow-sm">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://kasupda.kdsg.gov.ng/verify/${certNo}`} alt="QR Verification" className="w-full h-full" />
                            </div>
                            <span className="text-[7px] font-mono mt-1 text-gray-500 font-bold uppercase">Scan to Verify Authenticity</span>
                        </div>
                    </div>

                    {/* Certificate Title */}
                    <div className="text-center mb-8 relative z-20">
                        <div className="inline-block border-2 border-emerald-900 px-10 py-2">
                            <h2 className="text-emerald-900 text-2xl font-black tracking-[0.25em] uppercase">
                                Certificate of Fitness
                            </h2>
                        </div>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.5em] mt-3 font-bold">Document Serial: {certNo}</p>
                    </div>

                    {/* Main Content */}
                    <div className="text-gray-900 text-sm leading-relaxed mb-8 relative z-20">
                        <p className="mb-4 text-center px-10">
                            Pursuant to the provisions of the <strong>Kaduna State Urban and Regional Planning Law</strong>, and based on the terminal inspection report submitted by the Building Control Directorate, this Authority hereby certifies that:
                        </p>

                        {/* Primary Subject Box */}
                        <div className="bg-emerald-50/40 border-y-2 border-emerald-800/10 py-6 my-6">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="w-1/3 py-2 px-6 text-[10px] font-bold text-emerald-900 uppercase tracking-widest text-right">Owner/Developer Name:</td>
                                        <td className="py-2 px-6 text-xl font-black text-black border-l border-emerald-800/20">{userName}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/3 py-2 px-6 text-[10px] font-bold text-emerald-900 uppercase tracking-widest text-right">Development ID (DIN):</td>
                                        <td className="py-2 px-6 font-mono font-bold text-emerald-700 text-lg border-l border-emerald-800/20">{dinNo}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/3 py-2 px-6 text-[10px] font-bold text-emerald-900 uppercase tracking-widest text-right">Location of Works:</td>
                                        <td className="py-2 px-6 font-bold text-gray-800 border-l border-emerald-800/20">Plot 452, Sector V, Millennium City Layout, Kaduna State</td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/3 py-2 px-6 text-[10px] font-bold text-emerald-900 uppercase tracking-widest text-right">Classification:</td>
                                        <td className="py-2 px-6 font-bold text-gray-800 border-l border-emerald-800/20 uppercase tracking-tighter">Residential - Multi-Family Development</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="text-center px-12 italic font-serif text-base leading-relaxed text-emerald-950/80">
                            "The development situated at the aforementioned location has been inspected and found to be structurally sound, completed in full compliance with the approved working drawings and relevant building standards. The Authority hereby declares the building <strong>Fit for Habitation and Purpose</strong>."
                        </div>
                    </div>

                    {/* Legal Notice */}
                    <div className="mb-10 text-[9px] text-gray-500 bg-gray-50 p-3 border border-gray-100 flex justify-between items-center font-bold tracking-tight">
                        <span className="uppercase">Notice: Unauthorized alteration of this instrument is a criminal offense.</span>
                        <div className="h-4 w-[1px] bg-gray-300"></div>
                        <span className="uppercase tracking-widest">Seal of Authority required for validity</span>
                    </div>

                    {/* Signature and Seals Section */}
                    <div className="grid grid-cols-3 gap-8 mt-12 items-end">
                        {/* Director Building Control */}
                        <div className="text-center relative">
                            <div className="h-16 flex items-end justify-center pb-2">
                                <span className="text-blue-900/60 font-serif italic text-lg opacity-80 border-b border-gray-300 w-full px-4 mb-2">
                                    Arch. E. S. Gambo
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-tighter">Director, Building Control</p>
                            <p className="text-[8px] text-gray-400 font-mono">COREN/ARCON REG NO: 5521/11</p>
                        </div>

                        {/* Central Seal Area */}
                        <div className="flex flex-col items-center justify-center relative">
                            <div className="absolute -top-12 opacity-90">
                                <Image
                                    src="/image/logo.png"
                                    alt="KASUPDA Seal"
                                    width={100}
                                    height={100}
                                    className="grayscale opacity-40 brightness-0"
                                />
                            </div>
                            <div className="mt-8 text-center bg-white/90 p-2 border-2 border-emerald-900/20 rounded-lg shadow-sm z-10 w-full">
                                <p className="text-[10px] font-black text-emerald-950 tracking-[0.2em]">VALIDATED</p>
                                <p className="text-[9px] font-bold text-gray-500 mt-1">{date}</p>
                            </div>
                        </div>

                        {/* Director General - VISIBLE SIGNATURE */}
                        <div className="text-center relative">
                            <div className="h-16 flex items-end justify-center pb-2">
                                {/* Simulated Visible Signature */}
                                <div className="relative w-full">
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 pointer-events-none opacity-90 brightness-50 contrast-125 saturate-0">
                                        <p className="text-4xl text-blue-900" style={{ fontFamily: '"Zapfino", "Great Vibes", "Dancing Script", cursive', fontWeight: 100 }}>
                                            Abdurrahman Yahaya Phd.
                                        </p>
                                    </div>
                                    <div className="border-b border-gray-300 w-full mb-2"></div>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-900 uppercase">Director General</p>
                            <p className="text-[9px] text-emerald-700 font-black tracking-widest mt-1">KASUPDA</p>
                        </div>
                    </div>

                    {/* Static Barcode Security Footer */}
                    <div className="mt-12 flex justify-between items-end">
                        <div className="text-[8px] font-mono text-gray-400 font-bold uppercase">
                            Ref: KDSG/KSP/HAB/2026/011-B
                            <br />
                            Authorized Digital Copy
                        </div>
                        <div className="w-1/3 opacity-20 hover:opacity-100 transition-opacity">
                            <svg className="w-full h-8" viewBox="0 0 200 40">
                                {Array.from({ length: 80 }).map((_, i) => (
                                    <rect key={i} x={i * 2.5} y="0" width={1 + Math.random() * 2} height="40" fill="#064e3b" />
                                ))}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Action Menu */}
            <div className="fixed left-8 bottom-8 flex flex-col gap-3 no-print">
                <div className="bg-emerald-950 p-5 rounded-2xl shadow-2xl border border-white/10 text-white min-w-[180px]">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                        <div className="w-8 h-8 relative">
                            <Image src="/image/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">KASUPDA Portal</span>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="w-full bg-white text-emerald-950 text-xs py-3 px-4 rounded-xl font-black uppercase hover:scale-105 transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Original
                    </button>
                </div>
            </div>

            {/* Custom Fonts for Signature */}
            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&display=swap" rel="stylesheet" />

            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: A4; }
                    body { background: white !important; padding: 0 !important; }
                    .no-print { display: none !important; }
                    .bg-neutral-200 { background: white !important; }
                    .shadow-\[0_20px_50px_rgba\(0\,0\,0\,0\.3\)\] { shadow: none !important; }
                }
            `}</style>
        </div>
    );
}
