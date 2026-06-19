import { Accordion, Disclosure, DisclosurePanel, DisclosureTrigger } from 'www'

const wrap: React.CSSProperties = { width: '100%', maxWidth: 520 }

const faqs = [
  {
    id: 'getting-started',
    question: 'How do I get started with dotUI?',
    answer:
      'Install the package using your preferred package manager, then import the components you need. Everything is built on React Aria Components and accessible out of the box.',
  },
  {
    id: 'free-to-use',
    question: 'Is dotUI free to use?',
    answer:
      'Yes, dotUI is completely free and open source. Use it in any project, personal or commercial, with no restrictions or licensing fees.',
  },
  {
    id: 'customization',
    question: 'Can I customize the components?',
    answer:
      'Absolutely. All components use tailwind-variants, so you can tweak colors, sizes, and other visual properties or extend the default variants.',
  },
]

export const Basic = () => (
  <div style={wrap}>
    <Accordion>
      {faqs.map((item) => (
        <Disclosure key={item.id} id={item.id}>
          <DisclosureTrigger>{item.question}</DisclosureTrigger>
          <DisclosurePanel>{item.answer}</DisclosurePanel>
        </Disclosure>
      ))}
    </Accordion>
  </div>
)

export const DefaultExpanded = () => (
  <div style={wrap}>
    <Accordion defaultExpandedKeys={['getting-started']}>
      {faqs.map((item) => (
        <Disclosure key={item.id} id={item.id}>
          <DisclosureTrigger>{item.question}</DisclosureTrigger>
          <DisclosurePanel>{item.answer}</DisclosurePanel>
        </Disclosure>
      ))}
    </Accordion>
  </div>
)

export const Multiple = () => (
  <div style={wrap}>
    <Accordion allowsMultipleExpanded defaultExpandedKeys={['getting-started', 'free-to-use']}>
      {faqs.map((item) => (
        <Disclosure key={item.id} id={item.id}>
          <DisclosureTrigger>{item.question}</DisclosureTrigger>
          <DisclosurePanel>{item.answer}</DisclosurePanel>
        </Disclosure>
      ))}
    </Accordion>
  </div>
)
