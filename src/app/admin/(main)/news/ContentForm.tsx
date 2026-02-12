
'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveNewsItem, savePublication } from '@/app/actions/newsActions';
import { Loader2, ArrowLeft, Image as ImageIcon, Upload } from 'lucide-react';
import Link from 'next/link';

interface ContentFormProps {
    initialData?: any;
    type: 'news' | 'publication';
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

        const result = type === 'news'
            ? await saveNewsItem(formData)
            : await savePublication(formData);

        if (result.success) {
            toast({
                title: 'Success',
                description: `${type === 'news' ? 'News item' : 'Publication'} saved successfully.`,
            });
            router.push('/admin/news');
            router.refresh();
        } else {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });
        }
        setIsSubmitting(false);
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
                    {initialData ? 'Edit' : 'Add New'} {type === 'news' ? 'News Item' : 'Publication'}
                </h1>
            </div>

            <form ref={formRef} onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Content Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={initialData?.title} required placeholder="Enter title..." />
                            </div>

                            {type === 'publication' && (
                                <div className="space-y-2">
                                    <Label htmlFor="type">Publication Type (e.g. Report, Master Plan)</Label>
                                    <Input id="type" name="type" defaultValue={initialData?.type} required placeholder="Report" />
                                </div>
                            )}

                            {type === 'news' && (
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" name="date" type="datetime-local" defaultValue={initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : undefined} />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Thumbnail/Image URL</Label>
                                <Input id="imageUrl" name="imageUrl" defaultValue={initialData?.image_url} placeholder="https://..." />
                                <p className="text-xs text-muted-foreground">Provide a link to an image for the thumbnail.</p>
                            </div>

                            {type === 'publication' && (
                                <div className="space-y-2">
                                    <Label htmlFor="downloadUrl">Document Download URL (PDF)</Label>
                                    <Input id="downloadUrl" name="downloadUrl" defaultValue={initialData?.download_url} required placeholder="https://..." />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="summary">Brief Summary</Label>
                                <Textarea id="summary" name="summary" defaultValue={initialData?.summary} required placeholder="Short description for the card list..." rows={3} />
                            </div>

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
