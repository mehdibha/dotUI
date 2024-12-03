"use client";

import * as React from "react";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Field, type FieldProps } from "@/registry/ui/default/core/field";
import {
  InputRoot,
  Input,
  type inputStyles,
} from "@/registry/ui/default/core/input";

const textFieldStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

type TextFieldProps = TextFieldRootProps &
  Omit<FieldProps, "children"> &
  VariantProps<typeof inputStyles> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    isLoading?: boolean;
    loaderPosition?: "prefix" | "suffix";
    placeholder?: string;
  };
const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      size,
      placeholder,
      label,
      description,
      errorMessage,
      prefix,
      suffix,
      isLoading,
      loaderPosition = "suffix",
      necessityIndicator,
      contextualHelp,
      ...props
    },
    ref
  ) => {
    return (
      <TextFieldRoot className={className} {...props}>
        {({ isRequired }) => (
          <Field
            label={label}
            description={description}
            errorMessage={errorMessage}
            isRequired={isRequired}
            necessityIndicator={necessityIndicator}
            contextualHelp={contextualHelp}
          >
            <InputRoot
              size={size}
              prefix={prefix}
              suffix={suffix}
              isLoading={isLoading}
              loaderPosition={loaderPosition}
            >
              <Input ref={ref} placeholder={placeholder} />
            </InputRoot>
          </Field>
        )}
      </TextFieldRoot>
    );
  }
);
TextField.displayName = "TextField";

type TextFieldRootProps = Omit<AriaTextFieldProps, "className"> & {
  className?: string;
};
const TextFieldRoot = React.forwardRef<
  React.ElementRef<typeof AriaTextField>,
  TextFieldRootProps
>(({ className, ...props }, ref) => {
  return (
    <AriaTextField
      ref={ref}
      className={textFieldStyles({ className })}
      {...props}
    />
  );
});
TextFieldRoot.displayName = "TextFieldRoot";

export type { TextFieldProps, TextFieldRootProps };
export { TextField, TextFieldRoot };
