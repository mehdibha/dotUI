import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import AllowsMultiple from './demos/allows-multiple'
import Basic from './demos/basic'
import DefaultExpanded from './demos/default-expanded'
import Disabled from './demos/disabled'

export default function AccordionExamples() {
  return (
    <Examples className="**:data-accordion:mx-auto **:data-accordion:w-full **:data-accordion:max-w-2xl">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Multiple">
        <AllowsMultiple />
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
