
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { saveApplication } from '@/app/actions/applicationActions';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

// Zod schema based on the new, simplified requirements
const dinApplicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  surname: z.string().min(1, "Surname is required"),
  applicantAddress: z.string().min(1, "Applicant Address is required"),
  plotAddress: z.string().min(1, "Plot Address is required"),
  kbpNumber: z.string().min(1, "KBP Number is required"),
  kdlNumber: z.string().min(1, "KDL Number is required"),
  postalCode: z.string().min(1, "Postal Code is required").regex(/^\d+$/, "Must be numeric"),
  lgaCode: z.string().min(1, "LGA Code is required").regex(/^\d+$/, "Must be numeric"),
  wardCode: z.string().min(1, "Ward Code is required").regex(/^\d+$/, "Must be numeric"),
  streetCode: z.string().min(1, "Street Code is required").regex(/^\d+$/, "Must be numeric"),
  plotNumber: z.string().min(1, "Plot Number is required").regex(/^\d+$/, "Must be numeric"),
  doc_permit: z.any()
    .refine((files) => files?.length == 1, "Permit document is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted."
    ),
  doc_co: z.any()
    .refine((files) => files?.length == 1, "C/O document is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted."
    ),
  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit."
  })
});

type DinApplicationFormValues = z.infer<typeof dinApplicationSchema>;

import { useFormPersistence } from '@/hooks/use-form-persistence';

function DinApplicationForm({ user, onSubmit, isSubmitting }: { user: any, onSubmit: (data: DinApplicationFormValues, clearStorage: () => void) => void, isSubmitting: boolean }) {
  const form = useForm<DinApplicationFormValues>({
    resolver: zodResolver(dinApplicationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: user.name?.split(' ')[0] || "",
      surname: user.name?.split(' ').slice(1).join(' ') || "",
      middleName: "",
      applicantAddress: "",
      plotAddress: "",
      kbpNumber: "",
      kdlNumber: "",
      postalCode: "800271", // Defaulting based on image
      lgaCode: "",
      wardCode: "",
      streetCode: "",
      plotNumber: "",
      doc_permit: undefined,
      doc_co: undefined,
      declaration: false,
    }
  });

  const { register, handleSubmit, control, formState: { errors } } = form;

  const { clearStorage } = useFormPersistence(form, 'din-application-form', ['doc_permit', 'doc_co']);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-3">
          <Fingerprint className="h-7 w-7" />
          Development Identification Number (DIN) Application
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Complete this form to apply for a new KASUPDA DIN. You will be required to make a payment of ₦5,000 to complete the process.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit((data) => onSubmit(data, clearStorage))}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="firstName">First Name*</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" {...register("middleName")} />
            </div>
            <div>
              <Label htmlFor="surname">Surname*</Label>
              <Input id="surname" {...register("surname")} />
              {errors.surname && <p className="text-destructive text-xs mt-1">{errors.surname.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="applicantAddress">Applicant Address*</Label>
            <Textarea id="applicantAddress" {...register("applicantAddress")} />
            {errors.applicantAddress && <p className="text-destructive text-xs mt-1">{errors.applicantAddress.message}</p>}
          </div>

          <div>
            <Label htmlFor="plotAddress">Plot Address*</Label>
            <Textarea id="plotAddress" {...register("plotAddress")} />
            {errors.plotAddress && <p className="text-destructive text-xs mt-1">{errors.plotAddress.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kbpNumber">KBP Number*</Label>
              <Input id="kbpNumber" {...register("kbpNumber")} />
              {errors.kbpNumber && <p className="text-destructive text-xs mt-1">{errors.kbpNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="kdlNumber">KDL Number*</Label>
              <Input id="kdlNumber" {...register("kdlNumber")} />
              {errors.kdlNumber && <p className="text-destructive text-xs mt-1">{errors.kdlNumber.message}</p>}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <div className="w-2 h-4 bg-primary rounded-full" />
              DIN Generation Parameters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="postalCode" className="text-[10px] font-bold text-slate-500 uppercase">Postal Code (PC)*</Label>
                <Input id="postalCode" {...register("postalCode")} placeholder="800271" className="bg-white" />
                {errors.postalCode && <p className="text-destructive text-[10px] mt-1">{errors.postalCode.message}</p>}
              </div>
              <div>
                <Label htmlFor="lgaCode" className="text-[10px] font-bold text-slate-500 uppercase">LGA Code (LG)*</Label>
                <Input id="lgaCode" {...register("lgaCode")} placeholder="05" className="bg-white" />
                {errors.lgaCode && <p className="text-destructive text-[10px] mt-1">{errors.lgaCode.message}</p>}
              </div>
              <div>
                <Label htmlFor="wardCode" className="text-[10px] font-bold text-slate-500 uppercase">Ward Code (WD)*</Label>
                <Input id="wardCode" {...register("wardCode")} placeholder="12" className="bg-white" />
                {errors.wardCode && <p className="text-destructive text-[10px] mt-1">{errors.wardCode.message}</p>}
              </div>
              <div>
                <Label htmlFor="streetCode" className="text-[10px] font-bold text-slate-500 uppercase">Street Code (ST)*</Label>
                <Input id="streetCode" {...register("streetCode")} placeholder="034" className="bg-white" />
                {errors.streetCode && <p className="text-destructive text-[10px] mt-1">{errors.streetCode.message}</p>}
              </div>
              <div>
                <Label htmlFor="plotNumber" className="text-[10px] font-bold text-slate-500 uppercase">Plot Number (PL)*</Label>
                <Input id="plotNumber" {...register("plotNumber")} placeholder="056" className="bg-white" />
                {errors.plotNumber && <p className="text-destructive text-[10px] mt-1">{errors.plotNumber.message}</p>}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic font-medium">
              * These codes are used to generate your unique Development Identification Number (DIN).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="doc_permit">Upload Permit*</Label>
              <Input id="doc_permit" type="file" {...register("doc_permit")} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              {errors.doc_permit && <p className="text-destructive text-xs mt-1">{errors.doc_permit.message as string}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doc_co">Upload C/O (Certificate of Occupancy)*</Label>
              <Input id="doc_co" type="file" {...register("doc_co")} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              {errors.doc_co && <p className="text-destructive text-xs mt-1">{errors.doc_co.message as string}</p>}
            </div>
          </div>

          {/* Declaration */}
          <div>
            <Label className="text-md font-semibold">Declaration</Label>
            <div className="flex items-start space-x-2 p-4 border rounded-md bg-muted/30 mt-2">
              <Controller
                name="declaration"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="declaration"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1"
                  />
                )}
              />
              <Label htmlFor="declaration" className="font-normal text-sm sm:text-base leading-snug">
                I declare that the information provided in this application is true, correct, and complete to the best of my knowledge and belief.
              </Label>
            </div>
            {errors.declaration && <p className="text-destructive text-xs mt-1 px-1">{errors.declaration.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto py-3 text-base sm:text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting for Payment...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function LoadingCard() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DinApplicationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      toast({ title: 'Authentication Required', description: 'Please log in to apply for a DIN.', variant: 'destructive' });
      router.push('/login?redirectTo=/dashboard/apply/din-application');
    }
  }, [sessionStatus, router, toast]);

  const onSubmit = async (data: DinApplicationFormValues, clearStorage: () => void) => {
    if (!session?.user) {
      toast({ title: "Error", description: "You must be logged in to proceed.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const applicantName = [data.firstName, data.middleName, data.surname].filter(Boolean).join(' ');

    const formData = new FormData();
    formData.append('type', 'DIN Application');
    formData.append('applicantName', applicantName);
    formData.append('userId', session.user.id);

    // Append all other form values to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) formData.append(key, 'on');
      } else if (value instanceof FileList) {
        if (value.length > 0 && value[0].size > 0) formData.append(key, value[0]);
      } else if (value) {
        formData.append(key, String(value));
      }
    });

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
          router.push('/dashboard/my-dins'); // Redirect to my-dins for DIN application
        } else {
          toast({ title: "Application Submitted", description: "Please proceed with payment to get your DIN." });
          router.push(`/dashboard/billing`);
        }
      } else {
        throw new Error(result.error || "An unknown error occurred during DIN application submission.");
      }

    } catch (error) {
      console.error("DIN Application failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not process your application. Please try again.";
      toast({ title: "Submission Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-8">
      {sessionStatus === 'loading' && <LoadingCard />}
      {sessionStatus === 'authenticated' && session.user && (
        <DinApplicationForm user={session.user} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}
