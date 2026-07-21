import type * as React from 'react'
import type { Selection } from 'react-aria-components'

import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import {
  presetLabelStack,
  usePresetLabelFonts,
} from '@/modules/marketing/preset-fonts'
import { PRESETS } from '@/modules/presets/presets-data'

// The landing showcase's design-system selector: a segmented control over the cards.
// Picking a preset re-skins the scoped grid below instantly (no tween — repainting
// the ~1k-node grid every frame for a morph costs more than it's worth). It lives
// outside the scoped provider, so it always wears the site theme.
export function PresetSwitcher({
  selected,
  onSelect,
}: {
  selected: number
  onSelect: (index: number) => void
}) {
  const active = PRESETS[selected]
  const activeId = active?.id

  usePresetLabelFonts()

  const handleChange = (keys: Selection) => {
    if (keys === 'all') return
    const id = [...keys][0]
    const index = PRESETS.findIndex((preset) => preset.id === id)
    if (index >= 0) onSelect(index)
  }

  // The indicator wears the selected preset: its radius factor and a subtle
  // wash of its accent over the neutral selected surface.
  const radiusFactor = active?.designSystem.tokens['--radius-factor'] ?? '1'
  const indicatorStyle = {
    '--indicator-radius': `calc(0.375rem * ${radiusFactor})`,
    '--indicator-bg': active
      ? `color-mix(in oklab, var(--color-selected), ${active.swatch} 25%)`
      : 'var(--color-selected)',
  } as React.CSSProperties

  return (
    <div className="mb-5 no-scrollbar flex max-w-full scroll-fade-x overflow-x-auto px-4">
      <SegmentedControl
        aria-label="Preview design system"
        className="mx-auto bg-transparent p-0 [&_[data-segmented-control-indicator]]:rounded-(--indicator-radius) [&_[data-segmented-control-indicator]]:bg-(--indicator-bg) [&_[data-segmented-control-indicator]]:motion-safe:transition-[translate,width,height,border-radius,background-color]"
        style={indicatorStyle}
        selectedKeys={activeId ? [activeId] : []}
        onSelectionChange={handleChange}
      >
        {PRESETS.map((preset) => (
          <SegmentedControlItem
            key={preset.id}
            id={preset.id}
            style={{ fontFamily: presetLabelStack(preset.id) }}
          >
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
