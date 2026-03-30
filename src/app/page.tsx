
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin, FileText, ShieldCheck, Users, RefreshCcw, Server, Beaker, Clock, ClipboardList, Calendar, ChevronRight } from "lucide-react";
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
    <div className="flex flex-col items-center">
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

      <section className="w-full py-8 md:py-16 lg:py-20 bg-muted/40">
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

      {/* Our Impact In Numbers Section */}
      <section className="w-full py-16 bg-white overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 px-4">
            <div className="inline-block rounded-lg bg-green-50 px-4 py-1.5 text-sm text-green-600 font-black uppercase tracking-widest mb-6">
              STATISTICS
            </div>
            <h2 className="text-4xl font-black tracking-tight text-green-600 sm:text-5xl md:text-6xl mb-6">
              Our Impact In Numbers
            </h2>
            <p className="mt-4 text-slate-500 font-bold max-w-3xl mx-auto text-xl leading-snug tracking-tight">
              These numbers highlight the real impact of our work, showing the progress and positive change we&apos;ve achieved over time
            </p>
          </div>

          <div className="w-full bg-gradient-to-r from-green-800 to-green-600 rounded-[3rem] p-10 md:p-16 lg:p-24 shadow-[0_45px_100px_rgba(22,101,52,0.3)] relative">
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl p-10"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {/* Permits Issued */}
              <div className="bg-white rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl hover:scale-110 transition-all duration-500 transform hover:-translate-y-4 group">
                <div className="w-24 h-24 bg-yellow-50 rounded-[2rem] flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                  <FileText className="h-12 w-12 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <div className="text-6xl font-black text-slate-900 tracking-tighter">5240+</div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Permits Issued</p>
                </div>
              </div>

              {/* Avg Processing Time */}
              <div className="bg-white rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl hover:scale-110 transition-all duration-500 transform hover:-translate-y-4 group">
                <div className="w-24 h-24 bg-yellow-50 rounded-[2rem] flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                  <Clock className="h-12 w-12 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <div className="text-6xl font-black text-slate-900 tracking-tighter">48hrs</div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Avg. Processing Time</p>
                </div>
              </div>

              {/* Master Plans */}
              <div className="bg-white rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl hover:scale-110 transition-all duration-500 transform hover:-translate-y-4 group">
                <div className="w-24 h-24 bg-yellow-50 rounded-[2rem] flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                  <ClipboardList className="h-12 w-12 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <div className="text-6xl font-black text-slate-900 tracking-tighter">32</div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Master Plans</p>
                </div>
              </div>

              {/* Community Projects */}
              <div className="bg-white rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl hover:scale-110 transition-all duration-500 transform hover:-translate-y-4 group">
                <div className="w-24 h-24 bg-yellow-50 rounded-[2rem] flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                  <Users className="h-12 w-12 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <div className="text-6xl font-black text-slate-900 tracking-tighter">12</div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Community Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className="w-full py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-24 px-4">
            <h2 className="text-4xl font-black tracking-tight text-green-600 sm:text-6xl mb-6 uppercase">
              News & Events
            </h2>
            <p className="mt-4 text-slate-500 font-bold max-w-5xl mx-auto text-2xl leading-relaxed tracking-tight p-2 border-b-2 border-slate-50">
              Explore recent announcements, planning reforms, stakeholder engagements, and key events driving sustainable urban growth across Kaduna State.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-40 items-start">
            {/* Latest News & Updates */}
            <div className="space-y-16">
              <div className="border-l-8 border-green-600 pl-8">
                <h3 className="text-4xl font-black text-green-600 leading-none">Latest News & Updates</h3>
                <p className="text-slate-500 font-black mt-4 text-2xl tracking-tight">Stay Informed on Urban Development in Kaduna</p>
              </div>

              <div className="space-y-12">
                {[
                  { title: "KASUPDA Launches Permit Monitor System", date: "Feb 10, 2026", img: "/image/logo.png" },
                  { title: "2025 Awareness Week Concludes", date: "Feb 06, 2026", img: "/image/logo.png" },
                  { title: "City Inspections & Enforcement Drive", date: "Feb 02, 2026", img: "/image/logo.png" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-12 group cursor-pointer hover:bg-slate-50/50 p-4 rounded-[2.5rem] transition-all duration-500 transform hover:-translate-x-2">
                    <div className="w-64 h-36 bg-white rounded-[2rem] overflow-hidden flex-shrink-0 shadow-xl border-4 border-white group-hover:rotate-1">
                      <Image src={item.img} alt={item.title} width={256} height={144} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[2000ms] ease-out" />
                    </div>
                    <div className="flex flex-col justify-center space-y-6">
                      <h4 className="text-2xl font-black text-slate-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight tracking-tighter">{item.title}</h4>
                      <p className="text-sm font-black text-slate-400 tracking-[0.3em] uppercase">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events & Public Engagement */}
            <div className="space-y-16">
              <div className="flex justify-between items-center bg-green-50/50 p-4 rounded-3xl border-2 border-green-100/20">
                <h3 className="text-3xl font-black text-green-600 leading-none pl-4">Events & Public Engagement</h3>
                <div className="bg-green-600 text-white text-sm px-10 py-5 rounded-[2rem] font-black flex items-center gap-4 shadow-2xl shadow-green-200 transform translate-x-6 lg:translate-x-16 hover:scale-105 transition-transform cursor-pointer">
                  FEBRUARY 2026 <ChevronRight className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-10">
                {[
                  { day: "Sat", date: "25", title: "Planning Stakeholders Meeting", actualDate: "March 10, 2026" },
                  { day: "Mon", date: "27", title: "Public Hearing", actualDate: "April 10, 2026" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border-2 border-slate-100 rounded-[3rem] p-12 flex gap-12 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-1000 transform hover:-translate-y-4 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="flex flex-col items-center justify-center bg-blue-50 rounded-[2.5rem] w-32 h-32 flex-shrink-0 border-4 border-white shadow-inner group-hover:bg-green-100 transition-all duration-700">
                      <span className="text-xs uppercase font-black text-slate-400 tracking-[0.3em] group-hover:text-green-400 transition-colors mb-2">{item.day}</span>
                      <span className="text-7xl font-black text-green-600 leading-none tracking-tighter group-hover:scale-125 transition-all duration-500">{item.date}</span>
                    </div>
                    <div className="flex flex-col justify-center space-y-6">
                      <h4 className="text-4xl font-black text-green-600 leading-none group-hover:text-green-700 transition-colors tracking-tighter">{item.title}</h4>
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                        <p className="text-xl text-orange-500 font-black tracking-tight">{item.actualDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-12 flex justify-start">
                <Button className="rounded-[2.5rem] border-4 border-slate-100 bg-white text-yellow-500 font-black hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 gap-8 h-24 px-20 text-3xl shadow-2xl transition-all duration-700 active:scale-95 hover:shadow-yellow-100">
                  <Calendar className="h-10 w-10 text-yellow-500" />
                  View All News
                  <ChevronRight className="h-8 w-8 transition-transform group-hover:translate-x-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-8 md:py-16 lg:py-20">
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

      <section className="w-full py-8 md:py-16 lg:py-20">
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
