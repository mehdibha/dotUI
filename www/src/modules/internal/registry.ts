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
      "The /create control panel, and the row vocabulary it is built from.",
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
    href: "/internal/composition",
    label: "Composition",
    description:
      "The composition section built for the landing page: one step loop from a field's parts up to a full pattern.",
  },
  {
    href: "/internal/blur-reveal",
    label: "Blur reveal",
    description:
      "The blur-reveal utilities paired with ProgressiveBlur: root-scroll and nearest-scroller drivers.",
  },
]
