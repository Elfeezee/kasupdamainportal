'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';

interface AcknowledgementActionsProps {
    letterRef: React.RefObject<HTMLDivElement>;
}

export default function AcknowledgementActions({ letterRef }: AcknowledgementActionsProps) {
  const router = useRouter();

  const handlePrint = useReactToPrint({
    content: () => letterRef.current,
    documentTitle: 'KASUPDA_Acknowledgement_Letter',
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `
  });

  return (
    <div className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-center gap-4 print:hidden">
      <Button variant="outline" onClick={() => router.push('/dashboard/my-applications')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Applications
      </Button>
      <Button onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print or Save as PDF
      </Button>
    </div>
  );
}
