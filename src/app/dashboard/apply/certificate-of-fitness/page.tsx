
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { saveApplication } from '@/app/actions/applicationActions';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Award, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const fitnessCertificateSchema = z.object({
  applicantName: z.string().min(2, "Applicant name is required"),
  doc_building_permit: z.any()
    .refine((files) => files?.length == 1, "Building Permit is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted."
    ),
  doc_co: z.any()
    .refine((files) => files?.length == 1, "Certificate of Occupancy is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted."
    ),
});

type FitnessCertificateFormValues = z.infer<typeof fitnessCertificateSchema>;

function LoadingSkeleton() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-12 w-48" />
      </CardFooter>
    </Card>
  );
}

import { useFormPersistence } from '@/hooks/use-form-persistence';

export default function CertificateOfFitnessPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  const form = useForm<FitnessCertificateFormValues>({
    resolver: zodResolver(fitnessCertificateSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const { clearStorage } = useFormPersistence(form, 'certificate-of-fitness-form', ['doc_building_permit', 'doc_co']);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?redirectTo=/dashboard/apply/certificate-of-fitness');
    }
  }, [sessionStatus, router]);

  const onSubmit = async (data: FitnessCertificateFormValues) => {
    if (!session?.user) {
      toast({ title: "Error", description: "You must be logged in to submit.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('type', "Certificate of Fitness");
    formData.append('applicantName', data.applicantName);
    formData.append('userId', session.user.id);

    // Correctly name the fields for the server action
    if (data.doc_building_permit[0]) {
      formData.append('doc_building_permit', data.doc_building_permit[0]);
    }
    if (data.doc_co[0]) {
      formData.append('doc_co', data.doc_co[0]);
    }

    try {
      const result = await saveApplication(formData);

      if (result.success) {
        clearStorage();
        if (result.error) {
          toast({
            title: "Application Saved with Issues",
            description: result.error,
            variant: "destructive"
          });
          router.push('/dashboard/my-applications');
        } else {
          router.push(`/dashboard/billing`);
        }
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Could not submit the application.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-3">
            <Award className="h-7 w-7" />
            Certificate of Fitness and Habitation Application
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Complete this form to apply for a certificate upon the completion of your building project.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="applicantName">Full Name of Applicant*</Label>
              <Input id="applicantName" {...register("applicantName")} placeholder="Enter the name on the building permit" />
              {errors.applicantName && <p className="text-destructive text-xs mt-1">{errors.applicantName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doc_building_permit">Upload Original Building Permit*</Label>
              <Input id="doc_building_permit" type="file" {...register("doc_building_permit")} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              {errors.doc_building_permit && <p className="text-destructive text-xs mt-1">{errors.doc_building_permit.message as string}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doc_co">Upload Certificate of Occupancy (C of O)*</Label>
              <Input id="doc_co" type="file" {...register("doc_co")} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              {errors.doc_co && <p className="text-destructive text-xs mt-1">{errors.doc_co.message as string}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto py-3 text-base" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Application'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}


