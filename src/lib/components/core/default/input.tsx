"use client";

import * as React from "react";
import { useControlledState } from "@react-stately/utils";
import { Loader2Icon } from "lucide-react";
import { chain } from "react-aria";
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
import { focusInput } from "@/lib/utils/styles";

const inputStyles = tv({
  slots: {
    root: [
      focusInput(),
      "inline-flex items-center transition-colors w-full rounded-md overflow-hidden border bg-bg shadow-sm cursor-text",
      "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-bg-disabled",
    ],
    input: [
      "bg-transparent outline-none w-full flex-1 px-2 h-full text-fg placeholder:text-fg-muted",
      "disabled:cursor-not-allowed disabled:text-fg-disabled",
    ],
    innerVisual:
      "text-fg-muted disabled:text-fg-disabled shrink-0 flex items-center justify-center",
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
      true: {
        root: "h-auto flex-col items-stretch p-2",
        input: "min-h-14 resize-none overflow-auto px-0",
        innerVisual: "data-[side=start]:pb-2 data-[side=end]:pt-2",
      },
      false: {
        innerVisual: "data-[side=start]:pl-2 data-[side=end]:pr-2",
      },
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
  ({ className, onChange, rows = 1, ...props }, ref) => {
    console.log(ref); // TODO MERGE
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
        input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;
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
        ref={inputRef}
        className={input({ className })}
        onChange={chain(onChange, setInputValue)}
        rows={rows}
        {...props}
      />
    );
  }
);
TextAreaInput.displayName = "TextAreaInput";

interface InputProps extends Omit<AriaInputProps, "className"> {
  className?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const { input } = inputStyles();
  return <AriaInput ref={ref} className={input({ className })} {...props} />;
});
Input.displayName = "Input";

interface InputWrapperProps
  extends Omit<AriaGroupProps, "className" | "prefix">,
    VariantProps<typeof inputStyles> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  isLoading?: boolean;
  loaderPosition?: "prefix" | "suffix";
  className?: string;
}
const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  (
    {
      className,
      size,
      // variant, // TODO REMOVE VARIANT
      isLoading,
      prefix,
      suffix,
      loaderPosition = "suffix",
      multiline = false,
      ...props
    },
    ref
  ) => {
    // const { isInvalid } = React.useContext(AriaFieldErrorContext);
    const inputProps = useSlottedContext(AriaInputContext);
    const textAreaProps = useSlottedContext(AriaTextAreaContext);
    const localRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const inputRef = inputProps?.ref ?? textAreaProps?.ref ?? localRef; // TODO Fix this with mergeRefs
    const { root } = inputStyles({
      size,
      // variant: variant ?? (isInvalid ? "danger" : undefined),
      multiline,
    });
    const showPrefixLoading = isLoading && loaderPosition === "prefix";
    const showSuffixLoading = isLoading && loaderPosition === "suffix";
    return (
      <Provider
        values={[
          [AriaInputContext, { ...inputProps, ref: inputRef as React.RefObject<HTMLInputElement> }],
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
            // @ts-expect-error WILL FIX IT SOON
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const input = inputRef.current; // TODO: Mergeprops correctly here
            if (!input) return;
            requestAnimationFrame(() => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              input.focus();
            });
          }}
        >
          {composeRenderProps(props.children, (children) => (
            <>
              <InputInnerVisual side="start" loading={showPrefixLoading} multiline={multiline}>
                {prefix}
              </InputInnerVisual>
              {children}
              <InputInnerVisual side="end" loading={showSuffixLoading} multiline={multiline}>
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
  side: "start" | "end";
  multiline?: boolean;
  loading?: boolean;
}
const InputInnerVisual = React.forwardRef<HTMLSpanElement, InputInnerVisualProps>(
  ({ loading, children, className, multiline, side, ...props }, ref) => {
    const { innerVisual } = inputStyles({ multiline });
    const inputContext = useSlottedContext(AriaInputContext);
    if (!loading && !children) return null;
    return (
      <span
        ref={ref}
        data-rac=""
        data-side={side}
        data-disabled={inputContext?.disabled || undefined}
        className={innerVisual({ className })}
        {...props}
      >
        {loading ? <Loader2Icon className="animate-spin" /> : children}
      </span>
    );
  }
);
InputInnerVisual.displayName = "InputInnerVisual";

export type { InputProps, TextAreaInputProps, InputWrapperProps, InputInnerVisualProps };
export { Input, TextAreaInput, InputWrapper, InputInnerVisual, inputStyles };
