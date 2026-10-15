"use client"

import type * as React from "react"
import {
  Token as TokenPrimitive,
  TokenField as TokenFieldPrimitive,
  TokenInput as TokenInputPrimitive,
} from "react-aria-components/TokenField"
import type {
  TokenFieldProps as TokenFieldPrimitiveProps,
  TokenInputProps as TokenInputPrimitiveProps,
  TokenProps as TokenPrimitiveProps,
} from "react-aria-components/TokenField"

import { useStyles as useInputStyles } from "@/registry/ui/input/styles"

import { useStyles } from "./styles"

// MARK: tokenFieldStyles

// MARK: TokenField

interface TokenFieldProps extends Omit<
  TokenFieldPrimitiveProps,
  "className" | "style"
> {
  ref?: React.Ref<HTMLDivElement>
  className?: string
}

/** A field for text with inline tokens; compose a `TokenInput` for the editable area. */
function TokenField({ className, ...props }: TokenFieldProps) {
  const { root } = useStyles()()
  return <TokenFieldPrimitive className={root({ className })} {...props} />
}

// MARK: TokenInput

interface TokenInputProps extends Omit<
  TokenInputPrimitiveProps,
  "children" | "className" | "style"
> {
  /** Text shown while the field is empty. */
  placeholder?: string
  className?: string
  /** Renders each inline token. @default a `Token` with the segment's text */
  children?: TokenInputPrimitiveProps["children"]
}

/** The content-editable area of a `TokenField`. */
function TokenInput({
  placeholder,
  className,
  children,
  ...props
}: TokenInputProps) {
  const { input } = useStyles()()
  const { textArea } = useInputStyles()()
  return (
    <TokenInputPrimitive
      data-token-input=""
      data-placeholder={placeholder}
      className={textArea({ className: input({ className }) })}
      {...props}
    >
      {children ?? ((segment) => <Token>{segment.text}</Token>)}
    </TokenInputPrimitive>
  )
}

// MARK: Token

interface TokenProps extends Omit<TokenPrimitiveProps, "className" | "style"> {
  className?: string
}

/** An inline token within a `TokenInput`. */
function Token({ className, ...props }: TokenProps) {
  const { token } = useStyles()()
  return <TokenPrimitive className={token({ className })} {...props} />
}

// MARK: exports

export type { TokenFieldProps, TokenInputProps, TokenProps }
export { Token, TokenField, TokenInput }
