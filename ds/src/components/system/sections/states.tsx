'use client'

import { useState } from 'react'

import type { RosterEntry, SystemWithColors } from '@/data/schema'
import { Button } from '@/ui/button'

import { Choice } from '../primitives/controls'
import { Playground } from '../primitives/playground'
import { Note, Section, Block } from '../primitives/section'
import { SpecList } from '../primitives/spec'
import { Mono } from '../primitives/token'

type DemoState =
  | 'default'
  | 'hover'
  | 'down'
  | 'keyboard-focus'
  | 'disabled'
  | 'selected'

const stateOptions: { value: DemoState; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'hover', label: 'Hover' },
  { value: 'down', label: 'Down' },
  { value: 'keyboard-focus', label: 'Keyboard focus' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'selected', label: 'Selected' },
]

const stateDetail: Record<
  DemoState,
  { token: string; cursor: string; note: string }
> = {
  default: {
    token: 'accent-900',
    cursor: 'default (arrow)',
    note: 'Resting fill.',
  },
  hover: {
    token: 'accent-1000',
    cursor: 'default (arrow)',
    note: 'One step deeper on the ramp — data-hovered. Suppressed on touch input.',
  },
  down: {
    token: 'accent-1100',
    cursor: 'default (arrow)',
    note: 'Two steps deeper — data-pressed. Cleared if the pointer drags off the control before release.',
  },
  'keyboard-focus': {
    token: 'accent-1000 fill + focus-ring token',
    cursor: 'default (arrow)',
    note: 'Its own background step (not just hover reused) plus a 2px ring — data-focus-visible. Never set by a mouse click or programmatic .focus().',
  },
  disabled: {
    token: 'disabled (faded, fixed)',
    cursor: 'not-allowed',
    note: 'Wins over every other state — hover/press/selected/focus styling is suppressed entirely.',
  },
  selected: {
    token: 'accent-900 + selected treatment',
    cursor: 'default (arrow)',
    note: 'Compounds with hover/press/focus — each gets its own darker token layered on top of selected.',
  },
}

const userInitiated = [
  {
    label: 'Hover',
    detail: 'data-hovered — suppressed entirely on touch input',
  },
  {
    label: 'Down (press)',
    detail: 'data-pressed — cleared if the pointer drags off before release',
  },
  {
    label: 'Keyboard focus',
    detail:
      'data-focus-visible — never set by mouse click or programmatic focus()',
  },
]

const optionInitiated = [
  {
    label: 'Disabled',
    detail: 'set by the app, not the user; overrides every other state',
  },
  {
    label: 'Selected',
    detail: 'persists across interaction; compounds with hover/press/focus',
  },
  { label: 'Dragged', detail: 'a controlled drag operation is in progress' },
  {
    label: 'Error',
    detail: 'invalid state from validation; own icon and border color',
  },
]

function demoClasses(state: DemoState) {
  switch (state) {
    case 'default':
      return 'bg-accent text-fg-on-accent cursor-default'
    case 'hover':
      return 'bg-accent-hover text-fg-on-accent cursor-default'
    case 'down':
      return 'bg-accent-active text-fg-on-accent cursor-default'
    case 'keyboard-focus':
      return 'bg-accent-hover text-fg-on-accent cursor-default outline outline-2 outline-offset-2 outline-border-focus'
    case 'disabled':
      return 'bg-accent/35 text-fg-on-accent/70 cursor-disabled'
    case 'selected':
      return 'bg-accent-active text-fg-on-accent cursor-default ring-2 ring-border-focus-muted ring-inset'
  }
}

const precedenceRows = [
  {
    label: 'Disabled beats all',
    value: 'Always wins on color and border',
    note: 'Hover, pressed, selected, and focus styling are all suppressed — disabled short-circuits every other rule.',
  },
  {
    label: 'Selected compounds',
    value: 'Selected + hover / press / focus stack',
    note: 'Each interaction still gets its own darker token layered over the selected background, rather than being ignored.',
  },
  {
    label: 'Invalid + focus',
    value: 'Border → negative-1000, ring stays focus-blue',
    note: 'The field border darkens to the negative/error step, but the 2px focus ring keeps its normal focus-ring color — the two signals don’t merge into one color.',
  },
  {
    label: 'Error icon precedence',
    value: 'Error icon overrides the validation icon',
    note: 'When both would show, the error state wins the icon slot.',
  },
  {
    label: 'Button cursor',
    value: 'default (arrow) in every state',
    note: 'Adobe’s stance: buttons never show a pointer, even on hover — the one exception is a web button rendered as an <a href>, which gets pointer like any link.',
  },
  {
    label: 'Text field cursor',
    value: 'text · disabled → default (arrow)',
    note: 'An I-beam while editable; drops to the plain arrow once the field is disabled.',
  },
  {
    label: 'isPending (Button only)',
    value: 'Disables press/hover, keeps focus reachable',
    note: 'Announced to assistive tech; label swaps to an indeterminate spinner after a 1s delay to avoid a flicker on fast responses. Meant for actions that resolve within ~5s.',
  },
]

export function StatesSection(_props: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const [state, setState] = useState<DemoState>('default')
  const [pending, setPending] = useState(false)
  const detail = stateDetail[state]

  return (
    <Section
      title="Interaction States & Cursors"
      kicker="Foundations"
      intro="Every control moves through the same small vocabulary of states — driven either by the user's pointer and keyboard, or by the app setting a flag like disabled or selected. React Aria exposes each as a data attribute, and Spectrum 2 answers with a consistent rule: color steps one notch deeper per state, keyboard focus gets its own token instead of borrowing hover's, and disabled always wins."
    >
      <Block
        title="State explorer"
        description="Pick a state to see the exact treatment applied to a live control, and which step of the accent ramp (or which override) is responsible."
      >
        <Playground
          label={state}
          controls={
            <Choice options={stateOptions} value={state} onChange={setState} />
          }
          footer={
            <>
              <Mono>{detail.token}</Mono> · cursor: <Mono>{detail.cursor}</Mono>
            </>
          }
        >
          <div
            className={`flex h-10 w-48 items-center justify-center rounded-md text-sm font-medium transition-colors ${demoClasses(state)}`}
          >
            Continue
          </div>
        </Playground>
        <Note className="mt-3">{detail.note}</Note>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-2 rounded-lg border p-3">
            <div className="h-8 w-full rounded-md bg-accent" />
            <p className="text-xs text-fg-muted">
              default → <Mono>accent-900</Mono>
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border p-3">
            <div className="h-8 w-full rounded-md bg-accent-hover" />
            <p className="text-xs text-fg-muted">
              hover → <Mono>accent-1000</Mono>
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border p-3">
            <div className="h-8 w-full rounded-md bg-accent-active" />
            <p className="text-xs text-fg-muted">
              pressed → <Mono>accent-1100</Mono>
            </p>
          </div>
        </div>
        <Note className="mt-2">
          accent-hover / accent-active stand in for the ramp steps here; in S2
          proper each is a named step on the accent color ramp (…-900, -1000,
          -1100), one deeper per state.
        </Note>
      </Block>

      <Block
        title="A real button, for real"
        description="Hover it, press it, or Tab to it — the ring only appears from keyboard focus, never from a mouse click. isPending disables press and hover but keeps the button reachable by keyboard and announces its state to screen readers."
      >
        <Playground
          label="live control"
          controls={
            <Button
              size="sm"
              variant="quiet"
              onPress={() => setPending((v) => !v)}
            >
              {pending ? 'Stop pending' : 'Trigger isPending'}
            </Button>
          }
          footer="data-hovered on pointer hover · data-pressed while the mouse/touch is down · data-focus-visible only after Tab, not after a click"
        >
          <Button variant="primary" isPending={pending}>
            Save changes
          </Button>
        </Playground>
        <Note className="mt-3">
          isPending is for actions expected to resolve in about 5 seconds or
          less; the label doesn’t swap to a spinner until 1 second has passed,
          so instant responses never show a flicker.
        </Note>
      </Block>

      <Block
        title="States by trigger"
        description="Split by what causes them: user-initiated states come from pointer/keyboard interaction and clear on their own; option-initiated states are set by the app and persist until it changes them."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-5">
            <p className="mb-3 text-xs font-medium tracking-wide text-fg-muted uppercase">
              User-initiated
            </p>
            <ul className="flex flex-col gap-3">
              {userInitiated.map((item) => (
                <li key={item.label}>
                  <p className="text-sm font-medium text-fg">{item.label}</p>
                  <p className="text-xs text-fg-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border p-5">
            <p className="mb-3 text-xs font-medium tracking-wide text-fg-muted uppercase">
              Option-initiated
            </p>
            <ul className="flex flex-col gap-3">
              {optionInitiated.map((item) => (
                <li key={item.label}>
                  <p className="text-sm font-medium text-fg">{item.label}</p>
                  <p className="text-xs text-fg-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Block>

      <Block
        title="Focus ring anatomy"
        description="Keyboard focus draws a solid outline, offset from the control rather than touching it — width and offset are both fixed at 2px."
      >
        <Playground
          surface="grid"
          bodyClassName="flex items-center justify-center py-12"
        >
          <div className="relative">
            <div className="h-10 w-32 rounded-md bg-accent-hover" />
            <div className="pointer-events-none absolute -inset-[4px] rounded-[10px] outline outline-2 outline-offset-2 outline-border-focus" />
            <div className="pointer-events-none absolute top-1/2 left-full ml-3 -translate-y-1/2 text-xs whitespace-nowrap text-fg-muted">
              ← 2px offset, 2px solid outline
            </div>
          </div>
        </Playground>
        <Note className="mt-3">
          Ring color is the focus-ring token (swapped for the system Highlight
          color under forced-colors mode). It appears only on data-focus-visible
          — solid, not a shadow, and never touching the control edge.
        </Note>
      </Block>

      <Block
        title="Precedence & cursors"
        description="When multiple states could apply at once, and what the pointer looks like in each."
      >
        <SpecList rows={precedenceRows} />
      </Block>

      <Note>
        Source: spectrum.adobe.com/page/states · react-spectrum s2 source
        (packages/@react-spectrum/s2)
      </Note>
    </Section>
  )
}
