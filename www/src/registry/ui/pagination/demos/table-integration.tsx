'use client'

import * as React from 'react'

import {
  Pagination,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from '@/registry/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from '@/registry/ui/table'

interface Invoice {
  id: string
  customer: string
  amount: string
}

const INVOICES: Invoice[] = [
  { id: 'INV-001', customer: 'Acme Corp', amount: '$1,240.00' },
  { id: 'INV-002', customer: 'Globex', amount: '$820.50' },
  { id: 'INV-003', customer: 'Initech', amount: '$3,100.00' },
  { id: 'INV-004', customer: 'Umbrella', amount: '$540.00' },
  { id: 'INV-005', customer: 'Soylent', amount: '$2,015.75' },
  { id: 'INV-006', customer: 'Hooli', amount: '$1,890.00' },
  { id: 'INV-007', customer: 'Stark Inc', amount: '$4,320.00' },
  { id: 'INV-008', customer: 'Wayne Co', amount: '$960.25' },
]

const PAGE_SIZE = 3
const TOTAL_PAGES = Math.ceil(INVOICES.length / PAGE_SIZE)

export default function Demo() {
  const [page, setPage] = React.useState(1)

  const rows = INVOICES.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex w-full flex-col gap-3">
      <TableContainer>
        <Table aria-label="Invoices">
          <TableHeader>
            <TableColumn isRowHeader>Invoice</TableColumn>
            <TableColumn>Customer</TableColumn>
            <TableColumn>Amount</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(invoice) => (
              <TableRow id={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell className="tabular-nums">{invoice.amount}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex items-center justify-between">
        <p className="text-sm text-fg-muted tabular-nums">
          Page {page} of {TOTAL_PAGES}
        </p>
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
              <PaginationNext
                isIconOnly
                isDisabled={page === TOTAL_PAGES}
                onPress={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              />
            </PaginationItem>
          </PaginationList>
        </Pagination>
      </div>
    </div>
  )
}
