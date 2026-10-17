import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"

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
  return (
    <Pagination>
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
