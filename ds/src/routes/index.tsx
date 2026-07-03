import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

import { SpecimenMural } from '@/components/plate'
import { dataIndex } from '@/data'
import type { RosterEntry, SystemWithColors } from '@/data/schema'
import { Badge } from '@/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from '@/ui/table'

export const Route = createFileRoute('/')({
  component: Home,
})

const systemsBySlug = new Map(
  dataIndex.systems.map((system) => [system.slug, system]),
)

const catalog = [...dataIndex.roster].sort((a, b) => b.general - a.general)

const explorable = catalog.filter((entry) => systemsBySlug.has(entry.slug))

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

const accessBadges: Record<
  RosterEntry['status'],
  { label: string; variant: 'success' | 'info' | 'warning' | 'neutral' }
> = {
  open: { label: 'open', variant: 'success' },
  'docs-only': { label: 'docs only', variant: 'info' },
  'shipped-css': { label: 'shipped CSS', variant: 'warning' },
  closed: { label: 'closed', variant: 'neutral' },
}

function plateMeta(system: SystemWithColors): string {
  const { colors } = system
  const tokens = colors.tokenGroups.reduce(
    (sum, group) => sum + group.tokens.length,
    0,
  )
  const parts = [
    colors.ramps.length > 0 && `${colors.ramps.length} ramps`,
    tokens > 0 && `${tokens} tokens`,
    colors.modes.join(' / '),
  ].filter(Boolean)
  return parts.join(' · ')
}

function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <section className="max-w-3xl py-16 sm:py-24">
        <p className="font-mono text-[11px] tracking-widest text-fg-muted uppercase">
          Part I — color & token systems
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          How the best design systems actually work.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-fg-muted">
          An archive of the design systems worth learning from. We read the
          source, measure the shipped CSS, and publish what we find — every
          ramp, token and contrast guarantee, exactly as shipped, with sources
          attached.
        </p>
        <p className="mt-8 font-mono text-xs text-fg-muted">
          {catalog.length} systems cataloged · {explorable.length} explorable ·
          growing in the open
        </p>
      </section>

      <section>
        <div className="flex items-baseline justify-between border-t pt-5">
          <h2 className="font-mono text-[11px] tracking-widest text-fg-muted uppercase">
            In the archive
          </h2>
          <Link
            to="/methodology"
            className="text-sm text-fg-muted transition-colors hover:text-fg"
          >
            How we research →
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {explorable.map((entry) => {
            const system = systemsBySlug.get(entry.slug)!
            return (
              <li key={entry.slug}>
                <Link
                  to="/systems/$slug"
                  params={{ slug: entry.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-(--card-radius) border transition-colors hover:border-border-hover"
                >
                  <SpecimenMural
                    system={system}
                    className="flex h-28 flex-col"
                  />
                  <div className="flex flex-1 flex-col gap-1 border-t p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium">{entry.name}</span>
                      <span className="text-sm text-fg-muted">{entry.org}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="font-mono text-[11px] text-fg-muted">
                        {plateMeta(system)}
                      </span>
                      {entry.status === 'shipped-css' && (
                        <Badge appearance="subtle" variant="info">
                          observed
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-20 pb-24">
        <div className="flex items-baseline justify-between border-t pt-5">
          <h2 className="font-mono text-[11px] tracking-widest text-fg-muted uppercase">
            The catalog
          </h2>
          <span className="font-mono text-xs text-fg-muted">
            scored for research priority — not verdicts
          </span>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-fg-muted">
          Every candidate we recon&apos;d, scored across nine domains against
          fixed anchors. Scores decide what gets researched first; the archive
          entries above are the published research.
        </p>
        <div className="mt-6">
          <CatalogTable />
        </div>
      </section>
    </div>
  )
}

function CatalogTable() {
  const navigate = useNavigate()
  return (
    <TableContainer className="max-h-[36rem]">
      <Table
        aria-label="Design-systems catalog"
        onRowAction={(key) =>
          navigate({ to: '/systems/$slug', params: { slug: String(key) } })
        }
      >
        <TableHeader>
          <TableColumn className="w-10 text-right">#</TableColumn>
          <TableColumn isRowHeader>System</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Access</TableColumn>
          <TableColumn className="text-right">Color</TableColumn>
          <TableColumn className="text-right">Overall</TableColumn>
        </TableHeader>
        <TableBody>
          {catalog.map((entry, index) => {
            const access = accessBadges[entry.status]
            return (
              <TableRow key={entry.slug} id={entry.slug}>
                <TableCell className="text-right font-mono text-xs text-fg-muted">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <span className="flex items-baseline gap-2">
                    <Link
                      to="/systems/$slug"
                      params={{ slug: entry.slug }}
                      className="font-medium"
                    >
                      {entry.name}
                    </Link>
                    <span className="text-xs text-fg-muted">{entry.org}</span>
                    {systemsBySlug.has(entry.slug) && (
                      <Badge appearance="subtle" variant="success" size="sm">
                        explorable
                      </Badge>
                    )}
                  </span>
                </TableCell>
                <TableCell className="text-fg-muted">
                  {categoryLabels[entry.category]}
                </TableCell>
                <TableCell>
                  <Badge appearance="subtle" variant={access.variant} size="sm">
                    {access.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {entry.scores.color}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {entry.general}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
