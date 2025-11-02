
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderArchive, FileText, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const userDocuments = [
  {
    id: "DOC-001",
    name: "C_of_O_Plot_A12.pdf",
    type: "Certificate of Occupancy",
    applicationId: "BP-2024-XYZ",
    dateAdded: "2024-07-18",
  },
  {
    id: "DOC-002",
    name: "Architectural_Plan_Final.pdf",
    type: "Architectural Drawing",
    applicationId: "BP-2024-XYZ",
    dateAdded: "2024-07-18",
  },
  {
    id: "DOC-003",
    name: "Structural_Analysis.pdf",
    type: "Structural Calculation",
    applicationId: "BP-2024-XYZ",
    dateAdded: "2024-07-18",
  },
   {
    id: "DOC-004",
    name: "Site_Analysis_Report.pdf",
    type: "SAR",
    applicationId: "BP-2024-XYZ",
    dateAdded: "2024-07-18",
  },
  {
    id: "DOC-005",
    name: "DIN_Approval_Letter.pdf",
    type: "Approval Letter",
    applicationId: "DIN-2024-ABC",
    dateAdded: "2024-07-15",
  },
];

export default function MyDocumentsPage() {
    const { toast } = useToast();

    const handleDownload = (docName: string) => {
        toast({
            title: 'Prototype Feature',
            description: `Downloading ${docName} is not yet implemented.`,
        });
    };

    return (
        <div className="space-y-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
                <FolderArchive className="mr-3 h-7 w-7" /> My Documents
                </CardTitle>
                <CardDescription>
                A centralized repository for all documents you've uploaded or received from KASUPDA.
                </CardDescription>
            </CardHeader>
            <Card>
                <CardContent className="pt-6">
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Related Application</TableHead>
                                    <TableHead>Date Added</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userDocuments.length > 0 ? (
                                    userDocuments.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                {doc.name}
                                            </TableCell>
                                            <TableCell>{doc.type}</TableCell>
                                            <TableCell>{doc.applicationId}</TableCell>
                                            <TableCell>{doc.dateAdded}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={() => handleDownload(doc.name)}
                                                >
                                                    <Download className="h-4 w-4" /> Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                        You have not uploaded or received any documents yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
