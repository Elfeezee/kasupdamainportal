
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin, FileText, ShieldCheck, Users, RefreshCcw, Server, Beaker } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, type CarouselImage } from "@/components/ui/carousel";

const initialCarouselImages: CarouselImage[] = [
  {
    src: "/image/logo.png",
    alt: 'KASUPDA Logo',
    hint: 'logo',
    customClassName: "object-cover",
  },
  {
    src: "/image/logo.png",
    alt: 'KASUPDA Logo',
    hint: 'logo',
    customClassName: "object-cover",
  },
  {
    src: "/image/logo.png",
    alt: 'KASUPDA Logo',
    hint: 'logo',
    customClassName: "object-cover",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-12">
      <section className="w-full">
        <div className="container px-0 md:px-0 max-w-full">
          <div className="relative">
            <Carousel
              images={initialCarouselImages}
              className="w-full h-[calc(100vh-var(--header-height,100px))] min-h-[400px] md:min-h-[500px] lg:min-h-[600px] shadow-lg bg-muted"
              imageClassName="object-cover"
              autoPlay={initialCarouselImages.length > 1}
              interval={5000}
              showDots={initialCarouselImages.length > 1}
              showNavigation={initialCarouselImages.length > 1}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 bg-black/60 p-4 md:p-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
                  Streamlining Urban Development in Kaduna State
                </h1>
                <p className="max-w-[700px] mx-auto text-gray-100 md:text-xl">
                  Welcome to the official digital portal of KASUPDA. Discover services, apply for permits, and stay updated on urban planning initiatives in Kaduna.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                  <Button size="lg" asChild>
                    <Link href="/apply-for-permit">
                      Apply for Permit
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <a href="https://permit.kasupda.kdsg.gov.ng/" target="_blank" rel="noopener noreferrer">
                      Renew permit
                      <RefreshCcw className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                What we do
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Core Functions of KASUPDA
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                KASUPDA is responsible for the planning, development, and regulation of urban areas within Kaduna State, ensuring sustainable growth and adherence to building codes.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:max-w-none mt-12">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Development Control</CardTitle>
                <CardDescription>
                  Overseeing and managing construction activities, ensuring compliance with state building codes, urban planning regulations, and safety standards.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>Easily apply for building permits, track your application status, and receive approvals digitally. We ensure compliance with state building codes for safe and legal constructions.</p>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col space-y-1 items-start">
                  <Link href="#" className="text-sm text-primary hover:underline p-0">
                    - Inspection
                  </Link>
                </div>
              </CardFooter>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Urban Planning and Development</CardTitle>
                <CardDescription>
                  Access master plans, approved layouts, and zoning regulations for sustainable development.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>Explore detailed information on Kaduna's master plan, find approved layouts for various areas, and understand zoning requirements for your projects. Ensure your development aligns with the state's strategic urban vision.</p>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col space-y-1 items-start">
                  <Link href="#" className="text-sm text-primary hover:underline p-0">
                    - Master plan
                  </Link>
                  <Link href="#" className="text-sm text-primary hover:underline p-0">
                    - Approved layout
                  </Link>
                  <Link href="#" className="text-sm text-primary hover:underline p-0">
                    - Zoning
                  </Link>
                </div>
              </CardFooter>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader>
                <ShieldCheck className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Building Control</CardTitle>
                <CardDescription>
                  Ensuring adherence to building codes and urban planning regulations across the state.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>KASUPDA monitors construction activities and enforces regulations to maintain urban standards, ensure public safety, and promote orderly development in Kaduna State.</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0" asChild>
                  <Link href="#">Completion</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Public Enlightenment</CardTitle>
                <CardDescription>
                  Engaging and educating the public on urban planning matters and regulations.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>KASUPDA is committed to sensitizing the public about urban planning laws, development procedures, and the importance of orderly settlement for a sustainable Kaduna State.</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0" asChild>
                  <Link href="/news">Get Informed</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader>
                <Beaker className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Modern Integrated Lab</CardTitle>
                <CardDescription>
                  State-of-the-art laboratory for soil testing, integrity tests, and material analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>Our accredited lab provides essential testing services to ensure the structural integrity and safety of buildings and infrastructure projects across the state.</p>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col space-y-1 items-start">
                  <Link href="#" className="text-sm text-primary hover:underline p-0">
                    - Soil Test
                  </Link>
                  <Link href="#" className="text-sm text-primary hover:underline p-0">
                    - Integrity Test
                  </Link>
                </div>
              </CardFooter>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader>
                <Server className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Data Center</CardTitle>
                <CardDescription>
                  Centralized hub for managing and accessing urban planning data and development records.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>The data center houses a comprehensive development register, providing transparent and accessible information for stakeholders and the public.</p>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0" asChild>
                  <Link href="#">Development Register</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                Leadership
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Meet Our Governor
              </h2>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex justify-center order-last lg:order-first">
              <div className="flex flex-col justify-center space-y-4 text-left">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Governor Sen. Uba Sani
                </h3>
                <p className="text-muted-foreground md:text-lg">
                  His Excellency, Governor Uba Sani, is dedicated to the sustainable development and modernization of Kaduna State. His administration champions strategic initiatives that foster economic growth, improve infrastructure, and enhance the quality of life for all citizens.
                </p>
                <p className="text-muted-foreground md:text-lg">
                  With a strong focus on transparency and good governance, Governor Uba Sani is leading Kaduna State towards a future of prosperity and urban excellence, ensuring that development is inclusive and beneficial for every community.
                </p>
                <Button variant="outline" size="lg" className="self-start">
                  Read Full Bio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/image/uba.JPG"
                alt="Photo of the Governor"
                data-ai-hint="person portrait"
                width={400}
                height={400}
                className="rounded-full object-cover aspect-square shadow-2xl border-4 border-primary bg-white p-2"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                Leadership
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Meet Our Director General
              </h2>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex justify-center">
              <Image
                src="/image/dg.jpg"
                alt="Photo of the Director General, Bldr. Abdurrahman Yahya"
                data-ai-hint="person portrait"
                width={400}
                height={400}
                className="rounded-full object-cover aspect-square shadow-2xl border-4 border-primary bg-white p-2"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4 text-left">
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Bldr. Abdurrahman Yahya Phd.
              </h3>
              <p className="text-muted-foreground md:text-lg">
                Our Director General, Bldr. Abdurrahman Yahya, is a visionary leader, deeply committed to the advancement and modernization of KASUPDA. With a steadfast dedication to progress, he champions innovative strategies and fosters a culture of excellence within the authority. His tireless efforts are geared towards transforming Kaduna State into a model of sustainable urban development, ensuring a brighter future for all its citizens.
              </p>
              <p className="text-muted-foreground md:text-lg">
                Under his astute guidance, KASUPDA has embraced cutting-edge technologies and community-centric approaches to urban planning. Dr. Yahya's unwavering commitment to transparency, efficiency, and public service continues to drive the authority towards achieving new heights in urban governance and development, significantly bettering the lives of the people and the operational capacity of the authority.
              </p>
              <Button variant="outline" size="lg" className="self-start">
                Read Full Bio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
