import { ScrollFade } from '@/registry/ui/scroll-fade'

const updates = [
  'Invite reviewers once the spec is stable.',
  'Confirm keyboard access for every overflow region.',
  'Measure content changes after async data lands.',
  'Keep the browser scrollbar visible for platform familiarity.',
  'Prefer masks over static overlays when the surface color can vary.',
  'Use edge-aware CSS variables so the fade disappears at the limits.',
  'Resize observers keep the affordance in sync with dynamic content.',
  'Mutation observers catch late-rendered rows and changing copy.',
  'RTL horizontal scrolling needs normalized start and end distances.',
  'Programmatic scroll should update the fade without implying user input.',
  'Native scroll momentum should keep the scrolling state briefly alive.',
  'The mask should be zero-cost when the content does not overflow.',
]

export default function Demo() {
  return (
    <ScrollFade className="h-56 w-full max-w-md rounded-lg border bg-bg p-4">
      <div className="space-y-3">
        {updates.map((update) => (
          <div key={update} className="rounded-md bg-muted px-3 py-2 text-sm">
            {update}
          </div>
        ))}
      </div>
    </ScrollFade>
  )
}
