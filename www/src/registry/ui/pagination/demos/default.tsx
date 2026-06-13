'use client'

import * as React from 'react'

import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from '@/registry/ui/pagination'

const TOTAL_PAGES = 10

export default function Demo() {
  const [page, setPage] = React.useState(1)

  return (
    <Pagination>
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious
            isDisabled={page === 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
          />
        </PaginationItem>
        {getPageRange(page, TOTAL_PAGES).map((p, i) =>
          p === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                aria-label={`Page ${p}`}
                onPress={() => setPage(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            isDisabled={page === TOTAL_PAGES}
            onPress={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  )
}

// Always keep the first, last, current, and neighbouring pages; collapse the
// rest into ellipses.
function getPageRange(current: number, total: number): (number | 'ellipsis')[] {
  const shown = new Set(
    [1, total, current, current - 1, current + 1].filter(
      (p) => p >= 1 && p <= total,
    ),
  )
  const sorted = [...shown].sort((a, b) => a - b)
  const range: (number | 'ellipsis')[] = []
  let previous = 0
  for (const p of sorted) {
    if (p - previous > 1) range.push('ellipsis')
    range.push(p)
    previous = p
  }
  return range
}
