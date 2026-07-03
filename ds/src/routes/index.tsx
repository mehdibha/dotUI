import { createFileRoute, Link } from '@tanstack/react-router'

import { dataIndex } from '@/data'
import type { SystemWithColors } from '@/data/schema'
import { Badge } from '@/ui/badge'

export const Route = createFileRoute('/')({
  component: Home,
})

const systemsBySlug = new Map(
  dataIndex.systems.map((system) => [system.slug, system]),
)

const roster = dataIndex.roster.filter((entry) => entry.status === 'tier1')

function paletteStrip(system: SystemWithColors | undefined) {
  if (!system) return null
  const ramp =
    system.colors.ramps.find((r) => r.kind === 'chromatic') ??
    system.colors.ramps[0]
  const mode = system.colors.modes[0]
  if (ramp && mode) {
    return ramp.steps
      .map((step) => step.values[mode] ?? Object.values(step.values)[0])
      .filter((value): value is string => Boolean(value))
  }
  // Rampless systems (e.g. Linear): sample the first paintable token values.
  const values = system.colors.tokenGroups
    .flatMap((group) => group.tokens)
    .map((token) => (mode ? token.values[mode] : undefined))
    .filter(
      (value): value is string =>
        Boolean(value) && !value!.includes('var(') && value !== 'transparent',
    )
  return values.length > 0 ? values.slice(0, 12) : null
}

function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          How the best design systems actually work.
        </h1>
        <p className="mt-4 text-fg-muted">
          Rigorous, citation-backed research across a curated roster of
          genuinely excellent design systems — starting with the deepest
          possible treatment of color and token systems. Explore each
          system&apos;s real palette, semantic vocabulary and mechanics, exactly
          as shipped, with sources attached.
        </p>
        <p className="mt-2 text-sm text-fg-muted">
          {roster.length} systems planned · {systemsBySlug.size} explorable —
          growing in the open.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">The roster</h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roster.map((entry) => {
            const system = systemsBySlug.get(entry.slug)
            const strip = paletteStrip(system)
            return (
              <li key={entry.slug}>
                <Link
                  to="/systems/$slug"
                  params={{ slug: entry.slug }}
                  className="flex h-full flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{entry.name}</span>
                  <span className="text-sm text-fg-muted">{entry.org}</span>
                  {strip && (
                    <span className="flex h-3 overflow-hidden rounded-sm">
                      {strip.map((value, index) => (
                        <span
                          key={index}
                          className="flex-1"
                          style={{ backgroundColor: value }}
                        />
                      ))}
                    </span>
                  )}
                  <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    <Badge
                      appearance="subtle"
                      variant={system ? 'success' : 'neutral'}
                    >
                      {system ? 'explorable' : 'planned'}
                    </Badge>
                    {entry.method === 'reverse-engineered' && (
                      <Badge appearance="subtle" variant="info">
                        reverse-engineered
                      </Badge>
                    )}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
