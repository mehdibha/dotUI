"use client";

import * as React from "react";
import {
  Token as TokenPrimitive,
  TokenField as TokenFieldPrimitive,
  TokenInput as TokenInputPrimitive,
} from "react-aria-components/TokenField";
import type {
  TokenFieldProps as TokenFieldPrimitiveProps,
  TokenInputProps as TokenInputPrimitiveProps,
  TokenProps as TokenPrimitiveProps,
} from "react-aria-components/TokenField";

import { inputStyles } from "@/components/ui/input";
import { tv } from "tailwind-variants";

const tokenFieldVariants = tv({
  slots: {
    root: "group/token-field flex w-full flex-col gap-1.5",
    input:
      "empty:before:pointer-events-none empty:before:text-fg-muted empty:before:content-[attr(data-placeholder)]",
    token:
      "rounded-sm bg-selected px-0.5 text-fg-on-selected data-selected:bg-selection data-selected:text-fg-on-selection",
  },
});

const { root, input, token } = tokenFieldVariants();

/* -------------------------------------------------------------------------- */

interface TokenFieldProps extends Omit<
  TokenFieldPrimitiveProps,
  "className" | "style"
> {
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
}

/**
 * A token field lets users enter text with inline tokens — mentions, tags, or
 * object references. The field root provides the label and description slots;
 * compose a `TokenInput` for the editable area, and a `Label` before it when
 * you want a visible label.
 */
function TokenField({ className, ...props }: TokenFieldProps) {
  return <TokenFieldPrimitive className={root({ className })} {...props} />;
}

/* -------------------------------------------------------------------------- */

interface TokenInputProps extends Omit<
  TokenInputPrimitiveProps,
  "children" | "className" | "style"
> {
  /** Text shown while the field is empty. */
  placeholder?: string;
  className?: string;
  /**
   * Renders each inline token. @default a `Token` with the segment's text
   */
  children?: TokenInputPrimitiveProps["children"];
}

/**
 * The editable area of a `TokenField`: a content-editable surface that renders
 * the value's text and inline tokens. Tokens render as `Token`s unless a
 * render function is provided.
 */
function TokenInput({
  placeholder,
  className,
  children,
  ...props
}: TokenInputProps) {
  const { textArea } = inputStyles();
  return (
    <TokenInputPrimitive
      data-token-input=""
      data-placeholder={placeholder}
      className={textArea({ className: input({ className }) })}
      {...props}
    >
      {children ?? ((segment) => <Token>{segment.text}</Token>)}
    </TokenInputPrimitive>
  );
}

/* -------------------------------------------------------------------------- */

interface TokenProps extends Omit<TokenPrimitiveProps, "className" | "style"> {
  className?: string;
}

/** An inline token within a `TokenInput`. */
function Token({ className, ...props }: TokenProps) {
  return <TokenPrimitive className={token({ className })} {...props} />;
}

/* -------------------------------------------------------------------------- */

export type { TokenFieldProps, TokenInputProps, TokenProps };
export { Token, TokenField, TokenInput };
