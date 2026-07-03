import { useState } from 'react'
import type { Selection } from 'react-aria-components'

import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import { PRESETS } from '@/modules/presets/presets-data'

// The landing showcase's design-system selector: a segmented control over the cards.
// Picking a preset re-skins the scoped grid below instantly (no tween — repainting
// the ~1k-node grid every frame for a morph costs more than it's worth). The pill
// slides between segments (React Aria's SelectionIndicator). It lives outside the
// scoped provider, so it always wears the site theme.
export function PresetSwitcher({
  selected,
  onSelect,
}: {
  selected: number
  onSelect: (index: number) => void
}) {
  // The grid re-theme runs in a transition (see cards.tsx), so `selected` commits
  // late. Track the pick locally too, so the pill moves on the next frame instead
  // of waiting out the grid render.
  const [picked, setPicked] = useState<number | null>(null)
  const activeId = PRESETS[picked ?? selected]?.id

  const handleChange = (keys: Selection) => {
    if (keys === 'all') return
    const id = [...keys][0]
    const index = PRESETS.findIndex((preset) => preset.id === id)
    if (index >= 0) {
      setPicked(index)
      onSelect(index)
    }
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
