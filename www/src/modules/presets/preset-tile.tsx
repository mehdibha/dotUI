'use client'

import type { ReactNode } from 'react'
import { CheckIcon } from 'lucide-react'

import {
  DEFAULT_BODY_FAMILY,
  familyFromStack,
  FONT_HEADING_VAR,
  FONT_SANS_VAR,
} from '@/lib/fonts'
import { DesignSystemProvider } from '@/lib/styles'
import {
  ArrowRightIcon,
  CircleIcon,
  LayersIcon,
  SparklesIcon,
} from '@/registry/__generated__/icons'
import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import type { DesignSystem } from '@/modules/create/preset'

interface PresetGalleryItem {
  id: string
  name: string
  /** Themes the tile's live preview. */
  designSystem: DesignSystem
}

/** Accent steps rendered as the ramp strip — the mid-range reads best at swatch size. */
const RAMP_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
] as const

/** The families behind the preset's heading/body tokens, resolved to names. */
function fontPair(designSystem: DesignSystem) {
  const body = designSystem.tokens[FONT_SANS_VAR]
    ? familyFromStack(designSystem.tokens[FONT_SANS_VAR])
    : DEFAULT_BODY_FAMILY
  const headingStack = designSystem.tokens[FONT_HEADING_VAR]
  const heading = headingStack ? familyFromStack(headingStack) : body
  return { heading, body }
}

/**
 * One preset in the gallery: a live, scoped miniature of the design system in a
 * site-chrome frame, with the name and the tile's actions on a caption row
 * underneath — so the preset's own type and colour never compete with the
 * site's.
 *
 * The miniature reads top-to-bottom as identity → palette → product:
 *
 * - Identity strip — the two font families each set in their own face (so the
 *   label is itself the type specimen), and on the right three glyphs from the
 *   preset's icon library, picked because their silhouettes diverge most
 *   between libraries.
 * - The name in the heading font, closed by a hairline rule — the miniature's
 *   headline, and the largest type on the tile.
 * - The accent ramp.
 * - A vignette row: real components (body copy, the primary action) on an inset
 *   surface next to a palette field. The components put radius, primary colour,
 *   icon set and control height on actual UI; the field shows the accent at a
 *   size swatches can't — how the palette feels as an area, not a chip.
 *
 * No iframes, no scaling; the scoped stylesheet is content-cached, so a grid of
 * these stays cheap.
 */
export function PresetTile({
  item,
  isSelected,
  forcedMode,
  actions,
  onSelect,
}: {
  item: PresetGalleryItem
  isSelected: boolean
  /** Pin the preview to one mode (docs previews pin light/dark). */
  forcedMode?: 'light' | 'dark'
  /** Trailing controls on the caption row (e.g. a saved preset's actions menu). */
  actions?: ReactNode
  onSelect: () => void
}) {
  const { designSystem } = item
  const { heading, body } = fontPair(designSystem)

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border bg-card p-2 transition',
        'hover:border-border-hover has-[button:focus-visible]:border-border-hover',
        isSelected && 'border-border-focus ring-2 ring-border-focus',
      )}
    >
      <DesignSystemProvider
        scoped
        params={designSystem.componentParams}
        tokens={designSystem.tokens}
        density={designSystem.density}
        color={designSystem.color}
        icons={designSystem.icons}
        forcedMode={forcedMode}
      >
        {/* Decorative: the tile's overlay button owns every press inside it.
            `flex-1` (the provider's wrapper is `display: contents`) fills the
            grid row, so denser presets don't shift their caption up. */}
        <div
          inert
          aria-hidden
          className="flex flex-1 flex-col overflow-hidden rounded-xl bg-bg p-4 select-none"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-[11px] leading-none text-fg-accent">
              <span className="font-heading">{heading}</span>
              {heading !== body && (
                <>
                  <span className="text-fg-muted"> / </span>
                  <span className="font-sans">{body}</span>
                </>
              )}
            </span>
            <div className="flex shrink-0 items-center gap-1.5 text-fg-muted [&_svg]:size-4">
              <SparklesIcon />
              <LayersIcon />
              <CircleIcon />
            </div>
          </div>

          <p className="mt-3 truncate border-b pb-3 font-heading text-2xl leading-tight font-semibold tracking-tight text-fg">
            {item.name}
          </p>

          <div className="mt-3 flex gap-[3px]">
            {RAMP_STEPS.map((step) => (
              <span
                key={step}
                // The hairline keeps the near-white low steps from vanishing
                // into a light card.
                className="h-5 flex-1 rounded-[3px] ring-1 ring-fg/10 ring-inset"
                style={{ background: `var(--accent-${step})` }}
              />
            ))}
          </div>

          <div className="mt-3 flex min-h-24 flex-1 items-stretch gap-2.5">
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 rounded-md bg-muted p-2.5">
              <p className="line-clamp-2 text-[11px] leading-relaxed text-fg-muted">
                The quick brown fox jumps over the lazy dog.
              </p>
              <Button variant="primary" size="sm" className="self-start">
                Continue
                <ArrowRightIcon />
              </Button>
            </div>
            <div
              className="w-2/5 shrink-0 rounded-md ring-1 ring-fg/10 ring-inset"
              style={{
                backgroundColor: 'var(--accent-500)',
                backgroundImage: `radial-gradient(120% 90% at 12% 8%, var(--accent-200), transparent 62%),
                  radial-gradient(120% 100% at 88% 96%, var(--accent-800), transparent 58%)`,
              }}
            />
          </div>
        </div>
      </DesignSystemProvider>

      <div className="flex min-h-8 items-center justify-between gap-2 px-1.5 pt-2.5 pb-0.5">
        <span className="truncate text-sm font-medium">{item.name}</span>
        {/* Above the overlay button so the menu stays pressable. */}
        <div className="relative z-20 flex shrink-0 items-center gap-1">
          {isSelected && (
            <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] leading-none text-fg-muted">
              <CheckIcon className="size-3" />
              Selected
            </span>
          )}
          {actions}
        </div>
      </div>

      {/* The miniature contains its own buttons, so the tile can't be a
          <button> (nested buttons are invalid HTML) — hence the overlay. */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Use the ${item.name} preset`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:focus-ring"
      />
    </div>
  )
}

export type { PresetGalleryItem }
