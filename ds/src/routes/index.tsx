import { useMemo, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ListFilterIcon } from 'lucide-react'
import type { Selection } from 'react-aria-components/Menu'

import { dataIndex } from '@/data'
import type { RosterEntry } from '@/data/schema'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from '@/ui/menu'
import { Popover } from '@/ui/popover'
import { SearchField } from '@/ui/search-field'
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

const catalog = [...dataIndex.roster].sort((a, b) => {
  const aExplorable = systemsBySlug.has(a.slug) ? 1 : 0
  const bExplorable = systemsBySlug.has(b.slug) ? 1 : 0
  if (aExplorable !== bExplorable) return bExplorable - aExplorable
  return b.general - a.general
})

const explorable = catalog.filter((entry) => systemsBySlug.has(entry.slug))

// Systems without an exploration page yet — disabled in the table.
const plannedKeys = catalog
  .filter((entry) => !systemsBySlug.has(entry.slug))
  .map((entry) => entry.slug)

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

const categoryOptions = [
  { id: 'all', label: 'All categories' },
  ...(
    Object.entries(categoryLabels) as [RosterEntry['category'], string][]
  ).map(([id, label]) => ({ id, label })),
]

const accessOptions = [
  { id: 'all', label: 'All access' },
  ...(
    Object.entries(accessBadges) as [RosterEntry['status'], { label: string }][]
  ).map(([id, { label }]) => ({ id, label })),
]

function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-12 sm:py-16">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          The design system directory.
        </h1>
        <p className="mt-4 max-w-xl text-base text-balance text-fg-muted">
          Explore the systems worth learning from — every color ramp, token, and
          contrast rule, measured from the source.
        </p>
        <p className="mt-8 font-mono text-xs text-fg-muted">
          {catalog.length} systems · {explorable.length} explorable · growing in
          the open
        </p>
      </section>

      <Directory />
    </div>
  )
}

function Directory() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [access, setAccess] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.filter((entry) => {
      if (category !== 'all' && entry.category !== category) return false
      if (access !== 'all' && entry.status !== access) return false
      if (q && !`${entry.name} ${entry.org}`.toLowerCase().includes(q)) {
        return false
      }
      return true
    })
  }, [query, category, access])

  const activeFilters =
    (category !== 'all' ? 1 : 0) + (access !== 'all' ? 1 : 0)

  // Section-level single select over globally-unique `${prefix}:${value}` keys:
  // keep the newly picked key, drop the previous.
  const pickOne =
    (prefix: string, current: string, setter: (value: string) => void) =>
    (keys: Selection) => {
      if (keys === 'all') return
      const active = `${prefix}:${current}`
      const next = [...keys].map(String).find((key) => key !== active)
      if (next) setter(next.slice(prefix.length + 1))
    }

  return (
    <section className="pb-24">
      <div className="flex items-center gap-3 pt-6">
        <SearchField
          aria-label="Search systems"
          placeholder="Search systems…"
          value={query}
          onChange={setQuery}
          className="flex-1"
        />
        <Menu>
          <Button aria-label="Filters" size="md" isIconOnly>
            <ListFilterIcon />
            {activeFilters > 0 && (
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-accent" />
            )}
          </Button>
          <Popover placement="bottom end">
            <MenuContent className="min-w-52">
              <MenuSection
                selectionMode="multiple"
                disallowEmptySelection
                selectedKeys={new Set([`category:${category}`])}
                onSelectionChange={pickOne('category', category, setCategory)}
              >
                <MenuSectionHeader>Category</MenuSectionHeader>
                {categoryOptions.map((option) => (
                  <MenuItem key={option.id} id={`category:${option.id}`}>
                    {option.label}
                  </MenuItem>
                ))}
              </MenuSection>
              <MenuSection
                selectionMode="multiple"
                disallowEmptySelection
                selectedKeys={new Set([`access:${access}`])}
                onSelectionChange={pickOne('access', access, setAccess)}
              >
                <MenuSectionHeader>Access</MenuSectionHeader>
                {accessOptions.map((option) => (
                  <MenuItem key={option.id} id={`access:${option.id}`}>
                    {option.label}
                  </MenuItem>
                ))}
              </MenuSection>
            </MenuContent>
          </Popover>
        </Menu>
      </div>

      <div className="mt-4">
        <TableContainer className="rounded-none border-0 bg-transparent">
          <Table
            aria-label="Design systems"
            className="[&_[data-slot=table-cell]]:h-16 [&_[data-slot=table-cell]]:px-0 [&_[data-slot=table-column]]:h-11 [&_[data-slot=table-column]]:px-0"
            disabledKeys={plannedKeys}
            onRowAction={(key) =>
              navigate({ to: '/systems/$slug', params: { slug: String(key) } })
            }
          >
            <TableHeader>
              <TableColumn className="w-10">#</TableColumn>
              <TableColumn isRowHeader>System</TableColumn>
              <TableColumn className="text-right">Score</TableColumn>
            </TableHeader>
            <TableBody
              renderEmptyState={() => 'No systems match your filters.'}
            >
              {filtered.map((entry, index) => {
                const isExplorable = systemsBySlug.has(entry.slug)
                return (
                  <TableRow
                    key={entry.slug}
                    id={entry.slug}
                    className={isExplorable ? undefined : 'border-disabled'}
                  >
                    <TableCell
                      className={
                        isExplorable
                          ? 'font-mono text-xs text-fg-muted'
                          : 'font-mono text-xs text-fg-disabled'
                      }
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-baseline gap-2">
                        {isExplorable ? (
                          <Link
                            to="/systems/$slug"
                            params={{ slug: entry.slug }}
                            className="font-medium"
                          >
                            {entry.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-fg-disabled">
                            {entry.name}
                          </span>
                        )}
                        <span
                          className={
                            isExplorable
                              ? 'text-xs text-fg-muted'
                              : 'text-xs text-fg-disabled'
                          }
                        >
                          by {entry.org}
                        </span>
                        {!isExplorable && (
                          <Badge
                            size="sm"
                            className="bg-disabled text-fg-disabled"
                          >
                            planned
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell
                      className={
                        isExplorable
                          ? 'text-right font-mono text-xs'
                          : 'text-right font-mono text-xs text-fg-disabled'
                      }
                    >
                      {entry.general}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  )
}
