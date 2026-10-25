import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"

import { Badge } from "@/registry/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { directory } from "~/data"
import type { DirectoryRow } from "~/data"
import { CORE_COMPONENTS } from "~/data/looks"

export const Route = createFileRoute("/")({
  component: Home,
})

const captured = directory.filter((row) => row.captured).length

function Home() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-12 sm:py-16">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          The design system directory.
        </h1>
        <p className="mt-4 max-w-xl text-base text-balance text-fg-muted">
          How real products and libraries build their design systems. Captured
          systems are read off the real product, page by page; live ones render
          their real components from their published packages.
        </p>
        <p className="mt-8 font-mono text-xs text-fg-muted">
          {directory.length} systems · {captured} captured ·{" "}
          {directory.length - captured} live only
        </p>
      </section>

      <section className="pb-24">
        <TableContainer className="rounded-none border-0 bg-transparent">
          <Table
            aria-label="Design systems"
            className="[&_[data-slot=table-cell]]:h-14 [&_[data-slot=table-cell]]:pr-4 [&_[data-slot=table-cell]]:pl-0 [&_[data-slot=table-column]]:h-11 [&_[data-slot=table-column]]:pr-4 [&_[data-slot=table-column]]:pl-0"
            onRowAction={(key) =>
              navigate({ to: "/systems/$slug", params: { slug: String(key) } })
            }
          >
            <TableHeader>
              <TableColumn isRowHeader>System</TableColumn>
              <TableColumn>Kind</TableColumn>
              <TableColumn className="hidden sm:table-cell">
                What we have
              </TableColumn>
              <TableColumn className="hidden text-right sm:table-cell">
                Updated
              </TableColumn>
            </TableHeader>
            <TableBody>
              {directory.map((row) => (
                <TableRow key={row.slug} id={row.slug}>
                  <TableCell className="whitespace-normal">
                    <Link
                      to="/systems/$slug"
                      params={{ slug: row.slug }}
                      className="font-medium"
                    >
                      {row.name}
                    </Link>
                    {row.org && (
                      <span className="ml-2 text-xs text-fg-muted">
                        by {row.org}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="flex gap-1">
                      {row.captured && <Badge size="sm">Captured</Badge>}
                      {row.live && (
                        <Badge size="sm" appearance="outline">
                          Live
                        </Badge>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-xs text-fg-muted sm:table-cell">
                    <What row={row} />
                  </TableCell>
                  <TableCell className="hidden text-right text-xs text-fg-muted tabular-nums sm:table-cell">
                    {updated(row)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </div>
  )
}

function What({ row }: { row: DirectoryRow }) {
  const { captured, live } = row
  const components = live?.components?.components ?? []
  const demos = components.filter((c) => c.demo).length
  return (
    <span className="flex flex-col">
      {captured && (
        <span>
          {captured.core}/{CORE_COMPONENTS.length} core components ·{" "}
          {captured.pages} {captured.pages === 1 ? "page" : "pages"} ·{" "}
          {captured.modes.join(", ")}
        </span>
      )}
      {components.length > 0 && (
        <span>
          {components.length} components, {demos} live
        </span>
      )}
      {live?.colors && <span>Color system</span>}
    </span>
  )
}

/** The latest of the capture and the research. */
function updated({ captured, live }: DirectoryRow) {
  return [captured?.date, live?.updatedAt].filter(Boolean).sort().at(-1)
}
