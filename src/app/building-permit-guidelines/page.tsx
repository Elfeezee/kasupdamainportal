
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
    ChevronRight,
    Info,
    Building,
    Users,
    Briefcase
} from "lucide-react";
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Application Process & Guidelines | KASUPDA',
    description: 'Official steps and guidelines for obtaining building permits in Kaduna State.',
};

const steps = [
    {
        number: 1,
        title: "Building Permit Application Channels",
        icon: <MapPin className="w-6 h-6" />,
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">Applicants may commence their building permit application through any of the approved channels outlined below.</p>

                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary" /> Physical Channels
                    </h4>
                    <p className="text-sm">Application forms are available <strong>free of charge</strong> at the <strong>Kaduna State Urban Planning and Development Authority (KASUPDA) Headquarters</strong>, located at No. 4 Bida Road, Kaduna or Zonal Offices.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Download className="w-4 h-4 text-primary" /> Downloadable Forms
                        </h4>
                        <div className="space-y-2">
                            <Link
                                href="https://kasupda.kdsg.gov.ng/wp-content/uploads/2020/03/Building-Permit-Individual-BPI-v1.1-1.pdf"
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-primary hover:underline transition-all"
                            >
                                <FileText className="w-4 h-4" /> Building Permit for Individuals (BPI)
                            </Link>
                            <Link
                                href="https://kasupda.kdsg.gov.ng/wp-content/uploads/2020/03/Building-Permit-Organization-BPO-v1.1.pdf"
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-primary hover:underline transition-all"
                            >
                                <Briefcase className="w-4 h-4" /> Building Permit for Organizations (BPO)
                            </Link>
                        </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" /> Online Portal
                        </h4>
                        <div className="space-y-2">
                            <p className="text-sm">For alterations, new developments, and renewal of permits:</p>
                            <Link
                                href="https://kasupda.kdsg.gov.ng"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                            >
                                KASUPDA Online Portal <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground italic">All completed applications must be submitted with the required supporting documents and will be subject to review in accordance with KASUPDA regulations.</p>
            </div>
        )
    },
    {
        number: 2,
        title: "Required Documentation",
        icon: <FileText className="w-6 h-6" />,
        content: (
            <div className="space-y-6">
                <p className="text-muted-foreground">Applicants are required to prepare and submit copies of the following documents to facilitate processing:</p>

                <div className="grid gap-4 md:grid-cols-2">
                    {[
                        {
                            title: "1. Proof of Land Ownership",
                            items: ["Copy of Digital C of O (or R of O, Approval Letter, or Acknowledgement Letter)", "Evidence of payment (Premium or Approval fees)"]
                        },
                        {
                            title: "2. Architectural Drawings",
                            items: ["Two (2) copies of A3-sized working drawings", "Duly sealed, stamped and endorsed by a registered Architect", "ARCON Project Registration Number (APRN) indicated", "Architect's current professional practice license"]
                        },
                        {
                            title: "3. Site Analysis Report (SAR)",
                            items: ["Prepared by consultants registered with KASUPDA", "Must include a clear satellite image", "Scaled, stamped and endorsed by a TOPREC-registered Town Planner"]
                        },
                        {
                            title: "4. M&E Drawings",
                            items: ["One (1) hard copy and one (1) soft copy (CD)", "A3-sized drawings, sealed, stamped and endorsed by a COREN-registered Engineer"]
                        },
                        {
                            title: "5. Structural Drawings",
                            items: ["Two (2) copies of A3-sized structural drawings", "Duly sealed, stamped and endorsed by a qualified Engineer", "Required for storey buildings, warehouses, etc."]
                        },
                        {
                            title: "6. Structural Calculations",
                            items: ["Calculation sheets and letter of attestation of design", "Sealed, stamped and endorsed by a COREN-registered Structural Engineer"]
                        },
                        {
                            title: "Other Requirements",
                            items: ["Soil Investigation Report (for >3 floors)", "KEPA EIA Certificate (where applicable)", "Tax Clearance Certificate (TCC) or TIN", "Valid Means of ID (Passport, National ID, etc.)", "Recent Utility Bill or Bank Statement"]
                        }
                    ].map((doc, i) => (
                        <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                            <h4 className="font-bold text-sm mb-2 text-primary">{doc.title}</h4>
                            <ul className="space-y-1">
                                {doc.items.map((item, j) => (
                                    <li key={j} className="text-xs flex gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                        For unplanned layouts, a <strong>District Head Confirmation</strong> is required. All documents must be properly endorsed to avoid delays.
                    </p>
                </div>
            </div>
        )
    },
    {
        number: 3,
        title: "Submission & Fees",
        icon: <CreditCard className="w-6 h-6" />,
        content: (
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2"><Users className="w-4 h-4" /> Processing Fees</h4>
                        <div className="overflow-hidden rounded-lg border border-border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Category</th>
                                        <th className="px-4 py-2 text-right">Regular</th>
                                        <th className="px-4 py-2 text-right">Express</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-4 py-2">Individuals</td>
                                        <td className="px-4 py-2 text-right">₦10,000</td>
                                        <td className="px-4 py-2 text-right">₦50,000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">Organizations</td>
                                        <td className="px-4 py-2 text-right">₦20,000</td>
                                        <td className="px-4 py-2 text-right">₦100,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted-foreground italic">Payment via KASUPDA PayDirect, OSoft Platform, or POS at Headquarters.</p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2"><Globe className="w-4 h-4" /> Online Submission</h4>
                        <p className="text-sm">Applicants may alternatively process applications online:</p>
                        <div className="flex flex-col gap-2">
                            <Link href="https://kasupda.kdsg.gov.ng/e-payment/" target="_blank" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                                KASUPDA e-Payment Platform <ExternalLink className="w-3 h-3" />
                            </Link>
                            <Link href="https://kasupda.kdsg.gov.ng/create-application/" target="_blank" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                                Create Application Portal <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Confirmation of Application
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-400">Upon successful submission, you will be issued an <strong>Acknowledgement Letter</strong> with a <strong>Building Permit Identification (BPI) Number</strong>, which serves as your unique reference for tracking.</p>
                </div>
            </div>
        )
    },
    {
        number: 4,
        title: "Collection of Certificate",
        icon: <Clock className="w-6 h-6" />,
        content: (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">Approval Timeline</h4>
                                <p className="text-sm text-muted-foreground">Successful applicants will be notified within <strong>5-10 working days</strong> via SMS, telephone, or email.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Next Steps after Notification:</h4>
                            <ul className="space-y-2">
                                <li className="text-sm flex gap-3">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">1</span>
                                    <span><strong>Assessment of Fees:</strong> Based on size, location, and proposed use.</span>
                                </li>
                                <li className="text-sm flex gap-3">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">2</span>
                                    <span><strong>Payment of Fees:</strong> Can be made via Bank, POS, or Online portal.</span>
                                </li>
                                <li className="text-sm flex gap-3">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">3</span>
                                    <span><strong>Collection:</strong> Present evidence of payment at the designated KASUPDA office.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="md:w-72 p-4 rounded-xl bg-muted border border-border space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Enquiries & Follow-up</h4>
                        <div className="space-y-3">
                            <div className="flex gap-2 text-xs">
                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                <span>KASUPDA Customer Service Unit<br />No. 4 Bida Road, Kaduna.</span>
                            </div>
                            <div className="flex gap-2 text-xs">
                                <Globe className="w-4 h-4 text-primary shrink-0" />
                                <Link href="mailto:kasupda@kdsg.gov.ng" className="hover:underline">kasupda@kdsg.gov.ng</Link>
                            </div>
                            <div className="flex gap-2 text-xs">
                                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                                <span>+234 912 500 2126</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

export default function BuildingPermitGuidelinesPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="bg-primary/5 border-b py-12 md:py-20 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <h1 className="text-xl md:text-2xl font-bold text-primary mb-4 leading-relaxed">
                        APPLICATION PROCESS AND GUIDELINES FOR OBTAINING BUILDING PERMIT IN KADUNA STATE
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                        Pursuant to the Kaduna State Urban and Regional Planning Law, 2018, all individuals and organisations
                        intending to undertake any form of land development within Kaduna State shall obtain a Development
                        (Building) Permit through the procedures outlined below:
                    </p>
                </div>
                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
            </section>

            {/* Steps Section */}
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-5xl mx-auto space-y-12">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line */}
                            {index !== steps.length - 1 && (
                                <div className="absolute left-[24px] top-[70px] bottom-[-50px] w-px bg-border hidden md:block" />
                            )}

                            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                                {/* Step Marker */}
                                <div className="flex md:flex-col items-center gap-4 shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20 relative z-10">
                                        {step.number}
                                    </div>
                                    <div className="md:hidden h-px flex-1 bg-border" />
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60 md:rotate-180 md:[writing-mode:vertical-lr] md:mt-4 whitespace-nowrap">
                                        STEP {step.number}
                                    </span>
                                </div>

                                {/* Content Card */}
                                <Card className="flex-1 border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden group hover:ring-1 hover:ring-primary/20 transition-all duration-300">
                                    <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-border/50 py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                                                {step.icon}
                                            </div>
                                            <CardTitle className="text-lg md:text-xl font-bold tracking-tight">
                                                {step.title}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 md:p-8">
                                        {step.content}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Closing Note */}
                <div className="max-w-4xl mx-auto mt-20 p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4">
                    <p className="text-lg font-medium opacity-90">Ready to start your application?</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/dashboard/apply"
                            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-bold transition-all transform hover:scale-105"
                        >
                            Start Application Online
                        </Link>
                    </div>
                    <p className="text-xs opacity-50 pt-4">
                        © {new Date().getFullYear()} Kaduna State Urban Planning and Development Authority (KASUPDA). All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
