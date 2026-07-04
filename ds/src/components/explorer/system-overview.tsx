import type { ComponentType } from 'react'
import {
  BoxesIcon,
  CoinsIcon,
  ContrastIcon,
  ShapesIcon,
  SunMoonIcon,
  SwatchBookIcon,
  TypeIcon,
  ZapIcon,
} from 'lucide-react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts'

import { cn } from '@/lib/utils'
import type { ColorsFile, RosterEntry, SystemWithColors } from '@/data/schema'
import { Badge } from '@/ui/badge'
import type { ChartConfig } from '@/ui/chart'
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
} from '@/ui/chart'

import { getFacts } from './overview-facts'
import { SectionNotes } from './section-notes'
import { SourceLinks } from './source-links'
import { SpecTable } from './spec-table'

const SCORE_AXES = [
  { key: 'color', label: 'Color' },
  { key: 'typography', label: 'Type' },
  { key: 'spacing', label: 'Spacing' },
  { key: 'components', label: 'Components' },
  { key: 'motion', label: 'Motion' },
  { key: 'icons', label: 'Icons' },
  { key: 'accessibility', label: 'A11y' },
  { key: 'docs', label: 'Docs' },
  { key: 'openness', label: 'Openness' },
] satisfies { key: keyof RosterEntry['scores']; label: string }[]

const categoryLabels: Record<RosterEntry['category'], string> = {
  'big-tech': 'Big tech',
  saas: 'SaaS',
  'fintech-devtools': 'Fintech & devtools',
  'oss-libraries': 'OSS libraries',
  government: 'Government',
  'consumer-media': 'Consumer & media',
  international: 'International',
  'primitives-tokens': 'Primitives & tokens',
}

const typeLabels: Record<SystemWithColors['type'], string> = {
  'corporate-design-system': 'Corporate design system',
  'component-library': 'Component library',
  'token-or-color-system': 'Token / color system',
  'styling-distribution': 'Styling distribution',
}

const accessLabels: Record<RosterEntry['status'], string> = {
  open: 'open source',
  'docs-only': 'docs only',
  'shipped-css': 'shipped CSS',
  closed: 'closed',
}

function scoreBand(score: number): string {
  if (score <= 0) return 'none'
  if (score <= 3) return 'thin'
  if (score <= 6) return 'partial'
  if (score <= 8) return 'strong'
  return 'exemplary'
}

interface Metrics {
  totalTokens: number
  tokenGroups: number
  layers: { primitive: number; semantic: number; component: number }
  ramps: number
  modes: string[]
  contrast: number
}

function deriveMetrics(colors: ColorsFile): Metrics {
  const layers = { primitive: 0, semantic: 0, component: 0 }
  let totalTokens = 0
  for (const group of colors.tokenGroups) {
    totalTokens += group.tokens.length
    layers[group.layer] += group.tokens.length
  }
  return {
    totalTokens,
    tokenGroups: colors.tokenGroups.length,
    layers,
    ramps: colors.ramps.length,
    modes: colors.modes,
    contrast: colors.contrast.length,
  }
}

function IdentityStrip({
  system,
  rosterEntry,
}: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b pb-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">
          {rosterEntry && `${categoryLabels[rosterEntry.category]} · `}
          {typeLabels[system.type]}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {rosterEntry && (
            <Badge appearance="subtle" variant="neutral">
              {accessLabels[rosterEntry.status]}
            </Badge>
          )}
          {system.upstream.length > 0 && (
            <Badge appearance="subtle" variant="neutral">
              builds on {system.upstream.join(', ')}
            </Badge>
          )}
        </div>
      </div>
      {rosterEntry && (
        <div className="text-right">
          <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">
            Overall
          </p>
          <p className="leading-none">
            <span className="font-mono text-3xl font-semibold tabular-nums">
              {rosterEntry.general}
            </span>
            <span className="text-sm text-fg-muted">/100</span>
          </p>
        </div>
      )}
    </div>
  )
}

interface Tile {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
  estimated?: boolean
  text?: boolean
}

function StatTileGrid({ system }: { system: SystemWithColors }) {
  const m = deriveMetrics(system.colors)
  const facts = getFacts(system.slug)

  const tiles: (Tile | false)[] = [
    m.totalTokens > 0 && {
      icon: CoinsIcon,
      label: 'Design tokens',
      value: String(m.totalTokens),
      sub: `${m.tokenGroups} ${m.tokenGroups === 1 ? 'group' : 'groups'}`,
    },
    m.ramps > 0 && {
      icon: SwatchBookIcon,
      label: 'Color ramps',
      value: String(m.ramps),
    },
    {
      icon: SunMoonIcon,
      label: 'Themes',
      value: String(m.modes.length),
      sub: m.modes.join(' · '),
    },
    m.contrast > 0 && {
      icon: ContrastIcon,
      label: 'Contrast pairs',
      value: String(m.contrast),
    },
    facts.componentCount != null && {
      icon: BoxesIcon,
      label: 'Components',
      value: String(facts.componentCount),
      estimated: true,
    },
    facts.iconCount != null && {
      icon: ShapesIcon,
      label: 'Icons',
      value: String(facts.iconCount),
      sub: facts.iconSetName,
      estimated: true,
    },
    facts.typefaceName != null && {
      icon: TypeIcon,
      label: 'Typeface',
      value: facts.typefaceName,
      text: true,
      estimated: true,
    },
    facts.motionTokenCount != null && {
      icon: ZapIcon,
      label: 'Motion tokens',
      value: String(facts.motionTokenCount),
      estimated: true,
    },
  ]

  const visible = tiles.filter((tile): tile is Tile => Boolean(tile))
  const hasEstimated = visible.some((tile) => tile.estimated)

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((tile) => (
          <article
            key={tile.label}
            className="flex flex-col gap-1.5 rounded-xl border p-5"
          >
            <div className="flex items-center justify-between">
              <tile.icon className="size-3.5 text-fg-muted" />
              {tile.estimated && (
                <span
                  title="estimated — pending structured capture"
                  className="font-mono text-[9px] tracking-wide text-fg-muted uppercase"
                >
                  est<span className="sr-only"> (estimated)</span>
                </span>
              )}
            </div>
            <p
              className={cn(
                'text-fg',
                tile.text
                  ? 'text-base leading-snug font-medium text-balance'
                  : 'font-mono text-2xl font-semibold tabular-nums',
              )}
            >
              {tile.value}
            </p>
            <div>
              <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">
                {tile.label}
              </p>
              {tile.sub && (
                <p className="mt-0.5 text-[11px] text-fg-muted">{tile.sub}</p>
              )}
            </div>
          </article>
        ))}
      </div>
      {hasEstimated && (
        <p className="mt-3 text-[11px] text-fg-muted">
          <span className="font-mono uppercase">est</span> — indicative figures,
          pending structured capture.
        </p>
      )}
    </div>
  )
}

const coverageConfig = {
  score: { label: 'Coverage', color: 'var(--chart-1)' },
} satisfies ChartConfig

function CoverageProfile({
  scores,
  name,
}: {
  scores: RosterEntry['scores']
  name: string
}) {
  const data = SCORE_AXES.map((axis) => ({
    axis: axis.label,
    score: scores[axis.key],
  }))
  const ranked = [...data].sort((a, b) => b.score - a.score)

  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-medium tracking-wide text-fg-muted uppercase">
          Domain coverage
        </h3>
        <span className="font-mono text-[11px] text-fg-muted">score / 10</span>
      </div>
      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
        <ul className="flex flex-col gap-2.5">
          {ranked.map((row) => (
            <li key={row.axis} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 text-fg">{row.axis}</span>
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 10 }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1 w-2 rounded-[1px]',
                      i < row.score ? 'bg-fg-muted' : 'bg-muted',
                    )}
                  />
                ))}
              </span>
              <span className="ml-auto flex shrink-0 items-center gap-2.5">
                <span className="font-mono text-xs text-fg-muted tabular-nums">
                  {row.score}/10
                </span>
                <span className="w-16 text-right text-xs text-fg-muted">
                  {scoreBand(row.score)}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className="rounded-xl border bg-muted/20 p-3">
          <ChartContainer
            config={coverageConfig}
            className="mx-auto aspect-square max-h-[240px]"
          >
            <RadarChart data={data} outerRadius="72%">
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarGrid gridType="polygon" radialLines={false} />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: 'var(--color-fg-muted)', fontSize: 10 }}
              />
              <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
              <Radar
                dataKey="score"
                fill="var(--color-score)"
                fillOpacity={0.15}
                stroke="var(--color-score)"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </RadarChart>
          </ChartContainer>
          <ChartDataTable
            data={data}
            config={coverageConfig}
            labelKey="axis"
            caption={`${name} domain coverage, 0–10 per axis`}
          />
        </div>
      </div>
    </div>
  )
}

const layerSegments = [
  { key: 'primitive', label: 'Primitive', color: 'var(--chart-5)' },
  { key: 'semantic', label: 'Semantic', color: 'var(--chart-1)' },
  { key: 'component', label: 'Component', color: 'var(--chart-2)' },
] as const

function TokenArchitectureBar({ colors }: { colors: ColorsFile }) {
  const { layers, totalTokens } = deriveMetrics(colors)
  const present = layerSegments.filter((seg) => layers[seg.key] > 0)

  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-medium tracking-wide text-fg-muted uppercase">
          Token architecture
        </h3>
        {totalTokens > 0 && (
          <span className="font-mono text-[11px] text-fg-muted">
            {totalTokens} tokens
          </span>
        )}
      </div>
      {totalTokens > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex h-2.5 overflow-hidden rounded-full">
            {present.map((seg) => (
              <span
                key={seg.key}
                className="min-w-[2px]"
                style={{
                  width: `${(layers[seg.key] / totalTokens) * 100}%`,
                  backgroundColor: seg.color,
                  opacity: 0.4,
                }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {present.map((seg) => (
              <span
                key={seg.key}
                className="flex items-center gap-1.5 text-xs text-fg-muted"
              >
                <span
                  className="size-2 rounded-[2px]"
                  style={{ backgroundColor: seg.color, opacity: 0.4 }}
                />
                {seg.label}
                <span className="font-mono text-fg">{layers[seg.key]}</span>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-fg-muted">
          No structured tokens captured yet.
        </p>
      )}
    </div>
  )
}

function ColorDecisions({ colors }: { colors: ColorsFile }) {
  if (colors.overview.length === 0) return null
  return (
    <div>
      <h3 className="mb-3 text-xs font-medium tracking-wide text-fg-muted uppercase">
        Color system
      </h3>
      <SpecTable entries={colors.overview} />
    </div>
  )
}

function Characterization({
  rosterEntry,
  notes,
}: {
  rosterEntry?: RosterEntry
  notes: ColorsFile['notes']
}) {
  const overviewNotes = notes.filter((note) => note.section === 'overview')
  if (!rosterEntry?.note && overviewNotes.length === 0) return null
  return (
    <div>
      {rosterEntry?.note && (
        <>
          <h3 className="mb-2 text-xs font-medium tracking-wide text-fg-muted uppercase">
            Characterization
          </h3>
          <p className="max-w-2xl text-[15px] leading-relaxed text-fg">
            {rosterEntry.note}
          </p>
        </>
      )}
      <SectionNotes notes={overviewNotes} />
    </div>
  )
}

export function SystemOverview({
  system,
  rosterEntry,
}: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const { colors } = system
  return (
    <div className="flex flex-col gap-8">
      <IdentityStrip system={system} rosterEntry={rosterEntry} />
      <StatTileGrid system={system} />
      {rosterEntry && (
        <CoverageProfile scores={rosterEntry.scores} name={system.name} />
      )}
      <TokenArchitectureBar colors={colors} />
      <ColorDecisions colors={colors} />
      <Characterization rosterEntry={rosterEntry} notes={colors.notes} />
      <div className="border-t pt-5">
        <p className="text-xs text-fg-muted">
          Primary sources for this system:
        </p>
        <SourceLinks sources={colors.sources} className="mt-2" />
      </div>
    </div>
  )
}
