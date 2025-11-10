
'use client';

import React from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

// A mapping of database field names to user-friendly document labels
const documentChecklistMap: Record<string, string> = {
    // Standard application docs
    'doc_application_form_url': 'Application Form', // Assuming one might exist
    'doc_receipt_url': 'Receipt',
    'doc_utility_bill_url': 'Utility Receipt/Bill',


    // Identification
    'doc_applicant_id_url': "Applicant's Identification (Voter's Card, etc.)",
    'doc_ceo_id_url': "CEO's Identification",
    'doc_rep_id_url': "Representative's Identification",

    // Land & Site
    'doc_land_title_url': 'Land Title Document (C of O)',
    'doc_kadgis_acknowledgement_url': 'KADGIS Acknowledgement Letter',
    'doc_site_analysis_report_url': 'Site Analysis Report',
    'doc_sar_url': 'Site Analysis Report (SAR)',
    'doc_soil_test_url': 'Geotechnical (Soil Test) Report',
    'doc_site_plan_url': 'Site Plan',
    'doc_imagery_sketch_url': 'Imagery & Sketch of Site',
    'doc_site_location_installation_coordinates_url': 'Site Location & Coordinates',


    // Drawings & Technical
    'doc_architectural_works_drawings_url': 'Architectural Works Drawings and Details',
    'doc_mechanical_works_drawings_url': 'Mechanical Works Drawings and Details',
    'doc_electrical_works_drawings_url': 'Electrical Works Drawings and Details',
    'doc_structural_drawings_url': 'Structural Drawings and Details',
    'doc_telecommunication_designs_url': 'Telecommunication Designs',
    'doc_calculation_sheet_url': 'Structural Calculation Sheet',
    'doc_structural_calculation_sheets_url': 'Structural Calculation Sheets',
    'doc_pdf_drawings_url': 'PDF Copy of Drawings',
    'doc_working_drawings_url': 'Complete Working Drawings',
    'doc_structural_info_url': 'Structural Drawing/Calculation/Supervision Letter',


    // Licenses & Reports
    'doc_architects_professional_practice_license_url': "Architect's Professional Practice License",
    'doc_builders_doc_url': "Builder's Document",
    'doc_kepa_eia_cert_url': 'KEPA EIA Certificate',
    'doc_kepas_env_impact_assessment_url': "KEPA's Environment Impact Assessment",
    'doc_police_report_url': 'Police Report',
    'doc_fire_service_report_url': 'Fire Service Report',
    'doc_kasupda_license_url': 'KASUPDA License to Practice',
    'doc_corporate_arcon_license_url': 'Corporate ARCON License',
    'doc_tax_clearance_url': 'Tax Clearance Certificate',
    
    // Agreements & Letters
    'doc_consent_letter_url': 'Consent/Introduction Letter',
    'doc_lease_agreement_letter_url': 'Lease Agreement Letter',
    'doc_power_of_attorney_url': 'Power of Attorney',
    'doc_proof_of_outright_purchase_url': 'Proof of Outright Purchase',
    'doc_letter_of_attestation_url': 'Letter of Attestation of Design',

    // Utilities & Approvals
    'doc_utility_bill_url': 'Utility Receipt/Bill',
    'doc_quality_assurance_url': 'Clearance From Quality Assurance',
    'doc_nama_approval_url': 'NAMA Approval',
    'doc_ncaa_approval_url': 'NCAA Approval',
};


const DetailItem = ({ label, value }: { label: string; value: string | null | undefined; }) => (
    <div className="flex text-xs">
        <p className="w-28 shrink-0 font-semibold">{label}:</p> 
        <p>{value || 'N/A'}</p>
    </div>
);

const LetterToPrint = React.forwardRef<HTMLDivElement, { applicationData: StoredApplication }>(({ applicationData }, ref) => {
    const applicationId = applicationData.original_permit_id || applicationData.din || `KSP${String(applicationData.id).padStart(3, '0')}`;
    const applicantName = applicationData.applicant_name;
    const submissionDate = applicationData.created_at ? format(parseISO(applicationData.created_at), 'dd-MMM-yyyy') : 'N/A';
    const representativeName = [applicationData.rep_first_name, applicationData.rep_middle_name, applicationData.rep_surname].filter(Boolean).join(' ');
    const applicantAddress = [applicationData.appHouseNo, applicationData.appStreetName, applicationData.appDistrict, applicationData.appCityTown, applicationData.appState].filter(Boolean).join(', ');
    const developmentDescription = applicationData.type?.replace(/ permit/i, '').replace(/\(.*\)/i, '').trim();

    const receivedDocuments = Object.keys(applicationData)
        .filter(key => key.endsWith('_url') && applicationData[key] && documentChecklistMap[key])
        .map(key => documentChecklistMap[key]);

    return (
         <div ref={ref} id="letter-to-print" className="bg-white dark:bg-card text-black flex flex-col min-h-[1050px] p-8 relative print:min-h-full">
            
            <div className="absolute inset-0 flex items-center justify-center z-0 print:block">
                <Image src="/image/logo.png" alt="KASUPDA Watermark" width={300} height={300} className="w-2/3 h-2/3 object-contain opacity-5 pointer-events-none" />
            </div>
            
            <div className="relative z-10 flex flex-col flex-grow">
                <header className="pb-2 mb-2 text-center">
                    <Image src="/image/logo.png" alt="KASUPDA Logo" width={50} height={50} className="h-14 w-14 mx-auto mb-2" />
                    <h2 className="text-sm font-bold text-black tracking-wide">KADUNA STATE URBAN PLANNING AND DEVELOPMENT AUTHORITY</h2>
                    <h3 className="text-xs font-bold text-black tracking-wide mt-1">ACKNOWLEDGEMENT OF APPLICATION FOR BUILDING PERMIT</h3>
                </header>
                
                <main className="flex-grow">
                    <div className="space-y-1 text-xs my-4">
                        <DetailItem label="File Number" value={applicationId} />
                        <DetailItem label="Applicant Name" value={applicantName} />
                        <DetailItem label="Applicant Address" value={applicantAddress} />
                        {representativeName && <DetailItem label="Representative Name" value={representativeName} />}
                        <DetailItem label="Application Date" value={submissionDate} />
                    </div>

                    <div className="space-y-1 text-[11px] leading-relaxed">
                        <p>This is to acknowledge the receipt of the application for a new development permit via a KADGIS Acknowledgement Letter, over a property located in District/Area {applicationData.plotDistrict || '[District not provided]'} in LGA {applicationData.plotLGA || '[LGA not provided]'} more accurately described as {applicationData.plotDescriptionAddress}.</p>
                        <p>Description of the development is: {developmentDescription}</p>
                    </div>

                    {receivedDocuments.length > 0 && (
                        <div className="pt-4 mt-4">
                            <h3 className="text-[11px] font-semibold mb-2">The following documents were received:</h3>
                            <div className="space-y-1 text-[11px] max-w-md">
                                {receivedDocuments.map(docName => (
                                    <div key={docName} className="border-b border-black pb-1">
                                        <span>{docName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                 <footer className="text-[9px] text-gray-700 space-y-2 pt-4 mt-auto">
                    <div className="flex justify-between items-start gap-8 pt-8">
                        <div className="w-1/2">
                            <div className="border-t-2 border-black pt-1">
                                <p className="font-semibold text-[10px]">for: Director General KASUPDA</p>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="border-t-2 border-black pt-1">
                                <p className="font-semibold text-[10px]">Signature (Applicant/Representative)</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <h4 className="font-bold text-[10px]">Disclaimer</h4>
                        <p className="leading-snug text-[8px]">This acknowledgement does not in any way validate the authenticity of the documents described above. All documents are subject to further verification for authenticity. This acknowledgement must be presented at the time of collection of the Development Permit. Please notify us of any change of contact address or any other vital information contained in your original application. Contact us directly at:</p>
                    </div>
                    <div className="text-center text-[8px] font-semibold text-black leading-snug pt-1 border-t mt-2">
                        <p>KADUNA STATE URBAN PLANNING AND DEVELOPMENT AUTHORITY, P.M.B. 2142 KADUNA STATE, NIGERIA</p>
                        <p>KASUPDA SERVICE CENTRE NO. 4 BIDA ROAD, SABON GARI, KADUNA TEL 08132389638, info@kasupda.org</p>
                    </div>
                </footer>
            </div>
        </div>
    );
});
LetterToPrint.displayName = "LetterToPrint";


export default function AcknowledgementLetterContent({ applicationData }: { applicationData: StoredApplication }) {
    const router = useRouter();

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Action Buttons are outside the main content wrapper */}
            <div className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-center items-center gap-4 no-print">
                <Button variant="outline" onClick={() => router.push('/dashboard/my-applications')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to My Applications
                </Button>
                 <Button onClick={handlePrint} variant="default">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            </div>
            
            {/* The component that will be printed */}
            <div className="shadow-2xl max-w-4xl mx-auto print:shadow-none">
                 <LetterToPrint applicationData={applicationData} />
            </div>
        </>
    );
}
