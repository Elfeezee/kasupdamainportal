
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
                <p className="text-slate-600">Applicants may commence their building permit application through any of the approved channels outlined below.</p>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-900">
                        <Building className="w-4 h-4 text-primary" /> Physical Channels
                    </h4>
                    <p className="text-sm text-slate-700">Application forms are available <strong>free of charge</strong> at the <strong>Kaduna State Urban Planning and Development Authority (KASUPDA) Headquarters</strong>, located at No. 4 Bida Road, Kaduna or Zonal Offices.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-900">
                            <Download className="w-4 h-4 text-primary" /> Downloadable Forms
                        </h4>
                        <div className="space-y-2">
                            <Link
                                href="https://kasupda.kdsg.gov.ng/wp-content/uploads/2020/03/Building-Permit-Individual-BPI-v1.1-1.pdf"
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-primary hover:underline transition-all font-medium"
                            >
                                <FileText className="w-4 h-4" /> Building Permit for Individuals (BPI)
                            </Link>
                            <Link
                                href="https://kasupda.kdsg.gov.ng/wp-content/uploads/2020/03/Building-Permit-Organization-BPO-v1.1.pdf"
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-primary hover:underline transition-all font-medium"
                            >
                                <Briefcase className="w-4 h-4" /> Building Permit for Organizations (BPO)
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-900">
                            <Globe className="w-4 h-4 text-primary" /> Online Portal
                        </h4>
                        <div className="space-y-2">
                            <p className="text-sm text-slate-700">For alterations, new developments, and renewal of permits:</p>
                            <Link
                                href="https://kasupda.kdsg.gov.ng"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-bold"
                            >
                                KASUPDA Online Portal <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-500 italic">All completed applications must be submitted with the required supporting documents and will be subject to review in accordance with KASUPDA regulations.</p>
            </div>
        )
    },
    {
        number: 2,
        title: "Required Documentation",
        icon: <FileText className="w-6 h-6" />,
        content: (
            <div className="space-y-6">
                <p className="text-slate-600">Applicants are required to prepare and submit copies of the following documents to facilitate processing:</p>

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
                        <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                            <h4 className="font-bold text-sm mb-2 text-primary uppercase tracking-tight">{doc.title}</h4>
                            <ul className="space-y-1">
                                {doc.items.map((item, j) => (
                                    <li key={j} className="text-xs text-slate-700 flex gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                        For unplanned layouts, a <strong>District Head Confirmation</strong> is required. All documents must be properly endorsed and submitted in the required format to avoid delays in processing.
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
                        <h4 className="font-semibold flex items-center gap-2 text-slate-900"><Users className="w-4 h-4 text-primary" /> Processing Fees</h4>
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-bold text-slate-900">Category</th>
                                        <th className="px-4 py-3 text-right font-bold text-slate-900">Regular</th>
                                        <th className="px-4 py-3 text-right font-bold text-slate-900">Express</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    <tr className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3">Individuals</td>
                                        <td className="px-4 py-3 text-right font-medium">₦10,000</td>
                                        <td className="px-4 py-3 text-right font-medium text-primary">₦50,000</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3">Organizations</td>
                                        <td className="px-4 py-3 text-right font-medium">₦20,000</td>
                                        <td className="px-4 py-3 text-right font-medium text-primary">₦100,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">Payment via KASUPDA PayDirect Account, OSoft Platform, or POS at KASUPDA Customer Service Units.</p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2 text-slate-900"><Globe className="w-4 h-4 text-primary" /> Online Submission</h4>
                        <p className="text-sm text-slate-600">Applicants may alternatively process applications online via the following link:</p>
                        <div className="flex flex-col gap-3">
                            <Link href="https://kasupda.kdsg.gov.ng/e-payment/" target="_blank" className="bg-white border text-primary p-3 rounded-xl hover:shadow-md transition-all text-sm font-bold flex items-center justify-between group">
                                KASUPDA e-Payment Platform <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                            </Link>
                            <Link href="https://kasupda.kdsg.gov.ng/create-application/" target="_blank" className="bg-white border text-primary p-3 rounded-xl hover:shadow-md transition-all text-sm font-bold flex items-center justify-between group">
                                Create Application Portal <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Confirmation of Application
                    </h4>
                    <p className="text-sm text-blue-800 leading-relaxed">Upon successful submission, you will be issued an <strong>Acknowledgement Letter</strong>. This letter contains your <strong>Building Permit Identification (BPI) Number</strong>, which consists of a unique application reference number and an official file number.</p>
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
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="bg-primary/10 p-2.5 rounded-xl">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary text-base">Approval Timeline</h4>
                                <p className="text-sm text-slate-700 leading-relaxed">Successful applicants will be notified within <strong>5-10 working days</strong> via SMS, telephone call, or email.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Next Steps after Notification:</h4>
                            <ul className="space-y-3">
                                {[
                                    { title: "Assessment of Fees", desc: "Fees are assessed based on the size, location, and proposed use of the development." },
                                    { title: "Payment of Fees", desc: "Payment can be made through any of the approved channels (Bank, POS, or Online)." },
                                    { title: "Collection", desc: "Present evidence of payment at the designated KASUPDA office to collect your check-list certificate." }
                                ].map((item, idx) => (
                                    <li key={idx} className="text-sm flex gap-4">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-black shrink-0">{idx + 1}</span>
                                        <span className="text-slate-700"><strong className="text-slate-900">{item.title}:</strong> {item.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="md:w-80 p-6 rounded-2xl bg-slate-900 text-white space-y-5">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-primary-foreground/60">Enquiries & Follow-up</h4>
                        <div className="space-y-4">
                            <div className="flex gap-3 text-sm">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span className="leading-relaxed font-medium">KASUPDA Customer Service Unit<br />No. 4 Bida Road, Kaduna.</span>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <Globe className="w-5 h-5 text-primary shrink-0" />
                                <Link href="mailto:kasupda@kdsg.gov.ng" className="hover:text-primary transition-colors font-medium underline underline-offset-4">kasupda@kdsg.gov.ng</Link>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <ExternalLink className="w-5 h-5 text-primary shrink-0" />
                                <span className="font-bold tracking-wider">+234 912 500 2126</span>
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
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-white border-b border-slate-100 py-16 md:py-24 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight uppercase">
                        APPLICATION PROCESS AND GUIDELINES FOR OBTAINING BUILDING PERMIT IN KADUNA STATE
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                        Pursuant to the Kaduna State Urban and Regional Planning Law, 2018, all individuals and organisations
                        intending to undertake any form of land development within Kaduna State shall obtain a Development
                        (Building) Permit through the procedures outlined below:
                    </p>
                </div>
                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30" />
            </section>

            {/* Steps Section */}
            <div className="container mx-auto px-4 py-16 md:py-20 bg-white">
                <div className="max-w-5xl mx-auto space-y-16">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line */}
                            {index !== steps.length - 1 && (
                                <div className="absolute left-[24px] top-[80px] bottom-[-60px] w-0.5 bg-slate-100 hidden md:block" />
                            )}

                            <div className="flex flex-col md:flex-row gap-8 md:gap-14">
                                {/* Step Marker */}
                                <div className="flex md:flex-col items-center gap-4 shrink-0">
                                    <div className="w-14 h-14 rounded-3xl bg-primary text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20 relative z-10">
                                        {step.number}
                                    </div>
                                    <div className="md:hidden h-0.5 flex-1 bg-slate-100" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 md:rotate-180 md:[writing-mode:vertical-lr] md:mt-6 whitespace-nowrap">
                                        PHASE {step.number}
                                    </span>
                                </div>

                                {/* Content Card */}
                                <Card className="flex-1 border-none shadow-2xl shadow-slate-200/40 bg-white overflow-hidden group hover:shadow-slate-200/60 transition-all duration-500">
                                    <CardHeader className="bg-slate-50/30 border-b border-slate-50 py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-white rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-500">
                                                {step.icon}
                                            </div>
                                            <CardTitle className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                                                {step.title}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 md:p-10">
                                        {step.content}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Closing Note */}
                <div className="max-w-4xl mx-auto mt-24 p-12 rounded-[3rem] bg-slate-900 text-white text-center space-y-6 shadow-2xl shadow-slate-900/20">
                    <p className="text-xl font-bold text-primary-foreground/90">Ready to start your application?</p>
                    <p className="text-sm opacity-60 max-w-lg mx-auto leading-relaxed">
                        Ensure all your documents are ready before starting the online process to have a smooth experience.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <Link
                            href="/dashboard/apply"
                            className="px-10 py-4 bg-primary text-white rounded-full font-black transition-all transform hover:scale-105 hover:bg-primary/90 shadow-xl shadow-primary/20"
                        >
                            Start Application Online
                        </Link>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 pt-8 font-bold">
                        © {new Date().getFullYear()} Kaduna State Urban Planning and Development Authority (KASUPDA)
                    </p>
                </div>
            </div>
        </div>
    );
}
