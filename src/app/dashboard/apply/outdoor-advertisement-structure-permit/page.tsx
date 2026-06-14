
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, type FieldName, type UseFormWatch } from 'react-hook-form';
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
import { useSession } from 'next-auth/react';

const phoneRegex = /^\d{11}$/;

const boardInstallationTypes = [
  { id: "ledDigitalBillboard" as const, label: "LED/Digital Billboard" },
  { id: "unipoleSpectacular" as const, label: "Unipole Spectacular" },
  { id: "lightBox" as const, label: "LightBox" },
  { id: "portraitUnipole" as const, label: "Portrait Unipole" },
  { id: "largeFormat" as const, label: "Large Format" },
  { id: "lightedBillboard" as const, label: "Lighted Billboard" },
  { id: "lampPost" as const, label: "Lamp Post" },
  { id: "gantry" as const, label: "Gantry" },
  { id: "othersSpecify" as const, label: "Others Specify" },
];

const representativeIdOptions = [
  { id: "internationalPassport" as const, label: "International Passport" },
  { id: "voterRegCard" as const, label: "Voter Registration Card" },
  { id: "driversLicense" as const, label: "Driver's License" },
  { id: "nationalIdCard" as const, label: "National ID Card" },
];

const requiredDocsList = [
  { id: "docKasupdaLicense" as const, label: "KASUPDA License to Practice Outdoor Advertisement" },
  { id: "docSoilInvestigation" as const, label: "Soil Investigation Report" },
  { id: "docCorporateArconLicense" as const, label: "Corporate ARCON License" },
  { id: "docTelecommunicationDesigns" as const, label: "Telecommunication Designs" },
  { id: "docSiteAnalysisReport" as const, label: "Site Analysis Report (SAR)" },
  { id: "docLeaseAgreement" as const, label: "Lease Agreement Letter" },
  { id: "docFireServiceReport" as const, label: "Fire Service Report" },
  { id: "docPoliceReport" as const, label: "Police Report" },
  { id: "docArchitecturalDrawing" as const, label: "One Hard and One Soft Copy of Architectural drawing and details of proposed installations" },
  { id: "docTaxClearance" as const, label: "Copy of Tax Clearance Certificate" },
  { id: "docSiteLocationType" as const, label: "Site Location & Type of Installation with Coordinates" },
  { id: "docKepaEiaApproval" as const, label: "KEPA EIA Approval Certificate" },
  { id: "docStructuralWorkDrawings" as const, label: "Structural Work Drawings and Details" },
  { id: "docProofOfOutrightPurchase" as const, label: "Proof of Outright Purchase" },
  { id: "docConsentLetter" as const, label: "Consent Letter" },
];


const outdoorStructurePermitSchema = z.object({ // Renamed schema to reflect content
  kopNumber: z.string().optional(),
  // Box 1: Applicant
  companyName: z.string().min(1, "Company Name is required"),
  kasupdaLicenseNo: z.string().optional(),
  phoneNo: z.string().length(11, "Phone number must be exactly 11 digits").regex(phoneRegex, "Phone number must contain only digits"),
  emailAddress: z.string().email("Invalid email address").optional().or(z.literal('')),
  ceoNameContact: z.string().min(1, "CEO Name and Contact is required"),
  apconRegNo: z.string().optional(),
  boardInstallations: z.object(
    Object.fromEntries(boardInstallationTypes.map(type => [type.id, z.boolean().optional()]))
  ).refine(data => Object.values(data).some(val => val === true), {
    message: "At least one type of board installation must be selected.",
  }),
  boardInstallationOthersText: z.string().optional(),

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
  repFirstName: z.string().min(1, "Representative First Name is required"),
  repMiddleName: z.string().optional(),
  repSurname: z.string().min(1, "Representative Surname is required"),
  repPhone1: z.string().length(11, "Phone number must be exactly 11 digits").regex(phoneRegex, "Phone number must contain only digits"),
  repPhone2: z.string().regex(phoneRegex, "Phone number must be exactly 11 digits").optional().or(z.literal('')),
  repEmail: z.string().email("Invalid email address").min(1, "Representative Email is required"),
  repIdentificationType: z.object(
    Object.fromEntries(representativeIdOptions.map(type => [type.id, z.boolean().optional()]))
  ).refine(data => Object.values(data).some(val => val === true), {
    message: "At least one identification type must be selected for the representative.",
  }),
  repIdNumber: z.string().min(1, "Representative ID Number is required"),

  // Box 4: Required Documents
  ...Object.fromEntries(requiredDocsList.map(doc => [doc.id, z.any().optional()])),

  // Box 5: Signature
  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit the application."
  })
}).refine(data => {
  if (data.boardInstallations.othersSpecify) {
    return !!data.boardInstallationOthersText?.trim();
  }
  return true;
}, {
  message: "Specify 'Others' for board installation",
  path: ["boardInstallationOthersText"],
})
  .refine(data => {
    if (data.siteTypeOfLand === "Private") {
      return !!data.siteProofOfOwnership?.trim();
    }
    return true;
  }, {
    message: "Proof of Ownership is required for Private land",
    path: ["siteProofOfOwnership"],
  });


type OutdoorStructurePermitFormValues = z.infer<typeof outdoorStructurePermitSchema>; // Renamed type

const steps = [
  { id: 1, name: "Applicant Details", fields: ['companyName', 'phoneNo', 'ceoNameContact', 'boardInstallations'] as FieldName<OutdoorStructurePermitFormValues>[] },
  { id: 2, name: "Site Address", fields: ['siteStreetName', 'siteCityTown', 'siteLGA', 'siteTypeOfLand'] as FieldName<OutdoorStructurePermitFormValues>[] },
  { id: 3, name: "Representative", fields: ['repFirstName', 'repSurname', 'repPhone1', 'repEmail', 'repIdentificationType', 'repIdNumber'] as FieldName<OutdoorStructurePermitFormValues>[] },
  { id: 4, name: "Documents & Declaration", fields: ['declaration'] as FieldName<OutdoorStructurePermitFormValues>[] },
];

import { useFormPersistence } from '@/hooks/use-form-persistence';

export default function OutdoorStructurePermitPage() { // Renamed component, though file name is the same
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?redirectTo=/dashboard/apply/outdoor-advertisement-structure-permit');
    }
  }, [sessionStatus, router]);

  const form = useForm<OutdoorStructurePermitFormValues>({
    resolver: zodResolver(outdoorStructurePermitSchema),
    mode: "onChange",
    defaultValues: {
      kopNumber: "",
      companyName: "",
      kasupdaLicenseNo: "",
      phoneNo: "",
      emailAddress: "",
      ceoNameContact: "",
      apconRegNo: "",
      boardInstallations: {},
      boardInstallationOthersText: "",
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
      declaration: false,
      // Initialize all doc fields to false
      ...Object.fromEntries(requiredDocsList.map(doc => [doc.id, undefined])),
    }
  });

  const { register, handleSubmit, control, formState: { errors }, trigger, watch } = form;

  const { clearStorage } = useFormPersistence(form, 'outdoor-structure-permit-form', requiredDocsList.map(doc => doc.id));

  const watchedBoardInstallations = watch("boardInstallations.othersSpecify" as any);
  const watchedTypeOfLand = watch("siteTypeOfLand");

  const onSubmit = async (data: OutdoorStructurePermitFormValues) => {
    if (!session?.user) {
      toast({ title: "Error", description: "You must be logged in to submit an application.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('type', "Outdoor Structure Permit");
    formData.append('applicantName', data.companyName);
    formData.append('userId', session.user.id);

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        if (value[0].size > 0) {
          formData.append(key, value[0]);
        }
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
        router.push(`/dashboard/billing`);
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
        toast({
          title: "Validation Error",
          description: "Please correct the errors before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }
    if (currentStep === 1 && watchedBoardInstallations && !watch('boardInstallationOthersText')?.trim()) {
      await trigger('boardInstallationOthersText');
      if (errors.boardInstallationOthersText) {
        toast({
          title: "Validation Error",
          description: "Please specify 'Others' for board installation.",
          variant: "destructive",
        });
        return;
      }
    }
    if (currentStep === 2 && watchedTypeOfLand === "Private" && !watch('siteProofOfOwnership')?.trim()) {
      await trigger('siteProofOfOwnership');
      if (errors.siteProofOfOwnership) {
        toast({
          title: "Validation Error",
          description: "Proof of Ownership is required for Private land.",
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
            <span className="text-4xl font-bold text-primary mr-2">KOP</span>
            <div className="text-sm">
              <p className="font-semibold">KADUNA STATE OF NIGERIA</p>
              <p>Kaduna State Urban Planning and Development Authority</p>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Application For Outdoor Structure Permit {/* Updated Title */}
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
              <CardDescription className="text-xs sm:text-sm">The Company whose name will be reflected on the license to the permit. All applicants must complete Box 1 in full. The Original identification document used to prove identity must be submitted; it will be copied and returned.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="companyName">Company Name*</Label><Input id="companyName" {...register("companyName")} />{errors.companyName && <p className="text-destructive text-xs mt-1">{errors.companyName.message}</p>}</div>
                <div><Label htmlFor="kasupdaLicenseNo">KASUPDA License Number</Label><Input id="kasupdaLicenseNo" {...register("kasupdaLicenseNo")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="phoneNo">Phone Number*</Label><Input id="phoneNo" type="tel" {...register("phoneNo")} />{errors.phoneNo && <p className="text-destructive text-xs mt-1">{errors.phoneNo.message}</p>}</div>
                <div><Label htmlFor="emailAddress">Email Address</Label><Input id="emailAddress" type="email" {...register("emailAddress")} />{errors.emailAddress && <p className="text-destructive text-xs mt-1">{errors.emailAddress.message}</p>}</div>
              </div>
              <div><Label htmlFor="ceoNameContact">Full Name and Contact of Company's CEO*</Label><Input id="ceoNameContact" {...register("ceoNameContact")} />{errors.ceoNameContact && <p className="text-destructive text-xs mt-1">{errors.ceoNameContact.message}</p>}</div>
              <div><Label htmlFor="apconRegNo">Corporate APCON Registration Number</Label><Input id="apconRegNo" {...register("apconRegNo")} /></div>
              <div>
                <Label>Type of Board Installation*</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                  {boardInstallationTypes.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <Controller name={`boardInstallations.${opt.id}`} control={control} render={({ field }) => (<Checkbox id={`board_${opt.id}`} checked={!!field.value} onCheckedChange={field.onChange} />)} />
                      <Label htmlFor={`board_${opt.id}`} className="font-normal text-xs sm:text-sm">{opt.label}</Label>
                    </div>
                  ))}
                </div>
                {errors.boardInstallations && <p className="text-destructive text-xs mt-1">{errors.boardInstallations.message || (errors.boardInstallations as any)?.root?.message}</p>}
                {watchedBoardInstallations && (
                  <div className="mt-2"><Label htmlFor="boardInstallationOthersText" className="sr-only">Specify Other Board Installation</Label><Input id="boardInstallationOthersText" placeholder="Specify other type" {...register("boardInstallationOthersText")} />{errors.boardInstallationOthersText && <p className="text-destructive text-xs mt-1">{errors.boardInstallationOthersText.message}</p>}</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 2: SITE ADDRESS</CardTitle><CardDescription className="text-xs sm:text-sm">All applicants must complete Box 2 in full. This should be the Site Address for the Structure.</CardDescription></CardHeader>
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
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 3: REPRESENTATIVE</CardTitle><CardDescription className="text-xs sm:text-sm">Applicants who wish to appoint a representative must complete Box 3 in full. The original identification document used to prove the identity of the representative must be submitted; it will be copied and returned. Note: The representative is authorized to submit and receive information and document pertaining to this application.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="repFirstName">First Name*</Label><Input id="repFirstName" {...register("repFirstName")} />{errors.repFirstName && <p className="text-destructive text-xs mt-1">{errors.repFirstName.message}</p>}</div>
                <div><Label htmlFor="repMiddleName">Middle Name</Label><Input id="repMiddleName" {...register("repMiddleName")} /></div>
                <div><Label htmlFor="repSurname">Surname*</Label><Input id="repSurname" {...register("repSurname")} />{errors.repSurname && <p className="text-destructive text-xs mt-1">{errors.repSurname.message}</p>}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="repPhone1">Phone 1*</Label><Input id="repPhone1" type="tel" {...register("repPhone1")} />{errors.repPhone1 && <p className="text-destructive text-xs mt-1">{errors.repPhone1.message}</p>}</div>
                <div><Label htmlFor="repPhone2">Phone 2</Label><Input id="repPhone2" type="tel" {...register("repPhone2")} />{errors.repPhone2 && <p className="text-destructive text-xs mt-1">{errors.repPhone2.message}</p>}</div>
                <div><Label htmlFor="repEmail">Email*</Label><Input id="repEmail" type="email" {...register("repEmail")} />{errors.repEmail && <p className="text-destructive text-xs mt-1">{errors.repEmail.message}</p>}</div>
              </div>
              <div>
                <Label>Identification*</Label>
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
              <div><Label htmlFor="repIdNumber">ID Number*</Label><Input id="repIdNumber" {...register("repIdNumber")} />{errors.repIdNumber && <p className="text-destructive text-xs mt-1">{errors.repIdNumber.message}</p>}</div>
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
