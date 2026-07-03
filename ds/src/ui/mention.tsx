'use client'

import * as React from 'react'
import { flushSync } from 'react-dom'
import * as AutocompletePrimitive from 'react-aria-components/Autocomplete'
import { InputContext } from 'react-aria-components/Input'
import { MenuContext } from 'react-aria-components/Menu'
import type { Key } from 'react-aria-components/Menu'
import { PopoverContext } from 'react-aria-components/Popover'
import { Provider } from 'react-aria-components/slots'
import { TextAreaContext } from 'react-aria-components/TextArea'
import { TextFieldContext } from 'react-aria-components/TextField'
import { useControlledState } from 'react-stately/useControlledState'
import { tv } from 'tailwind-variants'

import { getCaretRect } from '@/lib/textarea-caret'
import type { PopoverProps } from '@/ui/popover'
const mentionVariants = tv({
  slots: {
    root: 'group/mention flex w-full flex-col gap-1.5',
  },
})

type MentionInputElement = HTMLInputElement | HTMLTextAreaElement

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
 * menu wiring through context, so consumers drop in their own input — a bare
 * `TextArea`/`Input`, or one wrapped in a `TextField` for a label — plus a
 * `Popover` + `Menu`/`MenuItem`. No bespoke sub-components.
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
  const { root } = mentionVariants()
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
  // The mention query the user explicitly dismissed (Escape / outside press),
  // so a caret move alone doesn't immediately reopen the same query.
  const dismissedRef = React.useRef<string | null>(null)

  // The input is composed by the consumer (and may be wrapped in a TextField,
  // which re-provides Input/TextAreaContext), so its element is read from the
  // DOM rather than threaded through context.
  const getInput = React.useCallback(
    () =>
      rootRef.current?.querySelector<MentionInputElement>('textarea, input') ??
      null,
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
        // Stay closed for the exact query the user just dismissed.
        if (dismissedRef.current === `${index}:${slice}`) {
          setAnchorIndex(-1)
          return
        }
        dismissedRef.current = null
        setAnchorIndex(index)
        setFilterValue(slice)
        return
      }
    }
    dismissedRef.current = null
    setAnchorIndex(-1)
  }, [trigger, getInput])

  // Caret moves on typing, clicking, and arrowing all surface as
  // `selectionchange`; each instance only reacts while its own input is focused
  // (updateFilter guards on `document.activeElement`).
  React.useEffect(() => {
    document.addEventListener('selectionchange', updateFilter)
    return () => document.removeEventListener('selectionchange', updateFilter)
  }, [updateFilter])

  // Re-validate when the value changes from outside (controlled prop, form
  // reset) — those paths bypass onChange/selectionchange, so a stale popover
  // could otherwise linger on text that no longer exists.
  React.useEffect(() => {
    updateFilter()
  }, [inputValue, updateFilter])

  const handleChange = React.useCallback(
    (next: string) => {
      setInputValue(next)
      updateFilter()
    },
    [setInputValue, updateFilter],
  )

  // A bare Input/TextArea reports changes via the native event; a TextField
  // reports the value directly. Both feed the same handler.
  const handleNativeChange = React.useCallback(
    (event: React.ChangeEvent<MentionInputElement>) =>
      handleChange(event.target.value),
    [handleChange],
  )

  // Replace the active query (from the trigger char to the caret) with the
  // chosen mention, then drop the caret right after it.
  const insert = React.useCallback(
    (key: Key) => {
      const input = getInput()
      if (!input || anchorIndex < 0) return
      const mention = `${trigger}${getItemText(key)} `
      // Slice the DOM value so the indices (anchorIndex, selectionEnd) stay
      // consistent with the string they index.
      const text = input.value
      const prefix = text.slice(0, anchorIndex) + mention
      const suffix = text.slice(input.selectionEnd ?? anchorIndex)
      // Commit the value before moving the caret, so the caret lands after the
      // inserted text rather than at the stale position.
      flushSync(() => setInputValue(prefix + suffix))
      input.setSelectionRange(prefix.length, prefix.length)
      input.focus()
      updateFilter()
    },
    [trigger, getItemText, anchorIndex, setInputValue, updateFilter, getInput],
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

  // Close the list when the popover dismisses itself (outside press, Escape),
  // remembering the query so a caret move doesn't immediately reopen it.
  const onOpenChange = React.useCallback(
    (isOpen: boolean) => {
      if (isOpen) return
      dismissedRef.current =
        anchorIndex >= 0 ? `${anchorIndex}:${filterValue}` : null
      setAnchorIndex(-1)
    },
    [anchorIndex, filterValue],
  )

  return (
    <AutocompletePrimitive.Autocomplete
      inputValue={filterValue}
      filter={startsWith}
    >
      <Provider
        values={[
          // TextField reads TextFieldContext for value/onChange; the popover and
          // menu are wired here too. A bare TextArea/Input is wired by
          // <MentionInputWiring> below (TextField shadows that for its own child).
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
        <MentionInputWiring value={inputValue} onChange={handleNativeChange}>
          <div ref={rootRef} data-mention="" className={root({ className })}>
            {children}
          </div>
        </MentionInputWiring>
      </Provider>
    </AutocompletePrimitive.Autocomplete>
  )
}

interface MentionInputWiringProps {
  value: string
  onChange: (event: React.ChangeEvent<MentionInputElement>) => void
  children: React.ReactNode
}

/**
 * Re-applies the Autocomplete's input wiring — keyboard navigation (`onKeyDown`)
 * and the combobox ARIA (`aria-controls`/`aria-autocomplete`/
 * `aria-activedescendant`) — onto a bare `TextArea`/`Input`. React Aria provides
 * this through `FieldInputContext`, which only field components (`TextField`,
 * `SearchField`) consume; this lets the input be used without one. When a
 * `TextField` IS present it applies the wiring itself and re-provides
 * Input/TextAreaContext to its child, shadowing what we set here.
 */
function MentionInputWiring({
  value,
  onChange,
  children,
}: MentionInputWiringProps) {
  const fieldInput = React.useContext(AutocompletePrimitive.FieldInputContext)
  const wiring =
    fieldInput && typeof fieldInput === 'object' && !('slots' in fieldInput)
      ? (fieldInput as Record<string, unknown>)
      : undefined
  // Our value/onChange win over the Autocomplete's (we control the full text and
  // drive filtering ourselves); the rest of the wiring passes through.
  const inputProps = { ...wiring, value, onChange }
  return (
    <Provider
      values={[
        [InputContext, inputProps],
        [TextAreaContext, inputProps],
      ]}
    >
      {children}
    </Provider>
  )
}

export type { MentionProps }
export { Mention }
