
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About KASUPDA | KASUPDA - Kaduna State Urban Planning and Development Authority',
  description: 'Learn more about KASUPDA, its mission, vision, and the dedicated team working towards sustainable urban development in Kaduna State.',
};

const directors = [
  { name: "Director General", title: "Director General", imageUrl: "/image/dg.jpg", hint: "person portrait" },
  { name: "Director Development Control", title: "Director", imageUrl: "/image/director-4.jpg", hint: "person portrait" },
  { name: "Director Monitoring and Compliance", title: "Director", imageUrl: "/image/director-3.jpg", hint: "person portrait" },
  { name: "Director Admin and Supply", title: "Director", imageUrl: "/image/director-2.JPG", hint: "person portrait" },
  { name: "Director of Account and Finance", title: "Director", imageUrl: "/image/director-5.jpg", hint: "person portrait" },
  { name: "Director Urban Palnning and Research", title: "Director", imageUrl: "/image/director-6.JPG", hint: "person portrait" },
 
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary">
              About KASUPDA
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
              Kaduna State Urban Planning and Development Authority
            </p>
          </div>
          <div className="prose prose-lg max-w-4xl mx-auto text-foreground">
            <p>
              Welcome to the Kaduna State Urban Planning and Development Authority (KASUPDA). We are dedicated to ensuring the orderly and sustainable development of urban and rural areas within Kaduna State. Our mandate includes development control, urban renewal, and the provision of an enabling environment for housing and infrastructure development.
            </p>
            <p>
              Our vision is to create a well-planned, functional, and aesthetically pleasing urban environment that enhances the quality of life for all residents of Kaduna State. We strive to achieve this through transparent processes, community engagement, and the enforcement of planning laws and regulations.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">Our Mission</h2>
            <p>
              To facilitate and regulate urban development in Kaduna State through effective planning, development control, and the enforcement of building codes, ensuring sustainability, safety, and improved living standards for all citizens.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">Our Core Values</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Integrity:</strong> Upholding the highest ethical standards in all our operations.</li>
              <li><strong>Professionalism:</strong> Delivering services with competence, skill, and diligence.</li>
              <li><strong>Accountability:</strong> Being responsible for our actions and decisions.</li>
              <li><strong>Innovation:</strong> Embracing modern techniques and technologies for urban development.</li>
              <li><strong>Collaboration:</strong> Working with stakeholders and the public to achieve common goals.</li>
            </ul>
            <p className="mt-6">
              KASUPDA is committed to transforming Kaduna State into a model of urban excellence in Nigeria. We continuously work on improving our services, engaging with the community, and ensuring that development aligns with the strategic vision for a greater Kaduna.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">
              Our Directors
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-lg text-muted-foreground sm:text-xl">
              Meet the dedicated individuals guiding KASUPDA.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {directors.map((director, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
                <CardHeader className="p-0 pt-6">
                  <Image
                    src={director.imageUrl}
                    alt={`Photo of ${director.name}`}
                    data-ai-hint={director.hint}
                    width={150}
                    height={150}
                    className="rounded-full object-cover aspect-square border-4 border-primary bg-white"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-semibold">{director.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{director.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
