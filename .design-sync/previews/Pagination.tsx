import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from 'www'

const center: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}

export const Default = () => (
  <div style={center}>
    <Pagination>
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  </div>
)

export const Compact = () => (
  <div style={center}>
    <Pagination>
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious href="#" isIconOnly />
        </PaginationItem>
        <PaginationItem>
          <span
            style={{
              padding: '0 8px',
              fontSize: 14,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Page 4 of 10
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" isIconOnly />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  </div>
)

export const Sizes = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
    }}
  >
    {(['sm', 'md', 'lg'] as const).map((size) => (
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
