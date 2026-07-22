'use client'

import { DEFAULT_COLOR_CONFIG, DEFAULT_STATUS_SEEDS } from '@/registry/theme'
import { ShowcaseCard } from '@/components/showcase-card'

import { PresetThumbnail } from './preset-thumbnail'
import type { Preset } from './presets-data'

/** The seed swatches shown at the right of the card header, in a fixed order. */
function PaletteSwatches({ preset }: { preset: Preset }) {
  const seeds = preset.designSystem.color?.seeds ?? DEFAULT_COLOR_CONFIG.seeds
  // The neutral seed is optional (absent = auto-tinted); skip it when unset.
  const swatches = [
    seeds.accent,
    seeds.neutral,
    seeds.success ?? DEFAULT_STATUS_SEEDS.success,
    seeds.danger ?? DEFAULT_STATUS_SEEDS.danger,
  ].filter((color): color is string => Boolean(color))
  return (
    <div className="flex shrink-0 items-center -space-x-1">
      {swatches.map((color, i) => (
        <span
          key={i}
          className="size-3.5 rounded-full border border-bg"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

/**
 * One preset in the gallery — same shape as a /charts card: a quiet header row
 * (name + palette) over a framed live preview. The preview is a scaled, themed
 * render of the showcase; it's decorative (`inert`) and a transparent button
 * overlays the whole box to trigger `onSelect`. The preview contains its own
 * buttons, so the box itself can't be a <button> (nested buttons are invalid
 * HTML) — hence the overlay sibling.
 */
export function PresetCard({
  preset,
  onSelect,
}: {
  preset: Preset
  onSelect: () => void
}) {
  return (
    <ShowcaseCard
      label={preset.name}
      action={<PaletteSwatches preset={preset} />}
      className="transition hover:border-border-hover hover:shadow-md has-[button:focus-visible]:border-border-hover"
    >
      <PresetThumbnail designSystem={preset.designSystem} />
      {/* Fade the clipped bottom edge into the card chrome. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Use the ${preset.name} preset`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:focus-ring"
      />
    </ShowcaseCard>
  )
}
