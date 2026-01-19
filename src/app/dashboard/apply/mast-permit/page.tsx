
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, type FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { saveApplication } from '@/app/actions/applicationActions';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

const phoneRegex = /^\+?[0-9\s-()]+$/;

const ceoIdOptions = [
  { id: "internationalPassport" as const, label: "International Passport" },
  { id: "taxIdCard" as const, label: "Tax Identification Card" },
  { id: "nationalIdCard" as const, label: "National ID Card" },
  { id: "driversLicense" as const, label: "Driver's License" },
  { id: "voterRegCard" as const, label: "Voter Registration Card" },
];

const representativeIdOptions = [
  { id: "internationalPassport" as const, label: "International Passport" },
  { id: "taxIdCard" as const, label: "Tax Identification Card" },
  { id: "nationalIdCard" as const, label: "National ID Card" },
  { id: "driversLicense" as const, label: "Driver's License" },
  { id: "voterRegCard" as const, label: "Voter Registration Card" },
];

const mastTypeOptions = [
  { id: "Radio" as const, label: "Radio" },
  { id: "TV" as const, label: "TV" },
  { id: "GSM" as const, label: "GSM" },
  { id: "Other" as const, label: "Other (Specify)" },
];

const requiredDocsList = [
  { id: "docLeaseAgreement", label: "Lease title, agreement and power of attorney" },
  { id: "docStructuralDrawings", label: "2 Copies of Structural Drawings and Details" },
  { id: "docSiteAnalysisReport", label: "Site Analysis Report" },
  { id: "docKepasEnvImpactAssessment", label: "Copy of KEPA's Environment Impact Assessment" },
  { id: "docSoilInvestigationReport", label: "Soil Investigation Report" },
  { id: "docTelecommunicationDesigns", label: "Telecommunication Designs" },
  { id: "docStructuralCalculationSheets", label: "Structural Calculation Sheets" },
  { id: "docElectricalWorksDrawings", label: "Electrical Works Drawings and Details" },
  { id: "docPoliceReport", label: "Police Report" },
  { id: "docConsentLetter", label: "Consent Letter" },
  { id: "docProofOfOutrightPurchase", label: "Proof of Outright Purchase" },
  { id: "docSitePlan", label: "Site Plan" },
  { id: "docNAMAApproval", label: "Nigerian Airspace Management Authority (NAMA) approval (for masts within 15km radius to any airport)" },
  { id: "docNCAAApproval", label: "Nigerian Civil Aviation Authority (NCAA) approval (for Mast greater than 70m in height)" },
  { id: "docLetterOfAttestation", label: "Letter of Attestation of Design" },
  { id: "docMechanicalWorksDrawings", label: "Mechanical Works Drawings and Details" },
  { id: "docArchitecturalWorksDrawings", label: "Architectural Works Drawings and Details" },
  { id: "docFireServiceReport", label: "Fire Service Report" },
];


const mastPermitSchema = z.object({
  kopNumber: z.string().optional(),
  kdlNumber: z.string().optional(),

  // Box 1: Applicant (Organisation)
  orgName: z.string().min(1, "Name of Organisation is required"),
  cacNumber: z.string().optional(),
  dateOfRegistration: z.date().optional(),
  orgTin: z.string().optional(),
  orgPhone: z.string().min(1, "Organisation phone is required").regex(phoneRegex, "Invalid phone number format"),
  orgEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  ceoTitle: z.string().optional(),
  ceoFirstName: z.string().min(1, "CEO First Name is required"),
  ceoMiddleName: z.string().optional(),
  ceoSurname: z.string().min(1, "CEO Surname is required"),
  ceoDesignation: z.string().optional(),
  ceoPhone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal('')),
  ceoEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  ceoIdentificationType: z.object(
    Object.fromEntries(ceoIdOptions.map(opt => [opt.id, z.boolean().optional()]))
  ).optional().default({}),
  ceoIdNumber: z.string().optional(),

  // Box 2: Site Address
  siteStreetName: z.string().min(1, "Street Name is required"),
  siteCityTown: z.string().min(1, "City/Town is required"),
  siteLGA: z.string().min(1, "L.G.A is required"),
  siteState: z.string().optional().default("Kaduna"),
  siteCoordLong: z.string().optional(),
  siteCoordLat: z.string().optional(),
  siteTypeOfLand: z.enum(["Public", "Private"], { required_error: "Type of Land is required" }),
  siteProofOfOwnership: z.string().optional(),
  siteAddInfo: z.string().optional(),

  // Box 3: Representative
  repFirstName: z.string().optional(),
  repMiddleName: z.string().optional(),
  repSurname: z.string().optional(),
  repPhone1: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal('')),
  repPhone2: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal('')),
  repEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  repIdentificationType: z.object(
    Object.fromEntries(representativeIdOptions.map(opt => [opt.id, z.boolean().optional()]))
  ).optional().default({}),
  repIdNumber: z.string().optional(),

  // Box 4: Purpose of Application
  mastType: z.enum(["Radio", "TV", "GSM", "Other"], { required_error: "Type of Mast is required" }),
  mastTypeOther: z.string().optional(),
  mastDuration: z.string().optional(),
  mastCommencementDate: z.date().optional(),
  mastCoordinates: z.string().optional(),
  mastLocationOfShield: z.string().optional(),

  // Box 5: Required Documents
  ...Object.fromEntries(requiredDocsList.map(doc => [doc.id, z.any().optional()])),

  // Box 6: Signature (Declaration)
  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit the application."
  })
}).refine(data => data.siteTypeOfLand !== "Private" || (data.siteTypeOfLand === "Private" && !!data.siteProofOfOwnership?.trim()), {
  message: "Proof of Ownership is required for Private land",
  path: ["siteProofOfOwnership"],
}).refine(data => data.mastType !== "Other" || (data.mastType === "Other" && !!data.mastTypeOther?.trim()), {
  message: "Specify 'Other' for mast type",
  path: ["mastTypeOther"],
});

type MastPermitFormValues = z.infer<typeof mastPermitSchema>;

const steps = [
  { id: 1, name: "Applicant (Organisation)", fields: ['orgName', 'orgPhone', 'ceoFirstName', 'ceoSurname'] as FieldName<MastPermitFormValues>[] },
  { id: 2, name: "Site Address", fields: ['siteStreetName', 'siteCityTown', 'siteLGA', 'siteTypeOfLand'] as FieldName<MastPermitFormValues>[] },
  { id: 3, name: "Representative", fields: ['repEmail'] as FieldName<MastPermitFormValues>[] }, // Making repEmail a trigger field for example
  { id: 4, name: "Purpose of Application", fields: ['mastType'] as FieldName<MastPermitFormValues>[] },
  { id: 5, name: "Documents & Declaration", fields: ['declaration'] as FieldName<MastPermitFormValues>[] },
];

import { useFormPersistence } from '@/hooks/use-form-persistence';

export default function MastPermitPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (!currentUser) {
        toast({ title: 'Authentication Error', description: 'You must be logged in to proceed.', variant: 'destructive' });
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, [router, toast]);

  const form = useForm<MastPermitFormValues>({
    resolver: zodResolver(mastPermitSchema),
    mode: "onChange",
    defaultValues: {
      kopNumber: "",
      kdlNumber: "",
      orgName: "",
      cacNumber: "",
      orgTin: "",
      orgPhone: "",
      orgEmail: "",
      ceoTitle: "",
      ceoFirstName: "",
      ceoMiddleName: "",
      ceoSurname: "",
      ceoDesignation: "",
      ceoPhone: "",
      ceoEmail: "",
      ceoIdentificationType: {},
      ceoIdNumber: "",
      siteStreetName: "",
      siteCityTown: "",
      siteLGA: "",
      siteState: "Kaduna",
      siteCoordLong: "",
      siteCoordLat: "",
      // siteTypeOfLand: undefined, 
      siteProofOfOwnership: "",
      siteAddInfo: "",
      repFirstName: "",
      repMiddleName: "",
      repSurname: "",
      repPhone1: "",
      repPhone2: "",
      repEmail: "",
      repIdentificationType: {},
      repIdNumber: "",
      // mastType: undefined,
      mastTypeOther: "",
      mastDuration: "",
      // mastCommencementDate: undefined,
      mastCoordinates: "",
      mastLocationOfShield: "",
      declaration: false,
      ...Object.fromEntries(requiredDocsList.map(doc => [doc.id, undefined])),
    }
  });

  const { register, handleSubmit, control, formState: { errors }, trigger, watch } = form;

  const { clearStorage } = useFormPersistence(form, 'mast-permit-form', requiredDocsList.map(doc => doc.id));

  const watchedTypeOfLand = watch("siteTypeOfLand");
  const watchedMastType = watch("mastType");

  const onSubmit = async (data: MastPermitFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to submit an application.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('type', "Mast Installation Permit");
    formData.append('applicantName', data.orgName);
    formData.append('userId', user.id);

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        if (value[0].size > 0) {
          formData.append(key, value[0]);
        }
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === 'object' && value !== null && !(value instanceof FileList)) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (typeof nestedValue === 'boolean' && nestedValue) {
            formData.append(`${key}.${nestedKey}`, 'on');
          }
        });
      } else if (typeof value === 'boolean' && value) {
        formData.append(key, 'on');
      } else if (value) {
        formData.append(key, String(value));
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
    if (currentStepConfig && currentStepConfig.fields.length > 0) {
      const isValid = await trigger(currentStepConfig.fields as any);
      if (!isValid) {
        toast({ title: "Validation Error", description: "Please correct the errors before proceeding.", variant: "destructive" });
        return;
      }
    }
    if (currentStep === 2 && watchedTypeOfLand === "Private" && !watch('siteProofOfOwnership')?.trim()) {
      await trigger('siteProofOfOwnership');
      if (errors.siteProofOfOwnership) {
        toast({ title: "Validation Error", description: "Proof of Ownership is required for Private land.", variant: "destructive" });
        return;
      }
    }
    if (currentStep === 4 && watchedMastType === "Other" && !watch('mastTypeOther')?.trim()) {
      await trigger('mastTypeOther');
      if (errors.mastTypeOther) {
        toast({ title: "Validation Error", description: "Specify 'Other' for mast type.", variant: "destructive" });
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

  if (!user) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Verifying user session...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-2">
            <span className="text-4xl font-bold text-primary mr-2">MP</span>
            <div className="text-sm">
              <p className="font-semibold">KADUNA STATE OF NIGERIA</p>
              <p>Kaduna State Urban Planning and Development Authority</p>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Application For Grant of Mast Installation Permit
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="mb-8 p-2 sm:p-4 border rounded-lg shadow-sm overflow-x-auto">
        <div className="flex items-start w-full min-w-[400px] sm:min-w-full">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center px-0.5 sm:px-1 py-1 flex-shrink-0" style={{ width: `${100 / steps.length}%` }}>
                <div className={cn("w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300", currentStep > step.id ? "bg-primary border-primary text-primary-foreground" : currentStep === step.id ? "bg-primary/20 border-primary text-primary scale-110" : "bg-muted border-border text-muted-foreground")}>
                  {currentStep > step.id ? <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : step.id}
                </div>
                <p className={cn("mt-1 text-[10px] leading-tight sm:text-xs font-medium transition-all duration-300 break-words", currentStep === step.id ? "text-primary font-semibold" : "text-muted-foreground")}>{step.name}</p>
              </div>
              {index < steps.length - 1 && (<div className={cn("flex-1 h-0.5 sm:h-1 mt-2.5 sm:mt-3.5 mx-0.5 sm:mx-1 transition-all duration-300", currentStep > step.id ? "bg-primary" : "bg-border")} />)}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-1">
          <div>
            <Label htmlFor="kopNumber">KOP Number</Label>
            <Input id="kopNumber" {...register("kopNumber")} />
          </div>
          <div>
            <Label htmlFor="kdlNumber">KDL / KADGIS FILE NUMBER</Label>
            <Input id="kdlNumber" {...register("kdlNumber")} />
          </div>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 1: APPLICANT (Organisation)</CardTitle><CardDescription className="text-xs sm:text-sm">All applicants must complete Box 1 in full. All applicants must submit the original documents used to identify the organisations; they will be copied and retained. The original identification document used to prove identity of the MD/CEO/Chairman must be submitted; it will be copied and retained.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="orgName">Name of Organisation*</Label><Input id="orgName" {...register("orgName")} />{errors.orgName && <p className="text-destructive text-xs mt-1">{errors.orgName.message}</p>}</div>
                <div><Label htmlFor="cacNumber">Corporate Affairs Commission Number (CAC)</Label><Input id="cacNumber" {...register("cacNumber")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><Label htmlFor="dateOfRegistration">Date of Registration</Label><Controller name="dateOfRegistration" control={control} render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal mt-1"><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>)} />{errors.dateOfRegistration && <p className="text-destructive text-xs mt-1">{errors.dateOfRegistration.message}</p>}</div>
                <div><Label htmlFor="orgTin">Tax Identification Number (TIN)</Label><Input id="orgTin" {...register("orgTin")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="orgPhone">Phone*</Label><Input id="orgPhone" type="tel" {...register("orgPhone")} />{errors.orgPhone && <p className="text-destructive text-xs mt-1">{errors.orgPhone.message}</p>}</div>
                <div><Label htmlFor="orgEmail">Email</Label><Input id="orgEmail" type="email" {...register("orgEmail")} />{errors.orgEmail && <p className="text-destructive text-xs mt-1">{errors.orgEmail.message}</p>}</div>
              </div>
              <Separator className="my-6" />
              <p className="font-semibold text-md">CEO/MD/Chairman Information</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><Label htmlFor="ceoTitle">Title</Label><Input id="ceoTitle" {...register("ceoTitle")} /></div>
                <div><Label htmlFor="ceoFirstName">First Name*</Label><Input id="ceoFirstName" {...register("ceoFirstName")} />{errors.ceoFirstName && <p className="text-destructive text-xs mt-1">{errors.ceoFirstName.message}</p>}</div>
                <div><Label htmlFor="ceoMiddleName">Middle Name</Label><Input id="ceoMiddleName" {...register("ceoMiddleName")} /></div>
                <div><Label htmlFor="ceoSurname">Surname*</Label><Input id="ceoSurname" {...register("ceoSurname")} />{errors.ceoSurname && <p className="text-destructive text-xs mt-1">{errors.ceoSurname.message}</p>}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="ceoDesignation">Designation</Label><Input id="ceoDesignation" {...register("ceoDesignation")} /></div>
                <div><Label htmlFor="ceoPhone">Phone</Label><Input id="ceoPhone" type="tel" {...register("ceoPhone")} />{errors.ceoPhone && <p className="text-destructive text-xs mt-1">{errors.ceoPhone.message}</p>}</div>
                <div><Label htmlFor="ceoEmail">Email</Label><Input id="ceoEmail" type="email" {...register("ceoEmail")} />{errors.ceoEmail && <p className="text-destructive text-xs mt-1">{errors.ceoEmail.message}</p>}</div>
              </div>
              <div>
                <Label>CEO/MD/Chairman Identification</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                  {ceoIdOptions.map(opt => (<div key={opt.id} className="flex items-center space-x-2"><Controller name={`ceoIdentificationType.${opt.id}`} control={control} render={({ field }) => (<Checkbox id={`ceo_${opt.id}`} checked={!!field.value} onCheckedChange={field.onChange} />)} /><Label htmlFor={`ceo_${opt.id}`} className="font-normal text-xs sm:text-sm">{opt.label}</Label></div>))}
                </div>
              </div>
              <div><Label htmlFor="ceoIdNumber">ID Number</Label><Input id="ceoIdNumber" {...register("ceoIdNumber")} /></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 2: SITE ADDRESS</CardTitle><CardDescription className="text-xs sm:text-sm">All applicants must complete Box 2 in full. This should be the Site Address for the Mast.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="siteStreetName">Street Name*</Label><Input id="siteStreetName" {...register("siteStreetName")} />{errors.siteStreetName && <p className="text-destructive text-xs mt-1">{errors.siteStreetName.message}</p>}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="siteCityTown">City/Town*</Label><Input id="siteCityTown" {...register("siteCityTown")} />{errors.siteCityTown && <p className="text-destructive text-xs mt-1">{errors.siteCityTown.message}</p>}</div>
                <div><Label htmlFor="siteLGA">L.G.A*</Label><Input id="siteLGA" {...register("siteLGA")} />{errors.siteLGA && <p className="text-destructive text-xs mt-1">{errors.siteLGA.message}</p>}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="siteState">State</Label><Input id="siteState" {...register("siteState")} /></div>
                <div><Label htmlFor="siteCoordLong">Coordinate (Long)</Label><Input id="siteCoordLong" {...register("siteCoordLong")} /></div>
                <div><Label htmlFor="siteCoordLat">Coordinate (Lat)</Label><Input id="siteCoordLat" {...register("siteCoordLat")} /></div>
              </div>
              <div>
                <Label>Type of Land*</Label>
                <Controller name="siteTypeOfLand" control={control} render={({ field }) => (<RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 mt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="Public" id="land_public" /><Label htmlFor="land_public" className="font-normal">Public</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Private" id="land_private" /><Label htmlFor="land_private" className="font-normal">Private</Label></div></RadioGroup>)} />
                {errors.siteTypeOfLand && <p className="text-destructive text-xs mt-1">{errors.siteTypeOfLand.message}</p>}
              </div>
              {watchedTypeOfLand === "Private" && (<div><Label htmlFor="siteProofOfOwnership">If Private, Provide Proof of Ownership*</Label><Textarea id="siteProofOfOwnership" {...register("siteProofOfOwnership")} />{errors.siteProofOfOwnership && <p className="text-destructive text-xs mt-1">{errors.siteProofOfOwnership.message}</p>}</div>)}
              <div><Label htmlFor="siteAddInfo">Add. Information</Label><Textarea id="siteAddInfo" {...register("siteAddInfo")} /></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 3: REPRESENTATIVE (Optional)</CardTitle><CardDescription className="text-xs sm:text-sm">Applicants who wish to appoint a representative must complete Box 3 in full. Original identification document is required.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="repFirstName">First Name</Label><Input id="repFirstName" {...register("repFirstName")} /></div>
                <div><Label htmlFor="repMiddleName">Middle Name</Label><Input id="repMiddleName" {...register("repMiddleName")} /></div>
                <div><Label htmlFor="repSurname">Surname</Label><Input id="repSurname" {...register("repSurname")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="repPhone1">Phone 1</Label><Input id="repPhone1" type="tel" {...register("repPhone1")} />{errors.repPhone1 && <p className="text-destructive text-xs mt-1">{errors.repPhone1.message}</p>}</div>
                <div><Label htmlFor="repPhone2">Phone 2</Label><Input id="repPhone2" type="tel" {...register("repPhone2")} />{errors.repPhone2 && <p className="text-destructive text-xs mt-1">{errors.repPhone2.message}</p>}</div>
                <div><Label htmlFor="repEmail">Email</Label><Input id="repEmail" type="email" {...register("repEmail")} />{errors.repEmail && <p className="text-destructive text-xs mt-1">{errors.repEmail.message}</p>}</div>
              </div>
              <div>
                <Label>Representative's Identification</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                  {representativeIdOptions.map(opt => (<div key={opt.id} className="flex items-center space-x-2"><Controller name={`repIdentificationType.${opt.id}`} control={control} render={({ field }) => (<Checkbox id={`rep_${opt.id}`} checked={!!field.value} onCheckedChange={field.onChange} />)} /><Label htmlFor={`rep_${opt.id}`} className="font-normal text-xs sm:text-sm">{opt.label}</Label></div>))}
                </div>
              </div>
              <div><Label htmlFor="repIdNumber">Representative's ID Number</Label><Input id="repIdNumber" {...register("repIdNumber")} /></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 4: PURPOSE OF APPLICATION</CardTitle><CardDescription className="text-xs sm:text-sm">All applicants must complete Box 4 in full. This should describe the purpose of the outdoor activity that the applicant is wishing to apply for.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Type of Mast*</Label>
                <Controller name="mastType" control={control} render={({ field }) => (<RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-2">{mastTypeOptions.map(opt => (<div key={opt.id} className="flex items-center space-x-2"><RadioGroupItem value={opt.id} id={`mast_${opt.id}`} /><Label htmlFor={`mast_${opt.id}`} className="font-normal text-sm">{opt.label}</Label></div>))}</RadioGroup>)} />
                {errors.mastType && <p className="text-destructive text-xs mt-1">{errors.mastType.message}</p>}
                {watchedMastType === "Other" && (<div className="mt-2"><Label htmlFor="mastTypeOther" className="sr-only">Specify Other Mast Type</Label><Input id="mastTypeOther" placeholder="Specify other mast type" {...register("mastTypeOther")} />{errors.mastTypeOther && <p className="text-destructive text-xs mt-1">{errors.mastTypeOther.message}</p>}</div>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="mastDuration">Duration</Label><Input id="mastDuration" {...register("mastDuration")} /></div>
                <div><Label htmlFor="mastCommencementDate">Commencement Date</Label><Controller name="mastCommencementDate" control={control} render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal mt-1"><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>)} />{errors.mastCommencementDate && <p className="text-destructive text-xs mt-1">{errors.mastCommencementDate.message}</p>}</div>
              </div>
              <div><Label htmlFor="mastCoordinates">Coordinates</Label><Input id="mastCoordinates" {...register("mastCoordinates")} /></div>
              <div><Label htmlFor="mastLocationOfShield">Location of the shield</Label><Textarea id="mastLocationOfShield" {...register("mastLocationOfShield")} /></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 5 & 6: REQUIRED DOCUMENTS & SIGNATURE</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-md font-semibold">BOX 5: Required Documents</Label>
                <CardDescription className="text-xs sm:text-sm mb-2">Applicants should submit all relevant documents. Please note that any drawings should be endorsed by a relevant professional.</CardDescription>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {requiredDocsList.map(doc => (
                    <div key={doc.id} className="space-y-1.5">
                      <Label htmlFor={doc.id} className="text-sm font-medium">{doc.label}</Label>
                      <Input id={doc.id} type="file" {...register(doc.id as any)} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-md font-semibold">BOX 6: Signature</Label>
                <CardDescription className="text-xs sm:text-sm mb-2">All applicants must affix their signature; the application will not be accepted without a signature. In the case of a representative, they must also affix their signature.</CardDescription>
                <div className="flex items-start space-x-2 p-4 border rounded-md bg-muted/30 mt-2">
                  <Controller name="declaration" control={control} render={({ field }) => (<Checkbox id="declaration" checked={!!field.value} onCheckedChange={field.onChange} className="mt-1" />)} />
                  <Label htmlFor="declaration" className="font-normal text-sm leading-snug">I, the applicant or duly authorized representative, declare that the information provided in this application and any attached documents is true, correct, and complete to the best of my knowledge and belief. I understand that any false statement may result in the rejection of this application or revocation of any permit granted.</Label>
                </div>
                {errors.declaration && <p className="text-destructive text-xs mt-1 px-1">{errors.declaration.message}</p>}
                <div className="mt-2 px-1 text-xs text-muted-foreground space-y-1">
                  <p>Applicant's Signature: <span className="font-medium">[Digital acceptance via checkbox]</span></p>
                  <p>Representative's Signature: <span className="font-medium">[Digital acceptance via checkbox, if representative details filled]</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <CardFooter className="flex flex-col items-center space-y-4 pt-6">
          <div className="flex w-full flex-col sm:flex-row sm:justify-between gap-2">
            <Button type="button" onClick={handlePreviousStep} disabled={currentStep === 1} variant="outline" className="w-full sm:w-auto"><ChevronLeft className="mr-2 h-4 w-4" /> Previous</Button>
            {currentStep < steps.length ? (<Button type="button" onClick={handleNextStep} className="w-full sm:w-auto">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>) : (<Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto py-3 text-base sm:text-lg">{isSubmitting ? 'Submitting...' : 'Submit Application'}</Button>)}
          </div>
          <Separator className="my-2" />
          <p className="text-xs text-muted-foreground text-center">KASUPDA Regulations, 2025 &nbsp;&nbsp;|&nbsp;&nbsp; Version 1.1 2025</p>
        </CardFooter>
      </form>
    </div>
  );
}

// Simple CheckIcon for stepper
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
