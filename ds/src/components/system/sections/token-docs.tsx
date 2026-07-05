'use client'

import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import type { CatalogEntry, SystemWithColors } from '@/data/schema'
import { Input } from '@/ui/input'

import { Block, Mono, Note, Playground, Section, SpecList } from '../primitives'

const TOKEN_NAMES = [
  'accent-background-color-default',
  'accent-color-900',
  'neutral-content-color-default',
  'negative-border-color-focus-hover',
  'blue-800',
  'gray-75',
  'spacing-100',
  'spacing-300',
  'corner-radius-medium-default',
  'corner-radius-full',
  'drop-shadow-elevated',
  'font-size-100',
  'font-size-500',
  'line-height-100',
  'avatar-border-color',
  'popover-border-color',
  'table-selected-row-background-color',
  'opacity-disabled',
  'overlay-opacity',
  'component-height-100',
] as const

function categoryOf(name: string) {
  if (
    name.startsWith('accent-') ||
    name.startsWith('neutral-') ||
    name.startsWith('negative-')
  )
    return 'Semantic colors'
  if (/^(blue|gray|red|green|orange|purple|magenta|celery|cyan)-\d/.test(name))
    return 'Color aliases'
  if (
    name.startsWith('spacing-') ||
    name.startsWith('corner-radius') ||
    name.startsWith('drop-shadow')
  )
    return 'Layout'
  if (name.startsWith('font-') || name.startsWith('line-height'))
    return 'Typography'
  if (name.startsWith('opacity') || name.startsWith('overlay-opacity'))
    return 'Layout'
  if (name.startsWith('component-height')) return 'Component layout'
  return 'Component colors'
}

const TOOL_CARDS = [
  {
    title: 's2-tokens-viewer',
    description:
      'Browses Semantic colors, Color aliases, Component colors, Icons, Layout, Component layout and Typography by category, with a light/dark switch and the package version shown.',
    url: 'https://opensource.adobe.com/spectrum-design-data/s2-tokens-viewer/',
  },
  {
    title: 's2-visualizer',
    description:
      'Visual browser for S2 design data — components and tokens rendered together.',
    url: 'https://opensource.adobe.com/spectrum-design-data/s2-visualizer/',
  },
  {
    title: 'visualizer',
    description: 'The original (S1-era) visualizer, kept alongside the S2 one.',
    url: 'https://opensource.adobe.com/spectrum-design-data/visualizer/',
  },
  {
    title: 'release-timeline',
    description:
      'Charts release frequency across the design-data packages over time.',
    url: 'https://opensource.adobe.com/spectrum-design-data/release-timeline/',
  },
  {
    title: 'diff-generator / component-diff-generator',
    description:
      'Core diff tooling — spectrum-diff-core, optimized-diff, token-changeset-generator and token-mapping-analyzer compute what changed between two data snapshots.',
    url: null,
  },
  {
    title: 'design-data (Rust CLI/TUI)',
    description:
      'validate, resolve, diff, query and migrate design data from the terminal.',
    url: null,
  },
  {
    title: 'design-data-mcp',
    description:
      'npx @adobe/design-data-mcp — an in-process MCP server over a local snapshot, no network calls.',
    url: null,
  },
  {
    title: 's2-docs-mcp / design-data-agent-mcp',
    description:
      'Additional MCP servers exposing S2 docs and agent-oriented design-data queries, plus a packaged "design-data-skill".',
    url: null,
  },
] as const

const DIFF_ROWS = [
  {
    kind: 'Added',
    count: 14,
    sample: 'table-selected-row-background-color',
    tone: 'success',
  },
  {
    kind: 'Removed',
    count: 3,
    sample: 'legacy-drop-shadow-small',
    tone: 'danger',
  },
  {
    kind: 'Value changed',
    count: 9,
    sample: 'accent-color-900',
    tone: 'warning',
  },
  {
    kind: 'Renamed',
    count: 5,
    sample: 'avatar-border-color ← avatar-stroke-color',
    tone: 'info',
  },
] as const

const toneClass = {
  success: 'text-fg-success',
  danger: 'text-fg-danger',
  warning: 'text-fg-warning',
  info: 'text-fg-info',
} as const

export function TokenDocsSection(_props: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = q
      ? TOKEN_NAMES.filter((name) => name.toLowerCase().includes(q))
      : TOKEN_NAMES
    const groups = new Map<string, string[]>()
    for (const name of matches) {
      const category = categoryOf(name)
      groups.set(category, [...(groups.get(category) ?? []), name])
    }
    return groups
  }, [query])

  const resultCount = [...results.values()].reduce(
    (sum, names) => sum + names.length,
    0,
  )

  return (
    <Section
      title="Documentation & Discovery"
      kicker="Design Tokens"
      intro="Spectrum 2's tokens aren't just published as data — they're published as a set of tools to browse, diff, and query that data. A docs hub, live token browsers, diff generators, a Rust CLI, and a growing set of MCP servers all read the same underlying package."
    >
      <Block
        title="Token search"
        description="A live filter over a representative slice of real S2 token names, grouped the way s2-tokens-viewer categorizes them (Semantic colors, Color aliases, Component colors, Layout, Component layout, Typography)."
      >
        <Playground
          label="Filter tokens"
          hint={`${resultCount} of ${TOKEN_NAMES.length}`}
          center={false}
          surface="muted"
        >
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search token names, e.g. “spacing” or “focus”"
            aria-label="Search token names"
            className="mb-5 max-w-sm"
          />
          <div className="flex flex-col gap-5">
            {resultCount === 0 && (
              <p className="text-sm text-fg-muted">
                No tokens match "{query}".
              </p>
            )}
            {[...results.entries()].map(([category, names]) => (
              <div key={category}>
                <p className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
                  {category}
                </p>
                <div className="flex flex-col gap-1.5">
                  {names.map((name) => (
                    <Mono key={name}>{name}</Mono>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Playground>
      </Block>

      <Block
        title="Tooling"
        description="The docs hub at opensource.adobe.com/spectrum-design-data/ links out to Components, Tokens, Registry and AI sections, plus a Tools page collecting the browsers and generators below."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOL_CARDS.map((tool) => (
            <div
              key={tool.title}
              className="flex flex-col gap-2 rounded-xl border p-5"
            >
              <p className="text-sm font-medium text-fg">{tool.title}</p>
              <p className="flex-1 text-xs leading-relaxed text-fg-muted">
                {tool.description}
              </p>
              {tool.url && (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-xs text-fg-accent underline underline-offset-2"
                >
                  {tool.url.replace('https://', '')}
                </a>
              )}
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Change tracking"
        description="pnpm generateDiffResult reports what moved between two snapshots of the token data — added, deleted, value-changed and renamed tokens — feeding the auto-generated CHANGELOG under SemVer + Conventional Commits + changesets + semantic-release."
      >
        <Playground
          surface="muted"
          center={false}
          footer="Illustrative sample — not a live diff."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DIFF_ROWS.map((row) => (
              <div key={row.kind} className="rounded-lg border bg-card p-4">
                <p
                  className={cn(
                    'font-mono text-2xl font-semibold tabular-nums',
                    toneClass[row.tone],
                  )}
                >
                  {row.count}
                </p>
                <p className="mt-1 text-xs font-medium tracking-wide text-fg-muted uppercase">
                  {row.kind}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <SpecList
              rows={DIFF_ROWS.map((row) => ({
                label: row.kind,
                value: <Mono>{row.sample}</Mono>,
              }))}
            />
          </div>
        </Playground>
      </Block>

      <Note>
        Source: opensource.adobe.com/spectrum-design-data — Tools page and
        spectrum-design-data/packages/tokens/README.md.
      </Note>
    </Section>
  )
}
