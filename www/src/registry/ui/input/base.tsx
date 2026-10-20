"use client"

import * as React from "react"
import { chain } from "react-aria"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as DateFieldPrimitives from "react-aria-components/DateField"
import * as GroupPrimitives from "react-aria-components/Group"
import * as InputPrimitives from "react-aria-components/Input"
import * as TextAreaPrimitives from "react-aria-components/TextArea"
import { mergeRefs } from "react-aria/mergeRefs"
import { getEventTarget } from "react-aria/private/utils/shadowdom/DOMFunctions"
import { useLayoutEffect } from "react-aria/private/utils/useLayoutEffect"
import { useControlledState } from "react-stately/useControlledState"
import type { VariantProps } from "tailwind-variants"

import { type InputStyles, useStyles } from "./styles"

export { inputStyles } from "./styles"

// MARK: Separator

type InputSize = Pick<VariantProps<InputStyles>, "size">

interface InputGroupProps
  extends React.ComponentProps<typeof GroupPrimitives.Group>, InputSize {}

const INTERACTIVE_SELECTOR = "button,input,textarea,[role='button']"

const focusInnerInput = (group: HTMLElement) => {
  ;(group.querySelector("input, textarea") as HTMLElement | null)?.focus()
}

const InputGroup = ({
  className,
  size,
  onPointerDown,
  onTouchEnd,
  ...props
}: InputGroupProps) => {
  const { inputGroup } = useStyles()()
  return (
    <GroupPrimitives.Group
      data-input-group=""
      data-size={size}
      onPointerDown={(e) => {
        onPointerDown?.(e)
        if (e.defaultPrevented || e.pointerType !== "mouse") return
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

// MARK: Separator

interface InputProps
  extends
    Omit<React.ComponentProps<typeof InputPrimitives.Input>, "size">,
    InputSize {}

const Input = ({ className, size, ...props }: InputProps) => {
  const { input } = useStyles()()
  return (
    <InputPrimitives.Input
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

// MARK: Separator

interface TextAreaProps extends React.ComponentProps<
  typeof TextAreaPrimitives.TextArea
> {}

const TextArea = ({ ref, className, onChange, ...props }: TextAreaProps) => {
  const { textArea } = useStyles()()
  const [inputValue, setInputValue] = useControlledState(
    props.value,
    props.defaultValue ?? "",
    () => {},
  )
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const onHeightChange = React.useCallback(() => {
    if (inputRef.current) {
      const input = inputRef.current
      const prevAlignment = input.style.alignSelf
      const prevOverflow = input.style.overflow
      const prevFlex = input.style.flex

      const isFirefox = "MozAppearance" in input.style
      if (!isFirefox) {
        input.style.overflow = "hidden"
      }
      input.style.flex = "none"
      input.style.alignSelf = "start"
      input.style.height = "auto"
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
    <TextAreaPrimitives.TextArea
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

// MARK: Separator

interface InputGroupAddonProps
  extends
    React.ComponentProps<"div">,
    Pick<VariantProps<InputStyles>, "variant"> {}

const InputGroupAddon = ({
  className,
  variant,
  ...props
}: InputGroupAddonProps) => {
  const { inputGroupAddon } = useStyles()()
  return (
    <div
      data-input-group-addon=""
      className={inputGroupAddon({ className, variant })}
      {...props}
    />
  )
}

// MARK: Separator

interface DateInputProps
  extends Omit<DateFieldPrimitives.DateInputProps, "children">, InputSize {
  children?: DateFieldPrimitives.DateInputProps["children"]
}

const DateInput = ({ className, size, ...props }: DateInputProps) => {
  const { input } = useStyles()()
  return (
    <DateFieldPrimitives.DateInput
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
    </DateFieldPrimitives.DateInput>
  )
}

// MARK: Separator

interface DateSegmentProps extends React.ComponentProps<
  typeof DateFieldPrimitives.DateSegment
> {}

// Intl's separator whitespace (U+202F, U+2009) differs between Node and the browser; folding it to a plain space avoids hydration mismatches.
const normalizeSegmentWhitespace = (text: string) =>
  text.replace(/[\u00A0\u2007\u2009\u202F]/g, " ")

const DateSegment = ({ className, ...props }: DateSegmentProps) => {
  const { dateInputSegment } = useStyles()()
  return (
    <DateFieldPrimitives.DateSegment
      className={composeRenderProps(className, (className) =>
        dateInputSegment({ className }),
      )}
      {...props}
    >
      {({ text }) => normalizeSegmentWhitespace(text)}
    </DateFieldPrimitives.DateSegment>
  )
}

// MARK: Separator

export type {
  DateInputProps,
  DateSegmentProps,
  InputGroupAddonProps,
  InputGroupProps,
  InputProps,
  TextAreaProps,
}
export { DateInput, DateSegment, Input, InputGroup, InputGroupAddon, TextArea }
