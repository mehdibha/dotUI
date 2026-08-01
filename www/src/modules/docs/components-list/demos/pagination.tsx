import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from '@/registry/ui/pagination'

// Kept short so the row fits the preview card without overflowing.
const PAGES = [1, 2, 3]
const CURRENT = 2

export function PaginationDemo() {
  return (
    <Pagination>
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        {PAGES.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink isActive={p === CURRENT} aria-label={`Page ${p}`}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  )
}
