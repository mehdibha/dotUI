"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import {
  Provider,
  composeRenderProps,
  Input as AriaInput,
  Group as AriaGroup,
  FieldErrorContext as AriaFieldErrorContext,
  InputContext as AriaInputContext,
  TextArea as AriaTextArea,
  TextAreaContext as AriaTextAreaContext,
  type TextAreaProps as AriaTextAreaProps,
  type GroupProps as AriaGroupProps,
  type InputProps as AriaInputProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusInput } from "@/lib/utils/styles";

const inputStyles = tv({
  slots: {
    root: [
      focusInput(),
      "inline-flex items-center w-full transition-colors rounded-md overflow-hidden border bg-bg shadow-sm cursor-text",
      "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-bg-disabled",
    ],
    input: [
      "bg-transparent outline-none items-center w-full px-2 h-full text-fg placeholder:text-fg-muted",
      "disabled:cursor-not-allowed disabled:text-fg-disabled",
    ],
    innerVisual: "text-fg-muted shrink-0",
  },
  variants: {
    size: {
      sm: { root: "text-base sm:text-sm [&_svg]:size-4 h-8" },
      md: { root: "text-base sm:text-sm [&_svg]:size-4 h-9" },
      lg: { root: "text-base [&_svg]:size-5 h-10" },
    },
    variant: {
      default: {},
      danger: { root: "border-border-danger focus-within:border-border" },
      success: { root: "border-border-success focus-within:border-border" },
      warning: { root: "border-border-warning focus-within:border-border" },
    },
    multiline: {
      true: { root: "h-auto", input: "min-h-[80px] py-2" },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface TextAreaInputProps extends Omit<AriaTextAreaProps, "className"> {
  className?: string;
}
const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ className, ...props }, ref) => {
    const { input } = inputStyles({ multiline: true });
    return <AriaTextArea ref={ref} className={input({ className })} {...props} />;
  }
);
TextAreaInput.displayName = "TextAreaInput";

interface InputProps extends Omit<AriaInputProps, "className"> {
  className?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { input } = inputStyles();
    return <AriaInput ref={ref} className={input({ className })} {...props} />;
  }
);
Input.displayName = "Input";

interface InputWrapperProps
  extends Omit<AriaGroupProps, "className" | "prefix">,
    VariantProps<typeof inputStyles> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  loading?: boolean;
  loaderPosition?: "prefix" | "suffix";
  className?: string;
}
const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  (
    {
      className,
      size,
      variant,
      loading,
      prefix,
      suffix,
      loaderPosition = "suffix",
      multiline,
      ...props
    },
    ref
  ) => {
    const { isInvalid } = React.useContext(AriaFieldErrorContext);
    const inputProps = React.useContext(AriaInputContext);
    const textAreaProps = React.useContext(AriaTextAreaContext);
    const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const { root } = inputStyles({
      size,
      variant: variant ?? isInvalid ? "danger" : undefined,
      multiline,
    });
    const showPrefixLoading = loading && loaderPosition === "prefix";
    const showSuffixLoading = loading && loaderPosition === "suffix";
    return (
      <Provider
        values={[
          [
            AriaInputContext,
            { ...inputProps, ref: inputRef as React.RefObject<HTMLInputElement> },
          ],
          [
            AriaTextAreaContext,
            { ...textAreaProps, ref: inputRef as React.RefObject<HTMLTextAreaElement> },
          ],
        ]}
      >
        <AriaGroup
          ref={ref}
          role="presentation"
          className={root({ className })}
          {...props}
          onPointerDown={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest("input, button, a")) return;
            const input = inputRef.current;
            if (!input) return;
            requestAnimationFrame(() => {
              input.focus();
            });
          }}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              <InputInnerVisual loading={showPrefixLoading} className="pl-2">
                {prefix}
              </InputInnerVisual>
              {children}
              <InputInnerVisual loading={showSuffixLoading} className="pr-2">
                {suffix}
              </InputInnerVisual>
            </>
          ))}
        </AriaGroup>
      </Provider>
    );
  }
);
InputWrapper.displayName = "InputWrapper";

interface InputInnerVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
}
const InputInnerVisual = React.forwardRef<HTMLSpanElement, InputInnerVisualProps>(
  ({ loading, children, className, ...props }, ref) => {
    const { innerVisual } = inputStyles();
    if (loading) {
      return (
        <span ref={ref} className={className} {...props}>
          <Loader2Icon className="animate-spin" />
        </span>
      );
    }
    if (children) {
      return (
        <span ref={ref} className={innerVisual({ className })} {...props}>
          {children}
        </span>
      );
    }
    return null;
  }
);
InputInnerVisual.displayName = "InputInnerVisual";

export type { InputProps, TextAreaInputProps, InputWrapperProps, InputInnerVisualProps };
export { Input, TextAreaInput, InputWrapper, InputInnerVisual, inputStyles };
