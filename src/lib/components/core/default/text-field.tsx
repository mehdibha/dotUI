"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { useFocusRing } from "react-aria";
import {
  TextField as AriaTextField,
  Input as AriaInput,
  Provider,
  InputContext as AriaInputContext,
  TextFieldContext as AriaTextFieldContext,
  useSlottedContext,
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  type TextFieldProps as AriaTextFieldProps,
  type InputProps as AriaInputProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusInput } from "@/lib/utils/styles";
import { Field, type FieldProps } from "./field";

const textFieldVariants = tv({
  slots: {
    root: "flex flex-col items-start space-y-2",
    innerWrapper: [
      focusInput(),
      "inline-flex items-center w-full transition-colors rounded-md overflow-hidden border bg-bg shadow-sm cursor-text",
      "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-bg-disabled",
    ],
    input: [
      "bg-transparent outline-none items-center w-full px-3 h-full text-fg",
      "disabled:cursor-not-allowed disabled:text-fg-disabled",
    ],
    innerVisual: "text-fg-muted shrink-0",
    loader: "",
  },
  variants: {
    size: {
      sm: { innerWrapper: "text-base sm:text-sm [&_svg]:size-4", input: "h-8" },
      md: { innerWrapper: "text-base sm:text-sm [&_svg]:size-4", input: "h-9" },
      lg: { innerWrapper: "text-base [&_svg]:size-5", input: "h-10" },
    },
    type: {
      default: {},
      danger: { innerWrapper: "outline-2 outline-fg-danger" }, // TODO: CHANGE COLORS
      success: { innerWrapper: "outline-2 outline-fg-success" },
      warning: { innerWrapper: "outline-2 outline-fg-warning" },
    },
  },
  defaultVariants: {
    type: "default",
    size: "md",
  },
});

interface TextFieldInnerVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
}
const TextFieldInnerVisual = React.forwardRef<HTMLSpanElement, TextFieldInnerVisualProps>(
  ({ loading, className, children, ...props }, ref) => {
    const { size, type } = useTextFieldContext();
    const { innerVisual, loader } = textFieldVariants({ size, type });
    if (loading) {
      return (
        <span ref={ref} className={loader({ className })} {...props}>
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
TextFieldInnerVisual.displayName = "TextFieldInnerVisual";

type TextFieldInputProps = Omit<AriaInputProps, "className"> & {
  className?: string;
};
const TextFieldInput = React.forwardRef<
  React.ElementRef<typeof AriaInput>,
  TextFieldInputProps
>(({ className, ...props }, ref) => {
  const { size, type, placeholder } = useTextFieldContext();
  const { input } = textFieldVariants({ size, type });
  return (
    <AriaInput
      {...props}
      ref={ref}
      className={input({ className })}
      placeholder={props.placeholder ?? placeholder}
    />
  );
});
TextFieldInput.displayName = "TextFieldInput";

interface TextFieldInnerWrapperProps extends Omit<AriaGroupProps, "className"> {
  className?: string;
}
const TextFieldInnerWrapper = React.forwardRef<
  HTMLDivElement,
  TextFieldInnerWrapperProps
>(({ className, ...props }, ref) => {
  const { size, type } = useTextFieldContext();
  // const ctx = useSlottedContext(AriaTextFieldContext);
  const inputProps = useSlottedContext(AriaInputContext);

  const { innerWrapper } = textFieldVariants({ size, type });
  // const { isFocusVisible, isFocused, focusProps } = useFocusRing({
  //   autoFocus: ctx?.autoFocus,
  //   isTextInput: true,
  // });
  return (
    <AriaGroup
      ref={ref}
      data-rac=""
      // data-focused={isFocused || undefined}
      // data-focus-visible={isFocusVisible || undefined}
      // data-disabled={inputProps?.disabled || undefined}
      className={innerWrapper({ className, type })}
      {...props}
      // onClick={(e) => {
      //   // TODO FOCUS ON THE INPUT
      // }}
    />
  );
});
TextFieldInnerWrapper.displayName = "TextFieldInnerWrapper";

type TextFieldRootProps = Omit<AriaTextFieldProps, "className" | "children" | "type"> &
  VariantProps<typeof textFieldVariants> & {
    children?: React.ReactNode;
    className?: string;
    htmlType?: AriaInputProps["type"];
    placeholder?: AriaInputProps["placeholder"];
  };
const TextFieldRoot = React.forwardRef<
  React.ElementRef<typeof AriaTextField>,
  TextFieldRootProps
>(({ className, placeholder, htmlType, size, type, children, ...props }, ref) => {
  const { root } = textFieldVariants({ size, type });
  return (
    <Provider values={[[TextFieldContext, { size, type, placeholder }]]}>
      <AriaTextField ref={ref} className={root({ className })} type={htmlType} {...props}>
        {children}
      </AriaTextField>
    </Provider>
  );
});
TextFieldRoot.displayName = "TextFieldRoot";

type TextFieldProps = TextFieldRootProps &
  Omit<FieldProps, "children"> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    loading?: boolean;
    loaderPosition?: "prefix" | "suffix";
  };
const TextField = React.forwardRef<
  React.ElementRef<typeof AriaTextField>,
  TextFieldProps
>(
  (
    {
      className,
      label,
      labelProps,
      description,
      descriptionProps,
      errorMessage,
      fieldErrorProps,
      loading,
      prefix,
      suffix,
      loaderPosition = "suffix",
      ...props
    },
    ref
  ) => {
    const showPrefixLoading = loading && loaderPosition === "prefix";
    const showSuffixLoading = loading && loaderPosition === "suffix";
    return (
      <TextFieldRoot ref={ref} className={className} {...props}>
        <Field
          label={label}
          labelProps={labelProps}
          description={description}
          descriptionProps={descriptionProps}
          errorMessage={errorMessage}
          fieldErrorProps={fieldErrorProps}
        >
          <TextFieldInnerWrapper>
            <TextFieldInnerVisual loading={showPrefixLoading}>
              {prefix}
            </TextFieldInnerVisual>
            <TextFieldInput />
            <TextFieldInnerVisual loading={showSuffixLoading}>
              {suffix}
            </TextFieldInnerVisual>
          </TextFieldInnerWrapper>
        </Field>
      </TextFieldRoot>
    );
  }
);
TextField.displayName = "TextField";

const TextFieldContext = React.createContext<
  VariantProps<typeof textFieldVariants> & { placeholder?: string }
>({});
const useTextFieldContext = () => {
  return React.useContext(TextFieldContext);
};

// const InputWrapperContext = React.createContext<{
//   ref?: React.ElementRef<typeof AriaInput>;
// }>({});

export {
  TextField,
  textFieldVariants,
  TextFieldRoot,
  TextFieldInnerWrapper,
  TextFieldInnerVisual,
  TextFieldContext,
  useTextFieldContext,
};
