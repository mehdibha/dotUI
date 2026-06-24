'use client'

import { useState } from 'react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/registry/lib/utils'

import { CardHoverProvider } from './autoplay'
import { componentDemos } from './demos'

function ComponentPreview({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border bg-bg p-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface ComponentCardProps {
  name: string
  slug: string
  href: string
  scale?: number
  previewClassName?: string
  /** Full-bleed demos (overlay scenes) fill the preview instead of being centered
   *  and scaled — they manage their own framing and the "zoom out" choreography. */
  fill?: boolean
}

export function ComponentCard({
  name,
  slug,
  href,
  scale = 0.8,
  previewClassName,
  fill = false,
}: ComponentCardProps) {
  const Demo = componentDemos[slug]
  // Hover/keyboard-focus on the card drives the demo's autoplay animation. The
  // demo itself is `inert`, so the card is the only thing that can be pointed at
  // or focused — it broadcasts that state down through CardHoverProvider.
  const [active, setActive] = useState(false)

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
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <ComponentPreview
        className={cn(
          'w-full transition-colors group-hover:border-border-hover',
          previewClassName,
        )}
      >
        {/* The demo is a non-interactive preview: `inert` keeps its controls out of
            the tab order and lets clicks fall through to the card link, so the whole
            card navigates instead of an embedded demo (Modal/Menu/Popover…) hijacking
            the click. `inert` also blocks focus, so the autoplay animations (which
            simulate focus/press/open states) can never steal the page's real focus. */}
        <CardHoverProvider value={active}>
          {fill ? (
            <div inert className="absolute inset-0">
              {content}
            </div>
          ) : (
            <div
              inert
              className="flex items-center justify-center"
              style={{ transform: `scale(${scale})` }}
            >
              {content}
            </div>
          )}
        </CardHoverProvider>
      </ComponentPreview>
      <span className="text-sm font-medium text-fg group-hover:underline">
        {name}
      </span>
    </Link>
  )
}
