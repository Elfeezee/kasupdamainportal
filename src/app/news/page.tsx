
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from 'next';
import { Newspaper, BookOpen } from "lucide-react";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: 'News & Publications | KASUPDA - Kaduna State Urban Planning and Development Authority',
  description: 'Stay updated with the latest news, announcements, and publications from KASUPDA.',
};

import { getNewsItems, getPublications, getMDALogos } from "@/app/actions/newsActions";

export default async function NewsAndPublicationsPage() {
  const dbNewsItems = await getNewsItems();
  const dbPublications = await getPublications();
  const dbMDAs = await getMDALogos();

  const displayNewsItems = dbNewsItems.length > 0 ? dbNewsItems.map(item => ({
    id: item.id,
    title: item.title,
    date: format(new Date(item.date), 'MMMM dd, yyyy'),
    summary: item.summary,
    imageUrl: item.image_url || "/image/logo.png",
    hint: "logo"
  })) : [
    {
      id: 'static-1',
      title: "KASUPDA Announces New Urban Renewal Initiative",
      date: "October 26, 2023",
      summary: "A new initiative aimed at revitalizing key urban areas in Kaduna State has been launched...",
      imageUrl: "/image/logo.png",
      hint: "logo"
    },
    // ... other static items can be kept as fallback if needed, but usually we prefer live data
  ];

  const displayPublications = dbPublications.length > 0 ? dbPublications.map(item => ({
    title: item.title,
    type: item.type,
    summary: item.summary,
    downloadUrl: item.download_url,
    imageUrl: item.image_url || "/image/logo.png",
    hint: "logo"
  })) : [
    {
      title: "Kaduna State Master Plan (2023 Edition)",
      type: "Master Plan",
      summary: "The comprehensive master plan guiding urban development in Kaduna State for the next decade.",
      downloadUrl: "#",
      imageUrl: "/image/logo.png",
      hint: "logo"
    },
  ];
  return (
    <div className="space-y-12">
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary">
              News, Publications and Laws
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
              Stay informed with the latest updates, announcements, and official documents from KASUPDA.
            </p>
          </div>

          {/* News Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-primary mb-8 flex items-center">
              <Newspaper className="mr-3 h-7 w-7" /> Latest News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayNewsItems.map((item, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader className="p-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      data-ai-hint={item.hint}
                      width={600}
                      height={400}
                      className="w-full h-48 object-contain rounded-t-lg bg-muted/20 p-4"
                    />
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <CardTitle className="text-xl font-semibold mb-2">{item.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-3">{item.date}</CardDescription>
                    <p className="text-sm text-foreground">
                      {item.summary}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="p-0 text-primary" asChild>
                      <Link href={`/news/${item.id}`}>Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Publications Section */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-primary mb-8 flex items-center">
              <BookOpen className="mr-3 h-7 w-7" /> Laws
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayPublications.map((item, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader className="p-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      data-ai-hint={item.hint}
                      width={400}
                      height={300}
                      className="w-full h-48 object-contain rounded-t-lg bg-muted/20 p-4"
                    />
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.type}</p>
                    <CardTitle className="text-xl font-semibold mb-2">{item.title}</CardTitle>
                    <p className="text-sm text-foreground mb-4">
                      {item.summary}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href={item.downloadUrl}>Download PDF</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          {/* MDA's Section */}
          {dbMDAs.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-primary mb-12 flex items-center justify-center">
                Our Collaborating MDA&apos;s
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-80">
                {dbMDAs.map((mda, index) => (
                  <div key={index} className="group flex flex-col items-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl shadow-sm border border-border p-4 flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
                      {mda.logo_url ? (
                        <img
                          src={mda.logo_url}
                          alt={mda.name}
                          className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      ) : (
                        <div className="text-xs text-muted-foreground text-center">No Logo</div>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-medium text-muted-foreground text-center line-clamp-1">{mda.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
