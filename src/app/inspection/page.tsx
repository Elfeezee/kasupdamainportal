
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inspection Process | KASUPDA',
  description: 'Learn about scheduled inspections at various stages of construction to ensure compliance with approved plans.',
};

export default function InspectionPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-block bg-primary text-primary-foreground p-3 rounded-full mx-auto mb-4">
              <Eye className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            Construction Inspection
          </CardTitle>
          <CardDescription>
            Ensuring Compliance and Safety
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-center text-foreground">
            Learn about scheduled inspections at various stages of construction to ensure compliance with approved plans.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
