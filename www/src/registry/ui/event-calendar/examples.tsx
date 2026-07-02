import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import DefaultDemo from './demos/default'

export default function EventCalendarExamples() {
  return (
    <Examples>
      <Example title="Default">
        <DefaultDemo />
      </Example>
    </Examples>
  )
}
