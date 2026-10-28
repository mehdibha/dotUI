import type { ReactNode } from "react"

import { useComponentParams } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"

// A small label over a section, list or column, in the case and face of the
// sidebar's group labels (Type › Section labels); the body face even as a
// heading.
const SECTION_LABEL_CASE: Record<string, string> = {
  sentence: "font-sans",
  caps: "font-sans tracking-widest uppercase",
  "mono-caps": "font-mono tracking-wider uppercase",
}

export function useSectionLabel() {
  const { labels = "sentence" } = useComponentParams("sidebar")
  return cn(
    "text-xs font-medium text-fg-muted",
    SECTION_LABEL_CASE[labels] ?? SECTION_LABEL_CASE.sentence,
  )
}

export function SectionLabel({
  as: As = "span",
  className,
  children,
}: {
  as?: "span" | "p" | "h2" | "h3"
  className?: string
  children: ReactNode
}) {
  return <As className={cn(useSectionLabel(), className)}>{children}</As>
}

// A TableContainer that runs flush to its card instead of boxing itself in:
// rules out to the card's edges, the end cells on the card's padding line.
export const FLUSH_TABLE =
  "-mx-4 w-auto border-x-0 [--studio-table-radius:0px] roomy:-mx-6 [&_:is(th,td):first-child]:ps-4 [&_:is(th,td):last-child]:pe-4 roomy:[&_:is(th,td):first-child]:ps-6 roomy:[&_:is(th,td):last-child]:pe-6"

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
}

export function formatMoney(
  value: number,
  { digits = 2, currency = "USD" }: { digits?: number; currency?: string } = {},
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

function pageWindow(page: number, total: number): (number | "gap")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const items: (number | "gap")[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) items.push("gap")
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push("gap")
  items.push(total)
  return items
}

export function PagePicker({
  page,
  pageCount,
  onPageChange,
  isIconOnly,
}: {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  isIconOnly?: boolean
}) {
  // Sized to its pages, so it sits beside the note on the footer's row
  // instead of taking the line.
  return (
    <Pagination className="mx-0 w-auto">
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious
            isIconOnly={isIconOnly}
            isDisabled={page === 1}
            onPress={() => onPageChange(page - 1)}
          />
        </PaginationItem>
        {pageWindow(page, pageCount).map((item, index) =>
          item === "gap" ? (
            <PaginationItem key={`gap-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                aria-label={`Page ${item}`}
                isActive={item === page}
                onPress={() => onPageChange(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            isIconOnly={isIconOnly}
            isDisabled={page === pageCount}
            onPress={() => onPageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  )
}
