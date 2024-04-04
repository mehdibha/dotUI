import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/core/default/accordion";

interface FAQProps {
  questions: { question: string; answer: string }[];
  className?: string;
}

export const FAQ = (props: FAQProps) => {
  const { questions, className } = props;

  return (
    <section className={className}>
      <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        Frequently asked questions
      </h2>
      <div className="container mt-8 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {questions.map((elem, index) => (
            <AccordionItem key={index} value={index.toString()}>
              <AccordionTrigger className="text-lg font-semibold">
                {elem.question}
              </AccordionTrigger>
              <AccordionContent className="text-md pb-8">{elem.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
