'use client'

import * as React from 'react'
import { flushSync } from 'react-dom'
import * as AutocompletePrimitive from 'react-aria-components/Autocomplete'
import { MenuContext } from 'react-aria-components/Menu'
import type { Key } from 'react-aria-components/Menu'
import { PopoverContext } from 'react-aria-components/Popover'
import { Provider } from 'react-aria-components/slots'
import { TextFieldContext } from 'react-aria-components/TextField'
import { useControlledState } from 'react-stately/useControlledState'

import { getCaretRect } from '@/registry/lib/textarea-caret'
import type { PopoverProps } from '@/registry/ui/popover'

import { useStyles } from './styles'

// MARK: mentionStyles

// MARK: Mention

interface MentionProps {
  /** The character that opens the suggestions list. @default "@" */
  trigger?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /**
   * Maps the key of a selected item to the text inserted after the trigger
   * character. @default String(key)
   */
  getItemText?: (key: Key) => string
  /** Where the suggestions popover is placed relative to the caret. @default "bottom start" */
  placement?: PopoverProps['placement']
  className?: string
  children?: React.ReactNode
}

/**
 * Wires an `@`-mention experience onto composed primitives: it filters the
 * `Menu` via React Aria's `Autocomplete` and injects the value, popover, and
 * menu wiring through context, so consumers drop in a real `TextField` +
 * `TextArea`, `Popover`, and `Menu`/`MenuItem` — no bespoke sub-components.
 */
function Mention({
  trigger = '@',
  value,
  defaultValue,
  onChange,
  getItemText = (key) => String(key),
  placement = 'bottom start',
  className,
  children,
}: MentionProps) {
  const { root } = useStyles()()
  const { startsWith } = AutocompletePrimitive.useFilter({
    sensitivity: 'base',
  })
  const [inputValue, setInputValue] = useControlledState(
    value,
    defaultValue ?? '',
    onChange,
  )
  const [anchorIndex, setAnchorIndex] = React.useState(-1)
  const [filterValue, setFilterValue] = React.useState('')
  const rootRef = React.useRef<HTMLDivElement>(null)

  // The TextArea is composed by the consumer, so its element is read from the
  // DOM rather than threaded through context — `TextField` re-provides
  // `TextAreaContext`, which would shadow an injected ref.
  const getInput = React.useCallback(
    () => rootRef.current?.querySelector('textarea') ?? null,
    [],
  )

  // Reads the caret position to decide whether the user is mid-mention: find the
  // nearest preceding trigger char, and if the text between it and the caret has
  // no whitespace, that's the active query. Otherwise close the list.
  const updateFilter = React.useCallback(() => {
    const input = getInput()
    if (
      !input ||
      typeof document === 'undefined' ||
      document.activeElement !== input
    ) {
      setAnchorIndex(-1)
      return
    }
    const { selectionStart, selectionEnd, value: text } = input
    if (selectionStart == null || selectionStart !== selectionEnd) {
      setAnchorIndex(-1)
      return
    }
    const index = text.lastIndexOf(trigger, selectionStart)
    if (index >= 0) {
      const precededBySpace = index === 0 || /\s/.test(text[index - 1] ?? '')
      const slice = text.slice(index + trigger.length, selectionStart)
      if (precededBySpace && !/\s/.test(slice)) {
        setAnchorIndex(index)
        setFilterValue(slice)
        return
      }
    }
    setAnchorIndex(-1)
  }, [trigger, getInput])

  // Caret moves on typing, clicking, and arrowing all surface as
  // `selectionchange`; each instance only reacts while its own textarea is
  // focused (updateFilter guards on `document.activeElement`).
  React.useEffect(() => {
    document.addEventListener('selectionchange', updateFilter)
    return () => document.removeEventListener('selectionchange', updateFilter)
  }, [updateFilter])

  const handleChange = React.useCallback(
    (next: string) => {
      setInputValue(next)
      updateFilter()
    },
    [setInputValue, updateFilter],
  )

  // Replace the active query (from the trigger char to the caret) with the
  // chosen mention, then drop the caret right after it.
  const insert = React.useCallback(
    (key: Key) => {
      const input = getInput()
      if (!input || anchorIndex < 0) return
      const mention = `${trigger}${getItemText(key)} `
      const prefix = inputValue.slice(0, anchorIndex) + mention
      const suffix = inputValue.slice(input.selectionEnd ?? anchorIndex)
      // Commit the value before moving the caret, so the caret lands after the
      // inserted text rather than at the stale position.
      flushSync(() => setInputValue(prefix + suffix))
      input.setSelectionRange(prefix.length, prefix.length)
      input.focus()
      updateFilter()
    },
    [
      trigger,
      getItemText,
      inputValue,
      anchorIndex,
      setInputValue,
      updateFilter,
      getInput,
    ],
  )

  const getTargetRect = React.useCallback(
    (target: Element) => {
      const input = getInput()
      if (!input) return target.getBoundingClientRect()
      const caret = getCaretRect(input, anchorIndex)
      const rect = input.getBoundingClientRect()
      return new DOMRect(
        rect.left + caret.left,
        rect.top + caret.top,
        1,
        caret.height,
      )
    },
    [anchorIndex, getInput],
  )

  // Close the list when the popover dismisses itself (outside press, Escape).
  const onOpenChange = React.useCallback((isOpen: boolean) => {
    if (!isOpen) setAnchorIndex(-1)
  }, [])

  return (
    <AutocompletePrimitive.Autocomplete
      inputValue={filterValue}
      filter={startsWith}
    >
      <Provider
        values={[
          [TextFieldContext, { value: inputValue, onChange: handleChange }],
          [
            PopoverContext,
            {
              triggerRef: rootRef,
              isOpen: anchorIndex >= 0,
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
        <div ref={rootRef} data-mention="" className={root({ className })}>
          {children}
        </div>
      </Provider>
    </AutocompletePrimitive.Autocomplete>
  )
}

// MARK: exports

export type { MentionProps }
export { Mention }
