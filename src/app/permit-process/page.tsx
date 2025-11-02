
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Permit Process | KASUPDA',
  description: 'Understand the step-by-step process for obtaining a building permit from KASUPDA.',
};

const permitSteps = [
  { step: 1, name: "Application Submission (Front Desk)" },
  { step: 2, name: "DG's Office" },
  { step: 3, name: "Director Development Control" },
  { step: 4, name: "Site Inspection" },
  { step: 5, name: "Building Permit Unit" },
  { step: 6, name: "Director Development Control" },
  { step: 7, name: "DG's Office" },
  { step: 8, name: "Conveyance" },
];

export default function PermitProcessPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            Building Permit Process
          </CardTitle>
          <CardDescription>
            The official workflow for processing building permit applications at KASUPDA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ol className="relative border-l-2 border-primary/20 ml-3">
              {permitSteps.map((step, index) => (
                <li key={index} className="mb-8 ml-8">
                  <span className="absolute -left-[1.1rem] flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground font-bold">
                    {step.step}
                  </span>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-foreground">{step.name}</h3>
                  </div>
                </li>
              ))}
            </ol>
             <p className="text-center text-sm text-muted-foreground pt-4">
                This streamlined process ensures that all applications are reviewed thoroughly and efficiently.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
