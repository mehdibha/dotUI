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
  { name: "Customer", id: "customer", isRowHeader: true, allowsSorting: true },
  { name: "Email", id: "email" },
  { name: "Status", id: "status" },
  { name: "Amount", id: "amount", className: "text-right" },
]

const data = [
  {
    id: 1,
    customer: "Ava Chen",
    email: "ava@acme.com",
    status: "Paid",
    amount: "$1,250.00",
  },
  {
    id: 2,
    customer: "Liam Patel",
    email: "liam@northwind.io",
    status: "Pending",
    amount: "$480.00",
  },
  {
    id: 3,
    customer: "Maya Rossi",
    email: "maya@globex.co",
    status: "Paid",
    amount: "$3,200.00",
  },
  {
    id: 4,
    customer: "Noah Kim",
    email: "noah@initech.dev",
    status: "Overdue",
    amount: "$720.00",
  },
  {
    id: 5,
    customer: "Sofia Alvarez",
    email: "sofia@umbrella.org",
    status: "Paid",
    amount: "$950.00",
  },
]

const statusVariant = {
  Paid: "success",
  Pending: "neutral",
  Overdue: "danger",
} as const

export function TableDemo() {
  return (
    <TableContainer className="w-120">
      <Table
        aria-label="Customers"
        selectionMode="multiple"
        defaultSelectedKeys={[3]}
        sortDescriptor={{ column: "customer", direction: "ascending" }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              isRowHeader={column.isRowHeader}
              allowsSorting={column.allowsSorting}
              className={column.className}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow columns={columns}>
              <TableCell className="font-medium">{item.customer}</TableCell>
              <TableCell className="text-fg-muted">{item.email}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    statusVariant[item.status as keyof typeof statusVariant]
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {item.amount}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
