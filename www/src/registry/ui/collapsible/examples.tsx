import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Basic from "./demos/basic"
import Controlled from "./demos/controlled"
import CustomTrigger from "./demos/custom-trigger"
import DefaultExpanded from "./demos/default-expanded"
import Disabled from "./demos/disabled"

export default function CollapsibleExamples() {
  return (
    <Examples>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="custom trigger">
        <CustomTrigger />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="default expanded">
        <DefaultExpanded />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
    </Examples>
  )
}
