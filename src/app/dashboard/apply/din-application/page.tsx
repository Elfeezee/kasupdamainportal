
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Fingerprint } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { generateAndSaveDin } from '@/app/actions/applicationActions';

// Zod schema based on Box 1 of the BPI form
const dinApplicationSchema = z.object({
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
  fileNumber: z.string().optional(),
  kdlNumber: z.string().optional(),
  docCO: z.any().refine(files => !files || files.length === 0 || (files?.[0]?.size <= 5000000), 'Max file size is 5MB.').optional(),
  declaration: z.boolean().refine(val => val === true, {
    message: "You must agree to the declaration to submit."
  })
});

type DinApplicationFormValues = z.infer<typeof dinApplicationSchema>;

const identificationOptions = [
  { id: "internationalPassport" as const, label: "International Passport" },
  { id: "taxIdCard" as const, label: "Tax Identification Card" },
  { id: "nationalIdCard" as const, label: "National ID Card" },
  { id: "voterRegCard" as const, label: "Voter Registration Card" },
  { id: "driversLicense" as const, label: "Driver's License" },
];

function DinApplicationForm({ user, onSubmit, isSubmitting }: { user: User, onSubmit: (data: DinApplicationFormValues) => void, isSubmitting: boolean }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<DinApplicationFormValues>({
    resolver: zodResolver(dinApplicationSchema),
    mode: "onChange",
    defaultValues: { 
      title: "",
      firstName: user.user_metadata?.full_name?.split(' ')[0] || "",
      surname: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
      nationality: "Nigerian",
      phone1: user.phone || "",
      email: user.email || "",
      identificationType: {},
      idNumber: "",
      fileNumber: "",
      kdlNumber: "",
      docCO: undefined,
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
        <CardContent className="space-y-8">
            {/* Form fields from BPI Box 1 */}
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
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects like 'identificationType'
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          if (typeof nestedValue === 'boolean' && nestedValue) {
            formData.append(`${key}.${nestedKey}`, 'on');
          }
        });
      } else if (value) {
        formData.append(key, String(value));
      }
    });
    
    try {
        const result = await generateAndSaveDin(user.id, applicantName, formData);

        if (result.success && result.din) {
            router.push(`/dashboard/apply/din-application/success?din=${result.din}`);
        } else {
            throw new Error(result.error || "An unknown error occurred during submission.");
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
