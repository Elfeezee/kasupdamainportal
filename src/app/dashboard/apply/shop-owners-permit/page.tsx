
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
import { useSession } from 'next-auth/react';

const phoneRegex = /^\d{11}$/;

const shopOwnersPermitSchema = z.object({
  kopNumber: z.string().optional(),

  // Box 1: Main Applicant
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
  phone1: z.string().length(11, "Phone number must be exactly 11 digits").regex(phoneRegex, "Phone number must contain only digits"),
  phone2: z.string().regex(phoneRegex, "Phone number must be exactly 11 digits").optional().or(z.literal('')),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  identificationType: z.object({
    internationalPassport: z.boolean().optional(),
    taxIdCard: z.boolean().optional(),
    nationalIdCard: z.boolean().optional(),
    driversLicense: z.boolean().optional(),
    voterRegCard: z.boolean().optional(),
  }).optional().default({}),
  idNumber: z.string().optional(),

  // Box 2: Address
  appHouseNo: z.string().optional(),
  appStreetName: z.string().optional(),
  appDistrict: z.string().optional(),
  appCityTown: z.string().optional(),
  appState: z.string().optional().default("Kaduna"),
  appCountry: z.string().optional().default("Nigeria"),
  appPOBox: z.string().optional(),
  appCO: z.string().optional(),
  appAdditionalAddressInfo: z.string().optional(),

  // Box 3: Application Update
  typeOfDevelopment: z.string().min(1, "Type of development is required"),
  categoryOfBusiness: z.string().min(1, "Category of business is required"),
  plotDistrict: z.string().optional(),
  plotLGA: z.string().optional(),
  plotAddressDescription: z.string().min(1, "Address/Description of plot is required"),

  // Box 4: Signature
  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit the application."
  })
});

type ShopOwnersPermitFormValues = z.infer<typeof shopOwnersPermitSchema>;

const identificationOptions = [
  { id: "internationalPassport" as const, label: "International Passport" },
  { id: "taxIdCard" as const, label: "Tax Identification Card" },
  { id: "nationalIdCard" as const, label: "National ID Card" },
  { id: "driversLicense" as const, label: "Driver's License" },
  { id: "voterRegCard" as const, label: "Voter Registration Card" },
];

const steps = [
  { id: 1, name: "Main Applicant", fields: ['firstName', 'surname', 'gender', 'dateOfBirth', 'phone1'] as FieldName<ShopOwnersPermitFormValues>[] },
  { id: 2, name: "Applicant Address", fields: [] as FieldName<ShopOwnersPermitFormValues>[] },
  { id: 3, name: "Application Update", fields: ['typeOfDevelopment', 'categoryOfBusiness', 'plotAddressDescription'] as FieldName<ShopOwnersPermitFormValues>[] },
  { id: 4, name: "Signature", fields: ['declaration'] as FieldName<ShopOwnersPermitFormValues>[] },
];

import { useFormPersistence } from '@/hooks/use-form-persistence';

export default function ShopOwnersPermitPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login?redirectTo=/dashboard/apply/shop-owners-permit');
    }
  }, [sessionStatus, router]);

  const form = useForm<ShopOwnersPermitFormValues>({
    resolver: zodResolver(shopOwnersPermitSchema),
    mode: "onChange",
    defaultValues: {
      kopNumber: "",
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
      typeOfDevelopment: "",
      categoryOfBusiness: "",
      plotDistrict: "",
      plotLGA: "",
      plotAddressDescription: "",
      declaration: false,
    }
  });

  const { register, handleSubmit, control, formState: { errors }, trigger } = form;

  const { clearStorage } = useFormPersistence(form, 'shop-owners-permit-form');

  const onSubmit = async (data: ShopOwnersPermitFormValues) => {
    if (!session?.user) {
      toast({ title: "Error", description: "You must be logged in to submit an application.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('type', "Temporary Shop Owners Permit");
    const applicantName = [data.firstName, data.middleName, data.surname].filter(Boolean).join(' ');
    formData.append('applicantName', applicantName);
    formData.append('userId', session.user.id);

    for (const [key, value] of Object.entries(data)) {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (typeof value === 'object' && value !== null && !(value instanceof FileList) && !(value instanceof Date)) {
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          if (typeof nestedValue === 'boolean' && nestedValue) {
            formData.append(`${key}.${nestedKey}`, 'on');
          }
        }
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === 'boolean' && value) {
        formData.append(key, 'on');
      } else if (value) {
        formData.append(key, value as string);
      }
    }

    try {
      const result = await saveApplication(formData);
      if (result.success) {
        clearStorage();
        if (result.error) {
          toast({
            title: "Application Saved with Issues",
            description: result.error,
            variant: "destructive",
          });
        }
        router.push(`/dashboard/billing`);
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
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Application Form for Temporary Shop Owners
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
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 1: MAIN APPLICANT</CardTitle><CardDescription className="text-xs sm:text-sm">An Original identification document used to prove identity must be submitted; it will be copied and returned.</CardDescription></CardHeader>
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
                  <Controller name="gender" control={control} render={({ field }) => (<RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 mt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="Male" id="male" /><Label htmlFor="male" className="font-normal">Male</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Female" id="female" /><Label htmlFor="female" className="font-normal">Female</Label></div></RadioGroup>)} />
                  {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                  <Controller name="dateOfBirth" control={control} render={({ field }) => (<Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal mt-1"><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={(date) => date > new Date() || date < new Date("1900-01-01")} /></PopoverContent></Popover>)} />
                  {errors.dateOfBirth && <p className="text-destructive text-xs mt-1">{errors.dateOfBirth.message}</p>}
                </div>
                <div><Label htmlFor="occupation">Occupation</Label><Input id="occupation" {...register("occupation")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="nationality">Nationality</Label><Input id="nationality" {...register("nationality")} /></div>
                <div><Label htmlFor="stateOfOrigin">State of Origin</Label><Input id="stateOfOrigin" {...register("stateOfOrigin")} /></div>
                <div><Label htmlFor="localGov">Local Gov.</Label><Input id="localGov" {...register("localGov")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="phone1">Phone 1*</Label><Input id="phone1" type="tel" {...register("phone1")} />{errors.phone1 && <p className="text-destructive text-xs mt-1">{errors.phone1.message}</p>}</div>
                <div><Label htmlFor="phone2">Phone 2</Label><Input id="phone2" type="tel" {...register("phone2")} />{errors.phone2 && <p className="text-destructive text-xs mt-1">{errors.phone2.message}</p>}</div>
              </div>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} />{errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}</div>
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
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 2: ADDRESS</CardTitle><CardDescription className="text-xs sm:text-sm">All applicants must complete Box 2 in full. This should be your normal residential address.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="appHouseNo">House No</Label><Input id="appHouseNo" {...register("appHouseNo")} /></div><div><Label htmlFor="appStreetName">Street Name</Label><Input id="appStreetName" {...register("appStreetName")} placeholder="Ahmadu Bello Road" /></div></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><Label htmlFor="appDistrict">District</Label><Input id="appDistrict" {...register("appDistrict")} placeholder="Sabon Gari" /></div><div><Label htmlFor="appCityTown">City/Town</Label><Input id="appCityTown" {...register("appCityTown")} placeholder="Zaria" /></div><div><Label htmlFor="appState">State</Label><Input id="appState" {...register("appState")} /></div></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><Label htmlFor="appCountry">Country</Label><Input id="appCountry" {...register("appCountry")} /></div><div><Label htmlFor="appPOBox">P.O./P.M.B.</Label><Input id="appPOBox" {...register("appPOBox")} placeholder="040 Zaria" /></div><div><Label htmlFor="appCO">C/O</Label><Input id="appCO" {...register("appCO")} /></div></div>
              <div><Label htmlFor="appAdditionalAddressInfo">Additional Address Information</Label><Textarea id="appAdditionalAddressInfo" {...register("appAdditionalAddressInfo")} placeholder="G.R.A Res. Estate" /></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 3: APPLICATION UPDATE</CardTitle><CardDescription className="text-xs sm:text-sm">Please fill in the below information of the plot that has been or will be developed.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="typeOfDevelopment">Type of development*</Label><Input id="typeOfDevelopment" {...register("typeOfDevelopment")} />{errors.typeOfDevelopment && <p className="text-destructive text-xs mt-1">{errors.typeOfDevelopment.message}</p>}</div>
              <div><Label htmlFor="categoryOfBusiness">Category of business*</Label><Input id="categoryOfBusiness" {...register("categoryOfBusiness")} />{errors.categoryOfBusiness && <p className="text-destructive text-xs mt-1">{errors.categoryOfBusiness.message}</p>}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="plotDistrict">District</Label><Input id="plotDistrict" {...register("plotDistrict")} /></div>
                <div><Label htmlFor="plotLGA">LGA</Label><Input id="plotLGA" {...register("plotLGA")} /></div>
              </div>
              <div><Label htmlFor="plotAddressDescription">Address/Description*</Label><Textarea id="plotAddressDescription" {...register("plotAddressDescription")} />{errors.plotAddressDescription && <p className="text-destructive text-xs mt-1">{errors.plotAddressDescription.message}</p>}</div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader><CardTitle className="text-lg sm:text-xl">BOX 4: SIGNATURE</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2 p-4 border rounded-md bg-muted/30">
                <Controller name="declaration" control={control} render={({ field }) => (<Checkbox id="declaration" checked={!!field.value} onCheckedChange={field.onChange} className="mt-1" />)} />
                <Label htmlFor="declaration" className="font-normal text-sm leading-snug">I, the applicant, declare that the information provided in this application and any attached documents is true, correct, and complete to the best of my knowledge and belief. I understand that any false statement may result in the rejection of this application or revocation of any permit granted.</Label>
              </div>
              {errors.declaration && <p className="text-destructive text-xs mt-1 px-1">{errors.declaration.message}</p>}
              <p className="text-sm text-muted-foreground px-1">Applicant Signature: <span className="font-medium">[Digital acceptance via checkbox]</span></p>
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
          <p className="text-xs text-muted-foreground text-center">KASUPDA Regulations, 2025 &nbsp;&nbsp;|&nbsp;&nbsp; Version 1.1 2025</p>
        </CardFooter>
      </form>
    </div>
  );
}

// Simple CheckIcon for stepper
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
