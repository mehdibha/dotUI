'use client'

import * as React from 'react'

import {
  Pagination,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from '@/registry/ui/pagination'

const PAGE_SIZE = 10
const TOTAL_RESULTS = 42
const TOTAL_PAGES = Math.ceil(TOTAL_RESULTS / PAGE_SIZE)

export default function Demo() {
  const [page, setPage] = React.useState(1)

  const from = (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, TOTAL_RESULTS)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <p className="text-sm text-fg-muted tabular-nums">
        Showing {from}–{to} of {TOTAL_RESULTS} results
      </p>
      <Pagination>
        <PaginationList>
          <PaginationItem>
            <PaginationPrevious
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
              isDisabled={page === TOTAL_PAGES}
              onPress={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            />
          </PaginationItem>
        </PaginationList>
      </Pagination>
    </div>
  )
}
