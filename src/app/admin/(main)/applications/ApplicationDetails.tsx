
'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, FileText, User, MapPin, Briefcase, Eye, Fingerprint } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getSignedUrl } from '@/app/actions/applicationActions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const FilePreviewModal = ({ url, isOpen, onClose, fileName, error }: { url: string | null, isOpen: boolean, onClose: () => void, fileName: string, error?: string | null }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-xl">
                <DialogHeader className="p-5 border-b bg-white">
                    <DialogTitle className="flex items-center gap-3 text-lg font-bold text-slate-800">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        Previewing: <span className="text-blue-600 capitalize font-extrabold tracking-tight">{fileName}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 bg-[#F8FAFC] relative overflow-hidden">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in zoom-in duration-300">
                            <div className="bg-red-50 p-8 rounded-full mb-6 ring-8 ring-red-50/50">
                                <FileText className="h-16 w-16 text-red-400 stroke-[1.5px]" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Document Not Found</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg font-medium leading-relaxed">
                                {error || "The requested document either wasn't uploaded by the user or is currently unavailable in the storage."}
                            </p>
                            <Button onClick={onClose} variant="outline" className="px-10 py-3 font-bold border-2 hover:bg-slate-50 transition-all rounded-xl">
                                Close Preview
                            </Button>
                        </div>
                    ) : url ? (
                        <iframe
                            src={url}
                            className="w-full h-full border-0 animate-in fade-in duration-500"
                            title="Document Preview"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/50 backdrop-blur-sm">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-blue-100 rounded-full blur animate-pulse" />
                                <Loader2 className="h-16 w-16 animate-spin text-blue-500 relative z-10 stroke-[2px]" />
                                <div className="absolute inset-0 flex items-center justify-center relative z-10">
                                    <FileText className="h-6 w-6 text-blue-400" />
                                </div>
                            </div>
                            <p className="text-slate-600 mt-8 font-bold animate-pulse text-xl tracking-wide uppercase italic">
                                Fetching Secure Preview...
                            </p>
                            <p className="text-slate-400 mt-2 font-medium">Please wait while we prepare your document</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const FileActionButtons = ({ url, fileName }: { url: string, fileName: string }) => {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [loadingError, setLoadingError] = React.useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    // If no URL is provided, the document wasn't uploaded
    if (!url) {
        return (
            <div className="mt-3">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 py-1 px-2.5 rounded-lg flex items-center gap-1.5 font-semibold text-[10px] uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    Not Uploaded
                </Badge>
            </div>
        );
    }

    const generateUrl = async () => {
        setIsGenerating(true);
        setLoadingError(null);
        try {
            // If it's already a full URL or a local path starting with /uploads, return it as is
            if (url.startsWith('http') || url.startsWith('/uploads')) {
                return url;
            }

            // Otherwise, it might be a raw path from Supabase that needs to be processed
            // This is a fallback for older records that might only store the path
            const result = await getSignedUrl(url);
            if (result.success && result.url) {
                return result.url;
            } else {
                throw new Error(result.error || 'The file record exists, but the document could not be retrieved.');
            }
        } catch (error: any) {
            const errorMsg = error.message || "Could not access the file.";
            setLoadingError(errorMsg);
            toast({
                title: "Document Error",
                description: errorMsg,
                variant: "destructive"
            });
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        const signedUrl = await generateUrl();
        if (signedUrl) window.open(signedUrl, '_blank');
    };

    const handlePreview = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsPreviewOpen(true);
        setPreviewUrl(null);
        const signedUrl = await generateUrl();
        if (signedUrl) setPreviewUrl(signedUrl);
    };

    return (
        <>
            <div className="flex items-center gap-2 mt-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreview}
                    disabled={isGenerating}
                    className="h-8 text-xs"
                >
                    <Eye className="h-3 w-3 mr-1.5" /> Preview
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="h-8 text-xs text-primary"
                >
                    {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3 mr-1.5" />}
                    Download
                </Button>
            </div>
            <FilePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                url={previewUrl}
                fileName={fileName}
                error={loadingError}
            />
        </>
    );
};

const renderFieldValue = (
    key: string,
    value: any,
    isEditing: boolean,
    editedData: Record<string, any>,
    onInputChange: (key: string, value: string | boolean) => void
) => {
    // Skip internal fields and URLs from simple rendering
    if (['id', 'user_id', 'created_at', 'rejection_reason', 'data'].includes(key)) return null;
    if (key.endsWith('_url')) return null;

    // --- Edit Mode ---
    if (isEditing) {
        const currentEditedValue = editedData[key] ?? value;
        if (typeof value === 'boolean') {
            return (
                <Checkbox
                    className="w-5 h-5 mt-1"
                    checked={!!currentEditedValue}
                    onCheckedChange={(checked) => onInputChange(key, !!checked)}
                />
            );
        }
        if (key.toLowerCase().includes('date') && typeof value === 'string') {
            // Try to parse date for input value
            let dateVal = '';
            try {
                if (currentEditedValue && !isNaN(Date.parse(currentEditedValue))) {
                    dateVal = format(parseISO(currentEditedValue), 'yyyy-MM-dd');
                }
            } catch (e) { }

            return (
                <Input
                    type="date"
                    value={dateVal}
                    onChange={(e) => onInputChange(key, e.target.value)}
                    className="h-9"
                />
            );
        }
        return <Input value={currentEditedValue ?? ''} onChange={(e) => onInputChange(key, e.target.value)} className="h-9" />;
    }

    // --- Display Mode ---
    if (typeof value === 'boolean') {
        return value ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Yes</Badge> : <Badge variant="secondary">No</Badge>;
    }

    if (key.toLowerCase().includes('date') && typeof value === 'string' && !isNaN(Date.parse(value))) {
        return <p className="text-sm font-medium text-slate-700">{format(parseISO(value), 'PPP')}</p>;
    }

    if (value && typeof value === 'object') {
        const entries = Array.isArray(value)
            ? value.map((item, index) => ({ key: String(index), value: item }))
            : Object.entries(value).map(([nestedKey, nestedValue]) => ({ key: nestedKey, value: nestedValue }));

        if (entries.length === 0) {
            return <span className="text-sm text-slate-400 italic">Not provided</span>;
        }

        return (
            <div className="space-y-2">
                {entries.map(({ key: nestedKey, value: nestedValue }) => {
                    if (typeof nestedValue === 'boolean') {
                        return (
                            <div key={nestedKey} className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="font-semibold">{nestedKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:</span>
                                <span>{nestedValue ? 'Yes' : 'No'}</span>
                            </div>
                        );
                    }
                    return (
                        <div key={nestedKey} className="text-sm text-slate-700 break-words">
                            <span className="font-semibold">{nestedKey.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:</span>{' '}
                            {String(nestedValue)}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Empty state
    if (!value && value !== 0) return <span className="text-sm text-slate-400 italic">Not provided</span>;

    return <p className="text-sm font-medium text-slate-800 break-words">{value}</p>;
};

interface ApplicationDetailsProps {
    application: Record<string, any>;
    isEditing: boolean;
    editedData: Record<string, any>;
    onInputChange: (key: string, value: string | boolean) => void;
}

export default function ApplicationDetails({ application, isEditing, editedData, onInputChange }: ApplicationDetailsProps) {
    const { data, ...rest } = application;
    const flattenedApp = { ...rest, ...(typeof data === 'object' && data !== null ? data : {}) };

    // Categorize keys
    const docKeys = Object.keys(flattenedApp).filter(k => k.endsWith('_url'));

    // Define field groups for tabs
    const applicantKeys = ['applicant_name', 'title', 'first_name', 'surname', 'phone1', 'email', 'address', 'nationality', 'state_of_origin'];
    const siteKeys = ['plot_address', 'land_use', 'purpose', 'plot_district', 'plot_lga', 'site_street_name', 'site_city_town', 'coordinates', 'site_coord_lat', 'site_coord_long'];
    const professionalKeys = ['rep_first_name', 'rep_surname', 'rep_phone1', 'rep_email', 'rep_id_number', 'company_name', 'org_name', 'cac_number', 'tin', 'org_tin'];
    const dinKeys = ['postal_code', 'lga_code', 'ward_code', 'street_code', 'plot_number', 'serial_number', 'generated_din'];

    const allKnownKeys = [...docKeys, ...applicantKeys, ...siteKeys, ...professionalKeys, ...dinKeys, 'id', 'user_id', 'created_at', 'status', 'type'];
    const otherKeys = Object.keys(flattenedApp).filter(k => !allKnownKeys.includes(k) && !k.endsWith('_url') && !['data', 'rejection_reason'].includes(k));

    const renderFieldGroup = (keys: string[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keys.map(key => {
                if (flattenedApp[key] === undefined && !isEditing) return null;
                return (
                    <div key={key} className="space-y-1.5 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <Label className="capitalize text-xs font-bold text-slate-500 tracking-wide block mb-1">
                            {key.replace(/_/g, ' ').replace('app ', '').replace('org ', '').replace('rep ', '')}
                        </Label>
                        {renderFieldValue(key, flattenedApp[key], isEditing, editedData, onInputChange)}
                    </div>
                );
            })}
        </div>
    );

    return (
        <Tabs defaultValue="applicant" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-6">
                <TabsTrigger value="applicant" className="gap-2"><User className="h-4 w-4" /> Applicant</TabsTrigger>
                <TabsTrigger value="site" className="gap-2"><MapPin className="h-4 w-4" /> Site Info</TabsTrigger>
                <TabsTrigger value="professional" className="gap-2"><Briefcase className="h-4 w-4" /> Professional</TabsTrigger>
                <TabsTrigger value="documents" className="gap-2"><FileText className="h-4 w-4" /> Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="applicant" className="mt-0">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        {renderFieldGroup([...applicantKeys, ...otherKeys])}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="site" className="mt-0">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 space-y-8">
                        <section>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Site Location Information
                            </h3>
                            {renderFieldGroup(siteKeys)}
                        </section>

                        {(flattenedApp.postal_code || flattenedApp.generated_din) && (
                            <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Fingerprint className="h-4 w-4" /> DIN Generation Parameters
                                </h3>
                                {renderFieldGroup(dinKeys)}
                            </section>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="professional" className="mt-0">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        {renderFieldGroup(professionalKeys)}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
                <Card className="border-slate-200 shadow-sm bg-slate-50/50">
                    <CardContent className="p-6">
                        {docKeys.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No documents uploaded for this application.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {docKeys.map(key => (
                                    <div key={key} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate capitalize" title={key.replace('doc_', '').replace('_url', '').replace(/_/g, ' ')}>
                                                    {key.replace('doc_', '').replace('_url', '').replace(/_/g, ' ')}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">Document</p>

                                                <FileActionButtons
                                                    url={flattenedApp[key]}
                                                    fileName={key.replace('doc_', '').replace('_url', '').replace(/_/g, ' ')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
