"use client"

import * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as TextAreaPrimitive from "react-aria-components/TextArea"
import { mergeRefs } from "react-aria/mergeRefs"
import { useLayoutEffect } from "react-aria/private/utils/useLayoutEffect"
import { useControlledState } from "react-stately/useControlledState"

import { ArrowUpIcon, SquareIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import type { ButtonProps } from "@/registry/ui/button"

import { useStyles } from "./styles"

type ComposerStatus = "idle" | "submitted" | "streaming"

interface ComposerContextValue {
  value: string
  setValue: (value: string) => void
  isEmpty: boolean
  isDisabled: boolean
  status: ComposerStatus
  submit: () => void
  stop?: () => void
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>
}

const ComposerContext = React.createContext<ComposerContextValue | null>(null)

function useComposer() {
  const context = React.use(ComposerContext)
  if (!context) throw new Error("useComposer must be used within a Composer")
  return context
}

// MARK: Separator

interface ComposerProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "onChange"
> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onStop?: () => void
  status?: ComposerStatus
  isDisabled?: boolean
}

function Composer({
  className,
  value: valueProp,
  defaultValue = "",
  onChange,
  onSubmit,
  onStop,
  status = "idle",
  isDisabled = false,
  children,
  ...props
}: ComposerProps) {
  const { root } = useStyles()()
  const [value, setValue] = useControlledState(
    valueProp,
    defaultValue,
    onChange,
  )
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
  const isEmpty = value.trim() === ""

  const submit = () => {
    if (isEmpty || isDisabled || status !== "idle") return
    onSubmit?.(value)
    setValue("")
  }

  return (
    <ComposerContext.Provider
      value={{
        value,
        setValue,
        isEmpty,
        isDisabled,
        status,
        submit,
        stop: onStop,
        textAreaRef,
      }}
    >
      <form
        data-composer=""
        data-status={status}
        className={root({ className })}
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        onPointerDown={(event) => {
          const target = event.target as HTMLElement
          if (target.closest("button,a,input,textarea,[role='button']")) return
          event.preventDefault()
          textAreaRef.current?.focus()
        }}
        {...props}
      >
        {children}
      </form>
    </ComposerContext.Provider>
  )
}

// MARK: Separator

interface ComposerTextAreaProps extends Omit<
  React.ComponentProps<typeof TextAreaPrimitive.TextArea>,
  "value" | "defaultValue" | "onChange"
> {}

function ComposerTextArea({
  ref,
  className,
  onKeyDown,
  ...props
}: ComposerTextAreaProps) {
  const { textArea } = useStyles()()
  const { value, setValue, submit, isDisabled, textAreaRef } = useComposer()

  // Grow with the content; the max-height class caps it and the rest scrolls.
  useLayoutEffect(() => {
    const input = textAreaRef.current
    if (!input) return
    input.style.height = "auto"
    input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`
  }, [value, textAreaRef])

  return (
    <TextAreaPrimitive.TextArea
      ref={mergeRefs(textAreaRef, ref as React.Ref<HTMLTextAreaElement>)}
      data-slot="composer-textarea"
      rows={1}
      value={value}
      disabled={isDisabled}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        // Enter sends on a keyboard; touch keyboards keep Return for new lines.
        const coarse = window.matchMedia("(pointer: coarse)").matches
        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          !event.nativeEvent.isComposing &&
          !coarse
        ) {
          event.preventDefault()
          submit()
        }
      }}
      className={composeRenderProps(className, (cn) =>
        textArea({ className: cn }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface ComposerToolbarProps extends React.ComponentProps<"div"> {}

function ComposerToolbar({ className, ...props }: ComposerToolbarProps) {
  const { toolbar } = useStyles()()
  return (
    <div
      data-slot="composer-toolbar"
      className={toolbar({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ComposerSubmitProps extends ButtonProps {}

function ComposerSubmit({
  className,
  children,
  onPress,
  ...props
}: ComposerSubmitProps) {
  const { submit } = useStyles()()
  const { isEmpty, isDisabled, status, stop } = useComposer()
  const busy = status !== "idle"

  return (
    <Button
      data-slot="composer-submit"
      type={busy ? "button" : "submit"}
      variant="primary"
      isIconOnly
      aria-label={busy ? "Stop" : "Send"}
      // Keep focus (and the software keyboard) in the text area: a blur
      // would close the keyboard and shift the layout mid-tap.
      preventFocusOnPress
      isDisabled={isDisabled || (busy ? !stop : isEmpty)}
      onPress={(event) => {
        onPress?.(event)
        if (busy) stop?.()
      }}
      className={composeRenderProps(className, (cn) =>
        submit({ className: cn }),
      )}
      {...props}
    >
      {children ??
        (busy ? <SquareIcon className="fill-current" /> : <ArrowUpIcon />)}
    </Button>
  )
}

export type {
  ComposerProps,
  ComposerStatus,
  ComposerSubmitProps,
  ComposerTextAreaProps,
  ComposerToolbarProps,
}
export {
  Composer,
  ComposerSubmit,
  ComposerTextArea,
  ComposerToolbar,
  useComposer,
}
