import type { Ramp, SystemWithColors } from '@/data/schema'

function paintable(value: string | undefined): value is string {
  return Boolean(value) && !value!.includes('var(') && value !== 'transparent'
}

/** Approximate luminance of a hex color; non-hex values sort last. */
function luma(value: string): number {
  const hex = /^#([0-9a-f]{6})/i.exec(
    value.length === 4
      ? `#${[...value.slice(1)].map((c) => c + c).join('')}`
      : value,
  )?.[1]
  if (!hex) return Number.MAX_SAFE_INTEGER
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

/** Evenly sample `count` items so a mural spans the whole palette, not just its head. */
function sample<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items
  const step = items.length / count
  return Array.from({ length: count }, (_, i) => items[Math.floor(i * step)]!)
}

function rampRow(ramp: Ramp, mode: string): string[] {
  return ramp.steps
    .map((step) => step.values[mode] ?? Object.values(step.values)[0])
    .filter(paintable)
}

/**
 * Rows of real shipped colors for a system's specimen mural, rendered in the
 * system's native mode (`modes[0]`). Chromatic ramps first; rampless systems
 * (e.g. Linear) fall back to their paintable token values.
 */
export function specimenRows(
  system: SystemWithColors,
  maxRows: number,
): string[][] {
  const mode = system.colors.modes[0] ?? 'light'
  const chromatic = system.colors.ramps.filter((r) => r.kind === 'chromatic')
  const other = system.colors.ramps.filter(
    (r) => r.kind === 'neutral' || r.kind === 'static',
  )
  const ramps = sample([...chromatic, ...other], maxRows)
  const rows = ramps
    .map((ramp) => rampRow(ramp, mode))
    .filter((row) => row.length > 0)
  if (rows.length > 0) return rows

  const values = [
    ...new Set(
      system.colors.tokenGroups
        .flatMap((group) => group.tokens)
        .map((token) => token.values[mode])
        .filter(paintable),
    ),
  ].sort((a, b) => luma(a) - luma(b))
  const perRow = Math.ceil(values.length / Math.min(maxRows, 4)) || 1
  return Array.from({ length: Math.ceil(values.length / perRow) }, (_, i) =>
    values.slice(i * perRow, (i + 1) * perRow),
  ).slice(0, maxRows)
}

interface SpecimenMuralProps {
  system: SystemWithColors
  rows?: number
  className?: string
}

export function SpecimenMural({
  system,
  rows = 6,
  className,
}: SpecimenMuralProps) {
  return (
    <div aria-hidden className={className}>
      {specimenRows(system, rows).map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-1">
          {row.map((value, index) => (
            <span
              key={index}
              className="flex-1"
              style={{ backgroundColor: value }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
