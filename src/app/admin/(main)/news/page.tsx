
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Newspaper, BookOpen, Edit, Trash2, ExternalLink, BarChart3, CalendarDays } from 'lucide-react';
import {
    getNewsItems,
    getPublications,
    deleteNewsItem,
    deletePublication,
    getStatistics,
    getEvents,
    deleteStatistic,
    deleteEvent,
    getLeadership,
    deleteLeadershipPerson,
    getCarouselImages,
    deleteCarouselImage
} from '@/app/actions/newsActions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { UserCheck, LayoutPanelTop } from 'lucide-react';

export default function NewsManagementPage() {
    const { toast } = useToast();
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [publications, setPublications] = useState<any[]>([]);
    const [statistics, setStatistics] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [leadership, setLeadership] = useState<any[]>([]);
    const [carousel, setCarousel] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [news, pubs, stats, evs, lead, car] = await Promise.all([
                getNewsItems(),
                getPublications(),
                getStatistics(),
                getEvents(),
                getLeadership(),
                getCarouselImages()
            ]);
            setNewsItems(news);
            setPublications(pubs);
            setStatistics(stats);
            setEvents(evs);
            setLeadership(lead);
            setCarousel(car);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({ title: 'Error', description: 'Failed to fetch management data.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
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

    const handleDeleteStatistic = async (id: string) => {
        if (!confirm('Are you sure you want to delete this statistic?')) return;
        const result = await deleteStatistic(id);
        if (result.success) {
            toast({ title: 'Deleted', description: 'Statistic deleted successfully.' });
            fetchData();
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        const result = await deleteEvent(id);
        if (result.success) {
            toast({ title: 'Deleted', description: 'Event deleted successfully.' });
            fetchData();
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    };

    const handleDeleteLeadership = async (id: string) => {
        if (!confirm('Are you sure you want to delete this person?')) return;
        const result = await deleteLeadershipPerson(id);
        if (result.success) {
            toast({ title: 'Deleted', description: 'Leader record deleted successfully.' });
            fetchData();
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    };

    const handleDeleteCarousel = async (id: string) => {
        if (!confirm('Are you sure you want to delete this carousel image?')) return;
        const result = await deleteCarouselImage(id);
        if (result.success) {
            toast({ title: 'Deleted', description: 'Carousel image deleted successfully.' });
            fetchData();
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    };

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Content Management</h1>
                    <p className="text-muted-foreground mt-1">Manage news, publications, statistics, events, leadership, and carousel.</p>
                </div>
            </div>

            <Tabs defaultValue="news" className="w-full">
                <TabsList className="flex flex-wrap h-auto p-1 bg-muted rounded-lg w-fit">
                    <TabsTrigger value="news" className="gap-2">
                        <Newspaper className="h-4 w-4" /> News
                    </TabsTrigger>
                    <TabsTrigger value="publications" className="gap-2">
                        <BookOpen className="h-4 w-4" /> Publications
                    </TabsTrigger>
                    <TabsTrigger value="statistics" className="gap-2">
                        <BarChart3 className="h-4 w-4" /> Statistics
                    </TabsTrigger>
                    <TabsTrigger value="events" className="gap-2">
                        <CalendarDays className="h-4 w-4" /> Events
                    </TabsTrigger>
                    <TabsTrigger value="leadership" className="gap-2">
                        <UserCheck className="h-4 w-4" /> Leadership
                    </TabsTrigger>
                    <TabsTrigger value="carousel" className="gap-2">
                        <LayoutPanelTop className="h-4 w-4" /> Carousel
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="news" className="mt-6 space-y-4">
                    <div className="flex justify-end">
                        <Button asChild size="sm">
                            <Link href="/admin/news/new?type=news">
                                <Plus className="mr-2 h-4 w-4" /> Add News
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <p>Loading news items...</p>
                        ) : newsItems.length === 0 ? (
                            <Card className="col-span-full py-12">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <Newspaper className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                    <p className="text-lg font-medium">No news items found.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            newsItems.map((item) => (
                                <Card key={item.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                                    <div className="aspect-video w-full bg-muted rounded-t-lg overflow-hidden flex items-center justify-center relative">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-contain" />
                                        ) : (
                                            <Newspaper className="h-10 w-10 text-muted-foreground opacity-20" />
                                        )}
                                    </div>
                                    <CardHeader className="p-4">
                                        <CardDescription>{format(new Date(item.date), 'PPP')}</CardDescription>
                                        <CardTitle className="line-clamp-2 text-base">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow p-4 pt-0">
                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                                    </CardContent>
                                    <div className="p-4 pt-0 flex justify-end gap-2">
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

                <TabsContent value="publications" className="mt-6 space-y-4">
                    <div className="flex justify-end">
                        <Button asChild size="sm">
                            <Link href="/admin/news/new?type=publication">
                                <Plus className="mr-2 h-4 w-4" /> Add Publication
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <p>Loading publications...</p>
                        ) : publications.length === 0 ? (
                            <Card className="col-span-full py-12">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <BookOpen className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                    <p className="text-lg font-medium">No publications found.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            publications.map((item) => (
                                <Card key={item.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                                    <div className="aspect-video w-full bg-muted rounded-t-lg overflow-hidden flex items-center justify-center">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-contain" />
                                        ) : (
                                            <BookOpen className="h-10 w-10 text-muted-foreground opacity-20" />
                                        )}
                                    </div>
                                    <CardHeader className="p-4">
                                        <Badge variant="secondary" className="w-fit mb-1">{item.type}</Badge>
                                        <CardTitle className="line-clamp-2 text-base">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow p-4 pt-0">
                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                                    </CardContent>
                                    <div className="p-4 pt-0 flex justify-end gap-2">
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

                <TabsContent value="statistics" className="mt-6 space-y-4">
                    <div className="flex justify-end">
                        <Button asChild size="sm">
                            <Link href="/admin/news/new?type=statistic">
                                <Plus className="mr-2 h-4 w-4" /> Add Statistic
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            <p>Loading statistics...</p>
                        ) : statistics.length === 0 ? (
                            <Card className="col-span-full py-12">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <BarChart3 className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                    <p className="text-lg font-medium">No statistics found.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            statistics.map((item) => (
                                <Card key={item.id} className="shadow-md">
                                    <CardHeader className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <BarChart3 className="h-5 w-5 text-primary" />
                                            </div>
                                            <Badge variant="outline">Order: {item.display_order}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-center">
                                        <div className="text-2xl font-bold text-primary">{item.value}</div>
                                        <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
                                    </CardContent>
                                    <div className="p-4 pt-0 flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/news/${item.id}?type=statistic`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteStatistic(item.id)} className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="events" className="mt-6 space-y-4">
                    <div className="flex justify-end">
                        <Button asChild size="sm">
                            <Link href="/admin/news/new?type=event">
                                <Plus className="mr-2 h-4 w-4" /> Add Event
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <p>Loading events...</p>
                        ) : events.length === 0 ? (
                            <Card className="col-span-full py-12">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <CalendarDays className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                    <p className="text-lg font-medium">No events found.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            events.map((item) => (
                                <Card key={item.id} className="shadow-md">
                                    <CardHeader className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg w-12 h-12 flex-shrink-0">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground">{format(new Date(item.event_date), 'EEE')}</span>
                                                <span className="text-lg font-bold text-primary">{format(new Date(item.event_date), 'd')}</span>
                                            </div>
                                            <div>
                                                <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
                                                <CardDescription>{item.date_text || format(new Date(item.event_date), 'PPP')}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <div className="p-4 pt-0 flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/news/${item.id}?type=event`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(item.id)} className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="leadership" className="mt-6 space-y-4">
                    <div className="flex justify-end">
                        <Button asChild size="sm">
                            <Link href="/admin/news/new?type=leadership">
                                <Plus className="mr-2 h-4 w-4" /> Add Leader
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <p>Loading leadership...</p>
                        ) : leadership.length === 0 ? (
                            <Card className="col-span-full py-12">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <UserCheck className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                    <p className="text-lg font-medium">No leadership records found.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            leadership.map((item) => (
                                <Card key={item.id} className="flex flex-col shadow-md">
                                    <div className="aspect-square w-32 h-32 mx-auto mt-6 bg-muted rounded-full overflow-hidden flex items-center justify-center border-4 border-primary/10">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCheck className="h-12 w-12 text-muted-foreground opacity-20" />
                                        )}
                                    </div>
                                    <CardHeader className="p-4 text-center">
                                        <CardTitle className="text-lg">{item.name}</CardTitle>
                                        <Badge variant="outline" className="w-fit mx-auto">{item.role}</Badge>
                                    </CardHeader>
                                    <CardContent className="flex-grow p-4 pt-0">
                                        <p className="text-sm text-muted-foreground line-clamp-3 text-center">{item.bio}</p>
                                    </CardContent>
                                    <div className="p-4 pt-0 flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/news/${item.id}?type=leadership`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteLeadership(item.id)} className="text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="carousel" className="mt-6 space-y-4">
                    <div className="flex justify-end">
                        <Button asChild size="sm">
                            <Link href="/admin/news/new?type=carousel">
                                <Plus className="mr-2 h-4 w-4" /> Add Slide
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <p>Loading carousel...</p>
                        ) : carousel.length === 0 ? (
                            <Card className="col-span-full py-12">
                                <CardContent className="flex flex-col items-center justify-center text-center">
                                    <LayoutPanelTop className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                    <p className="text-lg font-medium">No carousel slides found.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            carousel.map((item) => (
                                <Card key={item.id} className="flex flex-col shadow-md overflow-hidden">
                                    <div className="aspect-video w-full bg-muted flex items-center justify-center relative">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <LayoutPanelTop className="h-10 w-10 text-muted-foreground opacity-20" />
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <Badge>Order: {item.display_order}</Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base line-clamp-1">{item.title || 'No Title'}</CardTitle>
                                        <CardDescription className="line-clamp-1">{item.subtitle || 'No Subtitle'}</CardDescription>
                                    </CardHeader>
                                    <div className="p-4 pt-0 flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/news/${item.id}?type=carousel`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCarousel(item.id)} className="text-destructive">
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
