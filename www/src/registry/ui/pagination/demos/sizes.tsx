import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from '@/registry/ui/pagination'

const SIZES = ['sm', 'md', 'lg'] as const

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-6">
      {SIZES.map((size) => (
        <Pagination key={size}>
          <PaginationList>
            <PaginationItem>
              <PaginationPrevious href="#" size={size} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size={size}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size={size} isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size={size}>
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" size={size} />
            </PaginationItem>
          </PaginationList>
        </Pagination>
      ))}
    </div>
  )
}
