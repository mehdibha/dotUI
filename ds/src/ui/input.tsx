'use client'

import React, { useCallback } from 'react'
import { chain } from 'react-aria'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as DateFieldPrimitive from 'react-aria-components/DateField'
import * as GroupPrimitive from 'react-aria-components/Group'
import * as InputPrimitive from 'react-aria-components/Input'
import * as TextAreaPrimitive from 'react-aria-components/TextArea'
import { mergeRefs } from 'react-aria/mergeRefs'
import { getEventTarget } from 'react-aria/private/utils/shadowdom/DOMFunctions'
import { useLayoutEffect } from 'react-aria/private/utils/useLayoutEffect'
import { useControlledState } from 'react-stately/useControlledState'
import { tv, type VariantProps } from 'tailwind-variants'

const inputVariants = tv({
  slots: {
    inputGroup: [
      'group/input-group relative flex h-(--input-h) w-full min-w-0 cursor-text items-center',
      '**:data-input-control:flex-1 **:data-input-control:rounded-none **:data-input-control:border-0 **:data-input-control:bg-transparent **:data-input-control:ring-0',
      '**:data-date-input:px-0 **:data-input:px-0',
      'has-data-textarea:h-auto has-data-textarea:flex-col **:data-textarea:w-full',
      'has-data-input:has-[[data-input-group-addon]:first-child]:pl-0 has-data-input:has-[[data-input-group-addon]:last-child]:pr-0',
      'has-data-textarea:px-0',
      'disabled:cursor-disabled disabled:text-fg-disabled',
      'has-data-combobox-value:h-auto has-data-combobox-value:min-h-(--input-h) has-data-combobox-value:flex-wrap has-data-combobox-value:items-center has-data-combobox-value:gap-1 has-data-combobox-value:py-(--addon-button-inset) has-data-combobox-value:pl-(--addon-button-inset) **:data-combobox-value:contents has-data-combobox-value:has-[[data-tag-list][data-empty]]:**:data-input:pl-(--edge-to-text) **:data-tag:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] **:data-tag:rounded-[calc(var(--input-radius)-(var(--addon-button-inset)-1px))] **:data-tag-group:contents **:data-tag-list:contents',
      'text-base sm:text-sm',
      'rounded-(--input-radius) border border-border-field bg-field px-(--edge-to-text) transition-[box-shadow,border-color,color] group-focus/combobox:ring-2 group-focus/combobox:not-invalid:border-border-focus group-focus/combobox:not-invalid:ring-border-focus-muted invalid:border-border-danger invalid:ring-danger-muted disabled:border-border-disabled disabled:bg-disabled has-[[data-input-control][data-focused]]:ring-2 has-[[data-input-control][data-focused]]:not-invalid:border-border-focus has-[[data-input-control][data-focused]]:not-invalid:ring-border-focus-muted',
    ],
    inputGroupAddon: [
      'flex cursor-text items-center justify-center gap-(--addon-gap) select-none',
      'text-fg-muted *:[svg]:not-with-[size]:size-(--icon-size)',
      'group-has-data-textarea/input-group:w-full group-has-data-textarea/input-group:justify-start',
      '**:data-button:rounded-[max(var(--radius-sm),calc(var(--input-radius)-(var(--addon-button-inset)-1px)))] group-has-data-input/input-group:**:data-button:h-[calc(var(--input-h)-var(--addon-button-inset)*2)] group-has-data-input/input-group:**:[[data-button][data-icon-only]]:w-[calc(var(--input-h)-var(--addon-button-inset)*2)]',
      'group-has-data-textarea/input-group:px-(--edge-to-text)',
      'group-has-data-textarea/input-group:first:pt-(--edge-to-text) group-has-data-textarea/input-group:last:pb-(--edge-to-text)',
      'group-has-data-textarea/input-group:first:[&.border-b]:pb-(--edge-to-text) group-has-data-textarea/input-group:last:[&.border-t]:pt-(--edge-to-text)',
      'group-has-data-textarea/input-group:has-[[data-button]:first-child]:pl-(--top-to-text) group-has-data-textarea/input-group:has-[[data-button]:last-child]:pr-(--top-to-text)',
      'group-has-data-textarea/input-group:has-data-button:first:pt-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:pb-(--top-to-text)',
      'group-has-data-textarea/input-group:has-data-button:first:[&.border-b]:pb-(--top-to-text) group-has-data-textarea/input-group:has-data-button:last:[&.border-t]:pt-(--top-to-text)',
      'group-has-data-input/input-group:first:px-[var(--edge-to-visual)_var(--text-to-visual)] group-has-data-input/input-group:last:px-[var(--text-to-visual)_var(--edge-to-visual)] group-has-data-input/input-group:has-data-button:first:pl-[calc(var(--addon-button-inset)-1px)] group-has-data-input/input-group:has-data-button:last:pr-[calc(var(--addon-button-inset)-1px)]',
    ],
    input: [
      'inline-flex w-full cursor-text items-center outline-none',
      'h-(--input-h) in-data-input-group:h-auto',
      'disabled:cursor-disabled disabled:text-fg-disabled',
      'text-base sm:text-sm',
      'rounded-(--input-radius) border border-border-field bg-field px-(--edge-to-text) transition-[box-shadow,border-color,color] invalid:border-border-danger invalid:ring-danger-muted focus:ring-2 focus:not-invalid:border-border-focus focus:not-invalid:ring-border-focus-muted disabled:border-border-disabled disabled:bg-disabled',
    ],
    textArea: [
      'min-h-16 w-full resize-none py-(--top-to-text) outline-none',
      'disabled:cursor-disabled disabled:text-fg-disabled',
      'text-base sm:text-sm',
      'rounded-(--input-radius) border border-border-field bg-field px-(--edge-to-text) transition-[box-shadow,border-color,color] invalid:border-border-danger invalid:ring-danger-muted focus:ring-2 focus:not-invalid:border-border-focus focus:not-invalid:ring-border-focus-muted disabled:border-border-disabled disabled:bg-disabled',
    ],
    dateInputSegment:
      'rounded px-0.5 outline-hidden select-none placeholder-shown:not-data-disabled:not-data-focused:text-fg-muted focus:bg-accent focus:text-fg-on-accent focus:caret-transparent disabled:text-fg-disabled type-literal:px-0',
  },
  variants: {
    size: {
      sm: {
        inputGroup:
          '[--addon-button-inset:--spacing(1)] [--addon-gap:--spacing(1)] [--edge-to-text:--spacing(2)] [--edge-to-visual:--spacing(1.5)] [--icon-size:--spacing(3.5)] [--input-h:--spacing(7)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]',
        input:
          '[--addon-button-inset:--spacing(1)] [--addon-gap:--spacing(1)] [--edge-to-text:--spacing(2)] [--edge-to-visual:--spacing(1.5)] [--icon-size:--spacing(3.5)] [--input-h:--spacing(7)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]',
        textArea:
          '[--addon-button-inset:--spacing(1)] [--addon-gap:--spacing(1)] [--edge-to-text:--spacing(2)] [--edge-to-visual:--spacing(1.5)] [--icon-size:--spacing(3.5)] [--input-h:--spacing(7)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]',
      },
      md: {
        inputGroup:
          '[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(8)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]',
        input:
          '[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(8)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]',
        textArea:
          '[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(8)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]',
      },
      lg: {
        inputGroup:
          '[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(9)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]',
        input:
          '[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(9)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]',
        textArea:
          '[--addon-button-inset:--spacing(1.5)] [--addon-gap:--spacing(2)] [--edge-to-text:--spacing(2.5)] [--edge-to-visual:--spacing(2)] [--icon-size:--spacing(4)] [--input-h:--spacing(9)] [--text-to-visual:--spacing(1.5)] [--top-to-text:--spacing(2)]',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface InputGroupProps
  extends
    React.ComponentProps<typeof GroupPrimitive.Group>,
    VariantProps<typeof inputVariants> {}

const INTERACTIVE_SELECTOR = "button,input,textarea,[role='button']"

const focusInnerInput = (group: HTMLElement) => {
  ;(group.querySelector('input, textarea') as HTMLElement | null)?.focus()
}

const InputGroup = ({
  className,
  size,
  onPointerDown,
  onTouchEnd,
  ...props
}: InputGroupProps) => {
  const { inputGroup } = inputVariants()
  return (
    <GroupPrimitive.Group
      data-input-group=""
      data-size={size}
      onPointerDown={(e) => {
        onPointerDown?.(e)
        if (e.defaultPrevented || e.pointerType !== 'mouse') return
        const target = getEventTarget(e) as Element
        if (target.closest(INTERACTIVE_SELECTOR)) return
        e.preventDefault()
        focusInnerInput(e.currentTarget)
      }}
      onTouchEnd={(e) => {
        onTouchEnd?.(e)
        if (e.defaultPrevented) return
        const target = getEventTarget(e) as HTMLElement
        if (target.isContentEditable || target.closest(INTERACTIVE_SELECTOR))
          return
        e.preventDefault()
        focusInnerInput(e.currentTarget)
      }}
      className={composeRenderProps(className, (className) =>
        inputGroup({ className, size }),
      )}
      {...props}
    />
  )
}

interface InputProps
  extends
    Omit<React.ComponentProps<typeof InputPrimitive.Input>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = ({ className, size, ...props }: InputProps) => {
  const { input } = inputVariants()
  return (
    <InputPrimitive.Input
      data-input=""
      data-size={size}
      data-input-control=""
      className={composeRenderProps(className, (className) =>
        input({ className, size }),
      )}
      {...props}
    />
  )
}

interface TextAreaProps extends React.ComponentProps<
  typeof TextAreaPrimitive.TextArea
> {}

const TextArea = ({ ref, className, onChange, ...props }: TextAreaProps) => {
  const { textArea } = inputVariants()
  const [inputValue, setInputValue] = useControlledState(
    props.value,
    props.defaultValue ?? '',
    () => {},
  )
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const onHeightChange = useCallback(() => {
    if (inputRef.current) {
      const input = inputRef.current
      const prevAlignment = input.style.alignSelf
      const prevOverflow = input.style.overflow
      const prevFlex = input.style.flex

      const isFirefox = 'MozAppearance' in input.style
      if (!isFirefox) {
        input.style.overflow = 'hidden'
      }
      input.style.flex = 'none'
      input.style.alignSelf = 'start'
      input.style.height = 'auto'
      input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`
      input.style.overflow = prevOverflow
      input.style.alignSelf = prevAlignment
      input.style.flex = prevFlex
    }
  }, [])

  useLayoutEffect(() => {
    if (inputRef.current) {
      onHeightChange()
    }
  }, [onHeightChange, inputValue, inputRef])

  return (
    <TextAreaPrimitive.TextArea
      ref={mergeRefs(
        inputRef,
        ref as React.RefObject<HTMLTextAreaElement | null>,
      )}
      data-textarea=""
      data-input-control=""
      onChange={chain(onChange, setInputValue)}
      className={composeRenderProps(className, (className) =>
        textArea({ className }),
      )}
      {...props}
    />
  )
}

interface InputGroupAddonProps extends React.ComponentProps<'div'> {}

function InputGroupAddon({ className, ...props }: InputGroupAddonProps) {
  const { inputGroupAddon } = inputVariants()
  return (
    <div
      data-input-group-addon=""
      className={inputGroupAddon({ className })}
      {...props}
    />
  )
}

interface DateInputProps
  extends
    Omit<DateFieldPrimitive.DateInputProps, 'children'>,
    VariantProps<typeof inputVariants> {
  children?: DateFieldPrimitive.DateInputProps['children']
}

const DateInput = ({ className, size, ...props }: DateInputProps) => {
  const { input } = inputVariants()
  return (
    <DateFieldPrimitive.DateInput
      data-input=""
      data-date-input=""
      data-input-control=""
      data-size={size}
      className={composeRenderProps(className, (className) =>
        input({ className, size }),
      )}
      {...props}
    >
      {(segment) => <DateSegment segment={segment} />}
    </DateFieldPrimitive.DateInput>
  )
}

interface DateSegmentProps extends React.ComponentProps<
  typeof DateFieldPrimitive.DateSegment
> {}

// Date/time segments are formatted with `Intl`, whose separator whitespace differs between the
// Node SSR runtime and the browser: e.g. the AM/PM separator is a narrow no-break space (U+202F)
// on Node but a regular space in the browser, and date ranges use a thin space (U+2009). Folding
// these exotic spaces to a regular space makes server and client render identical text, which
// avoids a hydration mismatch on the literal segments.
const normalizeSegmentWhitespace = (text: string) =>
  text.replace(/[\u00A0\u2007\u2009\u202F]/g, ' ')

const DateSegment = ({ className, ...props }: DateSegmentProps) => {
  const { dateInputSegment } = inputVariants()
  return (
    <DateFieldPrimitive.DateSegment
      className={composeRenderProps(className, (className) =>
        dateInputSegment({ className }),
      )}
      {...props}
    >
      {({ text }) => normalizeSegmentWhitespace(text)}
    </DateFieldPrimitive.DateSegment>
  )
}

export type {
  DateInputProps,
  DateSegmentProps,
  InputGroupAddonProps,
  InputGroupProps,
  InputProps,
  TextAreaProps,
}
export {
  DateInput,
  DateSegment,
  Input,
  InputGroup,
  InputGroupAddon,
  inputVariants,
  TextArea,
}
