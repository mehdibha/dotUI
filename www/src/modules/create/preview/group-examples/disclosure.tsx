import AccordionDemo from '@/registry/ui/accordion/demos/basic'
import DisclosureDemo from '@/registry/ui/disclosure/demos/basic'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function DisclosureGroupExamples() {
  return (
    <Examples>
      <Example title="Accordion">
        <AccordionDemo />
      </Example>
      <Example title="Disclosure">
        <DisclosureDemo />
      </Example>
    </Examples>
  )
}
