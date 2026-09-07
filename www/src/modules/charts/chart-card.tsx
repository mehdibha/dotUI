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
 * surface stays empty. The page stacks ~70 live chart previews; mounting them
 * all at once blocks the main thread for seconds, so offscreen charts wait
 * their turn. Only the chart body is deferred — the card shell renders on
 * first paint.
 */
function LazyChartBody({
  placeholderClassName,
  children,
}: {
  /** Sized to match the mounted chart exactly, so mounting never shifts layout. */
  placeholderClassName: string
  children: React.ReactNode
}) {
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
    <div ref={ref} className="w-full">
      {visible ? children : <div className={placeholderClassName} />}
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
 * Cards have no fixed height (mirroring shadcn's charts page): the chart draws
 * at 16/9 of the frame width and the card wraps it, so every card in a grid of
 * equal columns lands at the same height. Polar charts are capped at 250px
 * wide so they read as a circle rather than a lone arc in a wide box.
 */
export function ChartCard({ familyId, demoKey, label }: ChartCardProps) {
  // Bumping this key remounts the chart, replaying its entry animation.
  const [replayKey, setReplayKey] = useState(0)
  const Component = getDemoComponent(demoKey)
  if (!Component) return null

  const isPolar = POLAR_FAMILIES.has(familyId)
  // What the chart resolves to once mounted — the placeholder mirrors it so
  // neither lazy mounting nor the Suspense chunk load shifts layout.
  const chartFootprint = cn(
    "aspect-video w-full",
    isPolar && "mx-auto max-w-[250px]",
  )

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
      className="h-auto"
      inert
      aria-hidden="true"
    >
      <div className="p-6">
        <LazyChartBody placeholderClassName={chartFootprint}>
          <Suspense fallback={<div className={chartFootprint} />}>
            <div
              className={cn(
                "w-full animate-in duration-300 fade-in [&_*]:pointer-events-none [&>div]:w-full",
                isPolar &&
                  "[&_.ts-chart-host]:mx-auto! [&_.ts-chart-host]:max-w-[250px]!",
              )}
            >
              <Component key={replayKey} />
            </div>
          </Suspense>
        </LazyChartBody>
      </div>
    </ShowcaseCard>
  )
}
