import { useMemo, useState } from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ListFilterIcon } from "lucide-react"
import type { Selection } from "react-aria-components/Menu"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { dataIndex } from "~/data"
import { CORE_COMPONENTS } from "~/data/looks"
import type { CatalogEntry } from "~/data/schema"

export const Route = createFileRoute("/design-systems")({
  component: DesignSystemsPage,
})

// A researched or captured system has a page.
const withPage = new Set([
  ...dataIndex.systems.map((system) => system.slug),
  ...dataIndex.looks.map((looks) => looks.slug),
])
const pageOf = (entry: CatalogEntry) => entry.preset ?? entry.slug

// Explorable systems first, then the rest alphabetically.
const catalog = [...dataIndex.catalog].sort((a, b) => {
  const aExplorable = withPage.has(pageOf(a)) ? 1 : 0
  const bExplorable = withPage.has(pageOf(b)) ? 1 : 0
  if (aExplorable !== bExplorable) return bExplorable - aExplorable
  return a.name.localeCompare(b.name)
})

const explorable = catalog.filter((entry) => withPage.has(pageOf(entry)))

// Systems without an exploration page yet — disabled in the table.
const plannedKeys = catalog
  .filter((entry) => !withPage.has(pageOf(entry)))
  .map(pageOf)

const categoryLabels: Record<CatalogEntry["category"], string> = {
  "big-tech": "Big tech",
  saas: "SaaS",
  "fintech-devtools": "Fintech & devtools",
  "oss-libraries": "OSS libraries",
  government: "Government",
  "consumer-media": "Consumer & media",
  international: "International",
  "primitives-tokens": "Primitives & tokens",
}

const categoryOptions = [
  { id: "all", label: "All categories" },
  ...(
    Object.entries(categoryLabels) as [CatalogEntry["category"], string][]
  ).map(([id, label]) => ({ id, label })),
]

function DesignSystemsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-12 sm:py-16">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Design systems.
        </h1>
        <p className="mt-4 max-w-xl text-base text-balance text-fg-muted">
          Explore the systems worth learning from — their color ramps, tokens,
          and the conventions that hold them together.
        </p>
        <p className="mt-8 font-mono text-xs text-fg-muted">
          {catalog.length} systems · {explorable.length} explorable ·{" "}
          {dataIndex.looks.length} captured
        </p>
      </section>

      <Captured />
      <Directory />
    </div>
  )
}

/* Products a capture read, one row each: how deep it went, at a glance. */
function Captured() {
  const navigate = useNavigate()
  return (
    <section className="pb-12">
      <h2 className="text-lg font-semibold">Captured</h2>
      <p className="mt-1 max-w-xl text-sm text-fg-muted">
        Read off the real product, page by page, in light and dark. Each page
        shows every look found and what the capture didn&apos;t reach.
      </p>
      <TableContainer className="mt-4 rounded-none border-0 bg-transparent">
        <Table
          aria-label="Captured systems"
          className="[&_[data-slot=table-cell]]:h-12 [&_[data-slot=table-cell]]:px-0 [&_[data-slot=table-column]]:h-11 [&_[data-slot=table-column]]:px-0"
          onRowAction={(key) =>
            navigate({ to: "/systems/$slug", params: { slug: String(key) } })
          }
        >
          <TableHeader>
            <TableColumn isRowHeader>System</TableColumn>
            <TableColumn className="text-right">Pages</TableColumn>
            <TableColumn className="text-right">Core components</TableColumn>
            <TableColumn className="text-right">Looks</TableColumn>
            <TableColumn className="text-right">Off</TableColumn>
          </TableHeader>
          <TableBody>
            {dataIndex.looks.map((system) => (
              <TableRow key={system.slug} id={system.slug}>
                <TableCell>
                  <Link
                    to="/systems/$slug"
                    params={{ slug: system.slug }}
                    className="font-medium"
                  >
                    {system.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right text-xs text-fg-muted tabular-nums">
                  {system.pages}
                  {system.signedIn > 0 && ` · ${system.signedIn} signed in`}
                </TableCell>
                <TableCell className="text-right text-xs text-fg-muted tabular-nums">
                  {system.core} / {CORE_COMPONENTS.length}
                </TableCell>
                <TableCell className="text-right text-xs text-fg-muted tabular-nums">
                  {system.looks}
                </TableCell>
                <TableCell className="text-right text-xs text-fg-muted tabular-nums">
                  {system.off || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  )
}

function Directory() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.filter((entry) => {
      if (category !== "all" && entry.category !== category) return false
      if (q && !`${entry.name} ${entry.org}`.toLowerCase().includes(q)) {
        return false
      }
      return true
    })
  }, [query, category])

  const activeFilters = category !== "all" ? 1 : 0

  // Single-select over `category:${value}` keys: keep the new pick, drop the old.
  const pickCategory = (keys: Selection) => {
    if (keys === "all") return
    const active = `category:${category}`
    const next = [...keys].map(String).find((key) => key !== active)
    if (next) setCategory(next.slice("category:".length))
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
                onSelectionChange={pickCategory}
              >
                <MenuSectionHeader>Category</MenuSectionHeader>
                {categoryOptions.map((option) => (
                  <MenuItem key={option.id} id={`category:${option.id}`}>
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
              navigate({ to: "/systems/$slug", params: { slug: String(key) } })
            }
          >
            <TableHeader>
              <TableColumn className="w-10">#</TableColumn>
              <TableColumn isRowHeader>System</TableColumn>
              <TableColumn className="text-right">Category</TableColumn>
            </TableHeader>
            <TableBody
              renderEmptyState={() => "No systems match your filters."}
            >
              {filtered.map((entry, index) => {
                const isExplorable = withPage.has(pageOf(entry))
                return (
                  <TableRow
                    key={entry.slug}
                    id={pageOf(entry)}
                    className={isExplorable ? undefined : "border-disabled"}
                  >
                    <TableCell
                      className={
                        isExplorable
                          ? "font-mono text-xs text-fg-muted"
                          : "font-mono text-xs text-fg-disabled"
                      }
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-baseline gap-2">
                        {isExplorable ? (
                          <Link
                            to="/systems/$slug"
                            params={{ slug: pageOf(entry) }}
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
                              ? "text-xs text-fg-muted"
                              : "text-xs text-fg-disabled"
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
                          ? "text-right text-xs text-fg-muted"
                          : "text-right text-xs text-fg-disabled"
                      }
                    >
                      {categoryLabels[entry.category]}
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
