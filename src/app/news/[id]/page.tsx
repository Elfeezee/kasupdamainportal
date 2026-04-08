
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getNewsItem } from '@/app/actions/newsActions';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
    const item = await getNewsItem(params.id);

    if (!item) {
        notFound();
    }

    return (
        <div className="container px-4 py-12 md:py-16 max-w-4xl mx-auto space-y-8">
            <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-primary">
                <Link href="/news" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to News & Publications
                </Link>
            </Button>

            <article className="space-y-8">
                <header className="space-y-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight">
                        {item.title}
                    </h1>
                    <div className="flex items-center gap-3 text-muted-foreground font-medium">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(item.date), 'MMMM dd, yyyy')}</span>
                    </div>
                </header>

                <div className="w-full overflow-hidden rounded-2xl shadow-xl bg-muted">
                    <a href={item.image_url} target="_blank" rel="noopener noreferrer" className="cursor-zoom-in block">
                        <img
                            src={item.image_url || "/image/logo.png"}
                            alt={item.title}
                            className="w-full h-auto object-contain"
                        />
                    </a>
                    <div className="p-2 text-center text-xs text-muted-foreground bg-muted/50 border-t">
                        Click image to view full resolution
                    </div>
                </div>

                <div className="prose prose-slate lg:prose-xl max-w-none prose-headings:text-primary prose-a:text-primary hover:prose-a:underline">
                    {item.content ? (
                        item.content.split('\n').map((paragraph: string, i: number) => (
                            <p key={i} className="mb-4 text-foreground/90 leading-relaxed">
                                {paragraph}
                            </p>
                        ))
                    ) : (
                        <p>{item.summary}</p>
                    )}
                </div>
            </article>

            <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="font-semibold text-lg">Share this news</h3>
                    <p className="text-sm text-muted-foreground">Keep others informed about KASUPDA's latest updates.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline">Email</Button>
                    <Button variant="outline">LinkedIn</Button>
                </div>
            </div>
        </div>
    );
}
