
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
import { CalendarIcon, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { saveApplication } from '@/app/actions/applicationActions';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

const phoneRegex = /^\d{11}$/;

const streetNamingPermitSchema = z.object({
  kopNumber: z.string().optional(),

  // Box 1: APPLICANT
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
  children: z.string().optional(), // Assuming number of children as string, can be changed to number
  maritalStatus: z.enum(["Single", "Married", "Separated", "Divorced", "Widowed"], { required_error: "Marital status is required" }),
  educationLevel: z.enum(["Primary", "Secondary", "Tertiary", "BachelorDegree", "MasterDegree", "Doctorate", "Other"], { required_error: "Education level is required" }),
  otherEducation: z.string().optional(),
  phone1: z.string().length(11, "Phone number must be exactly 11 digits").regex(phoneRegex, "Phone number must contain only digits"),
  phone2: z.string().regex(phoneRegex, "Phone number must be exactly 11 digits").optional().or(z.literal('')),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  tin: z.string().optional(),
  identificationType: z.object({
    internationalPassport: z.boolean().optional(),
    taxIdCard: z.boolean().optional(),
    nationalIdCard: z.boolean().optional(),
    driversLicense: z.boolean().optional(),
    voterRegCard: z.boolean().optional(),
  }).optional().default({}),
  idNumber: z.string().optional(),

  // Box 2: ADDRESS (Applicant)
  appHouseNo: z.string().optional(),
  appStreetName: z.string().optional(),
  appDistrict: z.string().optional(),
  appCityTown: z.string().optional(),
  appState: z.string().optional().default("Kaduna"),
  appCountry: z.string().optional().default("Nigeria"),
  appPOBox: z.string().optional(),
  appCO: z.string().optional(),
  appAdditionalAddressInfo: z.string().optional(),

  // Box 3: REPRESENTATIVE
  repFirstName: z.string().optional(),
  repMiddleName: z.string().optional(),
  repSurname: z.string().optional(),
  repPhone1: z.string().regex(phoneRegex, "Phone number must be exactly 11 digits").optional().or(z.literal('')),
  repPhone2: z.string().regex(phoneRegex, "Phone number must be exactly 11 digits").optional().or(z.literal('')),
  repEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  repIdentificationType: z.object({
    internationalPassport: z.boolean().optional(),
    taxIdCard: z.boolean().optional(),
    nationalIdCard: z.boolean().optional(),
    driversLicense: z.boolean().optional(),
    voterRegCard: z.boolean().optional(),
  }).optional().default({}),
  repIdNumber: z.string().optional(),

  // Box 4: STREET INFORMATION
  typeOfRoad: z.enum(["Primary", "Secondary", "Local", "Access"], { required_error: "Type of road is required" }),
  roadLength: z.string().optional(),
  coordinates: z.string().optional(),
  locationOfSite: z.string().min(1, "Location of site is required"),

  // Box 5: REQUIRED DOCUMENTS
  docImageShowingSite: z.any().optional(),
  docConsentLetter: z.any().optional(),

  // Box 6: SIGNATURE (Declaration)
  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit the application."
  })
}).refine(data => data.educationLevel !== "Other" || (data.educationLevel === "Other" && !!data.otherEducation?.trim()), {
  message: "Specify 'Other' education level",
  path: ["otherEducation"],
});

type StreetNamingPermitFormValues = z.infer<typeof streetNamingPermitSchema>;

const identificationOptions = [
  { id: "internationalPassport" as const, label: "International Passport" },
  { id: "taxIdCard" as const, label: "Tax Identification Card" },
  { id: "nationalIdCard" as const, label: "National ID Card" },
  { id: "driversLicense" as const, label: "Driver's License" },
  { id: "voterRegCard" as const, label: "Voter Registration Card" },
];

const maritalStatusOptions = ["Single", "Married", "Separated", "Divorced", "Widowed"];
const educationLevelOptions = [
  { id: "Primary" as const, label: "Primary" },
  { id: "Secondary" as const, label: "Secondary" },
  { id: "Tertiary" as const, label: "Tertiary" },
  { id: "BachelorDegree" as const, label: "Bachelor Degree" },
  { id: "MasterDegree" as const, label: "Master Degree" },
  { id: "Doctorate" as const, label: "Doctorate" },
  { id: "Other" as const, label: "Other (Specify)" },
];
const roadTypeOptions = ["Primary", "Secondary", "Local", "Access"];

const steps = [
  { id: 1, name: "Applicant Details", fields: ['firstName', 'surname', 'gender', 'dateOfBirth', 'maritalStatus', 'educationLevel', 'phone1'] as FieldName<StreetNamingPermitFormValues>[] },
  { id: 2, name: "Applicant Address", fields: [] as FieldName<StreetNamingPermitFormValues>[] },
  { id: 3, name: "Representative", fields: ['repEmail'] as FieldName<StreetNamingPermitFormValues>[] },
  { id: 4, name: "Street Information", fields: ['typeOfRoad', 'locationOfSite'] as FieldName<StreetNamingPermitFormValues>[] },
  { id: 5, name: "Documents & Declaration", fields: ['declaration'] as FieldName<StreetNamingPermitFormValues>[] },
];

import { useFormPersistence } from '@/hooks/use-form-persistence';

export default function StreetNamingPermitPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?redirectTo=/dashboard/apply/street-naming-permit');
      } else {
        setUser(session.user);
      }
    };
    checkSession();
  }, [router]);

  const form = useForm<StreetNamingPermitFormValues>({
    resolver: zodResolver(streetNamingPermitSchema),
    mode: "onChange",
    defaultValues: {
      kopNumber: "",
      title: "",
      firstName: "",
      middleName: "",
      surname: "",
      // gender: undefined,
      // dateOfBirth: undefined,
      occupation: "",
      nationality: "Nigerian",
      stateOfOrigin: "",
      localGov: "",
      children: "",
      // maritalStatus: undefined,
      // educationLevel: undefined,
      otherEducation: "",
      phone1: "",
      phone2: "",
      email: "",
      tin: "",
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
      // typeOfRoad: undefined,
      roadLength: "",
      coordinates: "",
      locationOfSite: "",
      docImageShowingSite: undefined,
      docConsentLetter: undefined,
      declaration: false,
    }
  });

  const { register, handleSubmit, control, formState: { errors }, trigger, watch } = form;

  const { clearStorage } = useFormPersistence(form, 'street-naming-permit-form', ['docImageShowingSite', 'docConsentLetter']);

  const watchedEducationLevel = watch("educationLevel");

  const onSubmit = async (data: StreetNamingPermitFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to submit an application.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('type', "Street Naming Permit");
    const applicantName = [data.firstName, data.middleName, data.surname].filter(Boolean).join(' ');
    formData.append('applicantName', applicantName);
    formData.append('userId', user.id);

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        if (value[0].size > 0) formData.append(key, value[0]);
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
        description: error instanceof Error ? error.message : "Could not submit application.",
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
            {/* Placeholder for SNP logo if available, or use text */}
            <span className="text-4xl font-bold text-primary mr-2">SNP</span>
            <div className="text-sm">
              <p className="font-semibold">KADUNA STATE OF NIGERIA</p>
              <p>Kaduna State Urban Planning and Development Authority</p>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Application For Grant of Street Naming Permit
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* "FOR OFFICIAL USE ONLY" section removed */}
        </CardContent>
      </Card>

      <div className="mb-8 p-2 sm:p-4 border rounded-lg shadow-sm overflow-x-auto">
        <div className="flex items-start w-full min-w-[400px] sm:min-w-full">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center px-0.5 sm:px-1 py-1 flex-shrink-0" style={{ width: `${100 / steps.length}%` }}>
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
                <div className={cn("flex-1 h-0.5 sm:h-1 mt-2.5 sm:mt-3.5 mx-0.5 sm:mx-1 transition-all duration-300", currentStep > step.id ? "bg-primary" : "bg-border")} />
              )}
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
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">BOX 1: APPLICANT</CardTitle>
              <CardDescription className="text-xs sm:text-sm">The person whose name would be reflected on the Street Naming Permit. Original identification document used to prove identity must be submitted; it will be copied and returned.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><Label htmlFor="title">Title</Label><Input id="title" {...register("title")} /></div>
                <div><Label htmlFor="firstName">First Name*</Label><Input id="firstName" {...register("firstName")} />{errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}</div>
                <div><Label htmlFor="middleName">Middle Name</Label><Input id="middleName" {...register("middleName")} /></div>
                <div><Label htmlFor="surname">Surname*</Label><Input id="surname" {...register("surname")} />{errors.surname && <p className="text-destructive text-xs mt-1">{errors.surname.message}</p>}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div>
                  <Label>Gender*</Label>
                  <Controller name="gender" control={control} render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Male" id="male" /><Label htmlFor="male" className="font-normal">Male</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="Female" id="female" /><Label htmlFor="female" className="font-normal">Female</Label></div>
                    </RadioGroup>
                  )} />
                  {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                  <Controller name="dateOfBirth" control={control} render={({ field }) => (
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal mt-1"><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={(date) => date > new Date() || date < new Date("1900-01-01")} /></PopoverContent></Popover>
                  )} />
                  {errors.dateOfBirth && <p className="text-destructive text-xs mt-1">{errors.dateOfBirth.message}</p>}
                </div>
                <div><Label htmlFor="occupation">Occupation</Label><Input id="occupation" {...register("occupation")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="nationality">Nationality</Label><Input id="nationality" {...register("nationality")} /></div>
                <div><Label htmlFor="stateOfOrigin">State of Origin</Label><Input id="stateOfOrigin" {...register("stateOfOrigin")} /></div>
                <div><Label htmlFor="localGov">Local Gov.</Label><Input id="localGov" {...register("localGov")} /></div>
              </div>
              <div><Label htmlFor="children">Children</Label><Input id="children" {...register("children")} /></div>
              <div>
                <Label>Marital Status*</Label>
                <Controller name="maritalStatus" control={control} render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-2 mt-2">
                    {maritalStatusOptions.map(opt => (<div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`marital_${opt}`} /><Label htmlFor={`marital_${opt}`} className="font-normal text-sm">{opt}</Label></div>))}
                  </RadioGroup>
                )} />
                {errors.maritalStatus && <p className="text-destructive text-xs mt-1">{errors.maritalStatus.message}</p>}
              </div>
              <div>
                <Label>Education Level*</Label>
                <Controller name="educationLevel" control={control} render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 mt-2">
                    {educationLevelOptions.map(opt => (<div key={opt.id} className="flex items-center space-x-2"><RadioGroupItem value={opt.id} id={`edu_${opt.id}`} /><Label htmlFor={`edu_${opt.id}`} className="font-normal text-sm">{opt.label}</Label></div>))}
                  </RadioGroup>
                )} />
                {errors.educationLevel && <p className="text-destructive text-xs mt-1">{errors.educationLevel.message}</p>}
                {watchedEducationLevel === "Other" && (
                  <div className="mt-2">
                    <Input placeholder="Specify other education" {...register("otherEducation")} />
                    {errors.otherEducation && <p className="text-destructive text-xs mt-1">{errors.otherEducation.message}</p>}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="phone1">Phone 1*</Label><Input id="phone1" type="tel" {...register("phone1")} />{errors.phone1 && <p className="text-destructive text-xs mt-1">{errors.phone1.message}</p>}</div>
                <div><Label htmlFor="phone2">Phone 2</Label><Input id="phone2" type="tel" {...register("phone2")} />{errors.phone2 && <p className="text-destructive text-xs mt-1">{errors.phone2.message}</p>}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} />{errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}</div>
                <div><Label htmlFor="tin">TIN (Tax Identification Number)</Label><Input id="tin" {...register("tin")} /></div>
              </div>
              <div>
                <Label>Identification</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                  {identificationOptions.map(opt => (<div key={opt.id} className="flex items-center space-x-2"><Controller name={`identificationType.${opt.id}`} control={control} render={({ field }) => (<Checkbox id={`app_id_${opt.id}`} checked={!!field.value} onCheckedChange={field.onChange} />)} /><Label htmlFor={`app_id_${opt.id}`} className="font-normal text-sm">{opt.label}</Label></div>))}
                </div>
              </div>
              <div><Label htmlFor="idNumber">ID Number</Label><Input id="idNumber" {...register("idNumber")} /></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 2: APPLICANT'S ADDRESS</CardTitle><CardDescription className="text-xs sm:text-sm">This should be your normal residential address. A utility bill or bank statement in the applicant's name with the residential address will be required to verify this address.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="appHouseNo">House No</Label><Input id="appHouseNo" {...register("appHouseNo")} /></div><div><Label htmlFor="appStreetName">Street Name</Label><Input id="appStreetName" {...register("appStreetName")} /></div></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><Label htmlFor="appDistrict">District</Label><Input id="appDistrict" {...register("appDistrict")} /></div><div><Label htmlFor="appCityTown">City/Town</Label><Input id="appCityTown" {...register("appCityTown")} /></div><div><Label htmlFor="appState">State</Label><Input id="appState" {...register("appState")} /></div></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><Label htmlFor="appCountry">Country</Label><Input id="appCountry" {...register("appCountry")} /></div><div><Label htmlFor="appPOBox">P.O./P.M.B.</Label><Input id="appPOBox" {...register("appPOBox")} /></div><div><Label htmlFor="appCO">C/O</Label><Input id="appCO" {...register("appCO")} /></div></div>
              <div><Label htmlFor="appAdditionalAddressInfo">Additional Address Information</Label><Textarea id="appAdditionalAddressInfo" {...register("appAdditionalAddressInfo")} /></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 3: REPRESENTATIVE (Optional)</CardTitle><CardDescription className="text-xs sm:text-sm">Applicants who wish to appoint a representative must complete this Box. Original identification document of representative is required.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><Label htmlFor="repFirstName">First Name</Label><Input id="repFirstName" {...register("repFirstName")} /></div><div><Label htmlFor="repMiddleName">Middle Name</Label><Input id="repMiddleName" {...register("repMiddleName")} /></div><div><Label htmlFor="repSurname">Surname</Label><Input id="repSurname" {...register("repSurname")} /></div></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="repPhone1">Phone 1</Label><Input id="repPhone1" type="tel" {...register("repPhone1")} />{errors.repPhone1 && <p className="text-destructive text-xs mt-1">{errors.repPhone1.message}</p>}</div>
                <div><Label htmlFor="repPhone2">Phone 2</Label><Input id="repPhone2" type="tel" {...register("repPhone2")} />{errors.repPhone2 && <p className="text-destructive text-xs mt-1">{errors.repPhone2.message}</p>}</div>
                <div><Label htmlFor="repEmail">Email</Label><Input id="repEmail" type="email" {...register("repEmail")} />{errors.repEmail && <p className="text-destructive text-xs mt-1">{errors.repEmail.message}</p>}</div>
              </div>
              <div>
                <Label>Representative's Identification</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                  {identificationOptions.map(opt => (<div key={opt.id} className="flex items-center space-x-2"><Controller name={`repIdentificationType.${opt.id}`} control={control} render={({ field }) => (<Checkbox id={`rep_id_${opt.id}`} checked={!!field.value} onCheckedChange={field.onChange} />)} /><Label htmlFor={`rep_id_${opt.id}`} className="font-normal text-sm">{opt.label}</Label></div>))}
                </div>
              </div>
              <div><Label htmlFor="repIdNumber">Representative's ID Number</Label><Input id="repIdNumber" {...register("repIdNumber")} /></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 4: STREET INFORMATION</CardTitle><CardDescription className="text-xs sm:text-sm">All applicants must complete Box 4 in full. This should describe the purpose of the outdoor activity that the applicant is wishing to apply for.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Type of Road*</Label>
                <Controller name="typeOfRoad" control={control} render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-2">
                    {roadTypeOptions.map(opt => (<div key={opt} className="flex items-center space-x-2"><RadioGroupItem value={opt} id={`road_${opt}`} /><Label htmlFor={`road_${opt}`} className="font-normal text-sm">{opt}</Label></div>))}
                  </RadioGroup>
                )} />
                {errors.typeOfRoad && <p className="text-destructive text-xs mt-1">{errors.typeOfRoad.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="roadLength">Road Length</Label><Input id="roadLength" {...register("roadLength")} /></div>
                <div><Label htmlFor="coordinates">Coordinates</Label><Input id="coordinates" {...register("coordinates")} /></div>
              </div>
              <div><Label htmlFor="locationOfSite">Location of the site(s)*</Label><Textarea id="locationOfSite" {...register("locationOfSite")} />{errors.locationOfSite && <p className="text-destructive text-xs mt-1">{errors.locationOfSite.message}</p>}</div>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 5 & 6: REQUIRED DOCUMENTS & SIGNATURE/DECLARATION</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-md font-semibold">Required Documents</Label>
                <CardDescription className="text-xs sm:text-sm mb-2">Applicants should submit all of the relevant documents, with minimum requirement indicated below. If you have multiple relevant documents, please submit them and tick the documents that you acquire.</CardDescription>
                <div className="space-y-4 mt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="docImageShowingSite" className="text-sm font-medium">Image showing the site</Label>
                    <Input id="docImageShowingSite" type="file" {...register("docImageShowingSite")} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="docConsentLetter" className="text-sm font-medium">Consent/Introduction Letter from Community Head</Label>
                    <Input id="docConsentLetter" type="file" {...register("docConsentLetter")} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-md font-semibold">Signature / Declaration</Label>
                <CardDescription className="text-xs sm:text-sm mb-2">All applicants must affix their signature; the application will not be accepted without signature. In the case of a representative, they must also affix their signature. By checking the box below, you confirm that the information provided is true and accurate.</CardDescription>
                <div className="flex items-start space-x-2 p-4 border rounded-md bg-muted/30 mt-2">
                  <Controller name="declaration" control={control} render={({ field }) => (<Checkbox id="declaration" checked={!!field.value} onCheckedChange={field.onChange} className="mt-1" />)} />
                  <Label htmlFor="declaration" className="font-normal text-sm leading-snug">I, the applicant or duly authorized representative, declare that the information provided in this application and any attached documents is true, correct, and complete to the best of my knowledge and belief. I understand that any false statement may result in the rejection of this application or revocation of any permit granted.</Label>
                </div>
                {errors.declaration && <p className="text-destructive text-xs mt-1 px-1">{errors.declaration.message}</p>}
                <p className="text-xs text-muted-foreground px-1 mt-2">Applicant Signature: <span className="font-medium">[Digital acceptance via checkbox]</span></p>
                <p className="text-xs text-muted-foreground px-1">Representative Signature (if applicable): <span className="font-medium">[Digital acceptance via checkbox]</span></p>
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
          <p className="text-xs text-muted-foreground text-center">KASUPDA Regulations, 2020 &nbsp;&nbsp;|&nbsp;&nbsp; Version 1.0 2020</p>
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
