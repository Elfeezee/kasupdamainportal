
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from 'next';
import { Newspaper, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: 'News & Publications | KASUPDA - Kaduna State Urban Planning and Development Authority',
  description: 'Stay updated with the latest news, announcements, and publications from KASUPDA.',
};

const newsItems = [
  {
    title: "KASUPDA Announces New Urban Renewal Initiative",
    date: "October 26, 2023",
    summary: "A new initiative aimed at revitalizing key urban areas in Kaduna State has been launched...",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "cityscape urban"
  },
  {
    title: "Guidelines for Building Permit Applications Updated",
    date: "October 15, 2023",
    summary: "KASUPDA has released updated guidelines for building permit applications to streamline the process...",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "document blueprint"
  },
  {
    title: "Public Consultation on New Zoning Regulations",
    date: "September 30, 2023",
    summary: "The public is invited to provide feedback on the proposed new zoning regulations for Kaduna metropolis...",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "community meeting"
  },
];

const publications = [
  {
    title: "Kaduna State Master Plan (2023 Edition)",
    type: "Master Plan",
    summary: "The comprehensive master plan guiding urban development in Kaduna State for the next decade.",
    downloadUrl: "#", // Placeholder
    imageUrl: "https://placehold.co/400x300.png",
    hint: "map document"
  },
  {
    title: "Annual Report 2022",
    type: "Report",
    summary: "KASUPDA's annual report detailing activities, achievements, and financial statements for 2022.",
    downloadUrl: "#", // Placeholder
    imageUrl: "https://placehold.co/400x300.png",
    hint: "report chart"
  },
  {
    title: "Building Code and Regulations Handbook",
    type: "Handbook",
    summary: "A complete guide to building codes, standards, and regulations enforced by KASUPDA.",
    downloadUrl: "#", // Placeholder
    imageUrl: "https://placehold.co/400x300.png",
    hint: "book rules"
  },
];

export default function NewsAndPublicationsPage() {
  return (
    <div className="space-y-12">
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary">
              News & Publications
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
              {newsItems.map((item, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader className="p-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      data-ai-hint={item.hint}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover rounded-t-lg"
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
                      <Link href="#">Read More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Publications Section */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-primary mb-8 flex items-center">
              <BookOpen className="mr-3 h-7 w-7" /> Official Publications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {publications.map((item, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader className="p-0">
                     <Image
                        src={item.imageUrl}
                        alt={item.title}
                        data-ai-hint={item.hint}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-t-lg"
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
        </div>
      </section>
    </div>
  );
}
