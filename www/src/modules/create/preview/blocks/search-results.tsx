"use client"

import { useMemo, useState } from "react"

import {
  BellIcon,
  BookOpenIcon,
  BoxIcon,
  CodeIcon,
  DownloadIcon,
  LayersIcon,
  LayoutGridIcon,
  ListFilterIcon,
  ListIcon,
  MoreHorizontalIcon,
  SearchIcon,
  ShieldCheckIcon,
  StarIcon,
  TableIcon,
  TelescopeIcon,
  TimerIcon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Accordion } from "@/registry/ui/accordion"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card } from "@/registry/ui/card"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/registry/ui/disclosure"
import { Drawer, DrawerHandle } from "@/registry/ui/drawer"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

type ResultType = "package" | "template" | "guide"

interface Result {
  id: string
  type: ResultType
  title: string
  publisher: string
  version?: string
  summary: string
  category: string
  license: string
  topics: string[]
  installs: number
  stars: number
  size?: number
  updatedDays: number
  verified?: boolean
}

const CATEGORIES = [
  { id: "tables", label: "Tables & grids", count: 214, icon: TableIcon },
  {
    id: "virtualization",
    label: "Virtualization",
    count: 86,
    icon: LayersIcon,
  },
  { id: "navigation", label: "Navigation", count: 143, icon: ZapIcon },
  { id: "data-fetching", label: "Data fetching", count: 77, icon: BoxIcon },
  { id: "utilities", label: "Utilities", count: 302, icon: CodeIcon },
]

const LICENSES = [
  { id: "MIT", label: "MIT", count: 812 },
  { id: "Apache-2.0", label: "Apache 2.0", count: 164 },
  { id: "BSD-3-Clause", label: "BSD 3-Clause", count: 58 },
  { id: "CC-BY-4.0", label: "CC BY 4.0", count: 39 },
]

const TOPICS = [
  "typescript",
  "headless",
  "a11y",
  "react-19",
  "rsc",
  "ssr",
  "zero-deps",
]

const RESULTS: Result[] = [
  {
    id: "orbit-data-table",
    type: "package",
    title: "@orbit-ui/data-table",
    publisher: "Orbit UI",
    version: "4.2.1",
    summary:
      "Headless table primitives with column pinning, grouping and resizable headers. Typed column definitions, no styling opinions.",
    category: "tables",
    license: "MIT",
    topics: ["typescript", "headless", "a11y"],
    installs: 412908,
    stars: 8240,
    size: 48,
    updatedDays: 2,
    verified: true,
  },
  {
    id: "lattice-table-core",
    type: "package",
    title: "@lattice/table-core",
    publisher: "Lattice",
    version: "2.9.0",
    summary:
      "Framework-agnostic table engine: sorting, faceted filtering and server-side pagination adapters for any renderer.",
    category: "tables",
    license: "Apache-2.0",
    topics: ["typescript", "headless", "ssr"],
    installs: 286431,
    stars: 5102,
    size: 31,
    updatedDays: 6,
    verified: true,
  },
  {
    id: "quill-virtual-rows",
    type: "package",
    title: "@quill/virtual-rows",
    publisher: "Quill Labs",
    version: "1.14.3",
    summary:
      "Row virtualizer that keeps 100k-row tables scrolling at 60fps, with dynamic row heights and sticky groups.",
    category: "virtualization",
    license: "MIT",
    topics: ["typescript", "zero-deps"],
    installs: 154220,
    stars: 3470,
    size: 12,
    updatedDays: 21,
  },
  {
    id: "console-starter",
    type: "template",
    title: "Analytics console starter",
    publisher: "Orbit UI",
    version: "3.0.0",
    summary:
      "Production admin template built around a filterable table view, saved segments and a metrics header.",
    category: "tables",
    license: "MIT",
    topics: ["react-19", "rsc", "ssr"],
    installs: 42118,
    stars: 1905,
    size: 210,
    updatedDays: 8,
    verified: true,
  },
  {
    id: "northwind-grid-editor",
    type: "package",
    title: "@northwind/grid-editor",
    publisher: "Northwind",
    version: "0.9.7",
    summary:
      "Spreadsheet-style editable table with range selection, clipboard paste and undo history.",
    category: "tables",
    license: "BSD-3-Clause",
    topics: ["typescript", "a11y"],
    installs: 68304,
    stars: 942,
    size: 74,
    updatedDays: 1,
  },
  {
    id: "accessible-grid-guide",
    type: "guide",
    title: "Building an accessible data grid",
    publisher: "Orbit Docs",
    summary:
      "How to wire roving tabindex, keyboard navigation and screen-reader semantics into a custom table.",
    category: "tables",
    license: "CC-BY-4.0",
    topics: ["a11y", "headless"],
    installs: 24600,
    stars: 512,
    updatedDays: 4,
  },
  {
    id: "orbit-pagination",
    type: "package",
    title: "@orbit-ui/pagination",
    publisher: "Orbit UI",
    version: "4.2.1",
    summary:
      "Pagination controls that pair with any table or list — compact, numbered and cursor-based layouts.",
    category: "navigation",
    license: "MIT",
    topics: ["typescript", "a11y", "zero-deps"],
    installs: 388502,
    stars: 8240,
    size: 6,
    updatedDays: 2,
    verified: true,
  },
  {
    id: "sable-query-table",
    type: "package",
    title: "@sable/query-table",
    publisher: "Sable",
    version: "1.2.0",
    summary:
      "Binds a table to a query cache: request de-duplication, optimistic row updates and infinite scroll.",
    category: "data-fetching",
    license: "MIT",
    topics: ["typescript", "ssr", "react-19"],
    installs: 21750,
    stars: 604,
    size: 22,
    updatedDays: 63,
  },
  {
    id: "console-table-template",
    type: "template",
    title: "Support inbox table template",
    publisher: "Meridian",
    version: "1.5.2",
    summary:
      "Ticket queue built on a dense table with bulk actions, keyboard triage and a detail side panel.",
    category: "tables",
    license: "MIT",
    topics: ["react-19", "rsc"],
    installs: 18420,
    stars: 733,
    size: 168,
    updatedDays: 34,
  },
  {
    id: "quill-csv-export",
    type: "package",
    title: "@quill/csv-export",
    publisher: "Quill Labs",
    version: "2.1.0",
    summary:
      "Stream table selections to CSV or TSV in a worker, with column formatters and 2GB-safe chunking.",
    category: "utilities",
    license: "MIT",
    topics: ["zero-deps", "typescript"],
    installs: 96430,
    stars: 1140,
    size: 9,
    updatedDays: 5,
  },
  {
    id: "meridian-table-legacy",
    type: "package",
    title: "@meridian/table-legacy",
    publisher: "Meridian",
    version: "0.4.11",
    summary:
      "The original Meridian table widget. Kept on npm for existing installs; superseded by @lattice/table-core.",
    category: "tables",
    license: "Apache-2.0",
    topics: ["typescript"],
    installs: 8120,
    stars: 210,
    size: 96,
    updatedDays: 512,
  },
]

const SCOPES = [
  { id: "all", label: "All" },
  { id: "package", label: "Packages" },
  { id: "template", label: "Templates" },
  { id: "guide", label: "Guides" },
] as const

const SORTS = [
  { id: "relevance", label: "Best match" },
  { id: "installs", label: "Most installed" },
  { id: "stars", label: "Most starred" },
  { id: "updated", label: "Recently updated" },
]

const SUGGESTIONS = ["table", "virtual list", "pagination", "csv export"]

const TYPE_META: Record<
  ResultType,
  { label: string; icon: typeof BoxIcon; unit: string }
> = {
  package: { label: "Package", icon: BoxIcon, unit: "installs / wk" },
  template: { label: "Template", icon: LayoutGridIcon, unit: "clones" },
  guide: { label: "Guide", icon: BookOpenIcon, unit: "reads / mo" },
}

const SIZE_MAX = 250
const PAGE_SIZE = 4

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

function updatedLabel(days: number) {
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 30) return `${days} days ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months} months ago`
  return `${Math.round(days / 365)} years ago`
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
}

interface FilterState {
  categories: string[]
  licenses: string[]
  topics: string[]
  size: [number, number]
  maintainedOnly: boolean
}

const DEFAULT_FILTERS: FilterState = {
  categories: ["tables", "virtualization"],
  licenses: [],
  topics: [],
  size: [0, SIZE_MAX],
  maintainedOnly: true,
}

const EMPTY_FILTERS: FilterState = {
  categories: [],
  licenses: [],
  topics: [],
  size: [0, SIZE_MAX],
  maintainedOnly: false,
}

function matchesQuery(result: Result, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const haystack =
    `${result.title} ${result.summary} ${result.publisher} ${result.topics.join(" ")}`
      .toLowerCase()
      .replace(/[-_/@.]/g, " ")
  return terms.every((term) => haystack.includes(term))
}

function matchesFilters(result: Result, filters: FilterState) {
  if (
    filters.categories.length > 0 &&
    !filters.categories.includes(result.category)
  )
    return false
  if (filters.licenses.length > 0 && !filters.licenses.includes(result.license))
    return false
  if (
    filters.topics.length > 0 &&
    !filters.topics.some((topic) => result.topics.includes(topic))
  )
    return false
  if (
    result.size !== undefined &&
    (result.size < filters.size[0] || result.size > filters.size[1])
  )
    return false
  if (filters.maintainedOnly && result.updatedDays > 90) return false
  return true
}

function FacetCount({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-auto pl-3 font-mono text-xs text-fg-muted tabular-nums">
      {children}
    </span>
  )
}

function FiltersPanel({
  filters,
  onChange,
  onClear,
}: {
  filters: FilterState
  onChange: (patch: Partial<FilterState>) => void
  onClear: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">Refine</span>
        <Button variant="quiet" size="sm" onPress={onClear}>
          Clear all
        </Button>
      </div>

      <Accordion
        allowsMultipleExpanded
        defaultExpandedKeys={["category", "license", "size", "topics"]}
      >
        <Disclosure id="category">
          <DisclosureTrigger>Category</DisclosureTrigger>
          <DisclosurePanel>
            <CheckboxGroup
              aria-label="Category"
              value={filters.categories}
              onChange={(categories) => onChange({ categories })}
            >
              <FieldGroup>
                {CATEGORIES.map((category) => (
                  <Checkbox
                    key={category.id}
                    value={category.id}
                    className="w-full"
                  >
                    <CheckboxControl />
                    <Label>{category.label}</Label>
                    <FacetCount>{category.count}</FacetCount>
                  </Checkbox>
                ))}
              </FieldGroup>
            </CheckboxGroup>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure id="license">
          <DisclosureTrigger>License</DisclosureTrigger>
          <DisclosurePanel>
            <CheckboxGroup
              aria-label="License"
              value={filters.licenses}
              onChange={(licenses) => onChange({ licenses })}
            >
              <FieldGroup>
                {LICENSES.map((license) => (
                  <Checkbox
                    key={license.id}
                    value={license.id}
                    className="w-full"
                  >
                    <CheckboxControl />
                    <Label>{license.label}</Label>
                    <FacetCount>{license.count}</FacetCount>
                  </Checkbox>
                ))}
              </FieldGroup>
            </CheckboxGroup>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure id="size">
          <DisclosureTrigger>Bundle size</DisclosureTrigger>
          <DisclosurePanel>
            <Slider
              value={filters.size}
              onChange={(value) =>
                onChange({ size: value as [number, number] })
              }
              minValue={0}
              maxValue={SIZE_MAX}
              step={2}
              formatOptions={{ style: "unit", unit: "kilobyte" }}
              className="w-full"
            >
              <div className="flex items-baseline justify-between gap-2">
                <Label>Minified + gzipped</Label>
                <SliderOutput className="font-mono text-xs tabular-nums" />
              </div>
              <SliderControl />
              <Description>Kilobytes shipped to the browser.</Description>
            </Slider>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure id="topics">
          <DisclosureTrigger>Topics</DisclosureTrigger>
          <DisclosurePanel>
            <TagGroup
              size="sm"
              selectionMode="multiple"
              selectedKeys={filters.topics}
              onSelectionChange={(keys) =>
                onChange({
                  topics:
                    keys === "all" ? [...TOPICS] : [...keys].map((k) => `${k}`),
                })
              }
            >
              <Label className="sr-only">Topics</Label>
              <TagList>
                {TOPICS.map((topic) => (
                  <Tag key={topic} id={topic}>
                    {topic}
                  </Tag>
                ))}
              </TagList>
            </TagGroup>
          </DisclosurePanel>
        </Disclosure>
      </Accordion>

      <Switch
        className="w-full"
        isSelected={filters.maintainedOnly}
        onChange={(maintainedOnly) => onChange({ maintainedOnly })}
      >
        <SwitchControl>
          <FieldContent className="flex-1">
            <Label>Actively maintained</Label>
            <Description>Released in the last 90 days.</Description>
          </FieldContent>
          <SwitchIndicator />
        </SwitchControl>
      </Switch>
    </div>
  )
}

function ResultItem({ result }: { result: Result }) {
  const type = TYPE_META[result.type]
  const TypeIcon = type.icon
  const category = CATEGORIES.find((c) => c.id === result.category)
  const CategoryIcon = category?.icon ?? BoxIcon

  return (
    <Card className="p-4 transition-colors hover:border-border-hover sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-fg-muted sm:size-12">
          <CategoryIcon className="size-5" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-heading text-base font-medium break-all">
              {result.title}
            </h3>
            {result.verified && (
              <span className="inline-flex items-center text-success">
                <ShieldCheckIcon className="size-4" />
                <span className="sr-only">Verified publisher</span>
              </span>
            )}
            <Badge appearance="subtle" variant="accent">
              <TypeIcon aria-hidden />
              {type.label}
            </Badge>
            {result.version && (
              <Badge appearance="subtle" variant="neutral">
                v{result.version}
              </Badge>
            )}
            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="quiet">
                <DownloadIcon />
                <span className="max-sm:sr-only">Install</span>
              </Button>
              <Menu>
                <Button
                  size="sm"
                  variant="quiet"
                  isIconOnly
                  aria-label={`More actions for ${result.title}`}
                >
                  <MoreHorizontalIcon />
                </Button>
                <Popover>
                  <MenuContent>
                    <MenuItem>Open in playground</MenuItem>
                    <MenuItem>Copy install command</MenuItem>
                    <MenuItem>Save to collection</MenuItem>
                    <MenuItem>Compare with…</MenuItem>
                  </MenuContent>
                </Popover>
              </Menu>
            </div>
          </div>

          <p className="text-sm text-pretty text-fg-muted">{result.summary}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-fg-muted">
            <span className="flex items-center gap-1.5">
              <Avatar size="sm">
                <AvatarFallback>{initials(result.publisher)}</AvatarFallback>
              </Avatar>
              {result.publisher}
            </span>
            <span className="flex items-center gap-1 tabular-nums">
              <DownloadIcon className="size-3.5" />
              {compactNumber.format(result.installs)} {type.unit}
            </span>
            <span className="flex items-center gap-1 tabular-nums">
              <StarIcon className="size-3.5" />
              {compactNumber.format(result.stars)}
            </span>
            {result.size !== undefined && (
              <span className="flex items-center gap-1 tabular-nums">
                <ZapIcon className="size-3.5" />
                {result.size} kB
              </span>
            )}
            <span className="flex items-center gap-1">
              <TimerIcon className="size-3.5" />
              Updated {updatedLabel(result.updatedDays)}
            </span>
            <span className="font-mono">{result.license}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {result.topics.map((topic) => (
              <Badge
                key={topic}
                appearance="subtle"
                variant="neutral"
                size="sm"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function SearchResultsBlock() {
  const [query, setQuery] = useState("table")
  const [scope, setScope] = useState<string>("all")
  const [sort, setSort] = useState<string>("relevance")
  const [view, setView] = useState<string>("list")
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const patchFilters = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }

  // Everything except the scope tabs, so each tab can show its own count.
  const scopeless = useMemo(
    () =>
      RESULTS.filter(
        (result) =>
          matchesQuery(result, query) && matchesFilters(result, filters),
      ),
    [query, filters],
  )

  const results = useMemo(() => {
    const scoped =
      scope === "all"
        ? scopeless
        : scopeless.filter((result) => result.type === scope)
    const sorted = [...scoped]
    if (sort === "installs") sorted.sort((a, b) => b.installs - a.installs)
    if (sort === "stars") sorted.sort((a, b) => b.stars - a.stars)
    if (sort === "updated") sorted.sort((a, b) => a.updatedDays - b.updatedDays)
    return sorted
  }, [scopeless, scope, sort])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageResults = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const firstIndex =
    results.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const lastIndex = Math.min(currentPage * PAGE_SIZE, results.length)

  const activeFilters = [
    ...filters.categories.map((id) => ({
      id: `category:${id}`,
      name: CATEGORIES.find((c) => c.id === id)?.label ?? id,
    })),
    ...filters.licenses.map((id) => ({ id: `license:${id}`, name: id })),
    ...filters.topics.map((id) => ({ id: `topic:${id}`, name: id })),
    ...(filters.size[1] < SIZE_MAX || filters.size[0] > 0
      ? [
          {
            id: "size",
            name: `${filters.size[0]}–${filters.size[1]} kB`,
          },
        ]
      : []),
    ...(filters.maintainedOnly
      ? [{ id: "maintained", name: "Actively maintained" }]
      : []),
  ]

  const removeFilters = (keys: Iterable<unknown>) => {
    const removed = new Set([...keys].map((key) => `${key}`))
    const next: Partial<FilterState> = {}
    next.categories = filters.categories.filter(
      (id) => !removed.has(`category:${id}`),
    )
    next.licenses = filters.licenses.filter(
      (id) => !removed.has(`license:${id}`),
    )
    next.topics = filters.topics.filter((id) => !removed.has(`topic:${id}`))
    if (removed.has("size")) next.size = [0, SIZE_MAX]
    if (removed.has("maintained")) next.maintainedOnly = false
    patchFilters(next)
  }

  const clearAll = () => {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  const resultsList = (
    <div className="flex flex-col gap-6">
      {pageResults.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TelescopeIcon />
            </EmptyMedia>
            <EmptyTitle>No matches for “{query}”</EmptyTitle>
            <EmptyDescription>
              Nothing in the registry matches this term with the current
              filters. Try a broader query or drop a facet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="primary" onPress={clearAll}>
              Clear all filters
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div
            className={cn(
              "grid gap-3",
              view === "grid" ? "sm:grid-cols-2" : "grid-cols-1",
            )}
          >
            {pageResults.map((result) => (
              <ResultItem key={result.id} result={result} />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-fg-muted tabular-nums">
              Page {currentPage} of {totalPages}
            </p>
            <Pagination>
              <PaginationList>
                <PaginationItem>
                  <PaginationPrevious
                    isDisabled={currentPage === 1}
                    onPress={() => setPage(currentPage - 1)}
                  />
                </PaginationItem>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber === currentPage}
                      aria-label={`Page ${pageNumber}`}
                      onPress={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    isDisabled={currentPage === totalPages}
                    onPress={() => setPage(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationList>
            </Pagination>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-fg-on-primary">
              <BoxIcon className="size-4" />
            </div>
            <span className="font-heading text-sm font-semibold tracking-tight">
              Orbit Registry
            </span>
          </div>
          <Separator orientation="vertical" className="h-5 max-sm:hidden" />
          <nav className="flex items-center gap-1 max-sm:hidden">
            <Button variant="quiet" size="sm">
              Explore
            </Button>
            <Button variant="quiet" size="sm">
              Docs
            </Button>
            <Button variant="quiet" size="sm">
              Teams
            </Button>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Notifications"
              >
                <BellIcon />
              </Button>
              <TooltipContent>3 packages you follow shipped</TooltipContent>
            </Tooltip>
            <Button size="sm" variant="primary" className="max-sm:hidden">
              Publish
            </Button>
            <Avatar size="sm">
              <AvatarFallback>RK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <section className="border-b bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Search the registry
          </h1>
          <p className="mt-1.5 text-sm text-fg-muted">
            48,219 packages, templates and guides published by 3,104 teams.
          </p>
          <SearchField
            aria-label="Search the registry"
            value={query}
            onChange={(value) => {
              setQuery(value)
              setPage(1)
            }}
            className="mt-5 w-full max-w-2xl"
          >
            <InputGroup size="lg">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input
                size="lg"
                placeholder="Search packages, templates and guides…"
              />
              <InputGroupAddon>
                <KbdGroup className="max-sm:hidden">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </InputGroupAddon>
            </InputGroup>
          </SearchField>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-fg-muted">Popular:</span>
            {SUGGESTIONS.map((suggestion) => (
              <Button
                key={suggestion}
                size="xs"
                variant="quiet"
                onPress={() => {
                  setQuery(suggestion)
                  setPage(1)
                }}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[16rem_1fr] lg:py-8">
        <aside className="max-lg:hidden">
          <div className="sticky top-20">
            <FiltersPanel
              filters={filters}
              onChange={patchFilters}
              onClear={clearAll}
            />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <Tabs
            selectedKey={scope}
            onSelectionChange={(key) => {
              setScope(`${key}`)
              setPage(1)
            }}
          >
            <TabList variant="line" aria-label="Result type">
              {SCOPES.map((item) => (
                <Tab key={item.id} id={item.id}>
                  {item.label}
                  <span className="ml-1.5 text-fg-muted tabular-nums">
                    {item.id === "all"
                      ? scopeless.length
                      : scopeless.filter((r) => r.type === item.id).length}
                  </span>
                </Tab>
              ))}
            </TabList>

            {SCOPES.map((item) => (
              <TabPanel key={item.id} id={item.id} className="pt-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-fg-muted">
                      <span className="font-medium text-fg tabular-nums">
                        {firstIndex}–{lastIndex}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-fg tabular-nums">
                        {results.length}
                      </span>{" "}
                      for “{query}”<span className="font-mono"> · 0.14s</span>
                    </p>

                    <div className="ml-auto flex items-center gap-2">
                      <Dialog>
                        <Button size="sm" className="lg:hidden">
                          <ListFilterIcon />
                          Filters
                          {activeFilters.length > 0 && (
                            <Badge variant="accent" size="sm">
                              {activeFilters.length}
                            </Badge>
                          )}
                        </Button>
                        <Drawer>
                          <DialogContent>
                            <DrawerHandle />
                            <DialogHeader className="sr-only">
                              <DialogTitle>Filters</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                              <FiltersPanel
                                filters={filters}
                                onChange={patchFilters}
                                onClear={clearAll}
                              />
                            </DialogBody>
                          </DialogContent>
                        </Drawer>
                      </Dialog>

                      <Select
                        aria-label="Sort results"
                        className="w-40"
                        value={sort}
                        onChange={(key) => setSort(`${key}`)}
                      >
                        <SelectTrigger size="sm" />
                        <SelectContent>
                          {SORTS.map((option) => (
                            <SelectItem key={option.id} id={option.id}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <ToggleButtonGroup
                        size="sm"
                        isIconOnly
                        selectionMode="single"
                        disallowEmptySelection
                        selectedKeys={[view]}
                        onSelectionChange={(keys) => {
                          const next = [...keys][0]
                          if (typeof next === "string") setView(next)
                        }}
                        aria-label="Result layout"
                        className="max-sm:hidden"
                      >
                        <ToggleButton id="list" aria-label="List layout">
                          <ListIcon />
                        </ToggleButton>
                        <ToggleButton id="grid" aria-label="Grid layout">
                          <LayoutGridIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </div>

                  {activeFilters.length > 0 && (
                    <TagGroup size="sm" onRemove={removeFilters}>
                      <Label className="sr-only">Active filters</Label>
                      <TagList items={activeFilters}>
                        {(filter) => <Tag>{filter.name}</Tag>}
                      </TagList>
                    </TagGroup>
                  )}

                  {resultsList}
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </div>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-fg-muted sm:px-6">
          <span>Orbit Registry · 48,219 published artifacts</span>
          <span className="font-mono">status: all systems operational</span>
        </div>
      </footer>
    </div>
  )
}
