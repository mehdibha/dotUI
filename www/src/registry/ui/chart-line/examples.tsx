import { LineChart } from '@/registry/ui/chart-line'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
]

export default function ChartLineExamples() {
  return (
    <Examples>
      <Example title="Line Chart">
        <div className="w-full">
          <LineChart
            data={data}
            x="month"
            y="desktop"
            points
            labels={{ desktop: 'Desktop' }}
            legend={false}
            ariaLabel="Desktop visitors, January through June"
          />
        </div>
      </Example>
      <Example title="Multiple Series">
        <div className="w-full">
          <LineChart
            data={data}
            x="month"
            y={['desktop', 'mobile']}
            curve="monotone"
            labels={{ desktop: 'Desktop', mobile: 'Mobile' }}
            ariaLabel="Desktop and mobile visitors, January through June"
          />
        </div>
      </Example>
    </Examples>
  )
}
