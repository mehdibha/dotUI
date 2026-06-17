'use client'

import * as React from 'react'

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from '@/registry/ui/pagination'

const PAGES = [1, 2, 3, 4, 5]

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
        {PAGES.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === page}
              aria-label={`Page ${p}`}
              onPress={() => setPage(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            isDisabled={page === PAGES.length}
            onPress={() => setPage((p) => Math.min(PAGES.length, p + 1))}
          />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  )
}
