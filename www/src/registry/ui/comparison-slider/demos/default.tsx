import { ComparisonSlider } from '@/registry/ui/comparison-slider'

export default function Demo() {
  return (
    <ComparisonSlider
      aria-label="Compare before and after"
      className="aspect-video max-w-sm"
      reveal={
        <div className="grid place-items-center bg-neutral text-fg-muted">
          Before
        </div>
      }
    >
      <div className="grid aspect-video place-items-center bg-primary text-fg-on-primary">
        After
      </div>
    </ComparisonSlider>
  )
}
