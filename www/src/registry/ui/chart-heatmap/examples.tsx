import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import CalendarMonthsDemo from './demos/calendar-months'
import DiscreteScaleDemo from './demos/discrete-scale'
import MatrixDemo from './demos/matrix'
import WithValuesDemo from './demos/with-values'

export default function ChartHeatmapExamples() {
  return (
    <Examples>
      <Example title="Matrix">
        <MatrixDemo />
      </Example>
      <Example title="Calendar Months">
        <CalendarMonthsDemo />
      </Example>
      <Example title="Discrete Scale">
        <DiscreteScaleDemo />
      </Example>
      <Example title="With Values">
        <WithValuesDemo />
      </Example>
    </Examples>
  )
}
