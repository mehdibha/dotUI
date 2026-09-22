/* Dev-tweaker scaffolding for the panel chrome (throwaway — bake and delete). */

import type { CSSProperties } from "react"

import { useTweak } from "@/dev/tweaker"

const HAIRLINES = ["none", "6%", "10%", "15%", "20%"] as const

const hairline = (value: string) =>
  value === "none"
    ? { width: 0, color: "transparent" }
    : {
        width: 1,
        color: `color-mix(in oklab, var(--color-fg) ${value}, transparent)`,
      }

export function usePanelTweaks() {
  const width = useTweak("Width", {
    type: "number",
    min: 240,
    max: 360,
    step: 8,
    default: 272,
    group: "Panel",
  })
  const padding = useTweak("Padding", {
    type: "number",
    min: 4,
    max: 16,
    step: 2,
    default: 8,
    group: "Panel",
  })
  const border = useTweak("Border", {
    type: "select",
    options: HAIRLINES,
    default: "10%",
    group: "Panel",
  })
  const radius = useTweak("Radius", {
    type: "number",
    min: 6,
    max: 24,
    step: 2,
    default: 14,
    group: "Panel",
  })
  const divider = useTweak("Header divider", {
    type: "boolean",
    default: true,
    group: "Panel",
  })
  const rowHeight = useTweak("Row height", {
    type: "select",
    options: ["32", "36", "40"],
    default: "36",
    group: "Rows",
  })
  const rowRadius = useTweak("Row radius", {
    type: "select",
    options: ["6", "8", "10", "12"],
    default: "8",
    group: "Rows",
  })
  const rowGap = useTweak("Row gap", {
    type: "select",
    options: ["4", "6", "8"],
    default: "6",
    group: "Rows",
  })
  const popoverGap = useTweak("Gap from panel", {
    type: "number",
    min: 0,
    max: 16,
    step: 2,
    default: 8,
    group: "Popover",
  })
  const popoverPadding = useTweak("Padding", {
    type: "number",
    min: 4,
    max: 12,
    step: 2,
    default: 8,
    group: "Popover",
  })
  const popoverShadow = useTweak("Shadow", {
    type: "select",
    options: ["none", "sm", "md", "lg", "xl"],
    default: "lg",
    group: "Popover",
  })
  const popoverBorder = useTweak("Border", {
    type: "select",
    options: HAIRLINES,
    default: "10%",
    group: "Popover",
  })

  const panelLine = hairline(border)
  const popoverLine = hairline(popoverBorder)
  const rows = {
    "--dial-row-h": `${rowHeight}px`,
    "--dial-row-r": `${rowRadius}px`,
    "--dial-gap": `${rowGap}px`,
  }
  return {
    divider,
    panelStyle: {
      "--panel-w": `${width}px`,
      "--panel-pad": `${padding}px`,
      "--panel-radius": `${radius}px`,
      "--panel-border-w": `${panelLine.width}px`,
      "--panel-border-color": panelLine.color,
      ...rows,
    } as CSSProperties,
    popoverOffset: popoverGap + panelLine.width + padding,
    popoverStyle: {
      "--panel-radius": `${radius}px`,
      "--panel-border-w": `${popoverLine.width}px`,
      "--panel-border-color": popoverLine.color,
      "--popover-pad": `${popoverPadding}px`,
      "--popover-shadow":
        popoverShadow === "none" ? "none" : `var(--shadow-${popoverShadow})`,
      ...rows,
    } as CSSProperties,
  }
}
