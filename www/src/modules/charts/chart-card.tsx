"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { RotateCcwIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { ShowcaseCard } from "@/components/showcase-card"

import { ChartCodeModal } from "./chart-code-modal"
import { getDemoComponent, POLAR_FAMILIES } from "./data"

/**
 * Mounts the chart once the card comes near the viewport; until then the card
 * surface stays empty. The page stacks ~60 live Recharts previews; mounting
 * them all at once blocks the main thread for seconds, so offscreen charts wait
 * their turn. Only the chart body is deferred — the card shell renders on
 * first paint.
 */
function LazyChartBody({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "600px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="size-full">
      {visible && children}
    </div>
  )
}

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
 * Every card is the same height and padding so the gallery reads as one set.
 * Sizing mirrors shadcn's charts page: cartesian charts (line/bar/area) fill the
 * frame width, polar charts (pie/radar/radial) stay square and are capped at
 * 250px (shadcn's size) so they don't balloon, centered in the frame.
 */
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
      className="h-80"
      inert
      aria-hidden="true"
    >
      <LazyChartBody>
        <Suspense fallback={null}>
          <div
            className={cn(
              "flex size-full animate-in items-center justify-center p-9 duration-300 fade-in [&_*]:pointer-events-none [&_[data-slot=chart]]:h-full! [&_[data-slot=chart]]:min-h-0!",
              isPolar
                ? "[&_[data-slot=chart]]:mx-auto! [&_[data-slot=chart]]:aspect-square! [&_[data-slot=chart]]:max-h-[250px]! [&_[data-slot=chart]]:w-auto!"
                : "[&_[data-slot=chart]]:aspect-auto! [&_[data-slot=chart]]:w-full!",
            )}
          >
            <Component key={replayKey} />
          </div>
        </Suspense>
      </LazyChartBody>
    </ShowcaseCard>
  )
}
