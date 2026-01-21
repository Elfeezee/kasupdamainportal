'use client';

import React from 'react';
import AcknowledgementLetterContent from '@/app/dashboard/acknowledgement/[id]/AcknowledgementLetterContent';
import { StoredApplication } from '@/app/admin/(main)/applications/page';

export default function DinAcknowledgementDemoPage() {
    // Mock data for a DIN Application
    const mockDinApplication: StoredApplication = {
        id: 'demo-123',
        created_at: new Date().toISOString(),
        user_id: 'user-demo',
        type: 'DIN Application',
        applicant_name: 'ALHAJI MUSA IBRAHIM',
        status: 'Approved',
        din: 'DIN882',
        data: {
            applicantAddress: 'No. 45, Independence Way, Kaduna North, Kaduna State',
            plotAddress: 'Plot 102, Millennium City Layout, Danbushiya, Kaduna',
            kbpNumber: 'KBP/2024/00152',
            kdlNumber: 'KDL/ZRA/88291',
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 py-12">
            <div className="container mx-auto">
                <div className="mb-8 text-center no-print">
                    <h1 className="text-3xl font-bold text-slate-800">DIN Acknowledgement Demo</h1>
                    <p className="text-slate-600">This is a preview of how the unique DIN Acknowledgement Letter looks with sample data.</p>
                </div>

                <AcknowledgementLetterContent applicationData={mockDinApplication} />
            </div>
        </div>
    );
}
