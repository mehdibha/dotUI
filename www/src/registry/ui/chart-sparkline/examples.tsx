import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import AreaDemo from './demos/area'
import DefaultDemo from './demos/default'
import NegativeHighlightDemo from './demos/negative-highlight'
import StatCardDemo from './demos/stat-card'
import WithTrendDemo from './demos/with-trend'

export default function ChartSparklineExamples() {
  return (
    <Examples className="lg:grid-cols-2">
      <Example title="Default">
        <DefaultDemo />
      </Example>
      <Example title="Area">
        <AreaDemo />
      </Example>
      <Example title="With Trend">
        <WithTrendDemo />
      </Example>
      <Example title="Negative Highlight">
        <NegativeHighlightDemo />
      </Example>
      <Example title="Stat Card">
        <StatCardDemo />
      </Example>
    </Examples>
  )
}
