"use client"

import { type ComponentProps, type ReactNode, useEffect, useState } from "react"

import {
  ArrowLeftIcon,
  Building2Icon,
  CheckCircle2Icon,
  CopyIcon,
  DownloadIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PenSquareIcon,
  SendIcon,
  Trash2Icon,
  WalletIcon,
} from "@/registry/icons"
import { Responsive } from "@/registry/lib/responsive"
import { cn } from "@/registry/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/ui/card"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Drawer } from "@/registry/ui/drawer"
import { Description, Label } from "@/registry/ui/field"
import { Input, TextArea } from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import { Separator } from "@/registry/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { TextField } from "@/registry/ui/text-field"

const INVOICE_NUMBER = "INV-2048"
const CLIENT_EMAIL = "marta.lindqvist@heliosrobotics.de"

const LINE_ITEMS = [
  {
    id: "audit",
    description: "Design system audit",
    detail: "Component inventory, token gap analysis",
    quantity: 12,
    unit: "hrs",
    rate: 140,
  },
  {
    id: "library",
    description: "Component library build — Sprint 14",
    detail: "Button, Field, Table, Overlay families",
    quantity: 38,
    unit: "hrs",
    rate: 140,
  },
  {
    id: "tokens",
    description: "Design token migration",
    detail: "Figma variables → OKLCH ramps",
    quantity: 16,
    unit: "hrs",
    rate: 140,
  },
  {
    id: "a11y",
    description: "Accessibility review",
    detail: "WCAG 2.2 AA, keyboard and screen reader passes",
    quantity: 9,
    unit: "hrs",
    rate: 140,
  },
  {
    id: "handover",
    description: "Handover workshop",
    detail: "Half-day session, 9 engineers",
    quantity: 1,
    unit: "session",
    rate: 900,
  },
]

const SUBTOTAL = LINE_ITEMS.reduce((sum, i) => sum + i.quantity * i.rate, 0)
const DISCOUNT = -Math.round(SUBTOTAL * 0.05)
const VAT_RATE = 0.19
const VAT = (SUBTOTAL + DISCOUNT) * VAT_RATE
const TOTAL = SUBTOTAL + DISCOUNT + VAT

const currency = new Intl.NumberFormat("en-IE", {
  currency: "EUR",
  style: "currency",
})

const formatCurrency = (amount: number) => currency.format(amount)

export default function InvoiceBlock() {
  const [isPaid, setIsPaid] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [sendOpen, setSendOpen] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  useEffect(() => {
    if (!isDownloading) return
    const id = setTimeout(() => setIsDownloading(false), 1100)
    return () => clearTimeout(id)
  }, [isDownloading])

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="flex min-h-screen flex-col bg-muted">
        <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
            <Button variant="quiet" isIconOnly aria-label="Back to invoices">
              <ArrowLeftIcon />
            </Button>
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="flex min-w-0 flex-col">
                <h1 className="truncate text-sm font-medium">
                  {INVOICE_NUMBER}
                </h1>
                <span className="truncate text-xs text-fg-muted">
                  Helios Robotics GmbH
                </span>
              </div>
              <StatusBadge isPaid={isPaid} />
            </div>

            <div className="flex w-full items-center justify-end gap-1.5 sm:w-auto">
              <Button
                variant="quiet"
                isIconOnly
                aria-label="Download PDF"
                isPending={isDownloading}
                onPress={() => setIsDownloading(true)}
              >
                <DownloadIcon />
              </Button>
              <Button variant="quiet" isIconOnly aria-label="Print invoice">
                <PrinterIcon />
              </Button>
              <SendInvoiceDialog
                isOpen={sendOpen}
                onOpenChange={setSendOpen}
                onSent={(email) => {
                  setSentTo(email)
                  setSendOpen(false)
                }}
              />
              <Menu>
                <Button variant="quiet" isIconOnly aria-label="More actions">
                  <MoreHorizontalIcon />
                </Button>
                <Popover className="w-56">
                  <MenuContent>
                    <MenuItem onAction={() => setIsPaid(!isPaid)}>
                      <CheckCircle2Icon />
                      {isPaid ? "Mark as unpaid" : "Mark as paid"}
                    </MenuItem>
                    <MenuItem>
                      <PenSquareIcon />
                      Edit invoice
                    </MenuItem>
                    <MenuItem>
                      <CopyIcon />
                      Duplicate
                    </MenuItem>
                    <MenuItem>
                      <LinkIcon />
                      Copy payment link
                    </MenuItem>
                    <Separator />
                    <MenuItem variant="danger">
                      <Trash2Icon />
                      Void invoice
                    </MenuItem>
                  </MenuContent>
                </Popover>
              </Menu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          {sentTo && (
            <Alert variant="success" className="mb-5">
              <CheckCircle2Icon />
              <AlertTitle>Invoice sent</AlertTitle>
              <AlertDescription>
                {INVOICE_NUMBER} was emailed to {sentTo}. A copy is on the
                activity log.
              </AlertDescription>
            </Alert>
          )}

          <Card className="gap-0 py-0">
            <CardHeader className="items-center gap-4 border-b px-6 py-6 sm:px-10 sm:py-8">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-fg-on-primary"
                >
                  <svg viewBox="0 0 24 24" className="size-5 fill-current">
                    <path d="M4 20V7.2L12 4l8 3.2V20h-5v-6.4h-6V20H4Z" />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="font-heading text-lg leading-tight font-semibold tracking-tight">
                    Northwind Studio
                  </span>
                  <span className="text-xs text-fg-muted">
                    Interface & design systems
                  </span>
                </div>
              </div>
              <CardAction className="text-right">
                <span className="block text-[10px] font-medium tracking-widest text-fg-muted uppercase">
                  Invoice
                </span>
                <Badge
                  variant="neutral"
                  appearance="subtle"
                  size="lg"
                  className="mt-1.5 font-mono tracking-tight tabular-nums"
                >
                  {INVOICE_NUMBER}
                </Badge>
              </CardAction>
            </CardHeader>

            <CardContent className="flex flex-col gap-8 px-6 py-7 sm:px-10 sm:py-9">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                <MetaItem label="Issue date" value="14 Aug 2026" />
                <MetaItem label="Due date" value="13 Sep 2026" />
                <MetaItem label="Terms" value="Net 30" />
                <MetaItem
                  label={isPaid ? "Amount paid" : "Amount due"}
                  value={formatCurrency(TOTAL)}
                  emphasis
                />
              </div>

              <Separator />

              <div className="grid gap-8 sm:grid-cols-2">
                <section className="flex flex-col gap-2.5">
                  <SectionLabel as="h2">From</SectionLabel>
                  <div className="text-sm leading-relaxed">
                    <p className="font-medium">Northwind Studio GmbH</p>
                    <p className="text-fg-muted">Ateliers Nord 12</p>
                    <p className="text-fg-muted">10119 Berlin, Germany</p>
                    <p className="mt-2.5 font-mono text-xs text-fg-muted">
                      VAT DE 812 447 903
                    </p>
                  </div>
                </section>

                <section className="flex flex-col gap-2.5">
                  <SectionLabel as="h2">Bill to</SectionLabel>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>ML</AvatarFallback>
                    </Avatar>
                    <div className="text-sm leading-relaxed">
                      <p className="font-medium">Marta Lindqvist</p>
                      <p className="text-fg-muted">Helios Robotics GmbH</p>
                      <p className="text-fg-muted">Prinzregentenstraße 44</p>
                      <p className="text-fg-muted">81675 München, Germany</p>
                      <p className="mt-2.5 font-mono text-xs text-fg-muted">
                        VAT DE 297 118 640
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <section className="flex flex-col gap-3">
                <SectionLabel as="h2">Line items</SectionLabel>
                <TableContainer>
                  <Table
                    aria-label={`Line items for invoice ${INVOICE_NUMBER}`}
                  >
                    <TableHeader>
                      <TableColumn isRowHeader>Description</TableColumn>
                      <TableColumn className="text-right">Qty</TableColumn>
                      <TableColumn className="text-right">Rate</TableColumn>
                      <TableColumn className="text-right">Amount</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {LINE_ITEMS.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="h-auto min-w-52 py-2.5 whitespace-normal">
                            <span className="block font-medium">
                              {item.description}
                            </span>
                            <span className="block text-xs text-fg-muted">
                              {item.detail}
                            </span>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCurrency(item.rate)}
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {formatCurrency(item.quantity * item.rate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-right font-normal text-fg-muted"
                        >
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(SUBTOTAL)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-right font-normal text-fg-muted"
                        >
                          Retainer discount (5%)
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(DISCOUNT)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-right font-normal text-fg-muted"
                        >
                          VAT (19%)
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(VAT)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-lg border border-border bg-muted px-5 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {isPaid ? "Paid in full" : "Total due"}
                  </span>
                  <span className="text-xs text-fg-muted">
                    {isPaid
                      ? "Settled 19 Aug 2026 · SEPA transfer"
                      : "Payable by 13 Sep 2026 · EUR"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge isPaid={isPaid} />
                  <span className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
                    {formatCurrency(TOTAL)}
                  </span>
                </div>
              </div>

              {!isPaid && (
                <div className="flex justify-end">
                  <Button variant="primary" onPress={() => setIsPaid(true)}>
                    <WalletIcon />
                    Record payment
                  </Button>
                </div>
              )}

              <section className="flex flex-col gap-2">
                <SectionLabel as="h2">Notes</SectionLabel>
                <p className="max-w-prose text-sm leading-relaxed text-pretty text-fg-muted">
                  Thanks for another good quarter. Payment is due within 30 days
                  by bank transfer — please quote {INVOICE_NUMBER} as the
                  reference so it reconciles automatically. Sprint 15 kicks off
                  the week of 7 September; the token migration handover doc is
                  attached to the project workspace.
                </p>
              </section>
            </CardContent>

            <CardFooter className="flex-col items-start gap-5 border-t px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted"
                >
                  <Building2Icon className="size-4" />
                </span>
                <div className="flex flex-col text-xs leading-relaxed">
                  <span className="font-medium text-fg">
                    Commerzbank Berlin
                  </span>
                  <span className="font-mono text-fg-muted">
                    IBAN DE89 3704 0044 0532 0130 00
                  </span>
                  <span className="font-mono text-fg-muted">
                    BIC COBADEFFXXX
                  </span>
                </div>
              </div>
              <p className="text-xs text-fg-muted">
                Questions? billing@northwind.studio
              </p>
            </CardFooter>
          </Card>

          <p className="mt-6 text-center text-xs text-fg-muted">
            Northwind Studio GmbH · HRB 204 118 B · Amtsgericht Charlottenburg
          </p>
        </main>
      </div>
    </div>
  )
}

function StatusBadge({ isPaid }: { isPaid: boolean }) {
  return (
    <Badge
      variant={isPaid ? "success" : "warning"}
      appearance="subtle"
      size="lg"
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {isPaid ? "Paid" : "Due"}
    </Badge>
  )
}

function SectionLabel({
  as: As = "span",
  children,
}: {
  as?: "span" | "h2"
  children: ReactNode
}) {
  return (
    <As className="text-[10px] font-medium tracking-widest text-fg-muted uppercase">
      {children}
    </As>
  )
}

function MetaItem({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <SectionLabel>{label}</SectionLabel>
      <span
        className={cn(
          "text-sm tabular-nums",
          emphasis ? "font-semibold" : "font-medium",
        )}
      >
        {value}
      </span>
    </div>
  )
}

function SendInvoiceDialog({
  isOpen,
  onOpenChange,
  onSent,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSent: (email: string) => void
}) {
  const [email, setEmail] = useState(CLIENT_EMAIL)

  const content = (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Send invoice</DialogTitle>
        <DialogDescription>
          {INVOICE_NUMBER} · {formatCurrency(TOTAL)} to Helios Robotics GmbH
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        <TextField value={email} onChange={setEmail} type="email">
          <Label>Recipient</Label>
          <Input placeholder="name@company.com" />
          <Description>A PDF copy is attached to the email.</Description>
        </TextField>
        <TextField defaultValue="Hi Marta — invoice for the August sprint work is attached. Shout if anything needs splitting across cost centres.">
          <Label>Message</Label>
          <TextArea rows={4} />
        </TextField>
      </DialogBody>
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button variant="primary" onPress={() => onSent(email)}>
          <SendIcon />
          Send invoice
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button variant="primary">
        <SendIcon />
        Send
      </Button>
      <Responsive
        render={(isMobile) =>
          isMobile ? <Drawer>{content}</Drawer> : <Modal>{content}</Modal>
        }
      />
    </Dialog>
  )
}

// No printer glyph in the registry icon set.
function PrinterIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  )
}
