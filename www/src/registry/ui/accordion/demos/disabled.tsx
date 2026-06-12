import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@/registry/ui/accordion'

export default function Demo() {
  return (
    <Accordion isDisabled>
      <AccordionItem id="getting-started">
        <AccordionTrigger>How do I get started with DotUI?</AccordionTrigger>
        <AccordionPanel>
          Getting started is simple! Install the package using your preferred
          package manager, then import the components you need. All components
          are built on React Aria Components and follow accessibility best
          practices out of the box.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem id="free-to-use">
        <AccordionTrigger>Is DotUI free to use?</AccordionTrigger>
        <AccordionPanel>
          Yes, DotUI is completely free and open source. You can use it in any
          project, whether personal or commercial, without any restrictions or
          licensing fees.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem id="customization">
        <AccordionTrigger>Can I customize the components?</AccordionTrigger>
        <AccordionPanel>
          Absolutely! All components use Tailwind Variants for styling, making
          it easy to customize colors, sizes, and other visual properties. You
          can pass custom className props or extend the default variants to
          match your design system.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
