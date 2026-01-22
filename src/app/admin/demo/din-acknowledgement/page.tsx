'use client';

import React from 'react';
import AcknowledgementLetterContent from '@/app/dashboard/acknowledgement/[id]/AcknowledgementLetterContent';
import { StoredApplication } from '@/app/admin/(main)/applications/page';

export default function DinAcknowledgementDemoPage() {
    // Mock data for a high-fidelity DIN Certificate Demo
    const mockDinApplication: StoredApplication = {
        id: 'demo-777',
        created_at: new Date().toISOString(),
        user_id: 'user-demo',
        type: 'DIN Application',
        applicant_name: 'ALHAJI MUSA IBRAHIM',
        status: 'Approved',
        // Updated to the new 7-part format
        din: 'DIN-800271-05-12-034-056-0007',
        data: {
            applicantAddress: 'No. 45, Independence Way, Kaduna North, Kaduna State',
            plotAddress: 'Plot 102, Millennium City Layout, Danbushiya, Kaduna',
            kbpNumber: 'KBP/2024/001352',
            kdlNumber: 'KDL/ZRA/88231',
            // Detailed generation parameters
            postal_code: '800271',
            lga_code: '05',
            ward_code: '12',
            street_code: '034',
            plot_number: '056',
            serial_number: '0007'
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center no-print">
                    <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-green-50 border border-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest">
                        Official Demo Preview
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">DIN Certificate Demo</h1>
                    <p className="text-slate-500 mt-2 font-medium">Previewing the automated system-generated Development Identification Number and official certificate layout.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <AcknowledgementLetterContent applicationData={mockDinApplication} />
                </div>
            </div>
        </div>
    );
}
