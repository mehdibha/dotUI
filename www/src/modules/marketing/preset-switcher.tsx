import type { Selection } from 'react-aria-components'

import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import { PRESETS } from '@/modules/presets/presets-data'

// The landing showcase's design-system selector: a segmented control over the cards.
// Picking a preset re-skins the scoped grid below instantly (no tween — repainting
// the ~1k-node grid every frame for a morph costs more than it's worth). It lives
// outside the scoped provider, so it always wears the site theme — except the
// sliding pill, restyled as a browser tab in the preset's own background
// (`--window-bg`, set by <Cards>) so it reads as part of the pane it themes.
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

  // `pb-px -mb-px`: the window's top border lands in this container's last pixel
  // row, where the pill (h: 100%+2px, over the item's 1px borders) paints over it.
  return (
    <div className="relative z-30 -mb-px no-scrollbar flex max-w-full scroll-fade-x overflow-x-auto px-4 pb-px">
      <SegmentedControl
        aria-label="Preview design system"
        // The pill as a browser tab: window bg, open bottom (h: 100%+2px covers the
        // pane's border row), and before/after fillets — 12px squares whose radial
        // gradient draws the concave curve (page bg inside the arc, 1px border
        // stroke, window bg outside) flowing the tab's side borders into the pane.
        className="mx-auto bg-transparent p-0 **:data-segmented-control-indicator:h-[calc(100%+2px)]! **:data-segmented-control-indicator:rounded-t-xl **:data-segmented-control-indicator:rounded-b-none **:data-segmented-control-indicator:border **:data-segmented-control-indicator:border-b-0 **:data-segmented-control-indicator:border-border **:data-segmented-control-indicator:bg-(--window-bg) **:data-segmented-control-indicator:shadow-none **:data-segmented-control-indicator:before:absolute **:data-segmented-control-indicator:before:bottom-0 **:data-segmented-control-indicator:before:-left-3 **:data-segmented-control-indicator:before:size-3 **:data-segmented-control-indicator:before:bg-[radial-gradient(circle_at_0_0,var(--color-bg)_11px,var(--color-border)_11px_12px,var(--window-bg)_12px)] **:data-segmented-control-indicator:after:absolute **:data-segmented-control-indicator:after:-right-3 **:data-segmented-control-indicator:after:bottom-0 **:data-segmented-control-indicator:after:size-3 **:data-segmented-control-indicator:after:bg-[radial-gradient(circle_at_100%_0,var(--color-bg)_11px,var(--color-border)_11px_12px,var(--window-bg)_12px)]"
        selectedKeys={activeId ? [activeId] : []}
        onSelectionChange={handleChange}
      >
        {PRESETS.map((preset) => (
          <SegmentedControlItem
            key={preset.id}
            id={preset.id}
            className="px-5 pt-2 pb-1.5 selected:text-fg"
          >
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full ring-1 ring-current/20 ring-inset"
              style={{ background: preset.swatch }}
            />
            {preset.name}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  )
}
