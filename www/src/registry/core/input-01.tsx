"use client";

import * as React from "react";
import { mergeRefs, chain } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import {
  Provider,
  composeRenderProps,
  Input as AriaInput,
  Group as AriaGroup,
  TextArea as AriaTextArea,
  InputContext as AriaInputContext,
  TextAreaContext as AriaTextAreaContext,
  type TextAreaProps as AriaTextAreaProps,
  type GroupProps as AriaGroupProps,
  type InputProps as AriaInputProps,
  useSlottedContext,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusInput } from "@/registry/lib/focus-styles";
import { LoaderIcon } from "@/__icons__";

const inputStyles = tv({
  slots: {
    root: [
      focusInput(),
      "border-border-field bg-bg text-fg-muted shadow-xs inline-flex w-full cursor-text items-center justify-start gap-2 rounded-md border px-2 text-base transition-colors sm:text-sm [&_svg]:size-4",
      "disabled:border-border-disabled disabled:bg-bg-disabled disabled:text-fg-disabled disabled:cursor-default",
      "invalid:border-border-danger focus-within:invalid:border-border",
    ],
    input: [
      "text-fg placeholder:text-fg-muted disabled:text-fg-disabled outline-hidden h-full w-full bg-transparent disabled:cursor-default",
    ],
  },
  variants: {
    size: {
      sm: { root: "h-8" },
      md: { root: "h-9" },
      lg: { root: "h-10" },
    },
    multiline: {
      true: {
        root: "h-auto flex-col items-stretch p-2",
        input: "min-h-14 resize-none overflow-auto",
      },
      false: {
        input: "flex-1",
      },
    },
  },
  defaultVariants: {
    size: "md",
    multiline: false,
  },
});

interface TextAreaInputProps extends Omit<AriaTextAreaProps, "className"> {
  className?: string;
}
const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ className, onChange, rows = 1, ...props }, forwardedRef) => {
    const { input } = inputStyles({ multiline: true });
    const [inputValue, setInputValue] = useControlledState(
      props.value,
      props.defaultValue ?? "",
      () => {
        // Do nothing
      }
    );
    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    const onHeightChange = React.useCallback(() => {
      if (inputRef.current) {
        const input = inputRef.current;
        const prevAlignment = input.style.alignSelf;
        const prevOverflow = input.style.overflow;
        const isFirefox = "MozAppearance" in input.style;
        if (!isFirefox) {
          input.style.overflow = "hidden";
        }
        input.style.alignSelf = "start";
        input.style.height = "auto";
        input.style.height = `${
          input.scrollHeight + (input.offsetHeight - input.clientHeight)
        }px`;
        input.style.overflow = prevOverflow;
        input.style.alignSelf = prevAlignment;
      }
    }, [inputRef]);

    React.useLayoutEffect(() => {
      if (inputRef.current) {
        onHeightChange();
      }
    }, [onHeightChange, inputValue, inputRef]);

    return (
      <AriaTextArea
        ref={mergeRefs(inputRef, forwardedRef)}
        className={input({ className })}
        onChange={chain(onChange, setInputValue)}
        rows={rows}
        {...props}
      />
    );
  }
);
TextAreaInput.displayName = "TextAreaInput";

interface InputProps
  extends Omit<AriaInputProps, "className" | "size" | "prefix"> {
  className?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { input } = inputStyles();
    return <AriaInput ref={ref} className={input({ className })} {...props} />;
  }
);
Input.displayName = "Input";

interface InputRootProps
  extends Omit<AriaGroupProps, "className" | "prefix">,
    VariantProps<typeof inputStyles> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  isLoading?: boolean;
  loaderPosition?: "prefix" | "suffix";
  className?: string;
}
const InputRoot = ({
  className,
  prefix,
  suffix,
  isLoading,
  loaderPosition,
  size,
  multiline,
  ...props
}: InputRootProps) => {
  const { root } = inputStyles({ size, multiline });
  const inputContext = useSlottedContext(AriaInputContext);
  const textAreaContext = useSlottedContext(AriaTextAreaContext);
  const inputRef = React.useRef(null);
  const isDisabled =
    props.isDisabled || inputContext?.disabled || textAreaContext?.disabled;
  const isInvalid =
    props.isInvalid ||
    (!!inputContext?.["aria-invalid"] &&
      inputContext["aria-invalid"] !== "false") ||
    (!!textAreaContext?.["aria-invalid"] &&
      textAreaContext["aria-invalid"] !== "false");

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, button, a")) return;
    const input = (
      inputRef as React.RefObject<HTMLInputElement | HTMLTextAreaElement>
    ).current;
    if (!input) return;
    requestAnimationFrame(() => {
      input.focus();
    });
  };

  return (
    <AriaGroup
      role="presentation"
      {...props}
      onPointerDown={handlePointerDown}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      className={root({ className })}
    >
      {composeRenderProps(props.children, (children) => (
        <Provider
          values={[
            [
              AriaInputContext,
              {
                ...inputContext,
                ref: mergeRefs(inputRef, inputContext?.ref ?? null),
              },
            ],
            [
              AriaTextAreaContext,
              {
                ...textAreaContext,
                ref: mergeRefs(inputRef, textAreaContext?.ref ?? null),
              },
            ],
          ]}
        >
          {isLoading && loaderPosition === "prefix" ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            prefix
          )}
          {children}
          {isLoading && loaderPosition === "suffix" ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            suffix
          )}
        </Provider>
      ))}
    </AriaGroup>
  );
};

export type { InputProps, InputRootProps, TextAreaInputProps };
export { Input, TextAreaInput, InputRoot, inputStyles };
