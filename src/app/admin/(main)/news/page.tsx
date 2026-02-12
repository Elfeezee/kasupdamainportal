
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Newspaper, BookOpen, Edit, Trash2, ExternalLink } from 'lucide-react';
import { getNewsItems, getPublications, deleteNewsItem, deletePublication } from '@/app/actions/newsActions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';

export default function NewsManagementPage() {
    const { toast } = useToast();
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [publications, setPublications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const [news, pubs] = await Promise.all([getNewsItems(), getPublications()]);
        setNewsItems(news);
        setPublications(pubs);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteNews = async (id: string) => {
        if (!confirm('Are you sure you want to delete this news item?')) return;
        const result = await deleteNewsItem(id);
        if (result.success) {
            toast({ title: 'Deleted', description: 'News item deleted successfully.' });
            fetchData();
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    };

    const handleDeletePublication = async (id: string) => {
        if (!confirm('Are you sure you want to delete this publication?')) return;
        const result = await deletePublication(id);
        if (result.success) {
            toast({ title: 'Deleted', description: 'Publication deleted successfully.' });
            fetchData();
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    };

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">News & Publications Management</h1>
                    <p className="text-muted-foreground mt-1">Manage the content that appears on the public News page.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/admin/news/new?type=news">
                            <Plus className="mr-2 h-4 w-4" /> Add News
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/news/new?type=publication">
                            <Plus className="mr-2 h-4 w-4" /> Add Publication
                        </Link>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="news" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="news" className="gap-2">
                        <Newspaper className="h-4 w-4" /> News Items
                    </TabsTrigger>
                    <TabsTrigger value="publications" className="gap-2">
                        <BookOpen className="h-4 w-4" /> Publications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="news" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <p>Loading news items...</p>
                        ) : newsItems.length === 0 ? (
                            <Card className="col-span-full py-12">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <Newspaper className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                    <p className="text-lg font-medium">No news items found.</p>
                                    <p className="text-muted-foreground mt-1">Add your first news update to share it with the public.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            newsItems.map((item) => (
                                <Card key={item.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                                    <div className="aspect-video w-full bg-muted rounded-t-lg overflow-hidden flex items-center justify-center relative">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <Newspaper className="h-10 w-10 text-muted-foreground opacity-20" />
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
                                        <CardDescription>{format(new Date(item.date), 'PPP')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                                    </CardContent>
                                    <div className="p-4 pt-0 border-t flex justify-end gap-2 px-6 pb-6 mt-4">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/news/${item.id}?type=news`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteNews(item.id)} className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="publications" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <p>Loading publications...</p>
                        ) : publications.length === 0 ? (
                            <Card className="col-span-full py-12">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <BookOpen className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                    <p className="text-lg font-medium">No publications found.</p>
                                    <p className="text-muted-foreground mt-1">Upload reports, handbooks, and master plans.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            publications.map((item) => (
                                <Card key={item.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                                    <div className="aspect-video w-full bg-muted rounded-t-lg overflow-hidden flex items-center justify-center">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <BookOpen className="h-10 w-10 text-muted-foreground opacity-20" />
                                        )}
                                    </div>
                                    <CardHeader>
                                        <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{item.type}</div>
                                        <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                                    </CardContent>
                                    <div className="p-4 pt-0 border-t flex justify-end gap-2 px-6 pb-6 mt-4">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/news/${item.id}?type=publication`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={item.download_url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeletePublication(item.id)} className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
