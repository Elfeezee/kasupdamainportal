
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
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const stageApprovalSchema = z.object({
  // Box 1: Applicant & Site Details
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  surname: z.string().min(1, "Surname is required"),
  applicantAddress: z.string().min(1, "Applicant Address is required"),
  plotAddress: z.string().min(1, "Plot Address is required"),

  // Box 2: Project Details & Documents
  kbpNumber: z.string().min(1, "KBP Number is required"),
  kdlNumber: z.string().min(1, "KDL Number / KADGIS File Number is required"),
  doc_co: z.any()
    .refine((files) => files?.length > 0, "C of O Document is required")
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 50MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted."
    ),
  doc_building_permit: z.any()
    .refine((files) => files?.length > 0, "Building Permit Document is required")
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted."
    ),

  // Box 3: Declaration
  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit the application."
  })
});

type StageApprovalFormValues = z.infer<typeof stageApprovalSchema>;

const steps = [
  { id: 1, name: "Applicant Details", fields: ['firstName', 'middleName', 'surname', 'applicantAddress', 'plotAddress'] as FieldName<StageApprovalFormValues>[] },
  { id: 2, name: "Project Documents", fields: ['kbpNumber', 'kdlNumber', 'doc_co', 'doc_building_permit'] as FieldName<StageApprovalFormValues>[] },
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

import { useFormPersistence } from '@/hooks/use-form-persistence';

export default function StageApprovalPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?redirectTo=/dashboard/apply/stage-approval');
    }
  }, [sessionStatus, router]);

  const form = useForm<StageApprovalFormValues>({
    resolver: zodResolver(stageApprovalSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, control, formState: { errors }, trigger } = form;

  const { clearStorage } = useFormPersistence(form, 'stage-approval-form', ['doc_co', 'doc_building_permit']);

  const onSubmit = async (data: StageApprovalFormValues) => {
    if (!session?.user) {
      toast({ title: "Error", description: "You must be logged in to submit.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('type', "Stage Approval Application");
    const applicantName = `${data.firstName} ${data.surname}`;
    formData.append('applicantName', applicantName);
    formData.append('userId', session.user.id);

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'doc_co' || key === 'doc_building_permit') {
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
        clearStorage();
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
      const isValid = await trigger(currentStepConfig.fields as any);
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

  if (sessionStatus === 'loading') {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-3">
            <ClipboardCheck className="h-7 w-7" />
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
                <div className="flex flex-col items-center text-center px-1 py-1 flex-shrink-0" style={{ width: `${100 / steps.length}%` }}>
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
                <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Box 1: Applicant Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name*</Label>
                      <Input id="firstName" {...register("firstName")} placeholder="Admin" />
                      {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input id="middleName" {...register("middleName")} placeholder="" />
                      {errors.middleName && <p className="text-destructive text-xs mt-1">{errors.middleName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="surname">Surname*</Label>
                      <Input id="surname" {...register("surname")} placeholder="" />
                      {errors.surname && <p className="text-destructive text-xs mt-1">{errors.surname.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="applicantAddress">Applicant Address*</Label>
                    <textarea
                      id="applicantAddress"
                      {...register("applicantAddress")}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter applicant address"
                    />
                    {errors.applicantAddress && <p className="text-destructive text-xs mt-1">{errors.applicantAddress.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="plotAddress">Plot Address*</Label>
                    <textarea
                      id="plotAddress"
                      {...register("plotAddress")}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter plot address"
                    />
                    {errors.plotAddress && <p className="text-destructive text-xs mt-1">{errors.plotAddress.message}</p>}
                  </div>
                </div>
              </section>
            )}

            {currentStep === 2 && (
              <section>
                <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Box 2: Project Documents</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="kbpNumber">KBP Number*</Label>
                    <Input id="kbpNumber" {...register("kbpNumber")} placeholder="Enter the KBP number" />
                    {errors.kbpNumber && <p className="text-destructive text-xs mt-1">{errors.kbpNumber.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="kdlNumber">KDL Number / KADGIS File Number*</Label>
                    <Input id="kdlNumber" {...register("kdlNumber")} placeholder="Enter the KDL or KADGIS File Number" />
                    {errors.kdlNumber && <p className="text-destructive text-xs mt-1">{errors.kdlNumber.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="doc_co">Copy of C of O Document*</Label>
                    <Input
                      id="doc_co"
                      type="file"
                      {...register("doc_co")}
                      className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {errors.doc_co && <p className="text-destructive text-xs mt-1">{errors.doc_co.message as string}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="doc_building_permit">Copy of Building Permit Document*</Label>
                    <Input
                      id="doc_building_permit"
                      type="file"
                      {...register("doc_building_permit")}
                      className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {errors.doc_building_permit && <p className="text-destructive text-xs mt-1">{errors.doc_building_permit.message as string}</p>}
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
