'use client'

import * as React from 'react'

import {
  Pagination,
  PaginationItem,
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
            isIconOnly
            isDisabled={page === 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="px-2 text-sm text-fg-muted tabular-nums">
            Page {page} of {TOTAL_PAGES}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            isIconOnly
            isDisabled={page === TOTAL_PAGES}
            onPress={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  )
}
