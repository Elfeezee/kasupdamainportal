
import React from 'react';
import AcknowledgementLetterContent from '@/app/dashboard/acknowledgement/[id]/AcknowledgementLetterContent';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';

// Create realistic mock data for the sample letter
const sampleApplicationData: StoredApplication = {
  id: '999',
  created_at: new Date().toISOString(),
  user_id: 'user-123',
  type: 'Building Permit (Individual)',
  applicant_name: 'Muhammad Kabiru Rabiu',
  status: 'Inprogress',
  original_permit_id: 'KSP999',
  din: 'DIN123',
  appHouseNo: '123',
  appStreetName: 'Main Street',
  appDistrict: 'GRA',
  appCityTown: 'Kaduna',
  appState: 'Kaduna',
  plotDistrict: 'Unguwan Rimi',
  plotLGA: 'Kaduna North',
  plotDescriptionAddress: 'Plot 42, Block B, Unguwan Rimi GRA Extension',
  // --- Mock uploaded documents ---
  doc_land_title_url: 'https://example.com/doc_land_title.pdf',
  doc_sar_url: 'https://example.com/doc_sar.pdf',
  doc_working_drawings_url: 'https://example.com/doc_working_drawings.pdf',
  doc_structural_info_url: 'https://example.com/doc_structural_info.pdf',
  doc_applicant_id_url: 'https://example.com/doc_applicant_id.pdf',
  doc_utility_bill_url: 'https://example.com/doc_utility_bill.pdf',
};

export default function SampleAcknowledgementPage() {
  return (
    <div>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-center my-4 no-print">
        <p className="font-bold">Sample Document</p>
        <p>This is a sample acknowledgement letter for review purposes. Use your browser's "Print" function (Ctrl+P or Cmd+P) to save this page as a PDF.</p>
      </div>
      <AcknowledgementLetterContent applicationData={sampleApplicationData} />
    </div>
  );
}
