import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import BasicDemo from './demos/basic'
import CardDemo from './demos/card'
import DescriptionDemo from './demos/description'
import DisabledDemo from './demos/disabled'
import IndeterminateDemo from './demos/indeterminate'
import InvalidDemo from './demos/invalid'
import ReadOnlyDemo from './demos/read-only'
import StandaloneDemo from './demos/standalone'

export default function CheckboxExamples() {
  return (
    <Examples className="**:data-example-preview:justify-center lg:grid-cols-2">
      <Example title="Standalone">
        <StandaloneDemo />
      </Example>
      <Example title="Basic">
        <BasicDemo />
      </Example>
      <Example title="With description">
        <DescriptionDemo />
      </Example>
      <Example title="Invalid">
        <InvalidDemo />
      </Example>
      <Example title="Disabled">
        <DisabledDemo />
      </Example>
      <Example title="indeterminate">
        <IndeterminateDemo />
      </Example>
      <Example title="read only">
        <ReadOnlyDemo />
      </Example>
      <Example title="Card">
        <CardDemo />
      </Example>
    </Examples>
  )
}
