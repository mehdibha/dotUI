import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import AdvancedComposition from './demos/advanced-composition'
import Basic from './demos/basic'
import Controlled from './demos/controlled'
import DefaultExpanded from './demos/default-expanded'
import Disabled from './demos/disabled'

export default function DisclosureExamples() {
  return (
    <Examples>
      <Example title="advanced composition">
        <AdvancedComposition />
      </Example>
      <Example title="basic">
        <Basic />
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
