'use client'

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from '@/registry/ui/pagination'

import { useStepAutoplay } from '../autoplay'

const PAGES = [1, 2, 3, 4, 5]

export function PaginationDemo() {
  const { index } = useStepAutoplay(PAGES.length, { dwell: 1100 })
  const page = PAGES[index] ?? PAGES[0]

  return (
    <Pagination>
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious isDisabled={page === 1} onPress={() => {}} />
        </PaginationItem>
        {PAGES.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === page}
              aria-label={`Page ${p}`}
              onPress={() => {}}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            isDisabled={page === PAGES.length}
            onPress={() => {}}
          />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  )
}
