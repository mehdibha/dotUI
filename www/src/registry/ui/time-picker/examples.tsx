import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Composition from './demos/composition'
import Controlled from './demos/controlled'
import Description from './demos/description'
import Disabled from './demos/disabled'
import ErrorMessage from './demos/error-message'
import Granularity from './demos/granularity'
import HourCycle from './demos/hour-cycle'
import Label from './demos/label'
import Placeholder from './demos/placeholder'
import ReadOnly from './demos/read-only'
import Required from './demos/required'
import Uncontrolled from './demos/uncontrolled'

export default function TimePickerExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="composition">
        <Composition />
      </Example>
      <Example title="description">
        <Description />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="error message">
        <ErrorMessage />
      </Example>
      <Example title="granularity">
        <Granularity />
      </Example>
      <Example title="hour cycle">
        <HourCycle />
      </Example>
      <Example title="label">
        <Label />
      </Example>
      <Example title="placeholder">
        <Placeholder />
      </Example>
      <Example title="read only">
        <ReadOnly />
      </Example>
      <Example title="required">
        <Required />
      </Example>
      <Example title="uncontrolled">
        <Uncontrolled />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
    </Examples>
  )
}
