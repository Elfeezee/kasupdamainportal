
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Approved Consultants | KASUPDA - Kaduna State Urban Planning and Development Authority',
  description: 'View the official list of consultants approved by KASUPDA for development projects in Kaduna State.',
};

const consultants = [
  "SPATIALYSTICS CONSULTANCY",
  "URBAN GREENWAYS CONSULT LIMITED",
  "ONIB ASSOCIATES",
  "WORLD CHANGER CONSULTANCY",
  "EMPRESARIO",
  "MEKJO CONSULTANCY",
  "ENVIRONMENTAL PROFESSIONALS COMPANY",
  "HARITHMA",
  "DOJOE CONSULTANTS",
  "JUBAI ASSOCIATES",
  "PLAN-IT",
  "MAFAKS CONSULTANCY SERVICES LTD",
  "AA GWADABE NIGERIA LIMITED",
  "LAMINDE AND SONS",
  "KHALNAZ NIGERIA LIMITED",
];

export default function ApprovedConsultantsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-block bg-primary text-primary-foreground p-3 rounded-full mx-auto mb-4">
              <Users className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            Approved Consultants
          </CardTitle>
          <CardDescription>
            The following is the official list of consultants approved by KASUPDA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">S/N</TableHead>
                  <TableHead>Consultant Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultants.map((consultant, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{consultant}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
