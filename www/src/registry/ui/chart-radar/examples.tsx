import { RadarChart } from '@/registry/ui/chart-radar'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 273, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
]

const labels = { desktop: 'Desktop', mobile: 'Mobile' }

export default function ChartRadarExamples() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="Radar Chart">
        <RadarChart
          data={data}
          x="month"
          y="desktop"
          labels={labels}
          legend={false}
          ariaLabel="Desktop visitors, January through June"
        />
      </Example>
      <Example title="Multiple Series">
        <RadarChart
          data={data}
          x="month"
          y={['desktop', 'mobile']}
          labels={labels}
          ariaLabel="Desktop and mobile visitors, January through June"
        />
      </Example>
    </Examples>
  )
}
