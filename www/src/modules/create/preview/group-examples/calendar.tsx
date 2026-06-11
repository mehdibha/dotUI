import CalendarDemo from '@/registry/ui/calendar/demos/single'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function CalendarGroupExamples() {
  return (
    <Examples>
      <Example title="Calendar">
        <CalendarDemo />
      </Example>
    </Examples>
  )
}
