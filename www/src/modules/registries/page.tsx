"use client"

/* Browser for the mirrored shadcn registry directory (data.ts). Facets are
   declarative — one entry in FACETS gives you a searchable popover, live
   counts and a filter pass. Counts for a facet ignore that facet's own
   selection, so a filtered facet still shows what else you could pick. */

import * as React from "react"
import {
  BuildingIcon,
  CircleHelpIcon,
  ExternalLinkIcon,
  InfoIcon,
  ListFilterIcon,
  SearchIcon,
  Settings2Icon,
  UserIcon,
  UserRoundCogIcon,
  XIcon,
} from "lucide-react"
import type { Selection } from "react-aria-components"
import { useFilter } from "react-aria-components/Autocomplete"
import type { SortDescriptor } from "react-aria-components/Table"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Command, CommandContent, CommandItem } from "@/registry/ui/command"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Link } from "@/registry/ui/link"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

import { registries, type Maintainer, type Registry } from "./data"

type BadgeVariant =
  | "accent"
  | "danger"
  | "info"
  | "neutral"
  | "success"
  | "warning"

interface Option {
  value: string
  label: string
}

const MAINTAINERS: (Option & {
  variant: BadgeVariant
  icon: typeof UserIcon
})[] = [
  { value: "company", label: "Company", variant: "accent", icon: BuildingIcon },
  {
    value: "solo-business",
    label: "Solo business",
    variant: "warning",
    icon: UserRoundCogIcon,
  },
  {
    value: "individual",
    label: "Individual",
    variant: "neutral",
    icon: UserIcon,
  },
  {
    value: "unclear",
    label: "Unclear",
    variant: "info",
    icon: CircleHelpIcon,
  },
]

const MAINTAINER_BY_VALUE = Object.fromEntries(
  MAINTAINERS.map((option) => [option.value, option]),
) as Record<Maintainer, (typeof MAINTAINERS)[number]>

const CATEGORIES: Option[] = [
  { value: "components", label: "Components" },
  { value: "blocks", label: "Blocks & templates" },
  { value: "animations", label: "Animations" },
  { value: "icons", label: "Icons" },
  { value: "charts", label: "Charts" },
  { value: "ai", label: "AI & agents" },
  { value: "editor", label: "Editors" },
  { value: "forms", label: "Forms" },
  { value: "media", label: "Media" },
  { value: "maps", label: "Maps" },
  { value: "3d", label: "3D" },
  { value: "product-sdk", label: "Product SDK" },
  { value: "theming", label: "Theming" },
  { value: "utilities", label: "Utilities" },
  { value: "specialty", label: "Specialty" },
]

const ENTITY_KINDS: Option[] = [
  { value: "big-tech", label: "Big tech" },
  { value: "startup-saas", label: "SaaS startup" },
  { value: "product-company", label: "Product company" },
  { value: "agency-studio", label: "Agency / studio" },
  { value: "oss-org", label: "Open-source org" },
  { value: "solo-business", label: "Solo business" },
  { value: "individual", label: "Individual" },
  { value: "unknown", label: "Unknown" },
]

const FRAMEWORKS: Option[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "angular", label: "Angular" },
  { value: "other", label: "Other" },
]

const BASES: Option[] = [
  { value: "shadcn", label: "shadcn/ui" },
  { value: "radix", label: "Radix" },
  { value: "base-ui", label: "Base UI" },
  { value: "react-aria", label: "React Aria" },
  { value: "none", label: "No headless layer" },
  { value: "unknown", label: "Unknown" },
]

const PRICINGS: Option[] = [
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "unknown", label: "Unknown" },
]

const CONFIDENCES: Option[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const TAGS: Option[] = [
  { value: "open-source", label: "Open source" },
  { value: "marketing", label: "Marketing" },
  { value: "dashboard", label: "Dashboard" },
  { value: "accessibility", label: "Accessibility" },
  { value: "minimal", label: "Minimal" },
  { value: "playful", label: "Playful" },
  { value: "brutalism", label: "Brutalism" },
  { value: "glass", label: "Glass" },
  { value: "retro", label: "Retro" },
  { value: "clay", label: "Clay" },
  { value: "terminal", label: "Terminal" },
  { value: "web3", label: "Web3" },
  { value: "mobile", label: "Mobile" },
  { value: "gsap", label: "GSAP" },
  { value: "tailwind-v4", label: "Tailwind v4" },
]

interface Facet {
  id: string
  title: string
  options: Option[]
  values: (registry: Registry) => string[]
}

const FACETS: Facet[] = [
  {
    id: "maintainer",
    title: "Maintainer",
    options: MAINTAINERS,
    values: (r) => [r.maintainer],
  },
  {
    id: "entityKind",
    title: "Org type",
    options: ENTITY_KINDS,
    values: (r) => [r.entityKind],
  },
  {
    id: "category",
    title: "Library type",
    options: CATEGORIES,
    values: (r) => [r.category],
  },
  {
    id: "framework",
    title: "Framework",
    options: FRAMEWORKS,
    values: (r) => r.frameworks,
  },
  { id: "base", title: "Built on", options: BASES, values: (r) => [r.base] },
  {
    id: "pricing",
    title: "Pricing",
    options: PRICINGS,
    values: (r) => [r.pricing],
  },
  { id: "tags", title: "Tags", options: TAGS, values: (r) => r.tags },
  {
    id: "confidence",
    title: "Audit confidence",
    options: CONFIDENCES,
    values: (r) => [r.confidence],
  },
]

const MAINTAINER_RANK: Record<Maintainer, number> = {
  company: 0,
  "solo-business": 1,
  individual: 2,
  unclear: 3,
}

interface Column {
  id: string
  name: string
  width?: number
  minWidth?: number
  isRowHeader?: boolean
  sortValue?: (registry: Registry) => number | string
  hiddenByDefault?: boolean
  alwaysVisible?: boolean
  cell: (registry: Registry) => React.ReactNode
}

const COLUMNS: Column[] = [
  {
    id: "name",
    name: "Registry",
    width: 190,
    minWidth: 150,
    isRowHeader: true,
    alwaysVisible: true,
    sortValue: (r) => r.name,
    cell: (r) => (
      <Link
        href={r.homepage}
        target="_blank"
        rel="noreferrer"
        variant="quiet"
        className="group/link min-w-0 gap-1.5 font-mono text-[0.8rem] no-underline"
      >
        <span className="truncate">@{r.name}</span>
        <ExternalLinkIcon className="size-3 shrink-0 text-fg-muted opacity-0 transition-opacity group-hover/link:opacity-100" />
      </Link>
    ),
  },
  {
    id: "summary",
    name: "What it is",
    width: 340,
    minWidth: 220,
    sortValue: (r) => r.summary,
    cell: (r) => <span className="truncate text-fg-muted">{r.summary}</span>,
  },
  {
    id: "category",
    name: "Type",
    width: 140,
    minWidth: 110,
    sortValue: (r) => r.category,
    cell: (r) => (
      <Badge appearance="subtle" variant="neutral" className="font-normal">
        {labelOf(CATEGORIES, r.category)}
      </Badge>
    ),
  },
  {
    id: "maintainer",
    name: "Maintainer",
    width: 150,
    minWidth: 120,
    sortValue: (r) => MAINTAINER_RANK[r.maintainer],
    cell: (r) => {
      const option = MAINTAINER_BY_VALUE[r.maintainer]
      const Icon = option.icon

      return (
        <Badge appearance="subtle" variant={option.variant}>
          <Icon />
          {option.label}
        </Badge>
      )
    },
  },
  {
    id: "entity",
    name: "Built by",
    width: 230,
    minWidth: 160,
    sortValue: (r) => r.entity.toLowerCase(),
    cell: (r) => <span className="truncate">{r.entity}</span>,
  },
  {
    id: "entityKind",
    name: "Org type",
    width: 150,
    minWidth: 110,
    hiddenByDefault: true,
    sortValue: (r) => r.entityKind,
    cell: (r) => (
      <span className="truncate text-fg-muted">
        {labelOf(ENTITY_KINDS, r.entityKind)}
      </span>
    ),
  },
  {
    id: "frameworks",
    name: "Framework",
    width: 130,
    minWidth: 100,
    sortValue: (r) => r.frameworks.join(","),
    cell: (r) => (
      <span className="truncate text-fg-muted">
        {r.frameworks.map((f) => labelOf(FRAMEWORKS, f)).join(", ")}
      </span>
    ),
  },
  {
    id: "base",
    name: "Built on",
    width: 130,
    minWidth: 100,
    hiddenByDefault: true,
    sortValue: (r) => r.base,
    cell: (r) => (
      <span className="truncate text-fg-muted">{labelOf(BASES, r.base)}</span>
    ),
  },
  {
    id: "pricing",
    name: "Pricing",
    width: 120,
    minWidth: 90,
    sortValue: (r) => r.pricing,
    cell: (r) =>
      r.pricing === "unknown" ? (
        <span className="text-fg-muted">—</span>
      ) : (
        <Badge
          appearance="subtle"
          variant={r.pricing === "free" ? "success" : "warning"}
          className="font-normal"
        >
          {labelOf(PRICINGS, r.pricing)}
        </Badge>
      ),
  },
  {
    id: "tags",
    name: "Tags",
    width: 220,
    minWidth: 140,
    hiddenByDefault: true,
    sortValue: (r) => r.tags.join(","),
    cell: (r) => (
      <span className="truncate text-fg-muted">
        {r.tags.length > 0 ? r.tags.join(" · ") : "—"}
      </span>
    ),
  },
  {
    id: "confidence",
    name: "Confidence",
    width: 120,
    minWidth: 100,
    hiddenByDefault: true,
    sortValue: (r) => ({ high: 0, medium: 1, low: 2 })[r.confidence],
    cell: (r) => (
      <span className="truncate text-fg-muted">
        {labelOf(CONFIDENCES, r.confidence)}
      </span>
    ),
  },
  {
    id: "details",
    name: "Details",
    width: 48,
    minWidth: 48,
    alwaysVisible: true,
    cell: (r) => <DetailsPopover registry={r} />,
  },
]

const DEFAULT_VISIBLE = new Set(
  COLUMNS.filter((column) => !column.hiddenByDefault).map(
    (column) => column.id,
  ),
)

export function RegistriesPage() {
  const { contains } = useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
  })
  const [query, setQuery] = React.useState("")
  const [selections, setSelections] = React.useState<
    Record<string, Set<string>>
  >({})
  const [visibleIds, setVisibleIds] = React.useState(DEFAULT_VISIBLE)
  const [sort, setSort] = React.useState<SortDescriptor>({
    column: "maintainer",
    direction: "ascending",
  })

  const searched = React.useMemo(
    () =>
      query.trim()
        ? registries.filter((registry) =>
            contains(searchTextOf(registry), query.trim()),
          )
        : registries,
    [contains, query],
  )

  const rows = React.useMemo(
    () => applyFacets(searched, selections),
    [searched, selections],
  )

  const counts = React.useMemo(
    () =>
      Object.fromEntries(
        FACETS.map((facet) => [
          facet.id,
          tally(applyFacets(searched, selections, facet.id), facet),
        ]),
      ),
    [searched, selections],
  )

  const sortedRows = React.useMemo(() => {
    const column = COLUMNS.find((candidate) => candidate.id === sort.column)
    if (!column?.sortValue) return rows
    const { sortValue } = column
    const direction = sort.direction === "descending" ? -1 : 1

    return [...rows].sort((a, b) => {
      const left = sortValue(a)
      const right = sortValue(b)
      const order =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right))
      return (order || a.name.localeCompare(b.name)) * direction
    })
  }, [rows, sort])

  const visibleColumns = React.useMemo(
    () =>
      COLUMNS.filter(
        (column) => column.alwaysVisible || visibleIds.has(column.id),
      ),
    [visibleIds],
  )
  const columnKey = visibleColumns.map((column) => column.id).join(":")
  const dependencies = React.useMemo(() => [columnKey], [columnKey])

  const activeFilterCount = Object.values(selections).reduce(
    (total, set) => total + set.size,
    0,
  )
  const isFiltered = activeFilterCount > 0 || query.trim().length > 0

  const setFacet = React.useCallback((facetId: string, keys: Selection) => {
    setSelections((current) => {
      const next = { ...current }
      const values =
        keys === "all" ? new Set<string>() : new Set([...keys].map(String))
      if (values.size === 0) delete next[facetId]
      else next[facetId] = values
      return next
    })
  }, [])

  const toggleMaintainer = React.useCallback((value: string) => {
    setSelections((current) => {
      const next = { ...current }
      const active = new Set(current.maintainer ?? [])
      if (active.has(value)) active.delete(value)
      else active.add(value)
      if (active.size === 0) delete next.maintainer
      else next.maintainer = active
      return next
    })
  }, [])

  const reset = React.useCallback(() => {
    setSelections({})
    setQuery("")
  }, [])

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[110rem] flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">shadcn registry directory</h1>
        <p className="max-w-3xl text-sm text-fg-muted">
          All {registries.length} registries in{" "}
          <Link
            href="https://ui.shadcn.com/docs/directory"
            target="_blank"
            rel="noreferrer"
          >
            ui.shadcn.com/docs/directory
          </Link>
          , each audited for who actually maintains it. Install any of them with{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-xs">
            npx shadcn add @name/item
          </code>
          .
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {MAINTAINERS.map((option) => {
            const isActive = selections.maintainer?.has(option.value) ?? false
            const Icon = option.icon

            return (
              <Button
                key={option.value}
                size="sm"
                variant={isActive ? "primary" : "secondary"}
                onPress={() => toggleMaintainer(option.value)}
              >
                <Icon />
                {option.label}
                <span className="font-mono text-xs opacity-70">
                  {
                    registries.filter((r) => r.maintainer === option.value)
                      .length
                  }
                </span>
              </Button>
            )
          })}
        </div>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <SearchField
            aria-label="Search registries"
            value={query}
            onChange={setQuery}
            className="w-full sm:w-72"
          >
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Search name, maker, description…" size="sm" />
            </InputGroup>
          </SearchField>
          {FACETS.map((facet) => (
            <FacetFilter
              key={facet.id}
              facet={facet}
              counts={counts[facet.id] ?? new Map()}
              selectedKeys={selections[facet.id] ?? new Set()}
              onSelectionChange={(keys) => setFacet(facet.id, keys)}
            />
          ))}
          {isFiltered && (
            <Button variant="quiet" size="sm" onPress={reset}>
              Reset
              <XIcon />
            </Button>
          )}
        </div>
        <ColumnsMenu visibleIds={visibleIds} onChange={setVisibleIds} />
      </div>

      <TableContainer resizable className="max-h-[calc(100svh-19rem)]">
        <Table
          aria-label="shadcn registries"
          sortDescriptor={sort}
          onSortChange={setSort}
        >
          <TableHeader columns={visibleColumns} dependencies={dependencies}>
            {(column) => (
              <TableColumn
                id={column.id}
                isRowHeader={column.isRowHeader}
                allowsSorting={Boolean(column.sortValue)}
                width={column.width}
                minWidth={column.minWidth}
              >
                {column.id === "details" ? (
                  <span className="sr-only">{column.name}</span>
                ) : (
                  column.name
                )}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={sortedRows}
            dependencies={dependencies}
            renderEmptyState={() => "No registry matches these filters."}
          >
            {(registry) => (
              <TableRow
                id={registry.name}
                columns={visibleColumns}
                dependencies={dependencies}
                textValue={registry.name}
              >
                {(column) => <TableCell>{column.cell(registry)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <p className="text-sm text-fg-muted">
        {sortedRows.length} of {registries.length} registries
        {activeFilterCount > 0 && ` · ${activeFilterCount} filters active`}
      </p>
    </div>
  )
}

function FacetFilter({
  facet,
  counts,
  selectedKeys,
  onSelectionChange,
}: {
  facet: Facet
  counts: Map<string, number>
  selectedKeys: Set<string>
  onSelectionChange: (keys: Selection) => void
}) {
  const options = facet.options.filter((option) => counts.has(option.value))

  return (
    <Dialog>
      <Button variant="secondary" size="sm" className="border-dashed">
        <ListFilterIcon />
        {facet.title}
        {selectedKeys.size > 0 && (
          <Badge appearance="subtle" variant="accent" size="sm">
            {selectedKeys.size}
          </Badge>
        )}
      </Button>
      <Popover placement="bottom start" className="w-64">
        <DialogContent aria-label={facet.title} className="p-0">
          <Command>
            <SearchField aria-label={`Search ${facet.title}`} autoFocus>
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <Input placeholder={`Search ${facet.title.toLowerCase()}…`} />
              </InputGroup>
            </SearchField>
            <CommandContent
              aria-label={facet.title}
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={onSelectionChange}
              renderEmptyState={() => (
                <div className="py-5 text-center text-sm text-fg-muted">
                  No option found
                </div>
              )}
              style={{ maxHeight: 300, overflowY: "auto" }}
            >
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  id={option.value}
                  textValue={option.label}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  <span className="ml-auto font-mono text-xs text-fg-muted">
                    {counts.get(option.value) ?? 0}
                  </span>
                </CommandItem>
              ))}
            </CommandContent>
          </Command>
          {selectedKeys.size > 0 && (
            <>
              <Separator />
              <div className="p-1">
                <Button
                  variant="quiet"
                  size="sm"
                  className="w-full"
                  onPress={() => onSelectionChange(new Set())}
                >
                  Clear filter
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Popover>
    </Dialog>
  )
}

function ColumnsMenu({
  visibleIds,
  onChange,
}: {
  visibleIds: Set<string>
  onChange: (ids: Set<string>) => void
}) {
  const hideable = COLUMNS.filter((column) => !column.alwaysVisible)

  return (
    <Menu>
      <Button variant="secondary" size="sm">
        <Settings2Icon />
        Columns
      </Button>
      <Popover placement="bottom end">
        <MenuContent
          aria-label="Toggle columns"
          selectionMode="multiple"
          selectedKeys={visibleIds}
          onSelectionChange={(keys) =>
            onChange(
              keys === "all"
                ? new Set(hideable.map((column) => column.id))
                : new Set([...keys].map(String)),
            )
          }
          className="min-w-44"
        >
          {hideable.map((column) => (
            <MenuItem key={column.id} id={column.id}>
              {column.name}
            </MenuItem>
          ))}
        </MenuContent>
      </Popover>
    </Menu>
  )
}

function DetailsPopover({ registry }: { registry: Registry }) {
  const option = MAINTAINER_BY_VALUE[registry.maintainer]

  return (
    <Dialog>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={`Details for @${registry.name}`}
      >
        <InfoIcon />
      </Button>
      <Popover placement="bottom end" className="w-96">
        <DialogContent aria-label={`@${registry.name}`} className="gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">@{registry.name}</span>
            <Badge appearance="subtle" variant={option.variant} size="sm">
              {option.label}
            </Badge>
          </div>
          <p className="text-sm text-fg-muted">{registry.description}</p>
          <div className="flex flex-col gap-1 text-sm">
            <DetailRow label="Built by" value={registry.entity} />
            <DetailRow
              label="Org type"
              value={labelOf(ENTITY_KINDS, registry.entityKind)}
            />
            <DetailRow
              label="Type"
              value={labelOf(CATEGORIES, registry.category)}
            />
            <DetailRow
              label="Confidence"
              value={labelOf(CONFIDENCES, registry.confidence)}
            />
          </div>
          <div className="rounded-md bg-muted p-2 text-xs leading-relaxed text-fg-muted">
            {registry.evidence}
          </div>
          <Link
            href={registry.homepage}
            target="_blank"
            rel="noreferrer"
            className="text-sm"
          >
            {registry.homepage.replace(/^https?:\/\//, "")}
            <ExternalLinkIcon className="size-3.5" />
          </Link>
        </DialogContent>
      </Popover>
    </Dialog>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-24 shrink-0 text-fg-muted">{label}</span>
      <span className="min-w-0 flex-1">{value}</span>
    </div>
  )
}

function labelOf(options: Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

function searchTextOf(registry: Registry) {
  return [
    registry.name,
    registry.entity,
    registry.summary,
    registry.description,
    registry.tags.join(" "),
  ].join(" ")
}

function applyFacets(
  rows: Registry[],
  selections: Record<string, Set<string>>,
  exceptFacetId?: string,
) {
  const active = FACETS.filter(
    (facet) =>
      facet.id !== exceptFacetId && (selections[facet.id]?.size ?? 0) > 0,
  )
  if (active.length === 0) return rows

  return rows.filter((registry) =>
    active.every((facet) => {
      const selected = selections[facet.id]!
      return facet.values(registry).some((value) => selected.has(value))
    }),
  )
}

function tally(rows: Registry[], facet: Facet) {
  const counts = new Map<string, number>()
  for (const registry of rows) {
    for (const value of facet.values(registry)) {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }
  return counts
}
