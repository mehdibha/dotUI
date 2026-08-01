import { RadialBarChart } from '@/registry/ui/chart-radial'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

const data = [
  { browser: 'chrome', visitors: 275 },
  { browser: 'safari', visitors: 200 },
  { browser: 'firefox', visitors: 187 },
  { browser: 'edge', visitors: 173 },
  { browser: 'other', visitors: 90 },
]

const labels = {
  chrome: 'Chrome',
  safari: 'Safari',
  firefox: 'Firefox',
  edge: 'Edge',
  other: 'Other',
}

const total = [{ browser: 'safari', visitors: 1260 }]

export default function ChartRadialExamples() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="Radial Bar Chart">
        <RadialBarChart
          data={data}
          value="visitors"
          name="browser"
          labels={labels}
          innerRadius={0.3}
          radiusRatio={0.95}
          track
          ariaLabel="Visitors by browser"
        />
      </Example>
      <Example title="Progress Ring">
        <RadialBarChart
          data={total}
          value="visitors"
          name="browser"
          labels={{ safari: 'Safari' }}
          max={1600}
          endAngle={(250 * Math.PI) / 180}
          innerRadius={0.78}
          outerRadius={0.95}
          cornerRadius={999}
          radiusRatio={0.9}
          track
          ariaLabel="Safari visitors as a progress ring"
        >
          <div className="flex h-full flex-col items-center justify-center">
            <span className="text-2xl font-bold">1,260</span>
            <span className="text-sm text-fg-muted">Visitors</span>
          </div>
        </RadialBarChart>
      </Example>
    </Examples>
  )
}
