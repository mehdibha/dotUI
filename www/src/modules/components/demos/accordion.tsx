'use client'

import { Accordion } from '@/registry/ui/accordion'
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from '@/registry/ui/disclosure'

import { useStepAutoplay } from '../autoplay'

export function AccordionDemo() {
  const { index } = useStepAutoplay(2, { dwell: 1600 })
  const expandedKeys = index === 0 ? ['react'] : ['nextjs']
  return (
    <Accordion
      className="w-72"
      expandedKeys={expandedKeys}
      onExpandedChange={() => {}}
    >
      <Disclosure id="react">
        <DisclosureTrigger>What is React?</DisclosureTrigger>
        <DisclosurePanel>
          React is a JavaScript library for building user interfaces.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure id="nextjs">
        <DisclosureTrigger>What is Next.js?</DisclosureTrigger>
        <DisclosurePanel>
          Next.js is a React framework for production applications.
        </DisclosurePanel>
      </Disclosure>
    </Accordion>
  )
}
