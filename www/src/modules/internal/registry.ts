/* The internal tools index — what /internal lists. Dev-only scratch surfaces
   (labs, playgrounds, demos); nothing here ships or is linked from the site. */

export interface InternalTool {
  href: string
  label: string
  description: string
}

export const INTERNAL_TOOLS: InternalTool[] = [
  {
    href: "/internal/panel-lab",
    label: "Panel Lab",
    description:
      "The /create control panel: the row vocabulary it is built from, and every version of the panel itself.",
  },
  {
    href: "/internal/color-lab",
    label: "Color Lab",
    description:
      "The color engine measured against reference systems: ramps, contrast meters, CVD checks.",
  },
  {
    href: "/internal/preset-lab",
    label: "Preset Lab",
    description:
      "Preset fidelity — how close each preset lands to the system it recreates.",
  },
  {
    href: "/internal/blur-reveal",
    label: "Blur reveal",
    description:
      "The blur-reveal utilities paired with ProgressiveBlur: root-scroll and nearest-scroller drivers.",
  },
]
