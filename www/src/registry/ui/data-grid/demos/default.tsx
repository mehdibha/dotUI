'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/registry/ui/badge'
import { DataGrid } from '@/registry/ui/data-grid'

type InvoiceStatus = 'paid' | 'pending' | 'unpaid'

interface Invoice {
  id: string
  status: InvoiceStatus
  email: string
  amount: number
}

const statusVariant = {
  paid: 'success',
  pending: 'warning',
  unpaid: 'neutral',
} as const

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(amount)

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'id',
    header: 'Invoice',
    cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge appearance="subtle" variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatCurrency(row.original.amount)}
      </span>
    ),
  },
]

const invoices: Invoice[] = [
  { id: 'INV001', status: 'paid', email: 'ken99@example.com', amount: 316 },
  { id: 'INV002', status: 'pending', email: 'abe45@example.com', amount: 242 },
  {
    id: 'INV003',
    status: 'unpaid',
    email: 'monserrat@example.com',
    amount: 837,
  },
  { id: 'INV004', status: 'paid', email: 'silas22@example.com', amount: 124 },
  {
    id: 'INV005',
    status: 'pending',
    email: 'carmella@example.com',
    amount: 529,
  },
  { id: 'INV006', status: 'unpaid', email: 'jason78@example.com', amount: 95 },
]

export default function Demo() {
  return (
    <DataGrid
      aria-label="Invoices"
      columns={columns}
      data={invoices}
      pageSize={4}
      className="w-full max-w-xl"
    />
  )
}
