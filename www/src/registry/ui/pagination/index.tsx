// Pagination links are built on the Link button, so router integration is
// inherited from `button.tsx` — there's no pagination-specific wrapper to add
// here. This entry just re-exports the shipped primitives for site-side use.
export {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from './base'
export type {
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationListProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
} from './base'
