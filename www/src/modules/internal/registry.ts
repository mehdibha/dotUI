/* The internal tools index — what /internal lists. Scratch surfaces (labs,
   playgrounds, demos) for dev and Vercel previews; nothing here ships to
   dotui.org or is linked from the site. */

interface InternalTool {
  href: string
  label: string
  description: string
}

export const INTERNAL_TOOLS: InternalTool[] = [
  {
    href: "/internal/color-lab",
    label: "Color Lab",
    description:
      "The color engine measured against reference systems: ramps, contrast meters, CVD checks.",
  },
  {
    href: "/internal/specimens",
    label: "Specimens",
    description:
      "Every preset on fixed component sheets, captured to compare against the system it recreates.",
  },
  {
    href: "/internal/compare",
    label: "Compare",
    description:
      "A preset's live parts beside the real product's crops and frozen copies, with overlays and the probe diff.",
  },
  {
    href: "/internal/blur-reveal",
    label: "Blur reveal",
    description:
      "The blur-reveal utilities paired with ProgressiveBlur: root-scroll and nearest-scroller drivers.",
  },
  {
    href: "/internal/composition-animation",
    label: "Composition animation",
    description:
      "The composition section retired from the landing page: code beats synced with view-transitioned component previews.",
  },
]
