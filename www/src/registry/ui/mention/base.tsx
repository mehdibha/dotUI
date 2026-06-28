'use client'

import * as React from 'react'
import { flushSync } from 'react-dom'
import { chain } from 'react-aria'
import * as AutocompletePrimitive from 'react-aria-components/Autocomplete'
import type { Key } from 'react-aria-components/Menu'
import { useControlledState } from 'react-stately/useControlledState'

import { Description, Label } from '@/registry/ui/field'
import { TextArea } from '@/registry/ui/input'
import type { TextAreaProps } from '@/registry/ui/input'
import {
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from '@/registry/ui/menu'
import type { MenuContentProps } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import type { PopoverProps } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'

import { useStyles } from './styles'

// MARK: mentionStyles

// MARK: getCaretRect

// Box + text metrics copied from the textarea onto the measuring mirror so its
// text wraps and lays out identically.
const CARET_MIRROR_PROPS = [
  'box-sizing',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'font-variant',
  'font-stretch',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-align',
  'text-indent',
  'text-transform',
  'tab-size',
  'word-break',
  'overflow-wrap',
]

/**
 * Measure where the caret sits inside a textarea, relative to the textarea's
 * border box. A textarea exposes no caret geometry, so we render an off-screen
 * mirror `<div>` that copies the textarea's box + text metrics, place a marker
 * span at the caret offset, and read the marker's position. Used to anchor the
 * suggestions popover at the trigger character rather than the field's edge.
 */
function getCaretRect(input: HTMLTextAreaElement, index: number) {
  const doc = input.ownerDocument
  const win = doc.defaultView ?? window
  const computed = win.getComputedStyle(input)

  const mirror = doc.createElement('div')
  const { style } = mirror
  style.position = 'absolute'
  style.top = '0'
  style.left = '-9999px'
  style.visibility = 'hidden'
  style.whiteSpace = 'pre-wrap'
  style.overflowWrap = 'break-word'
  for (const prop of CARET_MIRROR_PROPS) {
    style.setProperty(prop, computed.getPropertyValue(prop))
  }
  // Wrap at the same width as the textarea's content box so line breaks fall in
  // the same places.
  style.width = `${input.clientWidth}px`
  style.height = 'auto'

  mirror.textContent = input.value.slice(0, index)
  const marker = doc.createElement('span')
  // A non-empty marker keeps a measurable box even at the start of a line.
  marker.textContent = input.value.slice(index) || '.'
  mirror.appendChild(marker)
  doc.body.appendChild(mirror)

  const top =
    marker.offsetTop + parseInt(computed.borderTopWidth, 10) - input.scrollTop
  const left =
    marker.offsetLeft +
    parseInt(computed.borderLeftWidth, 10) -
    input.scrollLeft
  const height = parseInt(computed.lineHeight, 10) || marker.offsetHeight

  doc.body.removeChild(mirror)
  return { top, left, height }
}

// MARK: MentionContext

interface MentionContextValue {
  trigger: string
  inputValue: string
  setInputValue: (value: string) => void
  filterValue: string
  anchorIndex: number
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  updateFilter: () => void
  insert: (key: Key) => void
}

const MentionContext = React.createContext<MentionContextValue | null>(null)

function useMentionContext(component: string) {
  const context = React.useContext(MentionContext)
  if (!context) {
    throw new Error(`<${component}> must be rendered inside a <Mention>.`)
  }
  return context
}

// MARK: Mention

interface MentionProps {
  /** The character that opens the suggestions list. @default "@" */
  trigger?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /**
   * Maps the key of a selected `MentionItem` to the text inserted after the
   * trigger character. @default String(key)
   */
  getItemText?: (key: Key) => string
  className?: string
  children?: React.ReactNode
}

function Mention({
  trigger = '@',
  value,
  defaultValue,
  onChange,
  getItemText = (key) => String(key),
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
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null)

  // Reads the caret position to decide whether the user is mid-mention: find the
  // nearest preceding trigger char, and if the text between it and the caret has
  // no whitespace, that's the active query. Otherwise close the list.
  const updateFilter = React.useCallback(() => {
    const input = inputRef.current
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
  }, [trigger])

  // Replace the active query (from the trigger char to the caret) with the
  // chosen mention, then drop the caret right after it.
  const insert = React.useCallback(
    (key: Key) => {
      const input = inputRef.current
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
    ],
  )

  const context = React.useMemo<MentionContextValue>(
    () => ({
      trigger,
      inputValue,
      setInputValue,
      filterValue,
      anchorIndex,
      inputRef,
      updateFilter,
      insert,
    }),
    [
      trigger,
      inputValue,
      setInputValue,
      filterValue,
      anchorIndex,
      updateFilter,
      insert,
    ],
  )

  return (
    <MentionContext.Provider value={context}>
      <AutocompletePrimitive.Autocomplete
        inputValue={filterValue}
        filter={startsWith}
      >
        <div data-mention="" className={root({ className })}>
          {children}
        </div>
      </AutocompletePrimitive.Autocomplete>
    </MentionContext.Provider>
  )
}

// MARK: MentionInput

interface MentionInputProps extends Omit<
  TextAreaProps,
  'value' | 'defaultValue' | 'onChange'
> {
  label?: React.ReactNode
  description?: React.ReactNode
  fieldClassName?: string
}

function MentionInput({
  label,
  description,
  fieldClassName,
  onSelect,
  onBlur,
  ...props
}: MentionInputProps) {
  const { inputValue, setInputValue, inputRef, updateFilter } =
    useMentionContext('MentionInput')
  return (
    <TextField
      className={fieldClassName ?? 'w-full'}
      value={inputValue}
      onChange={(value) => {
        setInputValue(value)
        updateFilter()
      }}
    >
      {label != null && <Label>{label}</Label>}
      <TextArea
        ref={inputRef}
        onSelect={chain(onSelect, updateFilter)}
        onBlur={chain(onBlur, updateFilter)}
        {...props}
      />
      {description != null && <Description>{description}</Description>}
    </TextField>
  )
}

// MARK: MentionList

interface MentionListProps<T extends object> extends Omit<
  MenuContentProps<T>,
  'onAction'
> {
  /** Where the popover is placed relative to the caret. @default "bottom start" */
  placement?: PopoverProps['placement']
  /**
   * Called with the key of the selected item. Defaults to inserting
   * `trigger + getItemText(key) + " "` at the trigger position.
   */
  onAction?: (key: Key) => void
}

function MentionList<T extends object>({
  placement = 'bottom start',
  onAction,
  ...props
}: MentionListProps<T>) {
  const { inputRef, anchorIndex, insert } = useMentionContext('MentionList')
  return (
    <Popover
      triggerRef={inputRef}
      isOpen={anchorIndex >= 0}
      isNonModal
      placement={placement}
      trigger="MenuTrigger"
      getTargetRect={(target) => {
        const input = inputRef.current
        if (!input) return target.getBoundingClientRect()
        const caret = getCaretRect(input, anchorIndex)
        const rect = input.getBoundingClientRect()
        return new DOMRect(
          rect.left + caret.left,
          rect.top + caret.top,
          1,
          caret.height,
        )
      }}
    >
      <MenuContent onAction={onAction ?? insert} {...props} />
    </Popover>
  )
}

// MARK: exports

export type { MentionProps, MentionInputProps, MentionListProps }
export {
  Mention,
  MentionInput,
  MentionList,
  MenuItem as MentionItem,
  MenuSection as MentionSection,
  MenuSectionHeader as MentionSectionHeader,
}
