
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | KASUPDA - Kaduna State Urban Planning and Development Authority',
  description: 'Frequently Asked Questions about KASUPDA services, permits, and regulations.',
};

const faqItems = [
  {
    question: "What is KASUPDA?",
    answer:
      "KASUPDA stands for Kaduna State Urban Planning and Development Authority. It is the government agency responsible for urban planning, development control, and ensuring orderly physical development within Kaduna State.",
  },
  {
    question: "How do I apply for a building permit?",
    answer:
      "You can apply for a building permit through our e-service portal. Visit the 'Apply for Permit' section on our website and follow the instructions. You will need to provide necessary documents such as architectural drawings, structural designs, and land ownership proof.",
  },
  {
    question: "What are the requirements for renewing a permit?",
    answer:
      "To renew a permit, you typically need to provide the original permit details and show evidence that the conditions of the initial permit have been met. Specific requirements can be found on our 'Renew Permit' e-service page.",
  },
  {
    question: "Where can I find the master plan for a specific area?",
    answer:
      "The master plans and approved layouts for various areas within Kaduna State are available under the 'Planning and Development' section of our website. You can also visit our office for physical copies or further assistance.",
  },
  {
    question: "How do I report a building code violation?",
    answer:
      "You can report a building code violation or any non-compliant development through our 'Contact Us' page by submitting a message, or by visiting our office in person. Please provide as much detail as possible, including the location and nature of the violation.",
  },
  {
    question: "What are KASUPDA's office hours?",
    answer:
      "Our offices are typically open from 8:00 AM to 5:00 PM, Monday to Thursday, excluding public holidays. For specific department timings, please check our contact page or call our main line.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
          Find answers to common questions about KASUPDA and our services.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqItems.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border rounded-lg shadow-sm bg-card">
            <AccordionTrigger className="p-4 text-left font-medium text-primary hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0 text-foreground">
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
