import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"

export function PaginationDemo() {
  return (
    <div className="flex w-max flex-col items-center gap-5">
      <Pagination>
        <PaginationList>
          <PaginationItem>
            <PaginationPrevious isIconOnly onPress={() => {}} />
          </PaginationItem>
          {[1, 2, 3].map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === 2}
                aria-label={`Page ${page}`}
                onPress={() => {}}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink aria-label="Page 10" onPress={() => {}}>
              10
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext isIconOnly onPress={() => {}} />
          </PaginationItem>
        </PaginationList>
      </Pagination>
      <Pagination>
        <PaginationList>
          <PaginationItem>
            <PaginationPrevious onPress={() => {}} />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 text-sm text-fg-muted tabular-nums">
              Page 2 of 10
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onPress={() => {}} />
          </PaginationItem>
        </PaginationList>
      </Pagination>
    </div>
  )
}
