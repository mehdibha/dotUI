'use client'

import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/registry/lib/utils'

import { componentDemos } from './demos'

function ComponentPreview({
  children,
  className,
  stageRef,
}: {
  children: React.ReactNode
  className?: string
  stageRef?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      className={cn(
        'relative h-40 w-full overflow-hidden rounded-lg border bg-bg',
        className,
      )}
    >
      {/* Clip on this inset, not the padded box (which clips at the border), so no
          demo — any scale, overlay, preset or density — paints past the gap. */}
      <div
        ref={stageRef}
        className="absolute inset-4 flex items-center justify-center overflow-hidden"
      >
        {children}
      </div>
    </div>
  )
}

interface ComponentCardProps {
  name: string
  slug: string
  href: string
  scale?: number
  previewClassName?: string
  /** Overlay-scene demos fill the stage instead of being centered and scaled —
   *  they manage their own framing. */
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
  previewClassName,
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
      params={{ _splat: href.replace('/docs/', '') }}
      aria-label={name}
      data-component={slug}
      className="group flex flex-col items-center gap-3 rounded-lg focus-reset focus-visible:focus-ring"
    >
      <ComponentPreview
        stageRef={stageRef}
        className={cn(
          'w-full transition-colors group-hover:border-border-hover',
          previewClassName,
        )}
      >
        {/* The demo is a non-interactive preview: `inert` keeps its controls out of
            the tab order and lets clicks fall through to the card link, so the whole
            card navigates instead of an embedded demo (Modal/Menu/Popover…) hijacking
            the click. */}
        {fill ? (
          <div inert className="absolute inset-0">
            {content}
          </div>
        ) : stretch ? (
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
      </ComponentPreview>
      <span className="text-sm font-medium text-fg group-hover:underline">
        {name}
      </span>
    </Link>
  )
}
