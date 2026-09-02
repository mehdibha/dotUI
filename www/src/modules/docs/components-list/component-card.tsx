"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"

import { componentDemos } from "./demos"

interface ComponentCardProps {
  name: string
  slug: string
  href: string
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
  href,
  scale = 1,
  fill = false,
  stretch = false,
}: ComponentCardProps) {
  const Demo = componentDemos[slug]
  const stageRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)

  // The card is fluid, so a demo's configured scale can exceed what a narrow
  // stage (mobile, tablet) can hold. Cap it by the measured fit so previews
  // shrink instead of clipping.
  const [fit, setFit] = useState(1)
  useEffect(() => {
    const stage = stageRef.current
    const demo = demoRef.current
    if (!stage || !demo) return
    const update = () => {
      const { offsetWidth: w, offsetHeight: h } = demo
      setFit(
        w && h ? Math.min(stage.clientWidth / w, stage.clientHeight / h) : 1,
      )
    }
    update()
    // Web-font swaps can change the demo's size without a reliable resize
    // notification; re-measure once the fonts settle.
    document.fonts?.ready.then(update).catch(() => {})
    const observer = new ResizeObserver(update)
    observer.observe(stage)
    observer.observe(demo)
    return () => observer.disconnect()
  }, [])

  const content = Demo ? (
    <Demo />
  ) : (
    <span className="text-sm text-fg-muted">{name}</span>
  )

  return (
    <Link
      to="/docs/$"
      params={{ _splat: href.replace("/docs/", "") }}
      aria-label={name}
      data-component={slug}
      className="group flex flex-col items-center gap-3 rounded-lg focus-reset focus-visible:focus-ring"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-bg transition-colors group-hover:border-border-control">
        {/* The demo is a non-interactive preview: `inert` keeps its controls out
            of the tab order and lets clicks fall through to the card link, so the
            whole card navigates instead of an embedded demo hijacking the click. */}
        {fill ? (
          <div inert className="absolute inset-0">
            {content}
          </div>
        ) : (
          <div
            ref={stageRef}
            className="absolute inset-4 flex items-center justify-center overflow-hidden"
          >
            {stretch ? (
              <div inert className="flex w-full items-center justify-center">
                {content}
              </div>
            ) : (
              <div
                ref={demoRef}
                inert
                className="flex items-center justify-center"
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
      <span className="text-sm font-medium text-fg">{name}</span>
    </Link>
  )
}
