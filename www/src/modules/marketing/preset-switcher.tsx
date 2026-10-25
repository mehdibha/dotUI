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
  // the base), a subtle wash of its accent over the neutral selected surface,
  // and its accent as the focus ring. The ring rides the indicator (the tab's
  // own is dropped) so it glides with the selection, and keys off the whole
  // list so it holds while the selection catches up with focus. Its lightness
  // is capped per mode so pale (Wise, Higgsfield) and near-black (Polaris)
  // accents keep 3:1 against the page.
  const swatch = active?.swatch ?? "var(--color-border-focus)"
  const radius = active?.designSystem.tokens["--radius"] ?? "0.625rem"
  const indicatorStyle = {
    "--indicator-radius": `calc(${radius} * 0.75)`,
    "--indicator-bg": active
      ? `color-mix(in oklab, var(--color-selected), ${active.swatch} 25%)`
      : "var(--color-selected)",
    "--indicator-ring": `oklch(from ${swatch} min(l, 0.6) c h)`,
    "--indicator-ring-dark": `oklch(from ${swatch} max(l, 0.6) c h)`,
  } as React.CSSProperties

  return (
    // Negative margins cancel the landing container's padding so the row still
    // scrolls edge-to-edge on small screens; lg fits without overflowing. The
    // spacing-1 padding keeps the focus ring clear of the scroll clip.
    <div className="-mx-4 -mt-1 mb-4 no-scrollbar flex scroll-fade-x overflow-x-auto px-4 py-1 sm:-mx-6 sm:px-6 lg:-mx-1 lg:px-1">
      <TabList
        aria-label="Preview design system"
        variant="segmented"
        className="mx-auto h-auto gap-2 bg-transparent p-0 **:data-tab-indicator:rounded-(--indicator-radius) **:data-tab-indicator:bg-(--indicator-bg) **:data-tab-indicator:outline-(--indicator-ring) has-data-focus-visible:**:data-tab-indicator:outline-2 has-data-focus-visible:**:data-tab-indicator:outline-offset-2 **:data-tab-indicator:motion-safe:transition-[translate,width,height,border-radius,background-color,outline-color] dark:**:data-tab-indicator:outline-(--indicator-ring-dark)"
        style={indicatorStyle}
      >
        {PRESET_CATALOG.map((preset) => (
          <Tab
            key={preset.id}
            id={preset.id}
            className="group/tab flex-none px-2.5 py-1 opacity-50 transition-[color,opacity] outline-none! data-focus-visible:opacity-100 data-hovered:opacity-100 orientation-horizontal:h-auto data-selected:opacity-100"
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
