'use client'

import { Badge } from '@/registry/ui/badge'
import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableColumn,
  TableFooter,
  TableHeader,
  TableRow,
} from '@/registry/ui/table'

type InvoiceStatus = 'Paid' | 'Pending' | 'Unpaid'

const invoices: Array<{
  id: string
  status: InvoiceStatus
  amount: number
  method: string
}> = [
  { id: 'INV001', status: 'Paid', amount: 250, method: 'Credit Card' },
  { id: 'INV002', status: 'Pending', amount: 150, method: 'PayPal' },
  { id: 'INV003', status: 'Unpaid', amount: 350, method: 'Bank Transfer' },
  { id: 'INV004', status: 'Paid', amount: 450, method: 'Credit Card' },
  { id: 'INV005', status: 'Paid', amount: 550, method: 'PayPal' },
  { id: 'INV006', status: 'Pending', amount: 200, method: 'Bank Transfer' },
  { id: 'INV007', status: 'Unpaid', amount: 300, method: 'Credit Card' },
]

const statusVariant = {
  Paid: 'success',
  Pending: 'warning',
  Unpaid: 'neutral',
} as const

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(amount)

export default function Demo() {
  const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <TableContainer>
      <Table aria-label="Invoices">
        <TableHeader>
          <TableColumn isRowHeader>Invoice</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Method</TableColumn>
          <TableColumn className="text-right">Amount</TableColumn>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>
                <Badge
                  appearance="subtle"
                  variant={statusVariant[invoice.status]}
                >
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(invoice.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(total)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
