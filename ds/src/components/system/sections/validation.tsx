'use client'

import { useState } from 'react'
import { CheckIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { RosterEntry, SystemWithColors } from '@/data/schema'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
import { Description, FieldError, Label } from '@/ui/field'
import { Input } from '@/ui/input'
import { TextField } from '@/ui/text-field'

import {
  Block,
  Note,
  Playground,
  Section,
  SpecList,
  Toggle,
} from '../primitives'

type InlineAlertVariant =
  | 'neutral'
  | 'informative'
  | 'positive'
  | 'notice'
  | 'negative'

const INLINE_ALERT_VARIANTS: {
  variant: InlineAlertVariant
  mapped: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  icon: typeof InfoIcon | null
  title: string
  body: string
}[] = [
  {
    variant: 'neutral',
    mapped: 'neutral',
    icon: null,
    title: 'Neutral',
    body: 'Gray, no icon — general contextual info with no severity.',
  },
  {
    variant: 'informative',
    mapped: 'info',
    icon: InfoIcon,
    title: 'Informative',
    body: 'Blue, info icon — a heads-up that isn’t an error.',
  },
  {
    variant: 'positive',
    mapped: 'success',
    icon: CheckIcon,
    title: 'Positive',
    body: 'Green, check icon — confirms a successful outcome.',
  },
  {
    variant: 'notice',
    mapped: 'warning',
    icon: TriangleAlertIcon,
    title: 'Notice',
    body: 'Orange, alert icon — worth attention, not yet an error.',
  },
  {
    variant: 'negative',
    mapped: 'danger',
    icon: TriangleAlertIcon,
    title: 'Negative',
    body: 'Red, alert icon — validation failed, needs correction.',
  },
]

const BORDER_PROGRESSION = [
  { label: 'Default', value: 'gray-300', note: '2px solid, resting state' },
  {
    label: 'Invalid',
    value: 'negative',
    note: '2px solid, after blur/submit fails validation',
  },
  {
    label: 'Invalid + focused',
    value: 'negative-1000',
    note: 'border darkens; the focus RING itself stays blue, not red',
  },
]

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function ValidationSection(_props: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const [email, setEmail] = useState('')
  const [blurred, setBlurred] = useState(false)
  const [forceInvalid, setForceInvalid] = useState(false)

  const failsValidation = blurred && email.length > 0 && !isValidEmail(email)
  const isInvalid = forceInvalid || failsValidation

  return (
    <Section
      title="Form Validation"
      kicker="Foundations"
      intro="Spectrum fields validate on blur or submit, never on keystroke. When a field fails, the same description slot that carried neutral help text is replaced by a negative-colored error message, an alert icon appears inside the field, and the 2px border switches from gray to negative — turning a darker negative-1000 only while the field is both invalid and focused, while the focus ring itself stays blue."
    >
      <Block
        title="Live field"
        description="Type an invalid email, then blur the field (click away or Tab) — validation does not fire on keystroke. Or flip the toggle to force the invalid state directly."
        aside={
          <Toggle isSelected={forceInvalid} onChange={setForceInvalid}>
            Force invalid
          </Toggle>
        }
      >
        <Playground
          label="Email · TextField"
          hint={isInvalid ? 'invalid' : blurred ? 'valid' : 'untouched'}
          surface="muted"
          center={false}
        >
          <div className="mx-auto max-w-sm">
            <TextField
              value={email}
              onChange={(value) => {
                setEmail(value)
              }}
              onBlur={() => setBlurred(true)}
              isInvalid={isInvalid}
              aria-label="Email"
            >
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                aria-invalid={isInvalid}
              />
              {isInvalid ? (
                <FieldError>
                  {forceInvalid && !failsValidation
                    ? 'Enter a valid email address.'
                    : 'This email address doesn’t look valid.'}
                </FieldError>
              ) : (
                <Description>
                  We’ll only use this to send order updates.
                </Description>
              )}
            </TextField>
          </div>
        </Playground>
        <Note className="mt-3">
          Description and FieldError occupy the same DOM slot: the neutral help
          text is replaced by the negative error message when invalid, and
          returns the moment the value resolves — it never renders both, and
          never as a separate line pushed below.
        </Note>
      </Block>

      <Block
        title="Error anatomy"
        description="Every invalid text field shows the same four changes at once: label stays neutral, border progresses through three states, an alert icon appears inside the field, and the help-text slot swaps content."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Playground label="Anatomy" surface="grid" center>
            <div className="flex w-full max-w-xs flex-col gap-1.5">
              <span className="text-sm text-fg">Email</span>
              <div
                className="flex h-9 items-center gap-2 rounded-md bg-card px-3"
                style={{ border: '2px solid var(--color-fg-danger)' }}
              >
                <span className="flex-1 text-sm text-fg-muted">
                  you@example
                </span>
                <TriangleAlertIcon
                  className="size-4 shrink-0 text-fg-danger"
                  aria-hidden
                />
              </div>
              <span className="text-xs text-fg-danger">
                This email address doesn’t look valid.
              </span>
            </div>
          </Playground>
          <SpecList
            rows={[
              {
                label: 'Border, 2px solid',
                value: 'gray-300 → negative → negative-1000',
                note: 'progresses on invalid, then darkens further on focus while still invalid',
              },
              {
                label: 'Focus ring',
                value: 'blue',
                note: 'stays the standard focus-ring color even when the field is invalid — focus and validity are independent signals',
              },
              {
                label: 'Error icon',
                value: 'FieldErrorIcon, fill = negative',
                note: 'text-field, combobox and picker render this icon themselves when invalid',
              },
              {
                label: 'Help text → error text',
                value: 'neutral-subdued → negative',
                note: 'same slot, replaced not appended; cannot show negative help text while disabled',
              },
              {
                label: 'Checkbox / radio groups',
                value: 'showErrorIcon on the help text',
                note: 'those controls have no built-in icon of their own, so the group’s help text opts into showing one',
              },
            ]}
          />
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border">
          <div className="border-b bg-muted/20 px-4 py-2.5 text-xs font-medium text-fg">
            Border color progression
          </div>
          <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {BORDER_PROGRESSION.map((step) => (
              <div key={step.label} className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'size-5 rounded-full bg-card',
                      step.label === 'Default' &&
                        'border-2 border-[var(--color-border)]',
                    )}
                    style={
                      step.label !== 'Default'
                        ? {
                            border: '2px solid var(--color-fg-danger)',
                            filter:
                              step.label === 'Invalid + focused'
                                ? 'brightness(0.7)'
                                : undefined,
                          }
                        : undefined
                    }
                  />
                  <span className="text-sm font-medium text-fg">
                    {step.label}
                  </span>
                </div>
                <p className="font-mono text-xs text-fg-muted">{step.value}</p>
                <p className="text-xs text-fg-muted">{step.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Block>

      <Block
        title="Scopes: single field vs group"
        description="A field's help text swaps in place for one input's own error. When several related inputs fail together, Spectrum surfaces an InlineAlert at the top of the section instead — it aggregates the errors and persists until every one is resolved."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Playground
            label="Single field"
            hint="help-text swap"
            surface="muted"
          >
            <div className="flex w-full max-w-2xs flex-col gap-1.5 text-left">
              <span className="text-sm text-fg">Username</span>
              <div className="flex h-9 items-center rounded-md border-2 border-[var(--color-fg-danger)] bg-card px-3">
                <span className="text-sm text-fg-muted">taken_handle</span>
              </div>
              <span className="text-xs text-fg-danger">
                That username is already taken.
              </span>
            </div>
          </Playground>
          <Playground
            label="Group"
            hint="InlineAlert aggregates"
            surface="muted"
          >
            <Alert variant="danger" className="w-full max-w-2xs text-left">
              <TriangleAlertIcon aria-hidden />
              <AlertTitle>3 fields need attention</AlertTitle>
              <AlertDescription>
                Fix the highlighted fields below before continuing.
              </AlertDescription>
            </Alert>
          </Playground>
        </div>
      </Block>

      <Block
        title="Inline alert"
        description="Five semantic variants, each with a fixed icon and color pairing. S2 adds a fillStyle prop (border / subtleFill / boldFill — border is the default) and an autoFocus prop for alerts that should grab keyboard focus when they appear."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {INLINE_ALERT_VARIANTS.map((item) => (
            <Alert key={item.variant} variant={item.mapped}>
              {item.icon ? <item.icon aria-hidden /> : null}
              <AlertTitle>{item.title}</AlertTitle>
              <AlertDescription>{item.body}</AlertDescription>
            </Alert>
          ))}
        </div>
        <Note className="mt-3">
          Anatomy: icon + Heading (size xxs) + Content (small body) + an
          optional dismiss action. Mapped here to this system’s Alert variants —
          negative→danger, notice→warning, informative→info, positive→success,
          neutral→neutral.
        </Note>
      </Block>

      <Block
        title="Accessibility"
        description="Validation wiring is deliberately quiet: it links content via attributes the screen reader already tracks, rather than interrupting with live-region announcements."
      >
        <SpecList
          rows={[
            {
              label: 'aria-describedby',
              value: 'links description/error to the input',
              note: 'not aria-live or role="alert" — the field’s existing description relationship is reused, so no extra announcement machinery',
            },
            {
              label: 'aria-invalid',
              value: 'true when invalid',
              note: 'set on the input alongside the visual border/icon/text changes',
            },
            {
              label: 'When validation fires',
              value: 'on blur or submit',
              note: 'never on keystroke by default; realtime feedback (e.g. live password rules) is opt-in per field',
            },
          ]}
        />
      </Block>

      <Note>
        Source: react-spectrum s2 Field.tsx; spectrum.adobe.com/page/help-text,
        spectrum.adobe.com/page/text-field,
        spectrum.adobe.com/page/in-line-alert
      </Note>
    </Section>
  )
}
