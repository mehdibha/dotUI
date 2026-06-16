'use client'

import { Link } from '@tanstack/react-router'

import { cn } from '@/registry/lib/utils'

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
}

export function ComponentCard({
  name,
  slug,
  href,
  scale = 0.8,
  previewClassName,
}: ComponentCardProps) {
  const Demo = componentDemos[slug]

  return (
    <Link
      to="/docs/$"
      params={{ _splat: href.replace('/docs/', '') }}
      aria-label={name}
      data-component={slug}
      className="group flex flex-col items-center gap-3 rounded-lg focus-reset focus-visible:focus-ring"
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
            the click. */}
        <div
          inert
          className="flex items-center justify-center"
          style={{ transform: `scale(${scale})` }}
        >
          {Demo ? (
            <Demo />
          ) : (
            <span className="text-sm text-fg-muted">{name}</span>
          )}
        </div>
      </ComponentPreview>
      <span className="text-sm font-medium text-fg group-hover:underline">
        {name}
      </span>
    </Link>
  )
}
