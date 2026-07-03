import {
  BlendIcon,
  BoxesIcon,
  ContrastIcon,
  InfoIcon,
  PaletteIcon,
  SunMoonIcon,
  TypeIcon,
  WandSparklesIcon,
} from 'lucide-react'

import type { SpecEntry } from '@/data/schema'

import { SourceLinks } from './source-links'

const icons: [RegExp, typeof InfoIcon][] = [
  [/palette/i, PaletteIcon],
  [/generation/i, WandSparklesIcon],
  [/space/i, BlendIcon],
  [/them|mode/i, SunMoonIcon],
  [/naming/i, TypeIcon],
  [/scope/i, BoxesIcon],
  [/contrast/i, ContrastIcon],
]

function iconFor(label: string) {
  return icons.find(([pattern]) => pattern.test(label))?.[1] ?? InfoIcon
}

interface OverviewCardsProps {
  entries: SpecEntry[]
}

/** The architecture at a glance: one card per decision, headline first. */
export function OverviewCards({ entries }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {entries.map((entry) => {
        const Icon = iconFor(entry.label)
        return (
          <article
            key={entry.label}
            className="flex flex-col gap-2.5 rounded-xl border p-5"
          >
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-muted">
                <Icon className="size-3.5 text-fg-muted" />
              </span>
              <h3 className="text-xs font-medium tracking-wide text-fg-muted uppercase">
                {entry.label}
              </h3>
            </div>
            <p className="text-[15px] leading-snug font-medium text-balance">
              {entry.value}
            </p>
            {entry.note && (
              <p className="text-xs leading-relaxed text-fg-muted">
                {entry.note}
              </p>
            )}
            <SourceLinks sources={entry.sources} className="mt-auto pt-1" />
          </article>
        )
      })}
    </div>
  )
}
