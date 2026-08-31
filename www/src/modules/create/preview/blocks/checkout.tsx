"use client"

import { useState } from "react"

import {
  BoxIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  ImageIcon,
  InfoIcon,
  MailIcon,
  MapIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TagIcon,
  TimerIcon,
  ZapIcon,
} from "@/registry/icons"
import { Badge } from "@/registry/ui/badge"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/ui/breadcrumbs"
import { Button } from "@/registry/ui/button"
import { Card, CardContent } from "@/registry/ui/card"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/registry/ui/disclosure"
import {
  Description,
  FieldContent,
  FieldError,
  FieldGroup,
  Label,
} from "@/registry/ui/field"
import { Group } from "@/registry/ui/group"
import {
  Input,
  InputGroup,
  InputGroupAddon,
  TextArea,
} from "@/registry/ui/input"
import { Modal } from "@/registry/ui/modal"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { TextField } from "@/registry/ui/text-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const money = (value: number) => currency.format(value)

const LINE_ITEMS = [
  {
    id: "merino-crew",
    name: "Alder Merino Crew",
    variant: "Slate · Medium",
    price: 128,
    quantity: 1,
  },
  {
    id: "rain-shell",
    name: "Fjord 3L Rain Shell",
    variant: "Ember · Large",
    price: 245,
    quantity: 1,
  },
  {
    id: "wool-socks",
    name: "Trailhead Wool Socks",
    variant: "Charcoal · 2-pack",
    price: 28,
    quantity: 2,
  },
]

const SHIPPING_METHODS = [
  {
    id: "standard",
    name: "Standard",
    eta: "Arrives Aug 28 – Sep 1",
    price: 0,
    icon: BoxIcon,
  },
  {
    id: "express",
    name: "Express",
    eta: "Arrives Aug 26 – Aug 27",
    price: 12,
    icon: ZapIcon,
  },
  {
    id: "overnight",
    name: "Overnight",
    eta: "Arrives Aug 25 before 12 PM",
    price: 28,
    icon: TimerIcon,
  },
]

const COUNTRIES = [
  { id: "us", name: "United States" },
  { id: "ca", name: "Canada" },
  { id: "uk", name: "United Kingdom" },
  { id: "de", name: "Germany" },
  { id: "jp", name: "Japan" },
]

const STATES = [
  { id: "co", name: "Colorado" },
  { id: "ca", name: "California" },
  { id: "ny", name: "New York" },
  { id: "or", name: "Oregon" },
  { id: "wa", name: "Washington" },
]

const PROMO_CODE = "TRAILHEAD15"
const PROMO_RATE = 0.15
const TAX_RATE = 0.0875

export default function Checkout() {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(LINE_ITEMS.map((item) => [item.id, item.quantity])),
  )
  const [shipping, setShipping] = useState("express")
  const [promoDraft, setPromoDraft] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [billingSame, setBillingSame] = useState(true)

  const subtotal = LINE_ITEMS.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] ?? 1),
    0,
  )
  const shippingMethod =
    SHIPPING_METHODS.find((method) => method.id === shipping) ??
    SHIPPING_METHODS[0]!
  const discount = appliedPromo ? subtotal * PROMO_RATE : 0
  const tax = (subtotal - discount) * TAX_RATE
  const total = subtotal - discount + shippingMethod.price + tax
  const itemCount = LINE_ITEMS.reduce(
    (sum, item) => sum + (quantities[item.id] ?? 1),
    0,
  )

  function applyPromo() {
    const code = promoDraft.trim().toUpperCase()
    if (code !== PROMO_CODE) {
      setPromoError(`${code || "That code"} isn't valid for this order.`)
      return
    }
    setAppliedPromo(code)
    setPromoDraft("")
    setPromoError(null)
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-fg font-heading text-sm font-semibold text-bg">
              H
            </span>
            <span className="truncate font-heading text-sm font-medium tracking-tight">
              Halden Supply Co.
            </span>
          </div>
          <Breadcrumbs className="mx-auto max-md:hidden">
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Cart</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Information</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Payment</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumbs>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <span className="flex items-center gap-1.5 text-xs text-fg-muted max-sm:hidden">
              <ShieldCheckIcon className="size-3.5" />
              Secure checkout
            </span>
            <Button variant="quiet" size="sm" className="gap-2">
              <ShoppingBagIcon data-icon-start="" />
              <span className="tabular-nums">{itemCount}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <div className="min-w-0 space-y-10">
            <Section
              step="1"
              title="Contact"
              description="Order updates and the receipt go here."
              action={
                <Button variant="link" size="sm">
                  Sign in
                </Button>
              }
            >
              <TextField
                type="email"
                defaultValue="erin.calloway@fastmail.com"
                isRequired
              >
                <Label>Email address</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                  <Input placeholder="you@example.com" autoComplete="email" />
                </InputGroup>
              </TextField>
              <Checkbox defaultSelected>
                Email me about new arrivals and field notes
              </Checkbox>
            </Section>

            <Section
              step="2"
              title="Shipping address"
              description="Where should we send this order?"
            >
              <Select defaultValue="us" className="w-full">
                <Label>Country or region</Label>
                <SelectTrigger className="w-full" />
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.id} id={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField defaultValue="Erin" isRequired>
                  <Label>First name</Label>
                  <Input autoComplete="given-name" />
                </TextField>
                <TextField defaultValue="Calloway" isRequired>
                  <Label>Last name</Label>
                  <Input autoComplete="family-name" />
                </TextField>
              </div>

              <TextField defaultValue="1140 Alpine Meadow Rd" isRequired>
                <Label>Street address</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <MapIcon />
                  </InputGroupAddon>
                  <Input
                    placeholder="Start typing an address"
                    autoComplete="address-line1"
                  />
                </InputGroup>
                <Description>We'll suggest matches as you type.</Description>
              </TextField>

              <TextField>
                <Label>Apartment, suite, unit</Label>
                <InputGroup>
                  <Input autoComplete="address-line2" />
                  <InputGroupAddon>Optional</InputGroupAddon>
                </InputGroup>
              </TextField>

              <div className="grid gap-4 sm:grid-cols-3">
                <TextField defaultValue="Boulder" isRequired>
                  <Label>City</Label>
                  <Input autoComplete="address-level2" />
                </TextField>
                <Select defaultValue="co" className="w-full">
                  <Label>State</Label>
                  <SelectTrigger className="w-full" />
                  <SelectContent>
                    {STATES.map((state) => (
                      <SelectItem key={state.id} id={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TextField defaultValue="80302" isRequired>
                  <Label>ZIP code</Label>
                  <Input inputMode="numeric" autoComplete="postal-code" />
                </TextField>
              </div>

              <TextField defaultValue="(303) 555-0148" type="tel">
                <Label>Phone</Label>
                <InputGroup>
                  <Input autoComplete="tel" />
                  <InputGroupAddon>
                    <Tooltip>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label="Why we ask for a phone number"
                      >
                        <InfoIcon />
                      </Button>
                      <TooltipContent>
                        Only used for delivery updates
                      </TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroup>
              </TextField>

              <Checkbox defaultSelected>
                Save this address for next time
              </Checkbox>
            </Section>

            <Section
              step="3"
              title="Shipping method"
              description="Rates are calculated for Boulder, CO."
            >
              <RadioGroup
                aria-label="Shipping method"
                value={shipping}
                onChange={setShipping}
              >
                <FieldGroup>
                  {SHIPPING_METHODS.map((method) => {
                    const Icon = method.icon
                    return (
                      <Radio key={method.id} value={method.id}>
                        <RadioControl>
                          <RadioIndicator />
                          <Icon className="mt-0.5 size-4 shrink-0 text-fg-muted" />
                          <FieldContent>
                            <Label>{method.name}</Label>
                            <Description>{method.eta}</Description>
                          </FieldContent>
                          <span className="ml-auto self-center text-sm font-medium tabular-nums">
                            {method.price === 0 ? "Free" : money(method.price)}
                          </span>
                        </RadioControl>
                      </Radio>
                    )
                  })}
                </FieldGroup>
              </RadioGroup>

              <Disclosure>
                <DisclosureTrigger>Add delivery instructions</DisclosureTrigger>
                <DisclosurePanel>
                  <TextField aria-label="Delivery instructions">
                    <TextArea placeholder="Gate code, safe drop spot, anything the courier should know…" />
                  </TextField>
                </DisclosurePanel>
              </Disclosure>
            </Section>

            <Section
              step="4"
              title="Payment"
              description="All transactions are encrypted end to end."
            >
              <TextField defaultValue="4242 4242 4242 4242" isRequired>
                <Label>Card number</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <CreditCardIcon />
                  </InputGroupAddon>
                  <Input
                    inputMode="numeric"
                    placeholder="1234 1234 1234 1234"
                    autoComplete="cc-number"
                  />
                  <InputGroupAddon>
                    <Badge size="sm">VISA</Badge>
                  </InputGroupAddon>
                </InputGroup>
              </TextField>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField defaultValue="04 / 28" isRequired>
                  <Label>Expiration</Label>
                  <Input
                    inputMode="numeric"
                    placeholder="MM / YY"
                    autoComplete="cc-exp"
                  />
                </TextField>
                <TextField defaultValue="812" isRequired>
                  <Label>Security code</Label>
                  <InputGroup>
                    <Input
                      inputMode="numeric"
                      placeholder="CVC"
                      autoComplete="cc-csc"
                    />
                    <InputGroupAddon>
                      <Tooltip>
                        <Button
                          variant="quiet"
                          size="sm"
                          isIconOnly
                          aria-label="Where to find the security code"
                        >
                          <InfoIcon />
                        </Button>
                        <TooltipContent>
                          3 digits on the back of the card
                        </TooltipContent>
                      </Tooltip>
                    </InputGroupAddon>
                  </InputGroup>
                </TextField>
              </div>

              <TextField defaultValue="Erin Calloway" isRequired>
                <Label>Name on card</Label>
                <Input autoComplete="cc-name" />
              </TextField>

              <Checkbox isSelected={billingSame} onChange={setBillingSame}>
                Billing address is the same as shipping
              </Checkbox>

              {!billingSame && (
                <div className="space-y-4 rounded-lg border bg-muted p-4">
                  <Select defaultValue="us" className="w-full">
                    <Label>Country or region</Label>
                    <SelectTrigger className="w-full" />
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.id} id={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <TextField>
                    <Label>Street address</Label>
                    <Input
                      placeholder="Billing street address"
                      autoComplete="billing address-line1"
                    />
                  </TextField>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField>
                      <Label>City</Label>
                      <Input autoComplete="billing address-level2" />
                    </TextField>
                    <TextField>
                      <Label>ZIP code</Label>
                      <Input
                        inputMode="numeric"
                        autoComplete="billing postal-code"
                      />
                    </TextField>
                  </div>
                </div>
              )}
            </Section>
          </div>

          <div className="min-w-0">
            <div className="lg:sticky lg:top-20">
              <Card>
                <CardContent className="space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-heading text-base font-medium">
                      Order summary
                    </h2>
                    <Badge appearance="subtle" variant="accent">
                      {itemCount} items
                    </Badge>
                  </div>

                  <ul className="space-y-4">
                    {LINE_ITEMS.map((item) => (
                      <li key={item.id} className="flex gap-3">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-md border bg-muted">
                          <ImageIcon className="size-5 text-fg-muted" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <div className="flex min-w-0 items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {item.name}
                              </p>
                              <p className="truncate text-xs text-fg-muted">
                                {item.variant}
                              </p>
                            </div>
                            <span className="shrink-0 text-sm font-medium tabular-nums">
                              {money(item.price * (quantities[item.id] ?? 0))}
                            </span>
                          </div>
                          <NumberField
                            aria-label={`Quantity, ${item.name}`}
                            value={quantities[item.id] ?? 1}
                            // Clearing the input commits NaN; keep the last
                            // quantity so the totals never read "$NaN".
                            onChange={(value) =>
                              setQuantities((prev) =>
                                Number.isNaN(value)
                                  ? prev
                                  : { ...prev, [item.id]: value },
                              )
                            }
                            minValue={1}
                            maxValue={9}
                            className="w-fit"
                          >
                            <Group>
                              <NumberFieldDecrement size="sm" />
                              <Input
                                size="sm"
                                className="w-9 text-center tabular-nums"
                              />
                              <NumberFieldIncrement size="sm" />
                            </Group>
                          </NumberField>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Separator />

                  <div className="space-y-2">
                    <TextField
                      aria-label="Discount code"
                      value={promoDraft}
                      onChange={(value) => {
                        setPromoDraft(value)
                        setPromoError(null)
                      }}
                      isInvalid={promoError !== null}
                    >
                      <InputGroup>
                        <InputGroupAddon>
                          <TagIcon />
                        </InputGroupAddon>
                        <Input placeholder="Discount code" />
                        <InputGroupAddon>
                          <Button
                            size="sm"
                            onPress={applyPromo}
                            isDisabled={promoDraft.trim().length === 0}
                          >
                            Apply
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldError>{promoError}</FieldError>
                    </TextField>
                    {appliedPromo && (
                      <TagGroup
                        size="sm"
                        onRemove={() => setAppliedPromo(null)}
                        aria-label="Applied discounts"
                      >
                        <TagList>
                          <Tag id={appliedPromo}>
                            {`${appliedPromo} · ${PROMO_RATE * 100}% off`}
                          </Tag>
                        </TagList>
                      </TagGroup>
                    )}
                  </div>

                  <Separator />

                  <dl className="space-y-2 text-sm">
                    <SummaryRow label="Subtotal" value={money(subtotal)} />
                    {appliedPromo && (
                      <SummaryRow
                        label="Discount"
                        value={`−${money(discount)}`}
                        tone="success"
                      />
                    )}
                    <SummaryRow
                      label={`Shipping · ${shippingMethod.name}`}
                      value={
                        shippingMethod.price === 0
                          ? "Free"
                          : money(shippingMethod.price)
                      }
                    />
                    <SummaryRow label="Estimated tax" value={money(tax)} />
                  </dl>

                  <Separator />

                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-heading text-base font-medium">
                      Total
                    </span>
                    <span className="flex items-baseline gap-1.5">
                      <span className="text-xs text-fg-muted">USD</span>
                      <span className="font-heading text-xl font-semibold tabular-nums">
                        {money(total)}
                      </span>
                    </span>
                  </div>

                  <Dialog>
                    <Button variant="primary" size="lg" className="w-full">
                      <ShieldCheckIcon data-icon-start="" />
                      Place order
                    </Button>
                    <Modal className="max-w-sm">
                      <DialogContent>
                        <DialogHeader>
                          <span className="flex size-9 items-center justify-center rounded-full bg-success-muted text-fg-success">
                            <CheckCircle2Icon className="size-5" />
                          </span>
                          <DialogTitle>Order confirmed</DialogTitle>
                          <DialogDescription>
                            Order #HS-48127 for {money(total)} is on its way to
                            Boulder, CO.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogBody>
                          <dl className="space-y-2 text-sm">
                            <SummaryRow
                              label="Shipping"
                              value={shippingMethod.name}
                            />
                            <SummaryRow
                              label="Estimated arrival"
                              value={shippingMethod.eta.replace("Arrives ", "")}
                            />
                            <SummaryRow
                              label="Receipt sent to"
                              value="erin.calloway@fastmail.com"
                            />
                          </dl>
                        </DialogBody>
                        <DialogFooter>
                          <Button slot="close">Keep shopping</Button>
                          <Button slot="close" variant="primary">
                            Track order
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Modal>
                  </Dialog>

                  <p className="flex items-start gap-2 text-xs text-fg-muted">
                    <ShieldCheckIcon className="mt-px size-3.5 shrink-0" />
                    Free 60-day returns on everything. Your card is charged when
                    the order ships.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Section({
  step,
  title,
  description,
  action,
  children,
}: {
  step: string
  title: string
  description: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral text-xs font-medium text-fg-on-neutral tabular-nums">
          {step}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-base font-medium">{title}</h2>
          <p className="text-sm text-fg-muted">{description}</p>
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: "success"
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="min-w-0 truncate text-fg-muted">{label}</dt>
      <dd
        className={
          tone === "success"
            ? "shrink-0 font-medium text-fg-success tabular-nums"
            : "shrink-0 font-medium tabular-nums"
        }
      >
        {value}
      </dd>
    </div>
  )
}
