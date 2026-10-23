import { useEffect, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"

import { cn } from "@/registry/lib/utils"

import { DemoPreset } from "../demo-preset"
import { previewPendingClass } from "../preview-controls"
import { componentDemos } from "./demos"

// The card width fill scenes are laid out for; narrower cards scale them down.
const FILL_WIDTH = 280

interface ComponentCardProps {
  name: string
  slug: string
  scale?: number
  /** The demo fills the card and manages its own framing (overlay scenes that
   *  crop at the bottom edge) instead of being centered and scaled. */
  fill?: boolean
  /** Field-like demos render full-width (not scaled), so the field is responsive
   *  to the card and consistent across the set; the demo caps itself via max-width. */
  stretch?: boolean
}

export function ComponentCard({
  name,
  slug,
  scale = 1,
  fill = false,
  stretch = false,
}: ComponentCardProps) {
  const Demo = componentDemos[slug]
  const frameRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)

  // The card is fluid, so a demo's configured scale can exceed what a narrow
  // stage (mobile, tablet) can hold. Cap it by the measured fit so previews
  // shrink instead of clipping; fill scenes shrink below FILL_WIDTH.
  const [fit, setFit] = useState(1)
  useEffect(() => {
    const frame = frameRef.current
    const stage = stageRef.current
    const demo = demoRef.current
    if (!frame) return
    const update = () => {
      if (fill) {
        setFit(Math.min(1, frame.clientWidth / FILL_WIDTH))
      } else if (stage && demo) {
        const { offsetWidth: w, offsetHeight: h } = demo
        setFit(
          w && h ? Math.min(stage.clientWidth / w, stage.clientHeight / h) : 1,
        )
      }
    }
    update()
    // Web-font swaps can change the demo's size without a reliable resize
    // notification; re-measure once the fonts settle.
    document.fonts?.ready.then(update).catch(() => {})
    const observer = new ResizeObserver(update)
    observer.observe(frame)
    if (demo) observer.observe(demo)
    return () => observer.disconnect()
  }, [fill])

  const content = Demo ? (
    <Demo />
  ) : (
    <span className="text-sm text-fg-muted">{name}</span>
  )

  return (
    <Link
      to="/docs/$"
      params={{ _splat: `components/${slug}` }}
      aria-label={name}
      data-component={slug}
      className="group flex flex-col items-center gap-3 rounded-lg outline-none focus-visible:focus-ring"
    >
      {/* Only the frame renders in the selected preset and mode; the name
          below stays in the site theme so it never fades on a pinned mode. */}
      <DemoPreset>
        <div
          ref={frameRef}
          className="relative h-48 w-full overflow-hidden rounded-lg border bg-bg transition-colors group-hover:border-border-control"
        >
          {/* The demo is a non-interactive preview: `inert` keeps its controls out
            of the tab order and lets clicks fall through to the card link, so the
            whole card navigates instead of an embedded demo hijacking the click. */}
          {fill ? (
            <div
              inert
              className={cn(
                "absolute top-0 left-0 origin-top-left",
                previewPendingClass,
              )}
              style={{
                width: `${100 / fit}%`,
                height: `${100 / fit}%`,
                transform: `scale(${fit})`,
              }}
            >
              {content}
            </div>
          ) : (
            <div
              ref={stageRef}
              className="absolute inset-4 flex items-center justify-center overflow-hidden"
            >
              {stretch ? (
                <div
                  inert
                  className={cn(
                    "flex w-full items-center justify-center",
                    previewPendingClass,
                  )}
                >
                  {content}
                </div>
              ) : (
                <div
                  ref={demoRef}
                  inert
                  className={cn(
                    "flex items-center justify-center",
                    previewPendingClass,
                  )}
                  style={{ transform: `scale(${Math.min(scale, fit)})` }}
                >
                  {content}
                </div>
              )}
            </div>
          )}
          {/* A wash over the demo on hover/focus: the card reads as a preview you
            open, not a control you operate. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 bg-fg/5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        </div>
      </DemoPreset>
      <span className="text-base font-medium text-fg group-hover:underline">
        {name}
      </span>
    </Link>
  )
}
