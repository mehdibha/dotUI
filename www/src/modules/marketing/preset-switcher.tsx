import type { Selection } from 'react-aria-components'

import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import { PRESETS } from '@/modules/presets/presets-data'

// The landing showcase's design-system selector: a segmented control over the cards.
// Picking a preset re-skins the scoped grid below; only the paint axes (palette,
// radius) tween, everything else snaps instantly (see cards.tsx + styles.css). The
// pill slides smoothly between segments (React Aria's SelectionIndicator). It
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
    <div className="mb-6 no-scrollbar flex max-w-full scroll-fade-x overflow-x-auto px-4 sm:mb-8">
      <SegmentedControl
        aria-label="Preview design system"
        className="mx-auto bg-transparent p-0"
        selectedKeys={activeId ? [activeId] : []}
        onSelectionChange={handleChange}
      >
        {PRESETS.map((preset) => (
          <SegmentedControlItem key={preset.id} id={preset.id}>
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full ring-1 ring-current/20 ring-inset"
              style={{ background: preset.swatch }}
            />
            {preset.name}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  )
}
