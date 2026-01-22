
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { saveApplication } from '@/app/actions/applicationActions';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

const phoneRegex = /^\d{11}$/;

const outdoorActivityTypes = [
  { id: "signboard" as const, label: "Signboard", needsSpecify: true, specifyLabel: "Specify Size" },
  { id: "carWash" as const, label: "Car Wash" },
  { id: "blockIndustry" as const, label: "Block Industry" },
  { id: "horticulture" as const, label: "Horticulture" },
  { id: "kiosk" as const, label: "Kiosk" },
  { id: "makeshift" as const, label: "Makeshift" },
  { id: "others" as const, label: "Others", needsSpecify: true, specifyLabel: "Specify Other Activity" },
];

const representativeIdOptions = [
  { id: "internationalPassport" as const, label: "International Passport" },
  { id: "voterRegCard" as const, label: "Voter Registration Card" },
  { id: "driversLicense" as const, label: "Driver's License" },
  { id: "nationalIdCard" as const, label: "National ID Card" },
];

const requiredDocsList = [
  { id: "docConsentLetter" as const, label: "Consent Letter" },
  { id: "docProofOfOutrightPurchase" as const, label: "Proof of Outright Purchase" },
  { id: "docImagerySketch" as const, label: "Imagery & Sketch" },
  { id: "docSiteLocationInstallationCoordinates" as const, label: "Site Location & Type of Installation with Coordinates" },
  { id: "docLeaseAgreementLetter" as const, label: "Lease Agreement Letter" },
];

const outdoorAdvertisementPermitSchema = z.object({
  kopNumber: z.string().optional(),
  // Box 1: Applicant
  applicantCompanyNameIndividual: z.string().min(1, "Company Name/Individual is required"),
  applicantPhone: z.string().length(11, "Phone number must be exactly 11 digits").regex(phoneRegex, "Phone number must contain only digits"),
  applicantEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  applicantFullNameContact: z.string().min(1, "Full Name and Contact of Applicant is required"),

  outdoorActivity: z.object(
    Object.fromEntries(outdoorActivityTypes.map(type => [type.id, z.boolean().optional()]))
  ).refine(data => Object.values(data).some(val => val === true), {
    message: "At least one type of outdoor activity must be selected.",
  }),
  outdoorActivitySignboardSize: z.string().optional(),
  outdoorActivityOthersSpecify: z.string().optional(),

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
  repPhone1: z.string().regex(phoneRegex, "Phone number must be exactly 11 digits").optional().or(z.literal('')),
  repPhone2: z.string().regex(phoneRegex, "Phone number must be exactly 11 digits").optional().or(z.literal('')),
  repEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  repIdentificationType: z.object(
    Object.fromEntries(representativeIdOptions.map(type => [type.id, z.boolean().optional()]))
  ).optional().default({}),
  repIdNumber: z.string().optional(),

  // Box 4: Required Documents
  docImagerySketch: z.any().optional(),
  docSiteLocationInstallationCoordinates: z.any().optional(),
  docLeaseAgreementLetter: z.any().optional(),
  docProofOfOutrightPurchase: z.any().optional(),
  docConsentLetter: z.any().optional(),

  // Box 5: Signature
  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit the application."
  })
}).refine(data => !data.outdoorActivity.signboard || (data.outdoorActivity.signboard && !!data.outdoorActivitySignboardSize?.trim()), {
  message: "Specify Size for Signboard is required",
  path: ["outdoorActivitySignboardSize"],
}).refine(data => !data.outdoorActivity.others || (data.outdoorActivity.others && !!data.outdoorActivityOthersSpecify?.trim()), {
  message: "Specify 'Others' for outdoor activity",
  path: ["outdoorActivityOthersSpecify"],
}).refine(data => data.siteTypeOfLand !== "Private" || (data.siteTypeOfLand === "Private" && !!data.siteProofOfOwnership?.trim()), {
  message: "Proof of Ownership is required for Private land",
  path: ["siteProofOfOwnership"],
});

type OutdoorAdvertisementPermitFormValues = z.infer<typeof outdoorAdvertisementPermitSchema>;

const steps = [
  { id: 1, name: "Applicant Details", fields: ['applicantCompanyNameIndividual', 'applicantPhone', 'applicantFullNameContact', 'outdoorActivity'] as FieldName<OutdoorAdvertisementPermitFormValues>[] },
  { id: 2, name: "Site Address", fields: ['siteStreetName', 'siteCityTown', 'siteLGA', 'siteTypeOfLand'] as FieldName<OutdoorAdvertisementPermitFormValues>[] },
  { id: 3, name: "Representative", fields: ['repEmail'] as FieldName<OutdoorAdvertisementPermitFormValues>[] }, // Example trigger field
  { id: 4, name: "Documents & Declaration", fields: ['declaration'] as FieldName<OutdoorAdvertisementPermitFormValues>[] },
];

import { useFormPersistence } from '@/hooks/use-form-persistence';

export default function OutdoorAdvertisementPermitPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?redirectTo=/dashboard/apply/outdoor-advertisement-permit');
      } else {
        setUser(session.user);
      }
    };
    checkSession();
  }, [router]);

  const form = useForm<OutdoorAdvertisementPermitFormValues>({
    resolver: zodResolver(outdoorAdvertisementPermitSchema),
    mode: "onChange",
    defaultValues: {
      kopNumber: "",
      applicantCompanyNameIndividual: "",
      applicantPhone: "",
      applicantEmail: "",
      applicantFullNameContact: "",
      outdoorActivity: {},
      outdoorActivitySignboardSize: "",
      outdoorActivityOthersSpecify: "",
      siteStreetName: "",
      siteCityTown: "",
      siteLGA: "",
      siteState: "Kaduna",
      siteCoordLong: "",
      siteCoordLat: "",
      // siteTypeOfLand: undefined, // Handled by Zod
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
      declaration: false,
      ...Object.fromEntries(requiredDocsList.map(doc => [doc.id, undefined])),
    }
  });

  const { register, handleSubmit, control, formState: { errors }, trigger, watch } = form;

  const { clearStorage } = useFormPersistence(form, 'outdoor-advertisement-permit-form', requiredDocsList.map(doc => doc.id));

  const watchedOutdoorActivity = watch("outdoorActivity");
  const watchedTypeOfLand = watch("siteTypeOfLand");

  const onSubmit = async (data: OutdoorAdvertisementPermitFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to submit an application.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    // Create a FormData object to handle file uploads and other data
    const formData = new FormData();

    formData.append('type', "Outdoor Advertisement Permit");
    formData.append('applicantName', data.applicantCompanyNameIndividual);
    formData.append('userId', user.id);

    // Iterate over the form data and append to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        if (value[0].size > 0) {
          formData.append(key, value[0]);
        }
      } else if (typeof value === 'object' && value !== null && !(value instanceof FileList)) {
        // For nested objects like 'outdoorActivity' or 'repIdentificationType'
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (typeof nestedValue === 'boolean' && nestedValue) {
            formData.append(`${key}.${nestedKey}`, 'on');
          } else if (nestedValue) {
            formData.append(`${key}.${nestedKey}`, String(nestedValue));
          }
        });
      } else if (typeof value === 'boolean' && value) {
        formData.append(key, 'on');
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
    if (currentStepConfig && currentStepConfig.fields.length > 0) {
      const isValid = await trigger(currentStepConfig.fields as any);
      if (!isValid) {
        toast({ title: "Validation Error", description: "Please correct the errors before proceeding.", variant: "destructive" });
        return;
      }
    }
    // Specific conditional validation before proceeding from step 1
    if (currentStep === 1) {
      if (watchedOutdoorActivity?.signboard && !watch('outdoorActivitySignboardSize')?.trim()) {
        await trigger('outdoorActivitySignboardSize');
        if (errors.outdoorActivitySignboardSize) {
          toast({ title: "Validation Error", description: errors.outdoorActivitySignboardSize.message, variant: "destructive" });
          return;
        }
      }
      if (watchedOutdoorActivity?.others && !watch('outdoorActivityOthersSpecify')?.trim()) {
        await trigger('outdoorActivityOthersSpecify');
        if (errors.outdoorActivityOthersSpecify) {
          toast({ title: "Validation Error", description: errors.outdoorActivityOthersSpecify.message, variant: "destructive" });
          return;
        }
      }
    }
    // Specific conditional validation for step 2
    if (currentStep === 2 && watchedTypeOfLand === "Private" && !watch('siteProofOfOwnership')?.trim()) {
      await trigger('siteProofOfOwnership');
      if (errors.siteProofOfOwnership) {
        toast({ title: "Validation Error", description: errors.siteProofOfOwnership.message, variant: "destructive" });
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
            <span className="text-4xl font-bold text-primary mr-2">KOP</span> {/* Kaduna Outdoor Permit */}
            <div className="text-sm">
              <p className="font-semibold">KADUNA STATE OF NIGERIA</p>
              <p>Kaduna State Urban Planning and Development Authority</p>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Application For Outdoor Advertisement (others)
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="mb-8 p-2 sm:p-4 border rounded-lg shadow-sm overflow-x-auto">
        <div className="flex items-start w-full min-w-[360px] sm:min-w-full">
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
        <div className="mb-6 px-1">
          <Label htmlFor="kopNumber">KOP Number</Label>
          <Input id="kopNumber" {...register("kopNumber")} />
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">BOX 1: APPLICANT</CardTitle>
              <CardDescription className="text-xs sm:text-sm">The Company/Individual whose name will be reflected on the license to the permit. Original identification document used to prove identity must be submitted; it will be copied and returned.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="applicantCompanyNameIndividual">Company Name/Individual*</Label><Input id="applicantCompanyNameIndividual" {...register("applicantCompanyNameIndividual")} />{errors.applicantCompanyNameIndividual && <p className="text-destructive text-xs mt-1">{errors.applicantCompanyNameIndividual.message}</p>}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="applicantPhone">Phone Number*</Label><Input id="applicantPhone" type="tel" {...register("applicantPhone")} />{errors.applicantPhone && <p className="text-destructive text-xs mt-1">{errors.applicantPhone.message}</p>}</div>
                <div><Label htmlFor="applicantEmail">Email Address</Label><Input id="applicantEmail" type="email" {...register("applicantEmail")} />{errors.applicantEmail && <p className="text-destructive text-xs mt-1">{errors.applicantEmail.message}</p>}</div>
              </div>
              <div><Label htmlFor="applicantFullNameContact">Full Name and Contact of (Applicant/CEO)*</Label><Input id="applicantFullNameContact" {...register("applicantFullNameContact")} />{errors.applicantFullNameContact && <p className="text-destructive text-xs mt-1">{errors.applicantFullNameContact.message}</p>}</div>

              <div>
                <Label>Type of Outdoor Activity*</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                  {outdoorActivityTypes.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <Controller name={`outdoorActivity.${opt.id}`} control={control} render={({ field }) => (<Checkbox id={`activity_${opt.id}`} checked={!!field.value} onCheckedChange={field.onChange} />)} />
                      <Label htmlFor={`activity_${opt.id}`} className="font-normal text-xs sm:text-sm">{opt.label}</Label>
                    </div>
                  ))}
                </div>
                {errors.outdoorActivity && <p className="text-destructive text-xs mt-1">{errors.outdoorActivity.message || (errors.outdoorActivity as any)?.root?.message}</p>}

                {watchedOutdoorActivity?.signboard && (
                  <div className="mt-2"><Label htmlFor="outdoorActivitySignboardSize" className="sr-only">Specify Size for Signboard</Label><Input id="outdoorActivitySignboardSize" placeholder="Specify Size for Signboard" {...register("outdoorActivitySignboardSize")} />{errors.outdoorActivitySignboardSize && <p className="text-destructive text-xs mt-1">{errors.outdoorActivitySignboardSize.message}</p>}</div>
                )}
                {watchedOutdoorActivity?.others && (
                  <div className="mt-2"><Label htmlFor="outdoorActivityOthersSpecify" className="sr-only">Specify Other Activity</Label><Input id="outdoorActivityOthersSpecify" placeholder="Specify other activity" {...register("outdoorActivityOthersSpecify")} />{errors.outdoorActivityOthersSpecify && <p className="text-destructive text-xs mt-1">{errors.outdoorActivityOthersSpecify.message}</p>}</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 2: SITE ADDRESS</CardTitle><CardDescription className="text-xs sm:text-sm">All applicants must complete Box 2 in full. This should be the Site Address for the Advertisement.</CardDescription></CardHeader>
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
                <Controller name="siteTypeOfLand" control={control} render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Public" id="land_public" /><Label htmlFor="land_public" className="font-normal">Public</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Private" id="land_private" /><Label htmlFor="land_private" className="font-normal">Private</Label></div>
                  </RadioGroup>
                )} />
                {errors.siteTypeOfLand && <p className="text-destructive text-xs mt-1">{errors.siteTypeOfLand.message}</p>}
              </div>
              {watchedTypeOfLand === "Private" && (
                <div><Label htmlFor="siteProofOfOwnership">If Private, Provide Proof of Ownership*</Label><Textarea id="siteProofOfOwnership" {...register("siteProofOfOwnership")} />{errors.siteProofOfOwnership && <p className="text-destructive text-xs mt-1">{errors.siteProofOfOwnership.message}</p>}</div>
              )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-2">
                  {representativeIdOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <Controller name={`repIdentificationType.${opt.id}`} control={control} render={({ field }) => (<Checkbox id={`rep_id_${opt.id}`} checked={!!field.value} onCheckedChange={field.onChange} />)} />
                      <Label htmlFor={`rep_id_${opt.id}`} className="font-normal text-sm">{opt.label}</Label>
                    </div>
                  ))}
                </div>
                {errors.repIdentificationType && <p className="text-destructive text-xs mt-1">{errors.repIdentificationType.message || (errors.repIdentificationType as any)?.root?.message}</p>}
              </div>
              <div><Label htmlFor="repIdNumber">Representative's ID Number</Label><Input id="repIdNumber" {...register("repIdNumber")} /></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 4 & 5: REQUIRED DOCUMENTS & SIGNATURE</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-md font-semibold">BOX 4: Required Documents</Label>
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
                <Label className="text-md font-semibold">BOX 5: Signature</Label>
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
            {currentStep < steps.length ? (
              <Button type="button" onClick={handleNextStep} className="w-full sm:w-auto">Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto py-3 text-base sm:text-lg">{isSubmitting ? 'Submitting...' : 'Submit Application'}</Button>
            )}
          </div>
          <Separator className="my-2" />
          <p className="text-xs text-muted-foreground text-center">KASUPDA Outdoor Permit, 2022 &nbsp;&nbsp;|&nbsp;&nbsp; Version 1.0 2022</p>
        </CardFooter>
      </form>
    </div>
  );
}

// Simple CheckIcon for stepper
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  );
}
