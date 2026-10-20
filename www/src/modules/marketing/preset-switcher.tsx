import type * as React from "react"
import { useEffect, useRef, useState } from "react"
import type { Selection } from "react-aria-components"

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
  const fade = useTweak("Fade", {
    type: "select",
    options: ["none", "edges", "from selected"],
    default: "none",
    group: "Preset tabs",
  })
  const fadeLength = useTweak("Fade length", {
    type: "number",
    min: 40,
    max: 600,
    step: 20,
    default: 240,
    group: "Preset tabs",
  })
  const fadeFloor = useTweak("Fade floor", {
    type: "number",
    min: 0,
    max: 1,
    step: 0.05,
    default: 0.2,
    group: "Preset tabs",
  })

  // The selected tab's span within the list, for the "from selected" fade.
  const rowRef = useRef<HTMLDivElement>(null)
  const [selectedSpan, setSelectedSpan] = useState<[number, number]>([0, 0])
  useEffect(() => {
    const list = rowRef.current?.querySelector("[data-segmented-control]")
    if (!list) return
    const measure = () => {
      const tab = list.querySelector(
        "[data-segmented-control-item][data-selected]",
      )
      if (!tab) return
      const listLeft = list.getBoundingClientRect().left
      const rect = tab.getBoundingClientRect()
      setSelectedSpan([rect.left - listLeft, rect.right - listLeft])
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [activeId])

  const floor = `rgb(0 0 0 / ${fadeFloor})`
  const [start, end] = selectedSpan
  const fadeMask =
    fade === "edges"
      ? `linear-gradient(to right, ${floor} 0, #000 ${fadeLength}px, #000 calc(100% - ${fadeLength}px), ${floor} 100%)`
      : fade === "from selected"
        ? `linear-gradient(to right, ${floor} ${start - fadeLength}px, #000 ${start}px, #000 ${end}px, ${floor} ${end + fadeLength}px)`
        : "none"

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
  } as React.CSSProperties

  return (
    // Negative margins cancel the landing container's padding so the row still
    // scrolls edge-to-edge on small screens; lg fits without overflowing.
    <div
      ref={rowRef}
      className="-mx-4 mb-5 no-scrollbar flex scroll-fade-x overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
      style={
        {
          "--inactive-opacity": inactiveOpacity,
          "--fade-mask": fadeMask,
        } as React.CSSProperties
      }
    >
      <SegmentedControl
        aria-label="Preview design system"
        // Plain :hover — the `hover:` variant waits on react-aria's data-hovered,
        // which the group never sets.
        className="mx-auto bg-transparent [mask-image:var(--fade-mask)] p-0 has-data-focus-visible:[--fade-mask:none] has-data-focus-visible:[--inactive-opacity:1] **:data-segmented-control-indicator:rounded-(--indicator-radius) **:data-segmented-control-indicator:bg-(--indicator-bg) **:data-segmented-control-indicator:motion-safe:transition-[translate,width,height,border-radius,background-color] [&:hover]:[--fade-mask:none] [&:hover]:[--inactive-opacity:1]"
        style={indicatorStyle}
        selectedKeys={activeId ? [activeId] : []}
        onSelectionChange={handleChange}
      >
        {PRESET_CATALOG.map((preset) => (
          <SegmentedControlItem
            key={preset.id}
            id={preset.id}
            className="opacity-(--inactive-opacity) transition-[color,opacity] data-selected:opacity-100"
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
