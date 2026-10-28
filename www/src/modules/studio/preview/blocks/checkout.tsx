import { useState } from "react"

import {
  ArrowLeftIcon,
  BoxesIcon,
  Building2Icon,
  CheckIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  CreditCardIcon,
  DownloadIcon,
  LifeBuoyIcon,
  TagIcon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { Description, FieldContent, Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import { Switch, SwitchControl, SwitchIndicator } from "@/registry/ui/switch"
import { TextField } from "@/registry/ui/text-field"
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { formatMoney } from "./shared"

// A Stripe Checkout-style subscription page: the order on the left with a
// seat picker, an annual-billing upsell and a promotion code; the payment
// form on the right with express pay, method tiles and a confirmed state.

const SEAT_PRICE = { monthly: 12, annual: 10 }
const SUPPORT_PRICE = { monthly: 20, annual: 16 }
const TAX_RATE = 0.08
const PROMO_OFF = 0.2

const COUNTRIES = [
  { id: "us", name: "United States" },
  { id: "ca", name: "Canada" },
  { id: "gb", name: "United Kingdom" },
  { id: "de", name: "Germany" },
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
]

function ItemTile({ icon: Icon }: { icon: typeof BoxesIcon }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-(--studio-radius-item) border bg-muted text-fg-muted">
      <Icon className="size-4" />
    </span>
  )
}

function SummaryRow({
  label,
  value,
  muted,
  strong,
}: {
  label: React.ReactNode
  value: string
  muted?: boolean
  strong?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 text-sm compact:text-xs",
        muted && "text-fg-muted",
        strong && "font-medium",
      )}
    >
      <span className="flex items-center gap-2">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

export default function CheckoutBlock() {
  const [seats, setSeats] = useState(4)
  const [annual, setAnnual] = useState(false)
  const [support, setSupport] = useState(true)
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoDraft, setPromoDraft] = useState("")
  const [promo, setPromo] = useState<string | null>(null)
  const [method, setMethod] = useState("card")
  const [showDetails, setShowDetails] = useState(false)
  const [status, setStatus] = useState<"idle" | "pending" | "paid">("idle")

  const period = annual ? "annual" : "monthly"
  const months = annual ? 12 : 1
  const seatsTotal = seats * SEAT_PRICE[period] * months
  const supportTotal = support ? SUPPORT_PRICE[period] * months : 0
  const subtotal = seatsTotal + supportTotal
  const discount = promo ? subtotal * PROMO_OFF : 0
  const tax = (subtotal - discount) * TAX_RATE
  const total = subtotal - discount + tax
  const annualSavings =
    (seats * (SEAT_PRICE.monthly - SEAT_PRICE.annual) +
      (support ? SUPPORT_PRICE.monthly - SUPPORT_PRICE.annual : 0)) *
    12
  const per = annual ? "per year" : "per month"

  const applyPromo = () => {
    const code = promoDraft.trim().toUpperCase()
    if (!code) return
    setPromo(code)
    setPromoOpen(false)
    setPromoDraft("")
  }

  const pay = () => {
    setStatus("pending")
    setTimeout(() => setStatus("paid"), 1400)
  }

  return (
    <div className="min-h-svh bg-bg text-fg lg:grid lg:grid-cols-2">
      {/* Order summary */}
      <section
        aria-label="Order summary"
        className="px-4 pt-6 pb-8 sm:px-8 lg:flex lg:justify-end lg:px-16 lg:pt-16"
      >
        <div className="w-full lg:max-w-md">
          <div className="flex items-center gap-3">
            <Button variant="quiet" size="sm" isIconOnly aria-label="Back">
              <ArrowLeftIcon />
            </Button>
            <BrandMark className="size-7">
              <span className="flex size-7 items-center justify-center rounded-(--studio-radius-item) bg-primary text-xs font-semibold text-fg-on-primary">
                N
              </span>
            </BrandMark>
            <span className="text-sm font-medium compact:text-xs">
              <BrandName>Northwind</BrandName>
            </span>
            <Badge size="sm" variant="warning">
              Test mode
            </Badge>
          </div>

          <div className="mt-8 lg:mt-10">
            <p className="text-sm text-fg-muted compact:text-xs">
              Subscribe to <BrandName>Northwind</BrandName> Pro
            </p>
            <div className="mt-1 flex items-end gap-2">
              <span className="figure text-4xl font-semibold tracking-tight">
                {formatMoney(total)}
              </span>
              <span className="pb-1 text-sm leading-tight text-fg-muted compact:text-xs">
                {per}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 lg:hidden"
              onPress={() => setShowDetails((open) => !open)}
            >
              {showDetails ? "Hide details" : "View details"}
              <ChevronDownIcon
                className={cn(
                  "transition-transform",
                  showDetails && "rotate-180",
                )}
              />
            </Button>
          </div>

          <div
            className={cn(
              "mt-8 flex flex-col gap-5 lg:mt-10",
              !showDetails && "max-lg:hidden",
            )}
          >
            <div className="flex gap-3">
              <ItemTile icon={BoxesIcon} />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-4 text-sm font-medium compact:text-xs">
                  <span>
                    <BrandName>Northwind</BrandName> Pro
                  </span>
                  <span className="tabular-nums">
                    {formatMoney(seatsTotal)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-4 text-xs text-fg-muted">
                  <span>Billed {annual ? "annually" : "monthly"}</span>
                  <span className="tabular-nums">
                    {formatMoney(SEAT_PRICE[period] * months)} each
                  </span>
                </div>
                <Menu>
                  <Button variant="secondary" size="xs" className="mt-2">
                    Qty {seats}
                    <ChevronDownIcon />
                  </Button>
                  <Popover placement="bottom start">
                    <MenuContent
                      aria-label="Seats"
                      selectionMode="single"
                      selectedKeys={[String(seats)]}
                      onAction={(key) => setSeats(Number(key))}
                    >
                      {[1, 2, 3, 4, 5, 8, 10, 15].map((n) => (
                        <MenuItem key={n} id={String(n)}>
                          {n} {n === 1 ? "seat" : "seats"}
                        </MenuItem>
                      ))}
                    </MenuContent>
                  </Popover>
                </Menu>
              </div>
            </div>

            <div className="flex gap-3">
              <ItemTile icon={LifeBuoyIcon} />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-4 text-sm font-medium compact:text-xs">
                  <span className={cn(!support && "text-fg-muted")}>
                    Priority support
                  </span>
                  <span
                    className={cn("tabular-nums", !support && "text-fg-muted")}
                  >
                    {support
                      ? formatMoney(supportTotal)
                      : formatMoney(SUPPORT_PRICE[period] * months)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-4 text-xs text-fg-muted">
                  <span>4-hour response, shared Slack channel</span>
                  <Button
                    variant="link"
                    size="xs"
                    className="h-auto px-0"
                    onPress={() => setSupport((on) => !on)}
                  >
                    {support ? "Remove" : "Add"}
                  </Button>
                </div>
              </div>
            </div>

            <Switch
              isSelected={annual}
              onChange={setAnnual}
              className="items-start rounded-(--studio-radius-card) border p-3"
            >
              <SwitchControl>
                <SwitchIndicator />
              </SwitchControl>
              <FieldContent>
                <Label className="flex flex-wrap items-center gap-2">
                  Save with annual billing
                  <Badge size="sm" variant="success">
                    Save {formatMoney(annualSavings, { digits: 0 })}
                  </Badge>
                </Label>
                <Description>
                  {formatMoney(
                    seats * SEAT_PRICE.annual +
                      (support ? SUPPORT_PRICE.annual : 0),
                  )}
                  /month, billed yearly
                </Description>
              </FieldContent>
            </Switch>

            <Separator />

            <div className="flex flex-col gap-3">
              <SummaryRow label="Subtotal" value={formatMoney(subtotal)} />
              {promo ? (
                <SummaryRow
                  label={
                    <>
                      <Badge size="sm" variant="neutral">
                        <TagIcon />
                        {promo}
                        <button
                          type="button"
                          aria-label="Remove promotion code"
                          className="-mr-1 flex cursor-interactive text-fg-muted hover:text-fg"
                          onClick={() => setPromo(null)}
                        >
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                      <span className="text-fg-muted">20% off</span>
                    </>
                  }
                  value={`−${formatMoney(discount)}`}
                />
              ) : promoOpen ? (
                <TextField
                  aria-label="Promotion code"
                  autoFocus
                  value={promoDraft}
                  onChange={setPromoDraft}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") applyPromo()
                    if (event.key === "Escape") setPromoOpen(false)
                  }}
                >
                  <InputGroup>
                    <Input placeholder="Promotion code" />
                    <InputGroupAddon>
                      <Button
                        variant="quiet"
                        size="xs"
                        isDisabled={!promoDraft.trim()}
                        onPress={applyPromo}
                      >
                        Apply
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </TextField>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  className="self-start"
                  onPress={() => setPromoOpen(true)}
                >
                  Add promotion code
                </Button>
              )}
              <SummaryRow
                label="Sales tax (8%)"
                value={formatMoney(tax)}
                muted
              />
              <Separator />
              <SummaryRow
                label="Total due today"
                value={formatMoney(total)}
                strong
              />
            </div>
          </div>
        </div>
      </section>

      {/* Payment */}
      <section
        aria-label="Payment"
        className="border-t px-4 py-8 sm:px-8 lg:flex lg:border-t-0 lg:border-l lg:px-16 lg:pt-16"
      >
        <div className="w-full lg:max-w-md">
          {status === "paid" ? (
            <div className="flex flex-col items-start gap-4 pt-4">
              <span className="flex size-12 items-center justify-center rounded-full bg-success-muted text-fg-success">
                <CircleCheckIcon className="size-6" />
              </span>
              <div>
                <h1 className="font-heading text-xl font-semibold">
                  You're subscribed to <BrandName>Northwind</BrandName> Pro
                </h1>
                <p className="mt-1 text-sm text-fg-muted compact:text-xs">
                  We emailed a receipt for {formatMoney(total)} to
                  erin@calloway.studio. Your {seats} seats are ready to use.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Go to dashboard</Button>
                <Button variant="secondary">
                  <DownloadIcon />
                  Download invoice
                </Button>
              </div>
            </div>
          ) : (
            <form
              className="flex flex-col gap-6"
              onSubmit={(event) => {
                event.preventDefault()
                pay()
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" className="w-full">
                  Apple Pay
                </Button>
                <Button variant="secondary" className="w-full">
                  Google Pay
                </Button>
              </div>
              <div className="flex items-center gap-3 text-xs text-fg-muted">
                <Separator className="flex-1" />
                Or pay another way
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-base font-medium">Contact information</h2>
                <TextField type="email" defaultValue="erin@calloway.studio">
                  <Label>Email</Label>
                  <Input autoComplete="email" />
                </TextField>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-base font-medium">Payment method</h2>
                <RadioGroup
                  aria-label="Payment method"
                  value={method}
                  onChange={setMethod}
                  orientation="horizontal"
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { id: "card", label: "Card", icon: CreditCardIcon },
                    { id: "bank", label: "Bank account", icon: Building2Icon },
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
                        <Input
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="1234 1234 1234 1234"
                        />
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
                        <Input
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder="CVC"
                        />
                      </TextField>
                    </div>
                    <TextField defaultValue="Erin Calloway">
                      <Label>Cardholder name</Label>
                      <Input autoComplete="cc-name" />
                    </TextField>
                    <div className="grid grid-cols-2 gap-3">
                      <Select defaultValue="us" className="w-full">
                        <Label>Country</Label>
                        <SelectTrigger className="w-full" />
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.id} id={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <TextField defaultValue="94107">
                        <Label>ZIP</Label>
                        <Input autoComplete="postal-code" />
                      </TextField>
                    </div>
                  </div>
                ) : (
                  <div key="bank" className="flex flex-col gap-3">
                    <TextField>
                      <Label>Search for your bank</Label>
                      <Input placeholder="Bank name" />
                    </TextField>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "First Harbor",
                        "Summit Credit Union",
                        "Pioneer Trust",
                        "Coastal National",
                      ].map((bank) => (
                        <Button
                          key={bank}
                          variant="secondary"
                          size="sm"
                          className="justify-start"
                        >
                          <Building2Icon />
                          {bank}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-fg-muted">
                      Connect your account instantly, or enter routing and
                      account numbers by hand. Bank payments settle in 4
                      business days.
                    </p>
                  </div>
                )}
              </div>

              <Checkbox defaultSelected>
                <CheckboxControl />
                <FieldContent>
                  <Label>Save my information for faster checkout</Label>
                  <Description>
                    Pay in one click here and at other stores that use this
                    checkout.
                  </Description>
                </FieldContent>
              </Checkbox>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isPending={status === "pending"}
                >
                  {status === "pending" ? "Processing…" : "Subscribe"}
                </Button>
                <p className="text-center text-xs text-pretty text-fg-muted">
                  By subscribing, you allow <BrandName>Northwind</BrandName> to
                  charge {formatMoney(total)} {per} until you cancel. You can
                  cancel anytime from your billing settings.
                </p>
              </div>
            </form>
          )}
          <div className="mt-10 flex items-center justify-center gap-3 text-xs text-fg-muted lg:justify-start">
            <CheckIcon className="size-3.5" />
            Secure, encrypted payment
            <span aria-hidden>·</span>
            <a href="#" className="hover:text-fg">
              Terms
            </a>
            <a href="#" className="hover:text-fg">
              Privacy
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
