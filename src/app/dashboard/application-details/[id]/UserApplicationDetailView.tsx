
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ApplicationDetails from '@/app/admin/(main)/applications/ApplicationDetails';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Loader2, Save, X, MessageCircleQuestion, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { updateUserApplication } from '@/app/actions/applicationActions';

interface UserApplicationDetailViewProps {
    application: any;
}

export default function UserApplicationDetailView({ application }: UserApplicationDetailViewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<Record<string, any>>({});
    const [isSaving, setIsSaving] = useState(false);

    const isQueried = application.status === 'Queried';

    // If queried, we might want to encourage editing immediately or show a prominent button
    // But let's just show the "Answer Query / Edit" button.

    const handleEditToggle = () => {
        if (isEditing) {
            setEditedData({}); // Clear edits on cancel
        } else {
            // Initialize with current data
            const { data, ...rest } = application;
            const flat = { ...rest, ...(typeof data === 'object' ? data : {}) };
            setEditedData(flat);
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (key: string, value: string | boolean) => {
        setEditedData(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const result = await updateUserApplication(application.id, editedData);
            if (result.success) {
                toast({
                    title: "Application Updated",
                    description: isQueried ? "Your response has been submitted for review." : "Your changes have been saved."
                });
                setIsEditing(false);
                router.refresh();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save changes.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/my-applications">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Application Details</h1>
                    <p className="text-sm text-slate-500">
                        Viewing details for application ID: <span className="font-mono">{application.original_permit_id || application.din || application.id}</span>
                    </p>
                </div>
            </div>

            {isQueried && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600 shrink-0">
                        <MessageCircleQuestion className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-orange-900">Action Required: Query from Admin</h3>
                        <p className="text-orange-800 mt-2 font-medium">The following attention is needed on your application:</p>
                        <div className="bg-white/50 p-4 border border-orange-200/50 rounded-lg mt-3 text-orange-900 italic">
                            "{application.rejection_reason}"
                        </div>
                        <p className="text-sm text-orange-700 mt-4">
                            Please click "Update & Resubmit" below to correct your information. Your application will be re-evaluated once you save your changes.
                        </p>
                    </div>
                </div>
            )}

            {application.status === 'Rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
                    <div className="bg-red-100 p-3 rounded-full text-red-600 shrink-0">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-900">Application Rejected</h3>
                        <p className="text-red-800 mt-1">Reason: {application.rejection_reason}</p>
                    </div>
                </div>
            )}


            <Card className="border-0 shadow-lg ring-1 ring-slate-200">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-white p-2 rounded shadow-sm">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>{application.type}</CardTitle>
                                <CardDescription>Submitted on {new Date(application.created_at).toLocaleDateString()}</CardDescription>
                            </div>
                        </div>
                        {!isEditing && isQueried && (
                            <Button onClick={handleEditToggle} className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-200">
                                <EditIcon className="mr-2 h-4 w-4" /> Update & Resubmit
                            </Button>
                        )}
                        {!isEditing && !isQueried && application.status === 'Inprogress' && (
                            <Button onClick={handleEditToggle} variant="outline" size="sm">
                                <EditIcon className="mr-2 h-4 w-4" /> Edit Details
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <ApplicationDetails
                        application={application}
                        isEditing={isEditing}
                        editedData={editedData}
                        onInputChange={handleInputChange}
                    />
                </CardContent>
                {isEditing && (
                    <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end gap-3 sticky bottom-0 z-10">
                        <Button variant="ghost" onClick={handleEditToggle} disabled={isSaving}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button onClick={handleSaveChanges} disabled={isSaving} className={isQueried ? "bg-orange-600 hover:bg-orange-700" : ""}>
                            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> {isQueried ? "Save Correction & Resubmit" : "Save Changes"}</>}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}

function EditIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
    )
}
