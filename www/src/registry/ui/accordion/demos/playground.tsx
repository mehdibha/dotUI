'use client'

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@/registry/ui/accordion'

const items = [
  {
    id: 'getting-started',
    question: 'How do I get started with DotUI?',
    answer:
      'Getting started is simple! Install the package using your preferred package manager, then import the components you need.',
  },
  {
    id: 'free-to-use',
    question: 'Is DotUI free to use?',
    answer:
      'Yes, DotUI is completely free and open source. You can use it in any project, whether personal or commercial.',
  },
  {
    id: 'customization',
    question: 'Can I customize the components?',
    answer:
      'Absolutely! All components use Tailwind Variants for styling, making it easy to customize colors, sizes, and other visual properties.',
  },
]

export default function Demo({
  allowsMultipleExpanded = false,
  isDisabled = false,
} = {}) {
  return (
    <Accordion
      allowsMultipleExpanded={allowsMultipleExpanded}
      isDisabled={isDisabled}
      className="max-w-2xl"
    >
      {items.map((item) => (
        <AccordionItem id={item.id} key={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionPanel>{item.answer}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
