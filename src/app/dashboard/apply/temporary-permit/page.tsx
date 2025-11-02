
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tent, Milestone, Construction, TowerControl, Megaphone, Store } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const temporaryPermitCategories = [
  {
    title: 'Street Naming Permit',
    description: 'Apply for official naming of streets or roads.',
    icon: Milestone,
    href: '/dashboard/apply/street-naming-permit', 
    actionText: 'Start Application',
    disabled: false, 
  },
  {
    title: 'Outdoor Structure Permit',
    description: 'For temporary outdoor installations like kiosks, canopies, or event structures.',
    icon: Construction, 
    href: '/dashboard/apply/outdoor-advertisement-structure-permit', 
    actionText: 'Start Application',
    disabled: false,
  },
  {
    title: 'Mast Permit',
    description: 'Application for installation of telecommunication masts and towers.',
    icon: TowerControl,
    href: '/dashboard/apply/mast-permit', 
    actionText: 'Start Application',
    disabled: false, 
  },
  {
    title: 'Outdoor Advertisement Permit',
    description: 'Permits for billboards, signages, and other outdoor advertising displays.',
    icon: Megaphone,
    href: '/dashboard/apply/outdoor-advertisement-permit', 
    actionText: 'Start Application',
    disabled: false, 
  },
  {
    title: 'Shop Owners Permit',
    description: 'Permits required for operating various types of shops and small businesses.',
    icon: Store,
    href: '/dashboard/apply/shop-owners-permit',
    actionText: 'Start Application',
    disabled: false,
  },
];

export default function SelectTemporaryPermitCategoryPage() {
  const { toast } = useToast();

  const handleDisabledClick = (title: string) => {
    toast({
      title: 'Form Pending',
      description: `The application form for "${title}" is not yet available. Please check back later.`,
      duration: 4000,
    });
  };

  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
          <Tent className="mr-3 h-7 w-7" /> Select Temporary Permit Category
        </CardTitle>
        <CardDescription>
          Choose the specific category of temporary permit you need to apply for.
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {temporaryPermitCategories.map((category) => (
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

