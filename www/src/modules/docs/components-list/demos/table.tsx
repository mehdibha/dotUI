import { Badge } from "@/registry/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

const columns = [
  { name: "Invoice", id: "invoice", isRowHeader: true },
  { name: "Status", id: "status" },
  { name: "Amount", id: "amount" },
]

const data = [
  { id: 1, invoice: "INV-0041", status: "Paid", amount: "$250.00" },
  { id: 2, invoice: "INV-0042", status: "Pending", amount: "$150.00" },
  { id: 3, invoice: "INV-0043", status: "Paid", amount: "$350.00" },
  { id: 4, invoice: "INV-0044", status: "Overdue", amount: "$450.00" },
]

const statusVariant = {
  Paid: "success",
  Pending: "neutral",
  Overdue: "danger",
} as const

export function TableDemo() {
  return (
    <TableContainer className="w-72">
      <Table
        aria-label="Invoices"
        selectionMode="multiple"
        defaultSelectedKeys={[2]}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn isRowHeader={column.isRowHeader}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow columns={columns}>
              <TableCell>{item.invoice}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    statusVariant[item.status as keyof typeof statusVariant]
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{item.amount}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
