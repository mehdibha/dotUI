/* Contrast as rendered: each `data-contrast` element's text against the
   first opaque background behind it, so the numbers are what ships. */

import { useEffect, useState } from "react"

import { toOklch, wcag2 } from "@dotui/colors"

import { Badge } from "@/registry/ui/badge"

interface Check {
  name: string
  ratio: number
  min: number
}

// rgba(…, a), or a slash alpha: oklch(… / a), color(srgb … / a).
const alphaOf = (color: string) => {
  const slash = /\/\s*([\d.]+)(%?)\s*\)$/.exec(color)
  if (slash) return Number(slash[1]) / (slash[2] ? 100 : 1)
  const rgba = /^rgba\([^)]*,\s*([\d.]+)\)$/.exec(color)
  return rgba ? Number(rgba[1]) : 1
}

function backgroundOf(element: Element | null): string | undefined {
  for (let node = element; node; node = node.parentElement) {
    const color = getComputedStyle(node).backgroundColor
    const alpha = alphaOf(color)
    if (alpha >= 1) return color
    // Translucent fills can't be judged without compositing them.
    if (alpha > 0) return undefined
  }
  return undefined
}

function measure(root: HTMLElement): Check[] {
  return [...root.querySelectorAll<HTMLElement>("[data-contrast]")].flatMap(
    (element) => {
      const text = getComputedStyle(element).color
      const background = backgroundOf(element)
      if (!background || alphaOf(text) < 1) return []
      return [
        {
          name: element.dataset.contrast ?? "",
          ratio: wcag2(toOklch(text), toOklch(background)),
          min: Number(element.dataset.contrastMin ?? 4.5),
        },
      ]
    },
  )
}

/** Measures once the scoped theme has applied, again on every change. */
export function useContrast(
  root: React.RefObject<HTMLElement | null>,
  key: unknown,
): Check[] {
  const [checks, setChecks] = useState<Check[]>([])
  useEffect(() => {
    const run = () => {
      if (root.current) setChecks(measure(root.current))
    }
    const timers = [setTimeout(run, 60), setTimeout(run, 400)]
    return () => timers.forEach(clearTimeout)
  }, [root, key])
  return checks
}

export function ContrastChips({ checks }: { checks: Check[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {checks.map(({ name, ratio, min }) => (
        <Badge key={name} variant={ratio >= min ? "success" : "danger"}>
          {name} {ratio.toFixed(1)}:1
        </Badge>
      ))}
    </div>
  )
}
