import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/registry/ui/accordion"
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Kbd } from "@/registry/ui/kbd"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"

import { Cell, Sheet } from "./layout"

const INVOICES = [
  { id: "INV-001", customer: "Acme Corp", status: "Paid", amount: "$1,250.00" },
  { id: "INV-002", customer: "Globex", status: "Pending", amount: "$480.00" },
  { id: "INV-003", customer: "Initech", status: "Paid", amount: "$2,100.00" },
  { id: "INV-004", customer: "Umbrella", status: "Overdue", amount: "$75.00" },
]

export function DisplaySheet() {
  return (
    <Sheet className="grid-cols-[360px_1fr]">
      <Cell label="card · header, footer">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Team plan</CardTitle>
            <CardDescription>Billed monthly, cancel anytime.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Unlimited projects, 10 seats and priority support for your whole
              team.
            </p>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="secondary">Compare</Button>
            <Button variant="primary">Upgrade</Button>
          </CardFooter>
        </Card>
      </Cell>

      <Cell label="table · selected row">
        <TableContainer className="w-full">
          <Table
            aria-label="Invoices"
            selectionMode="multiple"
            defaultSelectedKeys={["INV-002"]}
          >
            <TableHeader>
              <TableColumn isRowHeader>Invoice</TableColumn>
              <TableColumn>Customer</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn className="text-right">Amount</TableColumn>
            </TableHeader>
            <TableBody items={INVOICES}>
              {(row) => (
                <TableRow id={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>
                    <Badge
                      appearance="soft"
                      variant={
                        row.status === "Paid"
                          ? "success"
                          : row.status === "Overdue"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{row.amount}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Cell>

      <Cell label="avatars · kbd" className="flex-col items-start gap-5">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
          <AvatarGroup>
            {["AK", "BL", "CM", "DN"].map((initials) => (
              <Avatar key={initials}>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
          <Kbd>Esc</Kbd>
          <Kbd>Shift</Kbd>
        </div>
      </Cell>

      <Cell label="accordion · one open">
        <Accordion className="w-full" defaultExpandedKeys={["refunds"]}>
          <AccordionItem id="billing">
            <AccordionTrigger>How does billing work?</AccordionTrigger>
            <AccordionPanel>Monthly, on the day you signed up.</AccordionPanel>
          </AccordionItem>
          <AccordionItem id="refunds">
            <AccordionTrigger>Can I get a refund?</AccordionTrigger>
            <AccordionPanel>
              Yes — within 30 days of any charge, no questions asked. Refunds
              land on the original payment method in 5–10 business days.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem id="seats">
            <AccordionTrigger>Can I add more seats?</AccordionTrigger>
            <AccordionPanel>Anytime, from the billing page.</AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Cell>
    </Sheet>
  )
}
