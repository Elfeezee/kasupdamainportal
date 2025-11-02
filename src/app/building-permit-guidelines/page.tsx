
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Landmark, Church, School, Leaf, Building2 } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Building Permit Checklist | KASUPDA',
  description: 'Official checklist, processing fees, and required documents for building permit applications in Kaduna State.',
};

const processingFees = [
    { item: "Company / Organization", fee: "₦20,000.00" },
    { item: "Commercial Development", fee: "₦20,000.00" },
    { item: "Individual", fee: "₦10,000.00" },
    { item: "Telecom Mast", fee: "₦20,000.00" },
    { item: "Car wash", fee: "₦10,000.00" },
    { item: "Quarter Plot", fee: "₦2,000.00" },
];

const residentialRequirements = [
    "Land title document (Digitized C of O, KADGIS Offer Letter, KADGIS Acknowledgment)",
    "Site Analysis Report (SAR)",
    "Complete working Drawings (Architectural, Mechanical and Electrical)",
    "Structural drawing, Calculation sheet, Letter for Supervision/Responsibility for storey buildings.",
    "Builder's Document to be produced by Registered Builder for commercial Residential",
    "Geotechnical investigation Report (Soil Test) for Multi-storey development that exceeds two (2) floors.",
    "PDF copy of all drawings on CD",
    "Means of ID of applicant",
    "Means of ID of representative (optional)",
    "Copy of utility bill",
];

const religiousRequirements = [
    "Land title document (Digitized C of O, KADGIS Offer Letter, KADGIS Acknowledgment)",
    "Site Analysis Report (SAR)",
    "Complete working Drawings (Architectural, Structural, Mechanical and Electrical)",
    "Calculation sheet, Letter for Supervision/Responsibility for storey buildings.",
    "Builder's Document to be produced by Registered Builder",
    "Geotechnical investigation Report (Soil Test) for Multi storey development that exceeds two (2) floors.",
    "Soft copy of all drawings on CD",
    "Means of ID of applicant",
    "Means of ID of representative (optional)",
    "Copy of utility bill",
    "Certificate of Registration with Bureau for Interfaith",
    "KEPA EIA Certificate (could be submitted while application is in process)",
];

const publicInstitutionRequirements = [
    "Land title document (Digitized C of O, KADGIS Offer Letter)",
    "KADGIS Acknowledgment",
    "Site Analysis Report (SAR)",
    "Complete working Drawings (Architectural, Structural, Mechanical and Electrical)",
    "Calculation sheet, Letter for Supervision/Responsibility for storey buildings.",
    "Builder's Document to be produced by Registered Builder",
    "Geotechnical investigation Report (Soil Test) for Multi storey development that exceeds two (2) floors.",
    "PDF copy of all drawings on CD",
    "Means of ID of applicant",
    "Means of ID of representative (optional)",
    "Copy of utility bill",
    "Clearance from Quality Assurance",
    "KEPA EIA Certificate (could be submitted while APPLICATION is in process)"
];

const agriculturalRequirements = [
    "Land title document (Digitized C of O, KADGIS Offer Letter, KADGIS Acknowledgment)",
    "Site Analysis Report (SAR)",
    "Complete working Drawings (Architectural, Structural, Mechanical and Electrical)",
    "Calculation sheet, Letter for Supervision/Responsibility for storey buildings.",
    "Builder's Document to be produced by Registered Builder",
    "Geotechnical investigation Report (Soil Test) for Multi storey development that exceeds two (2) floors.",
    "PDF copy of all drawings on CD",
    "Means of ID of applicant.",
    "KEPA EIA Certificate (if there are complimentary permanent structures)",
];

const commercialIndustrialRequirements = [
    "Land title document (Digitized C of O, KADGIS Offer Letter, KADGIS Acknowledgment)",
    "Site Analysis Report (SAR)",
    "Complete working Drawings (Architectural, Structural, Mechanical and Electrical)",
    "Calculation sheet, Letter for Supervision/ Responsibility for storey buildings.",
    "Builder's Document to be produced by Registered Builder",
    "Geotechnical investigation Report (Soil Test) for Multi storey development that exceeds two (2) floors.",
    "PDF copy of all drawings on CD",
    "Means of ID of applicant",
    "Means of ID of representative (optional)",
    "Copy of utility bill",
    "KEPA EIA Certificate (could be submitted while APPLICATION is in process)",
];


export default function BuildingPermitGuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
            <div className="inline-block bg-primary text-primary-foreground p-3 rounded-full mx-auto mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold tracking-wider text-muted-foreground">KADUNA STATE URBAN PLANNING AND DEVELOPMENT AUTHORITY (KASUPDA)</p>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
                Checklist for Building Permit
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
            
            <section>
                <h2 className="text-xl font-semibold text-primary mb-3">Processes</h2>
                <p className="text-foreground">
                    The application form shall be completed in full and submitted directly to KASUPDA Customer Service. Individual applicants shall fill the BPI Form while a company or organization shall fill the BPO Form.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-primary mb-3 flex items-center"><Landmark className="mr-2 h-5 w-5"/>Payment Receipt for Processing Fees</h2>
                <div className="border rounded-md">
                    <table className="w-full">
                        <tbody className="divide-y">
                            {processingFees.map((item, index) => (
                                <tr key={index} className="hover:bg-muted/50">
                                    <td className="p-3 font-medium">{item.item}</td>
                                    <td className="p-3 text-right font-semibold">{item.fee}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-primary mb-3">A. Residential (Regular Area)</h2>
                <ul className="space-y-4">
                    {residentialRequirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0" />
                            <span>{req}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
                    <Church className="mr-2 h-5 w-5" /> B. Religious (Prayer House and Religious School)
                </h2>
                <ul className="space-y-4">
                    {religiousRequirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0" />
                            <span>{req}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
                    <School className="mr-2 h-5 w-5" /> C. Public Institution (School)
                </h2>
                <ul className="space-y-4">
                    {publicInstitutionRequirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0" />
                            <span>{req}</span>
                        </li>
                    ))}
                </ul>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
                    <Leaf className="mr-2 h-5 w-5" /> D. Agricultural
                </h2>
                <ul className="space-y-4">
                    {agriculturalRequirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0" />
                            <span>{req}</span>
                        </li>
                    ))}
                </ul>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
                    <Building2 className="mr-2 h-5 w-5" /> E. Commercial and Industrial
                </h2>
                <ul className="space-y-4">
                    {commercialIndustrialRequirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0" />
                            <span>{req}</span>
                        </li>
                    ))}
                </ul>
            </section>

        </CardContent>
      </Card>
    </div>
  );
}
