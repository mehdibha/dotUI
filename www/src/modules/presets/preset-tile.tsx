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
  /** A few words characterising the preset. Absent for the user's own systems. */
  description?: string
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
 * One preset option: a scoped, themed miniature of the design system, and
 * nothing else — no site-chrome frame or caption around it. The card carries
 * its own name, and selection plus the saved-preset actions ride as a corner
 * badge.
 *
 * The miniature reads top-to-bottom as identity → palette → product, which is
 * what keeps the preset's NAME the loudest thing on the card:
 *
 * - Identity strip — the two font families each set in their own face (so the
 *   label is itself the type specimen), and on the right three glyphs from the
 *   preset's icon library, picked because their silhouettes diverge most
 *   between libraries.
 * - The name in the heading font over its description. This is the card's
 *   headline; everything below it is deliberately smaller.
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
}: {
  item: PresetGalleryItem
  isSelected: boolean
  /** Pin the preview to one mode (docs previews pin light/dark). */
  forcedMode?: 'light' | 'dark'
  /** Corner controls outside the preset scope (e.g. a saved preset's actions menu). */
  actions?: ReactNode
}) {
  const { designSystem } = item
  const { heading, body } = fontPair(designSystem)

  return (
    <div className="relative h-full w-full">
      <DesignSystemProvider
        scoped
        params={designSystem.componentParams}
        tokens={designSystem.tokens}
        density={designSystem.density}
        color={designSystem.color}
        icons={designSystem.icons}
        forcedMode={forcedMode}
      >
        {/* Decorative: the option owns activation, and the card's own buttons
            must never take focus inside it. */}
        <div
          inert
          aria-hidden
          className={cn(
            'flex h-full flex-col overflow-hidden rounded-lg border bg-bg p-3.5 select-none',
            isSelected &&
              'ring-2 ring-accent ring-offset-2 ring-offset-popover',
          )}
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

          <div className="mt-3">
            <p className="truncate font-heading text-2xl leading-tight font-semibold tracking-tight text-fg">
              {item.name}
            </p>
            {item.description && (
              <p className="mt-1.5 truncate text-[11px] leading-none text-fg-muted">
                {item.description}
              </p>
            )}
          </div>

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
              <p className="line-clamp-3 text-[11px] leading-relaxed text-fg-muted">
                The quick brown fox jumps over the lazy dog.
              </p>
              <Button variant="primary" size="sm" className="self-start">
                Continue
                <ArrowRightIcon />
              </Button>
            </div>
            <div
              className="w-1/3 shrink-0 rounded-md ring-1 ring-fg/10 ring-inset"
              style={{
                backgroundColor: 'var(--accent-500)',
                backgroundImage: `radial-gradient(120% 90% at 12% 8%, var(--accent-200), transparent 62%),
                  radial-gradient(120% 100% at 88% 96%, var(--accent-800), transparent 58%)`,
              }}
            />
          </div>
        </div>
      </DesignSystemProvider>

      {/* Site chrome, deliberately outside the preset scope and outside the
          card's `overflow-hidden` so it can sit on the corner. */}
      {(isSelected || actions !== undefined) && (
        <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
          {isSelected && (
            <span
              aria-hidden
              // Site fg, not accent: the card's own ring already answers in the
              // preset's colour, and this marker has to stay legible over every
              // palette (Vercel's accent is near-black).
              className="flex size-5 items-center justify-center rounded-full bg-fg text-bg shadow-sm"
            >
              <CheckIcon className="size-3" />
            </span>
          )}
          {actions}
        </div>
      )}

      {/* Hover/virtual-focus feedback over the whole option, in the site's own
          fg so it reads consistently regardless of the preset underneath.
          Keyboard focus is virtual — it lands as `data-focused` on the item,
          never as a real `:focus-visible`. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-xl bg-fg opacity-0 ring-fg/25 transition-opacity group-hover/option:opacity-4 group-data-focused/option:opacity-6 group-data-focused/option:ring-2"
      />
    </div>
  )
}

export type { PresetGalleryItem }
