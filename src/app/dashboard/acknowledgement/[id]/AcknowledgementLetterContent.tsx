
'use client';

import React from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

// A mapping of database field names to user-friendly document labels
const documentChecklistMap: Record<string, string> = {
    // Standard application docs
    'doc_application_form_url': 'Application Form',
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
    'doc_soil_investigation_report_url': 'Soil Investigation Report',
    'doc_soil_investigation_url': 'Soil Investigation',
    'doc_site_plan_url': 'Site Plan',
    'doc_imagery_sketch_url': 'Imagery & Sketch of Site',
    'doc_site_location_installation_coordinates_url': 'Site Location & Coordinates',
    'doc_site_location_type_url': 'Site Location Type',
    'doc_image_showing_site_url': 'Image Showing Site',

    // Drawings & Technical
    'doc_architectural_works_drawings_url': 'Architectural Works Drawings and Details',
    'doc_mechanical_works_drawings_url': 'Mechanical Works Drawings and Details',
    'doc_electrical_works_drawings_url': 'Electrical Works Drawings and Details',
    'doc_structural_drawings_url': 'Structural Drawings and Details',
    'doc_structural_work_drawings_url': 'Structural Work Drawings',
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
    'doc_kepa_eia_approval_url': 'KEPA EIA Approval',
    'doc_kepas_env_impact_assessment_url': "KEPA's Environment Impact Assessment",
    'doc_police_report_url': 'Police Report',
    'doc_fire_service_report_url': 'Fire Service Report',
    'doc_kasupda_license_url': 'KASUPDA License to Practice',
    'doc_corporate_arcon_license_url': 'Corporate ARCON License',
    'doc_tax_clearance_url': 'Tax Clearance Certificate',

    // Agreements & Letters
    'doc_consent_letter_url': 'Consent/Introduction Letter',
    'doc_lease_agreement_letter_url': 'Lease Agreement Letter',
    'doc_lease_agreement_url': 'Lease Agreement',
    'doc_power_of_attorney_url': 'Power of Attorney',
    'doc_proof_of_outright_purchase_url': 'Proof of Outright Purchase',
    'doc_letter_of_attestation_url': 'Letter of Attestation of Design',

    // Utilities & Approvals
    'doc_quality_assurance_url': 'Clearance From Quality Assurance',
    'doc_nama_approval_url': 'NAMA Approval',
    'doc_ncaa_approval_url': 'NCAA Approval',
    'doc_permit_url': 'Permit Document',
    'doc_co_url': 'C of O',
    'doc_building_permit_url': 'Building Permit',
};


const DetailItem = ({ label, value }: { label: string; value: string | null | undefined; }) => (
    <div className="flex text-xs">
        <p className="w-28 shrink-0 font-semibold">{label}:</p>
        <p>{value || 'N/A'}</p>
    </div>
);

const LetterToPrint = React.forwardRef<HTMLDivElement, { applicationData: StoredApplication }>(({ applicationData }, ref) => {
    // Flatten the data object
    const { data, ...rest } = applicationData;
    const flattenedData = { ...rest, ...(typeof data === 'object' && data !== null ? data : {}) };

    const isDinApp = flattenedData.type === 'DIN Application';
    const applicationId = flattenedData.original_permit_id || flattenedData.din || `KSP${String(flattenedData.id).padStart(3, '0')}`;
    const applicantName = flattenedData.applicant_name;
    const submissionDate = flattenedData.created_at ? format(parseISO(flattenedData.created_at), 'dd-MMM-yyyy') : 'N/A';

    // DIN specific fields or fallbacks
    const applicantAddress = isDinApp
        ? flattenedData.applicantAddress
        : [flattenedData.app_house_no, flattenedData.app_street_name, flattenedData.app_district, flattenedData.app_city_town, flattenedData.app_state].filter(Boolean).join(', ');

    const plotAddress = isDinApp
        ? flattenedData.plotAddress
        : (flattenedData.plot_description_address || flattenedData.plot_address || 'N/A');

    const representativeName = [flattenedData.rep_first_name, flattenedData.rep_middle_name, flattenedData.rep_surname].filter(Boolean).join(' ');
    const developmentDescription = flattenedData.land_use || flattenedData.type?.replace(/ permit/i, '').replace(/\(.*\)/i, '').trim();

    const receivedDocuments = Object.keys(flattenedData)
        .filter(key => key.endsWith('_url') && flattenedData[key] && documentChecklistMap[key])
        .map(key => documentChecklistMap[key]);

    const qrValue = JSON.stringify({
        id: applicationId,
        name: applicantName,
        date: submissionDate,
        type: flattenedData.type
    });

    if (isDinApp) {
        return (
            <div ref={ref} id="letter-to-print" className="bg-white text-black flex flex-col min-h-[1050px] p-0 relative print:min-h-full border-[18px] border-[#2F5233] shadow-2xl overflow-hidden mx-auto max-w-[800px]">
                {/* Inner decorative border */}
                <div className="absolute inset-3 border-2 border-[#2F5233]/20 pointer-events-none z-0" />

                {/* Watermark/Pending State Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                    <Image src="/image/logo.png" alt="KASUPDA Watermark" width={500} height={500} className="opacity-[0.04] grayscale scale-110" />
                    {applicationData.status !== 'Approved' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-50 pointer-events-auto">
                            <div className="text-center p-8 border-4 border-dashed border-slate-200 rounded-3xl max-w-sm">
                                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Verification in Progress</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    Your official DIN certificate is currently being processed. You will be notified once the Authority has verified and approved your application.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative z-10 flex flex-col flex-grow p-12">
                    {/* QR Code and Logo Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="w-24 h-24 relative">
                            <Image src="/image/logo.png" alt="KASUPDA Logo" width={96} height={96} className="object-contain" />
                        </div>
                        <div className="text-center flex-1 mt-2">
                            <h2 className="text-sm font-extrabold text-[#2F5233] tracking-widest uppercase mt-1">KADUNA STATE URBAN PLANNING AND DEVELOPMENT AUTHORITY</h2>
                            <h3 className="text-xs font-bold text-slate-700 tracking-normal uppercase">(KASUPDA)</h3>
                        </div>
                        <div className="bg-white p-2 border-2 border-slate-100 rounded-lg shadow-sm">
                            <QRCodeSVG value={qrValue} size={100} level="H" />
                        </div>
                    </div>

                    <div className="flex-grow space-y-10">
                        {/* Title Section */}
                        <div className="text-center space-y-2 py-4 border-y border-slate-100/50">
                            <p className="text-[10px] font-bold text-[#2F5233] uppercase tracking-[0.3em]">DEVELOPMENT IDENTIFICATION NUMBER (DIN)</p>
                            <div className="bg-[#2F5233]/5 border-2 border-[#2F5233]/10 py-4 px-12 rounded-2xl inline-block group">
                                <h4 className="text-5xl font-black text-[#2F5233] tracking-[0.1em] drop-shadow-sm">
                                    {flattenedData.din || 'DIN-800271-PENDING'}
                                </h4>
                            </div>
                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-2 gap-x-16 gap-y-12">
                            {/* Left Column: Applicant & Property */}
                            <div className="space-y-10">
                                <section>
                                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="h-[1px] flex-1 bg-slate-100" />
                                        APPLICANT INFORMATION
                                    </h5>
                                    <div className="space-y-1.5 pl-2 border-l-2 border-[#2F5233]/20">
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{applicantName}</p>
                                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[280px]">
                                            {applicantAddress}
                                        </p>
                                    </div>
                                </section>

                                <section>
                                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="h-[1px] flex-1 bg-slate-100" />
                                        PROPERTY INFORMATION
                                    </h5>
                                    <div className="space-y-2 pl-2 border-l-2 border-[#2F5233]/20">
                                        <div>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Plot Description</p>
                                            <p className="text-[11px] text-slate-700 font-bold leading-relaxed">
                                                {plotAddress}
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Application Details */}
                            <div className="space-y-10">
                                <section>
                                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="h-[1px] flex-1 bg-slate-100" />
                                        APPLICATION DETAILS
                                    </h5>
                                    <div className="space-y-4 pl-2">
                                        <div className="flex justify-between items-end border-b border-dashed border-slate-200 pb-1">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">KBP NUMBER:</span>
                                            <span className="text-xs font-black text-[#2F5233]">{flattenedData.kbpNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-dashed border-slate-200 pb-1">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">KDL NUMBER:</span>
                                            <span className="text-xs font-black text-[#2F5233]">{flattenedData.kdlNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-dashed border-slate-200 pb-1">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">DATE ISSUED:</span>
                                            <span className="text-xs font-black text-slate-900">{submissionDate}</span>
                                        </div>
                                    </div>
                                </section>

                                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                    <div className="bg-[#2F5233] p-1.5 rounded-md text-white">
                                        <Image src="/image/logo.png" alt="Icon" width={16} height={16} className="invert brightness-0" />
                                    </div>
                                    <p className="text-[9px] leading-relaxed text-slate-600 font-medium italic">
                                        This DIN is a mandatory requirement for all development. Please quote this number in all future correspondences.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <footer className="mt-16 pt-10 border-t-2 border-slate-50 flex flex-col items-center">
                        <div className="flex justify-between items-center w-full mb-12 px-4">
                            <div className="text-center space-y-1 flex flex-col items-center">
                                <div className="h-10 w-40 relative">
                                    {/* Placeholder for Signature */}
                                    <div className="absolute bottom-0 w-full border-b border-slate-900" />
                                </div>
                                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest pt-2 italic">DIRECTOR GENERAL, KASUPDA</p>
                            </div>

                            <div className="relative group flex flex-col items-center">
                                <div className="absolute inset-0 bg-[#2F5233]/5 rounded-full blur-xl group-hover:bg-[#2F5233]/10 transition-all opacity-0" />
                                <div className="w-20 h-20 border-2 border-[#2F5233]/20 rounded-full flex items-center justify-center p-2 relative z-10">
                                    <Image src="/image/logo.png" alt="Official Seal" width={64} height={64} className="opacity-20 grayscale brightness-75" />
                                </div>
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">OFFICIAL DIGITAL SEAL</p>
                            </div>
                        </div>

                        <div className="w-full bg-[#2F5233] text-white py-3 px-8 rounded-xl flex justify-between items-center text-[9px] font-black tracking-[0.2em] uppercase shadow-lg shadow-[#2F5233]/20">
                            <span>KADUNA STATE URBAN PLANNING AND DEVELOPMENT AUTHORITY</span>
                            <div className="h-4 w-[1px] bg-white/20" />
                            <span>WWW.KASUPDA.KDSG.GOV.NG</span>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }

    // Default layout for other applications
    return (
        <div ref={ref} id="letter-to-print" className="bg-white dark:bg-card text-black flex flex-col min-h-[1050px] p-8 relative print:min-h-full">

            <div className="absolute inset-0 flex items-center justify-center z-0 print:block">
                <Image src="/image/logo.png" alt="KASUPDA Watermark" width={300} height={300} className="w-2/3 h-2/3 object-contain opacity-5 pointer-events-none" />
            </div>

            {/* QR Code positioned at top right */}
            <div className="absolute top-8 right-8 z-20 bg-white p-1 border border-slate-200 rounded">
                <QRCodeSVG value={qrValue} size={70} />
            </div>

            <div className="relative z-10 flex flex-col flex-grow">
                <header className="pb-2 mb-2 text-center relative">
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
                        <p>This is to acknowledge the receipt of the application for a new development permit via a KADGIS Acknowledgement Letter, over a property located in District/Area {flattenedData.plot_district || '[District not provided]'} of {flattenedData.plot_lga || '[LGA not provided]'} LGA more accurately described as {plotAddress}.</p>
                        <p>Description of the Development: {developmentDescription}</p>
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
                    <div className="pt-4 space-y-2">
                        <h4 className="font-bold text-base text-red-400">Disclaimer: Please note that this acknowledgement;</h4>
                        <div className="leading-snug text-sm space-y-1 text-red-400 font-bold">
                            <p>i. does not constitute an approval or permit for development.</p>
                            <p>ii. does not in any way validate the authenticity of the documents submitted, as all documents are subject to further verification for authenticity.</p>
                            <p>iii. dust be presented at the time of collection of the Development Permit.</p>
                            <p>iv. applicants are required to promptly notify the Authority of any change in contact address or other vital information contained in the original application.</p>
                        </div>
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
                <Button onClick={handlePrint} variant="default" className={applicationData.status === 'Approved' ? "bg-green-600 hover:bg-green-700" : ""}>
                    <Download className="mr-2 h-4 w-4" />
                    {applicationData.status === 'Approved' ? 'Download Official Certificate' : 'Download PDF Acknowledgement'}
                </Button>
            </div>

            {/* The component that will be printed */}
            <div className="shadow-2xl max-w-4xl mx-auto print:shadow-none">
                <LetterToPrint applicationData={applicationData} />
            </div>
        </>
    );
}
