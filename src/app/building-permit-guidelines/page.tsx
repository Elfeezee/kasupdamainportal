
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    CheckCircle2,
    MapPin,
    Globe,
    FileText,
    CreditCard,
    Clock,
    Download,
    ExternalLink,
    Info,
    Phone,
    Mail,
    Building2,
    AlertCircle
} from "lucide-react";
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Application Process & Guidelines | KASUPDA',
    description: 'Official comprehensive guidelines for obtaining building permits in Kaduna State.',
};

export default function BuildingPermitGuidelinesPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Header Section */}
            <section className="bg-white border-b py-12 md:py-16 text-center">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-6 leading-tight uppercase tracking-tight">
                        APPLICATION PROCESS AND GUIDELINES FOR OBTAINING BUILDING PERMIT IN KADUNA STATE
                    </h1>
                    <p className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed mb-4">
                        Pursuant to the Kaduna State Urban and Regional Planning Law, 2018, all individuals and organisations
                        intending to undertake any form of land development within Kaduna State shall obtain a Development
                        (Building) Permit through the procedures outlined below:
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-6xl mx-auto space-y-16">

                    {/* STEP 1 */}
                    <div className="flex flex-col md:flex-row gap-0 md:gap-8 group">
                        <div className="md:w-32 shrink-0 flex flex-col items-center">
                            <div className="w-full bg-green-600 text-white font-black text-2xl py-4 flex items-center justify-center rounded-t-lg md:rounded-lg shadow-lg">
                                Step 1
                            </div>
                            <div className="hidden md:block h-full w-1.5 bg-slate-100 mt-2 rounded-full" />
                        </div>
                        <Card className="flex-1 border-2 border-slate-200 shadow-none rounded-none md:rounded-xl">
                            <CardContent className="p-6 md:p-10 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Building Permit Application Channels</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Applicants may commence their building permit application through any of the approved channels outlined below.
                                        Application forms are available <strong>free of charge</strong> at the <strong>Kaduna State Urban Planning and Development Authority (KASUPDA) Headquarters</strong>, located at <strong>No. 4 Bida Road, Kaduna</strong> or Zonal Offices. Alternatively, applicants may download and print the relevant forms online via the links provided below:
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-base mb-3">1. New Building Applications</h4>
                                        <ul className="space-y-4 ml-4">
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                                                <div>
                                                    <p className="font-bold text-sm">Building Permit for Individuals (BPI):</p>
                                                    <Link href="https://kasupda.kdsg.gov.ng/wp-content/uploads/2020/03/Building-Permit-Individual-BPI-v1.1-1.pdf" target="_blank" className="text-blue-600 hover:underline text-sm break-all">
                                                        https://kasupda.kdsg.gov.ng/wp-content/uploads/2020/03/Building-Permit-Individual-BPI-v1.1-1.pdf
                                                    </Link>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                                                <div>
                                                    <p className="font-bold text-sm">Building Permit for Organisations (BPO):</p>
                                                    <Link href="https://kasupda.kdsg.gov.ng/wp-content/uploads/2020/03/Building-Permit-Organization-BPO-v1.1.pdf" target="_blank" className="text-blue-600 hover:underline text-sm break-all">
                                                        https://kasupda.kdsg.gov.ng/wp-content/uploads/2020/03/Building-Permit-Organization-BPO-v1.1.pdf
                                                    </Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-base mb-3">2. Alterations, New Applications, and Renewal of Permits</h4>
                                        <p className="text-sm text-slate-600 mb-3">Applicants may also process applications for <strong>building alterations, new developments</strong>, and <strong>renewal of expired permits</strong> through the official KASUPDA online portal:</p>
                                        <ul className="space-y-4 ml-4">
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                                                <div>
                                                    <p className="font-bold text-sm">KASUPDA Online Portal:</p>
                                                    <Link href="https://kasupda.kdsg.gov.ng" target="_blank" className="text-blue-600 hover:underline text-sm font-bold">
                                                        https://kasupda.kdsg.gov.ng
                                                    </Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 italic mt-6 border-t pt-4">
                                    All completed applications must be submitted with the required supporting documents and will be subject to review in accordance with KASUPDA regulations and development control guidelines.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* STEP 2 */}
                    <div className="flex flex-col md:flex-row gap-0 md:gap-8 group">
                        <div className="md:w-32 shrink-0 flex flex-col items-center">
                            <div className="w-full bg-green-600 text-white font-black text-2xl py-4 flex items-center justify-center rounded-t-lg md:rounded-lg shadow-lg">
                                Step 2
                            </div>
                            <div className="hidden md:block h-full w-1.5 bg-slate-100 mt-2 rounded-full" />
                        </div>
                        <Card className="flex-1 border-2 border-slate-200 shadow-none rounded-none md:rounded-xl">
                            <CardContent className="p-6 md:p-10 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Required Documentation for Building Permit Application</h3>
                                    <p className="text-sm text-slate-600">Applicants are required to prepare and submit copies of the following documents to facilitate the processing of a Building Permit application:</p>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    {/* Item 1 */}
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-base">1. Proof of Land Ownership</h4>
                                        <ul className="ml-6 space-y-2">
                                            <li className="list-disc text-sm">A copy of the <strong>Digital Certificate of Occupancy (C of O)</strong>.</li>
                                            <li className="text-sm italic">Applicants may visit: <Link href="https://www.kadgis.org/application-forms/" className="text-blue-600 underline">https://www.kadgis.org/application-forms/</Link> for guidelines.</li>
                                        </ul>
                                        <div className="bg-slate-50 p-4 border rounded-lg text-sm">
                                            <p className="font-bold mb-2">Note:</p>
                                            <p className="mb-2">Where a Certificate of Occupancy has not yet been issued, applicants may submit any of the following:</p>
                                            <ul className="ml-6 space-y-1">
                                                <li className="list-disc">Right of Occupancy (R of O)</li>
                                                <li className="list-disc">Approval Letter</li>
                                                <li className="list-disc">Acknowledgement Letter</li>
                                            </ul>
                                            <p className="mt-2 text-slate-700">Such submissions must be accompanied by <strong>evidence of payment</strong> (Premium or Approval fees). However, this may result in delays in processing until the C of O is made available.</p>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">2. Architectural Drawings</h4>
                                        <ul className="ml-6 space-y-2">
                                            <li className="list-disc text-sm">Two (2) copies of <strong>A3-sized architectural working drawings and details</strong>, duly <strong>sealed, stamped, and endorsed</strong> by a registered Architect (applicable to all developments).</li>
                                        </ul>
                                        <div className="ml-6 space-y-1">
                                            <p className="font-bold text-sm">Additional Requirement:</p>
                                            <ul className="ml-6 space-y-1">
                                                <li className="list-disc text-sm">The <strong>ARCON Project Registration Number (APRN)</strong> must be indicated on each drawing sheet.</li>
                                                <li className="list-disc text-sm">A copy of the Architect's <strong>current professional practice license</strong> must be attached.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">3. Site Analysis Report</h4>
                                        <ul className="ml-6 space-y-2">
                                            <li className="list-disc text-sm">A <strong>Site Analysis Report</strong> prepared by consultants registered with KASUPDA.</li>
                                            <li className="list-disc text-sm">The report must include a <strong>clear satellite image</strong> and be <strong>sealed, stamped, and endorsed</strong> by a <strong>TOPREC-registered Town Planner</strong> (applicable to all developments).</li>
                                        </ul>
                                    </div>

                                    {/* Item 4 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">4. Mechanical and Electrical Drawings</h4>
                                        <ul className="ml-6 space-y-2">
                                            <li className="list-disc text-sm">One (1) hard copy and one (1) soft copy (CD) of <strong>A3-sized mechanical and electrical drawings</strong>, duly <strong>sealed, stamped, and endorsed</strong> by a <strong>COREN-registered Mechanical/Electrical Engineer</strong> (applicable to all developments).</li>
                                        </ul>
                                    </div>

                                    {/* Item 5 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">5. Structural Drawings</h4>
                                        <ul className="ml-6 space-y-2">
                                            <li className="list-disc text-sm">Two (2) copies of <strong>A3-sized structural working drawings and details</strong>, duly <strong>sealed, stamped, and endorsed</strong> by a qualified Engineer.</li>
                                            <li>
                                                <p className="font-bold text-sm mb-1">Applicable to:</p>
                                                <ul className="ml-6 space-y-0.5 text-sm">
                                                    <li className="list-disc">Storey buildings</li>
                                                    <li className="list-disc">Warehouses</li>
                                                    <li className="list-disc">Petrol/Gas stations</li>
                                                    <li className="list-disc">Other developments with special structural requirements</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Item 6 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">6. Structural Calculations and Attestation</h4>
                                        <ul className="ml-6 space-y-2 text-sm">
                                            <li className="list-disc">Structural calculation sheets and a <strong>letter of attestation of design</strong>, duly <strong>sealed, stamped, and endorsed</strong> by a <strong>COREN-registered Structural Engineer</strong> (for developments listed above).</li>
                                        </ul>
                                    </div>

                                    {/* Item 7 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">7. Soil Investigation Report</h4>
                                        <ul className="ml-6 space-y-2 text-sm">
                                            <li className="list-disc">Required for <strong>multi-storey developments exceeding three (3) floors</strong>.</li>
                                        </ul>
                                    </div>

                                    {/* Item 8 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">8. Environmental Impact Assessment (EIA)</h4>
                                        <ul className="ml-6 space-y-2">
                                            <li className="list-disc text-sm">Approval certificate issued by <strong>Kaduna State Environmental Protection Authority (KEPA)</strong>.</li>
                                            <li>
                                                <p className="font-bold text-sm mb-1">Applicable to:</p>
                                                <ul className="ml-6 space-y-0.5 text-sm grid md:grid-cols-2">
                                                    <li className="list-disc">Agricultural developments</li>
                                                    <li className="list-disc">Petrol/Gas stations</li>
                                                    <li className="list-disc">Commercial and industrial developments</li>
                                                    <li className="list-disc">Mass housing projects</li>
                                                    <li className="list-disc">Multi-storey residential developments</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Item 9 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">9. Feasibility/Viability Report</h4>
                                        <ul className="ml-6 space-y-2">
                                            <li className="list-disc text-sm">Prepared by consultants registered with KASUPDA.</li>
                                            <li>
                                                <p className="font-bold text-sm mb-1">Applicable to:</p>
                                                <ul className="ml-6 space-y-0.5 text-sm grid md:grid-cols-2">
                                                    <li className="list-disc">Mass housing</li>
                                                    <li className="list-disc">Agricultural developments</li>
                                                    <li className="list-disc">Petrol/Gas stations</li>
                                                    <li className="list-disc">Commercial and industrial projects</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Item 10 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">10. Tax Documentation</h4>
                                        <ul className="ml-6 space-y-2 text-sm">
                                            <li className="list-disc">Valid <strong>Tax Clearance Certificate (TCC)</strong> or <strong>Tax Identification Number (TIN)</strong>.</li>
                                            <li>Registration can be completed via: <Link href="https://mytax.kadirs.kdsg.gov.ng/register" className="text-blue-600 underline">https://mytax.kadirs.kdsg.gov.ng/register</Link></li>
                                        </ul>
                                    </div>

                                    {/* Item 11 */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-base">11. Service Agency Approvals</h4>
                                        <ul className="ml-6 space-y-2 text-sm">
                                            <li className="list-disc"><strong>Fire Service Report</strong> – obtainable from any Fire Service Department in Kaduna State.</li>
                                            <li className="list-disc"><strong>Police Report</strong> – obtainable from any Police Station within the State.</li>
                                            <li>
                                                <p className="font-bold text-sm mb-1 uppercase text-xs tracking-wider opacity-60">Applicable to:</p>
                                                <ul className="ml-6 space-y-0.5 mt-1">
                                                    <li className="list-disc">Petrol/Gas stations</li>
                                                    <li className="list-disc">Hotels</li>
                                                    <li className="list-disc">Multi-storey developments exceeding four (4) floors</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Item 12-16 */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-base">12. Applicant Identification</h4>
                                            <ul className="ml-6 space-y-1 text-sm">
                                                <li className="list-disc"><strong>For Individuals (BPI):</strong> Recent passport-sized photograph</li>
                                                <li className="list-disc"><strong>For Organisations (BPO):</strong> Company seal or stamp on the application form</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-base">13. District Head Confirmation</h4>
                                            <ul className="ml-6 space-y-1 text-sm">
                                                <li className="list-disc">Required for developments located within <strong>unplanned layouts</strong>.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-base">14. Proof of Address</h4>
                                            <ul className="ml-6 space-y-1 text-sm">
                                                <li className="list-disc">Recent <strong>utility bill</strong> or <strong>bank statement</strong> reflecting the same address as provided in the application form.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-base">15. Valid Means of Identification</h4>
                                            <p className="text-xs font-bold mb-1 opacity-60">Accepted identification documents include:</p>
                                            <ul className="ml-6 space-y-0.5 text-sm grid grid-cols-2">
                                                <li className="list-disc">International Passport</li>
                                                <li className="list-disc">National Identification Card</li>
                                                <li className="list-disc">Driver's License</li>
                                                <li className="list-disc">Voter Registration Card</li>
                                                <li className="list-disc">Tax Identification Card</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3 border-t pt-6">
                                        <h4 className="font-bold text-base">16. Completed Application Form</h4>
                                        <ul className="ml-6 space-y-1 text-sm">
                                            <li className="list-disc">A duly completed <strong>Building Permit Application Form (BPI/BPO)</strong>.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-slate-100 p-4 rounded-lg flex gap-3 text-xs leading-relaxed text-slate-700 font-bold uppercase tracking-tight">
                                    <AlertCircle className="w-5 h-5 text-slate-900 shrink-0" />
                                    <span>Note: All documents must be complete, properly endorsed, and submitted in the required format to avoid delays in processing.</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* STEP 3 */}
                    <div className="flex flex-col md:flex-row gap-0 md:gap-8 group">
                        <div className="md:w-32 shrink-0 flex flex-col items-center">
                            <div className="w-full bg-green-600 text-white font-black text-2xl py-4 flex items-center justify-center rounded-t-lg md:rounded-lg shadow-lg">
                                Step 3
                            </div>
                            <div className="hidden md:block h-full w-1.5 bg-slate-100 mt-2 rounded-full" />
                        </div>
                        <Card className="flex-1 border-2 border-slate-200 shadow-none rounded-none md:rounded-xl">
                            <CardContent className="p-6 md:p-10 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Submission of Application Form</h3>
                                    <p className="text-sm text-slate-600">Applicants may submit their Building Permit Application through either <strong>manual (physical)</strong> or <strong>electronic (online)</strong> channels, as outlined below:</p>
                                </div>

                                <div className="space-y-8">
                                    {/* Manual Submission */}
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-base border-b pb-1">1. Manual Submission</h4>
                                        <p className="text-sm">Applicants are required to:</p>
                                        <ul className="ml-6 space-y-6">
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                                                <div>
                                                    <p className="text-sm mb-2 font-bold uppercase tracking-tight">Pay the applicable processing fee using any of the approved payment channels:</p>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="font-bold text-xs mb-1 opacity-60">Processing Fees:</p>
                                                            <ul className="ml-6 text-sm grid grid-cols-1 md:grid-cols-2 gap-1 uppercase font-bold text-slate-800">
                                                                <li className="flex justify-between md:block">Individuals: <span className="text-green-600">₦10,000</span></li>
                                                                <li className="flex justify-between md:block">Individuals (Express Service): <span className="text-green-600">₦50,000</span></li>
                                                                <li className="flex justify-between md:block">Companies/Organisations: <span className="text-green-600">₦20,000</span></li>
                                                                <li className="flex justify-between md:block">Companies/Organisations (Express Service): <span className="text-green-600">₦100,000</span></li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-xs mb-1 opacity-60">Payment Channels:</p>
                                                            <ul className="ml-6 text-sm space-y-1">
                                                                <li className="list-disc">Any commercial bank within Kaduna State via the <strong>KASUPDA PayDirect Account</strong> or <strong>OSoft Platform</strong></li>
                                                                <li className="list-disc">KASUPDA Customer Service Units (HQ or Zonal Offices) via <strong>POS payment</strong> (Debit/Credit Card)</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold uppercase tracking-tight">Submit the duly completed Application Form at the KASUPDA Customer Service Unit (Headquarters or any Zonal Office), together with:</p>
                                                    <ul className="ml-6 mt-2 text-sm space-y-1">
                                                        <li className="list-circle">Evidence of payment (Application Processing Fee)</li>
                                                        <li className="list-circle">All required supporting documents as outlined in <strong>Step 2 (Documentation Requirements)</strong></li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Electronic Submission */}
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-base border-b pb-1">2. Electronic (Online) Submission</h4>
                                        <p className="text-sm">Applicants may alternatively process their applications online by:</p>
                                        <ul className="ml-6 space-y-4">
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold mb-1">Making payment via the KASUPDA e-Payment Platform:</p>
                                                    <Link href="https://kasupda.kdsg.gov.ng/e-payment/" target="_blank" className="text-blue-600 hover:underline text-sm break-all font-bold">
                                                        https://kasupda.kdsg.gov.ng/e-payment/
                                                    </Link>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold mb-1">Completing the application form and uploading all required documents via:</p>
                                                    <Link href="https://kasupda.kdsg.gov.ng/create-application/" target="_blank" className="text-blue-600 hover:underline text-sm break-all font-bold">
                                                        https://kasupda.kdsg.gov.ng/create-application/
                                                    </Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Confirmation */}
                                    <div className="space-y-4 bg-slate-50 p-6 rounded-xl border-l-4 border-green-600">
                                        <h4 className="font-bold text-base">3. Confirmation of Application</h4>
                                        <p className="text-sm italic">Upon successful submission of the application:</p>
                                        <ul className="ml-6 space-y-4">
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                                                <p className="text-sm">Applicants will be issued an <strong>Acknowledgement Letter</strong></p>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                                                <div>
                                                    <p className="text-sm">The letter will contain a <strong>Building Permit Identification (BPI) Number</strong>, which serves as:</p>
                                                    <ul className="ml-6 mt-1 text-sm space-y-0.5 font-bold">
                                                        <li className="list-circle">A unique application reference number, and</li>
                                                        <li className="list-circle">The official file number for tracking and processing the application</li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="mt-4 p-3 bg-white border rounded shadow-sm">
                                            <p className="text-xs font-bold uppercase opacity-60">Note:</p>
                                            <p className="text-xs font-bold">Applicants are advised to retain the Acknowledgement Letter and BPI Number for all future correspondence and status tracking.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* STEP 4 */}
                    <div className="flex flex-col md:flex-row gap-0 md:gap-8 group pb-12">
                        <div className="md:w-32 shrink-0 flex flex-col items-center">
                            <div className="w-full bg-green-600 text-white font-black text-2xl py-4 flex items-center justify-center rounded-t-lg md:rounded-lg shadow-lg">
                                Step 4
                            </div>
                        </div>
                        <Card className="flex-1 border-2 border-slate-200 shadow-none rounded-none md:rounded-xl">
                            <CardContent className="p-6 md:p-10 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Collection of Building Permit Certificate</h3>
                                    <p className="text-sm text-slate-600">Upon successful processing and approval of an application, the following procedures shall apply:</p>
                                </div>

                                <div className="space-y-8">
                                    <ul className="space-y-8">
                                        {/* Item 1 */}
                                        <li className="flex gap-4">
                                            <div className="w-2 md:w-4 h-2 md:h-4 rounded-full bg-slate-900 mt-1 md:mt-2 shrink-0" />
                                            <div className="space-y-1">
                                                <p className="font-bold text-sm uppercase tracking-tight">Notification of Approval:</p>
                                                <p className="text-sm leading-relaxed">Successful applicants will be notified within <strong>5-10 working days</strong> via <strong>SMS, telephone call, or email</strong>, and will be required to proceed with payment of the assessed <strong>Building Plan Processing Fees</strong>.</p>
                                            </div>
                                        </li>

                                        {/* Item 2 */}
                                        <li className="flex gap-4">
                                            <div className="w-2 md:w-4 h-2 md:h-4 rounded-full bg-slate-900 mt-1 md:mt-2 shrink-0" />
                                            <div className="space-y-2">
                                                <p className="font-bold text-sm uppercase tracking-tight">Assessment of Fees:</p>
                                                <p className="text-sm leading-relaxed">Building Plan Processing Fees are assessed based on the <strong>size, location, and proposed use</strong> of the development, in accordance with <strong>Part III of the Annex Schedule of the Kaduna State Tax Codification and Consolidation Law, 2020 (Pages 104-107)</strong>.</p>
                                                <Link href="https://kadirs.kdsg.gov.ng/index.php/download/tax-codification-and-consolidation-law-2020/" className="text-xs text-blue-600 block italic underline">
                                                    Reference: https://kadirs.kdsg.gov.ng/index.php/download/tax-codification-and-consolidation-law-2020/
                                                </Link>
                                            </div>
                                        </li>

                                        {/* Item 3 */}
                                        <li className="flex gap-4">
                                            <div className="w-2 md:w-4 h-2 md:h-4 rounded-full bg-slate-900 mt-1 md:mt-2 shrink-0" />
                                            <div className="space-y-2">
                                                <p className="font-bold text-sm uppercase tracking-tight">Payment of Fees:</p>
                                                <p className="text-sm leading-relaxed">Payment may be made through any of the following approved channels:</p>
                                                <ul className="ml-6 space-y-1 text-sm font-bold opacity-80">
                                                    <li className="list-circle font-bold">Any commercial bank into the <strong>Kaduna State Treasury Single Account (TSA)</strong></li>
                                                    <li className="list-circle">POS terminals at <strong>KASUPDA (PayDirect / OSoft Platform)</strong></li>
                                                    <li className="list-circle italic">Online via the KASUPDA e-payment portal: <Link href="https://kasupda.kdsg.gov.ng/e-payment/" className="underline">https://kasupda.kdsg.gov.ng/e-payment/</Link></li>
                                                </ul>
                                            </div>
                                        </li>

                                        {/* Item 4 */}
                                        <li className="flex gap-4">
                                            <div className="w-2 md:w-4 h-2 md:h-4 rounded-full bg-slate-900 mt-1 md:mt-2 shrink-0" />
                                            <div className="space-y-1">
                                                <p className="font-bold text-sm uppercase tracking-tight">Collection of Certificate:</p>
                                                <p className="text-sm">Upon payment, applicants are required to:</p>
                                                <ul className="ml-6 space-y-1 text-sm font-bold">
                                                    <li className="list-circle">Present <strong>evidence of payment</strong>, and</li>
                                                    <li className="list-circle">Proceed to collect the <strong>Building Permit Certificate</strong> from the designated KASUPDA office.</li>
                                                </ul>
                                            </div>
                                        </li>

                                        {/* Item 5 */}
                                        <li className="flex gap-4 border-t pt-8">
                                            <div className="w-2 md:w-4 h-2 md:h-4 rounded-full bg-slate-900 mt-1 md:mt-2 shrink-0" />
                                            <div className="space-y-3 w-full">
                                                <p className="font-bold text-sm uppercase tracking-tight">Enquiries and Follow-Up:</p>
                                                <p className="text-sm">Applicants who do not receive notification of application status within <strong>three (3) working days</strong> after submission are advised to contact:</p>
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <div className="p-4 bg-slate-50 border rounded-xl flex flex-col items-center text-center gap-2">
                                                        <MapPin className="w-5 h-5 text-green-600" />
                                                        <p className="text-[11px] font-bold">KASUPDA Customer Service Unit<br />No. 4 Bida Road, Kaduna</p>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 border rounded-xl flex flex-col items-center text-center gap-2">
                                                        <Mail className="w-5 h-5 text-green-600" />
                                                        <Link href="mailto:kasupda@kdsg.gov.ng" className="text-[11px] font-bold underline">kasupda@kdsg.gov.ng</Link>
                                                    </div>
                                                    <div className="p-4 bg-slate-50 border rounded-xl flex flex-col items-center text-center gap-2">
                                                        <Phone className="w-5 h-5 text-green-600" />
                                                        <p className="text-[11px] font-bold">Phone: +234 912 500 2126</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-slate-900 text-white p-5 rounded-xl text-xs font-bold uppercase tracking-widest text-center">
                                    Note: Applicants are advised to promptly complete payment and collection processes to avoid delays in project commencement.
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
