
'use client';

import React from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CertificateToPrint = React.forwardRef<HTMLDivElement, { applicationData: StoredApplication }>(({ applicationData }, ref) => {
    const applicantName = applicationData.applicant_name;
    const approvalDate = applicationData.updated_at ? format(parseISO(applicationData.updated_at), 'do MMMM, yyyy') : format(new Date(), 'do MMMM, yyyy');
    const permitId = applicationData.original_permit_id || 'Not Specified';
    const location = applicationData.plot_address_description || "the location specified in the permit";


    return (
        <div ref={ref} id="letter-to-print" className="bg-white dark:bg-card text-black flex flex-col min-h-[1100px] p-12 relative print:min-h-full font-serif">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center z-0 print:block">
                <Image src="/image/logo.png" alt="KASUPDA Watermark" width={300} height={300} className="w-2/3 h-2/3 object-contain opacity-10 pointer-events-none" />
            </div>

            {/* Decorative Border */}
            <div className="absolute inset-4 border-2 border-primary z-0"></div>
            <div className="absolute inset-6 border border-primary/50 z-0"></div>
            
            <div className="relative z-10 flex flex-col flex-grow">
                <header className="pb-4 mb-4 text-center">
                    <Image src="/image/logo.png" alt="KASUPDA Logo" width={80} height={80} className="h-20 w-20 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-primary tracking-wider">KADUNA STATE URBAN PLANNING AND DEVELOPMENT AUTHORITY</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mt-2">CERTIFICATE OF FITNESS AND HABITATION</h2>
                </header>
                
                <main className="flex-grow mt-10 text-lg leading-relaxed">
                    <p className="mb-6">This is to certify that the building located at <strong className="font-semibold">{location}</strong>, developed by <strong className="font-semibold">{applicantName}</strong> under Building Permit ID <strong className="font-semibold">{permitId}</strong>, has been inspected and found to be satisfactorily completed in accordance with the approved plans and relevant building regulations.</p>
                    
                    <p>The Authority, having been satisfied that the building conforms to the provisions of the Kaduna State Urban and Regional Planning Law, hereby declares the building fit for habitation and use.</p>
                    
                    <p className="mt-6">This certificate is issued on this day, <strong className="font-semibold">{approvalDate}</strong>.</p>
                </main>

                 <footer className="text-sm text-gray-800 space-y-2 pt-8 mt-auto">
                    <div className="flex justify-between items-end gap-16 pt-12">
                        <div className="w-1/2 text-center">
                            <div className="border-t-2 border-black pt-2">
                                <p className="font-bold text-base">Director General</p>
                                <p>KASUPDA</p>
                            </div>
                        </div>
                        <div className="w-1/2 text-center">
                            <p className="font-semibold">Certificate No: KSP/CFH/{String(applicationData.id).padStart(4, '0')}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
});
CertificateToPrint.displayName = "CertificateToPrint";

export default function CertificateOfFitnessContent({ applicationData }: { applicationData: StoredApplication }) {
    const router = useRouter();

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-center items-center gap-4 no-print">
                <Button variant="outline" onClick={() => router.push('/dashboard/my-applications')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to My Applications
                </Button>
                 <Button onClick={handlePrint} variant="default">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Certificate
                </Button>
            </div>
            
            <div className="shadow-2xl max-w-4xl mx-auto print:shadow-none">
                 <CertificateToPrint applicationData={applicationData} />
            </div>
        </>
    );
}
