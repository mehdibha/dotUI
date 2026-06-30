import type { Selection } from 'react-aria-components'

import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import { PRESETS } from '@/modules/presets/presets-data'

// Illustrative accent per preset for the chip dot — curated (not derived) so each
// reads clearly on both the muted track and the selected pill (e.g. Vercel's
// near-black accent would vanish; it shows here as a monochrome light dot).
const SWATCH: Record<string, string> = {
  default: '#a1a1aa',
  vercel: '#cbd5e1',
  supabase: '#3ecf8e',
  material: '#a78bfa',
  linear: '#818cf8',
  claude: '#e0916f',
  rose: '#fb7185',
  contrast: '#34d399',
}

// The landing showcase's design-system selector: a segmented control over the cards.
// Picking a preset re-skins the scoped grid below and tweens the whole change —
// palette, radius, and the spacing growing/tightening (see cards.tsx + styles.css).
// The pill slides smoothly between segments (React Aria's SelectionIndicator). It
// lives outside the scoped provider, so it always wears the site theme.
export function PresetSwitcher({
  selected,
  onSelect,
}: {
  selected: number
  onSelect: (index: number) => void
}) {
  const activeId = PRESETS[selected]?.id

  const handleChange = (keys: Selection) => {
    if (keys === 'all') return
    const id = [...keys][0]
    const index = PRESETS.findIndex((preset) => preset.id === id)
    if (index >= 0) onSelect(index)
  }

  return (
    <div className="mb-6 flex max-w-full justify-center overflow-x-auto px-4 sm:mb-8">
      <SegmentedControl
        aria-label="Preview design system"
        selectedKeys={activeId ? [activeId] : []}
        onSelectionChange={handleChange}
      >
        {PRESETS.map((preset) => (
          <SegmentedControlItem key={preset.id} id={preset.id}>
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full ring-1 ring-current/20 ring-inset"
              style={{ background: SWATCH[preset.id] ?? 'currentColor' }}
            />
            {preset.name}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  )
}
