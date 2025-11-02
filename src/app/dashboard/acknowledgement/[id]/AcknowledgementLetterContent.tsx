
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import AcknowledgementActions from './AcknowledgementActions';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';


// A mapping of database field names to user-friendly document labels
const documentChecklistMap: Record<string, string> = {
    // Standard application docs
    'doc_application_form_url': 'Application Form', // Assuming one might exist
    'doc_receipt_url': 'Receipt',

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
    <div>
        <p className="text-sm"><span className="font-semibold">{label}:</span> {value || 'N/A'}</p>
    </div>
);


export default function AcknowledgementLetterContent({ applicationData }: { applicationData: StoredApplication }) {
    const letterRef = useRef<HTMLDivElement>(null);
    
    const applicationId = applicationData.original_permit_id || applicationData.din || applicationData.id;
    const applicantName = applicationData.applicant_name;
    const submissionDate = applicationData.created_at ? format(parseISO(applicationData.created_at), 'MMMM d, yyyy') : 'N/A';
    const representativeName = [applicationData.rep_first_name, applicationData.rep_middle_name, applicationData.rep_surname].filter(Boolean).join(' ');

    const receivedDocuments = Object.keys(applicationData)
        .filter(key => key.endsWith('_url') && applicationData[key] && documentChecklistMap[key])
        .map(key => documentChecklistMap[key]);


    return (
        <>
            <div ref={letterRef} className="bg-white dark:bg-card print:bg-white shadow-2xl print:shadow-none max-w-4xl mx-auto font-serif text-black flex flex-col min-h-[1122px] p-12">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center z-0 print:block">
                    <Image src="/image/logo.png" alt="KASUPDA Watermark" width={300} height={300} className="w-2/3 h-2/3 object-contain opacity-5 pointer-events-none" />
                </div>
                
                <div className="relative z-10 flex flex-col flex-grow">
                     <header className="pb-4 mb-4 border-b-4 border-primary">
                        <div className="flex items-center justify-between gap-4">
                            <Image src="/image/logo.png" alt="KASUPDA Logo" width={64} height={64} className="h-16 w-16" />
                            <div className="text-right">
                                <h2 className="text-2xl font-bold text-primary tracking-wide">KADUNA STATE URBAN PLANNING AND DEVELOPMENT AUTHORITY</h2>
                                <p className="text-sm text-gray-600">No 4 Bida Road, Business District Area, Kaduna State</p>
                                <p className="text-sm text-gray-600">Hotline: 09037236253</p>
                            </div>
                        </div>
                    </header>
                    
                    <main className="flex-grow">
                        <div className="space-y-1 text-sm my-6">
                            <DetailItem label="Application ID" value={applicationId} />
                            <DetailItem label="Applicant Name" value={applicantName} />
                            {representativeName && <DetailItem label="Representative Name" value={representativeName} />}
                            <DetailItem label="Application Date" value={submissionDate} />
                        </div>

                        <div className="text-center my-6">
                            <h2 className="text-xl font-bold underline tracking-wider">ACKNOWLEDGEMENT OF APPLICATION</h2>
                        </div>
                        
                        <div className="space-y-4 text-base leading-relaxed">
                             <p>Dear {applicantName || 'Applicant'},</p>
                            <p>This letter confirms we have received your application for a <strong>{applicationData.type}</strong>. Your unique Application ID is <strong>{applicationId}</strong>. Our team will now review your submission and you will be notified of any updates via your dashboard. Please use your Application ID for all future correspondence.</p>
                        </div>

                        {receivedDocuments.length > 0 && (
                            <div className="pt-6 mt-6 border-t">
                                <h3 className="text-base font-semibold mb-3">The following documents were received:</h3>
                                <ul className="space-y-1.5 list-disc list-inside text-sm">
                                    {receivedDocuments.map(docName => (
                                        <li key={docName}>
                                            <span>{docName}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </main>

                     <footer className="text-xs text-gray-700 space-y-4 pt-6 mt-auto border-t">
                        <div className="flex justify-between items-start gap-8">
                            <div className="w-1/2">
                                <div className="border-t-2 border-gray-400 pt-2">
                                    <p className="font-semibold">for: Director General KASUPDA</p>
                                </div>
                            </div>
                            <div className="w-1/2">
                                <div className="border-t-2 border-gray-400 pt-2">
                                    <p className="font-semibold">Signature (Applicant/Representative)</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-1 text-sm">Disclaimer</h4>
                            <p className="leading-snug text-xs">This acknowledgement does not validate the authenticity of the documents. All submissions are subject to verification. This letter must be presented when collecting the Development Permit. Please notify us of any change of contact address.</p>
                        </div>
                         <div className="text-center text-[10px] font-semibold text-gray-600 leading-snug pt-2 border-t">
                            <p>KADUNA STATE URBAN PLANNING AND DEVELOPMENT AUTHORITY, P.M.B. 2142 KADUNA STATE, NIGERIA</p>
                            <p>KASUPDA SERVICE CENTRE NO. 4 BIDA ROAD, SABON GARI, KADUNA TEL 08132389638, info@kasupda.org</p>
                        </div>
                    </footer>
                </div>
            </div>
            <AcknowledgementActions letterRef={letterRef} />
        </>
    );
}
