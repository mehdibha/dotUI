import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@/registry/ui/accordion'

export function AccordionDemo() {
  return (
    <Accordion className="w-72" defaultExpandedKeys={['react']}>
      <AccordionItem id="react">
        <AccordionTrigger>What is React?</AccordionTrigger>
        <AccordionPanel>
          React is a JavaScript library for building user interfaces.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem id="nextjs">
        <AccordionTrigger>What is Next.js?</AccordionTrigger>
        <AccordionPanel>
          Next.js is a React framework for production applications.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
