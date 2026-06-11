import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Description from './demos/description'
import Disabled from './demos/disabled'
import ErrorMessage from './demos/error-message'
import Granularity from './demos/granularity'
import HideTimeZone from './demos/hide-time-zone'
import HourCycle from './demos/hour-cycle'
import Label from './demos/label'
import Placeholder from './demos/placeholder'
import ReadOnly from './demos/read-only'
import Required from './demos/required'
import TimeZones from './demos/time-zones'
import WithDrawer from './demos/with-drawer'
import WithModal from './demos/with-modal'

export default function DatePickerExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="label">
        <Label />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="read only">
        <ReadOnly />
      </Example>
      <Example title="required">
        <Required />
      </Example>
      <Example title="description">
        <Description />
      </Example>
      <Example title="error message">
        <ErrorMessage />
      </Example>
      <Example title="granularity">
        <Granularity />
      </Example>
      <Example title="hide time zone">
        <HideTimeZone />
      </Example>
      <Example title="hour cycle">
        <HourCycle />
      </Example>
      <Example title="placeholder">
        <Placeholder />
      </Example>
      <Example title="time zones">
        <TimeZones />
      </Example>
      <Example title="with modal">
        <WithModal />
      </Example>
      <Example title="with drawer">
        <WithDrawer />
      </Example>
    </Examples>
  )
}
