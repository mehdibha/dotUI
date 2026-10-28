import { useState } from "react"
import type { ReactNode } from "react"

import {
  Building2Icon,
  CheckIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  FileTextIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Card } from "@/registry/ui/card"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/ui/collapsible"
import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"
import { Separator } from "@/registry/ui/separator"
import { TextField } from "@/registry/ui/text-field"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { formatMoney } from "./shared"

// A Stripe-style hosted invoice: the amount due with its terms and line
// items on one card, and the payment on the other, by card or by bank
// transfer to the virtual account numbers printed on the invoice.

const INVOICE_NUMBER = "NW-2026-0142"

const LINE_ITEMS = [
  {
    id: "retainer",
    description: "Product design retainer",
    detail: "October 2026",
    quantity: 1,
    unit: 3_600,
  },
  {
    id: "research",
    description: "User research sessions",
    detail: "Moderated, 60 min",
    quantity: 6,
    unit: 180,
  },
  {
    id: "prototype",
    description: "Prototype hosting",
    detail: "Oct 1 – Oct 31",
    quantity: 1,
    unit: 120,
  },
]

const SUBTOTAL = LINE_ITEMS.reduce((sum, i) => sum + i.quantity * i.unit, 0)
const TAX = Math.round(SUBTOTAL * 0.08625 * 100) / 100
const TOTAL = SUBTOTAL + TAX

const BANK_DETAILS = [
  { label: "Bank", value: "Evergreen National Bank" },
  { label: "Routing number", value: "021000089" },
  { label: "Account number", value: "8820 4417 3391" },
  { label: "Reference", value: INVOICE_NUMBER },
]

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 py-1 text-sm compact:text-xs">
      <dt className="text-fg-muted">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-xs text-fg-muted">{label}</p>
        <p
          className={cn(
            "truncate text-sm compact:text-xs",
            /\d/.test(value) && "font-mono",
          )}
        >
          {value}
        </p>
      </div>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
        onPress={() => {
          void navigator.clipboard?.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}

function SummaryCard({ paid }: { paid: boolean }) {
  return (
    <Card className="gap-0 p-0">
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <BrandMark className="size-7">
            <span className="flex size-7 items-center justify-center rounded-(--studio-radius-item) bg-primary text-xs font-semibold text-fg-on-primary">
              N
            </span>
          </BrandMark>
          <span className="text-sm font-medium compact:text-xs">
            <BrandName>Northwind</BrandName>
          </span>
        </div>
        <p className="mt-6 text-sm text-fg-muted compact:text-xs">
          {paid ? "Invoice paid" : "Invoice"}
        </p>
        <p className="mt-1 figure text-4xl font-semibold tracking-tight">
          {formatMoney(TOTAL)}
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm compact:text-xs">
          {paid ? (
            <Badge size="sm" variant="success">
              Paid Oct 28, 2026
            </Badge>
          ) : (
            <>
              <span>Due November 15, 2026</span>
              <Badge size="sm" variant="neutral">
                Net 15
              </Badge>
            </>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            <DownloadIcon />
            Download invoice
          </Button>
          {paid && (
            <Button variant="secondary" size="sm">
              <DownloadIcon />
              Download receipt
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <dl className="px-6 py-4">
        <MetaRow label="To">
          Calloway Studio
          <span className="block text-fg-muted">erin@calloway.studio</span>
        </MetaRow>
        <MetaRow label="From">
          <BrandName>Northwind</BrandName>
          <span className="block text-fg-muted">billing@northwind.co</span>
        </MetaRow>
        <MetaRow label="Invoice">
          <span className="font-mono">{INVOICE_NUMBER}</span>
        </MetaRow>
        <MetaRow label="Memo">
          Thanks for another great month. Research notes are in the shared
          folder.
        </MetaRow>
      </dl>

      <Separator />

      <Collapsible defaultExpanded>
        <CollapsibleTrigger className="group/details flex w-full items-center justify-between px-6 py-4 text-sm font-medium compact:text-xs">
          Invoice details
          <ChevronDownIcon className="size-4 text-fg-muted transition-transform group-aria-expanded/details:rotate-180" />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div className="px-6 pb-6">
            <ul className="flex flex-col">
              {LINE_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-4 border-b py-3 text-sm first:pt-0 compact:text-xs"
                >
                  <div className="min-w-0">
                    <p>{item.description}</p>
                    <p className="text-xs text-fg-muted">
                      {item.detail}
                      {item.quantity > 1 &&
                        ` · ${item.quantity} × ${formatMoney(item.unit)}`}
                    </p>
                  </div>
                  <span className="tabular-nums">
                    {formatMoney(item.quantity * item.unit)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2 text-sm compact:text-xs">
              <div className="flex justify-between">
                <span className="text-fg-muted">Subtotal</span>
                <span className="tabular-nums">{formatMoney(SUBTOTAL)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Sales tax (8.625%)</span>
                <span className="tabular-nums">{formatMoney(TAX)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="tabular-nums">{formatMoney(TOTAL)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Amount paid</span>
                <span className="tabular-nums">
                  {formatMoney(paid ? TOTAL : 0)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Amount due</span>
                <span className="tabular-nums">
                  {formatMoney(paid ? 0 : TOTAL)}
                </span>
              </div>
            </div>
          </div>
        </CollapsiblePanel>
      </Collapsible>
    </Card>
  )
}

function PaymentCard({
  status,
  onPay,
}: {
  status: "idle" | "pending" | "paid"
  onPay: () => void
}) {
  const [method, setMethod] = useState("card")

  if (status === "paid") {
    return (
      <Card className="items-center gap-3 px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-success-muted text-fg-success">
          <CircleCheckIcon className="size-6" />
        </span>
        <h2 className="font-heading text-lg font-semibold">Payment received</h2>
        <p className="max-w-xs text-sm text-pretty text-fg-muted compact:text-xs">
          A receipt for {formatMoney(TOTAL)} is on its way to
          erin@calloway.studio. Payment ID{" "}
          <span className="font-mono">pi_3Q8xK2</span>.
        </p>
        <Button variant="secondary" size="sm" className="mt-2">
          <FileTextIcon />
          View receipt
        </Button>
      </Card>
    )
  }

  return (
    <Card className="gap-0 p-0">
      <form
        className="flex flex-col gap-5 p-6"
        onSubmit={(event) => {
          event.preventDefault()
          onPay()
        }}
      >
        <h2 className="text-base font-medium">Pay {formatMoney(TOTAL)}</h2>

        <TextField type="email" defaultValue="erin@calloway.studio">
          <Label>Email</Label>
          <Input autoComplete="email" />
        </TextField>

        <RadioGroup
          aria-label="Payment method"
          value={method}
          onChange={setMethod}
          orientation="horizontal"
          className="grid grid-cols-2 gap-2"
        >
          {[
            { id: "card", label: "Card", icon: CreditCardIcon },
            { id: "bank", label: "Bank transfer", icon: Building2Icon },
          ].map((option) => (
            <Radio key={option.id} value={option.id}>
              <RadioControl className="flex-col items-start gap-1.5">
                <option.icon className="size-4" />
                <Label>{option.label}</Label>
              </RadioControl>
            </Radio>
          ))}
        </RadioGroup>

        {method === "card" ? (
          <div key="card" className="flex flex-col gap-3">
            <TextField defaultValue="4242 4242 4242 4242">
              <Label>Card number</Label>
              <InputGroup>
                <Input inputMode="numeric" autoComplete="cc-number" />
                <InputGroupAddon>
                  <CreditCardIcon />
                </InputGroupAddon>
              </InputGroup>
            </TextField>
            <div className="grid grid-cols-2 gap-3">
              <TextField defaultValue="04 / 29">
                <Label>Expiration</Label>
                <Input autoComplete="cc-exp" placeholder="MM / YY" />
              </TextField>
              <TextField defaultValue="424">
                <Label>Security code</Label>
                <Input inputMode="numeric" autoComplete="cc-csc" />
              </TextField>
            </div>
            <TextField defaultValue="Erin Calloway">
              <Label>Name on card</Label>
              <Input autoComplete="cc-name" />
            </TextField>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="mt-2 w-full"
              isPending={status === "pending"}
            >
              {status === "pending"
                ? "Processing…"
                : `Pay ${formatMoney(TOTAL)}`}
            </Button>
          </div>
        ) : (
          <div key="bank" className="flex flex-col gap-3">
            <p className="text-sm text-pretty text-fg-muted compact:text-xs">
              Send {formatMoney(TOTAL)} from your bank to the account below.
              Include the reference so the payment is matched to this invoice.
            </p>
            <div className="divide-y rounded-(--studio-radius-card) border px-4">
              {BANK_DETAILS.map((detail) => (
                <CopyRow key={detail.label} {...detail} />
              ))}
            </div>
            <p className="text-xs text-fg-muted">
              ACH arrives in 1–3 business days, wires the same day. We'll email
              you when it lands.
            </p>
          </div>
        )}
      </form>
    </Card>
  )
}

export default function InvoiceBlock() {
  const [status, setStatus] = useState<"idle" | "pending" | "paid">("idle")

  return (
    <div className="min-h-svh bg-muted/40 text-fg">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-14">
        <div
          className={cn(
            "grid items-start gap-6",
            "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]",
          )}
        >
          <SummaryCard paid={status === "paid"} />
          <PaymentCard
            status={status}
            onPay={() => {
              setStatus("pending")
              setTimeout(() => setStatus("paid"), 1400)
            }}
          />
        </div>
        <p className="text-center text-xs text-fg-muted">
          Questions about this invoice? Contact <BrandName>Northwind</BrandName>{" "}
          at billing@northwind.co or +1 (415) 555-0142.
        </p>
      </div>
    </div>
  )
}
