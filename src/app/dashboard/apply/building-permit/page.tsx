
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Briefcase, ArrowRight, Building } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const buildingPermitCategories = [
  {
    title: 'Building Permit Individual',
    description: 'For single-family homes, duplexes, apartment buildings, and other residential structures by individuals.',
    icon: Home,
    href: '/dashboard/apply/residential-building-permit', 
    actionText: 'Start Individual Application',
  },
  {
    title: 'Building permit for organization',
    description: 'For offices, retail spaces, factories, public buildings, mixed-use, and other non-residential structures by organizations.',
    icon: Briefcase,
    href: '/dashboard/apply/commercial-industrial-other-permit', 
    actionText: 'Start Organization Application',
    disabled: false, 
  },
];

export default function SelectBuildingPermitCategoryPage() {
  const { toast } = useToast();

  const handleDisabledClick = (title: string) => {
    toast({
      title: 'Form Pending',
      description: `The application form for "${title}" is not yet available.`,
    });
  };

  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
          <Building className="mr-3 h-7 w-7" /> Select Building Permit Category
        </CardTitle>
        <CardDescription>
          Choose the specific category of building permit you need to apply for.
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buildingPermitCategories.map((category) => (
          <Card key={category.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <category.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Additional content can go here if needed */}
            </CardContent>
            <CardFooter>
              {category.disabled ? (
                <Button 
                  className="w-full" 
                  onClick={() => handleDisabledClick(category.title)}
                  disabled
                >
                  {category.actionText} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link href={category.href}>
                    {category.actionText} <ArrowRight className="ml-2 h-4 w-4" />
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
