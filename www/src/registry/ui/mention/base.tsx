'use client'

import * as React from 'react'
import * as AutocompletePrimitive from 'react-aria-components/Autocomplete'
import { MenuContext } from 'react-aria-components/Menu'
import type { Key } from 'react-aria-components/Menu'
import { PopoverContext } from 'react-aria-components/Popover'
import { Provider } from 'react-aria-components/slots'
import { useControlledState } from 'react-stately/useControlledState'

import {
  Direction,
  positionToDOMRange,
  TokenSegmentList,
} from '@/registry/lib/react-aria-token-field'
import type { PopoverProps } from '@/registry/ui/popover'
import { TokenField } from '@/registry/ui/token-field'
import type { TokenFieldProps } from '@/registry/ui/token-field'

import { useStyles } from './styles'

// MARK: mentionStyles

// MARK: Mention

interface MentionState {
  /** The trigger text that opened the suggestions (e.g. `"@"` or `"/"`), or null while closed. */
  trigger: string | null
  /** The text typed after the trigger. */
  query: string
}

interface MentionProps extends Omit<
  TokenFieldProps,
  'children' | 'role' | 'slot'
> {
  /**
   * The character(s) that open the suggestions list: a string for a single
   * trigger, or a regular expression matching several (e.g. `/[@/]/` for
   * `@`-mentions and `/`-commands). @default "@"
   */
  trigger?: string | RegExp
  /**
   * Maps the key of a selected item to the text inserted after the trigger
   * character. @default String(key)
   */
  getItemText?: (key: Key) => string
  /** Where the suggestions popover is placed relative to the caret. @default "bottom start" */
  placement?: PopoverProps['placement']
  /**
   * The composed input and suggestions. A function receives the active trigger
   * and query, so the suggestions can depend on which trigger the user typed.
   */
  children?: React.ReactNode | ((state: MentionState) => React.ReactNode)
}

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Wires a mention experience onto the `TokenField` component: typing a trigger
 * character opens a `Menu` of suggestions (filtered via React Aria's
 * `Autocomplete`) in a caret-anchored `Popover`, and selecting an item inserts
 * it as an inline token. Consumers compose a `TokenInput` plus a `Popover` +
 * `Menu`/`MenuItem`; the value is a `TokenSegmentList` of text and tokens.
 */
function Mention({
  trigger = '@',
  getItemText = (key) => String(key),
  placement = 'bottom start',
  className,
  children,
  value: valueProp,
  defaultValue,
  onChange,
  ...props
}: MentionProps) {
  const { root } = useStyles()()
  const { startsWith } = AutocompletePrimitive.useFilter({
    sensitivity: 'base',
  })
  // Mention always controls the TokenField: it needs the value (and its caret
  // position) locally to find the active trigger.
  const [value, setValue] = useControlledState(
    valueProp,
    defaultValue ?? emptyValue,
    onChange,
  )
  const rootRef = React.useRef<HTMLDivElement>(null)

  // A trigger preceded by start-of-text or whitespace; string triggers get the
  // guard built in, regex triggers bring their own. The `g` flag is dropped so
  // `exec` below stays stateless.
  const triggerPattern = React.useMemo(
    () =>
      typeof trigger === 'string'
        ? new RegExp(`(?<=^|\\s)${escapeRegExp(trigger)}`)
        : new RegExp(trigger.source, trigger.flags.replace('g', '')),
    [trigger],
  )

  // The active mention: the nearest trigger before the caret with no
  // whitespace (or token) between it and the caret. Caret moves surface as
  // value changes (TokenField stores the caret in the value), so this stays
  // current while typing, clicking, and arrowing.
  const active = React.useMemo(() => {
    const anchor = value.findText(
      value.caretPosition,
      Direction.Backward,
      triggerPattern,
    )
    if (!anchor) return null
    const slice = value.slice(anchor, value.caretPosition)
    // A token between the trigger and the caret ends the mention.
    if (slice.segments.some((segment) => segment.type === 'token')) return null
    const raw = slice.toString()
    const match = triggerPattern.exec(raw)
    if (match?.index !== 0) return null
    const query = raw.slice(match[0].length)
    if (/\s/.test(query)) return null
    return {
      anchor,
      trigger: match[0],
      query,
      key: `${anchor.index}:${anchor.offset}:${raw}`,
    }
  }, [value, triggerPattern])

  // The mention the user explicitly dismissed (Escape / outside press), so a
  // caret move alone doesn't immediately reopen the same query.
  const [dismissedKey, setDismissedKey] = React.useState<string | null>(null)
  const isOpen = active != null && dismissedKey !== active.key

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) setDismissedKey(active?.key ?? null)
    },
    [active],
  )

  const getInput = React.useCallback(
    () =>
      rootRef.current?.querySelector<HTMLDivElement>('[data-token-input]') ??
      null,
    [],
  )

  // Replace the active query (trigger included) with an inline token plus a
  // trailing space, and drop the caret after it.
  const insert = React.useCallback(
    (key: Key) => {
      if (!active) return
      // TokenField only applies the stored caret position while focused, so
      // refocus first if the menu interaction moved focus.
      const input = getInput()
      if (input && document.activeElement !== input) input.focus()
      setValue((value) =>
        value.replaceRangeWithSegments(
          active.anchor,
          value.caretPosition,
          [
            {
              type: 'token',
              text: `${active.trigger}${getItemText(key)}`,
              value: key,
            },
            { type: 'text', text: ' ' },
          ],
          false,
        ),
      )
    },
    [active, getItemText, setValue, getInput],
  )

  // Anchor the popover to the trigger character rather than the field.
  const getTargetRect = React.useCallback(
    (target: Element) => {
      const input = getInput()
      if (!input || !active) return target.getBoundingClientRect()
      return positionToDOMRange(input, active.anchor).getBoundingClientRect()
    },
    [active, getInput],
  )

  return (
    <AutocompletePrimitive.Autocomplete
      inputValue={active?.query ?? ''}
      filter={startsWith}
    >
      <Provider
        values={[
          [
            PopoverContext,
            {
              triggerRef: rootRef,
              isOpen,
              onOpenChange,
              isNonModal: true,
              placement,
              trigger: 'MenuTrigger',
              getTargetRect,
            },
          ],
          [MenuContext, { onAction: insert }],
        ]}
      >
        <TokenField
          {...props}
          ref={rootRef}
          value={value}
          onChange={setValue}
          className={root({ className })}
        >
          {typeof children === 'function'
            ? children({
                trigger: active?.trigger ?? null,
                query: active?.query ?? '',
              })
            : children}
        </TokenField>
      </Provider>
    </AutocompletePrimitive.Autocomplete>
  )
}

const emptyValue = new TokenSegmentList([])

// MARK: exports

export type { MentionProps, MentionState }
export { Mention, TokenSegmentList }
