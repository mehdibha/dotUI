'use client'

import { useState } from 'react'
import { BitcoinIcon, CreditCardIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Card, CardContent } from '@/registry/ui/card'
import { Checkbox, CheckboxControl } from '@/registry/ui/checkbox'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { Radio, RadioControl, RadioGroup } from '@/registry/ui/radio-group'
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
                : 'Crypto payment details expanded',
            )
          }}
          className="gap-0"
        >
          <Radio value="card">
            <RadioControl />
            <CreditCardIcon aria-hidden className="size-4.5" />
            <Label>Card</Label>
          </Radio>

          {/* The panel is a sibling of the radio, never a child: it holds
              interactive fields, and sitting right after the radio in DOM
              order lets Tab flow from the checked radio into the form. */}
          {method === 'card' && (
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
          )}

          <Separator className="my-3.5" />

          <Radio value="crypto">
            <RadioControl />
            <BitcoinIcon aria-hidden className="size-4.5" />
            <Label>Crypto</Label>
          </Radio>

          {method === 'crypto' && (
            <p className="pt-3 text-sm text-fg-muted">
              You'll be redirected to connect a wallet. Bitcoin, Ethereum and
              USDC are supported.
            </p>
          )}
        </RadioGroup>

        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </CardContent>
    </Card>
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
