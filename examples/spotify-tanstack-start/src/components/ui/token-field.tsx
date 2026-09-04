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
import { tv, type VariantProps } from "tailwind-variants";
const tokenFieldVariants = tv({
  slots: {
    root: "group/token-field flex w-full flex-col gap-1.5",
    input: [
      "min-h-16 w-full rounded-md border border-border-control bg-field px-2.5 py-2 text-base outline-none sm:text-sm",
      "transition-[box-shadow,border-color,color]",
      "focus:border-border-focus focus:ring-2 focus:ring-border-focus-muted",
      "data-disabled:cursor-disabled data-disabled:border-border data-disabled:bg-disabled data-disabled:text-fg-disabled",
      "empty:before:pointer-events-none empty:before:text-fg-muted empty:before:content-[attr(data-placeholder)]",
    ],
    token: [
      "rounded-md bg-accent-muted px-0.5 text-fg-accent",
      "data-selected:bg-accent data-selected:text-fg-on-accent",
    ],
  },
});

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
  const { root } = tokenFieldVariants();
  return <TokenFieldPrimitive className={root({ className })} {...props} />;
}

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
  const { input } = tokenFieldVariants();
  return (
    <TokenInputPrimitive
      data-token-input=""
      data-placeholder={placeholder}
      className={input({ className })}
      {...props}
    >
      {children ?? ((segment) => <Token>{segment.text}</Token>)}
    </TokenInputPrimitive>
  );
}

interface TokenProps extends Omit<TokenPrimitiveProps, "className" | "style"> {
  className?: string;
}

/** An inline token within a `TokenInput`. */
function Token({ className, ...props }: TokenProps) {
  const { token } = tokenFieldVariants();
  return <TokenPrimitive className={token({ className })} {...props} />;
}

export type { TokenFieldProps, TokenInputProps, TokenProps };
export { Token, TokenField, TokenInput };
