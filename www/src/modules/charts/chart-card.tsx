"use client"

import { Suspense, useState } from "react"
import { RotateCcwIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { ShowcaseCard } from "@/components/showcase-card"

import { ChartCodeModal } from "./chart-code-modal"
import { getDemoComponent, POLAR_FAMILIES } from "./data"

interface ChartCardProps {
  /** Family id, e.g. `chart-bar` — decides polar vs cartesian sizing. */
  familyId: string
  /** Demo key, e.g. `chart-bar/demos/multiple`. */
  demoKey: string
  /** Human label for the card, e.g. `multiple`. */
  label: string
}

/**
 * One variant in the gallery: a subtle title, a replay action and a "Show code"
 * link sit in a header row above a card that holds nothing but the live chart. The chart is
 * decorative (`inert` + `aria-hidden`) so it never traps focus across the grid —
 * the real, interactive component (with its source) lives in the docs, which
 * "Show code" links to.
 *
 * Every card in a family is the same height and padding so the gallery reads
 * as one set. Charts size themselves: the host fills the frame's width and
 * draws at its own height (the library measures width only) — the box is
 * sized landscape around the 256px chart, and the sparkline family gets a
 * shorter box so its small previews aren't floating in air. Polar charts are
 * capped at 250px wide so they read as a circle rather than a lone arc in a
 * wide box.
 */
export const CARD_HEIGHTS: Record<string, string> = {
  "chart-sparkline": "h-60",
}

export const CARD_HEIGHT_DEFAULT = "h-72"

export function ChartCard({ familyId, demoKey, label }: ChartCardProps) {
  // Bumping this key remounts the chart, replaying its entry animation.
  const [replayKey, setReplayKey] = useState(0)
  const Component = getDemoComponent(demoKey)
  if (!Component) return null

  const isPolar = POLAR_FAMILIES.has(familyId)

  return (
    <ShowcaseCard
      label={label}
      action={
        <div className="flex items-center">
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Replay animation"
            className="text-fg-muted hover:text-fg"
            onPress={() => setReplayKey((k) => k + 1)}
          >
            <RotateCcwIcon />
          </Button>
          <ChartCodeModal demoKey={demoKey} label={label} />
        </div>
      }
      className={CARD_HEIGHTS[familyId] ?? CARD_HEIGHT_DEFAULT}
      inert
      aria-hidden="true"
    >
      {/* Skeleton fills the whole box edge-to-edge; padding lives on the chart
          wrapper so it never insets the fallback. */}
      <Suspense fallback={<div className="size-full animate-pulse bg-muted" />}>
        <div
          className={cn(
            "flex size-full items-center justify-center overflow-hidden p-4 [&_*]:pointer-events-none",
            isPolar &&
              "[&_.ts-chart-host]:mx-auto! [&_.ts-chart-host]:max-w-[250px]!",
          )}
        >
          <Component key={replayKey} />
        </div>
      </Suspense>
    </ShowcaseCard>
  )
}
