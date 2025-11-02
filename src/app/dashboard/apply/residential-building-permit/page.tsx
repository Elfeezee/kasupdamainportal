
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, type FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
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

// Define Zod schema based on the form
const permitApplicationSchema = z.object({
  // Box 1: Applicant
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  surname: z.string().min(1, "Surname is required"),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  occupation: z.string().optional(),
  nationality: z.string().optional().default("Nigerian"),
  stateOfOrigin: z.string().optional(),
  localGov: z.string().optional(),
  phone1: z.string().min(1, "Phone 1 is required").regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format"),
  phone2: z.string().regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format").optional().or(z.literal('')),
  phone3: z.string().regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format").optional().or(z.literal('')),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  identificationType: z.object({
    internationalPassport: z.boolean().optional(),
    taxIdCard: z.boolean().optional(),
    nationalIdCard: z.boolean().optional(),
    voterRegCard: z.boolean().optional(),
    driversLicense: z.boolean().optional(),
  }).optional().default({}),
  idNumber: z.string().optional(),

  // Box 2: Applicant Address
  appHouseNo: z.string().optional(),
  appStreetName: z.string().optional(),
  appDistrict: z.string().optional(),
  appCityTown: z.string().optional(),
  appState: z.string().optional().default("Kaduna"),
  appCountry: z.string().optional().default("Nigeria"),
  appPOBox: z.string().optional(),
  appCO: z.string().optional(),
  appAdditionalAddressInfo: z.string().optional(),

  // Box 3: Representative
  repFirstName: z.string().optional(),
  repMiddleName: z.string().optional(),
  repSurname: z.string().optional(),
  repPhone1: z.string().regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format").optional().or(z.literal('')),
  repPhone2: z.string().regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format").optional().or(z.literal('')),
  repEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  repIdentificationType: z.object({
    internationalPassport: z.boolean().optional(),
    taxIdCard: z.boolean().optional(),
    nationalIdCard: z.boolean().optional(),
    voterRegCard: z.boolean().optional(),
    driversLicense: z.boolean().optional(),
  }).optional().default({}),
  repIdNumber: z.string().optional(),

  // Box 4: Representative's Address
  repHouseNo: z.string().optional(),
  repStreetName: z.string().optional(),
  repDistrict: z.string().optional(),
  repCityTown: z.string().optional(),
  repState: z.string().optional().default("Kaduna"),
  repCountry: z.string().optional().default("Nigeria"),
  repPOBox: z.string().optional(),
  repCO: z.string().optional(),
  repAdditionalAddressInfo: z.string().optional(),
  
  // Box 5: Plot
  landUse: z.string().optional(),
  purpose: z.string().optional(),
  plotDistrict: z.string().optional(),
  plotLGA: z.string().optional(),
  plotDescriptionAddress: z.string().min(1, "Plot Description/Address is required"),
  
  // Box 6: Documents
  docLandTitle: z.any().optional(),
  docSar: z.any().optional(),
  docWorkingDrawings: z.any().optional(),
  docStructuralInfo: z.any().optional(),
  docBuildersDoc: z.any().optional(),
  docSoilTest: z.any().optional(),
  docPdfDrawings: z.any().optional(),
  docApplicantId: z.any().optional(),
  docRepId: z.any().optional(),
  docUtilityBill: z.any().optional(),

  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit the application."
  })
});

type PermitApplicationFormValues = z.infer<typeof permitApplicationSchema>;

const identificationOptions = [
  { id: "internationalPassport" as const, label: "International Passport" },
  { id: "taxIdCard" as const, label: "Tax Identification Card" },
  { id: "nationalIdCard" as const, label: "National ID Card" },
  { id: "voterRegCard" as const, label: "Voter Registration Card" },
  { id: "driversLicense" as const, label: "Driver's License" },
];

const residentialDocs = [
    { id: "docLandTitle" as const, label: "Land title document (Digitized C of O, KADGIS Offer Letter, KADGIS Acknowledgment)" },
    { id: "docSar" as const, label: "Site Analysis Report (SAR)" },
    { id: "docWorkingDrawings" as const, label: "Complete working Drawings (Architectural, Mechanical and Electrical)" },
    { id: "docStructuralInfo" as const, label: "Structural drawing, Calculation sheet, Letter for Supervision/ Responsibility for storey buildings." },
    { id: "docBuildersDoc" as const, label: "Builder’s Document to be produced by Registered Builder for commercial Residential" },
    { id: "docSoilTest" as const, label: "Geotechnical investigation Report (Soil Test) for Multi storey development that exceeds two (2) floors." },
    { id: "docPdfDrawings" as const, label: "PDF copy of all drawings on CD" },
    { id: "docApplicantId" as const, label: "Means of ID of applicant" },
    { id: "docRepId" as const, label: "Means of ID of representative (optional)" },
    { id: "docUtilityBill" as const, label: "Copy of utility bill" },
];


const steps = [
  { id: 1, name: "Applicant", fields: ['firstName', 'surname', 'gender', 'dateOfBirth', 'phone1', 'email'] as FieldName<PermitApplicationFormValues>[] },
  { id: 2, name: "Applicant Address", fields: [] as FieldName<PermitApplicationFormValues>[] }, 
  { id: 3, name: "Representative", fields: ['repEmail'] as FieldName<PermitApplicationFormValues>[] },
  { id: 4, name: "Representative Address", fields: [] as FieldName<PermitApplicationFormValues>[] },
  { id: 5, name: "Plot Details", fields: ['plotDescriptionAddress'] as FieldName<PermitApplicationFormValues>[] },
  { id: 6, name: "Documents & Declaration", fields: ['declaration'] as FieldName<PermitApplicationFormValues>[] },
];

export default function ResidentialBuildingPermitPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/login?redirectTo=/dashboard/apply/residential-building-permit');
        } else {
            setUser(session.user);
        }
    };
    checkSession();
  }, [router]);

  const { register, handleSubmit, control, formState: { errors }, trigger } = useForm<PermitApplicationFormValues>({
    resolver: zodResolver(permitApplicationSchema),
    mode: "onChange", 
    defaultValues: { 
      title: "",
      firstName: "",
      middleName: "",
      surname: "",
      occupation: "",
      nationality: "Nigerian",
      stateOfOrigin: "",
      localGov: "",
      phone1: "",
      phone2: "",
      phone3: "",
      email: "",
      identificationType: {},
      idNumber: "",
      appHouseNo: "",
      appStreetName: "",
      appDistrict: "",
      appCityTown: "",
      appState: "Kaduna",
      appCountry: "Nigeria",
      appPOBox: "",
      appCO: "",
      appAdditionalAddressInfo: "",
      repFirstName: "",
      repMiddleName: "",
      repSurname: "",
      repPhone1: "",
      repPhone2: "",
      repEmail: "",
      repIdentificationType: {},
      repIdNumber: "",
      repHouseNo: "",
      repStreetName: "",
      repDistrict: "",
      repCityTown: "",
      repState: "Kaduna",
      repCountry: "Nigeria",
      repPOBox: "",
      repCO: "",
      repAdditionalAddressInfo: "",
      landUse: "",
      purpose: "",
      plotDistrict: "",
      plotLGA: "",
      plotDescriptionAddress: "",
      declaration: false,
    }
  });

  const onSubmit = async (data: PermitApplicationFormValues) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to submit an application.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('type', "Building Permit (Individual)");
    const applicantName = [data.firstName, data.middleName, data.surname].filter(Boolean).join(' ');
    formData.append('applicantName', applicantName);
    formData.append('userId', user.id);

    // Convert all data to a serializable format for FormData
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
            formData.append(key, value.toString());
        }
    });

    try {
        const result = await saveApplication(formData);

        if (result.success && result.applicationId) {
            router.push(`/dashboard/acknowledgement/${result.applicationId}`);
        } else {
            throw new Error(result.error || "An unknown error occurred.");
        }

    } catch (error) {
        console.error("Submission failed:", error);
        toast({
            title: "Submission Failed",
            description: error instanceof Error ? error.message : "Could not submit the application. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    const currentStepConfig = steps.find(step => step.id === currentStep);
    if (currentStepConfig && currentStepConfig.fields.length > 0) {
      const isValid = await trigger(currentStepConfig.fields);
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
      setCurrentStep(prev => prev + 1);
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
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-primary">
            Building Permit Application 
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Kaduna State Urban Planning and Development Authority
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stepper UI */}
      <div className="mb-8 p-2 sm:p-4 border rounded-lg shadow-sm overflow-x-auto">
        <div className="flex items-start w-full min-w-[360px] sm:min-w-full">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center px-0.5 sm:px-1 py-1 flex-shrink-0" style={{width: `${100 / steps.length}%`}}>
                <div
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    currentStep > step.id ? "bg-primary border-primary text-primary-foreground" :
                    currentStep === step.id ? "bg-primary/20 border-primary text-primary scale-110" :
                    "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : step.id}
                </div>
                <p className={cn(
                  "mt-1 text-[10px] leading-tight sm:text-xs font-medium transition-all duration-300 break-words",
                   currentStep === step.id ? "text-primary font-semibold" : "text-muted-foreground"
                )}>{step.name}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                    "flex-1 h-0.5 sm:h-1 mt-2.5 sm:mt-3.5 mx-0.5 sm:mx-1 transition-all duration-300", 
                    currentStep > step.id ? "bg-primary" : "bg-border" 
                    )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">BOX 1: APPLICANT (Individual)</CardTitle>
              <CardDescription className="text-xs sm:text-sm">The person whose name would be reflected on the Building Permit. Original identification document must be submitted.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} />
                </div>
                <div className="lg:col-span-1">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Gender*</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-2 sm:space-x-4 mt-2">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male" className="font-normal text-sm">Male</Label>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female" className="font-normal text-sm">Female</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal mt-1 text-sm sm:text-base">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.dateOfBirth && <p className="text-destructive text-xs mt-1">{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" {...register("occupation")} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" {...register("nationality")} />
                </div>
                <div>
                  <Label htmlFor="stateOfOrigin">State of Origin</Label>
                  <Input id="stateOfOrigin" {...register("stateOfOrigin")} />
                </div>
                <div>
                  <Label htmlFor="localGov">Local Gov.</Label>
                  <Input id="localGov" {...register("localGov")} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone1">Phone 1*</Label>
                  <Input id="phone1" type="tel" {...register("phone1")} />
                  {errors.phone1 && <p className="text-destructive text-xs mt-1">{errors.phone1.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone2">Phone 2</Label>
                  <Input id="phone2" type="tel" {...register("phone2")} />
                  {errors.phone2 && <p className="text-destructive text-xs mt-1">{errors.phone2.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone3">Phone 3</Label>
                  <Input id="phone3" type="tel" {...register("phone3")} />
                   {errors.phone3 && <p className="text-destructive text-xs mt-1">{errors.phone3.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label className="text-sm sm:text-base">Identification</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 sm:gap-x-4 gap-y-2 mt-2">
                  {identificationOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <Controller
                          name={`identificationType.${opt.id}`}
                          control={control}
                          render={({ field }) => (
                              <Checkbox
                                  id={`applicant_${opt.id}`}
                                  checked={!!field.value} 
                                  onCheckedChange={field.onChange}
                              />
                          )}
                      />
                      <Label htmlFor={`applicant_${opt.id}`} className="font-normal text-xs sm:text-sm">{opt.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="idNumber">ID Number</Label>
                <Input id="idNumber" {...register("idNumber")} />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">BOX 2: APPLICANT'S ADDRESS</CardTitle>
              <CardDescription className="text-xs sm:text-sm">This should be your normal residential address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appHouseNo">House No</Label>
                  <Input id="appHouseNo" {...register("appHouseNo")} />
                </div>
                <div>
                  <Label htmlFor="appStreetName">Street Name</Label>
                  <Input id="appStreetName" {...register("appStreetName")} placeholder="Ahmadu Bello Road" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="appDistrict">District</Label>
                  <Input id="appDistrict" {...register("appDistrict")} placeholder="Sabon Gari" />
                </div>
                <div>
                  <Label htmlFor="appCityTown">City/Town</Label>
                  <Input id="appCityTown" {...register("appCityTown")} placeholder="Zaria" />
                </div>
                <div>
                  <Label htmlFor="appState">State</Label>
                  <Input id="appState" {...register("appState")} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="appCountry">Country</Label>
                  <Input id="appCountry" {...register("appCountry")} />
                </div>
                <div>
                  <Label htmlFor="appPOBox">P.O./P.M.B.</Label>
                  <Input id="appPOBox" {...register("appPOBox")} placeholder="040 Zaria" />
                </div>
                <div>
                  <Label htmlFor="appCO">C/O</Label>
                  <Input id="appCO" {...register("appCO")} />
                </div>
              </div>
              <div>
                <Label htmlFor="appAdditionalAddressInfo">Additional Address Information</Label>
                <Textarea id="appAdditionalAddressInfo" {...register("appAdditionalAddressInfo")} placeholder="G.R.A Res. Estate" />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
           <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">BOX 3: REPRESENTATIVE (Optional)</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Applicants who wish to appoint a representative must complete this Box. Original identification document of representative is required.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="repFirstName">First Name</Label>
                  <Input id="repFirstName" {...register("repFirstName")} />
                </div>
                <div>
                  <Label htmlFor="repMiddleName">Middle Name</Label>
                  <Input id="repMiddleName" {...register("repMiddleName")} />
                </div>
                <div>
                  <Label htmlFor="repSurname">Surname</Label>
                  <Input id="repSurname" {...register("repSurname")} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="repPhone1">Phone 1</Label>
                  <Input id="repPhone1" type="tel" {...register("repPhone1")} />
                  {errors.repPhone1 && <p className="text-destructive text-xs mt-1">{errors.repPhone1.message}</p>}
                </div>
                <div>
                  <Label htmlFor="repPhone2">Phone 2</Label>
                  <Input id="repPhone2" type="tel" {...register("repPhone2")} />
                  {errors.repPhone2 && <p className="text-destructive text-xs mt-1">{errors.repPhone2.message}</p>}
                </div>
                <div>
                  <Label htmlFor="repEmail">Email</Label>
                  <Input id="repEmail" type="email" {...register("repEmail")} />
                  {errors.repEmail && <p className="text-destructive text-xs mt-1">{errors.repEmail.message}</p>}
                </div>
              </div>
              <div>
                <Label className="text-sm sm:text-base">Representative's Identification</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-2 sm:gap-x-4 gap-y-2 mt-2">
                  {identificationOptions.map(opt => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <Controller
                          name={`repIdentificationType.${opt.id}`}
                          control={control}
                          render={({ field }) => (
                              <Checkbox
                                  id={`rep_${opt.id}`}
                                  checked={!!field.value}
                                  onCheckedChange={field.onChange}
                              />
                          )}
                      />
                      <Label htmlFor={`rep_${opt.id}`} className="font-normal text-xs sm:text-sm">{opt.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="repIdNumber">Representative's ID Number</Label>
                <Input id="repIdNumber" {...register("repIdNumber")} />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">BOX 4: REPRESENTATIVE'S ADDRESS (If representative appointed)</CardTitle>
              <CardDescription className="text-xs sm:text-sm">This should be your representative's normal residential address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="repHouseNo">House No</Label>
                  <Input id="repHouseNo" {...register("repHouseNo")} />
                </div>
                <div>
                  <Label htmlFor="repStreetName">Street Name</Label>
                  <Input id="repStreetName" {...register("repStreetName")} placeholder="Ahmadu Bello Road" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="repDistrict">District</Label>
                  <Input id="repDistrict" {...register("repDistrict")} placeholder="Sabon Gari" />
                </div>
                <div>
                  <Label htmlFor="repCityTown">City/Town</Label>
                  <Input id="repCityTown" {...register("repCityTown")} placeholder="Zaria" />
                </div>
                <div>
                  <Label htmlFor="repState">State</Label>
                  <Input id="repState" {...register("repState")} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="repCountry">Country</Label>
                  <Input id="repCountry" {...register("repCountry")} />
                </div>
                <div>
                  <Label htmlFor="repPOBox">P.O./P.M.B.</Label>
                  <Input id="repPOBox" {...register("repPOBox")} placeholder="040 Zaria" />
                </div>
                <div>
                  <Label htmlFor="repCO">C/O</Label>
                  <Input id="repCO" {...register("repCO")} />
                </div>
              </div>
              <div>
                <Label htmlFor="repAdditionalAddressInfo">Additional Address Information</Label>
                <Textarea id="repAdditionalAddressInfo" {...register("repAdditionalAddressInfo")} placeholder="G.R.A Res. Estate" />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">BOX 5: PLOT</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Please fill in the below information of the plot that has been or will be developed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="landUse">Land Use</Label>
                      <Input id="landUse" {...register("landUse")} />
                  </div>
                  <div>
                      <Label htmlFor="purpose">Purpose</Label>
                      <Input id="purpose" {...register("purpose")} />
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="plotDistrict">District</Label>
                      <Input id="plotDistrict" {...register("plotDistrict")} />
                  </div>
                  <div>
                      <Label htmlFor="plotLGA">L.G.A</Label>
                      <Input id="plotLGA" {...register("plotLGA")} />
                  </div>
              </div>
              <div>
                  <Label htmlFor="plotDescriptionAddress">Plot Description / Address*</Label>
                  <Textarea id="plotDescriptionAddress" {...register("plotDescriptionAddress")} />
                  {errors.plotDescriptionAddress && <p className="text-destructive text-xs mt-1">{errors.plotDescriptionAddress.message}</p>}
              </div>
            </CardContent>
          </Card>
        )}
        
        {currentStep === 6 && (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">BOX 6: DOCUMENT UPLOAD &amp; DECLARATION</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Please upload the required documents.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Residential Documents Upload */}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-primary">Required Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {residentialDocs.map(doc => (
                            <div key={doc.id} className="space-y-1.5">
                                <Label htmlFor={doc.id} className="text-sm font-medium">
                                    {doc.label}
                                </Label>
                                <Input
                                    id={doc.id}
                                    type="file"
                                    {...register(doc.id)}
                                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>
                        ))}
                        </div>
                    </div>

                    <Separator />

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
                                I, the applicant or duly authorized representative, declare that the information provided in this application and any attached documents is true, correct, and complete to the best of my knowledge and belief. I understand that any false statement may result in the rejection of this application or revocation of any permit granted.
                            </Label>
                        </div>
                         {errors.declaration && <p className="text-destructive text-xs mt-1 px-1">{errors.declaration.message}</p>}
                         <p className="text-sm text-muted-foreground px-1 mt-2">
                            Applicant Signature: <span className="font-medium">[Digital acceptance via checkbox]</span>
                        </p>
                        <p className="text-sm text-muted-foreground px-1">
                            Representative Signature: <span className="font-medium">[Digital acceptance via checkbox, if representative details filled]</span>
                        </p>
                    </div>

                </CardContent>
            </Card>
        )}


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
                      className="w-full sm:w-auto py-3 text-base sm:text-lg"
                      disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                )}
            </div>
          <Separator className="my-2" />
           <p className="text-xs text-muted-foreground text-center">
            KASUPDA Regulations, 2025 &nbsp;&nbsp;|&nbsp;&nbsp; Version 1.5 2025
          </p>
        </CardFooter>
      </form>
    </div>
  );
}

// Simple CheckIcon for stepper
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
