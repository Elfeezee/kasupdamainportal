
'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveNewsItem, savePublication, saveStatistic, saveEvent } from '@/app/actions/newsActions';
import { Loader2, ArrowLeft, Image as ImageIcon, Upload } from 'lucide-react';
import Link from 'next/link';

interface ContentFormProps {
    initialData?: any;
    type: 'news' | 'publication' | 'statistic' | 'event';
}

export default function ContentForm({ initialData, type }: ContentFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        if (initialData?.id) {
            formData.append('id', initialData.id);
        }

        let result: { success: boolean; error?: string };

        try {
            if (type === 'news') {
                result = await saveNewsItem(formData);
            } else if (type === 'publication') {
                result = await savePublication(formData);
            } else if (type === 'statistic') {
                result = await saveStatistic(formData);
            } else if (type === 'event') {
                result = await saveEvent(formData);
            } else {
                result = { success: false, error: 'Invalid content type' };
            }

            if (result.success) {
                toast({
                    title: 'Success',
                    description: `${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully.`,
                });
                router.push('/admin/news');
                router.refresh();
            } else {
                toast({
                    title: 'Error',
                    description: result.error || 'Something went wrong',
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'An unexpected error occurred',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/news">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    {initialData ? 'Edit' : 'Add New'} {type.charAt(0).toUpperCase() + type.slice(1)}
                </h1>
            </div>

            <form ref={formRef} onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>{type.charAt(0).toUpperCase() + type.slice(1)} Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {(type === 'news' || type === 'publication' || type === 'event') && (
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" name="title" defaultValue={initialData?.title} required placeholder="Enter title..." />
                                </div>
                            )}

                            {type === 'statistic' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="label">Label (e.g. Permits Issued)</Label>
                                        <Input id="label" name="label" defaultValue={initialData?.label} required placeholder="Enter label..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="value">Value (e.g. 5240+)</Label>
                                        <Input id="value" name="value" defaultValue={initialData?.value} required placeholder="Enter value..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="icon">Icon (Lucide name, e.g. FileText, Clock, Users)</Label>
                                        <Input id="icon" name="icon" defaultValue={initialData?.icon} placeholder="FileText" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="display_order">Display Order</Label>
                                        <Input id="display_order" name="display_order" type="number" defaultValue={initialData?.display_order || 0} />
                                    </div>
                                </>
                            )}

                            {type === 'event' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="event_date">Date & Time</Label>
                                        <Input id="event_date" name="event_date" type="datetime-local" defaultValue={initialData?.event_date ? new Date(initialData.event_date).toISOString().slice(0, 16) : undefined} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date_text">Display Date Override (e.g. "March 10, 2026")</Label>
                                        <Input id="date_text" name="date_text" defaultValue={initialData?.date_text} placeholder="March 10, 2026" />
                                    </div>
                                </>
                            )}

                            {type === 'publication' && (
                                <div className="space-y-2">
                                    <Label htmlFor="type">Publication Type (e.g. Report, Master Plan)</Label>
                                    <Input id="type" name="type" defaultValue={initialData?.type} required placeholder="Report" />
                                </div>
                            )}

                            {type === 'news' && (
                                <div className="space-y-2">
                                    <Label htmlFor="date">News Date</Label>
                                    <Input id="date" name="date" type="datetime-local" defaultValue={initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : undefined} />
                                </div>
                            )}

                            {(type === 'news' || type === 'publication') && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="imageFile">Thumbnail/Image</Label>
                                        <div className="flex items-center gap-4 border p-4 rounded-md">
                                            <div className="w-24 h-24 bg-muted rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {initialData?.image_url ? (
                                                    <img src={initialData.image_url} alt="Current" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-muted-foreground w-10 h-10" />
                                                )}
                                            </div>
                                            <div className="flex-grow space-y-2">
                                                <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
                                            </div>
                                        </div>
                                        <input type="hidden" name="existingImageUrl" value={initialData?.image_url || ''} />
                                    </div>

                                    {type === 'publication' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="docFile">Document (PDF)</Label>
                                            <div className="flex items-center gap-4 border p-4 rounded-md">
                                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Upload className="text-muted-foreground w-6 h-6" />
                                                </div>
                                                <div className="flex-grow space-y-2">
                                                    <Input id="docFile" name="docFile" type="file" accept="application/pdf" />
                                                </div>
                                            </div>
                                            <input type="hidden" name="existingDownloadUrl" value={initialData?.download_url || ''} />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="summary">Brief Summary</Label>
                                        <Textarea id="summary" name="summary" defaultValue={initialData?.summary} required placeholder="Short description..." rows={3} />
                                    </div>
                                </>
                            )}

                            {type === 'news' && (
                                <div className="space-y-2">
                                    <Label htmlFor="content">Full Content</Label>
                                    <Textarea id="content" name="content" defaultValue={initialData?.content} placeholder="Full story content..." rows={10} />
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t p-6">
                        <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                'Save Content'
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
