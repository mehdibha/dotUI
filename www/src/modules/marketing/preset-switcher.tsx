import type * as React from "react"

import { Tab, TabList } from "@/registry/ui/tabs"
import {
  presetLabelStack,
  usePresetLabelFonts,
} from "@/modules/marketing/preset-fonts"
import { PRESET_CATALOG } from "@/modules/presets/__generated__/catalog"

// The landing showcase's design-system selector: the tab list over the cards (the
// panel, in `cards.tsx`). Picking a preset re-skins the scoped grid below instantly
// (no tween — repainting the ~1k-node grid every frame for a morph costs more than
// it's worth). It lives outside the scoped provider, so it always wears the site
// theme.
export function PresetSwitcher({ selected }: { selected: number }) {
  const active = PRESET_CATALOG[selected]

  usePresetLabelFonts()

  // The indicator wears the selected preset: its control radius (md = 0.75 ×
  // the base) and a subtle wash of its accent over the neutral selected surface.
  const radius = active?.designSystem.tokens["--radius"] ?? "0.625rem"
  const indicatorStyle = {
    "--indicator-radius": `calc(${radius} * 0.75)`,
    "--indicator-bg": active
      ? `color-mix(in oklab, var(--color-selected), ${active.swatch} 25%)`
      : "var(--color-selected)",
  } as React.CSSProperties

  return (
    // Negative margins cancel the landing container's padding so the row still
    // scrolls edge-to-edge on small screens; lg fits without overflowing.
    <div className="-mx-4 mb-5 no-scrollbar flex scroll-fade-x overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <TabList
        aria-label="Preview design system"
        variant="segmented"
        className="mx-auto h-auto bg-transparent p-0 **:data-tab-indicator:rounded-(--indicator-radius) **:data-tab-indicator:bg-(--indicator-bg) **:data-tab-indicator:motion-safe:transition-[translate,width,height,border-radius,background-color]"
        style={indicatorStyle}
      >
        {PRESET_CATALOG.map((preset) => (
          <Tab
            key={preset.id}
            id={preset.id}
            className="group/tab flex-none px-2.5 py-1 opacity-50 transition-[color,opacity] data-focus-visible:opacity-100 data-hovered:opacity-100 orientation-horizontal:h-auto data-selected:opacity-100"
            style={{ fontFamily: presetLabelStack(preset.id) }}
          >
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full ring-1 ring-current/20 grayscale transition-[filter] ring-inset group-data-focus-visible/tab:grayscale-0 group-data-hovered/tab:grayscale-0 group-data-selected/tab:grayscale-0"
              style={{ background: preset.swatch }}
            />
            {preset.name}
          </Tab>
        ))}
      </TabList>
    </div>
  )
}
