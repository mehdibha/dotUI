import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from '@/registry/ui/disclosure'

const faqs = [
  {
    question: 'How do I reset my password?',
    answer:
      'Go to Settings, then Security, and select "Reset password". We will email you a secure link that stays valid for 30 minutes.',
  },
  {
    question: 'Can I change my plan later?',
    answer:
      'Yes. You can upgrade or downgrade at any time from the Billing page. Changes are prorated and take effect immediately.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a full refund within 14 days of purchase, no questions asked. Reach out to support and we will process it right away.',
  },
]

export default function Demo() {
  return (
    <div className="w-full max-w-sm">
      <h3 className="mb-2 text-sm font-medium text-fg-muted">
        Frequently asked questions
      </h3>
      <div className="divide-y divide-border">
        {faqs.map((faq) => (
          <Disclosure key={faq.question}>
            <DisclosureTrigger>{faq.question}</DisclosureTrigger>
            <DisclosurePanel>{faq.answer}</DisclosurePanel>
          </Disclosure>
        ))}
      </div>
    </div>
  )
}
