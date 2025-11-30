import {
  Accordion,
  AccordionHeading,
  AccordionItem,
  AccordionPanel,
} from "@dotui/registry/ui/accordion";

export default function Demo() {
  return (
    <Accordion>
      <AccordionItem>
        <AccordionHeading>Accordion Heading</AccordionHeading>
        <AccordionPanel>Accordion Panel</AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeading>Accordion Heading</AccordionHeading>
        <AccordionPanel>Accordion Panel</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
