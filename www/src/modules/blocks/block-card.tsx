'use client'

import { useEffect, useRef, useState } from 'react'

import type { BlockRegistryItem } from '@/registry/types'
import { ShowcaseCard } from '@/components/showcase-card'

import { blockPreviewSlug } from './lib'

// Virtual viewport the block renders at inside the tile before being scaled down.
const BASE_W = 1280
const BASE_H = 820

/**
 * A live, scaled-down render of a block in the visitor's design system. Uses the
 * same `/preview/<slug>` iframe the builder uses, so full-screen layouts
 * (`min-h-svh`) render correctly; the iframe is its own viewport, scaled to fill
 * the tile. Decorative — the parent card's overlay link owns the interaction.
 */
function BlockThumbnail({
  slug,
  presetParam,
}: {
  slug: string
  presetParam: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {width > 0 && (
        <iframe
          title={`${slug} preview`}
          src={`/preview/${blockPreviewSlug(slug)}${presetParam}`}
          tabIndex={-1}
          scrolling="no"
          className="origin-top-left border-0"
          style={{
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${width / BASE_W})`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

/**
 * One block in the /blocks gallery — same shape as a /presets card: a quiet
 * header (title + variant count) over a framed live preview, with a transparent
 * overlay link to open it in the editor (pre-added at its default variant).
 */
export function BlockCard({
  block,
  href,
  presetParam,
}: {
  block: BlockRegistryItem
  href: string
  presetParam: string
}) {
  const variantCount = block.params.variant.values.length
  return (
    <ShowcaseCard
      label={block.display.title}
      action={
        <span className="shrink-0 text-xs text-fg-muted">
          {variantCount} variants
        </span>
      }
      className="transition hover:border-border-hover hover:shadow-md has-[a:focus-visible]:border-border-hover"
    >
      <BlockThumbnail slug={block.name} presetParam={presetParam} />
      {/* Fade the clipped bottom edge into the card chrome. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
      <a
        href={href}
        aria-label={`Open ${block.display.title} in the editor`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:focus-ring"
      />
    </ShowcaseCard>
  )
}
