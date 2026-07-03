'use client'

import { useState } from 'react'
import { BitcoinIcon, CreditCardIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Card, CardContent } from '@/registry/ui/card'
import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from '@/registry/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'
import { Separator } from '@/registry/ui/separator'
import { TextField } from '@/registry/ui/text-field'

const inputClassName =
  'h-9 min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted'

// Each segment of the joined card field: lifts above the dividers and shows its
// own focus ring on focus, instead of ringing the whole group.
const segmentClassName =
  'relative flex items-center px-3 focus-within:z-10 focus-within:rounded-(--input-radius) focus-within:border-transparent focus-within:bg-field focus-within:ring-2 focus-within:ring-border-focus'

// The whole row (radio dot + icon + label) is one click target: nesting them
// inside RadioControl (rather than as siblings) makes its native label wrap
// all three. Overrides the registry's bordered/tinted "radio card" look —
// this picker only wants a subtle hover background, no persistent selected fill.
const methodControlClassName =
  'has-data-label:border-transparent has-data-label:selected:border-transparent has-data-label:selected:bg-transparent hover:bg-muted'

export function Payment({ className, ...props }: React.ComponentProps<'div'>) {
  const [method, setMethod] = useState('card')
  const [announcement, setAnnouncement] = useState('')

  return (
    <Card className={cn(className)} {...props}>
      <CardContent>
        <RadioGroup
          aria-label="Payment method"
          value={method}
          onChange={(value) => {
            setMethod(value)
            // Screen readers don't announce the panel mounting on its own;
            // the live region below queues a summary after the radio's own
            // "checked" announcement.
            setAnnouncement(
              value === 'card'
                ? 'Card details form expanded'
                : value === 'crypto'
                  ? 'Crypto payment details expanded'
                  : value === 'apple-pay'
                    ? 'Apple Pay button expanded'
                    : '',
            )
          }}
          className="gap-0"
        >
          <Radio value="card">
            <RadioControl className={methodControlClassName}>
              <RadioIndicator />
              <CreditCardIcon aria-hidden className="size-4.5" />
              <Label>Card</Label>
            </RadioControl>
          </Radio>

          {/* The panel is a sibling of the radio, never a child: it holds
              interactive fields, and sitting right after the radio in DOM
              order lets Tab flow from the checked radio into the form. */}
          <MethodPanel expanded={method === 'card'}>
            <div className="space-y-4 pt-4 pb-1">
              <div
                role="group"
                aria-label="Card information"
                className="space-y-1.5"
              >
                <Label>Card information</Label>
                {/* Joined field: card number on top, expiry / CVC below, sharing one
                    border with gap-0 dividers — the Stripe-style combined card input.
                    Each segment rings on its own focus (z-10 lifts it above the
                    dividers) rather than ringing the whole group. */}
                <div className="relative rounded-(--input-radius) border border-border-field bg-field text-fg">
                  <label
                    className={cn(
                      segmentClassName,
                      'gap-2 rounded-t-(--input-radius)',
                    )}
                  >
                    <input
                      aria-label="Card number"
                      inputMode="numeric"
                      placeholder="1234 1234 1234 1234"
                      defaultValue="4242 4242 4242 4242"
                      className={inputClassName}
                    />
                    <span aria-hidden="true" className="flex shrink-0 gap-1">
                      <VisaBadge />
                      <MastercardBadge />
                    </span>
                  </label>
                  <div className="grid grid-cols-2">
                    <label
                      className={cn(
                        segmentClassName,
                        'rounded-bl-(--input-radius) border-t border-border-field',
                      )}
                    >
                      <input
                        aria-label="Expiration date"
                        inputMode="numeric"
                        placeholder="MM / YY"
                        defaultValue="04 / 28"
                        className={inputClassName}
                      />
                    </label>
                    <label
                      className={cn(
                        segmentClassName,
                        'gap-2 rounded-br-(--input-radius) border-t border-l border-border-field',
                      )}
                    >
                      <input
                        aria-label="Security code"
                        inputMode="numeric"
                        placeholder="CVC"
                        defaultValue="123"
                        className={inputClassName}
                      />
                      <CvcIcon />
                    </label>
                  </div>
                </div>
              </div>

              <TextField defaultValue="Jane Cooper">
                <Label>Cardholder name</Label>
                <Input placeholder="Full name on card" />
              </TextField>

              <Select defaultValue="fr">
                <Label>Country or region</Label>
                <SelectTrigger className="w-full" />
                <SelectContent>
                  <SelectItem id="fr">France</SelectItem>
                  <SelectItem id="us">United States</SelectItem>
                  <SelectItem id="de">Germany</SelectItem>
                  <SelectItem id="uk">United Kingdom</SelectItem>
                  <SelectItem id="jp">Japan</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-3 pt-1">
                <Checkbox>I'm purchasing as a business</Checkbox>
                <Checkbox>
                  <CheckboxControl />
                  <Label>
                    Save my information with{' '}
                    <span className="underline decoration-dotted underline-offset-3">
                      Link
                    </span>{' '}
                    for faster checkout
                  </Label>
                </Checkbox>
              </div>
            </div>
          </MethodPanel>

          <Separator className="my-3.5" />

          <Radio value="apple-pay">
            <RadioControl className={methodControlClassName}>
              <RadioIndicator />
              <ApplePayBadge />
              <Label>Apple Pay</Label>
            </RadioControl>
          </Radio>

          <MethodPanel expanded={method === 'apple-pay'}>
            <div className="pt-4 pb-1">
              <ApplePayButton />
            </div>
          </MethodPanel>

          <Separator className="my-3.5" />

          <Radio value="crypto">
            <RadioControl className={methodControlClassName}>
              <RadioIndicator />
              <BitcoinIcon aria-hidden className="size-4.5" />
              <Label>Crypto</Label>
            </RadioControl>
          </Radio>

          <MethodPanel expanded={method === 'crypto'}>
            <div className="space-y-4 pt-4 pb-1">
              <TextField>
                <Label>Name</Label>
                <Input />
              </TextField>

              <div
                role="group"
                aria-label="Billing address"
                className="space-y-1.5"
              >
                <Label>Billing address</Label>
                {/* Same joined-field pattern as the card information group:
                    country select on top, address rows below, one shared border. */}
                <div className="relative rounded-(--input-radius) border border-border-field bg-field text-fg">
                  <Select
                    defaultValue="fr"
                    aria-label="Country or region"
                    className="w-full"
                  >
                    <SelectTrigger
                      variant="quiet"
                      className="h-9 w-full rounded-(--input-radius) rounded-b-none px-3 font-normal hover:bg-transparent pressed:bg-transparent"
                    />
                    <SelectContent>
                      <SelectItem id="fr">France</SelectItem>
                      <SelectItem id="us">United States</SelectItem>
                      <SelectItem id="de">Germany</SelectItem>
                      <SelectItem id="uk">United Kingdom</SelectItem>
                      <SelectItem id="jp">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                  <label
                    className={cn(
                      segmentClassName,
                      'border-t border-border-field',
                    )}
                  >
                    <input
                      aria-label="Address line 1"
                      placeholder="Address line 1"
                      className={inputClassName}
                    />
                  </label>
                  <label
                    className={cn(
                      segmentClassName,
                      'border-t border-border-field',
                    )}
                  >
                    <input
                      aria-label="Address line 2"
                      placeholder="Address line 2"
                      className={inputClassName}
                    />
                  </label>
                  <div className="grid grid-cols-2">
                    <label
                      className={cn(
                        segmentClassName,
                        'rounded-bl-(--input-radius) border-t border-border-field',
                      )}
                    >
                      <input
                        aria-label="Postal code"
                        placeholder="Postal code"
                        className={inputClassName}
                      />
                    </label>
                    <label
                      className={cn(
                        segmentClassName,
                        'rounded-br-(--input-radius) border-t border-l border-border-field',
                      )}
                    >
                      <input
                        aria-label="City"
                        placeholder="City"
                        className={inputClassName}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <RedirectIcon />
                <p className="text-sm text-fg-muted">
                  After submission, you will be redirected to securely complete
                  next steps.
                </p>
              </div>
            </div>
          </MethodPanel>
        </RadioGroup>

        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </CardContent>
    </Card>
  )
}

// Accordion-style expand/collapse: grid-rows 0fr→1fr animates the panel to
// its intrinsic height without measuring (same duration/easing as the
// registry disclosure). Panels stay mounted, so inert keeps the collapsed
// one's fields out of Tab order and the accessibility tree. Clip is y-only
// so focus rings aren't cut off at the panel edges.
function MethodPanel({
  expanded,
  children,
}: {
  expanded: boolean
  children: React.ReactNode
}) {
  return (
    <div
      inert={!expanded}
      className={cn(
        'grid grid-rows-[0fr] opacity-0 duration-300 ease-fluid-out motion-safe:transition-[grid-template-rows,opacity]',
        expanded && 'grid-rows-[1fr] opacity-100',
      )}
    >
      <div className="min-h-0 overflow-y-clip">{children}</div>
    </div>
  )
}

// Apple Pay mark shown next to its radio, styled like the card brand badges.
function ApplePayBadge() {
  return (
    <span
      aria-hidden="true"
      className="flex h-4.5 items-center gap-[3px] rounded-[4px] bg-white px-1.5 ring-1 ring-black/10"
    >
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-black">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.03 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
      </svg>
      <span className="text-[9px] leading-none font-semibold tracking-tight text-black">
        Pay
      </span>
    </span>
  )
}

// Apple's own button lockup: the mark + "Pay" wordmark, both drawn in the
// button's text color. bg-fg / text-bg makes it black-on-light and
// white-on-dark automatically, so it adapts to the previewed theme.
function ApplePayButton() {
  return (
    <Button className="w-full gap-1.5 border-transparent bg-fg font-medium text-bg hover:border-transparent hover:bg-fg/90 pressed:bg-fg/90">
      <span className="text-sm">Buy with</span>
      <span className="flex items-center gap-1">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-3.5 fill-current"
        >
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.03 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
        <span className="text-sm font-semibold">Pay</span>
      </span>
    </Button>
  )
}

// Redirect hint: a browser window with an arrow leaving through its right edge.
function RedirectIcon() {
  return (
    <svg
      viewBox="0 0 32 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-8 shrink-0 text-fg-muted"
    >
      {/* window outline, right edge open where the arrow exits */}
      <path d="M25 16.5V19a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v4.5" />
      <g fill="currentColor" stroke="none">
        <circle cx="4.75" cy="5.25" r="0.75" />
        <circle cx="7.5" cy="5.25" r="0.75" />
        <circle cx="10.25" cy="5.25" r="0.75" />
        <circle cx="4.75" cy="7.75" r="0.75" />
        <circle cx="7.5" cy="7.75" r="0.75" />
        <circle cx="10.25" cy="7.75" r="0.75" />
      </g>
      <path d="M14 13h15.5M26 9.5l3.5 3.5-3.5 3.5" />
    </svg>
  )
}

// Visa logo shown as a trailing addon in the card-number field.
function VisaBadge() {
  return (
    <span className="flex h-4 items-center rounded-[3px] bg-white px-1 ring-1 ring-black/5">
      <span className="text-[8px] leading-none font-bold tracking-tight text-[#1434cb] italic">
        VISA
      </span>
    </span>
  )
}

// Mastercard logo: the two overlapping circles.
function MastercardBadge() {
  return (
    <span className="flex h-4 items-center rounded-[3px] bg-white px-1 ring-1 ring-black/5">
      <span className="size-2 rounded-full bg-[#eb001b]" />
      <span className="-ml-1 size-2 rounded-full bg-[#f79e1b]/90" />
    </span>
  )
}

// CVC hint: a card showing where the 3-digit code lives.
function CvcIcon() {
  return (
    <svg
      viewBox="0 0 24 18"
      aria-hidden="true"
      className="h-4.5 w-6 shrink-0 text-fg-muted"
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="16"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="1"
        y="4.5"
        width="22"
        height="3"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <text
        x="20.5"
        y="14.5"
        textAnchor="end"
        fontSize="6.5"
        fontWeight="700"
        fill="currentColor"
      >
        123
      </text>
    </svg>
  )
}
