
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Tent, UserCheck, MessageSquareWarning, ArrowRight, FilePlus2, Building, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const permitTypes = [
  {
    title: 'Building Permit Application',
    description: 'Apply for permits for new residential, commercial, or other types of buildings.',
    icon: Building,
    href: '/dashboard/apply/building-permit', 
    actionText: 'Select Category',
  },
  {
    title: 'Temporary Permit Application',
    description: 'Permits for street naming, outdoor structures, masts, advertisements, and shop owners.',
    icon: Tent,
    href: '/dashboard/apply/temporary-permit',
    actionText: 'Select Category',
    disabled: false,
  },
  {
    title: 'Consultant Licensing', 
    description: 'Apply for licenses for consultancy services related to urban planning and development.', 
    icon: UserCheck, 
    href: '#', 
    actionText: 'Start Application',
    disabled: true,
  },
  {
    title: 'Complaint Application',
    description: 'Submit complaints related to building violations or urban planning issues.',
    icon: MessageSquareWarning,
    href: '#', 
    actionText: 'Submit Complaint',
    disabled: true,
  },
];

export default function SelectPermitTypePage() {
  const { toast } = useToast();

  const handleDisabledClick = (title: string) => {
    toast({
      title: 'Feature Pending',
      description: `${title} is not yet implemented.`,
    });
  };

  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
          <FilePlus2 className="mr-3 h-7 w-7" /> Apply for a Permit or Service
        </CardTitle>
        <CardDescription>
          Choose the type of application you want to start. All developers must apply for a DIN first.
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {permitTypes.map((permit) => (
          <Card key={permit.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <permit.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl font-semibold">{permit.title}</CardTitle>
              </div>
              <CardDescription>{permit.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Additional content can go here if needed */}
            </CardContent>
            <CardFooter>
              {permit.disabled ? (
                <Button 
                  className="w-full" 
                  onClick={() => handleDisabledClick(permit.title)}
                  disabled
                >
                  {permit.actionText} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link href={permit.href}>
                    {permit.actionText} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
