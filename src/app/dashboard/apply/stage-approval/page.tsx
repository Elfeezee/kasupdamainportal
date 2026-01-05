
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, type FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { saveApplication } from '@/app/actions/applicationActions';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const stageApprovalSchema = z.object({
  // Box 1: Applicant Details
  din: z.string().min(1, "DIN is required"),
  originalPermitId: z.string().min(1, "Original Permit ID is required"),
  
  // Box 2: Project Details
  kbpNumber: z.string().optional(),
  kdlNumber: z.string().optional(),
  docCO: z.any()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted."
    ).optional(),
  docBuildingPermit: z.any()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted."
    ).optional(),
  
  // Box 3: Declaration
  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit the application."
  })
});

type StageApprovalFormValues = z.infer<typeof stageApprovalSchema>;

const steps = [
  { id: 1, name: "Project Details", fields: ['din', 'originalPermitId'] as FieldName<StageApprovalFormValues>[] },
  { id: 2, name: "Documents", fields: [] as FieldName<StageApprovalFormValues>[] },
  { id: 3, name: "Declaration", fields: ['declaration'] as FieldName<StageApprovalFormValues>[] },
];


function LoadingSkeleton() {
    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function StageApprovalPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/login?redirectTo=/dashboard/apply/stage-approval');
        } else {
            setUser(session.user);
            setLoading(false);
        }
    };
    checkSession();
  }, [router]);
  
  const { register, handleSubmit, control, formState: { errors }, trigger } = useForm<StageApprovalFormValues>({
    resolver: zodResolver(stageApprovalSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: StageApprovalFormValues) => {
     if (!user) {
        toast({ title: "Error", description: "You must be logged in to submit.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('type', "Stage Approval Application");
    const applicantName = user.user_metadata?.full_name || user.email || 'KASUPDA Applicant';
    formData.append('applicantName', applicantName);
    formData.append('userId', user.id);
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'docCO' || key === 'docBuildingPermit') {
        if (value instanceof FileList && value.length > 0 && value[0].size > 0) {
          formData.append(key, value[0]);
        }
      } else if (typeof value === 'boolean') {
          if (value) formData.append(key, 'on');
      } else if (value) {
          formData.append(key, value as string);
      }
    });

    try {
        const result = await saveApplication(formData);

        if (result.success) {
            router.push(`/dashboard/apply/success?id=${result.applicationId}`);
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

  const handleNextStep = async () => {
    const currentStepConfig = steps.find(step => step.id === currentStep);
    if (currentStepConfig?.fields) {
      const isValid = await trigger(currentStepConfig.fields as FieldName<StageApprovalFormValues>[]);
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please correct the errors before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  if (loading) {
      return (
         <div className="container mx-auto px-2 sm:px-4 py-8">
            <LoadingSkeleton />
        </div>
      );
  }
  
  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-3">
             <ClipboardCheck className="h-7 w-7"/>
            Stage Approval Application
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Apply for inspection and approval for a completed stage of your construction project.
          </CardDescription>
        </CardHeader>

         <div className="mb-8 p-4 border-t border-b">
            <div className="flex items-start w-full max-w-lg mx-auto">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center px-1 py-1 flex-shrink-0" style={{width: `${100 / steps.length}%`}}>
                    <div
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        currentStep > step.id ? "bg-primary border-primary text-primary-foreground" :
                        currentStep === step.id ? "bg-primary/20 border-primary text-primary scale-110" :
                        "bg-muted border-border text-muted-foreground"
                    )}
                    >
                    {currentStep > step.id ? <CheckIcon className="w-4 h-4" /> : step.id}
                    </div>
                    <p className={cn(
                    "mt-1 text-xs font-medium transition-all duration-300 break-words",
                    currentStep === step.id ? "text-primary font-semibold" : "text-muted-foreground"
                    )}>{step.name}</p>
                </div>
                {index < steps.length - 1 && (
                    <div className={cn("flex-1 h-1 mt-3.5 transition-all duration-300", currentStep > step.id ? "bg-primary" : "bg-border")} />
                )}
                </React.Fragment>
            ))}
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            {currentStep === 1 && (
                <section>
                    <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Box 1: Project Details</h3>
                    <div className="space-y-4">
                       <div>
                            <Label htmlFor="din">Your Development Identification Number (DIN)*</Label>
                            <Input id="din" {...register("din")} placeholder="Enter your DIN" />
                            {errors.din && <p className="text-destructive text-xs mt-1">{errors.din.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="originalPermitId">Original Building Permit ID*</Label>
                            <Input id="originalPermitId" {...register("originalPermitId")} placeholder="Enter the ID of your approved building permit" />
                            {errors.originalPermitId && <p className="text-destructive text-xs mt-1">{errors.originalPermitId.message}</p>}
                        </div>
                    </div>
                </section>
            )}
            
            {currentStep === 2 && (
                <section>
                    <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Box 2: Project Documents</h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="kbpNumber">KBP Number (if available)</Label>
                            <Input id="kbpNumber" {...register("kbpNumber")} placeholder="Enter the KBP number" />
                        </div>
                        <div>
                            <Label htmlFor="kdlNumber">KDL Number / KADGIS File Number</Label>
                            <Input id="kdlNumber" {...register("kdlNumber")} placeholder="Enter the KDL or KADGIS File Number" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="docCO">Copy of C of O Document (Optional)</Label>
                            <Input
                                id="docCO"
                                type="file"
                                {...register("docCO")}
                                className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            {errors.docCO && <p className="text-destructive text-xs mt-1">{errors.docCO.message as string}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="docBuildingPermit">Copy of Building Permit Document (Optional)</Label>
                            <Input
                                id="docBuildingPermit"
                                type="file"
                                {...register("docBuildingPermit")}
                                className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            {errors.docBuildingPermit && <p className="text-destructive text-xs mt-1">{errors.docBuildingPermit.message as string}</p>}
                        </div>
                    </div>
                </section>
            )}

            {currentStep === 3 && (
                 <section>
                    <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Box 3: Declaration</h3>
                    <div className="flex items-start space-x-3 p-4 border rounded-md bg-muted/30 mt-2">
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
                        <Label htmlFor="declaration" className="font-normal text-sm leading-snug">
                            I declare that the information provided is true and that the construction stage for which I seek approval complies with the plans specified in the original building permit.
                        </Label>
                    </div>
                    {errors.declaration && <p className="text-destructive text-xs mt-1 px-1">{errors.declaration.message}</p>}
                </section>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4 pt-6">
            <div className="flex w-full flex-col sm:flex-row sm:justify-between gap-2">
                <Button 
                    type="button" 
                    onClick={handlePreviousStep} 
                    disabled={currentStep === 1} 
                    variant="outline"
                    className="w-full sm:w-auto"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                {currentStep < steps.length ? (
                    <Button 
                        type="button" 
                        onClick={handleNextStep}
                        className="w-full sm:w-auto"
                    >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button 
                    type="submit" 
                    className="w-full sm:w-auto py-3 text-base"
                    disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                )}
            </div>
            <Separator className="my-2" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
