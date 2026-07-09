'use client'

import React from 'react'
import type { Time } from '@internationalized/date'
import { ButtonContext } from 'react-aria-components/Button'
import {
  DialogContext,
  OverlayTriggerStateContext,
} from 'react-aria-components/Dialog'
import { FieldErrorContext } from 'react-aria-components/FieldError'
import { GroupContext } from 'react-aria-components/Group'
import { useLocale } from 'react-aria-components/I18nProvider'
import { InputContext } from 'react-aria-components/Input'
import { LabelContext } from 'react-aria-components/Label'
import * as ListBoxPrimitive from 'react-aria-components/ListBox'
import { PopoverContext } from 'react-aria-components/Popover'
import { Provider } from 'react-aria-components/slots'
import { TextContext } from 'react-aria-components/Text'
import { TimeFieldStateContext } from 'react-aria-components/TimeField'
import type * as TimeFieldPrimitive from 'react-aria-components/TimeField'
import { useFocusRing } from 'react-aria/useFocusRing'
import { useOverlayTrigger } from 'react-aria/useOverlayTrigger'
import { useTimeField } from 'react-aria/useTimeField'
import { useOverlayTriggerState } from 'react-stately/useOverlayTriggerState'
import { useTimeFieldState } from 'react-stately/useTimeFieldState'
import { tv } from 'tailwind-variants'

import { fieldVariants } from '@/ui/field'

interface TimePickerProps<T extends TimeFieldPrimitive.TimeValue> extends Omit<
  TimeFieldPrimitive.TimeFieldProps<T>,
  'className' | 'children'
> {
  className?: string
  children?: React.ReactNode
  /** Whether the popover is open by default (uncontrolled). */
  defaultOpen?: boolean
  /** Whether the popover is open (controlled). */
  isOpen?: boolean
  /** Handler that is called when the popover's open state changes. */
  onOpenChange?: (isOpen: boolean) => void
}

interface TimePickerColumnsProps extends React.ComponentProps<'div'> {}
const timePickerVariants = tv({
  slots: {
    columns: 'flex h-56 gap-1 p-1',
    column: [
      'flex w-14 scroll-py-1 flex-col gap-0.5 overflow-y-auto outline-hidden',
      '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    ],
    item: [
      'flex h-8 w-full shrink-0 items-center justify-center rounded-md text-sm tabular-nums no-highlight',
      'cursor-interactive outline-hidden transition-colors',
      'hover:bg-[color-mix(in_srgb,var(--color-accent)_20%,var(--color-bg))]',
      'focus-visible:focus-ring',
      'selected:bg-accent selected:text-fg-on-accent',
      'disabled:pointer-events-none disabled:text-fg-disabled',
    ],
  },
})

// Contexts the trigger provides that must NOT leak into the popover content
// (otherwise a button/label inside the columns would inherit the trigger's props).
const CLEAR_CONTEXTS = [GroupContext, ButtonContext, LabelContext, TextContext]

// A callback ref + boolean flag: lets the field detect whether a <Label> was
// rendered so the a11y wiring can fall back to aria-label when it wasn't.
const useSlot = (
  initialState: boolean,
): [(el: Element | null) => void, boolean] => {
  const [hasSlot, setHasSlot] = React.useState(initialState)
  const ref = React.useCallback((el: Element | null) => setHasSlot(!!el), [])
  return [ref, hasSlot]
}

// There is no React Aria `TimePicker` primitive, so we compose one from the
// same building blocks its `DatePicker` uses: a shared `TimeFieldState` drives
// the editable segments (`DateInput`) and the popover columns, while an overlay
// trigger state drives the popover. Both are exposed to children through the
// same contexts `DatePicker` provides, so the composition reads identically.
const TimePicker = <T extends TimeFieldPrimitive.TimeValue>({
  className,
  children,
  isOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: TimePickerProps<T>) => {
  const fieldStyles = fieldVariants
  const { locale } = useLocale()

  const state = useTimeFieldState<T>({ ...props, locale })
  const overlayState = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  })

  const groupRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [labelRef, label] = useSlot(
    !props['aria-label'] && !props['aria-labelledby'],
  )

  const {
    labelProps,
    fieldProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useTimeField({ ...props, label, inputRef }, state, groupRef)

  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    overlayState,
    groupRef,
  )

  const { isFocused, isFocusVisible, focusProps } = useFocusRing({
    within: true,
  })

  return (
    <Provider
      values={[
        [TimeFieldStateContext, state],
        [
          GroupContext,
          {
            ...fieldProps,
            ref: groupRef,
            isInvalid: state.isInvalid,
            isDisabled: state.isDisabled,
          },
        ],
        [InputContext, { ...inputProps, ref: inputRef }],
        [
          ButtonContext,
          {
            ...triggerProps,
            isDisabled: state.isDisabled,
            isPressed: overlayState.isOpen,
          },
        ],
        [LabelContext, { ...labelProps, ref: labelRef, elementType: 'span' }],
        [OverlayTriggerStateContext, overlayState],
        [
          PopoverContext,
          {
            trigger: 'TimePicker',
            triggerRef: groupRef,
            placement: 'bottom start',
            clearContexts: CLEAR_CONTEXTS,
          },
        ],
        [DialogContext, overlayProps],
        [
          TextContext,
          {
            slots: {
              description: descriptionProps,
              errorMessage: errorMessageProps,
            },
          },
        ],
        [FieldErrorContext, validation],
      ]}
    >
      <div
        {...focusProps}
        data-time-picker=""
        data-focus-within={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-open={overlayState.isOpen || undefined}
        data-disabled={state.isDisabled || undefined}
        data-invalid={state.isInvalid || undefined}
        data-readonly={state.isReadOnly || undefined}
        data-required={state.isRequired || undefined}
        className={fieldStyles().field({ className })}
      >
        {children}
      </div>
    </Provider>
  )
}

interface TimeColumnOption {
  id: string
  label: string
}

const range = (length: number, offset = 0): number[] =>
  Array.from({ length }, (_, i) => i + offset)

const pad = (value: number): string => String(value).padStart(2, '0')

const TimePickerColumns = ({ className, ...props }: TimePickerColumnsProps) => {
  const state = React.useContext(TimeFieldStateContext)
  const { columns } = timePickerVariants()

  if (!state) return null

  const time = state.timeValue
  const use12Hour = state.segments.some((s) => s.type === 'dayPeriod')
  const showMinutes =
    state.granularity === 'minute' || state.granularity === 'second'
  const showSeconds = state.granularity === 'second'

  const isImmutable = state.isDisabled || state.isReadOnly
  const update = (fields: {
    hour?: number
    minute?: number
    second?: number
  }) => {
    if (isImmutable) return
    // Every TimeValue member (Time / CalendarDateTime / ZonedDateTime) implements
    // `.set`; the `as Time` cast satisfies the union-method call while the real
    // object handles the update, preserving date/zone for non-Time values.
    const base = (state.value ?? state.timeValue) as Time
    state.setValue(base.set(fields) as never)
  }

  const period = time.hour >= 12 ? 'PM' : 'AM'
  const displayHour = time.hour % 12 === 0 ? 12 : time.hour % 12

  const hourOptions: TimeColumnOption[] = use12Hour
    ? range(12, 1).map((h) => ({ id: String(h), label: String(h) }))
    : range(24).map((h) => ({ id: String(h), label: pad(h) }))
  const minuteOptions = range(60).map((m) => ({
    id: String(m),
    label: pad(m),
  }))
  const secondOptions = range(60).map((s) => ({
    id: String(s),
    label: pad(s),
  }))

  return (
    <div
      data-time-picker-columns=""
      className={columns({ className })}
      {...props}
    >
      <TimeColumn
        label="Hour"
        options={hourOptions}
        selectedKey={use12Hour ? String(displayHour) : String(time.hour)}
        onSelect={(id) => {
          const value = Number(id)
          update({
            hour: use12Hour ? (value % 12) + (period === 'PM' ? 12 : 0) : value,
          })
        }}
      />
      {showMinutes && (
        <TimeColumn
          label="Minute"
          options={minuteOptions}
          selectedKey={String(time.minute)}
          onSelect={(id) => update({ minute: Number(id) })}
        />
      )}
      {showSeconds && (
        <TimeColumn
          label="Second"
          options={secondOptions}
          selectedKey={String(time.second)}
          onSelect={(id) => update({ second: Number(id) })}
        />
      )}
      {use12Hour && (
        <TimeColumn
          label="AM/PM"
          options={[
            { id: 'AM', label: 'AM' },
            { id: 'PM', label: 'PM' },
          ]}
          selectedKey={period}
          onSelect={(id) => {
            if (id === 'AM' && time.hour >= 12) update({ hour: time.hour - 12 })
            if (id === 'PM' && time.hour < 12) update({ hour: time.hour + 12 })
          }}
        />
      )}
    </div>
  )
}

interface TimeColumnProps {
  label: string
  options: TimeColumnOption[]
  selectedKey: string
  onSelect: (id: string) => void
}

const TimeColumn = ({
  label,
  options,
  selectedKey,
  onSelect,
}: TimeColumnProps) => {
  const { column, item } = timePickerVariants()
  const ref = React.useRef<HTMLDivElement>(null)

  // Center the selected value when the popover opens.
  React.useEffect(() => {
    const container = ref.current
    const selected = container?.querySelector<HTMLElement>(
      '[data-selected="true"]',
    )
    if (!container || !selected) return
    const containerRect = container.getBoundingClientRect()
    const selectedRect = selected.getBoundingClientRect()
    container.scrollTop +=
      selectedRect.top -
      containerRect.top -
      (container.clientHeight - selected.clientHeight) / 2
  }, [])

  return (
    <ListBoxPrimitive.ListBox
      ref={ref}
      data-time-picker-column=""
      aria-label={label}
      className={column()}
      selectionMode="single"
      selectionBehavior="replace"
      disallowEmptySelection
      shouldFocusWrap
      selectedKeys={[selectedKey]}
      onSelectionChange={(keys) => {
        if (keys === 'all') return
        const id = [...keys][0]
        if (id != null) onSelect(String(id))
      }}
    >
      {options.map((option) => (
        <ListBoxPrimitive.ListBoxItem
          key={option.id}
          id={option.id}
          data-time-picker-item=""
          textValue={option.label}
          className={item()}
        >
          {option.label}
        </ListBoxPrimitive.ListBoxItem>
      ))}
    </ListBoxPrimitive.ListBox>
  )
}

export type { TimePickerColumnsProps, TimePickerProps }
export { TimePicker, TimePickerColumns }
