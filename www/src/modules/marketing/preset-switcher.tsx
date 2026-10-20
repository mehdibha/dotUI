import type * as React from "react"
import type { Selection } from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  presetLabelStack,
  usePresetLabelFonts,
} from "@/modules/marketing/preset-fonts"
import { PRESET_CATALOG } from "@/modules/presets/__generated__/catalog"
import { useTweak } from "@/dev/tweaker"

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
  const active = PRESET_CATALOG[selected]
  const activeId = active?.id

  usePresetLabelFonts()

  const inactiveOpacity = useTweak("Inactive tab opacity", {
    type: "number",
    min: 0.2,
    max: 1,
    step: 0.05,
    default: 1,
    group: "Preset tabs",
  })
  const inactiveSwatch = useTweak("Inactive swatch", {
    type: "select",
    options: ["color", "grey", "faded"],
    default: "color",
    group: "Preset tabs",
  })

  const handleChange = (keys: Selection) => {
    if (keys === "all") return
    const id = [...keys][0]
    const index = PRESET_CATALOG.findIndex((preset) => preset.id === id)
    if (index >= 0) onSelect(index)
  }

  // The indicator wears the selected preset: its control radius (md = 0.75 ×
  // the base) and a subtle wash of its accent over the neutral selected surface.
  const radius = active?.designSystem.tokens["--radius"] ?? "0.625rem"
  const indicatorStyle = {
    "--indicator-radius": `calc(${radius} * 0.75)`,
    "--indicator-bg": active
      ? `color-mix(in oklab, var(--color-selected), ${active.swatch} 25%)`
      : "var(--color-selected)",
    "--inactive-opacity": inactiveOpacity,
  } as React.CSSProperties

  return (
    // Negative margins cancel the landing container's padding so the row still
    // scrolls edge-to-edge on small screens; lg fits without overflowing.
    <div className="-mx-4 mb-5 no-scrollbar flex scroll-fade-x overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <SegmentedControl
        aria-label="Preview design system"
        className="mx-auto bg-transparent p-0 **:data-segmented-control-indicator:rounded-(--indicator-radius) **:data-segmented-control-indicator:bg-(--indicator-bg) **:data-segmented-control-indicator:motion-safe:transition-[translate,width,height,border-radius,background-color]"
        style={indicatorStyle}
        selectedKeys={activeId ? [activeId] : []}
        onSelectionChange={handleChange}
      >
        {PRESET_CATALOG.map((preset) => (
          <SegmentedControlItem
            key={preset.id}
            id={preset.id}
            className="group/tab opacity-(--inactive-opacity) transition-[color,opacity] data-focus-visible:opacity-100 data-hovered:opacity-100 data-selected:opacity-100"
            style={{ fontFamily: presetLabelStack(preset.id) }}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-2.5 shrink-0 rounded-full ring-1 ring-current/20 ring-inset motion-safe:transition-[filter,opacity]",
                inactiveSwatch === "grey" && "grayscale",
                inactiveSwatch === "faded" && "opacity-40",
                "group-data-focus-visible/tab:opacity-100 group-data-focus-visible/tab:grayscale-0 group-data-hovered/tab:opacity-100 group-data-hovered/tab:grayscale-0 group-data-selected/tab:opacity-100 group-data-selected/tab:grayscale-0",
              )}
              style={{ background: preset.swatch }}
            />
            {preset.name}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  )
}
