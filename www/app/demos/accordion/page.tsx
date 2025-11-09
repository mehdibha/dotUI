import {
  Accordion,
  AccordionHeading,
  AccordionItem,
  AccordionPanel,
} from "@dotui/registry/ui/accordion";

export default function Page() {
  return (
    <Accordion className="w-80">
      <AccordionItem defaultExpanded>
        <AccordionHeading>What is React?</AccordionHeading>
        <AccordionPanel>
          React is a JavaScript library for building user interfaces.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeading>What is Next.js?</AccordionHeading>
        <AccordionPanel>
          Next.js is a React framework for production applications.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
