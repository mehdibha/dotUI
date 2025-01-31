"use client";

import * as React from "react";
import { mergeRefs, chain, mergeProps } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import {
  Provider,
  composeRenderProps,
  Input as AriaInput,
  Group as AriaGroup,
  TextArea as AriaTextArea,
  InputContext as AriaInputContext,
  TextAreaContext as AriaTextAreaContext,
  useContextProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusInput } from "@/registry/lib/focus-styles";

const inputStyles = tv({
  slots: {
    root: [
      focusInput(),
      "border-border-field bg-bg text-fg-muted shadow-xs inline-flex w-full min-w-fit cursor-text items-center justify-start gap-2 rounded-md border px-2 text-base transition-colors sm:text-sm [&_svg]:size-4",
      "has-[input[data-disabled]]:border-border-disabled has-[input[data-disabled]]:bg-bg-disabled has-[input[data-disabled]]:text-fg-disabled has-[input[data-disabled]]:cursor-default",
      "has-[input[data-invalid]]:border-border-danger focus-within:has-[input[data-invalid]]:border-border",
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

const { root, input } = inputStyles();

interface InputProps extends React.ComponentProps<typeof AriaInput> {}
const Input = (props: InputProps) => {
  return (
    <AriaInput
      className={composeRenderProps(props.className, (className) =>
        input({ className })
      )}
      {...props}
    />
  );
};

interface TextAreaInputProps
  extends React.ComponentProps<typeof AriaTextArea> {}
const TextAreaInput = ({
  ref,
  className,
  onChange,
  ...props
}: TextAreaInputProps) => {
  const [inputValue, setInputValue] = useControlledState(
    props.value,
    props.defaultValue ?? "",
    () => {}
  );
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const onHeightChange = React.useCallback(() => {
    if (!inputRef.current) return;
    const input = inputRef.current;
    const prevAlignment = input.style.alignSelf;
    const prevOverflow = input.style.overflow;
    const isFirefox = "MozAppearance" in input.style;
    if (!isFirefox) {
      input.style.overflow = "hidden";
    }
    input.style.alignSelf = "start";
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;
    input.style.overflow = prevOverflow;
    input.style.alignSelf = prevAlignment;
  }, [inputRef]);

  React.useLayoutEffect(() => {
    if (inputRef.current) {
      onHeightChange();
    }
  }, [onHeightChange, inputValue, inputRef]);

  return (
    <AriaTextArea
      ref={mergeRefs(inputRef, ref)}
      className={composeRenderProps(className, (className) =>
        input({ multiline: true, className })
      )}
      onChange={chain(onChange, setInputValue)}
      {...props}
    />
  );
};

interface InputRootProps
  extends Omit<React.ComponentProps<typeof AriaGroup>, "prefix">,
    VariantProps<typeof inputStyles> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}
const InputRoot = ({
  children,
  className,
  prefix,
  suffix,
  size,
  multiline,
  ...props
}: InputRootProps) => {
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [inputContextProps, mergedInputRef] = useContextProps(
    {},
    inputRef as React.RefObject<HTMLInputElement>,
    AriaInputContext
  );
  const [textAreaContextProps, mergedTextAreaRef] = useContextProps(
    {},
    inputRef as React.RefObject<HTMLTextAreaElement>,
    AriaTextAreaContext
  );
  const inputProps = { ...inputContextProps, ref: mergedInputRef };
  const textAreaProps = { ...textAreaContextProps, ref: mergedTextAreaRef };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, button, a")) return;
    const input = inputRef.current;
    if (!input) return;
    requestAnimationFrame(() => {
      input.focus();
    });
  };

  return (
    <AriaGroup
      role="presentation"
      className={composeRenderProps(className, (className) =>
        root({ size, multiline, className })
      )}
      {...mergeProps(props, { onPointerDown })}
    >
      {composeRenderProps(children, (children) => (
        <Provider
          values={[
            [AriaInputContext, inputProps],
            [AriaTextAreaContext, textAreaProps],
          ]}
        >
          {prefix}
          {children}
          {suffix}
        </Provider>
      ))}
    </AriaGroup>
  );
};

export type { InputProps, TextAreaInputProps, InputRootProps };
export { Input, TextAreaInput, InputRoot, inputStyles };
