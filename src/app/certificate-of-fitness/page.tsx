
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, FileCheck, Building, CheckCircle } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Certificate of Fitness & Habitation | KASUPDA',
  description: 'Learn about the KASUPDA Certificate of Fitness and Habitation, a crucial document confirming your building is safe and compliant.',
};

const processSteps = [
    "Completion of Construction: Ensure your building project is fully completed according to the approved building permit plans.",
    "Application Submission: Apply for the Certificate of Fitness through your dashboard.",
    "Final Inspection: KASUPDA officials will conduct a final inspection to verify compliance with all building codes and safety standards.",
    "Issuance of Certificate: Upon successful inspection, the Certificate of Fitness and Habitation will be issued and made available on your dashboard.",
];

export default function CertificateOfFitnessInfoPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-block bg-primary text-primary-foreground p-3 rounded-full mx-auto mb-4">
              <Award className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            Certificate of Fitness and Habitation
          </CardTitle>
          <CardDescription>
            The final step in verifying your building's safety and compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <section>
                <h2 className="flex items-center text-xl font-semibold text-primary mb-3"><FileCheck className="mr-2 h-5 w-5"/>What is a Certificate of Fitness?</h2>
                <p className="text-foreground">
                    A Certificate of Fitness and Habitation is an official document issued by KASUPDA upon the completion of a building project. It certifies that the building has been inspected and is confirmed to have been constructed in accordance with the approved building plans and complies with all relevant state building codes and safety regulations.
                </p>
                <p className="mt-2 text-foreground">
                    This certificate is essential as it declares the building is safe and fit for human habitation or its intended commercial/public use.
                </p>
            </section>

             <section>
                <h2 className="flex items-center text-xl font-semibold text-primary mb-3"><Building className="mr-2 h-5 w-5"/>Why is it Important?</h2>
                <ul className="space-y-3 list-disc list-inside text-foreground">
                    <li><strong>Safety Assurance:</strong> It serves as proof that your property is structurally sound and safe for occupancy.</li>
                    <li><strong>Legal Compliance:</strong> It is a legal requirement for all completed buildings, and failure to obtain one can result in penalties.</li>
                    <li><strong>Property Value:</strong> The certificate can increase your property's value and is often required for insurance, sales, or leasing purposes.</li>
                </ul>
            </section>

            <section>
                <h2 className="flex items-center text-xl font-semibold text-primary mb-3"><CheckCircle className="mr-2 h-5 w-5"/>The Process</h2>
                <ol className="space-y-4">
                    {processSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3 mt-0.5 shrink-0">{index + 1}</span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>
            </section>
        </CardContent>
      </Card>
    </div>
  );
}
