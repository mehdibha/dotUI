import AccordionDemo from "@/registry/ui/accordion/demos/basic"
import CollapsibleDemo from "@/registry/ui/collapsible/demos/basic"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function DisclosureGroupExamples() {
  return (
    <Examples>
      <Example title="Accordion">
        <AccordionDemo />
      </Example>
      <Example title="Collapsible">
        <CollapsibleDemo />
      </Example>
    </Examples>
  )
}
