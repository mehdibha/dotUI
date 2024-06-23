"use client";

import * as React from "react";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { fieldStyles } from "./field";
import { Field, type FieldProps } from "./field";
import { InputWrapper, Input, type inputStyles } from "./input";

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
      variant,
      size,
      placeholder,
      label,
      description,
      errorMessage,
      prefix,
      suffix,
      isLoading,
      loaderPosition = "suffix",
      isRequired,
      necessityIndicator,
      contextualHelp,
      ...props
    },
    ref
  ) => {
    return (
      <TextFieldRoot className={className} isRequired={isRequired} {...props}>
        <Field
          label={label}
          description={description}
          errorMessage={errorMessage}
          isRequired={isRequired}
          necessityIndicator={necessityIndicator}
          contextualHelp={contextualHelp}
        >
          <InputWrapper
            size={size}
            variant={variant}
            prefix={prefix}
            suffix={suffix}
            isLoading={isLoading}
            loaderPosition={loaderPosition}
          >
            <Input ref={ref} placeholder={placeholder} />
          </InputWrapper>
        </Field>
      </TextFieldRoot>
    );
  }
);
TextField.displayName = "TextField";

type TextFieldRootProps = Omit<AriaTextFieldProps, "className"> & {
  className?: string;
};
const TextFieldRoot = React.forwardRef<React.ElementRef<typeof AriaTextField>, TextFieldRootProps>(
  ({ className, ...props }, ref) => {
    const { root } = fieldStyles();
    return <AriaTextField ref={ref} className={root({ className })} {...props} />;
  }
);
TextFieldRoot.displayName = "TextFieldRoot";

export type { TextFieldProps, TextFieldRootProps };
export { TextField, TextFieldRoot };
