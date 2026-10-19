"use client"

import { useComponentParams } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"

import { Board, BoardSection, Specimen, stateProps } from "./board"
import type { StateName } from "./board"

function pageRange(current: number, pages: number): (number | "gap")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const shown = [1, current - 1, current, current + 1, pages]
  let previous = 0
  return shown.flatMap((page) => {
    const gap = page - previous > 1
    previous = page
    return gap ? ["gap" as const, page] : [page]
  })
}

function Pager({ pages, current }: { pages: number; current: number }) {
  return (
    <Pagination className="w-auto">
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        {pageRange(current, pages).map((p, i) =>
          p === "gap" ? (
            <PaginationItem key={`gap-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem
              key={p}
              // Long pagers keep the first, current and last pages on phones.
              className={cn(
                pages > 7 &&
                  p !== current &&
                  p !== 1 &&
                  p !== pages &&
                  "max-sm:hidden",
              )}
            >
              <PaginationLink isActive={p === current} aria-label={`Page ${p}`}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  )
}

/** The current page's button variant, as `PaginationLink` picks it. */
const CURRENT_VARIANT = {
  secondary: "secondary",
  primary: "primary",
  selected: "quiet",
} as const

const CELLS: { label: string; states: StateName[] }[] = [
  { label: "Rest", states: [] },
  { label: "Hover", states: ["hover"] },
  { label: "Focus", states: ["focus"] },
  { label: "Current", states: ["selected"] },
  { label: "Current, hover", states: ["selected", "hover"] },
]

export default function PaginationBoard() {
  const button = useButtonStyles()
  const { current = "secondary" } = useComponentParams("pagination")
  const variant =
    CURRENT_VARIANT[current as keyof typeof CURRENT_VARIANT] ?? "secondary"
  return (
    <Board id="pagination">
      <BoardSection title="Variants" className="gap-x-16 gap-y-8">
        <Specimen label="Short">
          <Pager pages={5} current={2} />
        </Specimen>
        <Specimen label="Long">
          <Pager pages={12} current={6} />
        </Specimen>
      </BoardSection>
      <BoardSection title="States">
        <div
          inert
          className="flex flex-wrap items-end justify-center gap-x-6 gap-y-4"
        >
          {CELLS.map(({ label, states }) => (
            <Specimen key={label} label={label} className="gap-2">
              <span
                {...stateProps(...states)}
                data-button=""
                data-icon-only=""
                className={button({
                  variant: states.includes("selected") ? variant : "quiet",
                  isIconOnly: true,
                })}
              >
                3
              </span>
            </Specimen>
          ))}
        </div>
      </BoardSection>
    </Board>
  )
}
