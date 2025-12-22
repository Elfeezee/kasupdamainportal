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
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { generateAndSaveDin } from '@/app/actions/applicationActions';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
  doc_permit_url: z.any()
    .refine((files) => files?.length == 1, "Permit document is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted."
    ),
  doc_co_url: z.any()
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

function DinApplicationForm({ user, onSubmit, isSubmitting }: { user: User, onSubmit: (data: DinApplicationFormValues) => void, isSubmitting: boolean }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<DinApplicationFormValues>({
    resolver: zodResolver(dinApplicationSchema),
    mode: "onChange",
    defaultValues: { 
      firstName: user.user_metadata?.full_name?.split(' ')[0] || "",
      surname: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
      middleName: "",
      applicantAddress: "",
      plotAddress: "",
      kbpNumber: "",
      kdlNumber: "",
      doc_permit_url: undefined,
      doc_co_url: undefined,
      declaration: false,
    }
  });

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-3">
           <Fingerprint className="h-7 w-7"/>
          Development Identification Number (DIN) Application
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Complete this form to apply for a new KASUPDA DIN. This number will be used to identify you in all future applications.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="doc_permit_url">Upload Permit*</Label>
                    <Input id="doc_permit_url" type="file" {...register("doc_permit_url")} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    {errors.doc_permit_url && <p className="text-destructive text-xs mt-1">{errors.doc_permit_url.message as string}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="doc_co_url">Upload C/O (Certificate of Occupancy)*</Label>
                    <Input id="doc_co_url" type="file" {...register("doc_co_url")} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    {errors.doc_co_url && <p className="text-destructive text-xs mt-1">{errors.doc_co_url.message as string}</p>}
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
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                  </>
              ) : (
                  "Submit Application & Get DIN"
              )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function LoadingCard() {
    return (
        <Card className="max-w-3xl mx-auto">
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
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
            toast({ title: 'Authentication Required', description: 'Please log in to apply for a DIN.', variant: 'destructive' });
            router.push('/login?redirectTo=/dashboard/apply/din-application');
            return;
        }

        setUser(session.user);
        setLoading(false);
    };
    checkUser();
  }, [router, toast]);
  
  const onSubmit = async (data: DinApplicationFormValues) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to proceed.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);

    const applicantName = [data.firstName, data.middleName, data.surname].filter(Boolean).join(' ');
    
    const formData = new FormData();

    // Append all form values to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === 'boolean') {
        if (value) formData.append(key, 'on');
      } else if (value instanceof FileList) {
        if (value.length > 0 && value[0].size > 0) formData.append(key, value[0]);
      } else if (value) {
        formData.append(key, String(value));
      }
    });
    
    try {
        const result = await generateAndSaveDin(user.id, applicantName, formData);

        if (result.success && result.din) {
            router.push(`/dashboard/apply/din-application/success?din=${result.din}`);
        } else {
            throw new Error(result.error || "An unknown error occurred during DIN generation.");
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
    <div className="container mx-auto px-2 sm:px-4 py-8">
      {loading && <LoadingCard />}
      {!loading && user && (
        <DinApplicationForm user={user} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}
